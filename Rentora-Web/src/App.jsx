import Navbar from './component/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import CarDetail from './pages/CarDetail'
import Cars from './pages/Cars'
import MyBooking from './pages/MyBooking'

const App = () => {
  return (
    <div>
      <Navbar />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/car-details/:id' element={<CarDetail />} />
        <Route path='/cars' element={<Cars />} />
        <Route path='/my-bookings' element={<MyBooking/>} />
      </Routes>
    </div>
  )
}

export default App