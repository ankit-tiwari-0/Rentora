import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  SlidersHorizontal,
  CalendarDays,
  ClipboardList,
  X,
  AlertTriangle,
  CarFront,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAppContext } from "../../context/Appcontext";

const statusStyles = {
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  completed: "bg-blue-50 text-blue-700 ring-blue-100",
  pending: "bg-amber-50 text-amber-700 ring-amber-100",
  cancelled: "bg-red-50 text-red-600 ring-red-100",
  canceled: "bg-red-50 text-red-600 ring-red-100",
  rejected: "bg-red-50 text-red-600 ring-red-100",
};

const normalizeStatus = (status) =>
  String(status || "pending").toLowerCase();

const formatStatus = (status) => {
  const normalized = normalizeStatus(status);
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const getStatusStyle = (status) =>
  statusStyles[normalizeStatus(status)] ||
  "bg-slate-50 text-slate-600 ring-slate-100";

const formatDate = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateRange = (start, end) =>
  `${formatDate(start)} – ${formatDate(end)}`;

const formatPrice = (amount, currency = "₹") =>
  `${currency}${Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

const ManageBooking = () => {
  const {
    fetchOwnerBookings,
    changeBookingStatus,
    currency = "₹",
  } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelBooking, setCancelBooking] = useState(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const result = await fetchOwnerBookings();
      setBookings(Array.isArray(result) ? result : []);
    } catch (error) {
      setLoadError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  }, [fetchOwnerBookings]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const car =
        booking.car && typeof booking.car === "object" ? booking.car : {};
      const customer =
        booking.user && typeof booking.user === "object" ? booking.user : {};

      const bookingId = String(booking._id || "");
      const carName =
        [car.brand, car.model].filter(Boolean).join(" ") || "Vehicle";
      const customerName =
        customer.name ||
        customer.fullName ||
        customer.username ||
        customer.email ||
        "Customer";

      const matchesSearch =
        carName.toLowerCase().includes(query) ||
        customerName.toLowerCase().includes(query) ||
        bookingId.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        normalizeStatus(booking.status) === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const updateStatus = async (booking, status) => {
    const bookingId = booking?._id;
    if (!bookingId) {
      toast.error("Booking ID is missing");
      return;
    }

    setUpdatingId(bookingId);
    try {
      await changeBookingStatus({ bookingId, status });
      await loadBookings();
      setCancelBooking(null);
      setSelectedBooking(null);
    } catch {
      // Context function shows the API error toast.
    } finally {
      setUpdatingId("");
    }
  };

  const summaryCards = [
    {
      label: "All bookings",
      value: bookings.length,
      color: "bg-blue-50 text-blue-600",
      icon: ClipboardList,
    },
    {
      label: "Confirmed",
      value: bookings.filter((b) => normalizeStatus(b.status) === "confirmed").length,
      color: "bg-emerald-50 text-emerald-600",
      icon: CalendarDays,
    },
    {
      label: "Pending",
      value: bookings.filter((b) => normalizeStatus(b.status) === "pending").length,
      color: "bg-amber-50 text-amber-600",
      icon: AlertTriangle,
    },
    {
      label: "Completed",
      value: bookings.filter((b) => normalizeStatus(b.status) === "completed").length,
      color: "bg-indigo-50 text-indigo-600",
      icon: ClipboardList,
    },
  ];

  const renderBookingActions = (booking) => {
    const status = normalizeStatus(booking.status);
    const canChangeStatus = ["confirmed", "pending"].includes(status);
    const isUpdating = updatingId === booking._id;

    return (
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setSelectedBooking(booking)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          View
        </button>

        {status === "pending" && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => updateStatus(booking, "confirmed")}
            className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Confirm"}
          </button>
        )}

        {canChangeStatus && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => setCancelBooking(booking)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Cancel"}
          </button>
        )}
      </div>
    );
  };

  const getCarDetails = (booking) => {
    const car = booking.car && typeof booking.car === "object" ? booking.car : {};
    return {
      car,
      carName: [car.brand, car.model].filter(Boolean).join(" ") || "Vehicle",
      customer:
        booking.user && typeof booking.user === "object"
          ? booking.user
          : {},
    };
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
            <ClipboardList size={16} />
            Reservation management
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Manage Bookings
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Track customer reservations, review pending requests, and manage booking statuses from one place.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm sm:self-auto">
          <CalendarDays size={17} className="text-blue-600" />
          {loading ? "Loading..." : `${bookings.length} total bookings`}
        </div>
      </motion.div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summaryCards.map(({ label, value, color, icon: Icon }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="text-xs text-slate-500 sm:text-sm">{label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {loading ? "..." : value}
              </p>
            </div>
            <div className={`flex size-10 items-center justify-center rounded-xl ${color}`}>
              <Icon size={19} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search car, customer, or booking ID..."
            aria-label="Search bookings"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <div className="relative sm:w-52">
          <SlidersHorizontal
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter bookings by status"
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          >
            {["All", "Confirmed", "Pending", "Completed", "Cancelled"].map((status) => (
              <option key={status} value={status}>
                {status === "All" ? "All statuses" : status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          <p className="text-sm text-slate-500">Loading owner bookings...</p>
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
          <p className="font-semibold text-red-700">{loadError}</p>
          <button
            type="button"
            onClick={loadBookings}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">All reservations</h2>
            <p className="mt-1 text-xs text-slate-500">
              {filteredBookings.length} {filteredBookings.length === 1 ? "booking" : "bookings"} found
            </p>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  {["Car", "Date Range", "Total", "Status", "Actions"].map((heading) => (
                    <th
                      key={heading}
                      className={`px-5 py-4 text-xs font-semibold text-slate-500 ${heading === "Actions" ? "text-right" : ""}`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {filteredBookings.map((booking) => {
                    const { car, carName, customer } = getCarDetails(booking);
                    const bookingId = booking._id || "";
                    const customerName =
                      customer.name || customer.fullName || customer.username || customer.email || "Customer";
                    const status = normalizeStatus(booking.status);

                    return (
                      <motion.tr
                        key={bookingId}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.2 }}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            {car.image ? (
                              <img src={car.image} alt={carName} loading="lazy" className="size-12 shrink-0 rounded-lg border border-slate-200 bg-slate-100 object-cover" />
                            ) : (
                              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                                <CarFront size={22} />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{carName}</p>
                              <p className="mt-1 text-xs text-slate-400">
                                {bookingId.slice(-8).toUpperCase()} · {customerName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-600">
                          {formatDateRange(booking.pickupDate, booking.returnDate)}
                        </td>
                        <td className="px-5 py-3 text-sm font-semibold text-slate-800">
                          {formatPrice(booking.price, currency)}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(status)}`}>
                            {formatStatus(status)}
                          </span>
                        </td>
                        <td className="px-5 py-3">{renderBookingActions(booking)}</td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            <AnimatePresence initial={false}>
              {filteredBookings.map((booking) => {
                const { car, carName, customer } = getCarDetails(booking);
                const bookingId = booking._id || "";
                const customerName =
                  customer.name || customer.fullName || customer.username || customer.email || "Customer";
                const status = normalizeStatus(booking.status);

                return (
                  <motion.article
                    key={bookingId}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    className="p-4"
                  >
                    <div className="flex gap-3">
                      {car.image ? (
                        <img src={car.image} alt={carName} loading="lazy" className="size-20 shrink-0 rounded-xl border border-slate-200 bg-slate-100 object-cover" />
                      ) : (
                        <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                          <CarFront size={28} />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-slate-900">{carName}</h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {bookingId.slice(-8).toUpperCase()} · {customerName}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          {formatDateRange(booking.pickupDate, booking.returnDate)}
                        </p>
                        <p className="mt-2 text-sm font-bold text-slate-900">
                          {formatPrice(booking.price, currency)}
                        </p>
                        <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(status)}`}>
                          {formatStatus(status)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">{renderBookingActions(booking)}</div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredBookings.length === 0 && (
            <div className="px-5 py-16 text-center">
              <ClipboardList size={32} className="mx-auto text-slate-300" />
              <h3 className="mt-3 text-sm font-semibold text-slate-800">
                {bookings.length === 0 ? "No bookings yet" : "No bookings found"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {bookings.length === 0
                  ? "Customer reservations will appear here when someone books one of your cars."
                  : "Try another search or status filter."}
              </p>
              {bookings.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </motion.section>
      )}

      <p className="mt-4 text-xs leading-5 text-slate-400">
        Booking records are loaded from your Rentora backend.
      </p>

      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="booking-modal-title"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              {(() => {
                const { car, carName, customer } = getCarDetails(selectedBooking);
                const customerName =
                  customer.name || customer.fullName || customer.username || customer.email || "Customer";
                const status = normalizeStatus(selectedBooking.status);

                return (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-100 p-5">
                      <div>
                        <h2 id="booking-modal-title" className="text-lg font-bold text-slate-900">
                          Booking details
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                          #{String(selectedBooking._id || "").slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(null)}
                        aria-label="Close details"
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="p-5">
                      {car.image ? (
                        <img src={car.image} alt={carName} className="h-44 w-full rounded-xl bg-slate-100 object-cover" />
                      ) : (
                        <div className="flex h-44 w-full items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                          <CarFront size={42} />
                        </div>
                      )}
                      <h3 className="mt-4 text-base font-semibold text-slate-900">{carName}</h3>

                      <div className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-500">Customer</span>
                          <span className="text-right font-medium text-slate-800">{customerName}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-500">Pickup date</span>
                          <span className="font-medium text-slate-800">{formatDate(selectedBooking.pickupDate)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-500">Return date</span>
                          <span className="font-medium text-slate-800">{formatDate(selectedBooking.returnDate)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-500">Status</span>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(status)}`}>
                            {formatStatus(status)}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4 border-t border-slate-100 pt-3">
                          <span className="text-slate-500">Total price</span>
                          <span className="font-bold text-slate-900">
                            {formatPrice(selectedBooking.price, currency)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedBooking(null)}
                        className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        Close details
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cancelBooking && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCancelBooking(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="cancel-modal-title"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <AlertTriangle size={23} />
              </div>
              <h2 id="cancel-modal-title" className="mt-4 text-lg font-bold text-slate-900">
                Change booking status?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                This updates the booking status on the server. Confirm only if you intend to cancel this reservation.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCancelBooking(null)}
                  disabled={updatingId === cancelBooking._id}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Keep booking
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(cancelBooking, "cancelled")}
                  disabled={updatingId === cancelBooking._id}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updatingId === cancelBooking._id ? "Updating..." : "Confirm cancel"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageBooking;
