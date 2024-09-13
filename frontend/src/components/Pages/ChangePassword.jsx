import React, { useState } from 'react'
import Lottie from 'lottie-react'
import ChangePasswordLogo from '../../assets/ChangePassword.json'
import {useForm} from 'react-hook-form'
import Loading from '../util/Loadings/Loading'
import Input from '../util/Input'
import Button from '../util/Button'
import { useNavigate } from 'react-router-dom'
import qs from 'qs'
import axios from 'axios'

function ChangePassword() {
    const [loading, setLoading] = useState(false);
    const {register, handleSubmit, formState: {errors}, reset } = useForm();
    const navigate = useNavigate();

    const changeIt = async(data)=>{
        setLoading(true)
        const formData = qs.stringify({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
        })

        try {
            const response = await axios.post('/api/v1/user/change-password', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                withCredentials: true,
            })
            if(response.status === 200){
                reset();
                navigate('/profile')
            }
        } catch (error) {
            console.error('Change Password failed:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className= 'text-white w-full place-content-center'>
        <div className='h-full grid place-content-center mt-[6rem] mb-[6rem]'>
            <div className='p-10 bg-gray-box rounded-xl border-2  border-gray-400/10 shadow-3xl '>
            <div className='w-full grid place-content-center mb-10'>
                <Lottie
                animationData={ChangePasswordLogo}
                loop={true}
                autoplay={true}
                style={{ width: 150, height: 150}}
                />
            </div>
            <p className='text-white text-3xl text-center mb-8 font-medium'>Change Password</p>

                <form onSubmit={handleSubmit(changeIt)}>
                    <Input
                        label="Old Password"
                        type="password"
                        {...register("oldPassword", { required: 'Old Password is required' })}
                        error={errors.oldPassword?.message}
                        labelClassName="text-white"
                        />
                        <Input
                        label="New Password"
                        type="password"
                        {...register('newPassword', { required: 'New Password is required' })}
                        error={errors.newPassword?.message}
                        labelClassName="text-white"
                        />
                        <Button type="submit" disabled={loading} className='w-full' >
                            {loading ? "Changing Password" : "Change Password"}
                        </Button>
                </form>
                
                
            </div> 
        </div>
        {loading && <Loading/>}
    </div>
  )
}

export default ChangePassword