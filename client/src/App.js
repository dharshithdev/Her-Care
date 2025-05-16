import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route, NOT BrowserRouter
import Register from './Pages/Register';
import Login from './Pages/Login';
import Home from './Pages/Home'
import Track from './Pages/Track';

function App() {
  return (
      <Routes> {/* Use Routes here */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/track" element={<Track />} />
      </Routes>
  );
}

export default App;
