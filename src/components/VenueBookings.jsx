import React, { useEffect, useState } from 'react';

const VenueBookings = ({ venueId }) => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenueBookings = async () => {
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${venueId}?_bookings=true`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch venue bookings: ${response.statusText}`);
        }
        const data = await response.json();
        setBookings(data.data.bookings);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchVenueBookings();
  }, [venueId]);

  if (error) {
    return <div className="text-red-600">An error occurred: {error}</div>;
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Bookings for this venue:</h3>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {bookings.map((booking) => (
            <li key={booking.id} className="flex items-center justify-between py-4">
              <div className="flex items-center">
                {booking.customer && booking.customer.avatar && (
                  <img
                    src={booking.customer.avatar.url}
                    alt={booking.customer.avatar.alt}
                    className="w-10 h-10 mr-4 rounded-full"
                  />
                )}
                <div>
                  {booking.customer ? (
                    <>
                      <div className="font-semibold text-gray-800">{booking.customer.name}</div>
                      <div className="text-gray-600">
                        {new Date(booking.dateFrom).toLocaleDateString()} to{' '}
                        {new Date(booking.dateTo).toLocaleDateString()}
                      </div>
                      <div className="text-gray-600">Guests: {booking.guests}</div>
                    </>
                  ) : (
                    <div className="text-gray-600">Customer information not available</div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VenueBookings;
