import React from "react";
import Button from "../atoms/Button";

const Form = () => {
  return (
    <form>
      <input type="text" placeholder="Enter text" className="border p-2 mb-2" />
      <Button label="Submit" />
    </form>
  );
};

export default Form;
