
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import logo from "../assets/ogo.png";

const OwnerNavbar = () => {
  const links = [
    { label: "Home", to: "/" },
    { label: "Cars", to: "/cars" },
    { label: "My Bookings", to: "/my-bookings" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/owner"
          aria-label="Rentora owner dashboard"
          className="shrink-0"
        >
          <motion.img
            src={logo}
            alt="Rentora"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.2 }}
            className="h-9 w-auto max-w-[155px] object-contain"
          />
        </Link>

        <nav className="flex items-center gap-4 sm:gap-7">
          {links.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="text-xs font-medium text-slate-600 transition-colors hover:text-blue-600 sm:text-sm"
            >
              {label}
            </Link>
          ))}
        </nav>

        <span className="hidden rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 sm:inline-flex">
          Owner Portal
        </span>
      </div>
    </motion.header>
  );
};

export default OwnerNavbar;
