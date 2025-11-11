// src/pages/Customer/Profile.jsx
import React, { useEffect, useState } from "react";
import customerApi from "../../api/customerApi";
import { toast } from "react-hot-toast";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await customerApi.getProfile();
        setProfile(res.data.customer);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await customerApi.updateProfile(profile);
      toast.success("Profile updated successfully");
      setProfile(res.data.customer);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold neon-text mb-8">Your Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-900 p-6 rounded-2xl shadow-lg space-y-4"
      >
        <div>
          <label className="block text-gray-300 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none border border-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            disabled
            className="w-full p-3 rounded-lg bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none border border-gray-700"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Address</label>
          <textarea
            name="address"
            value={profile.address}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none border border-gray-700"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-green-500 hover:bg-green-600 rounded-lg font-bold neon-shadow"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
