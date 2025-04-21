import { ethers } from 'ethers';
import { BlockchainTOTPService } from './BlockchainTOTPService';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract';
import { DirectPaymentService, DirectPayment } from './DirectPaymentService';
import { RazorpayService, RazorpayPayment } from './RazorpayService';

// Define payment status types
export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED';

// Define payment method types
export type PaymentMethod =
  | 'UPI'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'NET_BANKING'
  | 'WALLET'
  | 'RAZORPAY';

// Define payment details interface
export interface PaymentDetails {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  timestamp: number;
  metadata?: Record<string, any>;
  recipientAddress: string;
  senderAddress?: string;
  transactionHash?: string;
}

/**
 * Service for processing real payments
 */
export class PaymentProcessor {
  // Merchant account address - this is where payments will be sent
  private static readonly MERCHANT_ACCOUNT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

  /**
   * Process a payment using UPI
   * @param amount - Amount to charge in INR
   * @param upiId - UPI ID to charge
   * @param metadata - Additional metadata
   * @returns Promise resolving to payment details
   */
  static async processUpiPayment(
    amount: number,
    buyerUpiId: string,
    metadata?: Record<string, any>
  ): Promise<PaymentDetails> {
    try {
      console.log(`Processing UPI payment of ₹${amount} from ${buyerUpiId}`);

      // Get the recipient UPI ID from metadata or use the default merchant account
      const recipientUpiId = metadata?.recipientUpiId || process.env.REACT_APP_UPI_ID || 'chauhan0993yash@okaxis';

      // Create a description for the payment
      const description = metadata?.eventName
        ? `Ticket for ${metadata.eventName} - ${metadata.referenceNumber || ''}`
        : 'Event Ticket';

      // Use DirectPaymentService to process the payment
      const directPayment = await DirectPaymentService.processPayment({
        amount,
        method: 'UPI',
        description,
        customerDetails: {
          name: metadata?.userName || 'Test User',
          email: metadata?.userEmail || 'test@example.com',
          phone: buyerUpiId.includes('@') ? '' : buyerUpiId
        },
        paymentDetails: {
          upiId: buyerUpiId
        }
      });

      // Create payment details
      const paymentDetails: PaymentDetails = {
        id: directPayment.id,
        amount,
        currency: 'INR',
        status: 'COMPLETED',
        method: 'UPI',
        timestamp: Date.now(),
        metadata: {
          ...metadata,
          payment_id: directPayment.id,
          payment_method: directPayment.method,
          reference: directPayment.reference,
          buyerUpiId,
          recipientUpiId
        },
        recipientAddress: recipientUpiId,
        senderAddress: buyerUpiId
      };

      // Store the payment details
      this.storePayment(paymentDetails);

      return paymentDetails;
    } catch (error) {
      console.error('Error processing UPI payment:', error);
      throw error;
    }
  }

  /**
   * Process a payment using credit/debit card
   * @param amount - Amount to charge in INR
   * @param cardDetails - Card details
   * @param metadata - Additional metadata
   * @returns Promise resolving to payment details
   */
  static async processCardPayment(
    amount: number,
    cardDetails: {
      number: string;
      expiry: string;
      cvv: string;
      name: string;
    },
    metadata?: Record<string, any>
  ): Promise<PaymentDetails> {
    try {
      console.log(`Processing card payment of ₹${amount}`);

      // Use DirectPaymentService to process the payment
      const directPayment = await DirectPaymentService.processPayment({
        amount,
        method: 'CREDIT_CARD',
        description: metadata?.eventName ? `Ticket for ${metadata.eventName}` : 'Event Ticket',
        customerDetails: {
          name: cardDetails.name || 'Test User',
          email: metadata?.userEmail || 'test@example.com',
          phone: metadata?.userPhone || ''
        },
        paymentDetails: {
          cardNumber: cardDetails.number,
          cardExpiry: cardDetails.expiry,
          cardCvv: cardDetails.cvv,
          cardName: cardDetails.name
        }
      });

      // Create payment details
      const paymentDetails: PaymentDetails = {
        id: directPayment.id,
        amount,
        currency: 'INR',
        status: 'COMPLETED',
        method: 'CREDIT_CARD',
        timestamp: Date.now(),
        metadata: {
          ...metadata,
          payment_id: directPayment.id,
          payment_method: directPayment.method,
          reference: directPayment.reference
        },
        recipientAddress: this.MERCHANT_ACCOUNT,
        // Mask card number for security
        senderAddress: `${cardDetails.number.substring(0, 4)}****${cardDetails.number.substring(cardDetails.number.length - 4)}`
      };

      // Store the payment details
      this.storePayment(paymentDetails);

      return paymentDetails;
    } catch (error) {
      console.error('Error processing card payment:', error);
      throw error;
    }
  }

  /**
   * Process a payment using net banking
   * @param amount - Amount to charge in INR
   * @param bankCode - Bank code
   * @param accountId - Account ID or username
   * @param metadata - Additional metadata
   * @returns Promise resolving to payment details
   */
  static async processNetBankingPayment(
    amount: number,
    bankCode: string,
    accountId: string,
    metadata?: Record<string, any>
  ): Promise<PaymentDetails> {
    try {
      console.log(`Processing net banking payment of ₹${amount} from bank ${bankCode}`);

      // Use DirectPaymentService to process the payment
      const directPayment = await DirectPaymentService.processPayment({
        amount,
        method: 'BANK_TRANSFER',
        description: metadata?.eventName ? `Ticket for ${metadata.eventName}` : 'Event Ticket',
        customerDetails: {
          name: metadata?.userName || 'Test User',
          email: metadata?.userEmail || 'test@example.com',
          phone: metadata?.userPhone || ''
        },
        paymentDetails: {
          accountNumber: accountId,
          ifscCode: bankCode
        }
      });

      // Create payment details
      const paymentDetails: PaymentDetails = {
        id: directPayment.id,
        amount,
        currency: 'INR',
        status: 'COMPLETED',
        method: 'NET_BANKING',
        timestamp: Date.now(),
        metadata: {
          ...metadata,
          payment_id: directPayment.id,
          payment_method: directPayment.method,
          reference: directPayment.reference,
          bankCode
        },
        recipientAddress: this.MERCHANT_ACCOUNT,
        senderAddress: `${bankCode}:${accountId}`
      };

      // Store the payment details
      this.storePayment(paymentDetails);

      return paymentDetails;
    } catch (error) {
      console.error('Error processing net banking payment:', error);
      throw error;
    }
  }

  /**
   * Process a payment using Razorpay
   * @param amount - Amount to charge in INR
   * @param metadata - Additional metadata
   * @returns Promise resolving to payment details
   */
  static async processRazorpayPayment(
    amount: number,
    metadata?: Record<string, any>
  ): Promise<PaymentDetails> {
    try {
      console.log(`Processing Razorpay payment of ₹${amount}`);

      // Create a receipt ID with more entropy for production
      const timestamp = Date.now().toString();
      const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      const receiptId = `RCPT${timestamp}${random}`;

      // Add reference number for tracking
      const referenceNumber = metadata?.referenceNumber || `REF${timestamp.substring(timestamp.length - 6)}${random.substring(0, 4)}`;

      // Create notes for the order
      const notes = {
        eventName: metadata?.eventName || 'Event Ticket',
        seatNumber: metadata?.seatNumber || '',
        userEmail: metadata?.userEmail || '',
        referenceNumber,
        userName: metadata?.userName || ''
      };

      // Create a Razorpay order
      const order = await RazorpayService.createOrder(
        amount * 100, // Convert to paise
        receiptId,
        notes
      );

      // Prepare customer information
      const prefill = {
        name: metadata?.userName || undefined,
        email: metadata?.userEmail || undefined,
        contact: metadata?.userPhone || undefined
      };

      // Open Razorpay payment form with production-ready configuration
      const razorpayPayment = await RazorpayService.openPaymentForm({
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag', // Will be overridden by the service
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        name: 'TruePass',
        description: metadata?.eventName ? `Ticket for ${metadata.eventName}` : 'Event Ticket',
        order_id: order.id,
        prefill,
        notes,
        theme: {
          color: '#3f51b5'
        },
        // Add retry configuration for better user experience
        retry: {
          enabled: true,
          max_count: 3
        },
        // Add remember_customer for returning customers
        remember_customer: true
      });

      // Create payment details with enhanced metadata
      const paymentDetails: PaymentDetails = {
        id: razorpayPayment.id,
        amount,
        currency: 'INR',
        status: razorpayPayment.status === 'captured' ? 'COMPLETED' : 'PENDING',
        method: 'RAZORPAY',
        timestamp: razorpayPayment.created_at,
        metadata: {
          ...metadata,
          payment_id: razorpayPayment.id,
          order_id: razorpayPayment.order_id,
          receipt_id: receiptId,
          reference_number: referenceNumber,
          razorpay_payment: razorpayPayment,
          payment_method: razorpayPayment.method || 'razorpay',
          payment_time: new Date(razorpayPayment.created_at).toISOString(),
          customer_email: razorpayPayment.email || metadata?.userEmail || '',
          customer_phone: razorpayPayment.contact || metadata?.userPhone || ''
        },
        recipientAddress: this.MERCHANT_ACCOUNT,
        senderAddress: razorpayPayment.email || ''
      };

      // Store the payment details
      this.storePayment(paymentDetails);

      // Log successful payment for tracking
      console.log('Razorpay payment successful:', {
        id: paymentDetails.id,
        amount: paymentDetails.amount,
        status: paymentDetails.status,
        reference: referenceNumber
      });

      return paymentDetails;
    } catch (error) {
      console.error('Error processing Razorpay payment:', error);
      throw error;
    }
  }

  /**
   * Verify a Razorpay payment
   * @param paymentId - Razorpay payment ID
   * @param orderId - Razorpay order ID
   * @param signature - Razorpay signature
   * @returns Promise resolving to verification result
   */
  static async verifyRazorpayPayment(
    paymentId: string,
    orderId: string,
    signature: string
  ): Promise<boolean> {
    try {
      // Get the payment details before verification
      const payment = this.getPaymentById(paymentId);

      // Verify the payment with Razorpay
      const isVerified = await RazorpayService.verifyPayment(paymentId, orderId, signature);

      if (isVerified && payment) {
        // Update payment status to COMPLETED if verification is successful
        payment.status = 'COMPLETED';
        payment.metadata = {
          ...payment.metadata,
          verified: true,
          verification_time: new Date().toISOString()
        };

        // Save the updated payment
        this.storePayment(payment);

        // Log successful verification
        console.log('Payment verification successful:', {
          id: payment.id,
          amount: payment.amount,
          status: payment.status
        });
      } else {
        console.error('Payment verification failed:', {
          paymentId,
          orderId,
          hasSignature: !!signature,
          paymentFound: !!payment
        });
      }

      return isVerified;
    } catch (error) {
      console.error('Error verifying Razorpay payment:', error);
      return false;
    }
  }

  /**
   * Transfer funds to the contract for ticket minting
   * @param paymentDetails - Payment details
   * @param walletAddress - Wallet address to mint ticket to
   * @returns Promise resolving to transaction hash
   */
  static async transferFundsToContract(
    paymentDetails: PaymentDetails,
    walletAddress: string
  ): Promise<string> {
    try {
      console.log(`Transferring funds to contract for payment ${paymentDetails.id}`);

      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Get provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Get contract instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Convert INR to ETH (simplified conversion for demo)
      // In a real implementation, this would use an exchange rate API
      const ethAmount = ethers.utils.parseEther((paymentDetails.amount / 250000).toFixed(18));

      // Transfer funds to contract
      const tx = await signer.sendTransaction({
        to: CONTRACT_ADDRESS,
        value: ethAmount
      });

      console.log('Transaction sent:', tx.hash);

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      // Update payment details with transaction hash
      paymentDetails.transactionHash = tx.hash;
      this.storePayment(paymentDetails);

      return tx.hash;
    } catch (error) {
      console.error('Error transferring funds to contract:', error);
      throw error;
    }
  }

  /**
   * Store payment details (in a real implementation, this would use a database)
   * @param paymentDetails - Payment details to store
   */
  private static storePayment(paymentDetails: PaymentDetails): void {
    try {
      // Get existing payments from local storage
      const paymentsJson = localStorage.getItem('payments');
      const payments = paymentsJson ? JSON.parse(paymentsJson) : [];

      // Add new payment
      payments.push(paymentDetails);

      // Save to local storage
      localStorage.setItem('payments', JSON.stringify(payments));

      console.log('Payment stored:', paymentDetails);
    } catch (error) {
      console.error('Error storing payment:', error);
    }
  }

  /**
   * Get payment details by ID
   * @param paymentId - Payment ID
   * @returns Payment details or null if not found
   */
  static getPaymentById(paymentId: string): PaymentDetails | null {
    try {
      // Get payments from local storage
      const paymentsJson = localStorage.getItem('payments');
      const payments = paymentsJson ? JSON.parse(paymentsJson) : [];

      // Find payment by ID
      return payments.find((p: PaymentDetails) => p.id === paymentId) || null;
    } catch (error) {
      console.error('Error getting payment:', error);
      return null;
    }
  }

  /**
   * Get all payments
   * @returns Array of payment details
   */
  static getAllPayments(): PaymentDetails[] {
    try {
      // Get payments from local storage
      const paymentsJson = localStorage.getItem('payments');
      return paymentsJson ? JSON.parse(paymentsJson) : [];
    } catch (error) {
      console.error('Error getting payments:', error);
      return [];
    }
  }
}
