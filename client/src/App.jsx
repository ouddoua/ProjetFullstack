import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantDashboard from './pages/RestaurantDashboard';
import ClientBooking from './pages/ClientBooking';
import ClientProfile from './pages/ClientProfile';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/restaurant/:id" element={<ClientBooking />} />

            {/* Espace Client */}
            <Route path="/profil" element={<ClientProfile />} />

            <Route path="/dashboard/restaurant" element={<RestaurantDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
