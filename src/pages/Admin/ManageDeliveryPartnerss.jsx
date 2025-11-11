// src/pages/Admin/ManageDeliveryPartners.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import adminApi from "../../api/adminApi";
import { FaMotorcycle } from "react-icons/fa";

const ManageDeliveryPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await adminApi.getAllDeliveryPartners(); // Make sure API exists in adminApi
        setPartners(res.data.partners);
      } catch (error) {
        console.error("Error fetching delivery partners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading)
    return <p className="text-neonGreen text-xl p-6">Loading delivery partners...</p>;

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold text-neonGreen mb-6">
          Manage Delivery Partners
        </h1>

        {partners.length === 0 ? (
          <p className="text-gray-300 text-center text-xl mt-10">
            No delivery partners registered yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <div
                key={partner._id}
                className="p-4 bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transform transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <FaMotorcycle className="text-neonBlue text-2xl" />
                  <h2 className="text-lg font-semibold text-neonBlue">
                    {partner.name}
                  </h2>
                </div>

                <p className="text-gray-300">Email: {partner.email}</p>
                <p className="text-gray-300">
                  Phone: {partner.phone || "N/A"}
                </p>
                <p className="text-gray-300">
                  Status:{" "}
                  <span
                    className={
                      partner.isActive ? "text-neonGreen" : "text-red-500"
                    }
                  >
                    {partner.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageDeliveryPartners;
