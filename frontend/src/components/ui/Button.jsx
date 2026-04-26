import React from "react";

const MyButton = ({ ...props }) => {
  return (
    <button
      className="auth-primary-btn w-full bg-black hover:bg-gray-800 transition-all duration-200 text-white text-md md:text-lg font-medium rounded-lg py-2.5 mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    ></button>
  );
};

export default MyButton;
