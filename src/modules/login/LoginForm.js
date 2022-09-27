import { Component, useState } from "react";
import Navigation from "../../components/Navigation";
import Logo from "../../components/Logo";
import InputField from "../../components/InputField";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../reducers/UserSlice";
import { doLogin, validateOTP } from "../../actions/loginService";
import { deviceType, osName, OsTypes, osVersion } from "react-device-detect";
import toastr from "toastr";
import { authActions } from '../../reducers/authSlice';
import OtpTimer from 'otp-timer'

const LoginForm = () => {
  const [mobileNumber, setmobileNumber] = useState("");
  const [otpId, setOtpId] = useState("");
  const handleChange = (e) => {
    let onlyNumbers = e.target.value.replace(/[^\d]/g, '');
    let number = onlyNumbers.slice(0, 10);
    setmobileNumber(number);
  };
  const [otpValue, setOtpValue] = useState("");
  const [viewOtpForm, setViewOtpForm] = useState(false);
  const [otpError, setotpError] = useState("");
  const [toDashboard, setoDashboard] = useState(false);
  const handleOtpChange = (e) => {
    let onlyNumbers = e.target.value.replace(/[^\d]/g, '');
    let number = onlyNumbers.slice(0, 6);
    setOtpValue(number);
  };
  const handleClick=()=>{
    //desired function to be performed on clicking resend button
  }
  const dispatch = useDispatch();
  const handleSUbmit = (e) => {
    e.preventDefault();
    dispatch(
      login({
        name: mobileNumber,
        loggedIn: true,
      })
    );
    const obj = {
      deviceInfo: {
        deviceId: deviceType,
        model: deviceType,
        os: osName,
        version: osVersion,
      },
      langId: 1,
      locAllow: true,
      location: {
        latitude: "19.234",
        longitude: "34.233",
      },
      mobile: mobileNumber,
      newMobileNum: true,
      userType: localStorage.getItem("userType"),
    };
    doLogin(obj).then(
      (response) => {
        if (response.data.status.type === "SUCCESS") {
          setViewOtpForm(true);

          setOtpId(response.data.data.otpReqId);
        } else if (response.data.status === "FAILURE") {
        } else {
        }
      },
      (error) => {
        toastr.error(error.response.data.status.description);
      }
    );
  };
  const submitOTP = (event) => {
    event.preventDefault();
    let obj = {
      mobile: mobileNumber,
      otp: otpValue,
      otpReqId: otpId,
      userType: localStorage.getItem("userType"),
    };
    validateOTP(obj).then(
      (resp) => {
        if (resp.data.status.type === "SUCCESS") {
          setotpError("");
          setoDashboard(true);
          // this.setState({ toDashboard: true, otpError: "" });
          localStorage.setItem("loginResponse", JSON.stringify(resp.data.data))
          dispatch(authActions.login());;
        } else {
          setotpError("The entered otp is incorrect");
        }
      },
      (error) => {
        setotpError("The entered otp is incorrect");
      }
    );
  };

  const backToLogin = (event) => {
    event.preventDefault();
    setViewOtpForm(false);
  };
  if (toDashboard) {
    return <Navigate to="/smartboard" />;
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
                    value={mobileNumber}
                    label="Enter your mobile number"
                    name="name"
                    onChange={(e) => {
                      handleChange(e)
                    }}
                  />
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
              <div className="form-wrapper">
                <form id="otpForm">
                  <div className="form_div">
                    <label className="form-label mb-2">{mobileNumber}</label>
                    <span
                      className="edit-icon"
                      onClick={(event) => backToLogin(event)}
                    ></span>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <label className="form-label mb-0">Enter OTP</label>
                     <div className="timer">
                     <OtpTimer seconds= {30} minutes={0} resend={handleClick} />
                     </div>
                      {/* <a
                      className="resend_otp"
                      onClick={(event) => handleSubmit(event)}
                    >
                      Resend OTP
                    </a> */}
                    </div>
                    <input
                      type="text"
                      name="phone"
                      autoComplete="false"
                      className="form-control"
                      id="phone"
                      value={otpValue}
                      onChange={(event) => handleOtpChange(event)}
                    />
                    <span className="text-danger">{otpError}</span>
                  </div>
                  <button
                    className="primary_btn"
                    type="submit"
                    onClick={(event) => submitOTP(event)}
                  >
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
