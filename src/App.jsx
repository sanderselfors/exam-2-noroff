import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Root from './root'; 
import HomePage from './pages/Home';
import LoginPage from './pages/Login'; 
import RegisterPage from './pages/Register'; 
import ProfilePage from './pages/Profile'; 
import SingleVenue from './pages/SingleVenue'; 
import VenueDetails from './pages/VenueDetails'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Root />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/venues/:id" element={<SingleVenue />} />
          <Route path="/venues/:id/details" element={<VenueDetails />} /> 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
