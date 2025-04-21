import { v4 as uuidv4 } from 'uuid';

// Define Razorpay payment interface
export interface RazorpayPayment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  email: string;
  contact: string;
  created_at: number;
  captured: boolean;
}

// Define Razorpay order interface
export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

// Define Razorpay options interface
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler?: (response: any) => void;
  modal?: {
    ondismiss?: () => void;
  };
  callbacks?: {
    on_payment_failed?: (response: any) => void;
  };
  retry?: {
    enabled: boolean;
    max_count: number;
  };
  remember_customer?: boolean;
}

/**
 * Service for handling Razorpay payments
 */
export class RazorpayService {
  // Razorpay credentials from environment variables
  private static readonly KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag';
  private static readonly KEY_SECRET = process.env.REACT_APP_RAZORPAY_KEY_SECRET || 'thiswouldbeyoursecretkey';

  // Flag to determine if we're in test mode
  private static readonly IS_TEST_MODE = process.env.REACT_APP_ENV !== 'production';

  // Singleton instance of Razorpay
  private static razorpayInstance: any = null;

  /**
   * Initialize Razorpay SDK
   * This should be called before any other methods
   */
  static async initialize(): Promise<boolean> {
    try {
      // Check if Razorpay is already loaded
      if (typeof window.Razorpay !== 'undefined') {
        console.log('Razorpay already loaded');
        return true;
      }

      // Load Razorpay script
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          console.log('Razorpay loaded successfully');
          resolve(true);
        };
        script.onerror = () => {
          console.error('Failed to load Razorpay');
          resolve(false);
        };
        document.body.appendChild(script);
      });
    } catch (error) {
      console.error('Error initializing Razorpay:', error);
      return false;
    }
  }

  /**
   * Create a new Razorpay order
   * @param amount - Amount in INR (in paise, e.g., ₹100 = 10000)
   * @param receipt - Receipt ID for your reference
   * @param notes - Additional notes for the order
   * @returns Promise resolving to order details
   */
  static async createOrder(
    amount: number,
    receipt: string = uuidv4(),
    notes: Record<string, string> = {}
  ): Promise<RazorpayOrder> {
    try {
      // In a production environment, this should be a server-side API call
      // For security reasons, the order creation should happen on your backend
      // This is a simplified implementation for demonstration purposes

      // In a real implementation, you would make an API call to your server:
      // const response = await fetch('/api/create-razorpay-order', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ amount, receipt, notes })
      // });
      // const data = await response.json();
      // return data.order;

      // For now, we'll simulate the response
      const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      // Simulate order creation
      const order: RazorpayOrder = {
        id: orderId,
        amount: amount,
        currency: 'INR',
        receipt: receipt,
        status: 'created',
        created_at: Date.now()
      };

      // Store order in localStorage for reference
      const orders = this.getAllOrders();
      orders.push(order);
      localStorage.setItem('razorpay_orders', JSON.stringify(orders));

      console.log('Created order:', order);
      return order;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  /**
   * Open Razorpay payment form
   * @param options - Razorpay options
   * @returns Promise resolving to payment details
   */
  static async openPaymentForm(options: RazorpayOptions): Promise<RazorpayPayment> {
    try {
      // Make sure Razorpay is initialized
      const isInitialized = await this.initialize();
      if (!isInitialized) {
        throw new Error('Razorpay not initialized');
      }

      // Return a promise that resolves when payment is completed
      return new Promise((resolve, reject) => {
        // Create Razorpay instance with handlers
        const razorpay = new window.Razorpay({
          ...options,
          key: this.KEY_ID,
          // This handler is called when payment is successful
          handler: function(response: any) {
            console.log('Payment successful:', response);

            // Create payment object from response
            const payment: RazorpayPayment = {
              id: response.razorpay_payment_id,
              order_id: options.order_id,
              amount: options.amount,
              currency: options.currency,
              status: 'captured',
              method: 'razorpay', // Will be updated with actual method later
              email: options.prefill?.email || '',
              contact: options.prefill?.contact || '',
              created_at: Date.now(),
              captured: true
            };

            // Store payment in localStorage
            RazorpayService.storePayment(payment);

            // Resolve the promise with payment details
            resolve(payment);
          },
          // Called when modal is closed without payment
          modal: {
            ondismiss: function() {
              console.log('Checkout form closed');
              reject(new Error('Payment cancelled by user'));
            }
          },
          // Called when there's a payment failure
          callbacks: {
            on_payment_failed: function(response: any) {
              console.error('Payment failed:', response);
              reject(new Error(`Payment failed: ${response.error.description}`));
            }
          }
        });

        // Open Razorpay checkout form
        razorpay.open();
      });
    } catch (error) {
      console.error('Error opening Razorpay payment form:', error);
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
  static async verifyPayment(
    paymentId: string,
    orderId: string,
    signature: string
  ): Promise<boolean> {
    try {
      // In a production environment, this should be a server-side API call
      // For security reasons, the signature verification should happen on your backend
      // This is a simplified implementation for demonstration purposes

      // In a real implementation, you would make an API call to your server:
      // const response = await fetch('/api/verify-razorpay-payment', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ paymentId, orderId, signature })
      // });
      // const data = await response.json();
      // return data.verified;

      // For now, we'll do a basic check
      // Get the payment from localStorage
      const payment = this.getPaymentById(paymentId);

      // Check if payment exists and matches the order ID
      if (!payment || payment.order_id !== orderId) {
        console.error('Payment verification failed: Payment not found or order ID mismatch');
        return false;
      }

      // In a real implementation, you would verify the signature using HMAC SHA256
      // The verification would look something like this on the server:
      // const generatedSignature = crypto
      //   .createHmac('sha256', KEY_SECRET)
      //   .update(orderId + '|' + paymentId)
      //   .digest('hex');
      // return generatedSignature === signature;

      // For demo purposes, we'll assume the signature is valid if it's not empty
      const isValid = !!signature && signature.length > 10;

      if (isValid) {
        // Update payment status
        payment.status = 'verified';

        // Save updated payment
        const payments = this.getAllPayments();
        const paymentIndex = payments.findIndex(p => p.id === paymentId);
        if (paymentIndex !== -1) {
          payments[paymentIndex] = payment;
          localStorage.setItem('razorpay_payments', JSON.stringify(payments));
        }
      }

      return isValid;
    } catch (error) {
      console.error('Error verifying Razorpay payment:', error);
      return false;
    }
  }

  /**
   * Store payment in localStorage
   * @param payment - Payment details
   */
  private static storePayment(payment: RazorpayPayment): void {
    try {
      // Get existing payments from localStorage
      const payments = this.getAllPayments();

      // Add new payment
      payments.push(payment);

      // Save to localStorage
      localStorage.setItem('razorpay_payments', JSON.stringify(payments));
    } catch (error) {
      console.error('Error storing payment:', error);
    }
  }

  /**
   * Get all payments from localStorage
   * @returns Array of payments
   */
  static getAllPayments(): RazorpayPayment[] {
    try {
      const paymentsJson = localStorage.getItem('razorpay_payments');
      return paymentsJson ? JSON.parse(paymentsJson) : [];
    } catch (error) {
      console.error('Error getting payments:', error);
      return [];
    }
  }

  /**
   * Get all orders from localStorage
   * @returns Array of orders
   */
  static getAllOrders(): RazorpayOrder[] {
    try {
      const ordersJson = localStorage.getItem('razorpay_orders');
      return ordersJson ? JSON.parse(ordersJson) : [];
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  }

  /**
   * Get payment by ID
   * @param paymentId - Payment ID
   * @returns Payment details or null if not found
   */
  static getPaymentById(paymentId: string): RazorpayPayment | null {
    try {
      const payments = this.getAllPayments();
      return payments.find(p => p.id === paymentId) || null;
    } catch (error) {
      console.error('Error getting payment:', error);
      return null;
    }
  }

  /**
   * Get order by ID
   * @param orderId - Order ID
   * @returns Order details or null if not found
   */
  static getOrderById(orderId: string): RazorpayOrder | null {
    try {
      const orders = this.getAllOrders();
      return orders.find(o => o.id === orderId) || null;
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  }

  /**
   * Format price in INR
   * @param amount - Amount in paise (e.g., ₹100 = 10000)
   * @returns Formatted price string
   */
  static formatPrice(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount / 100); // Convert paise to rupees
  }
}

// Add Razorpay to Window interface
declare global {
  interface Window {
    Razorpay: any;
  }
}
