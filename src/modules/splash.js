import React, { Component } from "react";
import vegitable_bg from "../assets/images/backgrounds/vegitable_bg.png";
import click_logo from "../assets/images/click_logo_yellow.svg";
import { Navigate } from "react-router-dom";
class Splash extends Component {
  state = {
    redirect: false,
  };
  componentDidMount() {
    this.id = setTimeout(() => this.setState({ redirect: true }), 3000);
  }
  componentWillUnmount() {
    clearTimeout(this.id);
  }
  render() {
    return this.state.redirect ? (
      <Navigate replace to="/languageSelection" />
    ) : (
      <div>
        <div className="main_wrapper">
          <img src={vegitable_bg} alt="image" className="d-flex mx-auto" />
          <div>
            <img src={click_logo} alt="logo" className="d-flex mx-auto" />
          </div>
        </div>
      </div>
    );
  }
}

export default Splash;
