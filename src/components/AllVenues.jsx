import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AllVenues = ({ onVenueClick }) => {
  const [venues, setVenues] = useState([]);
  const [visibleVenues, setVisibleVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const venuesPerPage = 12;

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues?sort=created&sortOrder=desc`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch venues');
        }

        const data = await response.json();
        console.log('Fetched venues data:', data); // Log the fetched data to inspect

        // Filter out venues without images
        const venuesWithImages = data.data.filter((venue) => venue.media.length > 0);

        setVenues(venuesWithImages); // Set venues directly without sorting
        setVisibleVenues(venuesWithImages.slice(0, venuesPerPage));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching venues:', error); // Log any errors that occur
        setError(error);
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const handleShowMore = () => {
    const newPage = page + 1;
    const newVisibleVenues = venues.slice(0, newPage * venuesPerPage);
    setPage(newPage);
    setVisibleVenues(newVisibleVenues);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="grid grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleVenues.map((venue) => (
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
                  <h2 className="mb-2 overflow-hidden text-lg font-semibold card-title">{venue.name}</h2>
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
      {visibleVenues.length < venues.length && (
        <div className="flex justify-center mt-8">
          <button onClick={handleShowMore} className="px-6 py-3 text-white rounded-3xl btn btn-primary">
            Show More Venues
          </button>
        </div>
      )}
    </div>
  );
};

export default AllVenues;
