import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import timeCalculator from '../util/timeCalculator';
import { useNavigate } from 'react-router-dom';
import {motion} from 'framer-motion'

const AllVideos = ({ query }) => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('createdAt_desc');
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(1);

  const isUsernameQuery = (query) => query.startsWith('@');

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null); 
    try {
      const sortBy = sortOption.split('_')[0];
      const sortType = sortOption.split('_')[1];
      const searchParams = {
        page,
        limit,
        sortBy,
        sortType
      };

      if (query.trim() === '') {
        delete searchParams.username;
        delete searchParams.query;
      } else if (isUsernameQuery(query)) {
        searchParams.username = query.slice(1);
        delete searchParams.query;
      } else {
        searchParams.query = query;
        delete searchParams.username;
      }

      const response = await axios.get('/api/v1/video', {
        params: searchParams,
        withCredentials: true,
      });

      console.log('Response data:', response.data); 

      setVideos(response.data.data.docs || []);
      setTotalPages(response.data.data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching videos:', err); 
      setError('Error fetching videos');
    } finally {
      setLoading(false);
    }
  }, [query, page, limit, sortOption]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1)); 
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">All Videos</h2>

        {/* Combined Sorting Control */}
        <div>
          <label className="text-white mr-4">Sort by:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border-2 border-gray-400/10 text-white p-2 shadow-xl rounded bg-hopbush-main/70"
          >
            <option value="createdAt_desc">Created At Descending</option>
            <option value="createdAt_asc">Created At Ascending</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.isArray(videos) && videos.length > 0 ? (
          videos.map(video => (
            <motion.div 
            whileHover={{ scale: 1.02 }} 
            transition={{ duration: 0.2 }}
            key={video._id} 
            onClick={()=>navigate(`/video/${video._id}`)} 
            className="bg-gray-box border-2 cursor-pointer border-gray-400/10 text-white rounded-lg shadow-md overflow-hidden">
              <img loading='lazy' src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                <p className="text-xs mb-1 text-white/70">{video.owner?.fullName || 'Unknown'}</p>
                <p className="text-xs mb-1 text-white/70">{video.views}&nbsp;Views &nbsp;&nbsp;&nbsp;{timeCalculator(video.createdAt)}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center col-span-full">No videos available</div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-8 flex justify-center text-white">
        <i 
          onClick={handlePreviousPage} 
          className={`fa-solid fa-arrow-left p-2 cursor-pointer ${page === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-white'}`}
          disabled={page === 1}
        ></i>
        <p className='mx-6'>{page}</p>
        <i 
          onClick={handleNextPage} 
          className={`fa-solid fa-arrow-right p-2 cursor-pointer ${page === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-white'}`}
          disabled={page === totalPages}
        ></i>
      </div>
    </div>
  );
};

export default AllVideos;
