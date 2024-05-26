import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import VenueBookings from '../components/VenueBookings';

const VenueDetails = () => {
  const { id: venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deletionSuccess, setDeletionSuccess] = useState(false);

  const accessToken = localStorage.getItem('accessToken');
  const apiKey = localStorage.getItem('apiKey');

  const fetchVenue = async () => {
    try {
      if (!accessToken || !apiKey) {
        throw new Error('Access token or API key not found in local storage');
      }

      const options = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Noroff-API-Key': apiKey
        }
      };
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venueId}`, options);
      if (!response.ok) {
        throw new Error(`Failed to fetch venue: ${response.statusText}`);
      }
      const venueData = await response.json();
      setVenue(venueData.data);
      setFormData({ ...venueData.data });
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (accessToken && apiKey) {
      fetchVenue();
    }
  }, [venueId, accessToken, apiKey]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({ ...venue });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        meta: {
          ...formData.meta,
          [name]: checked
        }
      });
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else if (name === 'maxGuests') {
      // Convert maxGuests to number
      setFormData({
        ...formData,
        [name]: parseInt(value, 10)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Remove non-updatable fields
      const { id, created, updated, _count, ...updatableFormData } = formData;
      
      // Ensure price is a number
      updatableFormData.price = Number(updatableFormData.price);
      console.log("Payload being sent to the API:", updatableFormData); // Debugging log

      const options = {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Noroff-API-Key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatableFormData)
      };
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venueId}`, options);
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error response from the API:", errorResponse); // Debugging log
        throw new Error(`Failed to update venue: ${response.statusText}`);
      }
      // Reload the venue data after successful update
      await fetchVenue();
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Noroff-API-Key': apiKey
        }
      };
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venueId}`, options);
      if (response.ok) {
        // Venue successfully deleted
        // Redirect or handle deletion success
        setDeletionSuccess(true); // Set deletion success state
        setDeleteConfirmation(false); // Set deleteConfirmation to false after successful deletion
      } else {
        throw new Error(`Failed to delete venue: ${response.statusText}`);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return <div>An error occurred: {error}</div>;
  }

  if (deletionSuccess) {
    return <div>Venue successfully deleted!</div>;
  }

  if (!venue || !formData) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container p-4 py-8 mx-auto"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto overflow-hidden bg-white shadow-xl rounded-xl"
      >
        <motion.img
          src={venue.media[0].url}
          alt={venue.media[0].alt}
          className="object-cover object-center w-full h-64"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="p-6">
          <motion.h2
            className="mb-2 text-3xl font-bold"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {venue.name}
          </motion.h2>
          {isEditing ? (
            <motion.form
              onSubmit={handleFormSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4">
                <label htmlFor="name" className="block mb-1 font-semibold">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block mb-1 font-semibold">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block mb-1 font-semibold">Price per night</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="maxGuests" className="block mb-1 font-semibold">Maximum Guests</label>
                <input
                  type="number"
                  id="maxGuests"
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                />
              </div>
              {/* Location */}
              <div className="mb-4">
                <label htmlFor="address" className="block mb-1 font-semibold">Address</label>
                <input
                  type="text"
                  id="address"
                  name="location.address"
                  value={formData.location.address || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="city" className="block mb-1 font-semibold">City</label>
                  <input
                    type="text"
                    id="city"
                    name="location.city"
                    value={formData.location.city || ''}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="zip" className="block mb-1 font-semibold">ZIP Code</label>
                  <input
                    type="text"
                    id="zip"
                    name="location.zip"
                    value={formData.location.zip || ''}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="country" className="block mb-1 font-semibold">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="location.country"
                    value={formData.location.country || ''}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                  />
                </div>
              </div>
              {/* Amenities */}
              <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold">Amenities</h3>
                <label className="flex items-center space-x-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.meta.wifi || false}
                    name="wifi"
                    onChange={handleFormChange}
                    className="rounded"
                  />
                  <span>Wifi</span>
                </label>
                <label className="flex items-center space-x-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.meta.parking || false}
                    name="parking"
                    onChange={handleFormChange}
                    className="rounded"
                  />
                  <span>Parking</span>
                </label>
                <label className="flex items-center space-x-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.meta.breakfast || false}
                    name="breakfast"
                    onChange={handleFormChange}
                    className="rounded"
                  />
                  <span>Breakfast</span>
                </label>
                <label className="flex items-center space-x-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.meta.pets || false}
                    name="pets"
                    onChange={handleFormChange}
                    className="rounded"
                  />
                  <span>Pets</span>
                </label>
              </div>
              <div className="flex items-center space-x-4">
                <button type="submit" className="px-4 py-2 mr-2 text-white btn btn-primary rounded-3xl">
                  Save Changes
                </button>
                <button type="button" onClick={handleCancelEdit} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-3xl hover:bg-gray-300 focus:outline-none focus:bg-gray-300">
                  Cancel
                </button>
              </div>
            </motion.form>
          ) : (
            <>
              <motion.p
                className="mb-4 text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {venue.description}
              </motion.p>
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <span className="text-gray-700">Price: ${venue.price}/night</span>
                <span className="ml-auto text-gray-700">Max Guests: {venue.maxGuests}</span>
              </motion.div>
              <motion.div
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <span className="text-gray-700">Location: {venue.location.city}, {venue.location.country}</span>
              </motion.div>
              <motion.div
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h3 className="mb-2 text-lg font-semibold">Amenities</h3>
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
              </motion.div>
              <motion.div
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="flex items-center">
                  <button onClick={handleEditClick} className="px-4 py-2 mr-2 text-white btn btn-primary rounded-3xl">
                    Edit Venue
                  </button>
                  <button onClick={() => setDeleteConfirmation(true)} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-3xl hover:bg-gray-300 focus:outline-none focus:bg-gray-300">
                    Delete Venue
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
      {deleteConfirmation && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-8 bg-white rounded-md">
            <p className="mb-4 text-lg">Are you sure you want to delete this venue?</p>
            <div className="flex justify-center">
              <button onClick={handleDelete} className="px-4 py-2 mr-2 text-white bg-red-600 rounded-3xl hover:bg-red-700 focus:outline-none focus:bg-red-600">
                Confirm
              </button>
              <button onClick={() => setDeleteConfirmation(false)} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-3xl hover:bg-gray-300 focus:outline-none focus:bg-gray-300">
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}
      <VenueBookings venueId={venueId} />
    </motion.div>
  );
};

export default VenueDetails;
