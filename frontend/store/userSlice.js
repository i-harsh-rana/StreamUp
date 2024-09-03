import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: null,
        currentUser: null, 
        watchHistory: [],
        loading: false,
        error: null
    },
    reducers:{
        fetchUserStart(state){
            state.loading = true;
            state.error = null;
        },
        fetchUserSuccess(state, action){
            state.userData = action.payload;
            state.loading = false;
        },
        fetchUserFail(state, action){
            state.error = action.payload;
            state.loading = false;
        },
        updateUserProfile(state, action){
            state.userData = {...state.userData, ...action.payload}
        },
        setWatchHistory(state, action){
            state.watchHistory = action.payload;
        },
        clearWatchHistory(state){
            state.watchHistory = [];
        }
    }
})

export const {fetchUserStart, fetchUserSuccess, fetchUserFail, updateUserProfile, setWatchHistory, clearWatchHistory} = userSlice.actions;

export const fetchCurrentUser = () => async dispatch =>{
    dispatch(fetchUserStart())
    try {
        const response = await axios.get('/api/v1/current-user', {withCredentials: true});

        if(response.status === 200){
            dispatch(fetchUserSuccess(response.data.data.user));
        }
    } catch (error) {
        dispatch(fetchUserFail(error.message))
    }
};

export const fetchUserProfile = (username) => async dispatch =>{
    dispatch(fetchUserStart())
    try {
        const response = await axios.get(`/api/v1/${username}`, {withCredentials: true});
        if(response.status === 200){
            dispatch(fetchUserSuccess(response.data.data))
        }
    } catch (error) {
        dispatch(fetchUserFail(error.message));
    }
};

export const updateAccountDetails = (newData) => async dispatch => {
    dispatch(fetchUserStart())
    try {
        const response = await axios.patch('/api/v1/update-account', newData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }} ,{withCredentials: true})

        if(response.status === 200){
            dispatch(updateUserProfile(response.data))
        }
    } catch (error) {
        dispatch(fetchUserFail(error.message))
    }
}

export const updateUserAvatar = (newAvatar) => async dispatch =>{
    dispatch(fetchUserStart())
    try {
        const response = await axios.patch('/api/v1/avatar', newAvatar, {
            headers: {
                "Content-Type": 'multipart/form-data', 
            }
        }, {withCredentials: true})

        if(response.status === 200){
            dispatch(updateUserProfile(response.data))
        }
    } catch (error) {
        dispatch(fetchUserFail(error.message))
    }
}

export const updateCoverImage = (newCoverImage) => async dispatch =>{
    dispatch(fetchUserStart())
    try {
        const response = await axios.patch('/api/v1/cover-image', newCoverImage, {
            headers: {
                "Content-Type": 'multipart/form-data', 
            }
        }, {withCredentials: true})

        if(response.status === 200){
            dispatch(updateUserProfile(response.data))
        }
    } catch (error) {
        dispatch(fetchUserFail(error.message))
    }
}

export const fetchWatchHistory = () => async dispatch =>{
    dispatch(fetchUserStart())
    try {
        const response = await axios.get('/api/v1/watch-history', {withCredentials: true})

        if(response.status === 200){
            dispatch(setWatchHistory(response.data))
        }
    } catch (error) {
        dispatch(fetchUserFail(error.message))
    }
}

export const clearHistory = () => async dispatch =>{
    dispatch(fetchUserStart());
    try {
        const response = await axios.get('/api/v1/clearhistory', {withCredentials: true});
        if(response.status === 200){
            dispatch(clearWatchHistory());
        }
    } catch (error) {
        console.error('Fail to clear history:', error.message);
    }
}