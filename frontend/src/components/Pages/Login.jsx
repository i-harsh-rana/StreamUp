import React, {useState} from 'react'
import Input from '../util/Input'
import Button from '../util/Button'
import { useForm } from 'react-hook-form'
import Loading from '../util/Loading'
import axios from 'axios'
import {motion} from 'framer-motion'
import Lottie from 'lottie-react'
import loginlogo from '../../assets/Login.json'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../../../store/authSlice'
import qs from 'qs'


function Login() {
    const [loading, setLoading] = useState(false);
    const {register, handleSubmit, formState: {errors}} = useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onSubmit = async (data) => {
        setLoading(true);
    
        // Prepare data in x-www-form-urlencoded format
        const formData = qs.stringify({
            username: data.usernameOrEmail.includes('@') ? undefined : data.usernameOrEmail,
            email: data.usernameOrEmail.includes('@') ? data.usernameOrEmail : undefined,
            password: data.password,
        });
    
        try {
    
            const response = await axios.post('/api/v1/user/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                withCredentials: true
            });
    
            if (response) {
                dispatch(login(response.data.data));
                navigate('/videos');
            }
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    }
  return (
    <div className='relative h-[56rem] w-full overflow-hidden'>
        <div className='absolute right-0 z-10 w-1/2 h-full grid place-content-center'>
            <div className=' w-6/7 p-10 bg-gray-box rounded-xl border-2  border-gray-400/10 shadow-3xl '>

            <p className='text-white text-3xl text-center mb-8 font-medium'>Welcome Back User</p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        label="Username or Email"
                        {...register("usernameOrEmail", { required: 'Username or Email is required' })}
                        error={errors.usernameOrEmail?.message}
                        labelClassName="text-white"
                        />
                        <Input
                        label="Password"
                        type="password"
                        {...register('password', { required: 'Password is required' })}
                        error={errors.password?.message}
                        labelClassName="text-white"
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? "Logging In..." : "Log In"}
                        </Button>
                </form>
                {loading && <Loading/>}
                <Link to='/signup'><p className='text-white text-center mt-7'>New User? Please Sign Up</p></Link>
                
            </div> 
        </div>
        <motion.div initial={{width: "100%", x: 0}} animate={{width: "50%", x: -1}} transition={{ duration: 0.5, stiffness: 100, damping: 13,  delay:2.5, type: "spring" }} className='absolute z-20  bg-background-all w-full h-full grid place-content-center  rounded-xl border-r-8 border-hopbush-main/50'>
        <Lottie
            animationData={loginlogo}
            loop={true}
            autoplay={true}
            style={{ width: 500, height: 500 }}
        />
        </motion.div>
    </div>
  )
}

export default Login