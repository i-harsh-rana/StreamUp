import React, { useEffect, useState } from 'react';
import VideoPlayer from '../util/videoPlayer/VideoPlayer';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LoadingCircular from '../util/Loadings/LoadingCircular';
import { getSubscribersCount } from '../../services/subscription';
import { fetchVideoComment } from '../../services/comment';
import VideoComment from '../comment/VideoComment';

function Video() {
  const [videoData, setVideoData] = useState(null);
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { videoId } = useParams();
  const [commentData, setCommentData] = useState(null);

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
    if (videoData?.owner?._id) {
      const fetchSubscriberCount = async () => {
        const response = await getSubscribersCount(videoData.owner._id);
        setSubscriberCount(response);
      };

      fetchSubscriberCount();
    }
  }, [videoData]);


  if (loading) {
    return (
      <div className='text-center'>
        <LoadingCircular/>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center text-red-500'>{error}</div>
    );
  }

  return (
    <div className='grid place-content-center relative'>
      <div className='text-white bg-gray-box rounded-3xl mt-10 mb-10 w-[70rem] relative'>
        {videoData && (
          <VideoPlayer
            src={videoData.videoFile}
            poster={videoData.thumbnail}
          />
        )}
        <div className='p-6'>
          <div className='text-3xl font-semibold mb-8'>
            {videoData.title}
          </div>
          <div className='grid grid-cols-3 w-[12rem] gap-4'>
            <img src={videoData.owner.avatar} className='w-12 h-12 rounded-full' alt='Owner avatar' />
            <div>
              <p className='text-xl'>{videoData.owner.fullName}</p>
              <div className='opacity-75 flex col-span-2'>
                {subscriberCount} <p className='ml-2'>Subscribers</p>
              </div>
            </div>
          </div>

          {videoData.views}<br />

          <div>
            {videoData.description}
          </div>

          <div className='rounded-[1.3rem] p-6 mt-6'>
           <VideoComment videoId={videoId}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Video;
