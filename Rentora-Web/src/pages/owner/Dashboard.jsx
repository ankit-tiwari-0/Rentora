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
  IndianRupee,
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
  const { fetchOwnerCars } = useAppContext();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch actual owner cars from the existing Car API.
  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetchOwnerCars();

      // Support either an array or an object containing a cars array.
      const ownerCars = Array.isArray(response)
        ? response
        : Array.isArray(response?.cars)
          ? response.cars
          : [];

      setCars(ownerCars);
    } catch (err) {
      console.error("Dashboard loading error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Actual car count from the backend.
  const totalCars = cars.length;

  /*
   * TODO(booking-api):
   * Integrate the Booking API later.
   *
   * Fetch total bookings, pending bookings, completed bookings,
   * recent bookings, and monthly revenue from the backend.
   *
   * Do not display fabricated statistics.
   */
  const totalBookings = null;
  const pendingBookings = null;
  const completedBookings = null;
  const monthlyRevenue = null;
  const recentBookings = [];

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
      description: "Booking API pending",
    },
    {
      title: "Pending Bookings",
      value: pendingBookings,
      icon: TriangleAlert,
      color: "text-amber-600",
      bg: "bg-amber-50",
      description: "Booking API pending",
    },
    {
      title: "Completed Bookings",
      value: completedBookings,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      description: "Booking API pending",
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
                {loading && stat.title === "Total Cars"
                  ? "..."
                  : stat.title === "Total Cars" && error
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
            {recentBookings.length === 0 ? (
              <div className="py-10 text-center">
                <ClipboardList
                  className="mx-auto text-slate-300"
                  size={28}
                />

                <p className="mt-3 text-sm font-medium text-slate-700">
                  Booking API integration pending
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Recent bookings will appear here after the booking API
                  is connected.
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
                      ₹
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
            <IndianRupee size={27} className="mb-1 text-blue-600" />

            <p className="text-3xl font-bold tracking-tight text-blue-600 sm:text-4xl">
              {formatNumber(monthlyRevenue)}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-3 text-xs text-emerald-700">
            <TrendingUp size={16} />

            <span>
              Revenue calculation will be added with the Booking API.
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