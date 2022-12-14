import React from "react";

const InputField = ({ value, label, name, placeholder, type, onChange,starRequired }) => (
  <div className="form_div">
    {label && (
      <label htmlFor="input-field" className="input_field">
        {label}
     
        {(!starRequired) ? '': <span className="star-color">*</span>}
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
