import React, { useState } from "react";
import { BiDollar, BiMoney } from "react-icons/bi";
import { BsArrowRightCircle } from "react-icons/bs";
import { FaMoneyBill } from "react-icons/fa";

interface RazorpayPaymentProps {
  amount: number;
  currency?: string;
  name: string;
  description: string;
  image?: string;
  email: string;
  contact: string;
  orderId?: string;
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  amount,
  currency = "INR",
  name,
  description,
  image,
  email,
  contact,
  orderId,
  onSuccess,
  onFailure,
}) => {
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setPaymentStatus("processing");

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      alert(
        "Failed to load Razorpay SDK. Please check your internet connection."
      );
      setPaymentStatus("failed");
      return;
    }

    const options: any = {
      key: "rzp_test_V4AfRMCT7NCvF9",
      amount: amount * 100,
      currency,
      name,
      description,
      image,
      order_id: orderId,
      handler: (response: any) => {
        setPaymentStatus("success");
        onSuccess(response);
      },
      prefill: {
        email,
        contact,
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.on("payment.failed", (error: any) => {
      setPaymentStatus("failed");
      onFailure(error);
    });

    razorpay.open();
  };

  const retryPayment = () => {
    setPaymentStatus("idle");
    handlePayment();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      {paymentStatus === "idle" && (
        <button
          onClick={handlePayment}
          className="px-6 py-3 bg-green-700 flex gap-2 items-center text-white font-semibold rounded-full  hover:bg-green-600  focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        >
          <span className="mr-4">Proceed to pay onboarding charge ₹{amount} Now</span>
          <BsArrowRightCircle className="" size={18}/>
        </button>
      )}

      {paymentStatus === "processing" && (
        <div className="text-orange-500 font-medium">
          <p>Processing payment...</p>
          <button
            onClick={retryPayment}
            className="mt-3 px-6 py-3 bg-red-500 rounded-full text-white font-semibold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            Retry Payment
          </button>
        </div>
      )}

      {paymentStatus === "success" && (
        <div className="text-green-500 font-medium">
          <p>Payment Successful! 🎉</p>
        </div>
      )}

      {paymentStatus === "failed" && (
        <div className="text-red-500 font-medium flex flex-col items-center">
          <p>Payment Failed. Please try again.</p>
          <button
            onClick={retryPayment}
            className="mt-3 px-6 py-3 bg-red-500 rounded-full text-white font-semibold  hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            Retry Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default RazorpayPayment;
