import background from '/Blue-Background-form.jpg';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { DevTool } from '@hookform/devtools';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
const CreateUser = () => {

    const navigate = useNavigate();

    useEffect(() => {
    //   const token = localStorage.getItem('token');
    const token = localStorage.getItem('token');
      if(!token) {
        navigate('/', { replace: true });
      }  
    }, [navigate])

    const form = useForm();
    const { register, control, handleSubmit, formState: { errors }, setError } = form;

    const onsubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
          setError('confirmPassword', {
            message: 'Passwords do not match',
          });
          return;
        }

        try {
            await axios.post('http://localhost:3001/api/user/register', {
                username: data.username,
                email: data.email,
                password: data.password,
                phone: data.phone,
                file: data.file
            });

            form.reset();

            navigate('/dashboard');

        } catch(err) {
            if(err.response && err.response.data && err.response.data.message) {
                toast(err.response.data.message);
                form.reset();
            }
            console.log('Login failed' ,  err.response.data.message)
        }
      
      };

  return (
    <div className="flex justify-center items-center min-h-screen py-8" style={{background: `url(${background})`}}>
        {/* Back Button */}
        <button
            onClick={() => navigate(-1)} // This will navigate to the previous page
            className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
            Back
        </button>
        
        <div className="overflow-x-auto w-full max-w-3xl">
            <form onSubmit={handleSubmit(onsubmit)} noValidate
            className="p-8 rounded-lg shadow-2xl w-full space-y-6 border-2 border-gray-300"
            >
            <h2 className="text-2xl font-semibold text-center text-blue-600">Create User Account</h2>

            {/* Name and Email on the same line */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('username', {
                        required: {
                            value: true,
                            message: 'Username is required'
                        },
                        validate: {
                            isValidateUser: (val) => {
                                const regex = /^[A-Za-z\s]+$/;
                                return regex.test(val) || 'Pls enter a valid username'
                            }
                        }
                    })}
                />
                {errors.username && <p className='text-red-700 font-semibold text-sm'>{errors.username.message}</p>}
                </div>
                
                <div>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('email', {
                        required: {
                            value:true,
                            message: 'Email is required'
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
            </div>

            {/* Password and Confirm Password on the same line */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('password', {
                        required: {
                            value: true, 
                            message: 'Password is required'
                        },
                        validate: {
                            isValidLength: (val) => {
                                if (val.length < 6) {
                                  return 'Password must be at least 6 digits';
                                }
                                return true;
                            },
                            isValidatePassword: (val) => {
                                const regex = /^(?=.*\d).{6,}$/;
                                return regex.test(val) || 'Pls enter a valid password'
                            }
                        }
                    })}
                />
                {errors.password && <p className='text-red-700 font-semibold text-sm'>{errors.password.message}</p>}
                </div>

                <div>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('confirmPassword', {
                        required: {
                            value: true, 
                            message: 'Confirm Password is required'
                        },
                    })}
                />
                {errors.confirmPassword && <p className='text-red-700 font-semibold text-sm'>{errors.confirmPassword.message}</p>}
                </div>
            </div>

            {/* Phone Number and Profile Picture */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <input
                        type="tel"
                        placeholder="Phone"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register('phone', {
                        required: {
                            value: true,
                            message: 'Phone number is required',
                        },
                        pattern: {
                            value: /^[0-9]{10}$/, 
                            message: 'Phone number must be exactly 10 digits',
                        }
                        })}
                    />
                    {errors.phone && <p className="text-red-700 font-semibold text-sm">{errors.phone.message}</p>}
                </div>
                <div>
                    <input
                        type='file'
                        accept='image/jpej, image/png'
                        {...register('profile',)}
                        // onChange={handleFileChange}
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white py-2 rounded-lg hover:from-blue-600 hover:to-teal-500 transition duration-300"
            >
                Submit
            </button>
            </form>
            <DevTool control={control} />
        </div>
    </div>
  );
};

export default CreateUser;
