
import React, { useState } from "react";
import { Star, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    location: "Noida, Uttar Pradesh",
    review:
      "I've rented cars from various companies, but the experience with Rentora was exceptional. The booking process was smooth and the car was in excellent condition.",
    avatar: null,
  },
  {
    name: "Priya Verma",
    location: "Delhi, India",
    review:
      "Rentora made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic!",
    avatar: null,
  },
  {
    name: "Aman Gupta",
    location: "Gurugram, Haryana",
    review:
      "I highly recommend Rentora! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service.",
    avatar: null,
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const renderCard = (testimonial) => (
    <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_8px_25px_rgba(15,23,42,0.09)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(15,23,42,0.12)] sm:p-7">

      {/* Customer Information */}
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-blue-50">

          {/* Add customer image here */}
          {/*
          <img
            src="/images/customer-1.jpg"
            alt={testimonial.name}
            className="h-full w-full object-cover"
          />
          */}

          <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-blue-600">
            {testimonial.name.charAt(0)}
          </div>
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

        {/* Desktop: Show All Testimonials */}
        <div className="mt-12 hidden grid-cols-3 gap-7 md:grid lg:mt-14">
          {testimonials.map((testimonial, index) => (
            <div key={index}>
              {renderCard(testimonial)}
            </div>
          ))}
        </div>

        {/* Mobile: One Testimonial at a Time */}
        <div className="mt-10 md:hidden">

          {renderCard(testimonials[activeIndex])}

          {/* Mobile Navigation */}
          <div className="mt-6 flex items-center justify-between">

            {/* Slide Indicators */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show testimonial ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "w-6 bg-blue-600"
                      : "w-2 bg-slate-300"
                  }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextTestimonial}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/20 transition-all duration-300 hover:bg-blue-700 active:scale-90"
            >
              <ChevronRight size={23} />
            </button>

          </div>

        </div>

        {/* Extra bottom spacing before Footer */}
      </div>
    </section>
  );
};

export default Testimonials;
