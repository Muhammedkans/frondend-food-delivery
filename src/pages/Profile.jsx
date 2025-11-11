import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);

  // ✅ Fetch logged-in user info
  const loadProfile = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/me`
      );
      setUser(res.data.user);
      setProfileImagePreview(res.data.user.profileImage);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // ✅ Save Profile Changes
  const handleSave = async () => {
    try {
      let imageUrl = user.profileImage;

      // ✅ Upload profile image if changed
      if (profileImageFile) {
        const formData = new FormData();
        formData.append("image", profileImageFile);

        const uploadRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/upload-profile`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        imageUrl = uploadRes.data.url;
      }

      // ✅ Update user info
      await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/update`, {
        name: user.name,
        phone: user.phone,
        address: user.address,
        profileImage: imageUrl,
      });

      setEditMode(false);
      loadProfile();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Logout
  const logout = async () => {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`);
    window.location.href = "/login";
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05050a] flex justify-center items-center text-white">
        Loading profile…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#05050a] text-white flex justify-center items-center">
        Not logged in.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05050a] text-white p-6">
      <h1 className="text-3xl font-bold text-center text-neon-green mb-10">
        My Profile
      </h1>

      {/* ✅ Profile Card */}
      <div className="max-w-xl mx-auto bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-xl shadow-green-500/10">
        
        {/* ✅ Profile Image */}
        <div className="flex justify-center mb-6">
          <label className="cursor-pointer relative">
            <img
              src={
                profileImagePreview ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-neon-green shadow-lg"
            />
            {editMode && (
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setProfileImageFile(file);
                    setProfileImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
            )}
          </label>
        </div>

        {/* ✅ NAME */}
        <div className="mb-5">
          <p className="text-gray-400 text-sm mb-1">Name</p>
          <input
            disabled={!editMode}
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full bg-black/30 rounded-xl p-3 border border-white/10 focus:border-neon-green outline-none"
          />
        </div>

        {/* ✅ PHONE */}
        <div className="mb-5">
          <p className="text-gray-400 text-sm mb-1">Phone</p>
          <input
            disabled={!editMode}
            value={user.phone}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            className="w-full bg-black/30 rounded-xl p-3 border border-white/10 focus:border-neon-green outline-none"
          />
        </div>

        {/* ✅ ADDRESS */}
        <div className="mb-5">
          <p className="text-gray-400 text-sm mb-1">Address</p>
          <textarea
            disabled={!editMode}
            value={user.address}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            className="w-full bg-black/30 rounded-xl p-3 border border-white/10 focus:border-neon-green outline-none"
          ></textarea>
        </div>

        {/* ✅ BUTTONS */}
        <div className="flex justify-between mt-8">

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="px-6 py-3 bg-neon-green text-black font-semibold rounded-xl hover:bg-neon-green/80"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-neon-green text-black font-semibold rounded-xl hover:bg-neon-green/80"
            >
              Save
            </button>
          )}

          <button
            onClick={logout}
            className="px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}




