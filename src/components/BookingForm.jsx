import React, { useState, useEffect } from 'react';
import Calendar from '@demark-pro/react-booking-calendar';

const BookingForm = ({ venueId }) => {
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    guests: 1,
  });

  const [existingBookings, setExistingBookings] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchExistingBookings = async () => {
      try {
        const response = await fetch(`https://v2.api.noroff.dev/holidaze/bookings?_venue=true&venueId=${venueId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'X-Noroff-API-Key': localStorage.getItem('apiKey'),
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch existing bookings');
        }
        const data = await response.json();
        setExistingBookings(data.data);
      } catch (error) {
        console.error('Error fetching existing bookings:', error);
      }
    };

    fetchExistingBookings();
  }, [venueId]);

  const handleChange = (selectedDates) => {
    setFormData({
      startDate: selectedDates[0] || null,
      endDate: selectedDates[1] || null,
      guests: formData.guests, 
    });
  };

  const handleGuestsChange = (e) => {
    setFormData({
      ...formData,
      guests: parseInt(e.target.value), 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if the number of guests exceeds the maximum allowed by the venue
      const venueResponse = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venueId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'X-Noroff-API-Key': localStorage.getItem('apiKey'),
        },
      });
      if (!venueResponse.ok) {
        throw new Error('Failed to fetch venue details');
      }
      const venueData = await venueResponse.json();
      const maxGuests = venueData.data.maxGuests;

      if (formData.guests > maxGuests) {
        throw new Error(`Number of guests exceeds the maximum capacity of ${maxGuests}`);
      }

      // Proceed with booking if the number of guests is within the allowed limit
      const response = await fetch('https://v2.api.noroff.dev/holidaze/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'X-Noroff-API-Key': localStorage.getItem('apiKey'),
        },
        body: JSON.stringify({
          dateFrom: formData.startDate,
          dateTo: formData.endDate,
          guests: formData.guests,
          venueId: venueId,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create booking');
      }
      const data = await response.json();
      console.log('Booking created:', data);
      setSuccessMessage('Booking created successfully');
      setFormData({
        startDate: null,
        endDate: null,
        guests: 1,
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      setErrorMessage(error.message);
    }
  };

  const reserved = existingBookings.map((booking) => ({
    startDate: new Date(booking.dateFrom),
    endDate: new Date(booking.dateTo),
  }));

  return (
    <div className="container">
      <h2 className="mt-5 mb-4">Book Venue</h2>
      {successMessage && <div className="text-green-500">{successMessage}</div>}
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <Calendar
          selected={[formData.startDate, formData.endDate]}
          onChange={handleChange}
          reserved={reserved}
          range={true}
        />
        <label>
          Guests:
          <input
            type="number"
            name="guests"
            value={formData.guests}
            onChange={handleGuestsChange}
          />
        </label>
        <button type="submit" className="mt-3 btn btn-primary">Book Venue</button>
      </form>
    </div>
  );
};

export default BookingForm;
