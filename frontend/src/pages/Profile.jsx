import React, { useContext } from "react";
import axios from "../api/axios.config";
import { useNavigate } from "react-router-dom";
import { authContext } from "../context/AuthContext";
import MyButton from "./../components/ui/Button";

const Profile = () => {
  const [
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    setLoading,
  ] = useContext(authContext);
  const navigate = useNavigate();

  async function signOutHandler() {
    try {
      const response = await axios.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );
      setUser(null);
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <div className="profile-layout-container h-screen w-screen bg-linear-to-br from-purple-400/50 via-orange-300/20 to- to-60%  ">
      <div className="py-4 px-6">
        <div className="profile-header flex justify-between items-center w-full h-8 mb-5">
          <button
            className="back-btn text-2xl font-bold cursor-pointer"
            onClick={() => navigate(-1)}
          >
            &larr;
          </button>
          <p className="text-2xl font-normal">My Profile</p>
          <button
            className="setting-btn text-2xl font-bold cursor-pointer"
            onClick={() => alert("This functionality is not avalable yet")}
          >
            ⚙️
          </button>
        </div>

        <div>
          <div className="profile-container w-20 aspect-square bg-amber-100 rounded-full">
            
          </div>
          <div className="user-info mt-2">
            <h1 className="capitalize text-2xl font-semibold">{user.name}</h1>
            <h2 className="text-gray-500 text-xl">{user.email}</h2>
          </div>
        </div>

        <div className="profile-btn grid gap-0.5 w-full md:w-1/6 mt-10">
          <button
            className="update-profile-btn bg-black hover:bg-gray-800 hover:ease-in-out hover:delay-200 text-white text-2xl md:text-xl rounded-2xl p-0.5 md:p-1 my-1 cursor-pointer"
            onClick={() => alert("This functionality is not avalable yet")}
          >
            Update Profile
          </button>
          <button
            className="signout-btn bg-red-500 hover:bg-red-400 hover:ease-in-out hover:delay-200 text-black text-2xl md:text-xl rounded-2xl p-0.5 md:p-1 my-1 cursor-pointer"
            onClick={signOutHandler}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
