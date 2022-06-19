import React from "react";

const InputField = ({ value, label, name, placeholder, type, onChange }) => (
  <div className="form_div">
    {label && (
      <label htmlFor="input-field" className="mb-3">
        {label}
      </label>
    )}
    <input
      type={type}
      value={value}
      name={name}
      className="form-control"
      placeholder={placeholder}
      onChange={onChange}
    />
  </div>
);

export default InputField;
