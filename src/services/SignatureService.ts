import { ethers } from 'ethers';

/**
 * Service for handling signature generation for gasless minting
 * In a production environment, this would be a server-side service
 * For demo purposes, we're implementing it client-side
 */
export class SignatureService {
  // Demo private key - in production, this would be securely stored on the server
  // This is a valid private key for testing purposes only - NEVER use in production
  private static readonly DEMO_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

  /**
   * Generate a signature for gasless minting
   * @param to - Recipient address
   * @param eventName - Event name
   * @param seatNumber - Seat number
   * @param eventDate - Event date timestamp
   * @param secretHash - Hash of TOTP secret
   * @param paymentId - Payment ID from INR transaction
   * @param amountInr - Amount in INR (smallest unit)
   * @returns Promise resolving to signature
   */
  static async generateSignature(
    to: string,
    eventName: string,
    seatNumber: string,
    eventDate: number,
    secretHash: string,
    paymentId: string,
    amountInr: number
  ): Promise<string> {
    try {
      console.log('Generating signature with params:', {
        to,
        eventName,
        seatNumber,
        eventDate,
        secretHash,
        paymentId,
        amountInr
      });

      // Create a wallet from the private key
      const wallet = new ethers.Wallet(this.DEMO_PRIVATE_KEY);
      console.log('Signer address:', wallet.address);

      // Create message hash
      const messageHash = ethers.utils.solidityKeccak256(
        ['address', 'string', 'string', 'uint256', 'string', 'string', 'uint256'],
        [to, eventName, seatNumber, eventDate, secretHash, paymentId, amountInr]
      );
      console.log('Message hash:', messageHash);

      // Convert to Ethereum signed message hash
      const messageHashBytes = ethers.utils.arrayify(messageHash);

      // Sign the message
      const signature = await wallet.signMessage(messageHashBytes);
      console.log('Generated signature:', signature);

      return signature;
    } catch (error) {
      console.error('Error generating signature:', error);
      throw error;
    }
  }

  /**
   * Get the signer address for verification
   * @returns Signer address
   */
  static getSignerAddress(): string {
    const wallet = new ethers.Wallet(this.DEMO_PRIVATE_KEY);
    return wallet.address;
  }
}
