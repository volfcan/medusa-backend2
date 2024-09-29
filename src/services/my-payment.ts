import { AbstractPaymentProcessor } from "@medusajs/medusa";
import { PayTRClient } from "paytr-react";

interface PaymentProcessorError {
  error: string;
  code?: string;
  detail?: any;
}
class MyPaymentService extends AbstractPaymentProcessor {
  paytrClient: typeof PayTRClient;
  static identifier = "my-payment"; // add this line

  constructor(options, container) {
    super(container);
    this.paytrClient = new PayTRClient({
      apiKey: "DmMrLCr4b9nHa75X",
      apiSecret: "bBHQ2Dz5ZKc6JWH2",
      merchantId: "494688",
    });
  }

  async refundPayment(
    paymentSession: any,
    amount: number,
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    try {
      const paymentRequest = {
        payment_token: paymentSession.payment_token,
        amount: amount,
        merchant_id: this.merchantId,
        api_key: this.apiKey,
      };

      const response = await axios.post(
        `${this.paytrApiUrl}/refund`,
        paymentRequest,
      );

      // Handle the refund and update the payment session
      return {
        status: "refunded",
      };
    } catch (error) {
      return {
        error: error.message,
        status: "failed",
      };
    }
  }

  async retrievePayment(
    paymentSessionData: Record<string, unknown>,
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    const paymentId = paymentSessionData.id;

    // assuming client is an initialized client
    // communicating with a third-party service.
    return await this.client.retrieve(paymentId);
  }

  async initiatePayment(
    context: PaymentProcessorContext,
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
    // assuming client is an initialized client
    // communicating with a third-party service.
    const clientPayment = await this.client.initiate(context);

    return {
      session_data: {
        id: clientPayment.id,
      },
    };
  }

  async updatePayment(
    context: PaymentProcessorContext,
  ): Promise<void | PaymentProcessorError | PaymentProcessorSessionResponse> {
    // assuming client is an initialized client
    // communicating with a third-party service.
    const paymentId = context.paymentSessionData.id;

    await this.client.update(paymentId, context);

    return {
      session_data: context.paymentSessionData,
    };
  }

  // async authorizePayment(payment) {
  //   // Create a payment token using the PayTR client
  //   const paymentToken = await paytrClient.createToken({
  //     amount: payment.amount,
  //     currency: payment.currency,
  //     paymentType: "credit_card",
  //     // other payment details...
  //   });

  //   // Create a payment authorization using the PayTR client
  //   const authorization = await paytrClient.authorizePayment({
  //     paymentToken: paymentToken.token,
  //     paymentId: payment.id,
  //     amount: payment.amount,
  //   });

  //   // Update the payment status in Medusa
  //   await this.updatePaymentStatus(payment.id, "authorized");
  // }

  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>,
  ): Promise<PaymentSessionStatus> {
    const paymentId = paymentSessionData.id;

    // assuming client is an initialized client
    // communicating with a third-party service.
    return (await this.client.getStatus(paymentId)) as PaymentSessionStatus;
  }

  async initiatePayment(
    context: PaymentProcessorContext,
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
    // assuming client is an initialized client
    // communicating with a third-party service.
    const clientPayment = await this.client.initiate(context);

    return {
      session_data: {
        id: clientPayment.id,
      },
    };
  }

  async deletePayment(
    paymentSessionData: Record<string, unknown>,
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    const paymentId = paymentSessionData.id;
    // assuming client is an initialized client
    // communicating with a third-party service.
    this.client.delete(paymentId);

    return {};
  }

  async cancelPayment(
    paymentSessionData: Record<string, unknown>,
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    const paymentId = paymentSessionData.id;

    // assuming client is an initialized client
    // communicating with a third-party service.
    const cancelData = this.client.cancel(paymentId);

    return {
      id: paymentId,
      ...cancelData,
    };
  }

  async createPayment(payment) {
    const token = await this.paytrClient.getToken({
      amount: payment.amount,
      currency: payment.currency,
      // other payment details...
    });

    // Create a payment token in Medusa
    const paymentToken = await this.manager.createPaymentToken({
      token,
      payment_method: "paytr",
    });

    return paymentToken;
  }

  async capturePayment(payment) {
    const paymentToken = payment.token;
    const amount = payment.amount;

    try {
      const captureResponse = await this.paytrClient.capturePayment({
        paymentToken,
        amount,
      });

      if (captureResponse.success) {
        return {
          id: captureResponse.id,
          amount,
          status: "captured",
        };
      } else {
        throw new Error(`Failed to capture payment: ${captureResponse.error}`);
      }
    } catch (error) {
      throw new Error(`Failed to capture payment: ${error.message}`);
    }
  }
}
export default MyPaymentService;

// import {
//   AbstractPaymentProcessor,
//   PaymentProcessorContext,
//   PaymentProcessorSessionResponse,
//   PaymentProviderService,
// } from "@medusajs/medusa";

// import { PaymentSessionStatus } from "@medusajs/medusa";
// import axios from "axios";
// import PayTRClient from "paytr-react";

// interface PaymentProcessorError {
//   error: string;
//   code?: string;
//   detail?: any;
// }

// class PayTRPaymentProcessor extends AbstractPaymentProcessor {
//   private paymentProviderService: PaymentProviderService;
//   private client: any;
//   static identifier = "my-payment";

//   constructor(
//     container,
//     options,
//     paymentProviderService: PaymentProviderService,
//   ) {
//     super(container);
//     this.paymentProviderService = paymentProviderService;
//     // this.paytrClient = new PayTRClient(options);
//   }

//   private paytrApiUrl = "https://api.paytr.com/v1";
//   private merchantId = "494688";
//   private apiKey = "DmMrLCr4b9nHa75X";

//   async capturePayment(
//     paymentSession: any,
//   ): Promise<Record<string, unknown> | PaymentProcessorError> {
//     try {
//       const paymentRequest = {
//         amount: paymentSession.amount,
//         currency: paymentSession.currency,
//         merchant_id: this.merchantId,
//         api_key: this.apiKey,
//       };

//       const response = await axios.post(
//         `${this.paytrApiUrl}/payment`,
//         paymentRequest,
//       );
//       const paymentToken = response.data.payment_token;

//       // Handle the payment token and update the payment session
//       return {
//         payment_token: paymentToken,
//         status: "captured",
//       };
//     } catch (error) {
//       return {
//         error: error.message,
//         status: "failed",
//       };
//     }
//   }
//   async cancelPayment(
//     paymentSessionData: Record<string, unknown>,
//   ): Promise<Record<string, unknown> | PaymentProcessorError> {
//     const paymentId = paymentSessionData.id;

//     // assuming client is an initialized client
//     // communicating with a third-party service.
//     const cancelData = this.client.cancel(paymentId);

//     return {
//       id: paymentId,
//       ...cancelData,
//     };
//   }

//   async authorizePayment(
//     paymentSessionData: Record<string, unknown>,
//     context: Record<string, unknown>,
//   ): Promise<
//     | PaymentProcessorError
//     | { status: PaymentSessionStatus; data: Record<string, unknown> }
//   > {
//     try {
//       const paymentRequest = {
//         amount: paymentSessionData.amount,
//         currency: paymentSessionData.currency,
//         merchant_id: this.merchantId,
//         api_key: this.apiKey,
//       };

//       const response = await axios.post(
//         `${this.paytrApiUrl}/pre-authorization`,
//         paymentRequest,
//       );
//       const paymentToken = response.data.payment_token;

//       return {
//         status: PaymentSessionStatus.AUTHORIZED,
//         data: {
//           payment_token: paymentToken,
//         },
//       };
//     } catch (error) {
//       return {
//         error: error.message,
//       };
//     }
//   }

//   async updatePaymentData(
//     sessionId: string,
//     data: Record<string, unknown>,
//   ): Promise<Record<string, unknown> | PaymentProcessorError> {
//     const paymentSession =
//       await this.paymentProviderService.retrieveSession(sessionId);
//     // assuming client is an initialized client
//     // communicating with a third-party service.
//     const clientPayment = await this.client.update(
//       paymentSession.data.id,
//       data,
//     );

//     return {
//       id: clientPayment.id,
//     };
//   }
//   async deletePayment(
//     paymentSessionData: Record<string, unknown>,
//   ): Promise<Record<string, unknown> | PaymentProcessorError> {
//     const paymentId = paymentSessionData.id;
//     // assuming client is an initialized client
//     // communicating with a third-party service.
//     this.client.delete(paymentId);

//     return {};
//   }

//   async updatePayment(
//     context: PaymentProcessorContext,
//   ): Promise<void | PaymentProcessorError | PaymentProcessorSessionResponse> {
//     // assuming client is an initialized client
//     // communicating with a third-party service.
//     const paymentId = context.paymentSessionData.id;

//     await this.client.update(paymentId, context);

//     return {
//       session_data: context.paymentSessionData,
//     };
//   }

//   async retrievePayment(
//     paymentSessionData: Record<string, unknown>,
//   ): Promise<Record<string, unknown> | PaymentProcessorError> {
//     const paymentId = paymentSessionData.id;

//     // assuming client is an initialized client
//     // communicating with a third-party service.
//     return await this.client.retrieve(paymentId);
//   }

//   async initiatePayment(
//     context: PaymentProcessorContext,
//   ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
//     // assuming client is an initialized client
//     // communicating with a third-party service.
//     const clientPayment = await this.client.initiate(context);

//     return {
//       session_data: {
//         id: clientPayment.id,
//       },
//     };
//   }

//   async getPaymentStatus(
//     paymentSessionData: Record<string, unknown>,
//   ): Promise<PaymentSessionStatus> {
//     const paymentId = paymentSessionData.id;

//     // assuming client is an initialized client
//     // communicating with a third-party service.
//     return (await this.client.getStatus(paymentId)) as PaymentSessionStatus;
//   }

//   // async cancelPayment(paymentSession) {
//   //   // Implement cancellation logic here
//   //   //...
//   // }

//   async refundPayment(
//     paymentSession: any,
//     amount: number,
//   ): Promise<Record<string, unknown> | PaymentProcessorError> {
//     try {
//       const paymentRequest = {
//         payment_token: paymentSession.payment_token,
//         amount: amount,
//         merchant_id: this.merchantId,
//         api_key: this.apiKey,
//       };

//       const response = await axios.post(
//         `${this.paytrApiUrl}/refund`,
//         paymentRequest,
//       );

//       // Handle the refund and update the payment session
//       return {
//         status: "refunded",
//       };
//     } catch (error) {
//       return {
//         error: error.message,
//         status: "failed",
//       };
//     }
//   }
// }
// export default PayTRPaymentProcessor;
