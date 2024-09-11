import React, { useCallback, useEffect, useState } from 'react'
import VideoPlayer from '../util/videoPlayer/VideoPlayer'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import qs from 'qs';

function VideoManage() {
    const {videoId} = useParams();
    const [videoData, setVideoData] = useState();
    const [loading, setLoading] = useState();
    const [error, setError] = useState();
    const [updateDetails, setUpdateDetails] = useState(false);
    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        defaultValues: {
            title: `${videoData?.title}`,
            description: `${videoData?.description}`,
          },
    });


    const fetchVideoData = useCallback( async(videoId)=>{
        setLoading(true);
        try {
            const response = await axios.get(`/api/v1/video/${videoId}`, {
                withCredentials: true,
            })

            if(response.status===200){
                setVideoData(response.data.data);
            }
        } catch (error) {
            console.error("Error while fetching video data, " , error);
            
        }finally{
            setLoading(false)
        }
    }, [])

    useEffect(()=>{
        fetchVideoData(videoId)
    }, [fetchVideoData])

    useEffect(() => {
        if (videoData) {
          reset({
            title: videoData.title || '',
            description: videoData.description || '',
          });
        }
      }, [videoData, reset]);

      const handleUpdateDetails = async (data) => {
        if (!data.title && !data.description) {
            setUpdateDetails(!updateDetails);
            return;
        }
    
        const formData = {};
        if (data.title) formData.title = data.title;
        if (data.description) formData.description = data.description;
    
        const stringifiedData = qs.stringify(formData);
    
        try {
            const response = await axios.patch(`/api/v1/video/edit/${videoId}`, stringifiedData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                withCredentials: true, 
            });
    
            if (response.status === 200) {
                setVideoData({
                    ...videoData,
                    title: response.data.data.title,
                    description: response.data.data.description,
                });
                setUpdateDetails(false);
            }
        } catch (error) {
            console.error("Error while updating video data", error);
        }
    };

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    if (error) {
        return <div className="text-white">Error: {error}</div>;
    }

    if (!videoData) {
        return <div className="text-white">No video Data available</div>;
    }

  return (
    <div className='w-full h-full grid place-content-center p-10'>
        <div className='text-white w-[90rem] bg-gray-box border-2 border-gray-400/10 p-8 rounded-xl'>
            <div className='text-3xl'>
                Manage Video:
            </div>
            <div className='grid grid-cols-2'>
                <div className='m-10 ml-0'>
                <VideoPlayer 
                        src={videoData.videoFile} 
                        poster={videoData.thumbnail} 
                        width='600px' height='400px'
                    />
                </div>
                <div className='m-10 ml-0 grid relative'>
                    <form onSubmit={handleSubmit(handleUpdateDetails)} className=' grid grid-rows-6'>
                        <div className='p-2 row-span-2'>
                            {updateDetails ? 
                            <i onClick={()=>setUpdateDetails(!updateDetails)}  className="fa-solid fa-xmark absolute right-5 opacity-70 hover:opacity-90 active:opacity-70 text-2xl"></i>
                            :
                            <i onClick={()=>setUpdateDetails(!updateDetails)} className="absolute right-5 fa-regular fa-pen-to-square opacity-70 hover:opacity-90 active:opacity-70 text-2xl"></i>}  
                            <p className='text-xl'>Title:</p>
                            {updateDetails ? (
                                 <textarea 
                                 {...register('title')}
                                 error={errors.title?.message}
                                 labelClassName="text-white"
                                 className='bg-background-all focus:bg-background-all border-none p-2 rounded-lg resize-none mt-3'
                                 rows={1}
                                 cols={70}
                               />
                            ) : (
                                <p className='mt-3 p-2'>{videoData.title}</p>
                            )}
                        </div>
                        <div  className=' row-span-4 p-2 relative'>
                            <p className='text-xl'>Description:</p>

                            {updateDetails ? (
                                <textarea 
                                {...register('description')}
                                error={errors.description?.message}
                                labelClassName="text-white"
                                className='bg-background-all focus:bg-background-all border-none p-2 rounded-lg resize-none mt-3'
                                rows={6}
                                cols={70}
                              />
                            ) : (
                                <p className='mt-3 p-2'>{videoData.description}</p>
                            )}
                            {updateDetails && <button type='submit' className='p-1 px-4 rounded-full mt-5 bg-white text-black hover:scale-105 transition-all ease-in-out active:scale-100'>Save</button>}
                        </div>
                    </form>
                </div>
            </div>
            
            

        </div>
    </div>
  )
}

export default VideoManage