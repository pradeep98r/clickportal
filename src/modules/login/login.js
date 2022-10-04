import React, { Component } from "react";
import Navigation from "../../components/Navigation";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import "../login/Login.scss";
import ca_avatar from "../../assets/images/login/ca_image.svg";
import writer_avatar from "../../assets/images/login/writer_image.png";
import { Link } from "react-router-dom";
class Login extends Component {
  render() {
    return (
      <div>
        <Navigation login_type="login_type_selection" />
        <div className="container login_container">
          <div className="row">
            <div className="col-lg-6 col-xs-12 green_border">
              <div className="ca_writer_card">
                <img
                  src={ca_avatar}
                  alt="commission_agent"
                  className="d-flex mx-auto"
                />
                <p className="para_margin text-center">
                  I'm a Mandi Business owner and manage all my partners
                  (farmers, traders, buyers, transporters) and transactions.
                </p>
                <Link to="/login_form">
                  <button
                    className="primary_btn buttons d-flex mx-auto"
                    onClick={(e) => localStorage.setItem("userType", "CA")}
                  >
                    I’m Commission Agent
                  </button>
                </Link>
                <h5>Don't have an account?</h5>
                <h6>Register Now</h6>
              </div>
            </div>
            <div className="col-lg-6 col-xs-12">
              <div className="ca_writer_card">
                <img
                  src={writer_avatar}
                  alt="writer"
                  className="d-flex mx-auto"
                />
                <p className="text-center para_margin">
                  I work for a CA and help to run day-to-day Mandi Business
                  operations and ensure all partners and transactions recorded
                  properly.
                </p>
                <Link to="/login_form">
                  <button
                    className="primary_btn buttons d-flex mx-auto"
                    onClick={(e) => localStorage.setItem("userType", "WRITER")}
                  >
                    I’m Writer
                  </button>
                </Link>
                <h5>Only you can login once your CA added you the system.</h5>
              </div>
            </div>
          </div>
          <Logo />
        </div>
      </div>
    );
  }
}
export default Login;
