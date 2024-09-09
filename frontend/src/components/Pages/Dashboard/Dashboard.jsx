import React, { useEffect, useState, useRef } from 'react'
import img from '../../../assets/4.jpg'
import {motion} from 'framer-motion'
import axios from 'axios'
import timeCalculator from '../../util/timeCalculator'
import VideoCardMini from '../../videoCards/VideoCardMini'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './Slide.css'
import { Link } from 'react-router-dom'


function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [watchHistory, setWatchHistory] = useState([]);
    const [channelVideo, setChannelVideo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const settings = {
      infinite: false,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 3
      };

    useEffect(()=>{
        const fetchDashboardData = async()=>{
            setLoading(true);
           try {
            const response  = await axios.get('/api/v1/dashboard/stats', {
                withCredentials: true
            })

            if(response.status === 200){
                const {userId, findVideosOfChannel } = response.data.data;
console.log(response.data.data);

                setUserData(userId);
                setWatchHistory(userId.watchHistory);
                setChannelVideo(findVideosOfChannel);

            }
           } catch (error) {
                console.error("Error while fetch dashboard data", error);
                setError(error.message);
           }finally{
            setLoading(false);
           }
            

            
        }

        fetchDashboardData();
    }, [])

    const handleClearHistory = async()=>{
      try {
        setLoading(true)
        const response = await axios.get(`api/v1/user/clearhistory`, {
          withCredentials: true
        })
        if(response.status===200){
          setWatchHistory([])
        }
      } catch (error) {
        console.error("Error while cleaing history", error);
        setError(error.message);
      }finally{
        setLoading(false)
      }
    }

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    if (error) {
        return <div className="text-white">Error: {error}</div>;
    }

    if (!userData) {
        return <div className="text-white">No user data available</div>;
    }

  return (
    <div className="grid place-content-center relative">   
        <div className='text-white bg-gray-box rounded-3xl  mt-10 mb-10  w-[70rem] relative '>
          <img src={userData.coverImage ? userData.coverImage : img} alt="CoverImage" className='rounded-t-3xl w-full h-[25rem] object-cover shadow-inner '/>
          <div>
              <i  className="fa-regular fa-pen-to-square text-3xl absolute right-4 top-3 bg-black/70 rounded-md p-2 opacity-80 hover:opacity-100 active:opacity-80"></i>
          </div>

          <div>
          <motion.div
              initial={{ height: "0px", width: "0px" }} 
              animate={{ height:  "110px" , width:  "175px"  }} 
              transition={{ duration: 0.2, }} 
              style={{ overflow: 'hidden' }}
              className="absolute border-2 border-gray-400/10 bg-background-all rounded-lg right-16 top-14 opacity-80 grid grid-rows-2 place-content-center">
                    <div  className={`p-3 hover:bg-black/90 `}>
                        Edit Cover Image
                    </div>
                    <div className={`p-3 hover:bg-black/90 `}>
                        Edit Avatar
                    </div>
            </motion.div>
          </div>
         
          <img src={userData.avatar} alt="ProfileImage" className='w-[15rem] h-[15rem] rounded-full relative -top-[7rem] left-10 shadow-xl border-[0.5rem] object-cover border-gray-box ' />

          <div className='-top-20 relative ml-[4rem] mr-[4rem] h-[5rem] grid grid-cols-5 gap-5'>
            <div className='bg-white/5 rounded-xl col-span-3 p-8 relative shadow-xl'>
            <i class="fa-regular fa-pen-to-square absolute right-8 text-xl opacity-60 hover:opacity-90 cursor-pointer" ></i>
            <p className='text-3xl font-semibold mb-3'>
            {userData.fullName}
              </p>
              <p className='font-light opacity-80 mb-6'>
              @{userData.username}<br/>
              </p>
              <p className='text-lg '>
              Email: &nbsp; &nbsp; {userData.email}
              </p>
              <p className='text-lg opacity-50 absolute bottom-6'>
              Joined: &nbsp; &nbsp; {timeCalculator(userData.createdAt)}
              </p>
            </div>
            <div className='bg-white/5 rounded-xl p-8 col-span-2 shadow-xl'>
            <p className='text-xl font-light mb-6 leading-loose'>
              Total Channel Subscribers:<br/> {userData.subscribersCount}
            </p>
            <p className='text-xl font-light leading-loose'>
              Total Subscribed Channel:<br/>  {userData.subscribedChannelsCount}
            </p>
            </div>
          </div>   

          <div className='mt-32'>
            {watchHistory && watchHistory.length && <div className="mb-10 m-12">
              <div className='mb-8 pt-10 flex justify-between'>
                <div className='text-3xl '>
                  Watch History
                </div>
                <div>
                  <button className={`bg-white/10 p-3 rounded-xl hover:bg-white/5 shadow-xl active:opacity-70 text-sm mr-4`} onClick={handleClearHistory}>
                      <i class="fa-regular fa-trash-can mr-2"></i>
                      Clear History
                  </button>
                </div>
              </div>
              <Slider {...settings}>
                  {watchHistory.map((video, index) => (
                    <Link to={`/video/${video._id}`}>
                      <div key={index}>
                          <VideoCardMini
                          thumbnail={video.thumbnail}
                          title={video.title}
                          ownerAvatar={video.owner.avatar}
                          ownerUsername={video.owner.username}
                          duration={video.duration}
                          views={video.views}
                          />
                      </div>
                    </Link>
                  ))}
              </Slider>
            </div>}

            {channelVideo && channelVideo.length>0 && <div className=' m-8 mt-12'>
              <div className='text-3xl'>Channel Videos</div>
                <div className='grid grid-cols-3 gap-4 gap-y-7 place-content-center'>
                  {
                    channelVideo.map((video, index)=>(
                      <div key={index}>
                        <Link to={`/video/${video._id}`}>
                          <div key={index}>
                              <VideoCardMini
                              thumbnail={video.thumbnail}
                              title={video.title}
                              duration={video.duration}
                              views={video.views}
                              className='w-[21rem]'
                              />
                          </div>
                        </Link>
                      </div>
                    ))
                  }
                </div>
              </div>}
                
            
            
          </div>
    </div>
    
    </div>
  )
}

export default Dashboard