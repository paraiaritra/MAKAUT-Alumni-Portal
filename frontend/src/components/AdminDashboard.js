import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - Implement api.getUnverifiedUsers() in backend
    // fetchUsers();
    setUsers([
      { _id: '1', name: 'John Doe', email: 'john@makaut.edu', batch: '2023', department: 'CSE' },
      { _id: '2', name: 'Jane Smith', email: 'jane@makaut.edu', batch: '2022', department: 'IT' },
    ]);
    setLoading(false);
  }, []);

  const handleApprove = async (id) => {
    try {
      // await adminAPI.verifyUser(id);
      setUsers(users.filter(u => u._id !== id));
      alert('User Approved!');
    } catch (err) {
      alert('Failed to approve');
    }
  };

  if (loading) return <div>Loading Admin Panel...</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard - Pending Approvals</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch/Dept</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.batch} - {user.department}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleApprove(user._id)}
                    className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-center py-4 text-gray-500">No pending approvals.</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;