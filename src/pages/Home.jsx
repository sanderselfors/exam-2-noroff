import React, { useState } from 'react';
import AllVenues from '../components/AllVenues';
import SingleVenue from '../components/SingleVenue';

const HomePage = () => {
  const [selectedVenueId, setSelectedVenueId] = useState(null);

  const handleVenueClick = (venueId) => {
    setSelectedVenueId(venueId);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center h-screen text-black bg-white">
        <div className="container mx-auto text-center">
          <h1 className="mb-4 text-4xl font-bold">Welcome to Holidaze!</h1>
          <p className="text-lg">Find your perfect holiday accommodation.</p>
          <button className="px-6 py-2 mt-4 font-bold text-white bg-red-600 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600">
            Get Started
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8 mx-auto">
        {/* Render AllVenues component */}
        <AllVenues onVenueClick={handleVenueClick} />

        {/* Render SingleVenue component if a venue is selected */}
        {selectedVenueId && <SingleVenue venueId={selectedVenueId} />}
      </div>
    </div>
  );
};

export default HomePage;
