import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookingForm from './BookingForm'; 

const SingleVenue = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch venue details');
        }
        const data = await response.json();
        setVenue(data.data);
      } catch (error) {
        console.error('Error fetching venue details:', error);
      }
    };

    fetchVenueDetails();
  }, [id]);

  if (!venue) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-8 mx-auto">
      <div className="max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
        <img src={venue.media[0].url} alt={venue.media[0].alt} className="object-cover object-center w-full h-64" />
        <div className="p-6">
          <h2 className="mb-2 text-3xl font-bold">{venue.name}</h2>
          <p className="mb-4 text-gray-600">{venue.description}</p>
          <div className="flex items-center">
            <span className="text-gray-700">Price: ${venue.price}/night</span>
            <span className="ml-auto text-gray-700">Max Guests: {venue.maxGuests}</span>
          </div>
          <div className="mt-4">
            <span className="text-gray-700">Location: {venue.location.city}, {venue.location.country}</span>
          </div>
          <div className="mt-4">
            <h3 className="mb-2 text-xl font-semibold">Amenities:</h3>
            <ul className="grid grid-cols-2 gap-4">
              {Object.entries(venue.meta).map(([amenity, value]) => (
                <li key={amenity} className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {value ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    )}
                  </svg>
                  <span>{amenity}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Include the BookingForm component */}
          <div className="mt-4">
            <h3 className="mb-2 text-xl font-semibold">Book this Venue:</h3>
            <BookingForm venueId={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleVenue;
