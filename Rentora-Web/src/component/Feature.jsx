import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import {
  Users,
  Fuel,
  CarFront,
  MapPin,
  ArrowRight,
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
  },
];

const FeaturedVehicles = () => {
  const shouldReduceMotion = useReducedMotion();

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
            transition={{ duration: 0.7, delay: 0.15 }}
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

        {/* Responsive car grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.06 }}
          className="mx-auto grid max-w-6xl grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-9"
        >
          {cars.map((car) => (
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
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-slate-100 sm:h-52 lg:h-56">
                  <motion.img
                    src={car.image}
                    alt={car.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    whileHover={
                      shouldReduceMotion ? undefined : { scale: 1.07 }
                    }
                    transition={{ duration: 0.65, ease: "easeOut" }}
                  />

                  {/* Availability */}
                  <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md">
                    Available Now
                  </span>

                  {/* Price */}
                  <div className="absolute bottom-4 right-4 rounded-xl bg-slate-950/90 px-4 py-3 text-white shadow-lg backdrop-blur-sm">
                    <span className="text-base font-bold">
                      ${car.price}
                    </span>
                    <span className="text-xs text-slate-300">
                      {" "}/ day
                    </span>
                  </div>
                </div>

                {/* Information */}
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
                      <Users size={18} className="shrink-0 text-slate-500" />
                      <span>{car.seats} Seats</span>
                    </div>

                    <div className="flex min-w-0 items-center gap-2.5">
                      <Fuel size={18} className="shrink-0 text-slate-500" />
                      <span>{car.fuel}</span>
                    </div>

                    <div className="flex min-w-0 items-center gap-2.5">
                      <CarFront size={18} className="shrink-0 text-slate-500" />
                      <span className="truncate">{car.transmission}</span>
                    </div>

                    <div className="flex min-w-0 items-center gap-2.5">
                      <MapPin size={18} className="shrink-0 text-slate-500" />
                      <span className="truncate">{car.location}</span>
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-sm font-semibold text-blue-600">
                      Explore vehicle
                    </span>

                    <span className="text-xs text-slate-400">
                      {car.location}, India
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        {/* Browse all */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
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
