'use client';

import { useState } from 'react';
import UserForm from '@/components/UserForm';
import UserList from '@/components/UserList';

export default function Home() {
  const [newUser, setNewUser] = useState(null);

  const handleUserAdded = (user) => {
    setNewUser(user);
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-10 text-black">User Management System</h1>

      {/* Form at the top */}
      <div className="mb-8">
        <UserForm onUserAdded={handleUserAdded} />
      </div>

      {/* User List below */}
      <div>
        <h2 className="text-2xl mb-6 text-black">User List</h2>
        <UserList newUser={newUser} />
      </div>
    </main>
  );
}
