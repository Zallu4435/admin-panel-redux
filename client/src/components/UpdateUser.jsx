import background from '/Blue-Background-form.jpg';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { editUserSchema } from '../utils/validationSchema';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useProfile } from '../redux/ProfileContext';

const UpdateUser = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const { userId, clearUserId } = useProfile();

    
    useEffect(() => {

        const token = localStorage.getItem('UserToken');
        if(!token) {
            navigate('/', { replace: true });
            return;
        }
 
        // Fetch the current user data by user ID
        const fetchUser = async () => {
            console.log(userId,'hhhhh');
            
          try {
            const response = await axios.get(`http://localhost:3001/api/user/profile/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            console.log(response.data);
            setUser(response.data);
            
          } catch (err) {
            console.log(err);
            toast.error('Failed to fetch user data');
          }
        };
    
        fetchUser();
      }, [navigate, userId]);

    const { register, control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(editUserSchema),
    });


    useEffect(() => {

        if (user) {
          setValue('username', user.username); 
          setValue('password', user.password); 
          setValue('username', user.username); 
          setValue('email', user.email);
          setValue('phone', user.phone);
        }
      }, [user, setValue]);

      const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile); // Save selected file to state
      };

    const onsubmit = async (data) => {
        console.log('Form data submitted:', data); // Check if this is being logged
        const { username, email, phone } = data;

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('phone', phone);
    
        if (file) {
        formData.append('profile', file); // Append the file to the FormData
        }

        const token = localStorage.getItem('UserToken')

        try {
        // Make the API request to update the user
        const response = await axios.put(
            `http://localhost:3001/api/user/profile/${userId}`, // Update URL as needed
            formData,
            {
            headers: {
                Authorization: `Bearer ${token}`,
                // 'Content-Type': 'multipart/form-data', // Axios will set this for you when using FormData
            },
            }
        );
    
        if (response.status === 200) {
            // If the update is successful, show a success message
            toast.success('User updated successfully');
            clearUserId(userId);
            localStorage.removeItem('UserToken');
            navigate('/'); // Redirect to the dashboard
        }
        } catch (err) {
        console.error('Error updating user:', err);
        toast.error('Failed to update user');
        }
    };

    return (
        <div
            className="flex justify-center items-center min-h-screen py-8"
            style={{ background: `url(${background})` }}
            >
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
                Back
            </button>

            <div className="overflow-x-auto w-full max-w-3xl">
                <form
                onSubmit={handleSubmit(onsubmit)}
                className="p-8 rounded-lg shadow-2xl w-full space-y-6 border-2 border-gray-300"
                >
                <h2 className="text-2xl font-semibold text-center text-blue-600">Update Your Account</h2>

                {/* Grouped Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Username Field */}
                    <div className="flex flex-col">
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register('username')}
                    />
                    {errors.username && (
                        <p className="text-red-700 font-semibold text-sm mt-1">
                        {errors.username.message}
                        </p>
                    )}
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register('email')}
                    />
                    {errors.email && (
                        <p className="text-red-700 font-semibold text-sm mt-1">
                        {errors.email.message}
                        </p>
                    )}
                    </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Password */}
                    <div className="flex flex-col">
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register('password')}
                    />
                    {errors.password && (
                        <p className="text-red-700 font-semibold text-sm mt-1">
                        {errors.password.message}
                        </p>
                    )}
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register('confirmPassword')}
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-700 font-semibold text-sm mt-1">
                        {errors.confirmPassword.message}
                        </p>
                    )}
                    </div>
                </div>

                {/* Phone and File Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div className="flex flex-col">
                    <input
                        type="tel"
                        placeholder="Phone"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register('phone')}
                    />
                    {errors.phone && (
                        <p className="text-red-700 font-semibold text-sm mt-1">
                        {errors.phone.message}
                        </p>
                    )}
                    </div>

                    {/* File Upload */}
                    <div className="flex flex-col">
                    <input
                        type="file"
                        accept="image/jpeg, image/png"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        {...register('profile')}
                        onChange={handleFileChange}
                    />
                    </div>
                </div>

                {/* Submit Button */}
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

export default UpdateUser;
