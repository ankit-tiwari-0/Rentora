import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Axios configuration
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const currency = import.meta.env.VITE_CURRENCY || "₹";

  // Authentication
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // UI
  const [showLogin, setShowLogin] = useState(false);

  // Booking search
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // Cars
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch authenticated user using the HTTP-only cookie
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");

      if (data.success && data.user) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
        return data.user;
      }

      setUser(null);
      setIsOwner(false);
      return null;
    } catch (error) {
      setUser(null);
      setIsOwner(false);

      // A 401 simply means there is no valid login session.
      if (error.response?.status !== 401) {
        console.error(
          "Fetch user error:",
          error.response?.data || error.message
        );
      }

      return null;
    } finally {
      setAuthLoading(false);
    }
  };

  // Fetch available car listings
  const fetchCars = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get("/api/user/cars");

      if (data.success) {
        setCars(data.cars || []);
      } else {
        setCars([]);
        console.error(data.message || "Unable to fetch cars");
      }
    } catch (error) {
      setCars([]);

      console.error(
        "Fetch cars error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Restore the session and load cars when the app starts
  useEffect(() => {
    fetchUser();
    fetchCars();
  }, []);

  // Logout
  const logout = async () => {
    try {
      const { data } = await axios.post("/api/user/logout");

      if (!data.success) {
        toast.error(data.message || "Unable to log out");
        return false;
      }

      setUser(null);
      setIsOwner(false);
      setShowLogin(false);

      toast.success("Logged out successfully");

      navigate("/", { replace: true });

      return true;
    } catch (error) {
      console.error(
        "Logout error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message || "Unable to log out"
      );

      return false;
    }
  };


  // Add a car
const addCar = async (carData) => {
    try {
        const formData = new FormData();

        // Send all car details as a single JSON string
        const { image, ...carDetails } = carData;

        formData.append("carData", JSON.stringify(carDetails));

        // Send the image separately
        formData.append("image", image);

        const { data } = await axios.post(
            "/api/car/add-car",
            formData
        );

        if (data.success) {
            toast.success(data.message || "Car added successfully!");
            await fetchCars();
            return data;
        }

        throw new Error(data.message || "Failed to add car");
    } catch (error) {
        toast.error(
            error.response?.data?.message || error.message || "Something went wrong"
        );
        throw error;
    }
};

// Get owner's cars
const fetchOwnerCars = async () => {
    const { data } = await axios.get("/api/car/cars");

    if (!data.success) {
        throw new Error(data.message || "Failed to fetch your cars");
    }

    return data.cars;
};

// Toggle car availability
const toggleCar = async (carId) => {
    const { data } = await axios.patch(
        `/api/car/toggle-car/${carId}`
    );

    if (!data.success) {
        throw new Error(data.message || "Failed to update availability");
    }

    return data;
};

// Delete a car
const deleteCar = async (carId) => {
    const { data } = await axios.delete(
        `/api/car/delete-car/${carId}`
    );

    if (!data.success) {
        throw new Error(data.message || "Failed to delete car");
    }

    return data;
};

// Get owner dashboard statistics
const fetchDashboardData = async () => {
    const { data } = await axios.get("/api/car/dashboard");

    if (!data.success) {
        throw new Error(data.message || "Failed to load dashboard");
    }

    return data;
};



  // Shared context values
  const value = {
    axios,
    navigate,
    currency,

    user,
    setUser,

    isOwner,
    setIsOwner,

    authLoading,

    showLogin,
    setShowLogin,

    pickupDate,
    setPickupDate,

    returnDate,
    setReturnDate,

    cars,
    setCars,
    loading,

    fetchUser,
    fetchCars,
    logout,
     // Car API functions
    addCar,
    fetchOwnerCars,
    toggleCar,
    deleteCar,
    fetchDashboardData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useAppContext must be used inside AppProvider"
    );
  }

  return context;
};
