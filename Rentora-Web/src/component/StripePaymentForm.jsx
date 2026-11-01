
import { useState } from "react";
import {
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

const StripePaymentForm = ({ clientSecret, onAuthorized }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      toast.error("Payment system is not ready.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      toast.error("Card details are missing.");
      return;
    }

    try {
      setProcessing(true);

      const { error, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

      if (error) {
        toast.error(error.message || "Card authorization failed.");
        return;
      }

      if (paymentIntent?.status === "requires_capture") {
        toast.success("Card authorized! Waiting for owner confirmation.");
        onAuthorized?.();
        return;
      }

      toast.error(
        `Unexpected payment status: ${paymentIntent?.status || "unknown"}`
      );
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Card Details
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Your card will be authorized now. You will only be charged
          after the owner confirms your booking.
        </p>
      </div>

      <div className="rounded-xl border border-gray-300 p-4">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: "16px",
                color: "#1f2937",
                "::placeholder": {
                  color: "#9ca3af",
                },
              },
              invalid: {
                color: "#dc2626",
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {processing ? "Authorizing..." : "Authorize Card"}
      </button>
    </form>
  );
};

export default StripePaymentForm;
