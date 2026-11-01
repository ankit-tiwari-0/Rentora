
import React, { useState } from "react";
import { Star, ChevronRight, ChevronLeft } from "lucide-react";

import pr1 from "../assets/pr1.jpg";
import pr2 from "../assets/pr2.jpg";
import pr3 from "../assets/pr3.jpg";
import pr4 from "../assets/pr4.jpg";
import pr5 from "../assets/pr5.jpg";
import pr6 from "../assets/pr6.png";

const testimonials = [
  {
    name: "Priya 🌸",
    location: "Shahadra Delhi",
    review:
      "Rentora made my journey effortless! Smooth booking, a beautiful car, and an amazing overall experience. Definitely booking again!",
    avatar: pr6,
  },
  {
    name: "Priya Verma",
    location: "Delhi, India",
    review:
      "Rentora made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic!",
    avatar: pr2,
  },
  {
    name: "Avni",
    location: "Gurugram, Haryana",
    review:
      "I highly recommend Rentora! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service.",
    avatar: pr3,
  },
  {
    name: "Rahul",
    location: "Chandigarh, India",
    review:
      "The entire rental experience was convenient and hassle-free. The car was clean, comfortable, and ready on time.",
    avatar: pr4,
  },
  {
    name: "Sofia Ansari",
    location: "Jaipur, Rajasthan",
    review:
      "Excellent service and a great selection of premium cars. Rentora made my weekend trip memorable.",
    avatar: pr5,
  },
  {
    name: "Shivani Parjapati",
    location: "Noida, Uttar Pradesh",
    review:
      "I've rented cars from various companies, but the experience with Rentora was exceptional. The booking process was smooth and the car was in excellent condition.",
    avatar: pr1,
  },
];

const Testimonials = () => {
  // Mobile carousel
  const [activeIndex, setActiveIndex] = useState(0);

  // Desktop carousel
  const [desktopIndex, setDesktopIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const previousTestimonial = () => {
    setActiveIndex(
      (current) =>
        (current - 1 + testimonials.length) % testimonials.length
    );
  };

  // Desktop navigation
  const nextDesktop = () => {
    setDesktopIndex((current) =>
      current >= testimonials.length - 3 ? 0 : current + 1
    );
  };

  const previousDesktop = () => {
    setDesktopIndex((current) =>
      current <= 0 ? testimonials.length - 3 : current - 1
    );
  };

  // Testimonial Card
  const renderCard = (testimonial) => (
    <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_8px_25px_rgba(15,23,42,0.09)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(15,23,42,0.12)] sm:p-7">

      {/* Customer Information */}
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-blue-50">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="h-full w-full object-cover object-[center_20%]"
            loading="lazy"
          />
        </div>

        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-950 sm:text-lg">
            {testimonial.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {testimonial.location}
          </p>
        </div>
      </div>

      {/* Star Rating */}
      <div className="mt-5 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={17}
            fill="currentColor"
            className="text-blue-600"
          />
        ))}
      </div>

      {/* Customer Review */}
      <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
        "{testimonial.review}"
      </p>
    </div>
  );

  return (
    <section className="w-full bg-white px-4 pt-16 pb-28 sm:px-6 sm:pt-20 sm:pb-32 lg:px-8 lg:pt-24 lg:pb-40">

      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            What Our Customers Say
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
            Discover why travelers choose Rentora for their
            premium car rental experiences and unforgettable journeys.
          </p>
        </div>

        {/* Desktop: 3 Cards at a Time */}
        <div className="mt-12 hidden lg:block lg:mt-14">

          <div className="grid grid-cols-3 gap-7">
            {testimonials
              .slice(desktopIndex, desktopIndex + 3)
              .map((testimonial, index) => (
                <div key={testimonial.name}>
                  {renderCard(testimonial)}
                </div>
              ))}
          </div>

          {/* Desktop Navigation */}
          <div className="mt-8 flex items-center justify-between">

            <p className="text-sm text-slate-500">
              Showing {desktopIndex + 1}–{desktopIndex + 3} of{" "}
              {testimonials.length} testimonials
            </p>

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={previousDesktop}
                aria-label="Previous testimonials"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 active:scale-90"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                onClick={nextDesktop}
                aria-label="Next testimonials"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 active:scale-90"
              >
                <ChevronRight size={23} />
              </button>

            </div>
          </div>
        </div>

        {/* Mobile & Tablet: One Card at a Time */}
        <div className="mt-10 lg:hidden">

          {renderCard(testimonials[activeIndex])}

          {/* Mobile Navigation */}
          <div className="mt-6 flex items-center justify-between">

            {/* Slide Indicators */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show testimonial ${index + 1}`}
                  aria-current={
                    activeIndex === index ? "true" : undefined
                  }
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "w-6 bg-blue-600"
                      : "w-2 bg-slate-300"
                  }`}
                />
              ))}
            </div>

            {/* Previous & Next Buttons */}
            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={previousTestimonial}
                aria-label="Previous testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 active:scale-90"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                onClick={nextTestimonial}
                aria-label="Next testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 active:scale-90"
              >
                <ChevronRight size={23} />
              </button>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
