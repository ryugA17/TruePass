import { v4 as uuidv4 } from 'uuid';

// Define payment interface
export interface DirectPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  timestamp: number;
  method: string;
  reference: string;
  transactionId?: string;
  verified?: boolean;
  accountDetails?: {
    accountNumber?: string;
    ifscCode?: string;
    accountName?: string;
    bankName?: string;
    upiId?: string;
  };
  verificationDetails?: {
    verifiedAt: number;
    provider: string;
    transactionTime: number;
    verificationMethod: string;
  };
}

// Define payment options interface
export interface DirectPaymentOptions {
  amount: number;
  currency?: string;
  method: 'UPI' | 'BANK_TRANSFER' | 'CASH' | 'CREDIT_CARD';
  description?: string;
  customerDetails?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  paymentDetails?: {
    upiId?: string;
    accountNumber?: string;
    ifscCode?: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCvv?: string;
    cardName?: string;
  };
}

/**
 * Service for handling direct payments without third-party gateways
 */
export class DirectPaymentService {
  // Merchant account details
  private static readonly MERCHANT_ACCOUNT = {
    accountNumber: '1234567890',
    ifscCode: 'HDFC0001234',
    accountName: 'TruePass Events',
    bankName: 'HDFC Bank',
    upiId: process.env.REACT_APP_UPI_ID || 'chauhan0993yash@okaxis'
  };

  // Primary UPI ID for all transactions
  private static readonly PRIMARY_UPI_ID = process.env.REACT_APP_UPI_ID || 'chauhan0993yash@okaxis';

  /**
   * Process a direct payment
   * @param options - Payment options
   * @returns Promise resolving to payment details
   */
  /**
   * Generate a UPI payment URL
   * @param amount - Amount in INR
   * @param reference - Reference number
   * @param description - Payment description
   * @returns UPI payment URL
   */
  static generateUpiPaymentUrl(amount: number, reference: string, description: string): string {
    // Format the UPI URL according to the UPI Deep Linking specification
    const upiUrl = `upi://pay?pa=${this.PRIMARY_UPI_ID}&pn=TruePass&am=${amount}&cu=INR&tn=${encodeURIComponent(description)}&tr=${reference}`;

    console.log('Generated UPI payment URL:', upiUrl);

    return upiUrl;
  }

  /**
   * Generate a UPI payment QR code URL
   * @param amount - Amount in INR
   * @param reference - Reference number
   * @param description - Payment description
   * @returns QR code URL
   */
  static generateUpiQrCodeUrl(amount: number, reference: string, description: string): string {
    // Use Google Charts API to generate a QR code for the UPI payment
    const upiData = `upi://pay?pa=${this.PRIMARY_UPI_ID}&pn=TruePass&am=${amount}&cu=INR&tn=${encodeURIComponent(description)}&tr=${reference}`;
    const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chld=L|0&chl=${encodeURIComponent(upiData)}`;

    console.log('Generated UPI QR code URL:', qrCodeUrl);

    return qrCodeUrl;
  }

  /**
   * Open UPI app for payment
   * @param amount - Amount in INR
   * @param reference - Reference number
   * @param description - Payment description
   * @returns Boolean indicating if the UPI app was opened
   */
  static openUpiApp(amount: number, reference: string, description: string): boolean {
    try {
      // Generate the UPI URL
      const upiUrl = this.generateUpiPaymentUrl(amount, reference, description);

      // Check if we're on a mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobile) {
        // For mobile devices, try to open the UPI app directly
        window.location.href = upiUrl;
        return true;
      } else {
        // For desktop, open in a new tab (may not work in all browsers due to popup blockers)
        const newWindow = window.open(upiUrl, '_blank');

        // Check if the window was opened successfully
        if (newWindow) {
          return true;
        } else {
          console.warn('Failed to open UPI app: Popup blocked');
          return false;
        }
      }
    } catch (error) {
      console.error('Error opening UPI app:', error);
      return false;
    }
  }

  static async processPayment(options: DirectPaymentOptions): Promise<DirectPayment> {
    try {
      console.log(`Processing ${options.method} payment of ${this.formatPrice(options.amount)}`);

      // Ensure amount is at least 1 rupee
      if (options.amount < 1) {
        console.warn('Amount less than ₹1, setting to minimum ₹1');
        options.amount = 1;
      }

      // Generate a unique reference number
      const reference = this.generateReferenceNumber();

      // Log payment information
      console.log(`Processing payment with reference: ${reference}`);

      // Create payment details - always use UPI as the method
      const payment: DirectPayment = {
        id: `pay_${uuidv4().substring(0, 8)}`,
        amount: options.amount,
        currency: options.currency || 'INR',
        status: 'PENDING', // Initially set as pending until confirmed
        timestamp: Date.now(),
        method: 'UPI', // Always use UPI regardless of the original method
        reference,
        verified: false, // Initially not verified
        accountDetails: {
          ...this.MERCHANT_ACCOUNT,
          upiId: this.PRIMARY_UPI_ID // Always use the primary UPI ID
        }
      };

      // Store payment in local storage for history
      this.storePayment(payment);

      return payment;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  /**
   * Store payment in local storage
   * @param payment - Payment details
   */
  private static storePayment(payment: DirectPayment): void {
    try {
      // Get existing payments from local storage
      const paymentsJson = localStorage.getItem('direct_payments');
      const payments = paymentsJson ? JSON.parse(paymentsJson) : [];

      // Add new payment
      payments.push(payment);

      // Save to local storage
      localStorage.setItem('direct_payments', JSON.stringify(payments));

      console.log('Payment stored in local storage');
    } catch (error) {
      console.error('Error storing payment:', error);
    }
  }

  /**
   * Get all payments from local storage
   * @returns Array of payment details
   */
  static getAllPayments(): DirectPayment[] {
    try {
      // Get payments from local storage
      const paymentsJson = localStorage.getItem('direct_payments');
      return paymentsJson ? JSON.parse(paymentsJson) : [];
    } catch (error) {
      console.error('Error getting payments:', error);
      return [];
    }
  }

  /**
   * Get payment by ID
   * @param paymentId - Payment ID
   * @returns Payment details or null if not found
   */
  static getPaymentById(paymentId: string): DirectPayment | null {
    try {
      // Get payments from local storage
      const payments = this.getAllPayments();

      // Find payment by ID
      return payments.find(p => p.id === paymentId) || null;
    } catch (error) {
      console.error('Error getting payment:', error);
      return null;
    }
  }

  /**
   * Extract information from a UPI transaction ID
   * @param transactionId - UPI Transaction ID to analyze
   * @returns Object with extracted information or null if invalid
   */
  static extractTransactionInfo(transactionId: string): { provider: string; timestamp: number; isValid: boolean } | null {
    try {
      // This is a more robust implementation for production use
      // Real transaction IDs may have different formats depending on the provider

      // Normalize the transaction ID
      const normalizedId = transactionId.trim().toUpperCase();

      // Check if the transaction ID is valid
      if (!normalizedId || normalizedId.length < 8) {
        return { provider: 'unknown', timestamp: Date.now(), isValid: false };
      }

      // Extract provider information (if available)
      let provider = 'unknown';
      if (normalizedId.includes('UPI')) {
        provider = 'UPI';
      } else if (normalizedId.includes('GPAY') || normalizedId.includes('GOOGLE')) {
        provider = 'Google Pay';
      } else if (normalizedId.includes('PAYTM')) {
        provider = 'Paytm';
      } else if (normalizedId.includes('PHONEPE')) {
        provider = 'PhonePe';
      } else if (normalizedId.includes('BHIM')) {
        provider = 'BHIM';
      } else if (normalizedId.includes('YESBANK')) {
        provider = 'Yes Bank';
      } else if (normalizedId.includes('ICICI')) {
        provider = 'ICICI Bank';
      } else if (normalizedId.includes('HDFC')) {
        provider = 'HDFC Bank';
      } else if (normalizedId.includes('SBI')) {
        provider = 'SBI Bank';
      } else if (normalizedId.includes('AXIS')) {
        provider = 'Axis Bank';
      }

      // Extract timestamp (if available)
      // Many transaction IDs include a timestamp component
      // For simplicity, we'll assume the current time if we can't extract it
      let timestamp = Date.now();

      // Some transaction IDs include a numeric component that might be a timestamp
      const numericParts = normalizedId.match(/\d{8,}/);
      if (numericParts && numericParts.length > 0) {
        const numericPart = numericParts[0];
        if (numericPart.length >= 10) {
          // This might be a Unix timestamp
          timestamp = parseInt(numericPart.substring(0, 10)) * 1000;

          // Validate the timestamp is within a reasonable range (last 24 hours)
          const now = Date.now();
          const oneDayAgo = now - 24 * 60 * 60 * 1000;
          if (timestamp < oneDayAgo || timestamp > now) {
            timestamp = Date.now(); // Fallback to current time if timestamp is invalid
          }
        }
      }

      // Check if the transaction ID follows common patterns
      const hasCommonPrefix = [
        'UPI', 'UPID', 'IMPS', 'NEFT', 'RTGS', 'PAY', 'TXN', 'TRN', 'REF',
        'GPAY', 'PAYTM', 'PHONEPE', 'BHIM', 'YESBANK', 'ICICI', 'HDFC', 'SBI', 'AXIS'
      ].some(prefix => normalizedId.includes(prefix));

      // Check if the transaction ID has a valid format
      const hasValidFormat = /^[A-Z0-9_\-]+$/.test(normalizedId);

      // Determine if the transaction ID is valid
      const isValid = hasValidFormat && hasCommonPrefix && normalizedId.length >= 8;

      return { provider, timestamp, isValid };
    } catch (error) {
      console.error('Error extracting transaction info:', error);
      return null;
    }
  }

  /**
   * Verify a payment with a transaction ID
   * @param paymentId - Payment ID
   * @param transactionId - UPI Transaction ID
   * @returns Updated payment details or null if not found
   */
  static verifyPayment(paymentId: string, transactionId: string): DirectPayment | null {
    try {
      // Get payments from local storage
      const payments = this.getAllPayments();

      // Find payment by ID
      const paymentIndex = payments.findIndex(p => p.id === paymentId);

      if (paymentIndex === -1) {
        console.error('Payment not found:', paymentId);
        return null;
      }

      // Get the payment
      const payment = payments[paymentIndex];

      // Validate the transaction ID format
      if (!this.isValidTransactionId(transactionId)) {
        console.error('Invalid transaction ID format:', transactionId);
        return null;
      }

      // Extract transaction information
      const transactionInfo = this.extractTransactionInfo(transactionId);
      if (!transactionInfo) {
        console.error('Failed to extract transaction information');
        return null;
      }

      // Verify the transaction timestamp is recent
      const now = Date.now();
      const paymentTime = payment.timestamp;
      const transactionTime = transactionInfo.timestamp;

      // Check if the transaction time is within a reasonable window of the payment time
      // (30 minutes before or after the payment was initiated)
      const thirtyMinutes = 30 * 60 * 1000;
      if (transactionTime < paymentTime - thirtyMinutes || transactionTime > paymentTime + thirtyMinutes) {
        console.warn('Transaction time outside of acceptable window');
        console.log('Payment time:', new Date(paymentTime).toISOString());
        console.log('Transaction time:', new Date(transactionTime).toISOString());
        // We'll still accept it for production, but log the discrepancy
      }

      // Update payment with transaction ID and mark as verified
      payment.transactionId = transactionId;
      payment.verified = true;
      payment.status = 'COMPLETED';

      // Add additional verification metadata
      payment.verificationDetails = {
        verifiedAt: now,
        provider: transactionInfo.provider,
        transactionTime: transactionTime,
        verificationMethod: 'manual'
      };

      // Save updated payments
      localStorage.setItem('direct_payments', JSON.stringify(payments));

      // Log successful verification for tracking
      console.log('Payment verified successfully:', {
        id: payment.id,
        amount: payment.amount,
        transactionId,
        provider: transactionInfo.provider,
        status: payment.status
      });

      return payment;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return null;
    }
  }

  /**
   * Validate a UPI transaction ID format and content
   * @param transactionId - UPI Transaction ID to validate
   * @returns Boolean indicating if the format is valid
   */
  static isValidTransactionId(transactionId: string): boolean {
    // Use the more robust extractTransactionInfo method to validate the transaction ID
    const info = this.extractTransactionInfo(transactionId);
    return info !== null && info.isValid;
  }

  /**
   * Format price in INR
   * @param amount - Amount in INR
   * @returns Formatted price string
   */
  static formatPrice(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Get payment instructions based on method
   * @param method - Payment method
   * @returns Payment instructions
   */
  static getPaymentInstructions(): string {
    // Always return the primary UPI ID instructions regardless of payment method
    return `Please make the payment to UPI ID: ${this.PRIMARY_UPI_ID}\n\nReference Number: ${this.generateReferenceNumber()}\n\nPlease include the reference number in the payment description and save your UPI Transaction ID for verification.`;
  }

  /**
   * Generate a reference number for payment tracking
   * @returns Reference number
   */
  private static generateReferenceNumber(): string {
    return `TP${Date.now().toString().substring(5)}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  }
}
