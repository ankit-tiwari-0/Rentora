
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaGoogle,
} from "react-icons/fa6";

import logo from "../assets/ogo.png";

const footerLinks = {
  "Quick Links": [
    { label: "Home", to: "/" },
    { label: "Browse Cars", to: "/cars" },
    { label: "My Bookings", to: "/my-bookings" },
    { label: "List Your Car", to: "/owner" },
  ],
  Resources: [
    { label: "Help Center", to: "/" },
    { label: "About Us", to: "/" },
    { label: "Privacy Policy", to: "/" },
    { label: "Terms & Conditions", to: "/" },
  ],
};

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    Icon: FaInstagram,
  },
  {
    label: "X",
    href: "https://x.com/",
    Icon: FaXTwitter,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    Icon: FaFacebookF,
  },
  {
    label: "Gmail",
    href: "mailto:hello@rentora.in",
    Icon: FaGoogle,
  },
];

const cities = ["Delhi", "Noida", "Mumbai", "Bengaluru"];

const ease = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease,
    },
  },
};

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden border-t border-slate-200 bg-white">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-40 size-80 rounded-full bg-blue-50/70 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-5 pt-9 sm:px-8 sm:pb-6 sm:pt-14 lg:px-10 lg:pt-16">
        {/* Main footer */}
        <div className="overflow-x-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-5 gap-y-7 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-[1.5fr_0.85fr_0.95fr_1.1fr] lg:gap-12"
          >
            {/* Brand */}
            <motion.div
              variants={itemVariants}
              className="min-w-0"
            >
              <Link
                to="/"
                aria-label="Rentora home"
                className="group inline-flex"
              >
                <img
                  src={logo}
                  alt="Rentora"
                  className="h-8 w-auto max-w-full object-contain object-left transition-transform duration-300 group-hover:scale-[1.03] sm:h-12"
                />
              </Link>

              <p className="mt-3 max-w-sm text-xs leading-5 text-slate-500 sm:mt-5 sm:text-sm sm:leading-7">
                Your journey, your way. Discover premium cars for
                business trips, weekend escapes, and everyday drives
                across India.
              </p>

              {/* Social media */}
              <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
                {socialLinks.map(({ label, href, Icon }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={label === "Gmail" ? undefined : "_blank"}
                    rel={
                      label === "Gmail"
                        ? undefined
                        : "noopener noreferrer"
                    }
                    aria-label={label}
                    title={label}
                    whileHover={{ y: -3, scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:size-10 sm:rounded-xl"
                  >
                    <Icon size={16} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links and Resources: desktop only */}
            {Object.entries(footerLinks).map(([heading, links]) => (
              <motion.div
                key={heading}
                variants={itemVariants}
                className="hidden min-w-0 lg:block"
              >
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  {heading}
                </h3>

                <ul className="mt-5 space-y-3.5">
                  {links.map(({ label, to }) => (
                    <li key={label}>
                      <Link
                        to={to}
                        className="group inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors duration-200 hover:text-blue-600"
                      >
                        <span>{label}</span>
                        <ArrowUpRight
                          size={14}
                          className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Contact */}
            <motion.div
              variants={itemVariants}
              className="min-w-0"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 sm:text-sm">
                Contact
              </h3>

              <div className="mt-4 space-y-3 text-xs text-slate-500 sm:mt-5 sm:space-y-4 sm:text-sm">
                <div className="flex items-start gap-2 sm:gap-3">
                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-blue-600 sm:size-[18px]"
                  />
                  <p className="leading-5 sm:leading-6">
                    Noida, Uttar Pradesh
                    <br />
                    India
                  </p>
                </div>

                <a
                  href="tel:+911234567890"
                  className="flex items-start gap-2 transition-colors hover:text-blue-600 sm:gap-3"
                >
                  <Phone
                    size={15}
                    className="mt-0.5 shrink-0 text-blue-600 sm:size-[17px]"
                  />
                  <span className="break-words">+91 12345 67890</span>
                </a>

                <a
                  href="mailto:hello@rentora.in"
                  className="flex min-w-0 items-start gap-2 transition-colors hover:text-blue-600 sm:gap-3"
                >
                  <Mail
                    size={15}
                    className="mt-0.5 shrink-0 text-blue-600 sm:size-[17px]"
                  />
                  <span className="break-all">hello@rentora.in</span>
                </a>
              </div>

              {/* Cities: desktop and tablet */}
              <div className="mt-5 hidden flex-wrap gap-2 sm:flex">
                {cities.map((city) => (
                  <span
                    key={city}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom bar: visible on every device */}
        <div className="mt-8 border-t border-slate-200 pt-5 sm:mt-10 sm:pt-6">
          <div className="flex flex-row items-center justify-between gap-2">
            <p className="shrink-0 text-[10px] leading-5 text-slate-500 sm:text-sm">
              © {year} Rentora. All rights reserved.
            </p>

            <div className="flex shrink-0 items-center gap-1.5 text-[10px] text-slate-500 sm:gap-4 sm:text-sm">
              <Link
                to="/"
                className="transition-colors hover:text-blue-600"
              >
                Privacy
              </Link>

              <span aria-hidden="true" className="text-slate-300">
                |
              </span>

              <Link
                to="/"
                className="transition-colors hover:text-blue-600"
              >
                Terms
              </Link>

              <span aria-hidden="true" className="text-slate-300">
                |
              </span>

              <Link
                to="/"
                className="inline-flex items-center gap-0.5 transition-colors hover:text-blue-600 sm:gap-1"
              >
                Support
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
