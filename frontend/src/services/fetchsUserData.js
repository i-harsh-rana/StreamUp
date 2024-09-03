import axios from 'axios'
import { login } from '../../store/authSlice'

export const fetchUserProfile = async (username)=>{
    try {
        const response = await axios.get(`/api/v1/user/profile/${username}`, {
            withCredentials: true
        })
        console.log(response.data.data);
        
        dispatch(login(response.data.data))
    } catch (error) {
        console.error('Failed to fetch user profile:', error.message);
    }
}
