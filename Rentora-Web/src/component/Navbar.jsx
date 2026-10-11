import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Search, Menu, X } from "lucide-react";
import logo from "../assets/ogo.png";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Cars", to: "/cars" },
  { label: "My Bookings", to: "/my-bookings" },
  { label: "List Cars", to: "/owner" },
];

const navContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const navItem = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const mobileContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const mobileItem = {
  hidden: { opacity: 0, x: -15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 64rem)");

    const handleResize = (event) => {
      if (event.matches) setMenuOpen(false);
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  const closeMenu = () => setMenuOpen(false);

  const handleSearch = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = formData.get("search")?.toString().trim();

    if (!query) return;

    closeMenu();
    navigate(`/cars?search=${encodeURIComponent(query)}`);
  };

  const linkStyles =
    "group relative rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-300 hover:bg-blue-50/80 hover:text-blue-600";

  const SearchForm = ({ mobile = false }) => (
    <motion.form
      onSubmit={handleSearch}
      whileFocus={{ scale: 1.015 }}
      className={`flex h-11 items-center rounded-full border border-slate-300 bg-white/70 transition-all duration-300 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-md focus-within:shadow-blue-500/10 focus-within:ring-2 focus-within:ring-blue-500/15 ${
        mobile ? "w-full px-4" : "w-56 xl:w-60 px-3"
      }`}
    >
      <input
        type="search"
        name="search"
        placeholder="Search cars"
        aria-label="Search cars"
        className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
      />

      <motion.button
        type="submit"
        aria-label="Submit car search"
        whileHover={{ scale: 1.12, rotate: -8 }}
        whileTap={{ scale: 0.88 }}
        className="rounded-full p-1.5 text-slate-500 hover:text-blue-600"
      >
        <Search size={19} />
      </motion.button>
    </motion.form>
  );

  const AnimatedLink = ({
    label,
    to,
    mobile = false,
  }) => (
    <motion.div
      variants={mobile ? mobileItem : navItem}
      whileHover={
        shouldReduceMotion || mobile
          ? undefined
          : { y: -2 }
      }
      whileTap={{ scale: 0.97 }}
    >
      <Link
        to={to}
        onClick={mobile ? closeMenu : undefined}
        tabIndex={mobile && !menuOpen ? -1 : undefined}
        aria-current={location.pathname === to ? "page" : undefined}
        className={`${linkStyles} ${
          mobile ? "block w-full" : "inline-block"
        } ${
          location.pathname === to
            ? "bg-blue-50 text-blue-600"
            : ""
        }`}
      >
        {label}

        {!mobile && (
          <motion.span
            className="absolute inset-x-3 bottom-1 h-0.5 origin-left rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        )}
      </Link>
    </motion.div>
  );

  return (
    <motion.nav
      initial={shouldReduceMotion ? false : { y: -25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.65,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-[#f0f4f9]/95 shadow-sm backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">

        {/* Animated logo */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="shrink-0"
        >
          <Link
            to="/"
            onClick={closeMenu}
            aria-label="Rentora home"
            className="block"
          >
            <img
              src={logo}
              alt="Rentora"
              className="h-10 w-auto object-contain sm:h-12"
            />
          </Link>
        </motion.div>

        {/* Desktop navigation */}
        <motion.div
          variants={navContainer}
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          className="hidden items-center gap-1 lg:flex xl:gap-3"
        >
          {navLinks.slice(0, 3).map(({ label, to }) => (
            <AnimatedLink
              key={to}
              label={label}
              to={to}
            />
          ))}

          {/* Animated search */}
          <motion.div
            variants={navItem}
            className="mx-1"
            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
          >
            <SearchForm />
          </motion.div>

          <AnimatedLink
            label="List Cars"
            to="/owner"
          />

          {/* Animated login button */}
          <motion.div
            variants={navItem}
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    y: -2,
                    boxShadow: "0px 8px 22px rgba(37, 99, 235, 0.24)",
                  }
            }
            whileTap={{ scale: 0.96 }}
            className="ml-1"
          >
            <Link
              to="/login"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors duration-300 hover:bg-blue-700"
            >
              Login
            </Link>
          </motion.div>
        </motion.div>

        {/* Mobile menu toggle */}
        <motion.button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          whileTap={{ scale: 0.86, rotate: menuOpen ? -8 : 8 }}
          className="inline-flex size-10 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600 lg:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={menuOpen ? "close" : "menu"}
              initial={shouldReduceMotion ? false : { opacity: 0, rotate: -45, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, rotate: 45, scale: 0.7 }}
              transition={{ duration: 0.18 }}
              className="flex"
            >
              {menuOpen ? (
                <X size={25} strokeWidth={1.7} />
              ) : (
                <Menu size={25} strokeWidth={1.7} />
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Animated mobile dropdown */}
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            key="mobile-navigation"
            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="overflow-hidden border-t border-slate-200 lg:hidden"
          >
            <motion.div
              variants={mobileContainer}
              initial={shouldReduceMotion ? false : "hidden"}
              animate="visible"
              className="space-y-1 px-4 pb-5 pt-3 sm:px-6"
            >
              {navLinks.map(({ label, to }) => (
                <AnimatedLink
                  key={to}
                  label={label}
                  to={to}
                  mobile
                />
              ))}

              <motion.div variants={mobileItem} className="py-2">
                <SearchForm mobile />
              </motion.div>

              <motion.div variants={mobileItem}>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-blue-700 active:scale-[0.98]"
                >
                  Login
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
