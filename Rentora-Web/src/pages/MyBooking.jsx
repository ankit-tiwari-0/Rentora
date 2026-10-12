
import React from "react";
import { motion } from "motion/react";
import {
  CalendarDays,
  MapPin,
  ArrowUpRight,
  Clock3,
  CarFront,
  ClipboardList,
} from "lucide-react";

import carHero from "../assets/car-hero.png";
import carHero1 from "../assets/car-hero-4.png";
import carHero2 from "../assets/car-hero-2.png";

const bookings = [
  {
    id: "BK-001",
    carName: "BMW M4 Competition",
    category: "2022 · Sports",
    image: carHero1,
    status: "Confirmed",
    startDate: "10 Oct 2026",
    endDate: "15 Oct 2026",
    pickup: "Airport Terminal 1",
    dropoff: "Downtown Office",
    total: 475,
    bookedOn: "08 Oct 2026",
  },
  {
    id: "BK-002",
    carName: "BMW M4 Competition",
    category: "2022 · Sports",
    image: carHero,
    status: "Confirmed",
    startDate: "18 Oct 2026",
    endDate: "21 Oct 2026",
    pickup: "New Delhi Railway Station",
    dropoff: "Noida Sector 18",
    total: 390,
    bookedOn: "09 Oct 2026",
  },
  {
    id: "BK-003",
    carName: "Porsche 911",
    category: "2024 · Luxury",
    image: carHero2,
    status: "Pending",
    startDate: "25 Oct 2026",
    endDate: "28 Oct 2026",
    pickup: "Indira Gandhi Airport",
    dropoff: "Gurugram",
    total: 650,
    bookedOn: "10 Oct 2026",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const bookingVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const MyBooking = () => {
  return (
    <main className="min-h-screen bg-white px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
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

        {/* Booking summary */}
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
              {bookings.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Confirmed</span>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {bookings.filter((b) => b.status === "Confirmed").length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Pending</span>
              <Clock3 size={19} className="text-amber-500" />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {bookings.filter((b) => b.status === "Pending").length}
            </p>
          </div>
        </motion.div>

        {/* Booking cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {bookings.map((booking, index) => (
            <motion.article
              key={booking.id}
              variants={bookingVariants}
              whileHover={{
                y: -3,
                transition: { duration: 0.2 },
              }}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow duration-300 hover:border-blue-100 hover:shadow-xl hover:shadow-slate-200/60"
            >
              <div className="grid grid-cols-1 gap-5 p-4 sm:p-5 lg:grid-cols-[230px_minmax(0,1fr)_125px] lg:gap-6">
                {/* Car image and name */}
                <div className="min-w-0">
                  <div className="relative overflow-hidden rounded-xl bg-slate-100">
                    <motion.img
                      src={booking.image}
                      alt={booking.carName}
                      loading="lazy"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.45 }}
                      className="h-44 w-full object-cover sm:h-48 lg:h-36"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60" />

                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold text-slate-800 shadow-sm">
                      Booking #{index + 1}
                    </span>
                  </div>

                  <h2 className="mt-3 text-base font-bold uppercase tracking-tight text-slate-900">
                    {booking.carName}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {booking.category}
                  </p>
                </div>

                {/* Rental details */}
                <div className="flex flex-col justify-center gap-4 py-1">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        booking.status === "Confirmed"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          booking.status === "Confirmed"
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                      />
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarDays
                      size={17}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Rental period
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {booking.startDate} - {booking.endDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin
                      size={17}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Pick-up location
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {booking.pickup}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin
                      size={17}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Return location
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {booking.dropoff}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price and booking date */}
                <div className="flex flex-row items-center justify-between border-t border-slate-100 pt-4 sm:pt-5 lg:flex-col lg:items-end lg:justify-center lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                  <div className="lg:text-right">
                    <p className="text-xs text-slate-500">Total price</p>

                    <p className="mt-1 text-2xl font-bold tracking-tight text-blue-600">
                      ${booking.total}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      Booked {booking.bookedOn}
                    </p>
                  </div>

                  <motion.div
                    whileHover={{ x: 3 }}
                    className="flex items-center gap-1 text-sm font-semibold text-blue-600 lg:mt-5"
                  >
                    <span className="hidden sm:inline">Details</span>
                    <ArrowUpRight size={18} />
                  </motion.div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Browse cars */}
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
            <a
              href="/cars"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Browse cars
              <ArrowUpRight size={18} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default MyBooking;
