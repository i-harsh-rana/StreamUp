import React, { useState } from 'react'
import Logo from '../../assets/StreamUp.svg'
import LogoutBtn from './LogoutBtn'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Button from '../util/Button'
import {motion} from 'framer-motion'

function Header() {










  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status) 
  const userData = useSelector((state)=> state.auth.userData)
  const [dropDown, setDropDown] = useState(false)

  const avatar = userData?.avatar || "N/A"
  const fullName = userData?.fullName || "N/A"

  const handleDropDown = ()=>{
    setDropDown(!dropDown);
  }
  
  const navLinks = [
    {
      name: 'Explore',
      link: '/videos',
      active: authStatus
    },
    {
      name: 'Login',
      link: '/login',
      active: !authStatus
    },
    {
      name: 'Register',
      link: '/signup',
      active: !authStatus
    }
  ]

  return (


    <header className='sticky top-0 z-30 bg-gray-box opacity-100 w-full p-5 pl-6 border-l-8 border-l-hopbush-main border-b-2 border-b-gray-400/10 flex'>

        <Link to='/' className='place-content-center'>
        <img src={Logo} alt="" className='w-[11rem]'/>
        </Link>

        <ul className='pt-8 md:pt-0 flex ml-auto'>
            {navLinks.map((item) => 
            item.active ? (
              <li key={item.name}>
                <Button
                className='ml-5 mr-5'
                onClick={() => navigate(item.link)}
                children={item.name} />
              </li>
            ) : null
            )}
            {authStatus && (
              <li>
                  <div className=' text-white cursor-pointer h-[100%] p-3 grid grid-cols-2 place-content-center bg-background-all rounded-xl border-2 border-gray-400/10 shadow-inner active:bg-gray-box' onClick={handleDropDown}>
                    <div className='place-content-center ml-2 '><i className={`uis ${dropDown ? 'uis-angle-down' : 'uis-angle-up'} text-2xl mr-4`}></i>{fullName}</div>
                    <div><img src={avatar} alt="avatar" className='w-[3rem] h-[3rem] ml-6 rounded-full object-cover' /></div>
                  </div>
                  <motion.div
                    initial={{ height: "0px" }} 
                    animate={{ height: dropDown ? "130px" : "0px" }} 
                    transition={{ duration: 0.3 }} 
                    style={{ overflow: 'hidden' }}
                    className="absolute border-2 border-gray-400/10 bg-background-all rounded-lg"
                  >
                    <div className='w-[10rem] grid place-content-center grid-rows-2 '>
                      <motion.div 
                      initial={{y: -9, opacity: 0}}
                      animate={{y: dropDown ? 0 : -9, opacity: dropDown ? 1 : 0}}
                      transition={{duration: 0.2, delay: 0.3}}
                      className='w-[10rem] h-[4rem] flex items-center justify-center p-5 hover:bg-gray-box rounded-lg'>
                        <Link to='/profile' className='text-white block '>My Profile</Link>
                      </motion.div>
                      <motion.div 
                      initial={{y: -9, opacity: 0}}
                      animate={{y: dropDown ? 0 : -9, opacity: dropDown ? 1 : 0}}
                      transition={{duration: 0.2, delay: 0.3}}
                      className='w-[10rem] h-[4rem] flex items-center justify-center p-5 hover:bg-gray-box rounded-lg'>
                        <LogoutBtn />
                      </motion.div>
                    </div>
                  </motion.div>
              </li>
            )}
          </ul>









       



    </header>
  )
}

export default Header