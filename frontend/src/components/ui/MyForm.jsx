import React from "react";

const MyForm = ({ ...props }) => {
  return (
    <form
      className="auth-form w-full grid place-content-center gap-2 md:gap-3 pt-2 "
      {...props}
    ></form>
  );
};

export default MyForm;
