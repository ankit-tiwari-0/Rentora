import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { useAppContext } from "./context/Appcontext";

import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

import Home from "./pages/Home";
import CarDetail from "./pages/CarDetail";
import Cars from "./pages/Cars";
import MyBooking from "./pages/MyBooking";
import Login from "./pages/Login";

import Layout from "./pages/owner/Layout";
import Dashboard from "./pages/owner/Dashboard";
import AddCar from "./pages/owner/AddCar";
import ManageBooking from "./pages/owner/ManageBooking";
import ManageCars from "./pages/owner/ManageCars";

import { Toaster } from "react-hot-toast";
import Payment from "./pages/Pay";

// Protect routes that require authentication.
const RequireAuth = () => {
  const { user, authLoading } = useAppContext();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="size-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
};

// Protect routes that require an owner account.
const RequireOwner = () => {
  const { user, isOwner, authLoading } = useAppContext();

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="size-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isOwner) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

// Shared layout for the public website.
const PublicLayout = () => {
  const location = useLocation();
  const isOwnerPage = location.pathname.startsWith("/owner");
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      <Toaster position="top-right" />

      {!isOwnerPage && <Navbar />}

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/car-details/:id" element={<CarDetail />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/login" element={<Login />} />

        {/* Authenticated user pages */}
        <Route element={<RequireAuth />}>
          <Route path="/my-bookings" element={<MyBooking />} />
          <Route path="/payment" element={<Payment />} />
        </Route>

        {/* Owner portal: authenticated owner required */}
        <Route element={<RequireOwner />}>
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-car" element={<AddCar />} />
            <Route path="manage-cars" element={<ManageCars />} />
            <Route path="manage-bookings" element={<ManageBooking />} />
          </Route>
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isOwnerPage && !isLoginPage && <Footer />}
    </>
  );
};

const App = () => {
  return <PublicLayout />;
};

export default App;