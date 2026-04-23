import React from "react";

const MyInput = ({...props}) => {
  return (
    <input
      className="auth-input bg-white rounded-md px-2 py-2 text-2xl font-light outline-none focus:ring  placeholder:text-xl"
      {...props}
    />
  );
};

export default MyInput;
