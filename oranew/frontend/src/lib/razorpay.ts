/**
 * Razorpay Payment Integration Utilities
 * Handles payment creation, verification, and status checks
 */

import { api } from './api';

export interface PaymentCreateRequest {
  orderId: string;
  amount: number; // Amount in paise (multiply price by 100)
}

export interface PaymentVerifyRequest {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  razorpayOrderId?: string;
  amount?: number;
  currency?: string;
  error?: {
    message: string;
  };
}

export interface PaymentStatusResponse {
  success: boolean;
  status?: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
  payment?: any;
  error?: {
    message: string;
  };
}

/**
 * Create a payment order with Razorpay
 * @param orderId - Your order ID
 * @param amount - Amount in paise (e.g., 5000 for ₹50)
 * @returns Payment response with Razorpay order details
 */
export async function createPayment(
  orderId: string,
  amount: number
): Promise<PaymentResponse> {
  try {
    const response = await api.post<PaymentResponse>('/payments/create', {
      orderId,
      amount,
    });

    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to create payment');
    }

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || 'Failed to create payment',
      },
    };
  }
}

/**
 * Verify payment with Razorpay signature
 * @param paymentData - Payment verification data from Razorpay
 * @returns Verification response
 */
export async function verifyPayment(
  paymentData: PaymentVerifyRequest
): Promise<PaymentResponse> {
  try {
    const response = await api.post<PaymentResponse>('/payments/verify', paymentData);

    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Payment verification failed');
    }

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || 'Payment verification failed',
      },
    };
  }
}

/**
 * Get payment status
 * @param paymentId - Razorpay payment ID
 * @returns Payment status response
 */
export async function getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
  try {
    const response = await api.get<PaymentStatusResponse>(`/payments/status/${paymentId}`);

    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to fetch payment status');
    }

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || 'Failed to fetch payment status',
      },
    };
  }
}

/**
 * Load Razorpay checkout script
 * @returns Promise that resolves when script is loaded
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Open Razorpay checkout modal
 * @param options - Razorpay checkout options
 */
export function openRazorpayCheckout(options: any): void {
  const rzp = new (window as any).Razorpay(options);
  rzp.open();
}

/**
 * Check if Razorpay script is loaded
 */
export function isRazorpayLoaded(): boolean {
  return !!(window as any).Razorpay;
}

/**
 * Format amount to display (paise to rupees)
 * @param paise - Amount in paise
 * @returns Formatted string (e.g., "₹50.00")
 */
export function formatAmount(paise: number): string {
  const rupees = paise / 100;
  return `₹${rupees.toFixed(2)}`;
}

/**
 * Convert rupees to paise
 * @param rupees - Amount in rupees
 * @returns Amount in paise
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Convert paise to rupees
 * @param paise - Amount in paise
 * @returns Amount in rupees
 */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}
