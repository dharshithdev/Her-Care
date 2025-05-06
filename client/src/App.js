import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route, NOT BrowserRouter
import Register from './Pages/Register';
import Login from './Pages/Login';

function App() {
  return (
      <Routes> {/* Use Routes here */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Register />} />
      </Routes>
  );
}

export default App;
