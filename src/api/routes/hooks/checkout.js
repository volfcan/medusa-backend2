// import { NextPage } from "next";
// import { useCheckout } from "@medusajs/nextjs";

// const CheckoutPage = () => {
//   const { checkout, checkoutState } = useCheckout();

//   const handlePayment = async () => {
//     try {
//       const paymentMethod = await checkout.createPaymentMethod({
//         provider_id: "paytr",
//         payment_data: {
//           amount: 100,
//           currency: "USD",
//         },
//       });

//       const paymentIntent = await paymentMethod.createPaymentIntent();

//       // Redirect the user to the payment page
//       window.location.href = paymentIntent.url;
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={handlePayment}>Pay with PayTR</button>
//     </div>
//   );
// };

// export default CheckoutPage;
