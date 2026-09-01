/**
 * Development & Demo Fake Payment Service
 * 
 * IMPORTANT:
 * This service simulates payment processing for local development and demonstration.
 * NO real financial gateways (Stripe, Razorpay, etc.) are integrated.
 * NO real credit card or banking information is requested, processed, or stored.
 */

export interface ProcessSimulatedPaymentParams {
  bookingId: string;
  amount: number;
  paymentMethod: string;
  simulatedOutcome?: 'success' | 'failure' | 'cancelled';
}

export interface SimulatedPaymentResult {
  success: boolean;
  status: 'paid' | 'failed' | 'cancelled' | 'cod';
  simulatedTransactionId: string;
  paymentMethodType: string;
  paidAt?: Date;
  message: string;
  isSimulated: true;
}

export const fakePaymentService = {
  /**
   * Process a simulated payment
   */
  processPayment: async (
    params: ProcessSimulatedPaymentParams
  ): Promise<SimulatedPaymentResult> => {
    const { amount, paymentMethod, simulatedOutcome = 'success' } = params;

    // Check if Cash on Delivery / Pay after service completion
    const isCod =
      paymentMethod.toLowerCase().includes('completion') ||
      paymentMethod.toLowerCase().includes('cash') ||
      paymentMethod.toLowerCase().includes('cod');

    if (isCod) {
      return {
        success: true,
        status: 'cod',
        simulatedTransactionId: `SIM_COD_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        paymentMethodType: 'cod',
        message: 'Pay after service completion selected.',
        isSimulated: true,
      };
    }

    // Determine simulated payment method type
    let paymentMethodType = 'simulated_upi';
    if (paymentMethod.toLowerCase().includes('card')) {
      paymentMethodType = 'simulated_card';
    } else if (paymentMethod.toLowerCase().includes('net')) {
      paymentMethodType = 'simulated_netbanking';
    }

    const simulatedTxnId = `SIM_TXN_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Handle intentional simulated test outcomes (for testing failure/cancel resilience)
    if (simulatedOutcome === 'failure') {
      return {
        success: false,
        status: 'failed',
        simulatedTransactionId: simulatedTxnId,
        paymentMethodType,
        message: 'Simulated payment failed: Bank server declined the transaction.',
        isSimulated: true,
      };
    }

    if (simulatedOutcome === 'cancelled') {
      return {
        success: false,
        status: 'cancelled',
        simulatedTransactionId: simulatedTxnId,
        paymentMethodType,
        message: 'Simulated payment cancelled by user.',
        isSimulated: true,
      };
    }

    // Default: Successful simulated payment
    return {
      success: true,
      status: 'paid',
      simulatedTransactionId: simulatedTxnId,
      paymentMethodType,
      paidAt: new Date(),
      message: `Simulated payment of ₹${amount} successful.`,
      isSimulated: true,
    };
  },
};

export default fakePaymentService;
