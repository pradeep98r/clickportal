import React from "react";
import search_img from "../assets/images/search.svg";
const BillsSearchField = ({ placeholder, onChange }) => (
  <div className="form-group has-search mb-0 mr-3">
    <span className="form-control-feedback">
      <img src={search_img} alt="search" />
    </span>
    <input
      className="form-control mb-0"
      id="searchbar"
      placeholder={placeholder}
      onChange={onChange}
    />
  </div>
);

export default BillsSearchField;
