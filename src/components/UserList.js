'use client';

import { useState, useEffect } from 'react';
import UserCard from './UserCard';

export default function UserList({ newUser }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Add new user when prop changes
  useEffect(() => {
    if (newUser) {
      setUsers(prevUsers => [newUser, ...prevUsers]);
    }
  }, [newUser]);

  // Filter users when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Fetch users from API
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle user update
  const handleEdit = async (updatedUser) => {
    try {
      console.log("Updating User:", updatedUser); // ✅ Debugging
  
      const response = await fetch(`/api/users/${updatedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          linkedinUrl: updatedUser.linkedinUrl,
        }),
      });
  
      console.log("Response Status:", response.status); // ✅ Debugging
  
      const responseData = await response.json();
      console.log("Response Data:", responseData); // ✅ Debugging
  
      if (!response.ok) {
        console.error("Server Error:", responseData);
        throw new Error(responseData.error || "Failed to update user");
      }
  
      setUsers(users.map(user => user.id === updatedUser.id ? responseData : user));
      setFilteredUsers(filteredUsers.map(user => user.id === updatedUser.id ? responseData : user));
  
      window.location.reload(); // ✅ Force refresh
  
    } catch (error) {
      console.error("Error updating user:", error);
      alert(error.message);
    }
  };
  
  

  // Handle user deletion
  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter(user => user.id !== userId));
      setFilteredUsers(filteredUsers.filter(user => user.id !== userId));

    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
        <button 
          onClick={fetchUsers}
          className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {filteredUsers.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {users.length === 0 ? 'No users found. Add a new user to get started!' : 'No users match your search.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <UserCard key={user.id} user={user} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
