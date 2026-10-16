
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
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
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../component/AuthProvider";
import logo from "../assets/ogo.png";

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
      /*
       * BACKEND INTEGRATION:
       * Replace login() with POST /api/auth/login or /api/auth/register.
       * Send the password to your backend over HTTPS.
       * Never save the password in localStorage.
       * Display errors returned by the API if authentication fails.
       */
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
      toast.error(error.message || "Something went wrong. Please try again.");
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
    <main className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-slate-50 px-4 py-10 sm:px-6 sm:py-14">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 size-80 rounded-full bg-blue-200/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 size-96 rounded-full bg-indigo-200/30 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-xl shadow-slate-200/60 md:grid-cols-2">
        {/* Left brand panel */}
        <motion.section
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden bg-slate-950 p-9 text-white md:flex lg:p-12"
        >
          <div
            aria-hidden="true"
            className="absolute -right-28 top-20 size-80 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute -right-16 top-32 size-56 rounded-full border border-white/10"
          />

          <Link to="/" className="relative inline-flex w-fit rounded-xl bg-white px-3 py-2">
            <img
              src={logo}
              alt="Rentora"
              className="h-9 w-auto max-w-44 object-contain"
            />
          </Link>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mb-7 flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-blue-300 backdrop-blur"
            >
              <CarFront size={32} />
            </motion.div>

            <h1 className="max-w-sm text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              Every journey
              <span className="block text-blue-400">starts here.</span>
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
              Find the right car for every road ahead. Your next
              adventure is closer than you think.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["A", "R", "S"].map((letter, index) => (
                  <div
                    key={letter}
                    className={`flex size-9 items-center justify-center rounded-full border-2 border-slate-950 text-xs font-bold ${
                      index === 0
                        ? "bg-blue-200 text-blue-900"
                        : index === 1
                          ? "bg-indigo-200 text-indigo-900"
                          : "bg-slate-200 text-slate-800"
                    }`}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-300">
                A smoother way to get moving
              </p>
            </div>
          </div>

          <p className="relative text-xs text-slate-400">
            © {new Date().getFullYear()} Rentora. Drive your way.
          </p>
        </motion.section>

        {/* Form panel */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12"
        >
          <Link
            to="/"
            className="mb-7 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-blue-600 md:hidden"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <div className="mb-8">
            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              {mode === "login" ? (
                <LockKeyhole size={23} />
              ) : (
                <UserRound size={23} />
              )}
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {mode === "login"
                ? "Sign in to continue your journey with Rentora."
                : "Join Rentora and make your next trip easier."}
            </p>
          </div>

          {/* Mode switch */}
          <div className="mb-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            {[
              { label: "Login", value: "login" },
              { label: "Create account", value: "signup" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => switchMode(item.value)}
                className={`relative rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  mode === item.value
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: mode === "login" ? -8 : 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {mode === "signup" && (
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <UserRound
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
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
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
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
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  {mode === "login" && (
                    <span className="text-xs text-slate-400">
                      Minimum 8 characters
                    </span>
                  )}
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Confirm password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
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
                    <input
                      type="checkbox"
                      className="size-4 rounded border-slate-300 accent-blue-600"
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      toast("Password reset will be available after backend setup.")
                    }
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {mode === "signup" && (
                <p className="text-xs leading-5 text-slate-500">
                  By creating an account, you agree to Rentora's terms
                  and privacy policy.
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Please wait..."
                  : mode === "login"
                    ? "Sign in to Rentora"
                    : "Create account"}

                {!submitting && (
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-500">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() =>
                switchMode(mode === "login" ? "signup" : "login")
              }
              className="font-semibold text-blue-600 transition hover:text-blue-700"
            >
              {mode === "login" ? "Create one here" : "Login here"}
            </button>
          </p>

          <p className="mt-7 text-center text-xs leading-5 text-slate-400">
            Protected demo interface · Real account verification requires
            a backend connection.
          </p>
        </motion.section>
      </div>
    </main>
  );
};

export default Login;
