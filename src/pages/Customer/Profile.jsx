import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import customerApi from "../../api/customerApi";

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
        <p className="text-xl text-neonGreen animate-pulse">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 relative overflow-hidden">
      {/* ✨ Neon Glowing Background */}
      <div className="absolute inset-0 bg-linear-to-r from-[#00ff9d1a] via-[#00c8ff1a] to-[#00ff9d1a] blur-3xl animate-pulse"></div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold neon-text mb-8 animate-pulse z-10"
      >
        Your Profile
      </motion.h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-900/90 backdrop-blur-xl p-6 rounded-3xl shadow-neon-green border border-gray-700 space-y-5 z-10"
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
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full py-3 bg-neonGreen text-black font-bold rounded-xl shadow-neon hover:scale-105 transition-all duration-300"
        >
          Update Profile
        </motion.button>
      </motion.form>
    </div>
  );
};

export default Profile;


