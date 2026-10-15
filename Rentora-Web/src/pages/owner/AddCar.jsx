
import { useRef, useState } from "react";
import { motion } from "motion/react";
import {
  CarFront,
  Plus,
  X,
  ImagePlus,
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

const initialForm = {
  brand: "",
  model: "",
  year: "",
  dailyPrice: "",
  category: "",
  transmission: "",
  fuelType: "",
  seatingCapacity: "5",
  location: "",
  description: "",
};

const categories = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Luxury",
  "Sports",
  "Convertible",
  "MPV",
];

const transmissionOptions = ["Automatic", "Manual", "Semi-Automatic"];
const fuelOptions = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

const labelClass = "text-sm font-medium text-slate-700";

const AddCar = () => {
  const [form, setForm] = useState(initialForm);
  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const addFeature = () => {
    const feature = featureInput.trim();

    if (!feature) return;

    if (
      features.some(
        (item) => item.toLowerCase() === feature.toLowerCase()
      )
    ) {
      setFeatureInput("");
      return;
    }

    setFeatures((previous) => [...previous, feature]);
    setFeatureInput("");
    setError("");
  };

  const removeFeature = (featureToRemove) => {
    setFeatures((previous) =>
      previous.filter((feature) => feature !== featureToRemove)
    );
  };

  const handleFeatureKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addFeature();
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    // FRONTEND ONLY:
    // Later, upload this image to your backend or image storage service.
    // The backend can return an image URL to save with the vehicle record.
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
    setSuccess("");
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.brand.trim() || !form.model.trim()) {
      setError("Please enter both the vehicle brand and model.");
      return;
    }

    const year = Number(form.year);
    const price = Number(form.dailyPrice);
    const seats = Number(form.seatingCapacity);

    if (!Number.isInteger(year) || year < 1900 || year > new Date().getFullYear() + 1) {
      setError("Please enter a valid vehicle year.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Daily rental price must be greater than zero.");
      return;
    }

    if (!Number.isInteger(seats) || seats < 1 || seats > 50) {
      setError("Please enter a valid seating capacity.");
      return;
    }

    setSubmitting(true);

    try {
      /*
      ============================================================
      BACKEND INTEGRATION: ADD VEHICLE
      ============================================================

      When your Node.js/Express backend is ready:

      1. Create a POST endpoint, for example:
         POST /api/owner/cars

      2. Send the form fields and image using FormData:

         const formData = new FormData();

         Object.entries(form).forEach(([key, value]) => {
           formData.append(key, value);
         });

         formData.append("features", JSON.stringify(features));

         if (image) {
           formData.append("image", image);
         }

      3. Send the request using fetch or Axios.
         Include your authentication token/cookie as required.

      4. On the backend:
         - Authenticate and authorize the vehicle owner.
         - Validate all submitted fields.
         - Upload the image to your chosen storage service.
         - Save the vehicle details and image URL in MongoDB.
         - Return the created vehicle record.

      5. Handle API errors and navigate to Manage Cars
         only after the server confirms successful creation.

      IMPORTANT:
      Do not send the raw image URL from the browser as a
      substitute for uploading the actual image file.
      ============================================================
      */

      // Frontend demonstration only. No database/API request is made.
      await new Promise((resolve) => setTimeout(resolve, 400));

      const carDraft = {
        ...form,
        year,
        dailyPrice: price,
        seatingCapacity: seats,
        features,
        image, // File object, not a persistent image URL.
      };

      console.log("Vehicle draft (frontend only):", carDraft);

      setSuccess(
        "Form validated successfully. Backend integration is still pending; no vehicle has been saved."
      );
    } catch (submitError) {
      setError("Something went wrong. Please try again.");
      console.error(submitError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto w-full max-w-5xl"
    >
      {/* Page heading */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
            <CarFront size={15} />
            Vehicle management
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Add New Car
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Fill in the details to list a new car for booking, including
            pricing, availability, and vehicle specifications.
          </p>
        </div>

        <div className="hidden size-12 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 sm:flex">
          <CarFront size={24} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle details */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-900">
              Vehicle Information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter the basic details of your vehicle.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="brand" className={labelClass}>
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                id="brand"
                name="brand"
                value={form.brand}
                onChange={updateField}
                placeholder="e.g. BMW, Mercedes, Audi"
                className={inputClass}
                required
                maxLength={60}
              />
            </div>

            <div>
              <label htmlFor="model" className={labelClass}>
                Model <span className="text-red-500">*</span>
              </label>
              <input
                id="model"
                name="model"
                value={form.model}
                onChange={updateField}
                placeholder="e.g. X5, E-Class, M4"
                className={inputClass}
                required
                maxLength={80}
              />
            </div>

            <div>
              <label htmlFor="year" className={labelClass}>
                Year <span className="text-red-500">*</span>
              </label>
              <input
                id="year"
                name="year"
                type="number"
                value={form.year}
                onChange={updateField}
                placeholder="e.g. 2025"
                min="1900"
                max={new Date().getFullYear() + 1}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="dailyPrice" className={labelClass}>
                Daily Price (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  ₹
                </span>
                <input
                  id="dailyPrice"
                  name="dailyPrice"
                  type="number"
                  value={form.dailyPrice}
                  onChange={updateField}
                  placeholder="e.g. 2500"
                  min="1"
                  step="1"
                  className={`${inputClass} pl-8`}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className={labelClass}>
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={updateField}
                className={inputClass}
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="transmission" className={labelClass}>
                Transmission <span className="text-red-500">*</span>
              </label>
              <select
                id="transmission"
                name="transmission"
                value={form.transmission}
                onChange={updateField}
                className={inputClass}
                required
              >
                <option value="">Select transmission</option>
                {transmissionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="fuelType" className={labelClass}>
                Fuel Type <span className="text-red-500">*</span>
              </label>
              <select
                id="fuelType"
                name="fuelType"
                value={form.fuelType}
                onChange={updateField}
                className={inputClass}
                required
              >
                <option value="">Select fuel type</option>
                {fuelOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="seatingCapacity" className={labelClass}>
                Seating Capacity <span className="text-red-500">*</span>
              </label>
              <input
                id="seatingCapacity"
                name="seatingCapacity"
                type="number"
                min="1"
                max="50"
                value={form.seatingCapacity}
                onChange={updateField}
                className={inputClass}
                required
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label htmlFor="location" className={labelClass}>
                Pickup Location <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                name="location"
                value={form.location}
                onChange={updateField}
                placeholder="e.g. Connaught Place, New Delhi"
                className={inputClass}
                required
                maxLength={150}
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-900">
              Features & Amenities
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add the features customers should know about.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={featureInput}
              onChange={(event) => setFeatureInput(event.target.value)}
              onKeyDown={handleFeatureKeyDown}
              placeholder="e.g. Leather Seats, Navigation, Bluetooth"
              className={`${inputClass} mt-0 flex-1`}
              maxLength={50}
              aria-label="Vehicle feature"
            />

            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={addFeature}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
            >
              <Plus size={17} />
              Add feature
            </motion.button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {features.map((feature) => (
              <motion.span
                key={feature}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(feature)}
                  aria-label={`Remove ${feature}`}
                  className="rounded-full text-blue-500 transition hover:text-red-600"
                >
                  <X size={14} />
                </button>
              </motion.span>
            ))}

            {features.length === 0 && (
              <p className="text-xs text-slate-400">
                No features added yet.
              </p>
            )}
          </div>
        </section>

        {/* Vehicle image */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-900">
              Vehicle Image
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Upload a clear photo of your car. Maximum size: 5 MB.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="vehicleImage"
          />

          {imagePreview ? (
            <div className="relative max-w-xl overflow-hidden rounded-xl border border-slate-200">
              <img
                src={imagePreview}
                alt="Vehicle preview"
                className="h-64 w-full object-cover"
              />

              <button
                type="button"
                onClick={removeImage}
                className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow transition hover:bg-red-50 hover:text-red-600"
                aria-label="Remove vehicle image"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 bg-white px-4 py-3 text-xs text-slate-500">
                <CheckCircle2 size={15} className="text-emerald-600" />
                {image?.name}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group flex min-h-48 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-5 py-8 text-center transition hover:border-blue-300 hover:bg-blue-50/50"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm transition group-hover:text-blue-600">
                <ImagePlus size={23} />
              </span>
              <span className="mt-4 text-sm font-semibold text-slate-700">
                Click to upload a vehicle image
              </span>
              <span className="mt-1 text-xs text-slate-400">
                PNG, JPG, WEBP up to 5 MB
              </span>
            </button>
          )}
        </section>

        {/* Description */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-900">
              Vehicle Description
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Tell customers about the vehicle and its condition.
            </p>
          </div>

          <label htmlFor="description" className={labelClass}>
            Description <span className="text-red-500">*</span>
          </label>

          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={updateField}
            placeholder="Describe the car, its condition, comfort, and notable details..."
            rows={5}
            maxLength={1500}
            className={`${inputClass} resize-y leading-6`}
            required
          />

          <p className="mt-2 text-right text-xs text-slate-400">
            {form.description.length}/1500 characters
          </p>
        </section>

        {/* Form feedback */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800"
          >
            {success}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">
            Fields marked <span className="text-red-500">*</span> are required.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setForm(initialForm);
                setFeatures([]);
                setFeatureInput("");
                removeImage();
                setError("");
                setSuccess("");
              }}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Reset form
            </motion.button>

            <motion.button
              type="submit"
              disabled={submitting}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  Add Vehicle
                  <ArrowRight size={17} />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default AddCar;
