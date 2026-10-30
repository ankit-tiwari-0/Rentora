import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  CalendarDays,
  MapPin,
  ArrowUpRight,
  Clock3,
  CarFront,
  ClipboardList,
  RefreshCw,
} from "lucide-react";
import { useAppContext } from "../context/Appcontext";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const bookingVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatStatus = (status) => {
  if (!status) return "Pending";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const getStatusClasses = (status) => {
  const normalized = String(status || "").toLowerCase();

  if (["confirmed", "completed", "approved"].includes(normalized)) {
    return {
      badge: "bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
    };
  }

  if (["cancelled", "canceled", "rejected"].includes(normalized)) {
    return {
      badge: "bg-red-50 text-red-700",
      dot: "bg-red-500",
    };
  }

  return {
    badge: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  };
};

const MyBooking = () => {
  const { fetchUserBookings, currency = "₹" } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await fetchUserBookings();
      setBookings(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  }, [fetchUserBookings]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const confirmedCount = bookings.filter((booking) =>
    ["confirmed", "completed", "approved"].includes(
      String(booking.status || "").toLowerCase()
    )
  ).length;

  const pendingCount = bookings.filter((booking) =>
    ["pending", "processing"].includes(
      String(booking.status || "").toLowerCase()
    )
  ).length;

  return (
    <main className="min-h-screen bg-white px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-9"
        >
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-blue-600">
            <ClipboardList size={18} />
            YOUR RENTORA ACCOUNT
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            My Bookings
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            View and manage all your car reservations in one place.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Total bookings</span>
              <ClipboardList size={19} className="text-blue-600" />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {loading ? "..." : bookings.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Confirmed</span>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {loading ? "..." : confirmedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Pending</span>
              <Clock3 size={19} className="text-amber-500" />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {loading ? "..." : pendingCount}
            </p>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="text-sm text-slate-500">Loading your bookings...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-700">{error}</p>
            <button
              type="button"
              onClick={loadBookings}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14 text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <CarFront size={27} />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No bookings yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Your reservations will appear here after you book a vehicle.
            </p>
            <Link
              to="/cars"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Explore cars
              <ArrowUpRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            {bookings.map((booking, index) => {
              const car = booking.car && typeof booking.car === "object"
                ? booking.car
                : null;
              const carName =
                [car?.brand, car?.model].filter(Boolean).join(" ") ||
                "Vehicle";
              const category = [
                car?.year,
                car?.category,
              ].filter(Boolean).join(" · ");
              const status = formatStatus(booking.status);
              const statusClasses = getStatusClasses(booking.status);
              const carId = car?._id || booking.car;

              return (
                <motion.article
                  key={booking._id || `${carId}-${index}`}
                  variants={bookingVariants}
                  whileHover={{
                    y: -3,
                    transition: { duration: 0.2 },
                  }}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow duration-300 hover:border-blue-100 hover:shadow-xl hover:shadow-slate-200/60"
                >
                  <div className="grid grid-cols-1 gap-5 p-4 sm:p-5 lg:grid-cols-[230px_minmax(0,1fr)_125px] lg:gap-6">
                    <div className="min-w-0">
                      <div className="relative overflow-hidden rounded-xl bg-slate-100">
                        {car?.image ? (
                          <motion.img
                            src={car.image}
                            alt={carName}
                            loading="lazy"
                            whileHover={{ scale: 1.06 }}
                            transition={{ duration: 0.45 }}
                            className="h-44 w-full object-cover sm:h-48 lg:h-36"
                          />
                        ) : (
                          <div className="flex h-44 items-center justify-center text-slate-400 sm:h-48 lg:h-36">
                            <CarFront size={42} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60" />
                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold text-slate-800 shadow-sm">
                          Booking #{index + 1}
                        </span>
                      </div>

                      <h2 className="mt-3 text-base font-bold uppercase tracking-tight text-slate-900">
                        {carName}
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        {category || "Rental vehicle"}
                      </p>
                    </div>

                    <div className="flex flex-col justify-center gap-4 py-1">
                      <div>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses.badge}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${statusClasses.dot}`} />
                          {status}
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <CalendarDays size={17} className="mt-0.5 shrink-0 text-blue-600" />
                        <div>
                          <p className="text-xs font-medium text-slate-500">Rental period</p>
                          <p className="mt-1 text-sm font-medium text-slate-800">
                            {formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin size={17} className="mt-0.5 shrink-0 text-blue-600" />
                        <div>
                          <p className="text-xs font-medium text-slate-500">Vehicle location</p>
                          <p className="mt-1 text-sm font-medium text-slate-800">
                            {car?.location || "Location unavailable"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <ClipboardList size={17} className="mt-0.5 shrink-0 text-slate-400" />
                        <div>
                          <p className="text-xs font-medium text-slate-500">Booking date</p>
                          <p className="mt-1 text-sm font-medium text-slate-800">
                            {formatDate(booking.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row items-center justify-between border-t border-slate-100 pt-4 sm:pt-5 lg:flex-col lg:items-end lg:justify-center lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                      <div className="lg:text-right">
                        <p className="text-xs text-slate-500">Total price</p>
                        <p className="mt-1 text-2xl font-bold tracking-tight text-blue-600">
                          {currency}{Number(booking.price || 0).toLocaleString("en-IN")}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          Booking #{String(booking._id || "").slice(-6).toUpperCase() || index + 1}
                        </p>
                      </div>

                      {carId && (
                        <Link
                          to={`/car-details/${carId}`}
                          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-800 lg:mt-5"
                        >
                          Car details
                          <ArrowUpRight size={18} />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 rounded-2xl bg-slate-950 p-6 sm:flex sm:items-center sm:justify-between sm:p-8"
        >
          <div>
            <div className="flex items-center gap-2 text-blue-400">
              <CarFront size={20} />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Your next adventure
              </span>
            </div>
            <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">
              Ready for another journey?
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Explore more vehicles for your next trip.
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="mt-5 sm:mt-0"
          >
            <Link
              to="/cars"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Browse cars
              <ArrowUpRight size={18} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default MyBooking;
