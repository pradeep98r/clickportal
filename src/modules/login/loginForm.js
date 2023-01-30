import { Component, useState } from "react";
import Navigation from "../../components/navigation";
import Logo from "../../components/logo";
import InputField from "../../components/inputField";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../reducers/userSlice";
import { doLogin, validateOTP } from "../../actions/loginService";
import { deviceType, osName, osVersion } from "react-device-detect";
import { authActions } from "../../reducers/authSlice";
import { userInfoActions } from "../../reducers/userInfoSlice";
import OtpTimer from "otp-timer";
import { ToastContainer, toast } from "react-toastify";
import $ from "jquery";
import close from "../../assets/images/close.svg";
import "react-toastify/dist/ReactToastify.css";
import Illustration from "../../assets/images/Illustration.svg";
const LoginForm = () => {
  const [lat, setLatValue] = useState("");
  const [lang, setLangValue] = useState("");
  const [mobileNumber, setmobileNumber] = useState("");
  const [otpId, setOtpId] = useState("");
  const [invalidNumber, setInvalidError] = useState(false);

  const handleChange = (e) => {
    let onlyNumbers = e.target.value.replace(/[^\d]/g, "");
    let number = onlyNumbers.slice(0, 10);
    setmobileNumber(number);
    setInvalidError(false);
    setotpErrorStatus(false);
  };
  navigator.geolocation.getCurrentPosition(function (position) {
    setLatValue(position.coords.latitude);
    setLangValue(position.coords.longitude);
  });
  const [otpValue, setOtpValue] = useState("");
  const [viewOtpForm, setViewOtpForm] = useState(false);
  const [otpError, setotpError] = useState("");
  const [otpErrorStatus, setotpErrorStatus] = useState(false);
  const handleOtpChange = (e) => {
    let onlyNumbers = e.target.value.replace(/[^\d]/g, "");
    let number = onlyNumbers.slice(0, 6);
    setOtpValue(number);
    setotpErrorStatus(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const obj = {
    deviceInfo: {
      deviceId: deviceType,
      model: deviceType,
      os: osName,
      version: osVersion,
    },
    langId: localStorage.getItem("langId"),
    locAllow: true,
    location: {
      latitude: lat != null ? lat : "",
      longitude: lang != null ? lang : "",
    },
    mobile: mobileNumber,
    newMobileNum: false,
    userType: localStorage.getItem("userType"),
  };
  const handleClick = () => {
    setotpErrorStatus(false);
    setOtpValue("");
    console.log(obj);
    doLogin(obj).then(
      (response) => {
        if (response.data.status.type === "SUCCESS") {
          setViewOtpForm(true);
          setOtpId(response.data.data.otpReqId);
        } else if (response.data.status === "FAILURE") {
        } 
      },
      (error) => {
        setInvalidError(true);
        toast.error(error.response.data.status.description, {
          toastId: "errorr1",
        });
      }
    );
  };
  const handleSUbmit = (e) => {
    e.preventDefault();
    dispatch(
      login({
        name: mobileNumber,
        loggedIn: true,
      })
    );
    doLogin(obj).then(
      (response) => {
        if (response.data.status.type === "SUCCESS") {
          setViewOtpForm(true);
          setOtpId(response.data.data.otpReqId);
          //setInvalidError(invalidNumber);
          toast.success(response.data.status.description, {
            toastId: "success1",
          });
        } else if (response.data.status === "FAILURE") {
        } else {
        }
      },
      (error) => {
        setInvalidError(true);
        toast.error(error.response.data.status.description, {
          toastId: "error2",
        });
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
      browser: true,
    };

    validateOTP(obj).then(
      (resp) => {
        if (resp.data.status.type === "SUCCESS") {
          // setotpError("heyyy");
          dispatch(authActions.login(true));
          dispatch(userInfoActions.loginSuccess(resp.data.data));
          localStorage.setItem("clientId", resp.data.data.authKeys.clientId);
          const clientId = localStorage.getItem("clientId");
          if (resp.data.data.authKeys.clientId == clientId) {
            localStorage.setItem(
              "loginResponse",
              JSON.stringify(resp.data.data)
            );
            localStorage.setItem("isauth", true);
            console.log("login success");
            if (resp.data.data.useStatus == "USER_REGISTRATION_PENDING") {
              console.log("registration");
              navigate("/registration");
            } else {
              navigate("/smartboard");
            }
            window.location.reload();
          } else {
            localStorage.setItem("isauth", false);
          }
          toast.success(resp.data.status.description, {
            toastId: "success2",
          });
        } else {
          setotpErrorStatus(true);
          setotpError("The entered OTP is incorrect");
        }
      },
      (error) => {
        setotpErrorStatus(true);
        setotpError("The entered OTP is incorrect");
      }
    );
  };
  const backToLogin = (event) => {
    event.preventDefault();
    setViewOtpForm(false);
    setotpErrorStatus(false);
    setOtpValue("");
  };

  const conditionsPopUp = () => {
    $("#termsAndConditions").modal("show");
  };
  const policyPopUp = () => {
    $("#privatePolicy").modal("show");
  };
  const closePopup = () => {
    $("#termsAndConditions").modal("hide");
  };

  const closePrivatePolicy = () => {
    $("#privatePolicy").modal("hide");
  };
  const onkeyDownevent = (e) => {
    if (e.key === "Enter") {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div className="loginform">
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
                      handleChange(e);
                    }}
                    className={invalidNumber ? "" : "border-danger"}
                  />
                  {invalidNumber && (
                    <p className="text-danger">
                      Given Mobile is not valid. Please try with valid mobile
                      Number
                    </p>
                  )}

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
                    <a onClick={conditionsPopUp}>Conditions of Use</a> and{" "}
                    <a onClick={policyPopUp}>Privacy Policy</a>.
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
                        <OtpTimer
                          minutes={0}
                          seconds={60}
                          text="Time:"
                          resend={() => handleClick}
                          ButtonText="Resend OTP"
                        />
                      </div>
                    </div>
                    <input
                      type="text"
                      name="phone"
                      autoComplete="false"
                      className="form-control"
                      style={{
                        color: otpErrorStatus == false ? "#495057" : "#FD0D1B",
                      }}
                      id="phone"
                      value={otpValue}
                      onChange={(event) => handleOtpChange(event)}
                      onKeyDown={(e) => onkeyDownevent(e)}
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
                    <a onClick={conditionsPopUp}>Conditions of Use</a> and{" "}
                    <a onClick={policyPopUp}>Privacy Policy</a>.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
        <Logo />
        <ToastContainer />
      </div>
      <div className="modal fade" id="termsAndConditions">
        <div className="modal-dialog terms_modal_popup">
          <div className="modal-content">
            <div className="modal-header date_modal_header smartboard_modal_header">
              <h5 className="modal-title header2_text" id="staticBackdropLabel">
                Terms And Conditions
              </h5>
              <img
                src={close}
                alt="image"
                className="close_icon"
                onClick={closePopup}
              />
            </div>
            <div className="modal-body">
              <div className="terms_popup ">
                <iframe
                  src="https://www.onoark.com/conditions-of-use"
                  width="100%"
                  height="480"
                ></iframe>
              </div>
            </div>
            <div className="modal-footer pt-0"></div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="privatePolicy">
        <div className="modal-dialog terms_modal_popup">
          <div className="modal-content">
            <div className="modal-header date_modal_header smartboard_modal_header">
              <h5 className="modal-title header2_text" id="staticBackdropLabel">
                Private Policy
              </h5>
              <img
                src={close}
                alt="image"
                className="close_icon"
                onClick={closePrivatePolicy}
              />
            </div>
            <div className="modal-body">
              <div className="terms_popup ">
                <iframe
                  src="https://www.onoark.com/privacy-policy"
                  width="100%"
                  height="480"
                ></iframe>
              </div>
            </div>
            <div className="modal-footer pt-0"></div>
          </div>
        </div>
      </div>
      <img src={Illustration} className="illustration" alt="imag" />
    </div>
  );
};

export default LoginForm;
