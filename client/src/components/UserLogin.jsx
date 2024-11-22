import background from '/Blue-Background-form.jpg'; 
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../redux/ProfileContext';

const UserLogin = () => {

    const form = useForm();
    const { register, control, handleSubmit, formState: {errors} } = form;

    const navigate = useNavigate();
    const { setUserToken } = useProfile();

    const onsubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:3001/api/user/login', {
                email: data.email,
                password: data.password,
            });
    
            const token = response.data.token;
    
            setUserToken(token);  // Update the userToken state
    
            form.reset();
    
            // Only navigate after the state has been updated
            navigate('/userProfile');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                toast(err.response.data.message);
                form.reset();
            }
            console.error('Login failed:', err.response?.data?.message);
        }
    };
    
    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${background})` }}
        >
        <form className="bg-opacity-100 p-6 rounded-lg shadow-2xl w-full sm:w-96"
        onSubmit={handleSubmit(onsubmit)} noValidate>
            <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">User Login</h2>
        
            <div className="mb-4">
            <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('email', {
                    required: {
                        value: true,
                        message: 'Email is requierd'
                    },
                    validate: {
                        isValidateEmail: (val) => {
                            const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                            return regex.test(val) || "Pls enter a valid email";
                        }
                    }
                })}
            />
            {errors.email && <p className='text-red-700 font-semibold text-sm'>{errors.email.message}</p>}
            </div>

            <div className="mb-4">
            <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('password', {
                    required: {
                        value: true, 
                        message: 'Password is required'
                    },
                    validate: {
                        isValidatePassword: (val) => {
                            const regex = /^(?=.*\d).{6,}$/;
                            return regex.test(val) || 'Pls enter a valid password'
                        }
                    }
                })}
            />
            {errors.password && <p className='text-red-700 font-semibold text-sm'>{errors.password.message}</p>}
            </div>

            <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white py-2 rounded-lg hover:from-blue-600 hover:to-teal-500 transition duration-300"
            >
            Login
            </button>

            {/* Links */}
                <div className="mt-4 text-center">
                    <p className="text-m font-semibold text-gray-500">
                        Don&apos;t have an account? <a href="/register" className="hover:underline text-blue-600 font-normal">Register</a>
                    </p>
                    <p className="text-m font-semibold text-gray-500 mt-2">
                        Admin? <a href="/adminLogin" className="hover:underline text-blue-600 font-normal">Go to Admin Login</a>
                    </p>
                </div>

        </form>
        <DevTool control={control} />
        </div>
    );
    };

    export default UserLogin;
