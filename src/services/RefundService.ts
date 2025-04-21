import { PaymentDetails } from './PaymentProcessor';

/**
 * Service for handling refunds
 */
export class RefundService {
  /**
   * Process a refund for a payment
   * @param paymentId - Payment ID to refund
   * @param amount - Amount to refund (defaults to full amount)
   * @param reason - Reason for refund
   * @returns Promise resolving to refund details
   */
  static async processRefund(
    paymentId: string,
    amount?: number,
    reason: string = 'Customer requested refund'
  ): Promise<{
    id: string;
    paymentId: string;
    amount: number;
    status: string;
    timestamp: number;
  }> {
    try {
      console.log(`Processing refund for payment ${paymentId}`);
      
      // Get payment details from local storage
      const payment = this.getPaymentById(paymentId);
      
      if (!payment) {
        throw new Error(`Payment ${paymentId} not found`);
      }
      
      // In a production environment, this would call a payment gateway API
      // For demo purposes, we'll create a mock refund
      
      // Calculate refund amount
      const refundAmount = amount || payment.amount;
      
      // Create refund details
      const refundDetails = {
        id: `refund_${Date.now()}`,
        paymentId,
        amount: refundAmount,
        status: 'COMPLETED',
        timestamp: Date.now()
      };
      
      // Store refund details
      this.storeRefund(refundDetails);
      
      return refundDetails;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }
  
  /**
   * Get payment details by ID
   * @param paymentId - Payment ID
   * @returns Payment details or null if not found
   */
  private static getPaymentById(paymentId: string): PaymentDetails | null {
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
   * Store refund details
   * @param refundDetails - Refund details to store
   */
  private static storeRefund(refundDetails: any): void {
    try {
      // Get existing refunds from local storage
      const refundsJson = localStorage.getItem('refunds');
      const refunds = refundsJson ? JSON.parse(refundsJson) : [];
      
      // Add new refund
      refunds.push(refundDetails);
      
      // Save to local storage
      localStorage.setItem('refunds', JSON.stringify(refunds));
      
      console.log('Refund stored:', refundDetails);
    } catch (error) {
      console.error('Error storing refund:', error);
    }
  }
  
  /**
   * Get all refunds
   * @returns Array of refund details
   */
  static getAllRefunds(): any[] {
    try {
      // Get refunds from local storage
      const refundsJson = localStorage.getItem('refunds');
      return refundsJson ? JSON.parse(refundsJson) : [];
    } catch (error) {
      console.error('Error getting refunds:', error);
      return [];
    }
  }
  
  /**
   * Get refund details by ID
   * @param refundId - Refund ID
   * @returns Refund details or null if not found
   */
  static getRefundById(refundId: string): any | null {
    try {
      // Get refunds from local storage
      const refundsJson = localStorage.getItem('refunds');
      const refunds = refundsJson ? JSON.parse(refundsJson) : [];
      
      // Find refund by ID
      return refunds.find((r: any) => r.id === refundId) || null;
    } catch (error) {
      console.error('Error getting refund:', error);
      return null;
    }
  }
  
  /**
   * Get refunds for a payment
   * @param paymentId - Payment ID
   * @returns Array of refund details
   */
  static getRefundsForPayment(paymentId: string): any[] {
    try {
      // Get refunds from local storage
      const refundsJson = localStorage.getItem('refunds');
      const refunds = refundsJson ? JSON.parse(refundsJson) : [];
      
      // Find refunds for payment
      return refunds.filter((r: any) => r.paymentId === paymentId);
    } catch (error) {
      console.error('Error getting refunds for payment:', error);
      return [];
    }
  }
}
