import React, { useEffect, useState } from 'react'
import VideoPlayer from '../util/videoPlayer/VideoPlayer'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import LoadingCircular from '../util/Loadings/LoadingCircular'
import { getSubscribersCount } from '../../services/subscription';


function Video() {
  const [videoData, setVideoData] = useState(null);
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const {videoId} = useParams()

  useEffect(() => {
    let isMounted = true; 

    const getVideoData = async () => {
      setLoading(true); 
      setError(null); 
      try {
        const response = await axios.get(`/api/v1/video/${videoId}`, {
          withCredentials: true,
        });


        if (isMounted) {
          setVideoData(response.data.data);
          setLoading(false); 
        }
      } catch (error) {
        if (isMounted) {
          setError('Error fetching video data');
          setLoading(false); 
          
          
        }
      }
    };

    getVideoData();

    return () => {
      isMounted = false; 
    };
  }, [videoId]);

  useEffect(() => {
    const fetchSubscriberCount = async () => {
      const response = await getSubscribersCount(videoData?.owner._id);
      setSubscriberCount(response);
    };

    fetchSubscriberCount();
  }, [videoData]);
  
  if (loading) {
    return <div className='text-center'><LoadingCircular/></div>;
  }

  if (error) {
    return <div className='text-center text-red-500'>{error}</div>;
  }
  console.log(videoData);
  
  return (
    <div className='grid place-content-center relative'>
      <div className='text-white bg-gray-box rounded-3xl h-[62rem] mt-10 mb-10 w-[70rem] relative'>
        {videoData && (
          <VideoPlayer
            src={videoData.videoFile}
            poster={videoData.thumbnail} 
          />
        )}
        <div>
          {videoData.title}<br/>
          {videoData.owner.fullName}<br/>
          {videoData.views}<br/>
         {subscriberCount }
          <img src={videoData.owner.avatar} className='w-12 h-12 rounded-full' />

        </div>
      </div>
    </div>
  );
}
export default Video