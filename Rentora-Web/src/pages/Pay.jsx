
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "../component/StripePaymentForm";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import confetti from "canvas-confetti";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const clientSecret = location.state?.clientSecret;
  const bookingId = location.state?.bookingId;

  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!paymentSuccess) return;

    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const colors = [
      "#ff0000",
      "#ff7f00",
      "#ffff00",
      "#00ff00",
      "#0000ff",
      "#8b00ff",
      "#ff1493",
      "#00ffff",
    ];

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 8,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.65 },
        colors,
        startVelocity: 45,
        gravity: 0.9,
        ticks: 180,
      });

      confetti({
        particleCount: 8,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.65 },
        colors,
        startVelocity: 45,
        gravity: 0.9,
        ticks: 180,
      });
    }, 180);

    return () => clearInterval(interval);
  }, [paymentSuccess]);

  const handleAuthorized = () => {
    if (processing) return;

    setProcessing(true);
    setPaymentSuccess(true);

    setTimeout(() => {
      navigate("/my-bookings", {
        replace: true,
        state: {
          bookingId,
          paymentAuthorized: true,
        },
      });
    }, 3000);
  };

  if (!clientSecret || !bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Payment session not found
          </h2>

          <p className="mt-2 text-gray-500">
            Please start your booking again.
          </p>

          <button
            onClick={() => navigate("/cars", { replace: true })}
            className="mt-5 rounded-xl bg-blue-600 px-6 py-3 text-white"
          >
            Browse Cars
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-lg">

        <button
          onClick={() => navigate(-1)}
          disabled={processing}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black disabled:opacity-50"
        >
          <ArrowLeft size={18} />
          Back to car
        </button>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <ShieldCheck size={28} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Secure Payment
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Authorize your card to reserve this vehicle.
            </p>
          </div>

          <Elements stripe={stripePromise}>
            <StripePaymentForm
              clientSecret={clientSecret}
              onAuthorized={handleAuthorized}
            />
          </Elements>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <ShieldCheck size={16} className="text-green-600" />
            Your card will only be charged after owner confirmation.
          </div>

        </div>
      </div>

      {/* Success popup */}
      {paymentSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm animate-[fadeIn_0.3s_ease-out] rounded-3xl bg-white p-8 text-center shadow-2xl">

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 size={50} className="text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Payment Authorized!
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Your card has been authorized successfully.
              Your booking is now waiting for owner confirmation.
            </p>

            <button
              onClick={() =>
                navigate("/my-bookings", {
                  replace: true,
                  state: {
                    bookingId,
                    paymentAuthorized: true,
                  },
                })
              }
              className="mt-7 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              View My Bookings
            </button>

            <p className="mt-3 text-xs text-gray-400">
              Redirecting in a few seconds...
            </p>

          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
