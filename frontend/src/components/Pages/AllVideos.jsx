import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllVideos = ({ query }) => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideos = async () => {
    console.log('Fetching videos with query:', query); // Debugging
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/video', {
        params: { page, limit, query },
      });
      console.log('Response data:', response.data); // Debugging
      setVideos(response.data.data.docs || []); // Adjust based on the actual response structure
      setLoading(false);
    } catch (err) {
      console.error('Error fetching videos:', err); // Debugging
      setError('Error fetching videos');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [query, page, limit]); // Fetch when query, page, or limit changes

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.isArray(videos) && videos.length > 0 ? (
          videos.map(video => (
            <div key={video._id} className="bg-gray-box border-2 border-gray-400/10 text-white rounded-lg shadow-md overflow-hidden">
              <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                <p className="text-xs mb-1"><strong>Created At:</strong> {new Date(video.createdAt).toLocaleDateString()}</p>
                <p className="text-xs mb-1"><strong>Duration:</strong> {video.duration.toFixed(2)} seconds</p>
                <p className="text-xs mb-1"><strong>Views:</strong> {video.views}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center col-span-full">No videos available</div>
        )}
      </div>
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-500"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllVideos;