import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Register from './Pages/Register';
import Login from './Pages/Login';
import Home from './Pages/Home'
import Track from './Pages/Track';
import Explore from './Pages/Explore';
import AboutUs from './Pages/About';
import DailyCheckIn from './Pages/Daily';
import DoctorsPage from './Pages/Doctors';
import BookAppointment from './Pages/BookAppointment';
import ProductsPage from './Pages/Products';
import CartPage from './Pages/Cart';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/track" element={<Track />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/aboutus" element={<AboutUs   />} />
        <Route path="/daily" element={<DailyCheckIn   />} />
        <Route path="/appointments" element={<DoctorsPage />} />
        <Route path="/bookappointment/:id" element={<BookAppointment />} />
        <Route path="/shop" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
  );
}

export default App;
