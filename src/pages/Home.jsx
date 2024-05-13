import React, { useState } from 'react';
import AllVenues from '../components/AllVenues';
import SingleVenue from '../components/SingleVenue';
import VenueSearch from '../components/VenueSearch'; 

const HomePage = () => {
  const [selectedVenueId, setSelectedVenueId] = useState(null);

  const handleVenueClick = (venueId) => {
    setSelectedVenueId(venueId);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden bg-white">
        {/* Wave-like Background */}
        <div className="absolute inset-x-0 bottom-0 ">
          <svg
            className="w-full h-100vh text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 1440 320"
          >
            <path fillOpacity="1" d="M0,96L60,128C120,160,240,224,360,240C480,256,600,224,720,192C840,160,960,128,1080,122.7C1200,117,1320,139,1380,149.3L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>
        <div className="container flex flex-col items-center justify-center h-full mx-auto text-center">
          <h1 className="mb-4 text-5xl font-bold">
            <span className="text-black">Welcome to </span>
            <span className="text-primary">Holidaze!</span>
          </h1>
          <p className="text-lg">Find your perfect holiday accommodation.</p>
          <button className="px-6 py-3 mt-8 font-bold text-white rounded-full bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light">
            Get Started
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8 mx-auto">
        
         {/* Header for AllVenues */}
         <h2 className="p-4 mb-4 text-4xl font-bold text-center">Explore Our Venues</h2>

        {/* Search Bar */}
        <VenueSearch onVenueClick={handleVenueClick} /> 

        {/* Render AllVenues component */}
        <AllVenues onVenueClick={handleVenueClick} />

        {/* Render SingleVenue component if a venue is selected */}
        {selectedVenueId && <SingleVenue venueId={selectedVenueId} />}
      </div>
    </div>
  );
};

export default HomePage;
