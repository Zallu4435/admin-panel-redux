import background from '/Blue-Background-form.jpg';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import userPic from '/profilePic.png'; 
import axios from 'axios';
import { useProfile } from '../redux/ProfileContext'

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { setUserId, userToken } = useProfile();

  
  useEffect(() => {
    const token = localStorage.getItem('UserToken');
    if (!token) {
      console.log("No token found, redirecting to login");
      navigate('/', { replace: true });
      return; 
    }
  
    const fetchUser = async () => {
      try {
        console.log("Fetching user with token:", token); 
        const response = await axios.get('http://localhost:3001/api/user/status', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setUserId(response.data.id)        
        setUser(response.data);

      } catch (err) {
        console.log(err); 
      }
    };
  
    fetchUser();
  }, [navigate, userToken]);  
  

  const handleLogout = () => {
    localStorage.removeItem('UserToken');
    navigate('/');
  };

  const handleUpdateProfile = () => {
    navigate('/updateUser'); 
  };

  return (
    user ? (
      <div
        className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
        style={{ background: `url(${background})` }}
      >
        {/* Logout Button */}
        <div className="absolute top-4 right-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Profile Card */}
        <div className="max-w-4xl w-full rounded-lg shadow-2xl border-2 border-gray-300 p-8 space-y-6 bg-transparent">
          <h2 className="text-3xl font-extrabold text-center text-blue-600">Your Profile</h2>

          {/* Profile Image */}
          <div className="flex justify-center">
            <img
              src={user.file ? `${import.meta.env.VITE_API_URL}/${user.file}` : userPic}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-indigo-500 object-cover"
            />
          </div>

          {/* User Info */}
          <div className="text-center space-y-4">
            <p className="text-xl font-medium text-gray-800">
              <strong className="text-blue-600">Username: </strong>{user.username}
            </p>
            <p className="text-xl font-medium text-gray-800">
              <strong className="text-blue-600">Email: </strong>{user.email}
            </p>
            <p className="text-xl font-medium text-gray-800">
              <strong className="text-blue-600">Phone: </strong>{user.phone}
            </p>
          </div>

          {/* Update Profile Button */}
          <div className="text-center">
            <button
              className="bg-indigo-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-600 transition duration-300"
              onClick={handleUpdateProfile}
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    ) : (
      <p>Loading...</p>
    )
  );
};

export default Profile;
