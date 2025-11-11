// src/pages/Restaurant/Profile.jsx
import React, { useEffect, useState } from "react";
import RestaurantLayout from "../../layout/RestaurantLayout";
import restaurantApi from "../../api/restaurantApi";
import { toast } from "react-toastify";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    banner: null,
    logo: null,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await restaurantApi.getProfile();
      setProfile(res.data.restaurant);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    if (type === "banner") setBannerFile(e.target.files[0]);
    else if (type === "logo") setLogoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("email", profile.email);
    formData.append("phone", profile.phone);
    formData.append("address", profile.address);
    if (bannerFile) formData.append("banner", bannerFile);
    if (logoFile) formData.append("logo", logoFile);

    try {
      const res = await restaurantApi.updateProfile(formData);
      setProfile(res.data.restaurant);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <p className="text-neonGreen text-xl p-6">Loading profile...</p>
    );

  return (
    <RestaurantLayout>
      <div className="p-6 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold text-neonGreen mb-6">
          Restaurant Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-2xl shadow-lg max-w-3xl mx-auto"
        >
          {/* Banner */}
          <div className="mb-4">
            <label className="block text-gray-300 font-semibold mb-2">
              Banner Image
            </label>
            {profile.banner && (
              <img
                src={profile.banner}
                alt="Banner"
                className="w-full h-40 object-cover rounded-xl mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "banner")}
              className="text-gray-200"
            />
          </div>

          {/* Logo */}
          <div className="mb-4">
            <label className="block text-gray-300 font-semibold mb-2">
              Logo
            </label>
            {profile.logo && (
              <img
                src={profile.logo}
                alt="Logo"
                className="w-24 h-24 object-cover rounded-full mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "logo")}
              className="text-gray-200"
            />
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-300 font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-700 text-gray-200 outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-300 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-700 text-gray-200 outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-gray-300 font-semibold mb-2">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-700 text-gray-200 outline-none"
              required
            />
          </div>

          {/* Address */}
          <div className="mb-6">
            <label className="block text-gray-300 font-semibold mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-700 text-gray-200 outline-none"
              rows={3}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full py-3 bg-neonGreen hover:bg-neonBlue rounded-xl font-bold text-gray-900 transition"
          >
            {updating ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </RestaurantLayout>
  );
};

export default Profile;
