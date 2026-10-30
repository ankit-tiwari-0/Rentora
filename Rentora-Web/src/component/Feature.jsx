
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import {
  Users,
  Fuel,
  CarFront,
  MapPin,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

import { useAppContext } from "../context/Appcontext";

const FeaturedVehicles = () => {
  const shouldReduceMotion = useReducedMotion();

  const {
    cars = [],
    loading,
    currency,
  } = useAppContext();

  // Convert MongoDB car fields into the format used by this component.
  const featuredCars = (Array.isArray(cars) ? cars : [])
    .filter((car) => car.isListed !== false && car.isAvailable !== false)
    .slice(0, 6)
    .map((car) => ({
      id: car._id || car.id,
      name:
        [car.brand, car.model].filter(Boolean).join(" ") ||
        car.name ||
        "Vehicle",
      type: car.category || "Other",
      year: car.year || "Year unavailable",
      price: Number(car.pricePerDay ?? car.price) || 0,
      seats: Number(car.seating_capacity ?? car.seats) || 0,
      fuel: car.fuel_type || car.fuel || "Not specified",
      transmission: car.transmission || "Not specified",
      location: car.location || "Location unavailable",
      image: car.image || "",
    }))
    .filter((car) => car.id);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 35,
      scale: shouldReduceMotion ? 1 : 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.65,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section
      id="featured-vehicles"
      className="overflow-hidden bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <motion.div
          initial={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : 24,
          }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mb-12 text-center sm:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.05em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.2em" }}
            viewport={{ once: true }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.7,
              delay: 0.15,
            }}
            className="mb-4 inline-block text-xs font-semibold uppercase text-blue-600 sm:text-sm"
          >
            Find your perfect ride
          </motion.span>

          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Featured Vehicles
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            From city drives to weekend escapes, discover a vehicle
            that matches your journey.
          </p>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
            <RefreshCw
              size={28}
              className="animate-spin text-blue-600"
            />
            <p className="text-sm">Loading featured vehicles...</p>
          </div>
        )}

        {/* Vehicle grid */}
        {!loading && featuredCars.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.06 }}
            className="mx-auto grid max-w-6xl grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-9"
          >
            {featuredCars.map((car) => (
              <motion.article
                key={car.id}
                variants={cardVariants}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: -7,
                        transition: { duration: 0.25 },
                      }
                }
                className="group min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_25px_rgba(15,23,42,0.07)] transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.13)]"
              >
                <Link
                  to={`/car-details/${car.id}`}
                  aria-label={`View details for ${car.name}`}
                  className="block h-full"
                >
                  {/* Vehicle image */}
                  <div className="relative h-56 overflow-hidden bg-slate-100 sm:h-52 lg:h-56">
                    {car.image ? (
                      <motion.img
                        src={car.image}
                        alt={car.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                        whileHover={
                          shouldReduceMotion
                            ? undefined
                            : { scale: 1.07 }
                        }
                        transition={{
                          duration: 0.65,
                          ease: "easeOut",
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        <CarFront size={48} />
                      </div>
                    )}

                    {/* Availability */}
                    <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md">
                      Available Now
                    </span>

                    {/* Price */}
                    <div className="absolute bottom-4 right-4 rounded-xl bg-slate-950/90 px-4 py-3 text-white shadow-lg backdrop-blur-sm">
                      <span className="text-base font-bold">
                        {currency || "₹"}
                        {car.price.toLocaleString("en-IN")}
                      </span>

                      <span className="text-xs text-slate-300">
                        {" "}/ day
                      </span>
                    </div>
                  </div>

                  {/* Vehicle information */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-slate-950 transition-colors duration-300 group-hover:text-blue-600">
                          {car.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {car.type} · {car.year}
                        </p>
                      </div>

                      <span className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                        <ArrowRight size={18} />
                      </span>
                    </div>

                    {/* Specifications */}
                    <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-slate-100 pt-5 text-sm text-slate-600">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Users
                          size={18}
                          className="shrink-0 text-slate-500"
                        />
                        <span>
                          {car.seats || "N/A"} Seats
                        </span>
                      </div>

                      <div className="flex min-w-0 items-center gap-2.5">
                        <Fuel
                          size={18}
                          className="shrink-0 text-slate-500"
                        />
                        <span className="truncate">{car.fuel}</span>
                      </div>

                      <div className="flex min-w-0 items-center gap-2.5">
                        <CarFront
                          size={18}
                          className="shrink-0 text-slate-500"
                        />
                        <span className="truncate">
                          {car.transmission}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-center gap-2.5">
                        <MapPin
                          size={18}
                          className="shrink-0 text-slate-500"
                        />
                        <span className="truncate">
                          {car.location}
                        </span>
                      </div>
                    </div>

                    {/* Card footer */}
                    <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
                      <span className="text-sm font-semibold text-blue-600">
                        Explore vehicle
                      </span>

                      <span className="truncate text-xs text-slate-400">
                        {car.location}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && featuredCars.length === 0 && (
          <div className="py-16 text-center">
            <CarFront
              size={42}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No featured vehicles available
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Available vehicles will appear here once they are listed.
            </p>
          </div>
        )}

        {/* Browse all vehicles */}
        <motion.div
          initial={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : 18,
          }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.6,
            delay: 0.15,
          }}
          className="mt-14 flex justify-center sm:mt-16"
        >
          <Link
            to="/cars"
            className="group inline-flex items-center gap-3 rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-800 transition-all duration-300 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
          >
            Explore all cars

            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;
