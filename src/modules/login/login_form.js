import React, { useState } from "react";
import Navigation from "../../components/navigation";
import Logo from "../../components/logo";
import InputField from "../../components/input_field";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../features/userSlice";
const LoginForm = ({ loginSubmit, otpSubmit, viewOtpForm }) => {
  const [inputValue, setInputValue] = useState({ name: "" });
  const { name } = inputValue;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const dispath = useDispatch();

  const navigate = useNavigate();
  const handleSUbmit = (e) =>{
    e.preventDefault();

    dispath(login({
      name:name,
      loggedIn:true
    }));

    navigate('/smartboard')
  }
  return (
    <div>
      <Navigation login_type="login_form" />
      <div className="container login_container">
        <div className="row d-flex justify-content-center">
          <div className="col-lg-6 wrapper p-0">
            {!viewOtpForm ? (
              <div className="form-wrapper">
                <form id="loginForm" onSubmit={(e) => handleSUbmit(e)}>
                  <InputField
                    type="text"
                    value={name}
                    label="Enter your mobile number"
                    name="name"
                    onChange={handleChange}
                  />
                  {/* <Link to="/smartboard"> */}
                  <button
                    className="primary_btn"
                    type="submit"
                    id="sign-in-button"
                  >
                    Login
                  </button>
                  {/* </Link> */}
                  <p className="para_margin">
                    By continuing, you agree to Ono’s
                    <br></br>
                    <a>Conditions of Use</a> and <a>Privacy Policy</a>.
                  </p>
                </form>
              </div>
            ) : (
              <div className="form-wrapper" onSubmit={otpSubmit}>
                <form id="otpForm">
                  <div className="form_div">
                    <label className="form-label mb-2">9876543210</label>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <label className="form-label mb-0">Enter OTP</label>
                      <a className="resend_otp">Resend OTP</a>
                    </div>
                    <input
                      type="number"
                      name="phone"
                      autoComplete="false"
                      className="form-control"
                      id="phone"
                    />
                  </div>
                  <button className="primary_btn" type="submit">
                    Continue
                  </button>
                  <p className="para_margin">
                    By continuing, you agree to Ono’s
                    <br></br>
                    <a>Conditions of Use</a> and <a>Privacy Policy</a>.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
        <Logo />
      </div>
    </div>
  );
};

export default LoginForm;
