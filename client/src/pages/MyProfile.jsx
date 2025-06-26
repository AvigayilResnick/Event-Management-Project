import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyUser } from "../api/user";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMyUser();
        setUserData(data);
      } catch (err) {
        alert("Failed to load profile");
      }
    };
    fetchUser();
  }, []);

  if (!userData) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-6">
      <h2 className="text-2xl font-bold text-pink-600 mb-4">My Profile</h2>
      <p><strong>Name:</strong> {userData.full_name}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Phone:</strong> {userData.phone || "—"}</p>
      <button
        onClick={() => navigate("/edit-user")}
        className="mt-4 bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
      >
        Edit Profile
      </button>
    </div>
  );
};

export default MyProfile;
