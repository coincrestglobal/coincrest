import React from "react";

const Button = ({ label }) => {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded">
      {label}
    </button>
  );
};

export default Button;
