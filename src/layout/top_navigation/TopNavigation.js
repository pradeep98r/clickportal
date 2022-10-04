import bell from "../../assets/images/navbar/Bell.svg";
import help from "../../assets/images/navbar/Help.svg";
import "./TopNavigation.scss";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../reducers/authSlice";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
function TopNavigation() {
  const linkValue = localStorage.getItem("LinkId");
  const linkPath = localStorage.getItem("LinkPath").toString();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginUserDetails = JSON.parse(localStorage.getItem("loginResponse"));
  const logOutFunction = () => {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
    localStorage.setItem("isauth", false);
    dispatch(authActions.logout(false));
    navigate("/login");
    window.location.reload();
    console.log(loginUserDetails, "before clear");
    localStorage.removeItem("loginResponse");
    localStorage.removeItem("userType");
    localStorage.removeItem("LinkPath");
    localStorage.setItem("LinkPath","/smartboard")
    console.log(loginUserDetails, "after clearing");
  };
  return (
    <nav className="navbar navbar-expand-lg bg_white main_nav">
      <div className="container-fluid">
        <div className="page_header">
          <h2>
            {linkPath == "/smartboard" && "Smartboard"}
            {linkValue == 2 && "Smartchart"}
            {linkValue == 3 && "Sell Bill Book"}
            {linkPath == "/buy_bill_book" && "Buy Bill Book"}
            {linkValue == 5 && "Buyer Ledger"}
            {linkValue == 6 && "Seller Ledger"}
            {linkPath == "/partner" && "Partners"}
            {linkValue == 8 && "My Profile"}
            {linkValue == 9 && "Reports"}
            {linkValue == 10 && "Transporto"}{" "}
          </h2>
          {linkValue == 11 && "Advances"}
          <p>Your performance summary this week</p>
        </div>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav flex_class">
            <li className="nav-item">
              <div className="nav-link active" aria-current="page" href="#">
                <form className="d-flex" role="search">
                  <input
                    className="form-control search"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                </form>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <img src={help} alt="icon" />
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link bell_icon" href="#">
                <img src={bell} alt="icon" />
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {loginUserDetails.profile.profile.fullName}
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <p>Click Id:{loginUserDetails.profile.profile.clickId}</p>
                </li>
                <li>
                  <p>{loginUserDetails.profile.profile.mobile}</p>
                </li>
                <li className="pb-0">
                  <a className="dropdown-item p-0" href="#">
                    <button onClick={logOutFunction} className="primary_btn ">
                      Logout
                    </button>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default TopNavigation;
