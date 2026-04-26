import React from "react";

const MyInput = ({ ...props }) => {
  return (
    <input
      className="auth-input w-full bg-white/80 rounded-lg px-3 py-2 text-base md:text-lg font-light outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-sm md:placeholder:text-base"
      {...props}
    />
  );
};

export default MyInput;
