import React, { Component } from "react";
import bell from "../../assets/images/navbar/Bell.svg";
import help from "../../assets/images/navbar/Help.svg";
import "./top_navigation.scss";
function TopNavigation(props) {
  return (
    <nav className="navbar navbar-expand-lg bg_white main_nav">
      <div className="container-fluid">
        <div className="page_header">
          <h2>{props.heading}</h2>
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
              <div className="nav-link">
                <input
                  className="form-control date me-2"
                  type="date"
                  placeholder=""
                  aria-label="date"
                />
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
                Aparna
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
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
