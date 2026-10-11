import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import logo from "../assets/ogo.png";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Cars", to: "/cars" },
  { label: "My Bookings", to: "/my-bookings" },
  { label: "List Cars", to: "/owner" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 64rem)");

    const handleResize = (event) => {
      if (event.matches) setMenuOpen(false);
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

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
    "rentora-nav-link group relative rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-300 hover:bg-blue-50/80 hover:text-blue-600";

  const SearchForm = ({ mobile = false }) => (
    <form
      onSubmit={handleSearch}
      className={`flex h-11 items-center rounded-full border border-slate-300 bg-white/70 transition-all duration-300 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-md focus-within:shadow-blue-500/10 focus-within:ring-2 focus-within:ring-blue-500/15 ${
        mobile ? "w-full px-4" : "w-60 px-3"
      }`}
    >
      <input
        type="search"
        name="search"
        placeholder="Search cars"
        aria-label="Search cars"
        className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
      />

      <button
        type="submit"
        aria-label="Submit car search"
        className="rounded-full p-1.5 text-slate-500 transition-all duration-200 hover:scale-110 hover:text-blue-600 active:scale-90"
      >
        <Search size={19} />
      </button>
    </form>
  );

  const AnimatedLink = ({ label, to, index = 0, mobile = false }) => (
    <Link
      to={to}
      onClick={mobile ? closeMenu : undefined}
      tabIndex={mobile && !menuOpen ? -1 : undefined}
      className={`${linkStyles} ${mobile ? "block w-full" : "rentora-link-reveal"}`}
      style={
        !mobile
          ? { animationDelay: `${1100 + index * 300}ms` }
          : undefined
      }
    >
      {label}

      {!mobile && (
        <span className="absolute inset-x-3 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-transform duration-300 ease-out group-hover:scale-x-100" />
      )}
    </Link>
  );

  return (
    <nav className="rentora-navbar-enter sticky top-0 z-50 w-full border-b border-slate-200/80 bg-[#f0f4f9]/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          to="/"
          onClick={closeMenu}
          aria-label="Rentora home"
          className="rentora-logo-reveal group shrink-0"
        >
          <img
            src={logo}
            alt="Rentora"
            className="h-10 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-[1.04] sm:h-12"
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-2 lg:flex xl:gap-4">
          {navLinks.slice(0, 3).map(({ label, to }, index) => (
            <AnimatedLink
              key={to}
              label={label}
              to={to}
              index={index}
            />
          ))}

          <div
            className="rentora-control-reveal"
            style={{ animationDelay: "2s" }}
          >
            <SearchForm />
          </div>

          <AnimatedLink
            label="List cars"
            to="/owner"
            index={3}
          />

          <Link
            to="/login"
            className="rentora-control-reveal ml-2 inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 active:translate-y-0 active:scale-[0.98]"
            style={{ animationDelay: "2.6s" }}
          >
            Login
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="inline-flex size-10 items-center justify-center rounded-xl text-slate-700 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600 active:scale-90 lg:hidden"
        >
          {menuOpen ? (
            <X size={25} strokeWidth={1.7} />
          ) : (
            <Menu size={25} strokeWidth={1.7} />
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        id="mobile-navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden ${
          menuOpen
            ? "grid-rows-[1fr] border-t border-slate-200 opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`space-y-1 px-4 pb-5 pt-3 sm:px-6 ${
              menuOpen ? "rentora-menu-reveal" : ""
            }`}
          >
            {navLinks.map(({ label, to }, index) => (
              <div
                key={to}
                style={
                  menuOpen
                    ? {
                        animation:
                          `rentora-link-reveal 400ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 60}ms both`,
                      }
                    : undefined
                }
              >
                <AnimatedLink label={label} to={to} mobile />
              </div>
            ))}

            <div className="py-2">
              <SearchForm mobile />
            </div>

            <Link
              to="/login"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
              className="flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-blue-700 active:scale-[0.98]"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
