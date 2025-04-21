import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { Buffer } from 'buffer';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract';
import { PaymentService } from './PaymentService';

// Configure TOTP settings
authenticator.options = {
  digits: 6,
  step: 30, // 30 seconds validity
  window: 5, // Allow 5 steps before and after for time drift
};

export interface TOTPSecret {
  id: string;
  secret: string;
  label: string;
  issuer: string;
  createdAt: number;
  expiresAt: number | null; // null means never expires
  tokenId?: string; // NFT token ID if associated with blockchain
  secretHash?: string; // Hash of the secret for on-chain verification
  paymentId?: string; // Payment ID for INR transaction
}

export class BlockchainTOTPService {
  /**
   * Generate a new TOTP secret for a ticket
   * @param ticketId - The ID of the ticket
   * @param eventName - The name of the event
   * @param expiryHours - Optional expiry time in hours
   * @returns TOTPSecret object
   */
  static generateSecret(ticketId: string, eventName: string, expiryHours?: number): TOTPSecret {
    // Generate a random secret using browser's crypto API
    const randomBytes = new Uint8Array(20);
    window.crypto.getRandomValues(randomBytes);
    const secret = Buffer.from(randomBytes).toString('base64');
    const now = Date.now();

    // Create a hash of the secret for on-chain verification
    const secretHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(secret));

    return {
      id: ticketId,
      secret,
      label: `Ticket-${ticketId}`,
      issuer: `TruePass-${eventName}`,
      createdAt: now,
      expiresAt: expiryHours ? now + expiryHours * 60 * 60 * 1000 : null,
      secretHash,
    };
  }

  /**
   * Generate a TOTP token from a secret
   * @param secret - The TOTP secret
   * @returns The current TOTP token
   */
  static generateToken(secret: string): string {
    try {
      const token = authenticator.generate(secret);
      return token;
    } catch (error) {
      console.error('Error generating token:', error);
      throw error;
    }
  }

  /**
   * Normalize a token by removing spaces, dashes, and other non-digit characters
   * @param token - The token to normalize
   * @returns Normalized token with only digits
   */
  private static normalizeToken(token: string): string {
    // Remove all non-digit characters and trim whitespace
    return token.replace(/[^0-9]/g, '').trim();
  }

  /**
   * Verify a TOTP token against a secret
   * @param token - The token to verify
   * @param secret - The TOTP secret
   * @returns Boolean indicating if the token is valid
   */
  static verifyToken(token: string, secret: string): boolean {
    try {
      // Ensure token is properly formatted - remove all non-digit characters
      const cleanToken = this.normalizeToken(token);

      // Check if token is valid length
      if (cleanToken.length !== 6) {
        console.log('Token is not 6 digits:', cleanToken);
        return false;
      }

      // Generate the current token for comparison
      const currentToken = this.generateToken(secret);

      // First try direct comparison (for exact matches)
      if (cleanToken === currentToken) {
        return true;
      }

      // If not an exact match, use the authenticator library's verify method
      // which accounts for time drift within the configured window
      const isValid = authenticator.verify({ token: cleanToken, secret });
      return isValid;
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  }

  /**
   * Generate a QR code for a TOTP secret
   * @param secret - The TOTP secret object
   * @returns Promise resolving to a data URL for the QR code
   */
  static async generateQRCode(secret: TOTPSecret): Promise<string> {
    const otpauth = authenticator.keyuri(secret.label, secret.issuer, secret.secret);

    try {
      return await QRCode.toDataURL(otpauth);
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  }

  /**
   * Save a TOTP secret to local storage
   * @param secret - The TOTP secret to save
   */
  static saveSecret(secret: TOTPSecret): void {
    try {
      const secrets = this.getSecrets();
      secrets.push(secret);
      localStorage.setItem('blockchain_totp_secrets', JSON.stringify(secrets));
    } catch (error) {
      console.error('Error saving TOTP secret:', error);
    }
  }

  /**
   * Get all TOTP secrets from local storage
   * @returns Array of TOTPSecret objects
   */
  static getSecrets(): TOTPSecret[] {
    try {
      const secrets = localStorage.getItem('blockchain_totp_secrets');
      return secrets ? JSON.parse(secrets) : [];
    } catch (error) {
      console.error('Error getting TOTP secrets:', error);
      return [];
    }
  }

  /**
   * Get a specific TOTP secret by ID
   * @param id - The ID of the secret to get
   * @returns The TOTPSecret object or null if not found
   */
  static getSecretById(id: string): TOTPSecret | null {
    try {
      const secrets = this.getSecrets();
      return secrets.find(secret => secret.id === id) || null;
    } catch (error) {
      console.error('Error getting TOTP secret by ID:', error);
      return null;
    }
  }

  /**
   * Delete a TOTP secret by ID
   * @param id - The ID of the secret to delete
   * @returns Boolean indicating if the deletion was successful
   */
  static deleteSecret(id: string): boolean {
    try {
      const secrets = this.getSecrets();
      const filteredSecrets = secrets.filter(secret => secret.id !== id);
      localStorage.setItem('blockchain_totp_secrets', JSON.stringify(filteredSecrets));
      return true;
    } catch (error) {
      console.error('Error deleting TOTP secret:', error);
      return false;
    }
  }

  /**
   * Clear all expired TOTP secrets
   * @returns Number of secrets cleared
   */
  static clearExpiredSecrets(): number {
    try {
      const secrets = this.getSecrets();
      const now = Date.now();
      const validSecrets = secrets.filter(secret => !secret.expiresAt || secret.expiresAt > now);

      const clearedCount = secrets.length - validSecrets.length;

      if (clearedCount > 0) {
        localStorage.setItem('blockchain_totp_secrets', JSON.stringify(validSecrets));
      }

      return clearedCount;
    } catch (error) {
      console.error('Error clearing expired TOTP secrets:', error);
      return 0;
    }
  }

  /**
   * Get the current valid token and time information
   * @param secret - The TOTP secret
   * @returns Object with token and time information
   */
  static getCurrentTokenInfo(secret: string): {
    token: string;
    timeLeft: number;
    timeStep: number;
  } {
    try {
      const token = this.generateToken(secret);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeStep = Math.floor(currentTime / 30);
      const timeLeft = 30 - (currentTime % 30);

      return {
        token,
        timeLeft,
        timeStep,
      };
    } catch (error) {
      console.error('Error getting current token info:', error);
      throw error;
    }
  }

  /**
   * Mint a new ticket NFT with TOTP secret using INR payment
   * @param to - Address to mint the ticket to
   * @param eventName - Name of the event
   * @param seatNumber - Seat number
   * @param eventDate - Date of the event (timestamp)
   * @param secret - TOTP secret object
   * @param paymentId - Payment ID from INR transaction
   * @returns Promise resolving to the transaction receipt
   */
  static async mintTicketWithTOTP(
    to: string,
    eventName: string,
    seatNumber: string,
    eventDate: number,
    secret: TOTPSecret,
    paymentId: string
  ): Promise<ethers.ContractReceipt> {
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed.');

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Store payment ID in the secret
      secret.paymentId = paymentId;

      // Ensure secretHash is available
      if (!secret.secretHash) {
        secret.secretHash = ethers.utils.id(secret.secret); // Generate hash if not available
      }

      // Mint the ticket on blockchain with payment ID
      const tx = await contract.mintTicket(
        to,
        eventName,
        seatNumber,
        eventDate,
        secret.secretHash,
        paymentId
      );

      const receipt = await tx.wait();

      // Update the secret with the token ID
      const event = receipt.events?.find((e: ethers.Event) => e.event === 'TicketMinted');
      if (event && event.args) {
        const tokenId = event.args.tokenId.toString();
        secret.tokenId = tokenId;

        // Update the secret in local storage
        this.updateSecret(secret);
      }

      return receipt;
    } catch (error) {
      console.error('Error minting ticket with TOTP:', error);
      throw error;
    }
  }

  /**
   * Update a TOTP secret in local storage
   * @param updatedSecret - The updated TOTP secret
   * @returns Boolean indicating if the update was successful
   */
  static updateSecret(updatedSecret: TOTPSecret): boolean {
    try {
      const secrets = this.getSecrets();
      const index = secrets.findIndex(s => s.id === updatedSecret.id);

      if (index !== -1) {
        secrets[index] = updatedSecret;
        localStorage.setItem('blockchain_totp_secrets', JSON.stringify(secrets));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error updating TOTP secret:', error);
      return false;
    }
  }

  /**
   * Validate a ticket on the blockchain using TOTP
   * @param tokenId - The token ID of the ticket
   * @param token - The TOTP token
   * @param secret - The TOTP secret
   * @returns Promise resolving to the transaction receipt
   */
  static async validateTicketOnChain(
    tokenId: string,
    token: string,
    secret: string
  ): Promise<ethers.ContractReceipt | null> {
    try {
      // First verify the token locally
      const isValid = this.verifyToken(token, secret);
      if (!isValid) {
        console.error('Token is not valid');
        return null;
      }

      if (!window.ethereum) throw new Error('MetaMask is not installed.');

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Create a hash of the token for on-chain verification
      // This prevents replay attacks
      const otpHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(`${token}-${Date.now()}`));

      // Validate the ticket on blockchain
      const tx = await contract.validateTicket(tokenId, otpHash);
      const receipt = await tx.wait();

      return receipt;
    } catch (error) {
      console.error('Error validating ticket on chain:', error);
      throw error;
    }
  }
}
