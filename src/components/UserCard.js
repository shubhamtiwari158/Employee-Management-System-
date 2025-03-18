import { useState, useEffect } from "react";

export default function UserCard({ user, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  
  useEffect(() => {
    setFormData({ ...user }); // Sync latest changes
  }, [user]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(formData); // Call edit function
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    // Confirmation dialog
    if (window.confirm(`Are you sure you want to delete ${user.name || 'this user'}?`)) {
      onDelete(user.id);
    }
  };
  
  return (
    <div className="relative">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg overflow-hidden p-3 text-center text-white relative transform transition duration-300 hover:scale-105 w-full mb-1">
        <div className="flex justify-center">
          <img
            src={user.profileImage || "/default-avatar.png"}
            alt={user.name ? `${user.name}'s profile picture` : "User profile picture"}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            onError={(e) => (e.target.src = "/default-avatar.png")}
          />
        </div>
        <div className="p-2">
          <h3 className="font-bold text-lg mb-1">{user.name || "Unknown User"}</h3>
          <div className="space-y-1 text-xs">
            {user.email && <p>📧 {user.email}</p>}
            {user.phone && <p>📱 {user.phone}</p>}
            {user.linkedinUrl && (
              <p>
                🔗 <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-200">LinkedIn</a>
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-between px-3 py-1 mt-1">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded-lg transition duration-200 text-sm"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg transition duration-200 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
      
      {/* Update Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-3 text-gray-800">Edit User</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input 
                type="text" 
                name="name" 
                value={formData.name || ''} 
                onChange={handleChange} 
                placeholder="Name" 
                className="w-full p-2 border rounded text-gray-800" 
              />
              <input 
                type="email" 
                name="email" 
                value={formData.email || ''} 
                onChange={handleChange} 
                placeholder="Email" 
                className="w-full p-2 border rounded text-gray-800" 
              />
              <input 
                type="text" 
                name="phone" 
                value={formData.phone || ''} 
                onChange={handleChange} 
                placeholder="Phone" 
                className="w-full p-2 border rounded text-gray-800" 
              />
              <input 
                type="text" 
                name="linkedinUrl" 
                value={formData.linkedinUrl || ''} 
                onChange={handleChange} 
                placeholder="LinkedIn URL" 
                className="w-full p-2 border rounded text-gray-800" 
              />
              <div className="flex justify-between mt-4">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}