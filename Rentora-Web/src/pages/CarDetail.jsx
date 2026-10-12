
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  Users,
  Fuel,
  CarFront,
  MapPin,
  CircleCheck,
  CalendarDays,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

import carHero from "../assets/car-hero.png";
import carHero1 from "../assets/car-hero-4.png";
import carHero2 from "../assets/car-hero-2.png";
import carHero3 from "../assets/car-hero-3.png";

const cars = [
  {
    id: "1",
    name: "Toyota Corolla",
    type: "Sedan",
    year: 2021,
    price: 130,
    seats: 4,
    fuel: "Diesel",
    transmission: "Automatic",
    location: "Delhi",
    image: carHero,
    description:
      "The Toyota Corolla is a comfortable and reliable sedan, designed for everyday driving and longer journeys. Enjoy a smooth ride with practical features and a refined interior.",
    features: [
      "360 Camera",
      "Bluetooth",
      "GPS",
      "Heated Seats",
      "Rear View Mirror",
    ],
  },
  {
    id: "2",
    name: "BMW X5",
    type: "SUV",
    year: 2022,
    price: 300,
    seats: 5,
    fuel: "Petrol",
    transmission: "Automatic",
    location: "Noida",
    image: carHero1,
    description:
      "The BMW X5 is a premium SUV offering a spacious cabin, refined comfort, and a confident driving experience.",
    features: [
      "360 Camera",
      "Bluetooth",
      "GPS",
      "Heated Seats",
      "Parking Sensors",
    ],
  },
  {
    id: "3",
    name: "Jeep Wrangler",
    type: "SUV",
    year: 2023,
    price: 200,
    seats: 4,
    fuel: "Petrol",
    transmission: "Automatic",
    location: "Mumbai",
    image: carHero2,
    description:
      "The Jeep Wrangler is a rugged SUV made for adventurous journeys, offering a distinctive design and a comfortable cabin.",
    features: [
      "Bluetooth",
      "GPS",
      "Rear View Camera",
      "Parking Sensors",
    ],
  },
  {
    id: "4",
    name: "Toyota Corolla",
    type: "Sedan",
    year: 2021,
    price: 130,
    seats: 4,
    fuel: "Diesel",
    transmission: "Manual",
    location: "Gurugram",
    image: carHero,
    description:
      "A practical sedan with comfortable seating, dependable performance, and useful everyday features.",
    features: [
      "Bluetooth",
      "GPS",
      "Rear View Mirror",
      "Parking Sensors",
    ],
  },
  {
    id: "5",
    name: "Ford Neo 6",
    type: "Sedan",
    year: 2022,
    price: 209,
    seats: 2,
    fuel: "Diesel",
    transmission: "Automatic",
    location: "Bengaluru",
    image: carHero2,
    description:
      "A stylish sedan concept for comfortable city travel and longer drives, with practical features for everyday journeys.",
    features: [
      "Bluetooth",
      "GPS",
      "Parking Sensors",
      "Rear View Camera",
    ],
  },
  {
    id: "6",
    name: "BMW M4",
    type: "Coupe",
    year: 2021,
    price: 220,
    seats: 2,
    fuel: "Petrol",
    transmission: "Automatic",
    location: "Hyderabad",
    image: carHero3,
    description:
      "The BMW M4 features sporty styling, a driver-focused cabin, and a premium coupe design for an engaging drive.",
    features: [
      "Bluetooth",
      "GPS",
      "Sport Seats",
      "Parking Sensors",
    ],
  },
];

const smoothEase = [0.22, 1, 0.36, 1];

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.12,
    },
  },
};

const revealUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: smoothEase },
  },
};

const specContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.15,
    },
  },
};

const specItem = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: smoothEase },
  },
};

const CarDetail = () => {
  const { id } = useParams();
  const shouldReduceMotion = useReducedMotion();

  const car = cars.find((item) => item.id === id);

  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

  const handleBooking = (event) => {
    event.preventDefault();

    if (!pickupDate || !returnDate) {
      alert("Please select both dates.");
      return;
    }

    if (returnDate < pickupDate) {
      alert("Return date cannot be before pickup date.");
      return;
    }

    const start = new Date(`${pickupDate}T00:00:00`);
    const end = new Date(`${returnDate}T00:00:00`);

    const days = Math.max(
      1,
      Math.round((end - start) / (1000 * 60 * 60 * 24))
    );

    alert(
      `Demo booking\n\nCar: ${car.name}\nPickup: ${pickupDate}\nReturn: ${returnDate}\nDuration: ${days} day(s)\nEstimated total: $${days * car.price}\n\nConnect your backend booking API here later.`
    );
  };

  if (!car) {
    return (
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center"
      >
        <h1 className="text-2xl font-bold text-slate-900">
          Car not found
        </h1>

        <p className="mt-2 text-slate-500">
          This vehicle doesn't exist in the current demo data.
        </p>

        <Link
          to="/cars"
          className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Browse all cars
        </Link>
      </motion.main>
    );
  }

  const specs = [
    { icon: Users, label: `${car.seats} Seats` },
    { icon: Fuel, label: car.fuel },
    { icon: CarFront, label: car.transmission },
    { icon: MapPin, label: car.location },
  ];

  const motionEnabled = !shouldReduceMotion;

  return (
    <main className="min-h-screen overflow-hidden bg-white px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">

        {/* Back navigation */}
        <motion.div
          initial={motionEnabled ? { opacity: 0, x: -16 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: smoothEase }}
          className="mb-7"
        >
          <Link
            to="/cars"
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to all cars
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10">

          {/* LEFT: Vehicle information */}
          <motion.section
            key={car.id}
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="min-w-0"
          >
            {/* Cinematic image reveal */}
            <motion.div
              variants={revealUp}
              className="group relative isolate overflow-hidden rounded-2xl bg-slate-100 shadow-[0_16px_45px_rgba(15,23,42,0.12)]"
            >
              <motion.div
                initial={
                  motionEnabled
                    ? { clipPath: "inset(0 100% 0 0)" }
                    : false
                }
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{
                  duration: 1.05,
                  ease: smoothEase,
                }}
              >
                <motion.img
                  src={car.image}
                  alt={car.name}
                  fetchPriority="high"
                  className="h-64 w-full object-cover sm:h-80 lg:h-[400px] xl:h-[430px]"
                  initial={motionEnabled ? { scale: 1.12 } : false}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 1.4,
                    ease: smoothEase,
                  }}
                  whileHover={
                    motionEnabled ? { scale: 1.035 } : undefined
                  }
                />
              </motion.div>

              {/* Image gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent opacity-60" />

              {/* Image label */}
              <motion.div
                initial={motionEnabled ? { opacity: 0, y: 12 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.65,
                  duration: 0.5,
                  ease: smoothEase,
                }}
                className="absolute bottom-4 left-4"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-xl">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  Premium vehicle
                </span>
              </motion.div>
            </motion.div>

            {/* Vehicle title */}
            <motion.div variants={revealUp} className="mt-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                    {car.type} collection
                  </p>

                  <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                    {car.name}
                  </h1>

                  <p className="mt-2 text-base text-slate-500">
                    Model year {car.year}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 px-4 py-3 text-right">
                  <p className="text-xs text-slate-400">Daily rate</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    ${car.price}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={revealUp}
              className="my-6 border-t border-slate-200"
            />

            {/* Animated specifications */}
            <motion.div
              variants={specContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
            >
              {specs.map(({ icon: Icon, label }) => (
                <motion.div
                  key={label}
                  variants={specItem}
                  whileHover={
                    motionEnabled
                      ? {
                          y: -5,
                          borderColor: "#bfdbfe",
                          boxShadow: "0 12px 25px rgba(37,99,235,0.08)",
                        }
                      : undefined
                  }
                  transition={{ duration: 0.25 }}
                  className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-transparent bg-slate-50 px-2 py-4 text-center"
                >
                  <Icon
                    size={23}
                    strokeWidth={1.7}
                    className="text-blue-600"
                  />

                  <span className="text-sm font-medium text-slate-800">
                    {label}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Description */}
            <motion.section
              variants={revealUp}
              className="mt-9"
            >
              <h2 className="text-xl font-bold tracking-tight text-slate-950">
                About this vehicle
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
                {car.description}
              </p>
            </motion.section>

            {/* Features */}
            <motion.section
              variants={revealUp}
              className="mt-9 pb-8"
            >
              <h2 className="text-xl font-bold tracking-tight text-slate-950">
                Features & amenities
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Comfort and convenience for every journey.
              </p>

              <motion.ul
                variants={specContainer}
                initial="hidden"
                animate="visible"
                className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2"
              >
                {car.features.map((feature) => (
                  <motion.li
                    key={feature}
                    variants={specItem}
                    className="flex items-center gap-3 text-sm text-slate-600 sm:text-base"
                  >
                    <CircleCheck
                      size={19}
                      strokeWidth={1.8}
                      className="shrink-0 text-blue-600"
                    />
                    {feature}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.section>
          </motion.section>

          {/* RIGHT: Booking card */}
          <motion.aside
            initial={
              motionEnabled
                ? { opacity: 0, x: 35, scale: 0.98 }
                : false
            }
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 0.75,
              delay: 0.18,
              ease: smoothEase,
            }}
            className="w-full rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.09)] sm:p-7 lg:sticky lg:top-28"
          >
            {/* Booking header */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Rental price
                </p>

                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold tracking-tight text-slate-900">
                    ${car.price}
                  </span>
                  <span className="text-sm text-slate-400">/ day</span>
                </div>
              </div>

              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <CarFront size={25} strokeWidth={1.7} />
              </div>
            </div>

            <div className="my-6 border-t border-slate-200" />

            <form onSubmit={handleBooking} className="space-y-5">
              {/* Pickup date */}
              <div>
                <label
                  htmlFor="pickup-date"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Pickup date
                </label>

                <input
                  id="pickup-date"
                  type="date"
                  value={pickupDate}
                  min={today}
                  onChange={(event) => {
                    const value = event.target.value;
                    setPickupDate(value);

                    if (returnDate && value > returnDate) {
                      setReturnDate("");
                    }
                  }}
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-sm text-slate-700 outline-none transition duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Return date */}
              <div>
                <label
                  htmlFor="return-date"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Return date
                </label>

                <input
                  id="return-date"
                  type="date"
                  value={returnDate}
                  min={pickupDate || today}
                  onChange={(event) => setReturnDate(event.target.value)}
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-sm text-slate-700 outline-none transition duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Live estimated total */}
              <motion.div
                layout
                className="rounded-xl bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">
                    Estimated total
                  </span>

                  <motion.span
                    key={`${pickupDate}-${returnDate}-${car.price}`}
                    initial={
                      motionEnabled
                        ? { opacity: 0, y: 5 }
                        : false
                    }
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg font-bold text-slate-900"
                  >
                    $
                    {pickupDate &&
                    returnDate &&
                    returnDate >= pickupDate
                      ? Math.max(
                          1,
                          Math.round(
                            (new Date(`${returnDate}T00:00:00`) -
                              new Date(`${pickupDate}T00:00:00`)) /
                              (1000 * 60 * 60 * 24)
                          )
                        ) * car.price
                      : car.price}
                  </motion.span>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  {pickupDate && returnDate && returnDate >= pickupDate
                    ? `${Math.max(
                        1,
                        Math.round(
                          (new Date(`${returnDate}T00:00:00`) -
                            new Date(`${pickupDate}T00:00:00`)) /
                            (1000 * 60 * 60 * 24)
                        )
                      )} rental day(s)`
                    : "Select dates to calculate your rental"}
                </p>
              </motion.div>

              {/* Booking button */}
              <motion.button
                type="submit"
                whileHover={
                  motionEnabled
                    ? {
                        scale: 1.02,
                        boxShadow: "0 12px 28px rgba(37,99,235,0.25)",
                      }
                    : undefined
                }
                whileTap={motionEnabled ? { scale: 0.98 } : undefined}
                className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition-colors duration-300 hover:bg-blue-700"
              >
                Reserve this car

                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </motion.button>
            </form>

            {/* Trust message */}
            <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs leading-5 text-slate-500 sm:text-sm">
              <ShieldCheck
                size={17}
                className="shrink-0 text-emerald-600"
              />
              No credit card required to reserve
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  );
};

export default CarDetail;
