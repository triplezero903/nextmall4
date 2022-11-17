import Cookies from "js-cookie";
import Router, { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";

export default function PaymentScreen() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("NaverPay");
  const payments = [
    "paypal",
    "stripe",
    "CashOnDeliver",
    "NaverPay",
    "KakaoPay",
  ];
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error("Payment method is required");
    }
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: selectedPaymentMethod });
    Cookies.set(
      "cart",
      JSON.stringify({ ...cart, paymentMethod: selectedPaymentMethod })
    );
    Router.push("/placeorder");
  };

  return (
    <Layout title="payment method">
      <CheckoutWizard activeStep={2} />
      <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl">Payment Method - 지불 방법 선택</h1>
        {payments.map((payment) => (
          <div key={payment} className="mb-4">
            <input
              type="radio"
              name="paymentMethod"
              className="p-2 outline-none focus:ring-0"
              id={payment}
              checked={selectedPaymentMethod === payment}
              onChange={() => setSelectedPaymentMethod(payment)}
            />
            <label className="p-2" htmlFor={payment}>
              {payment}
            </label>
          </div>
        ))}
        <div className="mb-4 flex flex-row justify-between">
          <button
            type="button"
            className="default-button"
            onClick={() => router.push("/shipping")}
          >
            Back
          </button>
          <button type="submit" className="primary-button">
            Next
          </button>
        </div>
      </form>
    </Layout>
  );
}
