import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  CarFront,
  ClipboardList,
  TriangleAlert,
  CheckCircle2,
  CalendarDays,
  ArrowUpRight,
  TrendingUp,
  Clock3,
  RefreshCw,
} from "lucide-react";

import { useAppContext } from "../../context/Appcontext";

const ease = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease },
  },
};

const Dashboard = () => {
  const {
    fetchOwnerCars,
    fetchOwnerBookings,
    currency = "₹",
  } = useAppContext();

  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");

  // Fetch cars and bookings independently so one API failure
  // does not prevent the other dashboard section from loading.
  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchOwnerCars();
      const ownerCars = Array.isArray(response)
        ? response
        : Array.isArray(response?.cars)
          ? response.cars
          : [];
      setCars(ownerCars);
    } catch (err) {
      console.error("Dashboard car loading error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load your vehicles."
      );
    } finally {
      setLoading(false);
    }

    setBookingsLoading(true);
    setBookingError("");

    try {
      const response = await fetchOwnerBookings();
      if (!Array.isArray(response)) {
        throw new Error("Invalid bookings response from the server.");
      }
      setBookings(response);
    } catch (err) {
      console.error("Dashboard booking loading error:", err);
      setBookings([]);
      setBookingError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load bookings."
      );
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Actual car count from the backend.
  const totalCars = cars.length;

  // Derive booking statistics from real backend records.
  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => String(booking.status || "").toLowerCase() === "pending"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => String(booking.status || "").toLowerCase() === "completed"
  ).length;

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    )
    .slice(0, 5);

  // Provisional: completed booking value, not verified collected revenue.
  const now = new Date();
  const monthlyRevenue = bookings
    .filter((booking) => {
      const createdAt = new Date(booking.createdAt);
      return (
        String(booking.status || "").toLowerCase() === "completed" &&
        !Number.isNaN(createdAt.getTime()) &&
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getFullYear() === now.getFullYear()
      );
    })
    .reduce(
      (total, booking) =>
        total + Number(booking.totalPrice ?? booking.price ?? 0),
      0
    );

  const currentMonth = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const stats = [
    {
      title: "Total Cars",
      value: totalCars,
      icon: CarFront,
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "Your vehicles",
    },
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: ClipboardList,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      description: "All customer reservations",
    },
    {
      title: "Pending Bookings",
      value: pendingBookings,
      icon: TriangleAlert,
      color: "text-amber-600",
      bg: "bg-amber-50",
      description: "Awaiting completion",
    },
    {
      title: "Completed Bookings",
      value: completedBookings,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      description: "Successfully completed",
    },
  ];

  const formatNumber = (value) => {
    if (value === null || value === undefined) {
      return "Pending";
    }

    return Number(value).toLocaleString("en-IN");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* Page heading */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">
            Overview
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Owner Dashboard
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Monitor your vehicles, bookings, and rental revenue.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 sm:self-auto">
          <CalendarDays size={15} className="text-blue-600" />
          {currentMonth}
        </div>
      </motion.header>

      {/* Error message */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between">
          <p>{error}</p>

          <button
            type="button"
            onClick={loadDashboard}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-rose-200 bg-white px-3 py-2 font-semibold transition hover:bg-rose-100"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        </div>
      )}

      {/* Statistics */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <motion.article
              key={stat.title}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <div
                  className={`flex size-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
                >
                  <Icon size={19} />
                </div>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
              >
                {stat.title === "Total Cars"
                  ? loading
                    ? "..."
                    : error
                      ? "Unavailable"
                      : formatNumber(stat.value)
                  : bookingsLoading
                    ? "..."
                    : bookingError
                      ? "Unavailable"
                      : formatNumber(stat.value)}
              </motion.p>

              <p className="mt-2 text-xs text-slate-400">
                {stat.description}
              </p>
            </motion.article>
          );
        })}
      </motion.section>

      {/* Recent bookings and revenue */}
      <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[1.65fr_1fr]">
        {/* Recent bookings */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent Bookings
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest customer bookings
              </p>
            </div>

            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ClipboardList size={18} />
            </div>
          </div>

          <div className="divide-y divide-slate-100 px-5 sm:px-6">
            {bookingsLoading ? (
              <div className="py-10 text-center text-sm text-slate-500">
                Loading bookings...
              </div>
            ) : bookingError ? (
              <div className="py-10 text-center">
                <p className="text-sm font-medium text-rose-600">
                  Unable to load bookings
                </p>
                <button
                  type="button"
                  onClick={loadDashboard}
                  className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  Try again
                </button>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="py-10 text-center">
                <ClipboardList
                  className="mx-auto text-slate-300"
                  size={28}
                />

                <p className="mt-3 text-sm font-medium text-slate-700">
                  No bookings yet
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  New customer reservations will appear here.
                </p>
              </div>
            ) : (
              recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center gap-3 py-4"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <CarFront size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {booking.car?.brand} {booking.car?.model}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {booking.createdAt
                        ? new Date(booking.createdAt).toLocaleDateString(
                            "en-IN"
                          )
                        : "Date unavailable"}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-slate-700">
                      {currency}
                      {Number(
                        booking.totalPrice ?? booking.price ?? 0
                      ).toLocaleString("en-IN")}
                    </p>

                    <span className="mt-1.5 inline-flex rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                      {booking.status || "Pending"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
            <Link
              to="/owner/manage-bookings"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
            >
              View all bookings
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </motion.div>

        {/* Monthly revenue */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          whileHover={{ y: -3 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-900">
                Monthly Revenue
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Revenue for the current month
              </p>
            </div>

            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp size={19} />
            </div>
          </div>

          <div className="mt-7 flex items-end gap-2">
            <span className="mb-1 text-2xl font-semibold text-blue-600">{currency}</span>

            <p className="text-3xl font-bold tracking-tight text-blue-600 sm:text-4xl">
              {formatNumber(monthlyRevenue)}
            </p>
          </div>

          <div className="mt-6 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-3 text-xs text-amber-700">
            <TrendingUp size={16} className="mt-0.5 shrink-0" />
            <span>
              Shows completed booking value for this month. This is not
              confirmed payment revenue until payment records are integrated.
            </span>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-500">Completed bookings</span>

              <span className="font-semibold text-slate-800">
                {formatNumber(completedBookings)}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-500">Pending requests</span>

              <span className="font-semibold text-amber-600">
                {formatNumber(pendingBookings)}
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quick actions */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <motion.div variants={itemVariants}>
          <Link
            to="/owner/add-car"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
              <CarFront size={22} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900">
                Add a vehicle
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add a car to your rental fleet.
              </p>
            </div>

            <ArrowUpRight
              size={19}
              className="text-slate-400 transition group-hover:text-blue-600"
            />
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link
            to="/owner/manage-bookings"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-500 group-hover:text-white">
              <Clock3 size={22} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900">
                Review bookings
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Review reservations and pending requests.
              </p>
            </div>

            <ArrowUpRight
              size={19}
              className="text-slate-400 transition group-hover:text-blue-600"
            />
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Dashboard;