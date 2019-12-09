import React from "react";
import "./InputCheckbox.scss";

const InputCheckbox = ({ onChange, checked, label }) => {
  return (
    <div className="checkbox-wrapper">
      <label>
        <input type="checkbox" onChange={onChange} checked={checked} />
        {label}
      </label>
    </div>
  );
};

export default InputCheckbox;
