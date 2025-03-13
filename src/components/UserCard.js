export default function UserCard({ user, onEdit, onDelete }) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg overflow-hidden p-3 text-center text-white relative transform transition duration-300 hover:scale-105 w-64 mb-1">
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
          {user.email && (
            <p className="flex justify-center items-center">
              <span className="mr-2">📧</span>
              <span>{user.email}</span>
            </p>
          )}
          {user.phone && (
            <p className="flex justify-center items-center">
              <span className="mr-2">📱</span>
              <span>{user.phone}</span>
            </p>
          )}
          {user.linkedinUrl && (
            <p className="flex justify-center items-center">
              <span className="mr-2">🔗</span>
              <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-200">
                LinkedIn
              </a>
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-between px-3 py-1 mt-1">
        <button 
          onClick={() => onEdit(user)} 
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded-lg transition duration-200 text-sm"
        >
          Update
        </button>
        <button 
          onClick={() => onDelete(user.id)} 
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg transition duration-200 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
