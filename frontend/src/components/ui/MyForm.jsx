import React from "react";

const MyForm = ({ ...props }) => {
  return (
    <form
      className="auth-form w-full flex flex-col gap-3 pt-2 "
      {...props}
    ></form>
  );
};

export default MyForm;
