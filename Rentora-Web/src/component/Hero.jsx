import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Search } from "lucide-react";

import carImage from "../assets/car-hero.png";
import secondCarImage from "../assets/car-hero-2.png";
import thirdCarImage from "../assets/car-hero-3.png";
import fourthCarImage from "../assets/car-hero-4.png";
import fifthCarImage from "../assets/car-hero-6.png";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const revealVariants = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: "blur(5px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const cars = [
  carImage,
  secondCarImage,
  thirdCarImage,
  fourthCarImage,
  fifthCarImage,
];

const Hero = () => {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [activeCar, setActiveCar] = useState(0);

  // Automatically show the next car
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCar((current) => (current + 1) % cars.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const today = new Date().toLocaleDateString("en-CA");

  const handleSearch = (e) => {
    e.preventDefault();

    if (!location || !pickupDate || !returnDate) {
      alert("Please select a location and both dates.");
      return;
    }

    if (returnDate < pickupDate) {
      alert("Return date cannot be before pickup date.");
      return;
    }

    const params = new URLSearchParams({
      location,
      pickupDate,
      returnDate,
    });

    navigate(`/cars?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-[#f0f4f9] px-4 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-16 lg:px-8 lg:pt-14">
      <div className="mx-auto max-w-7xl">

        {/* Hero heading */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.p
            variants={revealVariants}
            className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-blue-600 sm:text-sm"
          >
            Discover your next drive
          </motion.p>

          <motion.h1
            variants={revealVariants}
            className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Luxury Cars on Rent
          </motion.h1>

          <motion.p
            variants={revealVariants}
            className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base"
          >
            Premium cars. Unforgettable journeys.
            Find the perfect ride for your next adventure.
          </motion.p>
        </motion.div>

        {/* Search form */}
        <motion.form
          onSubmit={handleSearch}
          variants={revealVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.35 }}
          className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-5 rounded-3xl border border-white/80 bg-white/95 p-5 shadow-[0_15px_45px_rgba(15,23,42,0.09)] backdrop-blur-xl sm:mt-10 sm:grid-cols-2 sm:gap-6 sm:p-7 lg:mt-12 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-center lg:gap-6 lg:rounded-full lg:px-8 lg:py-5"
        >
          {/* Pickup location */}
          <div className="min-w-0">
            <label
              htmlFor="pickup-location"
              className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-900"
            >
              Pickup Location
              <ChevronDown size={16} />
            </label>

            <select
              id="pickup-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full cursor-pointer bg-transparent text-sm text-slate-500 outline-none focus:text-slate-900"
            >
              <option value="">Please select location</option>
              <option value="Delhi">Delhi</option>
              <option value="Noida">Noida</option>
              <option value="Gurugram">Gurugram</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
            </select>
          </div>

          {/* Pickup date */}
          <div className="min-w-0">
            <label
              htmlFor="pickup-date"
              className="mb-2 block text-sm font-semibold text-slate-900"
            >
              Pick-up Date
            </label>

            <input
              id="pickup-date"
              type="date"
              value={pickupDate}
              min={today}
              onChange={(e) => {
                const value = e.target.value;
                setPickupDate(value);

                if (returnDate && value > returnDate) {
                  setReturnDate("");
                }
              }}
              required
              className="block w-full min-w-0 cursor-pointer bg-transparent text-sm text-slate-500 outline-none focus:text-blue-600"
            />
          </div>

          {/* Return date */}
          <div className="min-w-0">
            <label
              htmlFor="return-date"
              className="mb-2 block text-sm font-semibold text-slate-900"
            >
              Return Date
            </label>

            <input
              id="return-date"
              type="date"
              value={returnDate}
              min={pickupDate || today}
              onChange={(e) => setReturnDate(e.target.value)}
              required
              className="block w-full min-w-0 cursor-pointer bg-transparent text-sm text-slate-500 outline-none focus:text-blue-600"
            />
          </div>

          {/* Search button */}
          <motion.button
            type="submit"
            whileHover={{
              scale: 1.04,
              boxShadow: "0px 8px 24px rgba(37, 99, 235, 0.3)",
            }}
            whileTap={{ scale: 0.96 }}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-8 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-colors hover:bg-blue-700 sm:col-span-2 lg:col-span-1 lg:w-auto"
          >
            <Search size={19} />
            Search
          </motion.button>
        </motion.form>

        {/* Sequential car showcase */}
        <div className="mx-auto mt-10 w-full max-w-5xl overflow-hidden sm:mt-12 lg:mt-14">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={activeCar}
              src={cars[activeCar]}
              alt={`Luxury car ${activeCar + 1} available for rent`}
              fetchPriority={activeCar === 0 ? "high" : "auto"}
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 1.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto block h-auto w-full max-w-[850px] object-contain"
            />
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default Hero;
