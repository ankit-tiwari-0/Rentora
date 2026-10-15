import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  PlusCircle,
  CarFront,
  ClipboardList,
  Menu,
  X,
  ChevronRight,
  LogOut,
} from "lucide-react";

import logo from "../assets/ogo.png";

const ownerLinks = [
  {
    label: "Dashboard",
    path: "/owner",
    icon: LayoutDashboard,
  },
  {
    label: "Add Car",
    path: "/owner/add-car",
    icon: PlusCircle,
  },
  {
    label: "Manage Cars",
    path: "/owner/manage-cars",
    icon: CarFront,
  },
  {
    label: "Manage Bookings",
    path: "/owner/manage-bookings",
    icon: ClipboardList,
  },
];

const OwnerNavbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/owner") {
      return location.pathname === "/owner";
    }

    return location.pathname.startsWith(path);
  };

  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0.7 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 280,
        damping: 28,
      },
    },
    exit: {
      x: "-100%",
      opacity: 0.7,
      transition: { duration: 0.22 },
    },
  };

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <>
      {/* Top navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            to="/owner"
            aria-label="Rentora owner dashboard"
            className="flex shrink-0 items-center"
          >
            <motion.img
              src={logo}
              alt="Rentora"
              whileHover={{ scale: 1.035 }}
              transition={{ duration: 0.2 }}
              className="h-9 w-auto max-w-[155px] object-contain object-left"
            />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-7 md:flex">
            <Link
              to="/"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              to="/cars"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
            >
              Cars
            </Link>

            <Link
              to="/my-bookings"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
            >
              My Bookings
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 sm:inline-flex">
              Owner Portal
            </span>

            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50 md:hidden"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Owner sidebar and dashboard layout */}
      <div className="relative flex min-h-[calc(100vh-68px)] bg-[#fafbfc]">
        {/* Desktop sidebar */}
        <aside className="sticky top-[68px] hidden h-[calc(100vh-68px)] w-[250px] shrink-0 border-r border-slate-200 bg-white md:block lg:w-[270px]">
          <div className="flex h-full flex-col">
            {/* Owner profile */}
            <div className="flex flex-col items-center border-b border-slate-100 px-5 py-7">
              <motion.div
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.2 }}
                className="flex size-[58px] items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-xl font-bold text-blue-700 ring-4 ring-blue-50"
              >
                RS
              </motion.div>

              <h2 className="mt-3 text-sm font-semibold text-slate-900">
                Richard Sanford
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Vehicle Owner
              </p>

              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Account active
              </span>
            </div>

            {/* Sidebar navigation */}
            <nav className="flex-1 space-y-1.5 px-3 py-5">
              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Workspace
              </p>

              {ownerLinks.map(({ label, path, icon: Icon }) => {
                const active = isActive(path);

                return (
                  <Link
                    key={path}
                    to={path}
                    className={`relative flex items-center gap-3 overflow-hidden rounded-xl px-3.5 py-3 text-sm font-medium transition-colors duration-200 ${
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="owner-active-indicator"
                        className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-blue-600"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}

                    <Icon
                      size={18}
                      className={
                        active ? "text-blue-600" : "text-slate-400"
                      }
                    />

                    <span>{label}</span>

                    {active && (
                      <motion.span
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-auto"
                      >
                        <ChevronRight size={16} />
                      </motion.span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Sidebar footer */}
            <div className="border-t border-slate-100 p-4">
              <Link
                to="/"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <LogOut size={18} />
                Back to website
              </Link>

              <p className="mt-3 px-3 text-[10px] text-slate-400">
                Rentora Owner Portal · {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile sidebar backdrop and drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.button
                type="button"
                aria-label="Close navigation menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMobileMenu}
                className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[2px] md:hidden"
              />

              <motion.aside
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed bottom-0 left-0 top-[68px] z-50 flex w-[min(85vw,300px)] flex-col border-r border-slate-200 bg-white shadow-2xl md:hidden"
              >
                {/* Mobile profile */}
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-6">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 font-bold text-blue-700">
                    RS
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-slate-900">
                      Richard Sanford
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Vehicle Owner
                    </p>
                  </div>
                </div>

                {/* Mobile navigation */}
                <nav className="flex-1 space-y-1.5 px-3 py-5">
                  <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Workspace
                  </p>

                  {ownerLinks.map(({ label, path, icon: Icon }) => {
                    const active = isActive(path);

                    return (
                      <Link
                        key={path}
                        to={path}
                        onClick={closeMobileMenu}
                        className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors ${
                          active
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Icon
                          size={18}
                          className={
                            active ? "text-blue-600" : "text-slate-400"
                          }
                        />
                        {label}
                        {active && (
                          <ChevronRight size={16} className="ml-auto" />
                        )}
                      </Link>
                    );
                  })}
                </nav>

                <div className="border-t border-slate-100 p-4">
                  <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50"
                  >
                    <LogOut size={18} />
                    Back to website
                  </Link>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main page content will be added here later */}
        <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mx-auto max-w-7xl"
          >
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                Rentora workspace
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {ownerLinks.find((item) => isActive(item.path))?.label ??
                  "Owner Dashboard"}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage your vehicles, monitor reservations, and keep your
                rental business organized.
              </p>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-12">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <CarFront size={26} />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                Your workspace is ready
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                This is the owner portal layout. We'll build the dashboard,
                add-car form, vehicle management, and booking management
                screens inside this workspace next.
              </p>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default OwnerNavbar;
