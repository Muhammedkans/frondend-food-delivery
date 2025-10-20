import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h2 className="text-2xl text-gray-700 mb-6 font-medium">
          You need to log in to view your profile.
        </h2>
        <button
          onClick={() => navigate("/login")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 shadow-lg transition-all duration-300"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-96 text-center relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

        <img
          src={user.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
          alt="Profile"
          className="w-28 h-28 mx-auto rounded-full mb-4 border-4 border-indigo-500 shadow-lg"
        />
        <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
        <p className="text-gray-600 mt-1">{user.email}</p>
        <p className="mt-2 text-sm text-gray-500 capitalize">Role: {user.role}</p>

        <button
          onClick={() => navigate("/orders")}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 shadow-lg transition-all duration-300"
        >
          View My Orders
        </button>
      </div>
    </div>
  );
}

