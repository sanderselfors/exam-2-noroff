import React, { useState } from 'react';
import AllVenues from '../components/AllVenues';
import SingleVenue from '../components/SingleVenue';
import VenueSearch from '../components/VenueSearch'; 
import { motion } from 'framer-motion';

const HomePage = () => {
  const [selectedVenueId, setSelectedVenueId] = useState(null);

  const handleVenueClick = (venueId) => {
    setSelectedVenueId(venueId);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <div className="px-4">
        <motion.div
          className="relative flex items-center justify-center w-full mx-auto overflow-hidden bg-center bg-cover shadow-xl rounded-xl"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
            height: '50vh', // Adjust as needed
          }}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-4 text-center text-white ">
            <h1 className="mb-4 text-5xl md:text-6xl lg:text-7xl">Welcome to <span className="text-primary">Holidaze!</span></h1>
            <p className="text-lg md:text-2xl lg:text-3xl">Find your perfect holiday accommodation.</p>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container py-8 mx-auto">
        {/* Header for AllVenues */}
        <motion.h2 
          className="p-4 mb-4 text-4xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Explore Our Venues
        </motion.h2>

        {/* Search Bar */}
        <VenueSearch 
          onVenueClick={handleVenueClick} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        /> 

        {/* Render AllVenues component */}
        <AllVenues 
          onVenueClick={handleVenueClick} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        />

        {/* Render SingleVenue component if a venue is selected */}
        {selectedVenueId && (
          <SingleVenue 
            venueId={selectedVenueId} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default HomePage;
