import React from "react";

const MyButton = ({ ...props }) => {
  return (
    <button
      className="auth-primary-btn bg-black hover:bg-gray-800 hover:ease-in-out hover:delay-200 text-white text-2xl rounded-2xl p-0.5 md:p-1 my-1 cursor-pointer"
      {...props}
    ></button>
  );
};

export default MyButton;
