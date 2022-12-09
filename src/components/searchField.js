import React from "react";
import search_img from "../assets/images/search.svg";
const SearchField = ({ placeholder, val, onChange }) => (
  <div class="form-group has-search mb-0 bills_search">
    <span class="form-control-feedback">
      <img src={search_img} alt="search" />
    </span>
    <input
      className="form-control"
      id="searchbar"
      placeholder={placeholder}
      onChange={onChange}
      value={val}
    />
  </div>
);

export default SearchField;
