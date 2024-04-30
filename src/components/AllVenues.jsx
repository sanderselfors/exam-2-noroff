import React, { useState, useEffect } from 'react';

const AllVenues = ({ onVenueClick }) => {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch('https://v2.api.noroff.dev/holidaze/venues');
        if (!response.ok) {
          throw new Error('Failed to fetch venues');
        }
        const data = await response.json();
        // Sort venues by the created date in descending order
        const sortedVenues = data.data.sort((a, b) => new Date(b.created) - new Date(a.created));
        setVenues(sortedVenues);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchVenues();
  }, []);

  return (
    <div className="container grid grid-cols-1 gap-8 py-8 mx-auto sm:grid-cols-2 lg:grid-cols-3">
      {venues.map((venue) => (
        <a key={venue.id} href={`/venues/${venue.id}`} className="block overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg">
          {venue.media.length > 0 && ( // Check if media array is not empty
            <img src={venue.media[0].url} alt={venue.media[0].alt} className="object-cover object-center w-full h-48" />
          )}
          <div className="p-6">
            <h2 className="mb-2 text-xl font-bold">{venue.name}</h2>
            <p className="mb-4 text-gray-600">{venue.description}</p>
            <div className="flex flex-wrap">
              {/* Assuming tags are available in venue.meta */}
              {Object.entries(venue.meta).map(([tag, value]) => (
                <span key={tag} className={`inline-block px-2 py-1 mr-2 mb-2 text-sm font-semibold rounded ${value ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default AllVenues;
