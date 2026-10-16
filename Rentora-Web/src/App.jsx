
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import { useAuth } from "./component/AuthProvider";

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

// Protect routes that require authentication.
const RequireAuth = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="size-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
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

// Shared layout for the public website.
const PublicLayout = () => {
  const location = useLocation();
  const isOwnerPage = location.pathname.startsWith("/owner");

  return (
    <>
      {!isOwnerPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/car-details/:id" element={<CarDetail />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/my-bookings" element={<MyBooking />} />
        <Route path="/login" element={<Login />} />

        {/* Owner portal: authentication required */}
        <Route element={<RequireAuth />}>
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-car" element={<AddCar />} />
            <Route path="manage-cars" element={<ManageCars />} />
            <Route path="manage-bookings" element={<ManageBooking />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

    {!isOwnerPage && location.pathname !== "/login" && <Footer />}
    </>
  );
};

const App = () => {
  return <PublicLayout />;
};

export default App;
