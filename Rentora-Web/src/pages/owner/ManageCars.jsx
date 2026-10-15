
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  Trash2,
  Search,
  CarFront,
  X,
  AlertTriangle,
  SlidersHorizontal,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const initialCars = [
  {
    id: "1",
    name: "Toyota Corolla",
    year: 2023,
    category: "Economy",
    price: 4500,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "2",
    name: "Honda Civic",
    year: 2022,
    category: "Economy",
    price: 4800,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    status: "Not Available",
    image:
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "3",
    name: "BMW 3 Series",
    year: 2024,
    category: "Luxury",
    price: 9500,
    transmission: "Automatic",
    fuelType: "Diesel",
    seats: 5,
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "4",
    name: "Tesla Model 3",
    year: 2024,
    category: "Luxury",
    price: 12000,
    transmission: "Automatic",
    fuelType: "Electric",
    seats: 5,
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=500&q=80",
  },
];

const categories = ["All", "Economy", "Luxury"];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const ManageCars = () => {
  const [cars, setCars] = useState(initialCars);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedCar, setSelectedCar] = useState(null);
  const [deleteCar, setDeleteCar] = useState(null);

  const filteredCars = useMemo(() => {
    const query = search.trim().toLowerCase();

    return cars.filter((car) => {
      const matchesSearch =
        car.name.toLowerCase().includes(query) ||
        car.category.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || car.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [cars, search, category]);

  const toggleAvailability = (carId) => {
    /*
     * BACKEND INTEGRATION:
     * Replace this local state update with:
     * PATCH /api/owner/cars/:id/status
     *
     * Update the UI after the server confirms the change.
     */
    setCars((previous) =>
      previous.map((car) =>
        car.id === carId
          ? {
              ...car,
              status:
                car.status === "Available"
                  ? "Not Available"
                  : "Available",
            }
          : car
      )
    );
  };

  const confirmDelete = () => {
    if (!deleteCar) return;

    /*
     * BACKEND INTEGRATION:
     * Call DELETE /api/owner/cars/:id.
     * Remove the car from the UI only after successful response.
     */
    setCars((previous) =>
      previous.filter((car) => car.id !== deleteCar.id)
    );

    if (selectedCar?.id === deleteCar.id) {
      setSelectedCar(null);
    }

    setDeleteCar(null);
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
            <CarFront size={16} />
            Vehicle inventory
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Manage Cars
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            View your listed vehicles, manage availability, and
            update your rental fleet.
          </p>
        </div>

        <Link
          to="/owner/add-car"
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:self-auto"
        >
          <Plus size={17} />
          Add New Car
          <ArrowUpRight size={15} />
        </Link>
      </motion.div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          {
            label: "Total vehicles",
            value: cars.length,
            color: "bg-blue-50 text-blue-600",
            icon: CarFront,
          },
          {
            label: "Available",
            value: cars.filter((car) => car.status === "Available").length,
            color: "bg-emerald-50 text-emerald-600",
            icon: Eye,
          },
          {
            label: "Unavailable",
            value: cars.filter((car) => car.status !== "Available").length,
            color: "bg-amber-50 text-amber-600",
            icon: AlertTriangle,
          },
        ].map(({ label, value, color, icon: Icon }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.07 }}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {value}
              </p>
            </div>

            <div className={`flex size-11 items-center justify-center rounded-xl ${color}`}>
              <Icon size={21} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and category filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by vehicle name or category..."
            aria-label="Search vehicles"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <div className="relative sm:w-52">
          <SlidersHorizontal
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by category"
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All categories" : item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vehicle list */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Your vehicles
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {filteredCars.length}{" "}
              {filteredCars.length === 1 ? "vehicle" : "vehicles"} found
            </p>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                {["Car", "Category", "Price", "Status", "Actions"].map(
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
                {filteredCars.map((car) => (
                  <motion.tr
                    key={car.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.22 }}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={car.image}
                          alt={car.name}
                          loading="lazy"
                          className="size-12 shrink-0 rounded-lg border border-slate-200 bg-slate-100 object-cover"
                          onError={(event) => {
                            event.currentTarget.style.visibility = "hidden";
                          }}
                        />

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {car.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {car.seats} seats · {car.transmission} · {car.year}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3 text-sm text-slate-600">
                      {car.category}
                    </td>

                    <td className="px-5 py-3 text-sm font-medium text-slate-700">
                      {formatPrice(car.price)}/day
                    </td>

                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => toggleAvailability(car.id)}
                        title="Toggle availability (frontend demo)"
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold transition hover:ring-2 hover:ring-offset-1 ${
                          car.status === "Available"
                            ? "bg-emerald-50 text-emerald-700 hover:ring-emerald-200"
                            : "bg-red-50 text-red-600 hover:ring-red-200"
                        }`}
                      >
                        {car.status}
                      </button>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedCar(car)}
                          aria-label={`View ${car.name}`}
                          title="View details"
                          className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteCar(car)}
                          aria-label={`Delete ${car.name}`}
                          title="Delete vehicle"
                          className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile vehicle cards */}
        <div className="divide-y divide-slate-100 md:hidden">
          <AnimatePresence initial={false}>
            {filteredCars.map((car) => (
              <motion.article
                key={car.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="p-4"
              >
                <div className="flex gap-3">
                  <img
                    src={car.image}
                    alt={car.name}
                    loading="lazy"
                    className="size-20 shrink-0 rounded-xl border border-slate-200 bg-slate-100 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-slate-900">
                      {car.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {car.category} · {car.year}
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {formatPrice(car.price)}/day
                    </p>

                    <button
                      type="button"
                      onClick={() => toggleAvailability(car.id)}
                      className={`mt-2 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        car.status === "Available"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {car.status}
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCar(car)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    <Eye size={15} />
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteCar(car)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredCars.length === 0 && (
          <div className="px-5 py-16 text-center">
            <CarFront size={32} className="mx-auto text-slate-300" />

            <h3 className="mt-3 text-sm font-semibold text-slate-800">
              No vehicles found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try a different search or category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </motion.section>

      <p className="mt-4 text-xs leading-5 text-slate-400">
        Demo vehicles are stored in local React state. Connect your backend
        to manage saved vehicles permanently.
      </p>

      {/* Vehicle details modal */}
      <AnimatePresence>
        {selectedCar && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCar(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="car-modal-title"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="relative">
                <img
                  src={selectedCar.image}
                  alt={selectedCar.name}
                  className="h-52 w-full bg-slate-100 object-cover"
                />

                <button
                  type="button"
                  onClick={() => setSelectedCar(null)}
                  aria-label="Close details"
                  className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-sm hover:bg-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                <h2
                  id="car-modal-title"
                  className="text-xl font-bold text-slate-900"
                >
                  {selectedCar.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedCar.year} · {selectedCar.category}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    ["Daily price", `${formatPrice(selectedCar.price)}/day`],
                    ["Seating", `${selectedCar.seats} seats`],
                    ["Transmission", selectedCar.transmission],
                    ["Fuel type", selectedCar.fuelType],
                    ["Availability", selectedCar.status],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl bg-slate-50 p-3"
                    >
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCar(null)}
                  className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Close details
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteCar && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteCar(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-modal-title"
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
                id="delete-modal-title"
                className="mt-4 text-lg font-bold text-slate-900"
              >
                Delete this vehicle?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Remove <strong>{deleteCar.name}</strong> from this demo list?
                This change only affects the current frontend session.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteCar(null)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Delete car
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageCars;
