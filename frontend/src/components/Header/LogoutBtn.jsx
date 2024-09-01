import React from 'react'
import Button from '../util/Button'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../../store/authSlice'

function LogoutBtn() {
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const handleLogout = async()=>{
        try {
            const response = await axios.post('/api/v1/user/logout', {}, {
                withCredentials: true
            } )

            if(response.status == 200){
                dispatch(logout())
                navigate('/')
            }
        } catch (error) {
            console.error('Logout failed:', error.response ? error.response.data : error.message);
        }
    }
  return (
   <>
   <Button onClick={handleLogout} children="Logout"/ >
   </>
  )
}

export default LogoutBtn