
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const BecomeOwner = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-300">

        <div className="relative flex min-h-[280px] flex-col sm:min-h-[320px] md:flex-row md:items-center">

          {/* Content */}
          <div className="relative z-10 w-full p-6 sm:p-9 md:w-[58%] md:p-10 lg:p-14">
            <h2 className="max-w-lg text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl">
              Do You Own a Luxury Car?
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white sm:text-base sm:leading-7">
              Monetize your vehicle effortlessly by listing it on Rentora.
              We take care of insurance, driver verification and secure
              payments — so you can earn passive income, stress-free.
            </p>

            <button
              onClick={() => navigate("/owner/add-car")}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-blue-600 transition-all duration-300 hover:bg-blue-50 hover:gap-4"
            >
              List your car
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Car Image */}
          <div className="relative mt-/[-10px] flex h-40 w-full items-end justify-center sm:h-52 md:absolute md:bottom-0 md:right-0 md:mt-0 md:h-full md:w-[48%] md:justify-end">
            {/* Add your car image here */}
            {/*
            <img
              src="/images/owner-car.png"
              alt="Luxury car"
              className="h-full w-full object-contain object-bottom md:object-right-bottom"
            />
            */}
          </div>

        </div>
      </div>
    </section>
  );
};

export default BecomeOwner;
