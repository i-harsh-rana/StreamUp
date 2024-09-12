import React, { useCallback, useEffect, useState } from 'react'
import image from '../../assets/4.jpg'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import timeCalculator from '../util/timeCalculator';
import VideoCardMini from '../videoCards/VideoCardMini';
import {Link} from 'react-router-dom'
import {motion} from 'framer-motion'


function Profile() {
    const {username} = useParams();
    const [profileData, setProfileData] = useState(null);
    const [channelVideos, setChannelVideos] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [videoVisible, setVideoVisible] = useState(false);

    const fetchProfileData = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
          const response = await axios.get(`/api/v1/user/c/${username}`, {
              withCredentials: true
          });
          if (response.status === 200) {
              setProfileData(response.data.data[0]);
          }
      } catch (error) {
          console.error("Error while fetching profile data:", error);
          setError("Failed to fetch profile data");
      } finally {
          setLoading(false);
      }
  }, [username]);

  const fetchChannelVideos = useCallback(async () => {
      try {
          const response = await axios.get(`/api/v1/video/videos-channel/${username}`, {
              withCredentials: true
          });
          if (response.status === 200) {
            setChannelVideos(response.data.data);
          }
      } catch (error) {
          console.error("Error while fetching channel videos:", error.response ? error.response.data : error.message);
      }
  }, [username]);

  useEffect(() => {
      fetchProfileData();
      fetchChannelVideos();
  }, [fetchProfileData, fetchChannelVideos]);

  const subscribeToggle = async(channelId)=>{
    try {
      const response = await axios.get(`/api/v1/subscription/t/${channelId}`, {
        withCredentials: true
      })

      if (response.status === 200) {
        setProfileData((prevState) => ({
          ...prevState,
          isSubscribed: !prevState.isSubscribed,
          subscribersCount: prevState.isSubscribed 
            ? prevState.subscribersCount - 1 
            : prevState.subscribersCount + 1,  
        }));
    }
    } catch (error) {
      console.error("Error while subscribe toggle:", error.response ? error.response.data : error.message);
    }
  }

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
      return <div className="text-white">Error: {error}</div>;
  }

  if (!profileData) {
      return <div className="text-white">No user data available</div>;
  }
    
  return (
    <div className="grid place-content-center relative">      
      <div className='text-white bg-gray-box rounded-3xl mt-10 mb-10 w-[78rem] relative'>
        <img src={profileData.coveImage ? profileData.coveImage : image} alt="CoverImage" className='rounded-t-3xl w-full h-[25rem] object-cover shadow-inner '/>
        <img src={profileData.avatar} alt="ProfileImage" className='w-[15rem] h-[15rem] rounded-full -mt-[7rem] ml-10 shadow-xl border-[0.5rem] object-cover border-gray-box ' />
        
        <button 
          onClick={() => subscribeToggle(profileData._id)} 
          className={`shadow-xl absolute right-12 mr-5 top-[28rem] rounded-full active:opacity-70 p-4 px-10 ${profileData.isSubscribed ? 'bg-hopbush-main' : 'bg-white text-black'}`}>
          {profileData.isSubscribed ? 'Subscribed' : 'Subscribe'}
        </button>
        
        <div className='mx-[4rem] grid grid-cols-5 gap-5 mt-7'>

          <div className='bg-white/5 rounded-xl col-span-3 p-8 shadow-xl h-[15.5rem] relative'>
            <p className='text-3xl font-semibold mb-3'>
              {profileData.fullName}
            </p>
            <p className='font-light opacity-80 mb-6'>
              @ {profileData.username}<br/>
            </p>
            <p className='text-lg'>
              Email: &nbsp; &nbsp; {profileData.email}
            </p>
            <p className='text-lg opacity-50 absolute bottom-6'>
              Joined: &nbsp; &nbsp; {timeCalculator(profileData.createdAt)}
            </p>
          </div>
          
          <div className='bg-white/5 rounded-xl p-8 col-span-2 shadow-xl h-[15.5rem]'>
            <p className='text-xl font-light mb-6 leading-loose'>
              Total Channel Subscribers:<br/> 
              {profileData.subscribersCount}
            </p>
            <p className='text-xl font-light leading-loose'>
              Total Videos:<br/> 
              {channelVideos ? channelVideos.length : 0}
            </p>
          </div>
        </div>
        
        {channelVideos && channelVideos.length > 0 && (
          <motion.div  
          initial={{height: '6.5rem'}}
          animate={{height: videoVisible ? '60rem' : '6.5rem'}}
          transition={{duration: 0.3, ease: 'easeInOut'}}
          className={`relative bg-white/5 shadow-xl rounded-xl mt-10 grid mx-[4rem] mb-16 ${videoVisible ? 'overflow-y-scroll scrollbar-thin scrollbar-thumb-background-all scrollbar-track-gray-box' : 'overflow-hidden '}`}>
            <div onClick={()=>setVideoVisible(!videoVisible)} className='sticky bg-black-shade top-0 text-2xl px-9 py-9 h-[6.5rem] z-20 flex justify-between'>
              Channel Videos
              {videoVisible ? <i className="fa-solid fa-angle-down"></i> : <i className={`fa-solid fa-angle-up ${!videoVisible && 'mr-3'}`}></i>}
            </div>
            <div className='grid grid-cols-3 mt-10 gap-y-10 place-content-center ml-5 mb-8'>
              {channelVideos.map((video, index) => (
                <Link to={`/video/${video._id}`} key={index}>
                  <VideoCardMini
                    thumbnail={video.thumbnail}
                    title={video.title}
                    duration={video.duration}
                    views={video.views}
                    to={video._id}
                    videoLikes={video.likes}
                    className='w-[15rem]'
                  />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>

  )
}

export default Profile