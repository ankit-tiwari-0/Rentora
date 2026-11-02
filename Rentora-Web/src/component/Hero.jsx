
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ChevronDown,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import carImage from "../assets/car-hero.png";
import secondCarImage from "../assets/car-hero-2.png";
import thirdCarImage from "../assets/car-hero-3.png";
import fourthCarImage from "../assets/car-hero-4.png";
import fifthCarImage from "../assets/car-hero-6.png";

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

  const carStageRef = useRef(null);
  const currentCarRef = useRef(null);
  const previousCarRef = useRef(null);
  const carTimelineRef = useRef(null);
  const previousIndexRef = useRef(null);

  const today = new Date().toLocaleDateString("en-CA");

  // Automatically rotate cars
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCar((current) => (current + 1) % cars.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // GSAP right-to-left car animation
  useGSAP(() => {
    const currentCar = currentCarRef.current;
    const previousCar = previousCarRef.current;

    if (!currentCar) return;

    carTimelineRef.current?.kill();

    // First car starts in the center.
    if (previousIndexRef.current === null) {
      gsap.set(currentCar, {
        x: "0%",
        opacity: 1,
      });

      previousIndexRef.current = activeCar;
      return;
    }

    // New car starts outside the right side.
    gsap.set(currentCar, {
      x: "110%",
      opacity: 0,
    });

    const timeline = gsap.timeline();

    // Previous car exits towards the left.
    if (previousCar) {
      timeline.to(
        previousCar,
        {
          x: "-110%",
          opacity: 0,
          duration: 1.5,
          ease: "power2.inOut",
        },
        0
      );
    }

    // New car enters from the right.
    timeline.to(
      currentCar,
      {
        x: "0%",
        opacity: 1,
        duration: 1.5,
        ease: "power3.out",
      },
      0
    );

    carTimelineRef.current = timeline;
    previousIndexRef.current = activeCar;

    return () => timeline.kill();
  }, [activeCar], { scope: carStageRef });

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

  const previousCarIndex =
    activeCar === 0 ? cars.length - 1 : activeCar - 1;

  return (
    <section
      className="
        relative isolate overflow-hidden
        bg-[#f0f4f9] text-slate-950
        px-4 pb-8 pt-12
        sm:px-6 sm:pb-10 sm:pt-16
        lg:px-8 lg:pt-14
        max-sm:px-3 max-sm:pt-9
      "
    >
      {/* Background decoration */}
      <div className="
        pointer-events-none absolute inset-0 -z-10 overflow-hidden
      ">
        <div className="
          absolute -right-32 top-20
          h-96 w-96 rounded-full
          bg-blue-200/30 blur-[100px]
        " />

        <div className="
          absolute -left-32 bottom-10
          h-80 w-80 rounded-full
          bg-indigo-200/30 blur-[100px]
        " />

        <div className="
          absolute inset-0 opacity-[0.025]
          [background-image:linear-gradient(#334155_1px,transparent_1px),linear-gradient(90deg,#334155_1px,transparent_1px)]
          [background-size:55px_55px]
        " />
      </div>

      <div className="mx-auto max-w-7xl">

        {/* Hero heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative z-10 text-center"
        >
          <div className="
            mb-4 inline-flex items-center gap-2
            rounded-full border border-blue-100
            bg-white/70 px-4 py-2
            text-[10px] font-semibold uppercase
            tracking-[0.22em] text-blue-700
            shadow-sm backdrop-blur-md
            sm:text-xs
          ">
            <Sparkles size={14} />
            Discover your next drive
          </div>

          <h1 className="
            text-4xl font-bold tracking-tight
            text-slate-950
            sm:text-5xl md:text-6xl lg:text-7xl
            max-sm:text-[30px]
          ">
            Luxury Cars on Rent
          </h1>

          <p className="
            mx-auto mt-4 max-w-xl
            text-sm leading-7 text-slate-500
            sm:text-base
            max-sm:mt-3 max-sm:text-[13px]
          ">
            Premium cars. Unforgettable journeys.
            Find the perfect ride for your next adventure.
          </p>
        </motion.div>

        {/* Search form */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.25,
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            relative z-20 mx-auto mt-9
            grid max-w-5xl grid-cols-1
            gap-5 rounded-[28px]
            border border-white/90
            bg-white/85 p-5
            shadow-[0_20px_60px_rgba(15,23,42,0.10)]
            backdrop-blur-2xl

            sm:mt-10 sm:grid-cols-2 sm:gap-6 sm:p-7

            lg:grid-cols-[1.2fr_1fr_1fr_auto]
            lg:items-center lg:gap-6
            lg:rounded-full lg:px-8 lg:py-5

            max-sm:mt-7 max-sm:gap-4
            max-sm:rounded-[24px]
          "
        >
          {/* Pickup location */}
          <div className="min-w-0">
            <label
              htmlFor="pickup-location"
              className="
                mb-2 flex items-center gap-2
                text-sm font-semibold text-slate-900
              "
            >
              Pickup Location
              <ChevronDown size={15} className="text-blue-600" />
            </label>

            <select
              id="pickup-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="
                w-full cursor-pointer bg-transparent
                text-sm text-slate-500 outline-none
                focus:text-slate-900
              "
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
              className="
                mb-2 block text-sm
                font-semibold text-slate-900
              "
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
              className="
                block w-full min-w-0
                cursor-pointer bg-transparent
                text-sm text-slate-500 outline-none
                focus:text-blue-600
              "
            />
          </div>

          {/* Return date */}
          <div className="min-w-0">
            <label
              htmlFor="return-date"
              className="
                mb-2 block text-sm
                font-semibold text-slate-900
              "
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
              className="
                block w-full min-w-0
                cursor-pointer bg-transparent
                text-sm text-slate-500 outline-none
                focus:text-blue-600
              "
            />
          </div>

          {/* Search button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.035 }}
            whileTap={{ scale: 0.97 }}
            className="
              flex h-12 w-full items-center
              justify-center gap-2 rounded-full
              bg-blue-600 px-8
              text-sm font-semibold text-white
              shadow-lg shadow-blue-600/20
              transition-colors hover:bg-blue-700

              sm:col-span-2
              lg:col-span-1 lg:w-auto
              max-sm:h-[50px]
            "
          >
            <Search size={18} />
            Search Cars
          </motion.button>
        </motion.form>

        {/* Premium car showroom */}
        <div
          ref={carStageRef}
          className="
            relative mx-auto mt-7
            h-[190px] w-full max-w-5xl
            overflow-hidden
            sm:mt-10 sm:h-[300px]
            lg:mt-12 lg:h-[370px]
          "
        >
          {/* Showroom floor glow */}
          <div className="
            pointer-events-none absolute
            bottom-5 left-1/2
            h-16 w-[75%] -translate-x-1/2
            rounded-[50%] bg-blue-300/20
            blur-3xl
          " />

          {/* Previous car */}
          {activeCar !== 0 && (
            <img
              ref={previousCarRef}
              src={cars[previousCarIndex]}
              alt=""
              aria-hidden="true"
              className="
                pointer-events-none absolute inset-0
                m-auto h-full w-full
                max-w-[850px]
                object-contain opacity-0
              "
            />
          )}

          {/* Current car */}
          <img
            ref={currentCarRef}
            src={cars[activeCar]}
            alt={`Luxury car ${activeCar + 1} available for rent`}
            fetchPriority={activeCar === 0 ? "high" : "auto"}
            className="
              absolute inset-0 m-auto
              h-full w-full max-w-[850px]
              object-contain opacity-0
              will-change-transform
            "
          />
        </div>

        {/* Trust indicators */}
        <div className="
          relative z-10 mx-auto mt-1
          flex flex-wrap items-center
          justify-center gap-x-6 gap-y-3
          text-[11px] font-medium text-slate-500
          sm:gap-x-9 sm:text-xs
        ">
          <span className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-blue-600" />
            Premium Collection
          </span>

          <span className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-blue-600" />
            Easy Booking
          </span>

          <span className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-blue-600" />
            Comfortable Journeys
          </span>
        </div>

      </div>
    </section>
  );
};

export default Hero;
