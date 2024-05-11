import React, { useState } from 'react';

const UpdateVenue = ({ venueId, onUpdate, onDelete, apiKey }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    maxGuests: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const options = {
        method: 'PUT',
        headers: {
          'X-Noroff-API-Key': apiKey ? apiKey : '', 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      };
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venueId}`, options);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update venue');
      }
      onUpdate();
      setSuccess('Venue updated successfully.');
    } catch (error) {
      setError(error.message || 'Failed to update venue. Please try again.');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const options = {
        method: 'DELETE',
        headers: {
          'X-Noroff-API-Key': apiKey ? apiKey : '', 
        },
      };
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venueId}`, options);
      if (!response.ok) {
        throw new Error('Failed to delete venue');
      }
      onDelete();
      setSuccess('Venue deleted successfully.');
    } catch (error) {
      setError(error.message || 'Failed to delete venue. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        {/* Form fields */}
        <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded-md">
          Update Venue
        </button>
      </form>
      <button onClick={handleDelete} className="px-4 py-2 text-white bg-red-500 rounded-md">
        Delete Venue
      </button>
      {loading && <p className="mt-2">Processing...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {success && <p className="mt-2 text-green-500">{success}</p>}
    </div>
  );
};

export default UpdateVenue;
