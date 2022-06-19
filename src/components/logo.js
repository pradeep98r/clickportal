import React, { Component } from "react";
import click_logo from "../assets/images/click_logo_green.svg";
class Logo extends Component {
  render() {
    return (
      <div className="d-flex mx-auto justify-content-center logo_top">
        <img src={click_logo} alt="logo" />
      </div>
    );
  }
}
export default Logo;
