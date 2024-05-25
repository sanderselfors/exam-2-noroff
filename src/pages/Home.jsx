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
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 object-cover w-full h-full"
        >
          <source src="https://videos.pexels.com/video-files/7533207/7533207-uhd_3840_2160_30fps.mp4" type="video/mp4" />
        </video>
        
        
        
        {/* Overlay to Darken the Video */}
        <div className="absolute inset-0 bg-black opacity-10"></div>

        <div className="container relative z-10 flex flex-col items-center justify-center h-full mx-auto text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl lg:text-7xl">
            <span className="block">Welcome to </span>
            <span className="text-primary">Holidaze!</span>
          </h1>
          <p className="text-lg text-white md:text-2xl lg:text-3xl">Find your perfect holiday accommodation.</p>
          
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
