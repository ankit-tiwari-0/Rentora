
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  PlusCircle,
  CarFront,
  ClipboardList,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", path: "/owner", icon: LayoutDashboard },
  { label: "Add Car", path: "/owner/add-car", icon: PlusCircle },
  { label: "Manage Cars", path: "/owner/manage-cars", icon: CarFront },
  {
    label: "Manage Bookings",
    path: "/owner/manage-bookings",
    icon: ClipboardList,
  },
];

const OwnerSidebar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) =>
    path === "/owner"
      ? location.pathname === "/owner"
      : location.pathname.startsWith(path);

  const links = navigation.map(({ label, path, icon: Icon }) => {
    const active = isActive(path);

    return (
      <Link
        key={path}
        to={path}
        onClick={() => setMobileOpen(false)}
        className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
          active
            ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/60"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        {active && (
          <motion.span
            layoutId="owner-sidebar-indicator"
            className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-blue-600"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}

        <Icon
          size={18}
          strokeWidth={active ? 2.2 : 1.8}
          className={`shrink-0 transition-colors ${
            active
              ? "text-blue-600"
              : "text-slate-400 group-hover:text-slate-700"
          }`}
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
  });

  const profile = (
    <div className="flex flex-col items-center border-b border-slate-100 px-4 py-7">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white shadow-lg shadow-blue-500/20"
      >
        RS
      </motion.div>

      <h2 className="mt-3 text-sm font-semibold text-slate-900">
        Richard Sanford
      </h2>

      <p className="mt-1 text-xs text-slate-500">Vehicle Owner</p>

      <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Account active
      </span>
    </div>
  );

  const sidebarContent = (
    <>
      {profile}

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Workspace
        </p>

        {links}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <LogOut size={18} />
          Back to website
        </Link>

        <p className="mt-3 px-3 text-[10px] text-slate-400">
          Rentora Owner Portal · {new Date().getFullYear()}
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-[250px] shrink-0 flex-col border-r border-slate-200/80 bg-white md:flex">
        {sidebarContent}
      </aside>

      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open owner sidebar"
        className="fixed bottom-5 left-4 z-30 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 active:scale-95 md:hidden"
      >
        <Menu size={18} />
        Owner menu
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close sidebar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm md:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="fixed bottom-0 left-0 top-16 z-50 flex w-[min(85vw,300px)] flex-col border-r border-slate-200 bg-white shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-sm font-semibold text-slate-800">
                  Owner Workspace
                </span>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close sidebar"
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default OwnerSidebar;
