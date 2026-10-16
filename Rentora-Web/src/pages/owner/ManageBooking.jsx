import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  SlidersHorizontal,
  CalendarDays,
  ClipboardList,
  X,
  AlertTriangle,
  CarFront,
} from "lucide-react";

const initialBookings = [
  {
    id: "BK-1001",
    car: "Toyota Corolla",
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=300&q=80",
    startDate: "2026-10-10",
    endDate: "2026-10-15",
    total: 22475,
    status: "Confirmed",
    customer: "Aarav Sharma",
  },
  {
    id: "BK-1002",
    car: "Honda Civic",
    image:
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=300&q=80",
    startDate: "2026-10-11",
    endDate: "2026-10-16",
    total: 24475,
    status: "Completed",
    customer: "Priya Verma",
  },
  {
    id: "BK-1003",
    car: "BMW 3 Series",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=300&q=80",
    startDate: "2026-10-12",
    endDate: "2026-10-17",
    total: 47475,
    status: "Pending",
    customer: "Rohan Mehta",
  },
  {
    id: "BK-1004",
    car: "Tesla Model 3",
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=300&q=80",
    startDate: "2026-10-14",
    endDate: "2026-10-19",
    total: 59975,
    status: "Confirmed",
    customer: "Neha Kapoor",
  },
];

const statusStyles = {
  Confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Completed: "bg-blue-50 text-blue-700 ring-blue-100",
  Pending: "bg-amber-50 text-amber-700 ring-amber-100",
  Cancelled: "bg-red-50 text-red-600 ring-red-100",
};

const formatDate = (date) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatDateRange = (start, end) =>
  `${formatDate(start)} – ${formatDate(end)}`;

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const ManageBooking = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelBooking, setCancelBooking] = useState(null);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        booking.car.toLowerCase().includes(query) ||
        booking.customer.toLowerCase().includes(query) ||
        booking.id.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const confirmCancellation = () => {
    if (!cancelBooking) return;

    /*
     * BACKEND INTEGRATION:
     * Send a cancellation request to:
     * PATCH /api/owner/bookings/:id/cancel
     *
     * Verify that the booking can be cancelled on the server.
     * Update local state only after the API confirms success.
     */
    setBookings((previous) =>
      previous.map((booking) =>
        booking.id === cancelBooking.id
          ? { ...booking, status: "Cancelled" }
          : booking
      )
    );

    setCancelBooking(null);
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Heading */}
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
            Track customer reservations, review pending requests, and
            manage booking statuses from one place.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm sm:self-auto">
          <CalendarDays size={17} className="text-blue-600" />
          {bookings.length} total bookings
        </div>
      </motion.div>

      {/* Booking summary */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "All bookings",
            value: bookings.length,
            color: "bg-blue-50 text-blue-600",
            icon: ClipboardList,
          },
          {
            label: "Confirmed",
            value: bookings.filter((b) => b.status === "Confirmed").length,
            color: "bg-emerald-50 text-emerald-600",
            icon: CalendarDays,
          },
          {
            label: "Pending",
            value: bookings.filter((b) => b.status === "Pending").length,
            color: "bg-amber-50 text-amber-600",
            icon: AlertTriangle,
          },
          {
            label: "Completed",
            value: bookings.filter((b) => b.status === "Completed").length,
            color: "bg-indigo-50 text-indigo-600",
            icon: ClipboardList,
          },
        ].map(({ label, value, color, icon: Icon }, index) => (
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
                {value}
              </p>
            </div>

            <div className={`flex size-10 items-center justify-center rounded-xl ${color}`}>
              <Icon size={19} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and filters */}
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
            {["All", "Confirmed", "Pending", "Completed", "Cancelled"].map(
              (status) => (
                <option key={status} value={status}>
                  {status === "All" ? "All statuses" : status}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Bookings table */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">All reservations</h2>
          <p className="mt-1 text-xs text-slate-500">
            {filteredBookings.length}{" "}
            {filteredBookings.length === 1 ? "booking" : "bookings"} found
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                {["Car", "Date Range", "Total", "Status", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className={`px-5 py-4 text-xs font-semibold text-slate-500 ${
                        heading === "Actions" ? "text-right" : ""
                      }`}
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              <AnimatePresence initial={false}>
                {filteredBookings.map((booking) => (
                  <motion.tr
                    key={booking.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={booking.image}
                          alt={booking.car}
                          loading="lazy"
                          className="size-12 shrink-0 rounded-lg border border-slate-200 bg-slate-100 object-cover"
                        />

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {booking.car}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {booking.id} · {booking.customer}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3 text-sm text-slate-600">
                      {formatDateRange(booking.startDate, booking.endDate)}
                    </td>

                    <td className="px-5 py-3 text-sm font-semibold text-slate-800">
                      {formatPrice(booking.total)}
                    </td>

                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${
                          statusStyles[booking.status]
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(booking)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          View
                        </button>

                        {["Confirmed", "Pending"].includes(booking.status) && (
                          <button
                            type="button"
                            onClick={() => setCancelBooking(booking)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile booking cards */}
        <div className="divide-y divide-slate-100 md:hidden">
          <AnimatePresence initial={false}>
            {filteredBookings.map((booking) => (
              <motion.article
                key={booking.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="p-4"
              >
                <div className="flex gap-3">
                  <img
                    src={booking.image}
                    alt={booking.car}
                    loading="lazy"
                    className="size-20 shrink-0 rounded-xl border border-slate-200 bg-slate-100 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-slate-900">
                      {booking.car}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {booking.id} · {booking.customer}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      {formatDateRange(booking.startDate, booking.endDate)}
                    </p>

                    <p className="mt-2 text-sm font-bold text-slate-900">
                      {formatPrice(booking.total)}
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                        statusStyles[booking.status]
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBooking(booking)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    View details
                  </button>

                  {["Confirmed", "Pending"].includes(booking.status) && (
                    <button
                      type="button"
                      onClick={() => setCancelBooking(booking)}
                      className="rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Cancel booking
                    </button>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filteredBookings.length === 0 && (
          <div className="px-5 py-16 text-center">
            <ClipboardList size={32} className="mx-auto text-slate-300" />
            <h3 className="mt-3 text-sm font-semibold text-slate-800">
              No bookings found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try another search or status filter.
            </p>
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
          </div>
        )}
      </motion.section>

      <p className="mt-4 text-xs leading-5 text-slate-400">
        Sample bookings for UI development. Connect your backend to retrieve
        actual customer reservations.
      </p>

      {/* Booking details modal */}
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
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h2
                    id="booking-modal-title"
                    className="text-lg font-bold text-slate-900"
                  >
                    Booking details
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedBooking.id}
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
                <img
                  src={selectedBooking.image}
                  alt={selectedBooking.car}
                  className="h-44 w-full rounded-xl bg-slate-100 object-cover"
                />

                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  {selectedBooking.car}
                </h3>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Customer</span>
                    <span className="text-right font-medium text-slate-800">
                      {selectedBooking.customer}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Pickup date</span>
                    <span className="font-medium text-slate-800">
                      {formatDate(selectedBooking.startDate)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Return date</span>
                    <span className="font-medium text-slate-800">
                      {formatDate(selectedBooking.endDate)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Status</span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        statusStyles[selectedBooking.status]
                      }`}
                    >
                      {selectedBooking.status}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 border-t border-slate-100 pt-3">
                    <span className="text-slate-500">Total price</span>
                    <span className="font-bold text-slate-900">
                      {formatPrice(selectedBooking.total)}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancellation confirmation modal */}
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

              <h2
                id="cancel-modal-title"
                className="mt-4 text-lg font-bold text-slate-900"
              >
                Cancel this booking?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Cancel the reservation for{" "}
                <strong>{cancelBooking.car}</strong> belonging to{" "}
                <strong>{cancelBooking.customer}</strong>?
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCancelBooking(null)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Keep booking
                </button>

                <button
                  type="button"
                  onClick={confirmCancellation}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Confirm cancel
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