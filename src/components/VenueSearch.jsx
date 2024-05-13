import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VenueSearch = ({ onVenueClick }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/search?q=${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }

        const data = await response.json();
        setSearchResults(data.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (query.trim() !== '') {
      fetchVenues();
    } else {
      setSearchResults([]);
    }
  }, [query]);

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 mb-8">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search venues by name or description"
        className="p-2 border rounded-md border-primary focus:outline-none focus:ring-2 focus:ring-primary"
        style={{ width: '100%', maxWidth: '500px' }}
      />

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      <div className="grid grid-cols-1 gap-8 px-4 py-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {searchResults.map((venue) => (
          <div key={venue.id}>
            <Link to={`/venues/${venue.id}`}> 
              <div className="transition-transform transform shadow-xl cursor-pointer card bg-base-100 hover:scale-105">
                <figure>
                  <img
                    src={venue.media[0]?.url || 'https://via.placeholder.com/300'}
                    alt={venue.media[0]?.alt || 'Venue Image'}
                    className="object-cover w-full h-48 rounded-t-md"
                  />
                </figure>
                <div className="p-4 card-body">
                  <h2 className="mb-2 text-lg font-semibold card-title">{venue.name}</h2>
                  <p>Price: ${venue.price}</p>
                  <div className="flex flex-wrap mt-2">
                    {Object.entries(venue.meta).map(([tag, value]) => (
                      <div
                        key={tag}
                        className={`badge badge-outline ${value ? 'badge-primary' : 'badge-secondary'} mr-2 mb-2`}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenueSearch;
