import React from 'react'
import image from '../../assets/4.jpg'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { fetchUserProfile, updateAccountDetails, updateUserProfile } from '../../../store/userSlice';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Input from '../util/Input';
import Button from '../util/Button';
import { useState } from 'react';
import qs from 'qs';

function Profile() {
    const {username} = useParams();
    const dispatch = useDispatch()
    const user = useSelector((state)=>state.user.userData);
    const {register, handleSubmit, formState: {errors}, reset} = useForm()
    const [updateDetailBox, setUpdateDetailBox] = useState(false);
 
    const handleSubscribe = async() =>{
     try {
       const response = await axios.get(`/api/v1/subscription/t/${user._id}`, {withCredentials: true});
       if(response.status === 200){
        dispatch(updateUserProfile({ 
          ...user,
          isSubscribed: !user.isSubscribed 
        }));
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
      
    }, [username, dispatch, user])
    
    const handleDetailBoxVisible = ()=>{
      setUpdateDetailBox(!updateDetailBox);
      
    }

    const updateDeatils = async (data)=>{
      const formData = qs.stringify({
        fullName:data.fullName,
        email: data.email,
      })

      try {
        dispatch(updateAccountDetails(formData));
        setUpdateDetailBox(!updateDetailBox)
      } catch (error) {
        console.error('Update Fail:', error.response ? error.response.data : error.message);
      }
    }
    
  return (
    <div className="grid place-content-center relative">
    <div className='text-white bg-gray-box rounded-3xl h-svh mt-10 mb-10  w-[70rem] relative'>
        <img src={user.coverImage ? user.coverImage : image} alt="CoverImage" className='rounded-t-3xl w-full h-[25rem] object-cover shadow-inner '/>
        <img src={user.avatar} alt="ProfileImage" className='w-[15rem] h-[15rem] rounded-full relative -top-[7rem] left-10 shadow-xl border-[0.5rem] object-cover border-gray-box ' />
        <button onClick={handleSubscribe} className={`absolute right-12 mr-5 top-[28rem]  rounded-full p-4 px-10 ${user.isSubscribed ? 'bg-hopbush-main' :'bg-white'}  ${user.isSubscribed ? ' text-white' :' text-black'}`}>{user.isSubscribed ? "Subscribed" : "Subscribe"}</button>
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
    </div>

    <div className={`absolute top-0 z-20 bg-black/60 w-full h-full ${updateDetailBox ? 'grid' : 'hidden'} place-content-center `}>
      <div className='bg-gray-box p-20 rounded-2xl relative'>
      <i class="fa-solid fa-xmark text-white absolute right-10 top-10 text-xl opacity-60 hover:opacity-90" onClick={handleDetailBoxVisible}></i>
        <form onSubmit={handleSubmit(updateDeatils)}>
            <Input 
            label="Full Name:"
            {...register('fullName', {required: 'Full name is required'})}
            error={errors.fullName?.message}
            labelClassName="text-white"
            />
            <Input 
            label="Email:"
            type='email'
            {...register('email', {required: 'Email is required'})}
            error={errors.email?.message}
            labelClassName="text-white"
            />
            <Button
            type='submit'
            children='Update'
            className='mt-4'
            />
        </form>
      </div>
    </div>
    </div>
  )
}

export default Profile