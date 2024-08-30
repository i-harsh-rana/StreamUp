import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from './Input'
import Loading from './Loading';
import axios from 'axios';
import Button from './util/Button';

function SignUp() {
    const [loading, setLoading] = useState(false);
    const {register, handleSubmit, formState: {errors}} = useForm()


    const onSubmit = async (data)=>{
        setLoading(true);

        const formData = new FormData();
        formData.append('fullName', data.fullName);
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('avatar', data.avatar[0]);
        if (data.coverImage[0]) {
            formData.append('coverImage', data.coverImage[0]);
          }

        try {
            const response = await axios.post('/api/v1/user/register', formData, {
                headers:{
                    'Content-Type' : 'multipart/form-data', 
                }
            })
        } catch (error) {
            console.error('Signup failed', error.response.data);
        }finally{
            setLoading(false);
        }

      
    }


    return(
        <div className='w-1/4 p-10 bg-gray-box rounded-xl border border-hopbush-main/20 shadow-2xl '>

            <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Full Name"
          {...register('fullName', { required: 'Full Name is required' })}
          error={errors.fullName?.message}
          labelClassName="text-white"
        />
        <Input
          label="Username"
          {...register('username', { required: 'Username is required' })}
          error={errors.username?.message}
          labelClassName="text-white"
        />
        <Input
          label="Email"
          type="email"
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message}
          labelClassName="text-white"
        />
        <Input
          label="Password"
          type="password"
          {...register('password', { required: 'Password is required' })}
          error={errors.password?.message}
          labelClassName="text-white"
        />
        <Input
          label="Avatar"
          type="file"
          {...register('avatar',  {required: 'Avatar is required'})}
          labelClassName="text-white"
        />
        <Input
          label="Cover Image"
          type="file"
          {...register('coverImage',)}
          labelClassName="text-white"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </form>
      {loading && <Loading/>}
        </div> 
    )
}

export default SignUp