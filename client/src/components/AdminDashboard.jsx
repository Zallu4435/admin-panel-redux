import { useEffect, useState } from 'react';
import background from '/Blue-Background-form.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/user/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const filterUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (userId) => {
    navigate(`/editUser`, {state: { userId }});
  };

  const handleDelete = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3001/api/user/delete/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== userId)); // Update the state to remove the deleted user
      toast('User deleted successfully!');
    } catch (err) {
      console.error('Error deleting user:', err);
      toast('Error deleting user');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8" style={{ background: `url(${background})` }}>
      <div className="w-full max-w-6xl shadow-2xl border-2 border-gray-300 rounded-lg p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 flex-nowrap">
          <h1 className="text-2xl font-bold text-blue-600 w-full md:w-auto mb-4 md:mb-0">Admin Dashboard</h1>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-auto"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Search and Create User Section */}
        <div className="mb-4 flex justify-between items-center space-x-2 w-full flex-nowrap">
          {/* Search Box */}
          <input
            type="text"
            placeholder="Search by username or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
          />
          {/* Create User Button */}
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 w-1/3 sm:w-1/3 md:w-1/4 lg:w-1/5 text-nowrap"
            onClick={() => navigate('/createUser')}
          >
            Create User
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Username</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterUsers.length > 0 ? (
                filterUsers.map((user, index) => (
                  <tr key={user._id} className="text-center hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 mr-2"
                        onClick={() => handleEdit(user._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
