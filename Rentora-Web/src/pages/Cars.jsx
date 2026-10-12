
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Users,
  Fuel,
  Settings2,
  MapPin,
  ArrowUpRight,
  CarFront,
  X,
} from "lucide-react";

import carHero from "../assets/car-hero.png";
import carHero1 from "../assets/car-hero-4.png";
import carHero2 from "../assets/car-hero-2.png";
import carHero3 from "../assets/car-hero-3.png";

// Replace image paths if your actual filenames are different.
const cars = [
  {
    id: "1",
    name: "Toyota Corolla",
    category: "Sedan",
    year: 2021,
    price: 130,
    seats: 4,
    fuel: "Diesel",
    transmission: "Automatic",
    location: "Noida",
    image: carHero,
  },
  {
    id: "2",
    name: "BMW X5",
    category: "SUV",
    year: 2024,
    price: 300,
    seats: 5,
    fuel: "Petrol",
    transmission: "Automatic",
    location: "Delhi",
    image: carHero1,
  },
  {
    id: "3",
    name: "Jeep Wrangler",
    category: "SUV",
    year: 2023,
    price: 200,
    seats: 5,
    fuel: "Petrol",
    transmission: "Automatic",
    location: "Gurugram",
    image: carHero2,
  },
  {
    id: "4",
    name: "Mercedes-Benz C-Class",
    category: "Luxury",
    year: 2024,
    price: 250,
    seats: 5,
    fuel: "Petrol",
    transmission: "Automatic",
    location: "Delhi",
    image: carHero3,
  },
  {
    id: "5",
    name: "Range Rover Sport",
    category: "Luxury",
    year: 2023,
    price: 350,
    seats: 5,
    fuel: "Diesel",
    transmission: "Automatic",
    location: "Noida",
    image: carHero1,
  },
  {
    id: "6",
    name: "Porsche 911",
    category: "Sports",
    year: 2024,
    price: 450,
    seats: 2,
    fuel: "Petrol",
    transmission: "Automatic",
    location: "Gurugram",
    image: carHero2,
  },
];

const categories = ["All", "Sedan", "SUV", "Luxury", "Sports"];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 12,
    transition: { duration: 0.2 },
  },
};

const Cars = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(500);

  const filteredCars = useMemo(() => {
    let result = cars.filter((car) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        car.name.toLowerCase().includes(searchText) ||
        car.category.toLowerCase().includes(searchText) ||
        car.location.toLowerCase().includes(searchText) ||
        car.fuel.toLowerCase().includes(searchText);

      const matchesCategory =
        activeCategory === "All" || car.category === activeCategory;

      const matchesPrice = car.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      result.sort((a, b) => b.year - a.year);
    }

    return result;
  }, [search, activeCategory, maxPrice, sortBy]);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero / Search Section */}
      <section className="relative overflow-hidden bg-[#f0f5fb]">
        <motion.div
          aria-hidden="true"
          className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          aria-hidden="true"
          className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -15, 0] }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-16 text-center sm:px-8 sm:pb-20 sm:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-semibold tracking-wide text-blue-700 shadow-sm"
            >
              <CarFront size={15} />
              FIND YOUR PERFECT RIDE
            </motion.span>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
              Find the car for
              <br className="sm:hidden" />{" "}
              <span className="text-blue-600">every journey.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Explore our collection of premium vehicles and make every
              journey worth remembering.
            </p>
          </motion.div>

          {/* Animated Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mx-auto mt-9 flex max-w-2xl items-center gap-3 rounded-2xl border border-white bg-white p-2.5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] transition-shadow duration-300 focus-within:shadow-[0_15px_45px_rgba(37,99,235,0.14)]"
          >
            <Search className="ml-2 shrink-0 text-slate-400" size={21} />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by car, category, fuel or city..."
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={17} />
              </button>
            )}

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setShowFilters((previous) => !previous)}
              aria-label="Toggle filters"
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
                showFilters
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <SlidersHorizontal size={19} />
            </motion.button>
          </motion.div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mx-auto mt-4 max-w-2xl overflow-hidden text-left"
              >
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
                  <div className="flex items-center justify-between gap-4">
                    <label
                      htmlFor="sort-cars"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Sort vehicles
                    </label>

                    <select
                      id="sort-cars"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>

                  <div className="mt-5">
                    <div className="mb-3 flex items-center justify-between">
                      <label
                        htmlFor="max-price"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Maximum daily price
                      </label>
                      <span className="font-semibold text-blue-600">
                        ${maxPrice}
                      </span>
                    </div>

                    <input
                      id="max-price"
                      type="range"
                      min="100"
                      max="500"
                      step="50"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full cursor-pointer accent-blue-600"
                    />

                    <div className="flex justify-between text-xs text-slate-400">
                      <span>$100/day</span>
                      <span>$500/day</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSortBy("featured");
                      setMaxPrice(500);
                      setActiveCategory("All");
                      setSearch("");
                    }}
                    className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Reset all filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Chips */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-2"
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  activeCategory === category
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "border border-slate-200 bg-white/80 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vehicle Listing */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-7 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="text-sm font-medium text-blue-600">
              THE RENTORA COLLECTION
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Available vehicles
            </h2>
          </div>

          <p className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">
              {filteredCars.length}
            </span>{" "}
            {filteredCars.length === 1 ? "vehicle" : "vehicles"} found
          </p>
        </motion.div>

        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredCars.map((car) => (
              <motion.article
                layout
                key={car.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{
                  y: -7,
                  transition: { duration: 0.22 },
                }}
                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_5px_20px_rgba(15,23,42,0.06)] transition-shadow duration-300 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]"
              >
                {/* Car Image */}
                <Link
                  to={`/car-details/${car.id}`}
                  className="relative block overflow-hidden bg-slate-100"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <motion.img
                      src={car.image}
                      alt={car.name}
                      loading="lazy"
                      whileHover={{ scale: 1.07 }}
                      transition={{ duration: 0.55, ease: "easeOut" }}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

                    <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Available now
                    </span>

                    <div className="absolute bottom-4 right-4 rounded-xl bg-slate-950/90 px-3.5 py-2.5 text-white shadow-lg backdrop-blur-md">
                      <span className="text-lg font-bold">${car.price}</span>
                      <span className="ml-1 text-xs text-slate-300">
                        / day
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Vehicle Details */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        {car.category} · {car.year}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                        {car.name}
                      </h3>
                    </div>

                    <motion.div
                      whileHover={{ rotate: 45, scale: 1.08 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors group-hover:border-blue-200 group-hover:text-blue-600"
                    >
                      <ArrowUpRight size={18} />
                    </motion.div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Users size={17} className="shrink-0 text-slate-400" />
                      <span>{car.seats} Seats</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Fuel size={17} className="shrink-0 text-slate-400" />
                      <span>{car.fuel}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Settings2
                        size={17}
                        className="shrink-0 text-slate-400"
                      />
                      <span>{car.transmission}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin
                        size={17}
                        className="shrink-0 text-slate-400"
                      />
                      <span className="truncate">{car.location}</span>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <Link
                      to={`/car-details/${car.id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    >
                      View details
                      <ArrowUpRight size={17} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredCars.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Search size={28} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No vehicles found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try a different search or adjust your filters.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
                setMaxPrice(500);
                setSortBy("featured");
              }}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </section>
    </main>
  );
};

export default Cars;
