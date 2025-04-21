import { v4 as uuidv4 } from 'uuid';

// Define payment status types
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// Define payment interface
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: number;
  updatedAt: number;
  metadata?: Record<string, any>;
}

// Define payment gateway response
export interface PaymentGatewayResponse {
  success: boolean;
  paymentId: string;
  transactionId?: string;
  error?: string;
}

/**
 * Service for handling Indian Rupee payments
 */
export class PaymentService {
  /**
   * Initialize a payment in the system
   * @param amount - Amount in INR
   * @param metadata - Additional metadata for the payment
   * @returns Payment object
   */
  static initializePayment(amount: number, metadata?: Record<string, any>): Payment {
    const now = Date.now();
    return {
      id: `pay_${uuidv4().replace(/-/g, '')}`,
      amount,
      currency: 'INR',
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      metadata
    };
  }

  /**
   * Process a payment through the payment gateway
   * This is a placeholder for the actual payment gateway integration
   * In a real implementation, this would call Razorpay, Cashfree, or another payment gateway API
   * 
   * @param payment - Payment object to process
   * @returns Promise resolving to payment gateway response
   */
  static async processPayment(payment: Payment): Promise<PaymentGatewayResponse> {
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, this would call the payment gateway API
      // For now, we'll simulate a successful payment
      const success = Math.random() > 0.1; // 90% success rate for testing
      
      if (success) {
        return {
          success: true,
          paymentId: payment.id,
          transactionId: `txn_${uuidv4().replace(/-/g, '')}`
        };
      } else {
        return {
          success: false,
          paymentId: payment.id,
          error: 'Payment failed'
        };
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        paymentId: payment.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update payment status in the system
   * @param paymentId - Payment ID
   * @param status - New payment status
   * @returns Updated payment object
   */
  static updatePaymentStatus(payment: Payment, status: PaymentStatus): Payment {
    return {
      ...payment,
      status,
      updatedAt: Date.now()
    };
  }

  /**
   * Format price in Indian Rupee
   * @param amount - Amount in INR
   * @returns Formatted price string
   */
  static formatPrice(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  /**
   * Parse price string to number
   * @param priceString - Price string (e.g., "₹1,000.00")
   * @returns Price as number
   */
  static parsePrice(priceString: string): number {
    // Remove currency symbol and commas
    const cleanedString = priceString.replace(/[₹,]/g, '');
    return parseFloat(cleanedString);
  }
}
