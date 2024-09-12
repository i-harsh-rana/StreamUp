import React from 'react'
import Button from '../util/Button'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../../store/authSlice'

function LogoutBtn({className = ''}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const handleLogout = async()=>{
        try {
            const response = await axios.post('/api/v1/user/logout', {
                withCredentials: true
            } )

            if(response.status === 200){
                dispatch(logout())

                localStorage.clear();

                await persistor.purge();

                navigate('/');

            }
        } catch (error) {
            console.error('Logout failed:', error.response ? error.response.data : error.message);
        }
    }
  return (
   <>
   <div className='text-white cursor-pointer' onClick={handleLogout}>LogOut</div>
   </>
  )
}

export default LogoutBtn