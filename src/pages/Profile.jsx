import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CreateVenue from '../components/CreateVenue';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState(null);
  const [newBio, setNewBio] = useState('');
  const [newAvatarUrl, setNewAvatarUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const apiKey = localStorage.getItem('apiKey');
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!accessToken || !apiKey || !username) {
          throw new Error('User not authenticated');
        }

        const options = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Noroff-API-Key': apiKey,
          },
        };

        // Fetch profile data
        const profileResponse = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${username}`,
          options
        );
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile');
        }
        const profileData = await profileResponse.json();
        setProfile(profileData.data);

        // Fetch bookings
        const bookingsResponse = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${username}/bookings`,
          options
        );
        if (!bookingsResponse.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData.data);

        // Fetch venues
        const venuesResponse = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${username}/venues`,
          options
        );
        if (!venuesResponse.ok) {
          throw new Error('Failed to fetch venues');
        }
        const venuesData = await venuesResponse.json();
        setVenues(venuesData.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [accessToken, apiKey, username]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleUpdate = async () => {
    try {
      const options = {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Noroff-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio: newBio,
          avatar: {
            url: newAvatarUrl,
            alt: 'Avatar',
          },
        }),
      };
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/profiles/${username}`,
        options
      );
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      const data = await response.json();
      setProfile(data.data);
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    }
  };

  if (!accessToken || !apiKey || !username) {
    return (
      <div className="flex items-center justify-center w-full h-screen p-4">
        <div className="p-4 text-center rounded-md shadow-md">
          <h1 className="mb-4 text-3xl font-bold">Welcome to Holidaze!</h1>
          <p className="mb-4 text-lg">You need to be logged in to view your profile.</p>
          <Link to="/login" className="flex px-6 py-3 mx-auto text-white w-60 rounded-3xl btn btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>An error occurred: {error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto">
      <h1 className="mb-4 text-3xl font-bold text-center">Profile</h1>
      
      {/* Display User Info */}
      {profile && (
        <motion.div 
          className="flex flex-col items-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {profile.avatar && (
            <motion.div 
              className="w-32 h-32 mb-4 overflow-hidden rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img src={profile.avatar.url} alt="Avatar" className="object-cover w-full h-full" />
            </motion.div>
          )}
          <div className="text-center">
            <h3 className="text-xl font-semibold">{profile.name}</h3>
            <p className="mb-2 text-gray-500">{profile.email}</p>
            {isEditing ? (
              <input
                type="text"
                value={newAvatarUrl}
                onChange={(e) => setNewAvatarUrl(e.target.value)}
                placeholder="Enter new avatar URL"
                className="block w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-400"
              />
            ) : (
              <p className="mb-2">{profile.bio}</p>
            )}
            {isEditing && (
              <textarea
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                placeholder="Enter new bio"
                className="block w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-400"
              />
            )}
          </div>
        </motion.div>
      )}
      
      {/* Edit Profile */}
      {isEditing ? (
        <motion.div 
          className="flex items-center justify-center mb-4 space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={handleUpdate}
            disabled={!newBio || !newAvatarUrl}
            className="px-6 py-3 text-white bg-red-600 rounded-3xl hover:bg-red-700 focus:outline-none"
          >
            Save Changes
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-3 text-gray-700 bg-gray-300 rounded-3xl hover:bg-gray-400 focus:outline-none"
          >
            Cancel
          </button>
        </motion.div>
      ) : (
        <motion.button
          onClick={() => setIsEditing(true)}
          className="flex px-6 py-3 mx-auto text-white rounded-3xl btn btn-primary"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          Edit Profile
        </motion.button>
      )}

      {/* Display User Bookings */}
      <h2 className="mt-8 mb-4 text-2xl font-bold">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-center">You have no bookings yet.</p>
      ) : (
        <motion.div 
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {bookings.map((booking) => (
            <motion.div 
              key={booking.id} 
              className="overflow-hidden bg-white shadow-xl rounded-xl"
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-4">
                <p className="text-lg font-bold">Booking Details</p>
                <p>Date From: {formatDate(booking.dateFrom)}</p>
                <p>Date To: {formatDate(booking.dateTo)}</p>
                <p>Guests: {booking.guests}</p>
                <p>Created: {formatDate(booking.created)}</p>
                <p>Updated: {formatDate(booking.updated)}</p>
              </div>
              {booking.media && (
                <img src={booking.media[0]?.url} alt={booking.id} className="object-cover w-full h-40" />
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Display User Venues */}
      <h2 className="mt-8 mb-4 text-2xl font-bold">My Venues</h2>
      {venues.length === 0 ? (
        <p className="text-center">You have no venues yet.</p>
      ) : (
        <motion.div 
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {venues.map((venue) => (
            <Link key={venue.id} to={`/venues/${venue.id}/details`} className="cursor-pointer">
              <motion.div 
                className="overflow-hidden bg-white shadow-xl rounded-xl"
                whileHover={{ scale: 1.05 }}
              >
                {venue.media && (
                  <img
                    src={venue.media[0]?.url}
                    alt={venue.name}
                    className="object-cover w-full h-40"
                  />
                )}
                <div className="p-4">
                  <p className="text-lg font-bold">{venue.name}</p>
                  <p>{venue.description}</p>
                  <p>Price: {venue.price}</p>
                  <p>Max Guests: {venue.maxGuests}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}
      
      {/* Create Venue Button */}
      <CreateVenue accessToken={accessToken} apiKey={apiKey} />
    </div>
  );
};

export default ProfilePage;
