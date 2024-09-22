import React from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import { persistor } from '../../store/store';

function LogoutBtn({ className = '' }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await axios.post('/api/v1/user/logout');

            if (response.status === 200) {
                dispatch(logout());

                localStorage.clear();
                await persistor.purge();

                navigate('/');
            }
        } catch (error) {
            console.error('Logout failed:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className={`text-white cursor-pointer ${className}`} onClick={handleLogout}>
            LogOut
        </div>
    );
}

export default LogoutBtn;
