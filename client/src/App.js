import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Register from './Pages/Register';
import Login from './Pages/Login';
import Home from './Pages/Home'
import Track from './Pages/Track';
import Explore from './Pages/Explore';

function App() {
  return (
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/track" element={<Track />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
  );
}

export default App;
