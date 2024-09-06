import React from 'react'
import image from '../../assets/4.jpg'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { clearHistory, fetchUserProfile, fetchWatchHistory, updateAccountDetails, updateCoverImage, updateUserAvatar, updateUserProfile } from '../../../store/userSlice';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Input from '../util/Input';
import Button from '../util/Button';
import { useState } from 'react';
import qs from 'qs';
import {motion} from 'framer-motion'
import { Link } from 'react-router-dom';
import VideoCardMini from '../videoCards/VideoCardMini';



function Profile() {
    const {username} = useParams();
    const dispatch = useDispatch()
    const user = useSelector((state)=>state.user.userData);
    const watchHistory = useSelector((state)=>state.user.watchHistory);
    const {register, handleSubmit, formState: {errors}, reset} = useForm()
    const [updateDetailBox, setUpdateDetailBox] = useState(false);
    const [userHistoryVisible, setUserHistoryVisible] = useState(false);
    const [chooseEditImages, setChooseEditImages] = useState(false);
    const [editAvatarBox, setEditAvatarBox] = useState(false);
    const [editCoverImageBox, setEditCoverImageBox] = useState(false);
 
    const handleSubscribe = async() =>{
     try {
       const response = await axios.get(`/api/v1/subscription/t/${user._id}`, {withCredentials: true});
       if(response.status === 200){
        dispatch(updateUserProfile({ 
          ...user,
          isSubscribed: !user.isSubscribed 
        }));
        dispatch(fetchUserProfile(username))
       }
     } catch (error) {
      console.error('Subscription Fail:', error.response ? error.response.data : error.message);
     }
    }

    useEffect(()=>{
      const fetchUser = ()=>{
        if(username){
          dispatch(fetchUserProfile(username))
        }
      }
      fetchUser();
      
    }, [username, dispatch])
    
    const handleDetailBoxVisible = ()=>{
      setUpdateDetailBox(!updateDetailBox);
      
    }

    const updateDeatils = async (data) => {
      if (!data.fullName && !data.email) {
        return alert('At least one field (Full Name or Email) is required to update!');
      }
    
      const formData = {};
    
      if (data.fullName) {
        formData.fullName = data.fullName;
      }
    
      if (data.email) {
        formData.email = data.email;
      }
    
      const stringifiedData = qs.stringify(formData);
    
      try {
        await dispatch(updateAccountDetails(stringifiedData));
        setUpdateDetailBox(!updateDetailBox);  
        dispatch(fetchUserProfile(username))
      } catch (error) {
        console.error('Update Fail:', error.response ? error.response.data : error.message);
      }
    }

    const handleHistoryBox = async()=>{
      
      try {
        await dispatch(fetchWatchHistory());
        await dispatch(fetchUserProfile(username));
        setUserHistoryVisible(!userHistoryVisible)
      } catch (error) {
        console.error('History Fail:', error.response ? error.response.data : error.message);
      }
    }

    const handleClearHistory = async()=>{
      try {
        await dispatch(clearHistory());
        await dispatch(fetchUserProfile(username));
      } catch (error) {
        console.error('History Clear Fail:', error.response ? error.response.data : error.message);
      }
    }    


    const updateAvatar = async(data)=>{
      const formData = new FormData()
      formData.append('avatar', data.avatar[0])
      try {
        await dispatch(updateUserAvatar(formData))
        await dispatch(fetchUserProfile(username))
        setEditAvatarBox(false)
      } catch (error) {
        console.error('Update Avatar Fail:', error.response ? error.response.data : error.message);
      }
    }


    const coverImageUpdate = async(data)=>{
        const formData = new FormData()
        formData.append('coverImage', data.coverImage[0])

        try {
          await dispatch(updateCoverImage(formData))
          await dispatch(fetchUserProfile(username));
          setEditCoverImageBox(false);
        } catch (error) {
          console.error('Update Cover Image Fail:', error.response ? error.response.data : error.message);
        }
    }

  return (
    <div className="grid place-content-center relative">      
      <div className='text-white bg-gray-box rounded-3xl h-[62rem] mt-10 mb-10  w-[70rem] relative'>
          <img src={user.coverImage ? user.coverImage : image} alt="CoverImage" className='rounded-t-3xl w-full h-[25rem] object-cover shadow-inner '/>
          <div>
              <i onClick={()=>setChooseEditImages(!chooseEditImages)} className="fa-regular fa-pen-to-square text-3xl absolute right-4 top-3 bg-black/70 rounded-md p-2 opacity-80 hover:opacity-100 active:opacity-80"></i>
          </div>

          <div>
          <motion.div
              initial={{ height: "0px", width: "0px" }} 
              animate={{ height: chooseEditImages ? "110px" : "0px", width: chooseEditImages ? "175px" : "0px" }} 
              transition={{ duration: 0.2, }} 
              style={{ overflow: 'hidden' }}
              className="absolute border-2 border-gray-400/10 bg-background-all rounded-lg right-16 top-14 opacity-80 grid grid-rows-2 place-content-center">
                    <div onClick={()=>setEditCoverImageBox(!editCoverImageBox)} className={`p-3 hover:bg-black/90 ${chooseEditImages ? 'block' : 'hidden'}`}>
                        Edit Cover Image
                    </div>
                    <div onClick={()=>setEditAvatarBox(!editAvatarBox)} className={`p-3 hover:bg-black/90 ${chooseEditImages ? 'block' : 'hidden'}`}>
                        Edit Avatar
                    </div>
            </motion.div>
          </div>
         
          <img src={user.avatar} alt="ProfileImage" className='w-[15rem] h-[15rem] rounded-full relative -top-[7rem] left-10 shadow-xl border-[0.5rem] object-cover border-gray-box ' />
          <button onClick={handleSubscribe} className={`shadow-xl absolute right-12 mr-5 top-[28rem]  rounded-full active:opacity-70 p-4 px-10 ${user.isSubscribed ? 'bg-hopbush-main hover:bg-hopbush-main/80 active:bg-hopbush-main' :'bg-white hover:bg-white/80'}  ${user.isSubscribed ? ' text-white' :' text-black'}`}>{user.isSubscribed ? "Subscribed" : "Subscribe"}</button>
          <div className='-top-20 relative ml-[4rem] mr-[4rem] h-[5rem] grid grid-cols-5 gap-5'>
            <div className='bg-white/5 rounded-xl col-span-3 p-8 relative shadow-xl'>
            <i class="fa-regular fa-pen-to-square absolute right-8 text-xl opacity-60 hover:opacity-90 cursor-pointer" onClick={handleDetailBoxVisible}></i>
            <p className='text-3xl font-semibold mb-3'>
            {user.fullName}
              </p>
              <p className='font-light opacity-80 mb-6'>
              @{user.username}<br/>
              </p>
              <p className='text-lg '>
              Email: &nbsp; &nbsp; {user.email}
              </p>
              <p className='text-lg opacity-50 absolute bottom-6'>
              Joined At: &nbsp; &nbsp; {user.createdAt.slice(0, 10)}
              </p>
            </div>
            <div className='bg-white/5 rounded-xl p-8 col-span-2 shadow-xl'>
            <p className='text-xl font-light mb-6 leading-loose'>
              Total Channel Subscribers:<br/> {user.subscribersCount}
            </p>
            <p className='text-xl font-light leading-loose'>
              Total Subscribed Channel:<br/>  {user.channelsSubscribedToCount}
            </p>
            </div>
          </div>
          
          <button className='bg-white/10 p-4 rounded-xl hover:bg-white/5 absolute bottom-16 right-16 shadow-xl active:opacity-70' onClick={handleHistoryBox}>Watch History</button>
      </div>

      <motion.div initial={{opacity: 0}}animate={{ opacity: updateDetailBox ? 1 : 0 }} transition={{duration: 0.1}} className={`absolute top-0 z-20 bg-black/60 w-full h-full ${updateDetailBox ? 'grid' : 'hidden'} place-content-center `}>
        <motion.div initial={{y: 30}} animate={{y:  updateDetailBox ? 0 : 30}} transition={{duration: 0.2, ease: "easeInOut"}} className='bg-gray-box p-20 rounded-2xl relative'>
        <i class="fa-solid fa-xmark text-white absolute right-10 top-10 text-xl opacity-60 hover:opacity-90" onClick={handleDetailBoxVisible}></i>
          <form onSubmit={handleSubmit(updateDeatils)}>
              <Input 
              label="Full Name:"
              {...register('fullName')}
              error={errors.fullName?.message}
              labelClassName="text-white"
              />
              <Input 
              label="Email:"
              type='email'
              {...register('email')}
              error={errors.email?.message}
              labelClassName="text-white"
              />
              <Button
              type='submit'
              children='Update'
              className='mt-4'
              />
          </form>
        </motion.div>
      </motion.div>

      <div className={`absolute top-0 z-20 w-full h-full bg-black/60  ${userHistoryVisible ? 'grid' : 'hidden'} place-content-center `}>
          <motion.div initial={{height: "10rem"}} animate={{height: userHistoryVisible ? "45rem" : "10rem"}} transition={{duration: 0.3}} className='bg-gradient-to-br from-background-all to-gray-box w-[45rem] rounded-xl shadow-inner text-white relative overflow-y-scroll scrollbar-thinscrollbar-thin scrollbar-thumb-hopbush-main' >
            <div className='text-3xl sticky top-0 z-30 bg-gradient-to-r from-background-all to-gray-box p-7 flex justify-between'>
              Watch History
              <button className={`bg-white/10 p-3 rounded-xl hover:bg-white/5 shadow-xl active:opacity-70 text-sm ${watchHistory && watchHistory.length > 0 ? "block" : "hidden"}`} onClick={handleClearHistory}>
                  <i class="fa-regular fa-trash-can mr-2"></i>
                  Clear History
              </button>
              <div className=' bg-white/10 z-40 w-8 h-8 rounded-full flex justify-center items-center' onClick={()=>setUserHistoryVisible(!userHistoryVisible)}>
                <i class="fa-solid fa-xmark text-white absolute text-2xl opacity-60 hover:opacity-90 cursor-pointer " ></i>
              </div>
            </div>
            
            <div className='grid grid-rows-none gap-4 p-9'>
            {watchHistory && watchHistory.length > 0 ? (
              watchHistory.map((history, index) => (
                  <div key={index}>
                    <Link to={`/video/${history._id}`}>
                      <VideoCardMini 
                          thumbnail={history.thumbnail} 
                          title={history.title} 
                          ownerAvatar={history.owner.avatar} 
                          ownerUsername={history.owner.username} 
                          duration={history.duration} 
                          views={history.views} 
                      />
                    </Link>
                  </div>
              ))
          ) : (
              <div className="text-center">
                  <p className='opacity-40'>Your watch history is empty.</p>
              </div>
          )}
            </div>
          </motion.div>
      </div>

      <motion.div initial={{opacity: 0}}animate={{ opacity: editAvatarBox ? 1 : 0 }} transition={{duration: 0.1}} className={`absolute top-0 z-20 bg-black/60 w-full h-full ${editAvatarBox ? 'grid' : 'hidden'} place-content-center `}>
        <motion.div initial={{y: 30}} animate={{y:  editAvatarBox ? 0 : 30}} transition={{duration: 0.2, ease: "easeInOut"}} className='bg-gray-box p-20 rounded-2xl relative mb-[25rem]'>
        <i class="fa-solid fa-xmark text-white absolute right-10 top-10 text-xl opacity-60 hover:opacity-90 bg-white/20 px-2 rounded-full" onClick={()=>setEditAvatarBox(!editAvatarBox)}></i>
          <form onSubmit={handleSubmit(updateAvatar)}>
              <Input 
              label="Avatar:"
              type='file'
              {...register('avatar', {required: 'Avatar is required'})}
              error={errors.avatar?.message}
              labelClassName="text-white"
              />
              <Button
              type='submit'
              children='Update'
              className='mt-4'
              />
          </form>
        </motion.div>
      </motion.div>


      <motion.div initial={{opacity: 0}}animate={{ opacity: editCoverImageBox ? 1 : 0 }} transition={{duration: 0.1}} className={`absolute top-0 z-20 bg-black/60 w-full h-full ${editCoverImageBox ? 'grid' : 'hidden'} place-content-center `}>
        <motion.div initial={{y: 30}} animate={{y:  editCoverImageBox ? 0 : 30}} transition={{duration: 0.2, ease: "easeInOut"}} className='bg-gray-box p-20 rounded-2xl relative mb-[25rem]'>
        <i class="fa-solid fa-xmark text-white absolute right-10 top-10 text-xl opacity-60 hover:opacity-90 bg-white/20 px-2 rounded-full" onClick={()=>setEditCoverImageBox(!editCoverImageBox)}></i>
          <form onSubmit={handleSubmit(coverImageUpdate)}>
              <Input 
              label="Cover Image:"
              type='file'
              {...register('coverImage', {required: 'CoverImage is required'})}
              error={errors.coverImage?.message}
              labelClassName="text-white"
              />
              <Button
              type='submit'
              children='Update'
              className='mt-4'
              />
          </form>
        </motion.div>
      </motion.div>

    </div>
  )
}

export default Profile