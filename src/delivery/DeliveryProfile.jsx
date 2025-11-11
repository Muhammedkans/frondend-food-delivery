import { useEffect, useState } from "react";
import axios from "axios";
import { FiUser, FiCamera, FiPhone, FiTruck, FiWifiOff, FiWifi } from "react-icons/fi";

const DeliveryProfile = () => {
  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState("");
  const [online, setOnline] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    vehicleNumber: "",
  });

  // ✅ FETCH PROFILE
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/delivery/me`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setProfile(res.data.partner);
        setForm({
          name: res.data.partner.name,
          phone: res.data.partner.phone,
          vehicleNumber: res.data.partner.deliveryDetails?.vehicleNumber || "",
        });
        setOnline(res.data.partner.isOnline);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ UPDATE PROFILE
  const updateProfile = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/delivery/update`,
        form,
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("✅ Profile updated!");
        fetchProfile();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ UPLOAD PROFILE IMAGE
  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/delivery/upload-photo`,
        fd,
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("✅ Photo updated");
        fetchProfile();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ TOGGLE ONLINE / OFFLINE STATUS
  const toggleOnline = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/delivery/status`,
        { isOnline: !online },
        { withCredentials: true }
      );

      if (res.data.success) {
        setOnline(!online);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-6 py-10">
      <div className="max-w-xl mx-auto glass-card p-8 rounded-3xl">

        {/* ✅ HEADER */}
        <h1 className="text-3xl font-bold text-center mb-6 text-neonBlue">
          Delivery Partner Profile
        </h1>

        {/* ✅ PHOTO UPLOAD */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={
                preview ||
                profile.photo ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-neonGreen"
            />
            <label className="absolute bottom-0 right-1 bg-neonBlue text-black p-2 rounded-full cursor-pointer hover:scale-110 transition">
              <FiCamera />
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  setPreview(URL.createObjectURL(e.target.files[0]));
                  uploadImage(e.target.files[0]);
                }}
              />
            </label>
          </div>
        </div>

        {/* ✅ FORM */}
        <div className="space-y-5">
          {/* NAME */}
          <div>
            <label className="text-gray-400 text-sm">Full Name</label>
            <div className="input neon-border">
              <FiUser />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-white"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          {/* PHONE */}
          <div>
            <label className="text-gray-400 text-sm">Phone</label>
            <div className="input neon-border">
              <FiPhone />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-white"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          {/* VEHICLE NUMBER */}
          <div>
            <label className="text-gray-400 text-sm">Vehicle Number</label>
            <div className="input neon-border">
              <FiTruck />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-white"
                value={form.vehicleNumber}
                onChange={(e) =>
                  setForm({ ...form, vehicleNumber: e.target.value })
                }
              />
            </div>
          </div>

          {/* ✅ UPDATE BUTTON */}
          <button
            onClick={updateProfile}
            className="w-full bg-neonGreen text-black font-bold py-3 rounded-xl hover:opacity-80 transition mt-4"
          >
            Update Profile
          </button>
        </div>

        {/* ✅ ONLINE / OFFLINE SWITCH */}
        <div className="mt-8 text-center">
          <button
            onClick={toggleOnline}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto ${
              online
                ? "bg-neonPink text-black"
                : "bg-gray-700 text-white border border-neonPink"
            }`}
          >
            {online ? <FiWifi /> : <FiWifiOff />}
            {online ? "You are ONLINE" : "You are OFFLINE"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryProfile;
