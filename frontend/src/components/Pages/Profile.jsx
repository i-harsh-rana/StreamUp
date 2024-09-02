import React from 'react'
import image from '../../assets/4.jpg'
import { useSelector } from 'react-redux'

function Profile() {
    const userData = useSelector((state)=>state.auth.userData);

    const username = userData?.username || "N/A"
    
    
  return (
    <div className="grid place-content-center">
    <div className='text-white bg-gray-box rounded-3xl h-svh mt-10  w-[70rem]'>
        <img src={coverImage === "N/A" ? image : coverImage} alt="CoverImage" className='rounded-t-3xl w-full h-[25rem] object-cover shadow-inner '/>
        <img src={avatar} alt="ProfileImage" className='w-[15rem] h-[15rem] rounded-full relative -top-[7rem] left-10 shadow-xl border-[0.5rem] border-gray-box ' />
        <div className='border-2 ml-[4rem] mr-[4rem] h-[5rem]'>
           <h1 className='text-2xl font-semibold'>{fullName}</h1>
           <p>@{username}</p>
           Email: {email}<br />
           {joined}
          

        </div>
    </div>
    </div>
  )
}

export default Profile