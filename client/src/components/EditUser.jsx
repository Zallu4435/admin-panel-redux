import background from '/Blue-Background-form.jpg';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { DevTool } from '@hookform/devtools';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { editUserSchema } from '../utils/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';


const EditUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.state?.userId,'location.state?.userId')
  const userId = location.state?.userId ; 
  
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null); 


  const token = localStorage.getItem('token');
  if(!token){
    return window.location.href = '/';
  }


  useEffect(() => {
 
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/user/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data); 
      } catch (err) {
        console.log(err);
        toast.error('Failed to fetch user data');
      }
    };

    fetchUser();
  }, [token, userId]);

  // Using react-hook-form with validation schema
  const { register, control, handleSubmit, setValue, formState: { errors }, } = useForm({
    resolver: zodResolver(editUserSchema),
  });

  // Set the values in the form once the user data is fetched
  useEffect(() => {
    if (user) {
      setValue('username', user.username); 
      setValue('email', user.email);
      setValue('phone', user.phone);
    }
  }, [user, setValue]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); 
  };

  const onSubmit = async (data) => {

    const { username, email, phone } = data;

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('phone', phone);
   
    if (file) {
      formData.append('profile', file); 
    }

    const token = localStorage.getItem('token');

    try {

      const response = await axios.put(
        `http://localhost:3001/api/user/profile/${userId}`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data', // Axios will set this for you when using FormData
          },
        }
      );
  
      if (response.status === 200) {

        toast.success('User updated successfully');
        navigate('/dashboard'); 
      }
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Failed to update user');
    }
  };

  if (!user) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="flex justify-center items-center min-h-screen py-8" style={{ background: `url(${background})` }}>
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)} // This will navigate to the previous page
        className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Back
      </button>

      <div className="overflow-x-auto w-full max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}
          className="p-8 rounded-lg shadow-2xl w-full space-y-6 border-2 border-gray-300"
        >
          <h2 className="text-2xl font-semibold text-center text-blue-600">Edit User Account</h2>

          {/* Name and Email on the same line */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('username')}
              />
              {errors.username && <p className='text-red-700 font-semibold text-sm'>{errors.username.message}</p>}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('email')}
              />
              {errors.email && <p className='text-red-700 font-semibold text-sm'>{errors.email.message}</p>}
            </div>
          </div>

          {/* Phone Number and Profile Picture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="tel"
                placeholder="Phone"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('phone')}
              />
              {errors.phone && <p className="text-red-700 font-semibold text-sm">{errors.phone.message}</p>}
            </div>
            {/* Profile Picture */}
            <div>
              <input
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleFileChange} // Handle file selection
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

export default EditUser;
