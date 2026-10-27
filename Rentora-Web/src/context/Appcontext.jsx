import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const currency = import.meta.env.VITE_CURRENCY || "₹";

  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [cars, setCars] = useState([]);

  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Fetch authenticated user
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");

      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      } else {
        setUser(null);
        setIsOwner(false);
      }
    } catch (error) {
      setUser(null);
      setIsOwner(false);

      // A missing login session is not necessarily an application error.
      if (error.response?.status !== 401) {
        toast.error(
          error.response?.data?.message ||
            "Unable to fetch user information"
        );
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Fetch car listings
  const fetchCars = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get("/api/car");

      if (data.success) {
        setCars(data.cars || []);
      } else {
        toast.error(data.message || "Unable to fetch cars");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to fetch car listings"
      );
    } finally {
      setLoading(false);
    }
  };

  // Restore the user's session using the HTTP-only cookie
  useEffect(() => {
    fetchUser();
    fetchCars();
  }, []);
//LOGOUT
  const logout = async () => {
    try {
        const { data } = await axios.post("/api/user/logout");

        if (!data.success) {
            throw new Error(data.message || "Logout failed");
        }

        setUser(null);
        setIsOwner(false);

        toast.success("Logged out successfully");
        navigate("/", { replace: true });

    } catch (error) {
        console.error(
            "Logout error:",
            error.response?.data || error.message
        );

        toast.error(
            error.response?.data?.message || "Unable to log out"
        );
    }
};

  const value = {
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
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
