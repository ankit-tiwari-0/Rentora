import { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Users,
  Fuel,
  CarFront,
  MapPin,
  CircleCheck,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { useAppContext } from "../context/Appcontext";

const smoothEase = [0.22, 1, 0.36, 1];

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, staggerChildren: 0.12 },
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
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
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

const getRentalDays = (pickupDate, returnDate) => {
  if (!pickupDate || !returnDate || returnDate < pickupDate) {
    return 1;
  }

  const start = new Date(`${pickupDate}T00:00:00`);
  const end = new Date(`${returnDate}T00:00:00`);

  return Math.max(
    1,
    Math.round((end - start) / (1000 * 60 * 60 * 24))
  );
};

const CarDetail = () => {
  const { id } = useParams();
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();

  const {
    cars = [],
    loading: carsLoading,
    currency = "₹",
    user,
    checkAvailability,
    createBooking,
  } = useAppContext();

  const [bookingLoading, setBookingLoading] = useState(false);

  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const car = useMemo(() => {
    const foundCar = (Array.isArray(cars) ? cars : []).find(
      (item) => String(item._id || item.id) === String(id)
    );

    if (!foundCar) return null;

    return {
      id: foundCar._id || foundCar.id,
      name:
        [foundCar.brand, foundCar.model].filter(Boolean).join(" ") ||
        foundCar.name ||
        "Vehicle",
      type: foundCar.category || "Vehicle",
      year: foundCar.year || "Not specified",
      price: Number(foundCar.pricePerDay ?? foundCar.price) || 0,
      seats: Number(foundCar.seating_capacity ?? foundCar.seats) || 0,
      fuel: foundCar.fuel_type || foundCar.fuel || "Not specified",
      transmission: foundCar.transmission || "Not specified",
      location: foundCar.location || "Location unavailable",
      image: foundCar.image || "",
      description:
        foundCar.description ||
        "Vehicle details and additional information will be provided by the owner.",
      features: Array.isArray(foundCar.features)
        ? foundCar.features
        : [],
      isAvailable: foundCar.isAvailable !== false,
      isListed: foundCar.isListed !== false,
    };
  }, [cars, id]);

  const today = new Date().toLocaleDateString("en-CA");
  const motionEnabled = !shouldReduceMotion;
  const rentalDays = getRentalDays(pickupDate, returnDate);
  const estimatedTotal = rentalDays * (car?.price || 0);

  
const handleBooking = async (event) => {
  event.preventDefault();

  if (!car) return;

  if (!user) {
    toast.error("Please log in to book a car.");
    navigate("/login");
    return;
  }

  if (!pickupDate || !returnDate) {
    toast.error("Please select pickup and return dates.");
    return;
  }

  if (pickupDate < today) {
    toast.error("Pickup date cannot be in the past.");
    return;
  }

  if (returnDate <= pickupDate) {
    toast.error("Return date must be after the pickup date.");
    return;
  }

  if (!car.isAvailable || !car.isListed) {
    toast.error("This vehicle is currently unavailable.");
    return;
  }

  if (bookingLoading) return;

  setBookingLoading(true);

  try {
    // 1. Check car availability
    const availability = await checkAvailability({
      location: car.location,
      pickupDate,
      returnDate,
    });

    const isCarAvailable = availability?.availableCars?.some(
      (availableCar) =>
        String(availableCar._id || availableCar.id) === String(car.id)
    );

    if (!isCarAvailable) {
      toast.error("This car is unavailable for your selected dates.");
      return;
    }

    // 2. Create booking and Stripe PaymentIntent
    const bookingData = await createBooking({
      car: car.id,
      pickupDate,
      returnDate,
    });

    // 3. Validate backend response
    if (
      !bookingData?.success ||
      !bookingData?.clientSecret ||
      !bookingData?.booking?._id
    ) {
      throw new Error(
        bookingData?.message || "Unable to initialize payment."
      );
    }

    // 4. Navigate to the separate payment page
    navigate("/payment", {
      state: {
        clientSecret: bookingData.clientSecret,
        bookingId: bookingData.booking._id,
      },
    });

  } catch (error) {
    console.error("Booking failed:", error);

    toast.error(
      error.response?.data?.message ||
      error.message ||
      "Unable to create booking."
    );
  } finally {
    setBookingLoading(false);
  }
};

  // Loading state from Appcontext.jsx
  if (carsLoading) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-slate-500">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        <p className="text-sm">Loading vehicle details...</p>
      </main>
    );
  }

  // Car not found
  if (!car) {
    return (
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center"
      >
        <CarFront size={42} className="text-slate-300" />

        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Car not found
        </h1>

        <p className="mt-2 text-slate-500">
          This vehicle may have been removed or is no longer listed.
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
    { icon: Users, label: `${car.seats || "N/A"} Seats` },
    { icon: Fuel, label: car.fuel },
    { icon: CarFront, label: car.transmission },
    { icon: MapPin, label: car.location },
  ];

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
            {/* Vehicle image */}
            <motion.div
              variants={revealUp}
              className="group relative isolate overflow-hidden rounded-2xl bg-slate-100 shadow-[0_16px_45px_rgba(15,23,42,0.12)]"
            >
              {car.image ? (
                <motion.img
                  src={car.image}
                  alt={car.name}
                  fetchPriority="high"
                  className="h-64 w-full object-cover sm:h-80 lg:h-[400px] xl:h-[430px]"
                  initial={motionEnabled ? { scale: 1.08 } : false}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.1, ease: smoothEase }}
                  whileHover={motionEnabled ? { scale: 1.035 } : undefined}
                />
              ) : (
                <div className="flex h-64 items-center justify-center text-slate-400 sm:h-80 lg:h-[400px]">
                  <CarFront size={56} />
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent opacity-60" />

              <div className="absolute bottom-4 left-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-xl">
                  <span
                    className={`size-2 rounded-full ${car.isAvailable && car.isListed
                        ? "bg-emerald-400"
                        : "bg-rose-400"
                      }`}
                  />

                  {car.isAvailable && car.isListed
                    ? "Available for rent"
                    : "Currently unavailable"}
                </span>
              </div>
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
                    {currency}
                    {car.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={revealUp}
              className="my-6 border-t border-slate-200"
            />

            {/* Vehicle specifications */}
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
            <motion.section variants={revealUp} className="mt-9">
              <h2 className="text-xl font-bold tracking-tight text-slate-950">
                About this vehicle
              </h2>

              <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-7 text-slate-500 sm:text-base">
                {car.description}
              </p>
            </motion.section>

            {/* Features */}
            <motion.section variants={revealUp} className="mt-9 pb-8">
              <h2 className="text-xl font-bold tracking-tight text-slate-950">
                Features & amenities
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Comfort and convenience for every journey.
              </p>

              {car.features.length > 0 ? (
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
              ) : (
                <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  Additional features have not been provided for this vehicle.
                </p>
              )}
            </motion.section>
          </motion.section>

          {/* RIGHT: Booking card */}
          <motion.aside
            initial={
              motionEnabled ? { opacity: 0, x: 35, scale: 0.98 } : false
            }
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 0.75,
              delay: 0.18,
              ease: smoothEase,
            }}
            className="w-full rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.09)] sm:p-7 lg:sticky lg:top-28"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Rental price
                </p>

                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold tracking-tight text-slate-900">
                    {currency}
                    {car.price.toLocaleString("en-IN")}
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

              {/* Estimated total */}
              <motion.div layout className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">
                    Estimated total
                  </span>

                  <motion.span
                    key={`${pickupDate}-${returnDate}-${car.price}`}
                    initial={motionEnabled ? { opacity: 0, y: 5 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg font-bold text-slate-900"
                  >
                    {currency}
                    {estimatedTotal.toLocaleString("en-IN")}
                  </motion.span>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  {pickupDate && returnDate && returnDate >= pickupDate
                    ? `${rentalDays} rental day(s)`
                    : "Select dates to calculate your rental"}
                </p>
              </motion.div>

              {/* Booking button */}
              <motion.button
                type="submit"
                disabled={
                  bookingLoading ||
                  !car.isAvailable ||
                  !car.isListed
                }
                className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {bookingLoading
                  ? "Checking availability..."
                  : car.isAvailable && car.isListed
                    ? "Reserve this car"
                    : "Vehicle unavailable"}
              </motion.button>
            </form>

            <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs leading-5 text-slate-500 sm:text-sm">
              <ShieldCheck
                size={17}
                className="shrink-0 text-emerald-600"
              />

              Once your payment is successful, your booking request will be submitted. We'll keep you updated and notify you as soon as your reservation is confirmed.
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  );
};

export default CarDetail;
