'use client';

import { useState, useEffect } from 'react';
import UserCard from './UserCard';

export default function UserList({ newUser }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null); // For update/delete errors

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
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Clear action error after 5 seconds
  useEffect(() => {
    if (actionError) {
      const timer = setTimeout(() => {
        setActionError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [actionError]);

  // Fetch users from API
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch users');
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

  // Handle user update with improved error handling
  const handleEdit = async (updatedUser) => {
    setActionError(null); // Clear previous errors
    try {
      console.log("Sending update for user:", updatedUser);
      
      const response = await fetch(`/api/users/${updatedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        const errorMsg = responseData.error || responseData.details || "Failed to update user";
        console.error("Update error response:", responseData);
        throw new Error(errorMsg);
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === responseData.id ? responseData : user))
      );
      
      setFilteredUsers((prevFiltered) =>
        prevFiltered.map((user) => (user.id === responseData.id ? responseData : user))
      );
      
      console.log("User updated successfully:", responseData);
      
    } catch (error) {
      console.error("Error updating user:", error);
      setActionError(`Update failed: ${error.message}`);
    }
  };

  // Handle user deletion with improved error handling
  const handleDelete = async (userId) => {
    setActionError(null); // Clear previous errors
    try {
      console.log("Attempting to delete user ID:", userId);
      
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      
      const responseData = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        const errorMsg = responseData.error || responseData.details || "Failed to delete user";
        console.error("Delete error response:", responseData);
        throw new Error(errorMsg);
      }

      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setFilteredUsers(prevFiltered => prevFiltered.filter(user => user.id !== userId));
      
      console.log("User deleted successfully:", userId);
      
    } catch (error) {
      console.error("Error deleting user:", error);
      setActionError(`Delete failed: ${error.message}`);
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
      {actionError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <p>{actionError}</p>
          <button 
            onClick={() => setActionError(null)}
            className="text-red-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}
      
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