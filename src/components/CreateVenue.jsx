import React, { useState } from 'react';

const CreateVenue = ({ accessToken, apiKey }) => {
  const [venueName, setVenueName] = useState('');
  const [venueDescription, setVenueDescription] = useState('');
  const [venuePrice, setVenuePrice] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [continent, setContinent] = useState('');
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [pets, setPets] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Noroff-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: venueName,
          description: venueDescription,
          price: parseFloat(venuePrice),
          maxGuests: parseInt(maxGuests),
          media: [
            {
              url: imageUrl,
              alt: venueName,
            },
          ],
          location: {
            address,
            city,
            zip: zipCode,
            country,
            continent,
          },
          meta: {
            wifi,
            parking,
            breakfast,
            pets,
          },
        }),
      };
      const response = await fetch(
        'https://v2.api.noroff.dev/holidaze/venues',
        options
      );
      if (!response.ok) {
        throw new Error('Failed to create venue');
      }
      // Clear form fields on successful submission
      setVenueName('');
      setVenueDescription('');
      setVenuePrice('');
      setMaxGuests('');
      setImageUrl('');
      setAddress('');
      setCity('');
      setZipCode('');
      setCountry('');
      setContinent('');
      setWifi(false);
      setParking(false);
      setBreakfast(false);
      setPets(false);
      setError(null);
      alert('Venue created successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Create Venue</h2>
      {error && <div className="text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="venueName" className="block mb-1 font-semibold">Venue Name</label>
          <input
            type="text"
            id="venueName"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label htmlFor="venueDescription" className="block mb-1 font-semibold">Venue Description</label>
          <textarea
            id="venueDescription"
            value={venueDescription}
            onChange={(e) => setVenueDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="venuePrice" className="block mb-1 font-semibold">Price per night</label>
            <input
              type="number"
              id="venuePrice"
              value={venuePrice}
              onChange={(e) => setVenuePrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label htmlFor="maxGuests" className="block mb-1 font-semibold">Maximum Guests</label>
            <input
              type="number"
              id="maxGuests"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="imageUrl" className="block mb-1 font-semibold">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label htmlFor="address" className="block mb-1 font-semibold">Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block mb-1 font-semibold">City</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label htmlFor="zipCode" className="block mb-1 font-semibold">Zip Code</label>
            <input
              type="text"
              id="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="country" className="block mb-1 font-semibold">Country</label>
            <input
              type="text"
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label htmlFor="continent" className="block mb-1 font-semibold">Continent</label>
            <input
              type="text"
              id="continent"
              value={continent}
              onChange={(e) => setContinent(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={wifi}
              onChange={(e) => setWifi(e.target.checked)}
              className="rounded"
            />
            <span>Wifi</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={parking}
              onChange={(e) => setParking(e.target.checked)}
              className="rounded"
            />
            <span>Parking</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={breakfast}
              onChange={(e) => setBreakfast(e.target.checked)}
              className="rounded"
            />
            <span>Breakfast</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={pets}
              onChange={(e) => setPets(e.target.checked)}
              className="rounded"
            />
            <span>Pets</span>
          </label>
        </div>
        <button
          type="submit"
          className="block w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Create Venue
        </button>
      </form>
    </div>
  );
};

export default CreateVenue;
