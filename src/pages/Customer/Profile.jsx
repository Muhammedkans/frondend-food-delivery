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
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
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
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <p className="text-xl text-green-400 animate-pulse">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      {/* Neon Heading */}
      <h1 className="text-5xl font-extrabold neon-text mb-8 animate-pulse">
        Your Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-900/90 backdrop-blur-xl p-6 rounded-3xl shadow-neon-green space-y-5 border border-gray-700"
      >
        {/* Name */}
        <div>
          <label className="block text-gray-300 mb-1 font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-neonGreen border border-gray-700 transition-all"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-300 mb-1 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            disabled
            className="w-full p-3 rounded-xl bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-300 mb-1 font-semibold">Phone</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-neonGreen border border-gray-700 transition-all"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-300 mb-1 font-semibold">Address</label>
          <textarea
            name="address"
            value={profile.address}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-neonGreen border border-gray-700 transition-all resize-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-neonGreen text-black font-bold rounded-xl shadow-neon hover:scale-105 transition-all duration-300"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;

