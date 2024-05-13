import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CreateVenue from '../components/CreateVenue';

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
        <div className="flex flex-col items-center mb-6">
          {profile.avatar && (
            <div className="w-32 h-32 mb-4 overflow-hidden rounded-full">
              <img src={profile.avatar.url} alt="Avatar" className="object-cover w-full h-full" />
            </div>
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
                className="block w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              />
            ) : (
              <p className="mb-2">{profile.bio}</p>
            )}
            {isEditing && (
              <textarea
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                placeholder="Enter new bio"
                className="block w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              />
            )}
          </div>
        </div>
      )}
      
      {/* Edit Profile */}
      {isEditing ? (
        <div className="flex items-center justify-center mb-4 space-x-4">
          <button
            onClick={handleUpdate}
            disabled={!newBio || !newAvatarUrl}
            className="px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Save Changes
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-3 text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="flex px-6 py-3 mx-auto text-white rounded-3xl btn btn-primary"
        >
          Edit Profile
        </button>
      )}

      {/* Display User Bookings */}
      <h2 className="mt-8 mb-4 text-2xl font-bold">My Bookings</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <div key={booking.id} className="overflow-hidden bg-white shadow-xl rounded-xl">
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
          </div>
        ))}
      </div>

      {/* Display User Venues */}
      <h2 className="mt-8 mb-4 text-2xl font-bold">My Venues</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <Link key={venue.id} to={`/venues/${venue.id}/details`} className="cursor-pointer">
            <div className="overflow-hidden bg-white shadow-xl rounded-xl">
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
            </div>
          </Link>
        ))}
      </div>
      
      {/* Create Venue Button */}
      <CreateVenue accessToken={accessToken} apiKey={apiKey} />
    </div>
  );
};

export default ProfilePage;
