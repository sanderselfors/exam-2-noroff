import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const options = {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Noroff-API-Key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      };
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venueId}`, options);
      if (!response.ok) {
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
    <div className="container py-8 mx-auto">
      <div className="max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-md">
        <img src={venue.media[0].url} alt={venue.media[0].alt} className="object-cover object-center w-full h-64" />
        <div className="p-6">
          <h2 className="mb-2 text-3xl font-bold">{venue.name}</h2>
          {isEditing ? (
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-1 font-semibold">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block mb-1 font-semibold">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
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
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
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
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                />
              </div>
              
              {/* Location */}
              <div className="mb-4">
                <label htmlFor="address" className="block mb-1 font-semibold">Address</label>
                <input
                  type="text"
                  id="address"
                  name="location.address"
                  value={formData.location.address || ''} // Default value for nested field
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="city" className="block mb-1 font-semibold">City</label>
                  <input
                    type="text"
                    id="city"
                    name="location.city"
                    value={formData.location.city || ''} // Default value for nested field
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block mb-1 font-semibold">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="location.country"
                    value={formData.location.country || ''} // Default value for nested field
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                  />
                </div>
              </div>
              {/* Amenities */}
              <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold">Amenities</h3>
                <label className="flex items-center space-x-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.meta.wifi || false} // Default value for nested field
                    onChange={(e) => setFormData({ ...formData, meta: { ...formData.meta, wifi: e.target.checked } })}
                    className="rounded"
                  />
                  <span>Wifi</span>
                </label>
                <label className="flex items-center space-x-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.meta.parking || false} // Default value for nested field
                    onChange={(e) => setFormData({ ...formData, meta: { ...formData.meta, parking: e.target.checked } })}
                    className="rounded"
                  />
                  <span>Parking</span>
                </label>
                <label className="flex items-center space-x-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.meta.breakfast || false} // Default value for nested field
                    onChange={(e) => setFormData({ ...formData, meta: { ...formData.meta, breakfast: e.target.checked } })}
                    className="rounded"
                  />
                  <span>Breakfast</span>
                </label>
                <label className="flex items-center space-x-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.meta.pets || false} // Default value for nested field
                    onChange={(e) => setFormData({ ...formData, meta: { ...formData.meta, pets: e.target.checked } })}
                    className="rounded"
                  />
                  <span>Pets</span>
                </label>
              </div>
              <div className="flex items-center space-x-4">
                <button type="submit" className="px-4 py-2 mr-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                  Save Changes
                </button>
                <button type="button" onClick={handleCancelEdit} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="mb-4 text-gray-600">{venue.description}</p>
              <div className="flex items-center">
                <span className="text-gray-700">Price: ${venue.price}/night</span>
                <span className="ml-auto text-gray-700">Max Guests: {venue.maxGuests}</span>
              </div>
              <div className="mt-4">
                <span className="text-gray-700">Location: {venue.location.city}, {venue.location.country}</span>
              </div>
              <div className="mt-4">
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
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <button onClick={handleEditClick} className="px-4 py-2 mr-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                    Edit Venue
                  </button>
                  <button onClick={() => setDeleteConfirmation(true)} className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600">
                    Delete Venue
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {deleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="p-8 bg-white rounded-md">
            <p className="mb-4 text-lg">Are you sure you want to delete this venue?</p>
            <div className="flex justify-center">
              <button onClick={handleDelete} className="px-4 py-2 mr-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600">
                Confirm
              </button>
              <button onClick={() => setDeleteConfirmation(false)} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <VenueBookings venueId={venueId} />
    </div>
  );
};

export default VenueDetails;
