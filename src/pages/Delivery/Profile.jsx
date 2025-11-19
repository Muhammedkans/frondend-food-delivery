import React, { useEffect, useState } from "react";
import deliveryApi from "../../api/deliveryApi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    experience: 0,
    emergencyContact: "",
    profilePhoto: "",
    licenseImage: "",
    earnings: 0,
    isOnline: false,
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  // ---------------------------
  // FETCH PROFILE
  // ---------------------------
  const fetchProfile = async () => {
    try {
      const res = await deliveryApi.getProfile();
      const data = res.data?.deliveryPartner;
      if (!data) return toast.error("Profile data missing!");
      setProfile(data);
      setIsOnline(data.isOnline || false);
    } catch (error) {
      console.error("Fetch profile error:", error);
      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // TOGGLE ONLINE STATUS
  // ---------------------------
  const toggleOnline = async () => {
    try {
      const res = await deliveryApi.toggleOnlineStatus();
      const newStatus = res.data?.isOnline;
      setIsOnline(newStatus);
      setProfile((prev) => ({ ...prev, isOnline: newStatus }));
      toast.success(res.data?.message || "Status updated");
    } catch (err) {
      console.error(err);
      toast.error("Could not update status");
    }
  };

  // ---------------------------
  // INPUT HANDLERS
  // ---------------------------
  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfilePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhotoFile(e.target.files[0]);
    }
  };

  const handleLicenseChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseFile(e.target.files[0]);
    }
  };

  // ---------------------------
  // UPDATE PROFILE
  // ---------------------------
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const formData = new FormData();

      // Append text fields
      const fields = ["name", "email", "phone", "vehicle", "experience", "emergencyContact"];
      fields.forEach((key) => formData.append(key, profile[key] ?? ""));

      // Append files
      if (profilePhotoFile) formData.append("profilePhoto", profilePhotoFile);
      if (licenseFile) formData.append("licenseImage", licenseFile);

      const res = await deliveryApi.updateProfile(formData);

      if (res.data?.success) {
        toast.success("Profile updated successfully!");

        const updatedProfile = res.data.deliveryPartner;
        setProfile((prev) => ({
          ...prev,
          ...updatedProfile,
          profilePhoto: updatedProfile.profilePhoto || (profilePhotoFile ? URL.createObjectURL(profilePhotoFile) : prev.profilePhoto),
          licenseImage: updatedProfile.licenseImage || (licenseFile ? URL.createObjectURL(licenseFile) : prev.licenseImage),
        }));

        setProfilePhotoFile(null);
        setLicenseFile(null);
      } else {
        toast.error(res.data?.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <p className="text-neonGreen text-xl p-6">Loading profile...</p>;

  return (
    <div className="p-6 bg-linear-to-b from-[#0a0f1f] to-[#111827] min-h-screen text-gray-200">
      {/* HEADER */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative">
          <motion.img
            src={profilePhotoFile ? URL.createObjectURL(profilePhotoFile) : profile.profilePhoto || "/logo.png"}
            alt="avatar"
            className="w-32 h-32 rounded-full border-4 border-neonGreen object-cover shadow-neon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.span
            className={`absolute bottom-2 right-2 w-4 h-4 rounded-full ${isOnline ? "bg-green-400" : "bg-red-500"} border-2 border-black`}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>

        <motion.h1
          className="text-3xl font-extrabold mt-4 tracking-wide text-neonGreen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {profile.name}
        </motion.h1>
        <p className="text-gray-400 mb-4">Delivery Partner</p>

        <motion.button
          onClick={toggleOnline}
          className={`mt-2 px-6 py-2 rounded-xl font-bold transition shadow-lg ${isOnline ? "bg-neonGreen text-black" : "bg-neonBlue text-white"}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOnline ? "Go Offline" : "Go Online"}
        </motion.button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Earnings" value={`₹${profile.earnings}`} />
        <StatCard title="Experience" value={`${profile.experience} months`} />
      </div>

      {/* PROFILE FORM */}
      <form
        onSubmit={handleUpdate}
        className="bg-[#0f172a]/70 backdrop-blur-xl p-8 rounded-3xl border border-gray-700 shadow-xl max-w-2xl mx-auto"
      >
        <FileInput label="Change Profile Photo" name="profilePhoto" onChange={handleProfilePhotoChange} previewFile={profilePhotoFile || profile.profilePhoto} />
        <FileInput label="Upload License Image" name="licenseImage" onChange={handleLicenseChange} previewFile={licenseFile || profile.licenseImage} />

        <div className="flex flex-col gap-4 mt-4">
          <InputField label="Full Name" name="name" value={profile.name} onChange={handleInputChange} />
          <InputField label="Email" name="email" value={profile.email} onChange={handleInputChange} />
          <InputField label="Phone" name="phone" value={profile.phone} onChange={handleInputChange} />
          <InputField label="Vehicle" name="vehicle" value={profile.vehicle} onChange={handleInputChange} />
          <InputField label="Experience (months)" name="experience" value={profile.experience} onChange={handleInputChange} />
          <InputField label="Emergency Contact" name="emergencyContact" value={profile.emergencyContact} onChange={handleInputChange} />
        </div>

        <motion.button
          type="submit"
          disabled={updating}
          className="mt-8 w-full py-3 bg-neonGreen hover:bg-neonBlue rounded-xl text-black font-bold transition"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {updating ? "Updating..." : "Save Changes"}
        </motion.button>
      </form>
    </div>
  );
};

// ---------------------------
// COMPONENTS
// ---------------------------
const StatCard = ({ title, value }) => (
  <motion.div
    className="bg-[#111827] p-6 rounded-2xl border border-gray-700 shadow-xl text-center hover:scale-105 transition-transform"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <p className="text-gray-400 mb-1">{title}</p>
    <p className="text-neonGreen text-3xl font-extrabold tracking-wide">{value}</p>
  </motion.div>
);

const InputField = ({ label, ...props }) => (
  <div>
    <label className="text-gray-300 text-sm">{label}</label>
    <input
      {...props}
      className="w-full mt-1 p-3 rounded-xl bg-[#1e293b] text-gray-200 border border-gray-700 focus:outline-none focus:border-neonGreen transition"
    />
  </div>
);

const FileInput = ({ label, name, onChange, previewFile }) => {
  const inputId = `file-input-${name}`;
  const previewSrc = previewFile ? (typeof previewFile === "string" ? previewFile : URL.createObjectURL(previewFile)) : null;

  return (
    <div className="flex flex-col items-center mb-6">
      <label htmlFor={inputId} className="cursor-pointer text-neonGreen hover:text-neonBlue transition">
        {label}
      </label>

      {previewSrc && (
        <img
          src={previewSrc}
          alt="preview"
          className="w-24 h-24 rounded-full object-cover mb-2 border border-gray-700"
        />
      )}

      <input
        id={inputId}
        type="file"
        name={name}
        onChange={onChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default Profile;










