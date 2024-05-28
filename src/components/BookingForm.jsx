import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

  const handleGuestsChange = (change) => {
    const newGuests = formData.guests + change;
    if (newGuests >= 1) {
      setFormData({
        ...formData,
        guests: newGuests,
      });
    }
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
    <div className="container flex flex-col items-center justify-center">
      {successMessage && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="text-green-500">{successMessage}</motion.div>}
      {errorMessage && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="text-red-500">{errorMessage}</motion.div>}
      <Calendar
        selected={[formData.startDate, formData.endDate]}
        onChange={handleChange}
        reserved={reserved}
        range={true}
        className="mt-4"
      />
      <h1 className="pt-5">Guests:</h1>
      <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} onSubmit={handleSubmit} className="flex items-center justify-center mt-4">
        <div className="flex items-center">
          <button type="button" onClick={() => handleGuestsChange(-1)} className="px-3 py-1 text-2xl bg-gray-200 rounded-full hover:bg-gray-300">-</button>
          <input
            type="number"
            name="guests"
            value={formData.guests}
            onChange={() => {}}
            className="block w-16 mx-2 mt-1 text-center border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            readOnly
          />
          <button type="button" onClick={() => handleGuestsChange(1)} className="px-3 py-1 text-2xl bg-gray-200 rounded-full hover:bg-gray-300">+</button>
        </div>
        <button type="submit" className="ml-4 text-white btn btn-primary rounded-3xl">Book Venue</button>
      </motion.form>
    </div>
  );
};

export default BookingForm;
