import Navbar from './component/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import CarDetail from './pages/CarDetail'
import Cars from './pages/Cars'
import MyBooking from './pages/MyBooking'
import Footer from './component/Footer'
import Layout from './pages/owner/Layout'
import Dashboard from './pages/owner/Dashboard'
import AddCar from './pages/owner/AddCar'
import ManageCar from './pages/owner/manageCar'
import ManageBooking from './pages/owner/ManageBooking'

const App = () => {
  return (
    <div>
      <Navbar />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/car-details/:id' element={<CarDetail />} />
        <Route path='/cars' element={<Cars />} />
        <Route path='/my-bookings' element={<MyBooking/>} />

        <Route path="/owner" element={<Layout/>}>
        <Route index element={<Dashboard />} />
        <Route path="add-car" element={<AddCar />} />
        <Route path="manage-cars" element={<ManageCar />} />
        <Route
          path="manage-bookings"
          element={<ManageBooking />}
        />
      </Route>
      </Routes>

      <Footer />
    </div>
  )
}

export default App