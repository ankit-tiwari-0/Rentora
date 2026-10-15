
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
} from "lucide-react";

const stats = [
  {
    title: "Total Cars",
    value: 8,
    icon: CarFront,
    color: "text-blue-600",
    bg: "bg-blue-50",
    change: "+2 this month",
  },
  {
    title: "Total Bookings",
    value: 8,
    icon: ClipboardList,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    change: "+12% this month",
  },
  {
    title: "Pending Bookings",
    value: 2,
    icon: TriangleAlert,
    color: "text-amber-600",
    bg: "bg-amber-50",
    change: "Needs attention",
  },
  {
    title: "Completed Bookings",
    value: 6,
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    change: "All time",
  },
];

const recentBookings = [
  {
    id: "BK-1001",
    car: "BMW 3 Series",
    date: "12 Oct 2026",
    price: 475,
    status: "Confirmed",
    icon: CarFront,
  },
  {
    id: "BK-1002",
    car: "Ford Explorer",
    date: "11 Oct 2026",
    price: 425,
    status: "Completed",
    icon: CarFront,
  },
  {
    id: "BK-1003",
    car: "Toyota Corolla",
    date: "10 Oct 2026",
    price: 225,
    status: "Pending",
    icon: CarFront,
  },
  {
    id: "BK-1004",
    car: "Tesla Model 3",
    date: "09 Oct 2026",
    price: 360,
    status: "Confirmed",
    icon: CarFront,
  },
];

const statusStyles = {
  Confirmed: "bg-emerald-50 text-emerald-700",
  Completed: "bg-slate-100 text-slate-600",
  Pending: "bg-amber-50 text-amber-700",
};

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
  const monthlyRevenue = 1060;

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
            Admin Dashboard
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Monitor overall platform performance, including total cars,
            bookings, revenue, and recent activities.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 sm:self-auto">
          <CalendarDays size={15} className="text-blue-600" />
          October 2026
        </div>
      </motion.header>

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
                className="mt-4 text-3xl font-bold tracking-tight text-slate-900"
              >
                {stat.value}
              </motion.p>

              <p className="mt-2 text-xs text-slate-400">{stat.change}</p>
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

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-slate-100 px-5 sm:px-6"
          >
            {recentBookings.map((booking) => {
              const Icon = booking.icon;

              return (
                <motion.div
                  key={booking.id}
                  variants={itemVariants}
                  className="flex items-center gap-3 py-4"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {booking.car}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {booking.date}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-slate-700">
                      ${booking.price}
                    </p>

                    <span
                      className={`mt-1.5 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${statusStyles[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
            <LinkToBookings />
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

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-4xl font-bold tracking-tight text-blue-600"
            >
              {monthlyRevenue.toLocaleString("en-IN")}
            </motion.p>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-3 text-xs text-emerald-700">
            <TrendingUp size={16} />
            <span>Revenue summary for October</span>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Completed bookings</span>
              <span className="font-semibold text-slate-800">6</span>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-500">Pending requests</span>
              <span className="font-semibold text-amber-600">2</span>
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
          <a
            href="/owner/add-car"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
              <CarFront size={22} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900">Add a vehicle</h3>
              <p className="mt-1 text-sm text-slate-500">
                Add a car to your rental fleet.
              </p>
            </div>

            <ArrowUpRight
              size={19}
              className="text-slate-400 transition group-hover:text-blue-600"
            />
          </a>
        </motion.div>

        <motion.div variants={itemVariants}>
          <a
            href="/owner/manage-bookings"
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
                Check reservations and pending requests.
              </p>
            </div>

            <ArrowUpRight
              size={19}
              className="text-slate-400 transition group-hover:text-blue-600"
            />
          </a>
        </motion.div>
      </motion.section>
    </div>
  );
};

function LinkToBookings() {
  return (
    <a
      href="/owner/manage-bookings"
      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
    >
      View all bookings
      <ArrowUpRight size={16} />
    </a>
  );
}

export default Dashboard;
