import React, { useState, useEffect } from 'react';
import CreateVenue from '../components/CreateVenue';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState(null);
  const [newBio, setNewBio] = useState('');
  const [newAvatarUrl, setNewAvatarUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false);
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
        setIsVenueManager(profileData.data.venueManager);

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

  if (error) {
    return <div>An error occurred: {error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
    
  }
  

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto">
      <h1 className="mb-4 text-3xl font-bold">Profile</h1>
      <div className="flex items-center mb-6">
        <div className="w-20 h-20 mr-4 overflow-hidden rounded-full">
          <img src={profile.avatar.url} alt="Avatar" className="object-cover w-full h-full" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{profile.name}</h3>
          {isEditing ? (
            <input
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              value={newAvatarUrl}
              onChange={(e) => setNewAvatarUrl(e.target.value)}
              placeholder="Enter new avatar URL"
            />
          ) : (
            <p>{profile.email}</p>
          )}
        </div>
      </div>
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold">Bio</h3>
        {isEditing ? (
          <textarea
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            placeholder="Enter new bio"
          />
        ) : (
          <p>{profile.bio}</p>
        )}
      </div>
      {isEditing && (
        <>
          <button
            className="px-4 py-2 mr-2 text-white bg-blue-500 rounded-md"
            onClick={handleUpdate}
            disabled={!newBio || !newAvatarUrl}
          >
            Save Changes
          </button>
          <button
            className="px-4 py-2 ml-2 text-gray-700 bg-gray-300 rounded-md"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </>
      )}
      {!isEditing && (
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded-md"
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </button>
      )}

      <h2 className="mt-8 mb-4 text-2xl font-bold">Bookings</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <div key={booking.id} className="overflow-hidden bg-white rounded-md shadow-md">
            <div className="p-4 bg-gray-200">
              <p className="text-lg font-bold">Booking Details</p>
              <p>Date From: {booking.dateFrom}</p>
              <p>Date To: {booking.dateTo}</p>
              <p>Guests: {booking.guests}</p>
              <p>Created: {booking.created}</p>
              <p>Updated: {booking.updated}</p>
            </div>
            {booking.media && (
              <img src={booking.media[0]?.url} alt={booking.id} className="object-cover w-full h-40" />
            )}
          </div>
        ))}
      </div>

      <h2 className="mt-8 mb-4 text-2xl font-bold">Venues</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <div key={venue.id} className="overflow-hidden bg-white rounded-md shadow-md">
            <img src={venue.media[0]?.url} alt={venue.name} className="object-cover w-full h-40" />
            <div className="p-4">
              <p className="text-lg font-bold">{venue.name}</p>
              <p>{venue.description}</p>
              <p>Price: {venue.price}</p>
              <p>Max Guests: {venue.maxGuests}</p>
              {/* Add more details as needed */}
            </div>
          </div>
        ))}
      </div>

      {/* Display if the user is a venue manager */}
      {isVenueManager && <p>You are a venue manager</p>}
      <CreateVenue accessToken={accessToken} apiKey={apiKey} />
    </div>
  );
};

export default ProfilePage;
