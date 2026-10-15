
import { Route, Routes } from "react-router-dom";

import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

import Home from "./pages/Home";
import CarDetail from "./pages/CarDetail";
import Cars from "./pages/Cars";
import MyBooking from "./pages/MyBooking";

import Layout from "./pages/owner/Layout";
import Dashboard from "./pages/owner/Dashboard";
import AddCar from "./pages/owner/AddCar";
import ManageCar from "./pages/owner/manageCar";
import ManageBooking from "./pages/owner/ManageBooking";

const App = () => {
  return (
    <Routes>
      {/* Public website */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        }
      />

      <Route
        path="/car-details/:id"
        element={
          <>
            <Navbar />
            <CarDetail />
            <Footer />
          </>
        }
      />

      <Route
        path="/cars"
        element={
          <>
            <Navbar />
            <Cars />
            <Footer />
          </>
        }
      />

      <Route
        path="/my-bookings"
        element={
          <>
            <Navbar />
            <MyBooking />
            <Footer />
          </>
        }
      />

      {/* Owner portal: its own navbar and sidebar */}
      <Route path="/owner" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="add-car" element={<AddCar />} />
        <Route path="manage-cars" element={<ManageCar />} />
        <Route
          path="manage-bookings"
          element={<ManageBooking />}
        />
      </Route>
    </Routes>
  );
};

export default App;
