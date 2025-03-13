'use client';

import { useState } from 'react';

export default function UserForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedinUrl: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!profileImage) {
      setError('Please select a profile image.');
      return;
    }

    try {
      setIsSubmitting(true);

      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('linkedinUrl', formData.linkedinUrl);
      submitData.append('profileImage', profileImage);

      const response = await fetch('/api/users', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create user');
      }

      setFormData({ name: '', email: '', phone: '', linkedinUrl: '' });
      setProfileImage(null);
      setPreviewUrl('');
      setSuccess('User created successfully!');

      window.location.reload(); 

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white shadow-md rounded-lg" encType="multipart/form-data">
      <h2 className="text-xl font-bold text-center text-gray-700">Add New User</h2>

      {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
      {success && <div className="p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-full sm:w-1/4">
          <label className="block mb-1 font-medium text-black">Profile Image</label>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center relative cursor-pointer"
            style={{ height: '200px' }}
            onClick={() => document.getElementById('fileUpload').click()}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-full mx-auto object-contain" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-500 text-black">Upload image</p>
                <p className="text-xs text-gray-400 mt-1">Click to browse</p>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="fileUpload"
          />
          <label htmlFor="fileUpload" className="block text-center text-blue-600 cursor-pointer mt-2">
            Choose a file
          </label>
        </div>

        <div className="w-full sm:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-black">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-black">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-black">Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-black">LinkedIn URL</label>
              <input
                type="url"
                name="linkedinUrl"
                placeholder="Enter URL"
                value={formData.linkedinUrl}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="text-right mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
