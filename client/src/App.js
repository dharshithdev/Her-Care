import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Register from './Pages/Register';
import Login from './Pages/Login';
import Home from './Pages/Home'
import Track from './Pages/Track';
import Explore from './Pages/Explore';
import Shop from './Pages/Shopping/Shop';
import Product from './Pages/Shopping/Product';
import Cart from './Pages/Shopping/Cart';
import AboutUs from './Pages/About';
import DailyCheckIn from './Pages/Daily';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/track" element={<Track />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/aboutus" element={<AboutUs   />} />
        <Route path="/daily" element={<DailyCheckIn   />} />

      </Routes>
  );
}

export default App;
