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
import { ToastContainer, toast } from "react-toastify";
import $ from "jquery";
import close from "../../assets/images/close.svg";
import "react-toastify/dist/ReactToastify.css";
import Illustration from "../../assets/images/Illustration.svg";
import NoInternetConnection from "../../components/noInternetConnection";
import Timer from "./timer";
const LoginForm = () => {
  const [lat, setLatValue] = useState("");
  const [lang, setLangValue] = useState("");
  const [mobileNumber, setmobileNumber] = useState("");
  const [otpId, setOtpId] = useState("");
  const [invalidNumber, setInvalidError] = useState(false);
  const [resendValid, setResendValid] = useState(false);
  const [isOnline, setOnline] = useState(false);

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

  const [min, setMin] = useState();
  const [sec, setSec] = useState();
  const [otpValue, setOtpValue] = useState("");
  const [viewOtpForm, setViewOtpForm] = useState(false);
  const [otpError, setotpError] = useState("");
  const [otpErrorStatus, setotpErrorStatus] = useState(false);
  const [handleResend, setHandleResend] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
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
    browser: true,
  };
  const [mobileNumErrorMessage, setMobileNumErrorMessage] = useState(false);
  const handleClick = () => {
    handleResendTime();
    setResendValid(false);
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
          if(error.message.toUpperCase() == 'NETWORK ERROR'){
            setOnline(true);
          }
          setOnline(true);
          setInvalidError(true);
         
          toast.error(error.response.data.status.description, {
            toastId: "errorr1",
          });
          
        }
      );
    
  };
  const [isWriter, setIsWriter] = useState(false);
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
          console.log(response.data.data)
          if(response.data.data.writer){
            setIsWriter(true)
          }
          else{
            setIsWriter(false) 
          }
          toast.success(response.data.status.description, {
            toastId: "success1",
          });
        } else if (response.data.status === "FAILURE") {
        } else {
        }
      },
      (error) => {
        setInvalidError(true);
        setMobileNumErrorMessage(error.response.data.status.description)
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
      userType: isWriter ? 'WRITER' : localStorage.getItem("userType"),
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
          const uType = localStorage.getItem("userType");
          const wType = isWriter ? 'WRITER' : 'CA';
          console.log(isWriter,wType)
          if(wType == uType){
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
        }
        else{
          toast.error('You have not registered as commission agent please try again', {
            toastId: "error3",
          });
        }
        } else {
          setotpErrorStatus(true);
          setotpError("The entered OTP is incorrect");
        }
      },
      (error) => {
        setotpErrorStatus(true);
        setotpError("The entered OTP is incorrect");
        // if(error.message.toUpperCase() == 'NETWORK ERROR'){
        //   setOnline(true);
        // }
        // setOnline(true);
      }
    );
  };
  const backToLogin = (event) => {
    event.preventDefault();
    setViewOtpForm(false);
    setotpErrorStatus(false);
    setOtpValue("");
    setEditStatus(true)
    setHandleResend(false);
    setResendValid(false);

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

  let timerOn = true;
  function handleTimeInterval (remaining){
      var m = Math.floor(remaining / 60);
      var s = remaining % 60;
      
      m = m < 10 ? '0' + m : m;
      s = s < 10 ? '0' + s : s;
      setMin(m);
      setSec(s)
     
      remaining -= 1;
      
      if(remaining >= 0 && timerOn) {
        setTimeout(function() {
          handleTimeInterval(remaining);
        }, 1000);
        return;
      }
      if(s !==0){
        setResendValid(false);
        setHandleResend(false);
        // setEditStatus(false);
      }
      if(s == 0){
          setResendValid(true);
          return;
      }
    
      if(!timerOn) {
        // Do validate stuff here
        return;
      }
  }


  const handleResendTime =() =>{
    setHandleResend(true);
    // setResendValid(true);
    handleTimeInterval(59);
    setotpError('')
  }

  const handleResends =()=>{
      setResendValid(true);    
  }
 
  return (
    <div className="loginform">

      <Navigation login_type="login_form" />
      {isOnline?<NoInternetConnection />:
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
                      {mobileNumErrorMessage}
                    </p>
                  )}

                  <button
                    className="primary_btn"
                    type="submit"
                    id="sign-in-button"
                    onClick={handleSUbmit}
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
                      {!handleResend && !resendValid?
                      <Timer resend={handleResends}
                      />:''}
                      {resendValid ?
                      <p onClick={handleClick} className="resend_text">Resend</p>:''}
                      {handleResend?<p>Time left:<span id="timer">{min}:{sec}</span></p>:''}
                      
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
      }
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
