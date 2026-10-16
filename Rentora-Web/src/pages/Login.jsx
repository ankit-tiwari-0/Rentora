
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CarFront,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  MapPin,
  Gauge,
  Sparkles,
  Users,
  Star,
  Compass,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../component/AuthProvider";
import logo from "../assets/ogo.png";
import carImage from "../assets/car-heroo.png";

const Login = () => {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const reduceMotion = useReducedMotion();

  const redirectTo = location.state?.from || "/";

  const updateField = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setShowPassword(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (mode === "signup") {
      if (!form.name.trim()) {
        toast.error("Please enter your full name.");
        return;
      }

      if (password !== form.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
    }

    setSubmitting(true);

    try {
      // Replace with your real backend authentication API.
      await login({
        name: mode === "signup" ? form.name.trim() : "",
        email,
      });

      toast.success(
        mode === "signup"
          ? "Demo account created successfully!"
          : "Welcome back to Rentora!"
      );

      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5">
        <div className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <ShieldCheck size={28} />
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            You're already signed in
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Your Rentora demo session is active.
          </p>

          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Continue to Rentora
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#081329] p-3 sm:p-5 lg:p-8">
      {/* Ambient page lighting */}
      <div className="pointer-events-none absolute -left-32 top-10 size-96 rounded-full bg-blue-600/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-96 rounded-full bg-violet-600/25 blur-[120px]" />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto grid w-full max-w-[1400px] overflow-hidden rounded-[24px] border border-white/20 bg-white shadow-2xl shadow-black/30 md:grid-cols-[1.25fr_1fr] lg:min-h-[min(850px,calc(100vh-64px))]"
      >
        {/* ================= LEFT CINEMATIC PANEL ================= */}
        <section className="relative hidden min-h-[700px] flex-col overflow-hidden bg-[#061126] text-white md:flex">
          {/* Sky gradient */}
          <motion.div
            className="absolute inset-0"
            animate={
              reduceMotion
                ? {}
                : { backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }
            }
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage:
                "linear-gradient(145deg,#061126 0%,#102858 35%,#101631 65%,#200e36 100%)",
              backgroundSize: "200% 200%",
            }}
          />

          {/* Stars */}
          {Array.from({ length: 45 }, (_, i) => (
            <motion.span
              key={i}
              className="absolute size-[2px] rounded-full bg-white"
              style={{
                left: `${(i * 37 + 7) % 97}%`,
                top: `${(i * 23 + 4) % 60}%`,
              }}
              animate={
                reduceMotion
                  ? {}
                  : { opacity: [0.1, 0.9, 0.1], scale: [0.7, 1.5, 0.7] }
              }
              transition={{
                duration: 2 + (i % 4),
                delay: (i % 5) * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Distant mountain silhouettes */}
          <svg
            className="absolute inset-x-0 top-[23%] h-[48%] w-full opacity-70"
            viewBox="0 0 900 400"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="mountains" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#425b98" />
                <stop offset="1" stopColor="#0b142b" />
              </linearGradient>
            </defs>
            <path
              d="M0 180 L100 100 L160 155 L260 45 L350 145 L445 65 L540 170 L650 40 L735 150 L820 80 L900 145 V400 H0Z"
              fill="url(#mountains)"
              opacity=".45"
            />
            <path
              d="M0 245 L125 170 L220 220 L350 135 L450 225 L570 140 L680 235 L790 155 L900 220 V400 H0Z"
              fill="#101b38"
            />
          </svg>

          {/* Horizon glow */}
          <motion.div
            className="absolute left-0 right-0 top-[43%] h-32 bg-gradient-to-r from-transparent via-orange-300/20 to-transparent blur-2xl"
            animate={reduceMotion ? {} : { opacity: [0.35, 0.8, 0.35] }}
            transition={{ duration: 5, repeat: Infinity }}
          />

          {/* Animated road */}
          <div className="absolute inset-x-0 bottom-0 h-[53%] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#071329]/40 to-[#030713]" />

            <svg
              viewBox="0 0 900 480"
              preserveAspectRatio="none"
              className="absolute inset-0 size-full"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="blueRoad" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#38bdf8" stopOpacity="0" />
                  <stop offset=".55" stopColor="#38bdf8" />
                  <stop offset="1" stopColor="#60a5fa" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="purpleRoad" x1="1" y1="0" x2="0" y2="1">
                  <stop stopColor="#c084fc" stopOpacity="0" />
                  <stop offset=".55" stopColor="#a855f7" />
                  <stop offset="1" stopColor="#ec4899" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path
                d="M350 -30 C400 80 650 130 580 245 S700 380 870 520"
                stroke="url(#blueRoad)"
                strokeWidth="3"
              />
              <path
                d="M490 -30 C450 100 250 160 330 270 S220 400 70 520"
                stroke="url(#purpleRoad)"
                strokeWidth="3"
              />
              <path
                d="M415 -20 C460 90 430 190 450 270 S490 410 460 520"
                stroke="#7dd3fc"
                strokeOpacity=".6"
                strokeWidth="2"
                strokeDasharray="10 20"
              />
            </svg>

            {/* Fast light trails */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                className="absolute h-[2px] rounded-full"
                style={{
                  left: `${(i * 17) % 75}%`,
                  top: `${25 + i * 10}%`,
                  width: `${25 + (i % 3) * 13}%`,
                  background:
                    i % 2
                      ? "linear-gradient(90deg,transparent,#c084fc,transparent)"
                      : "linear-gradient(90deg,transparent,#38bdf8,transparent)",
                  boxShadow: "0 0 14px rgba(56,189,248,.7)",
                }}
                animate={
                  reduceMotion
                    ? {}
                    : { x: [-100, 140], opacity: [0, 1, 0] }
                }
                transition={{
                  duration: 2 + i * 0.45,
                  delay: i * 0.35,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          {/* Brand header */}
          <div className="relative z-20 flex items-center justify-between p-7 lg:p-9">
            <Link
              to="/"
              className="rounded-xl bg-white px-3 py-2 shadow-xl transition hover:scale-105"
            >
              <img
                src={logo}
                alt="Rentora"
                className="h-9 w-auto max-w-44 object-contain"
              />
            </Link>

            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-blue-100 backdrop-blur-lg">
              <motion.span
                animate={reduceMotion ? {} : { opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="size-1.5 rounded-full bg-cyan-300"
              />
              Find your freedom
            </div>
          </div>

          {/* Main copy */}
          <div className="relative z-10 px-7 lg:px-11">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="mb-4 flex items-center gap-3 text-[10px] font-semibold tracking-[0.35em] text-blue-200"
            >
              <span className="h-px w-7 bg-cyan-300" />
              EXPLORE · DRIVE · BELONG
            </motion.p>

            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[520px] text-4xl font-black leading-[1.03] tracking-[-0.055em] lg:text-[58px]"
            >
              More Roads.
              <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Brighter Stories.
              </span>
            </motion.h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7 }}
              className="mt-5 max-w-[370px] text-sm leading-6 text-slate-300"
            >
              Premium cars. Seamless bookings. Unforgettable journeys.
              Join Rentora and turn every trip into a story worth telling.
            </motion.p>

            {/* Feature highlights */}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
              {[
                { icon: CarFront, title: "Wide Range", subtitle: "of Vehicles" },
                { icon: ShieldCheck, title: "Safe &", subtitle: "Reliable" },
                { icon: MapPin, title: "Explore", subtitle: "New Destinations" },
              ].map(({ icon: Icon, title, subtitle }, i) => (
                <motion.div
                  key={title}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.12, duration: 0.5 }}
                  whileHover={reduceMotion ? {} : { y: -4 }}
                  className="flex items-center gap-2.5"
                >
                  <div className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/[0.07] text-cyan-200 backdrop-blur-lg">
                    <Icon size={17} />
                  </div>
                  <div className="text-[10px] leading-4">
                    <p className="font-semibold text-white">{title}</p>
                    <p className="text-slate-400">{subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Vehicle showcase */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 90 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute inset-x-[-7%] bottom-[72px] z-[3] h-[42%] sm:h-[45%]"
          >
            <motion.div
              className="absolute inset-x-[18%] bottom-8 h-10 rounded-full bg-blue-500/30 blur-2xl"
              animate={reduceMotion ? {} : { opacity: [0.4, 0.9, 0.4], scaleX: [0.9, 1.1, 0.9] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <motion.img
              src={carImage}
              alt="Luxury car on a scenic drive"
              className="relative h-full w-full object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)]"
              animate={reduceMotion ? {} : { y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Headlight sweep */}
            <motion.div
              className="absolute inset-y-0 w-16 rotate-[18deg] bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm"
              animate={reduceMotion ? {} : { x: ["-150%", "850%"] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                repeatDelay: 2.5,
                ease: "linear",
              }}
            />
          </motion.div>

          {/* Floating destination card */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 25, y: 12 }}
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, x: 0, y: [0, -7, 0] }
            }
            transition={{
              opacity: { delay: 1, duration: 0.6 },
              x: { delay: 0.8, duration: 0.6 },
              y: { delay: 1.3, duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute right-6 top-[37%] z-10 hidden w-[125px] rounded-2xl border border-white/20 bg-slate-900/60 p-3 backdrop-blur-xl lg:block"
          >
            <div className="mb-3 flex items-center justify-between">
              <Sparkles size={15} className="text-cyan-300" />
              <span className="text-[9px] uppercase tracking-widest text-slate-300">
                Discover
              </span>
            </div>
            <p className="text-xs font-semibold">Your next escape</p>
            <p className="mt-1 text-[10px] leading-4 text-slate-400">
              One booking away.
            </p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                animate={reduceMotion ? {} : { width: ["20%", "100%", "35%"] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Glass statistics card */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7 }}
            className="absolute inset-x-5 bottom-5 z-20 grid grid-cols-3 rounded-2xl border border-white/20 bg-[#071124]/75 p-3 shadow-2xl backdrop-blur-2xl sm:inset-x-7 sm:bottom-7 sm:p-4 lg:inset-x-9"
          >
            {[
              { icon: Users, value: "10K+", label: "Happy Customers" },
              { icon: Star, value: "4.8", label: "Average Rating" },
              { icon: Compass, value: "50+", label: "Destinations" },
            ].map(({ icon: Icon, value, label }, i) => (
              <div
                key={label}
                className={`flex min-w-0 items-center justify-center gap-2 sm:gap-3 ${
                  i ? "border-l border-white/15" : ""
                }`}
              >
                <div className="hidden size-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-cyan-200 sm:flex">
                  <Icon size={17} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold sm:text-lg">{value}</p>
                  <p className="mt-0.5 text-[9px] leading-4 text-slate-400 sm:text-[10px]">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ================= RIGHT AUTH PANEL ================= */}
        <section className="relative flex min-w-0 flex-col justify-center overflow-hidden bg-white px-6 py-9 sm:px-10 lg:px-12 lg:py-12">
          {/* Decorative corner */}
          <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-gradient-to-br from-blue-50 to-violet-100/80" />
          <div className="pointer-events-none absolute -right-10 top-24 size-32 rounded-full border border-blue-100/70" />

          <div className="relative z-10">
            {/* Mobile logo */}
            <Link to="/" className="mb-8 inline-flex md:hidden">
              <img src={logo} alt="Rentora" className="h-10 w-auto max-w-40 object-contain" />
            </Link>

            <div className="mb-7">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-violet-100 text-blue-600"
              >
                {mode === "login" ? <LockKeyhole size={23} /> : <UserRound size={23} />}
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode + "-title"}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-blue-600">
                    START YOUR JOURNEY
                  </p>

                  <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                    {mode === "login" ? (
                      <>Welcome <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">back.</span></>
                    ) : (
                      <>Join <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Rentora.</span></>
                    )}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {mode === "login"
                      ? "Sign in to continue your journey with Rentora."
                      : "Create your account and make your next trip easier."}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Animated mode switch */}
            <div className="mb-7 grid grid-cols-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
              {[
                { label: "Login", value: "login" },
                { label: "Create account", value: "signup" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => switchMode(item.value)}
                  className={`relative rounded-xl px-3 py-3 text-xs font-semibold transition-colors sm:text-sm ${
                    mode === item.value ? "text-white" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {mode === item.value && (
                    <motion.span
                      layoutId="rentora-auth-tab"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg shadow-blue-600/20"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Login / signup fields */}
            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                onSubmit={handleSubmit}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="space-y-5"
              >
                {mode === "signup" && (
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                      Full name
                    </label>
                    <div className="group relative">
                      <UserRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" />
                      <input
                        id="name"
                        name="name"
                        autoComplete="name"
                        value={form.name}
                        onChange={updateField}
                        placeholder="Enter your full name"
                        required
                        className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                    Email address
                  </label>
                  <div className="group relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={updateField}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                      Password
                    </label>
                    {mode === "login" && (
                      <span className="text-[11px] text-slate-400">Minimum 8 characters</span>
                    )}
                  </div>
                  <div className="group relative">
                    <LockKeyhole size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      value={form.password}
                      onChange={updateField}
                      placeholder="Enter your password"
                      minLength={8}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {mode === "signup" && (
                  <div>
                    <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-slate-700">
                      Confirm password
                    </label>
                    <div className="group relative">
                      <LockKeyhole size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={form.confirmPassword}
                        onChange={updateField}
                        placeholder="Enter your password again"
                        minLength={8}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>
                )}

                {mode === "login" && (
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <label className="flex items-center gap-2 text-slate-500">
                      <input type="checkbox" className="size-4 rounded border-slate-300 accent-blue-600" />
                      Remember me
                    </label>
                    <button
                      type="button"
                      onClick={() => toast("Password reset will be available after backend setup.")}
                      className="font-semibold text-blue-600 transition hover:text-violet-600"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {mode === "signup" && (
                  <p className="text-xs leading-5 text-slate-500">
                    By creating an account, you agree to Rentora's terms and privacy policy.
                  </p>
                )}

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={reduceMotion || submitting ? {} : { y: -2 }}
                  whileTap={reduceMotion || submitting ? {} : { scale: 0.99 }}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:shadow-xl hover:shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Please wait..."
                    : mode === "login"
                      ? "Sign in to Rentora"
                      : "Create account"}

                  {!submitting && (
                    <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                  )}
                </motion.button>
              </motion.form>
            </AnimatePresence>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">OR</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Account switch */}
            <p className="text-center text-sm text-slate-500">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                className="font-semibold text-blue-600 transition hover:text-violet-600"
              >
                {mode === "login" ? "Create one here" : "Login here"}
              </button>
            </p>

            {/* Security note */}
            <div className="mt-8 flex items-center justify-center gap-2 text-center text-[11px] leading-5 text-slate-400">
              <ShieldCheck size={14} className="shrink-0 text-emerald-500" />
              <span>Demo interface. Real account verification requires a backend connection.</span>
            </div>

            <Link
              to="/"
              className="mt-5 hidden items-center justify-center gap-2 text-xs text-slate-400 transition hover:text-blue-600 md:flex"
            >
              <ArrowLeft size={14} />
              Back to Rentora
            </Link>
          </div>
        </section>
      </motion.div>
    </main>
  );
};

export default Login;
