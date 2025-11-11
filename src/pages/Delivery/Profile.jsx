// src/pages/Delivery/Profile.jsx
import React, { useEffect, useState } from "react";
import DeliveryLayout from "../../layout/DeliveryLayout";
import deliveryApi from "../../api/deliveryApi";
import { toast } from "react-toastify";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await deliveryApi.getProfile();
      setProfile(res.data.delivery);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("phone", profile.phone);
      formData.append("vehicle", profile.vehicle);
      if (avatarFile) formData.append("avatar", avatarFile);

      await deliveryApi.updateProfile(formData);
      toast.success("Profile updated successfully!");
      fetchProfile(); // Refresh data
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading)
    return (
      <p className="text-neonGreen text-xl p-6">
        Loading profile...
      </p>
    );

  return (
    <DeliveryLayout>
      <div className="p-6 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold text-neonGreen mb-6">
          Delivery Profile
        </h1>

        <form
          onSubmit={handleUpdate}
          className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 max-w-md mx-auto"
        >
          <div className="flex flex-col items-center mb-6">
            <img
              src={avatarFile ? URL.createObjectURL(avatarFile) : profile.avatar || "/logo.png"}
              alt="avatar"
              className="w-24 h-24 rounded-full border-2 border-neonGreen object-cover"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mt-3 text-gray-300"
            />
          </div>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="p-3 rounded-xl bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none border border-gray-600"
              required
            />
            <input
              type="email"
              name="email"
              value={profile.email}
              placeholder="Email"
              disabled
              className="p-3 rounded-xl bg-gray-700 text-gray-200 cursor-not-allowed border border-gray-600"
            />
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              className="p-3 rounded-xl bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none border border-gray-600"
              required
            />
            <input
              type="text"
              name="vehicle"
              value={profile.vehicle}
              onChange={handleInputChange}
              placeholder="Vehicle Details"
              className="p-3 rounded-xl bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none border border-gray-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="mt-6 w-full py-3 bg-neonGreen hover:bg-neonBlue font-bold text-gray-900 rounded-xl transition"
          >
            {updating ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </DeliveryLayout>
  );
};

export default Profile;
