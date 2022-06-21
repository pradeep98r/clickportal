import { Component } from "react";
import Navigation from "../../components/navigation";
import Logo from "../../components/logo";
import InputField from "../../components/input_field";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../features/userSlice";
import { doLogin, validateOTP } from "../../services/loginService";
import { deviceType, osName, OsTypes, osVersion } from 'react-device-detect';


class LoginForm extends Component {

  state = {
    viewOtpForm: false,
    number: "",
    toDashboard: false,
    otpReqId: '',
    otp: '',
    latitude: '',
    longitude: '',
    otpError: ''
  }
  constructor() {
    super();
  }
  handleChange = (event) => {
    const value = event.target.value;
    this.setState({
      number: value
    })
    // this.state.number = value
    // this.setInputValue((prev) => ({
    //   ...prev,
    //   [name]: value,
    // }));
  };


  handleSubmit(e) {
    e.preventDefault();
    // useDispatch(login({
    //   name: this.name,
    //   loggedIn: true
    // }));
    const obj = {
      "deviceInfo": {
        "deviceId": deviceType,
        "model": deviceType,
        "os": osName,
        "version": osVersion
      },
      "langId": 1,
      "locAllow": true,
      "location": {
        "latitude": "18.365",
        "longitude": "19.654"
      },
      "mobile": this.state.number,
      "newMobileNum": true,
      "userType": "1"
    }
    doLogin(obj).then((response) => {
      if (response.data.status.type === "SUCCESS") {
        this.viewOtpForm = true;
        this.setState(() => ({ viewOtpForm: true, otpReqId: response.data.data.otpReqId, otp:'',otpError:'' }))
      }
    });
  }

  submitOTP(event) {
    event.preventDefault();
    let obj = {
      "mobile": this.state.number,
      "otp": this.state.otp,
      "otpReqId": this.state.otpReqId,
      "userType": "1"
    }
    validateOTP(obj).then((resp) => {
      if (resp.data.status.type === "SUCCESS") {
        this.setState({ toDashboard: true, otpError : '' })
      }
      else {
        this.setState({otpError : 'The entered otp is incorrect'})
      }
    }, (error)=>{
      this.setState({otpError : 'The entered otp is incorrect'})
    })
  }

  backToLogin(event) {
    event.preventDefault();
    this.state.viewOtpForm = false;
    this.setState(() => ({ viewOtpForm: false }));
  }



  render() {
    if (this.state.toDashboard) {
      return <Navigate to='/smartboard' />
    }
    return (
      <div>
        <Navigation login_type="login_form" />
        <div className="container login_container">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-6 wrapper p-0">
              {!this.state.viewOtpForm ? (
                <div className="form-wrapper">
                  <form id="loginForm">
                    <InputField
                      type="text"
                      value={this.state.number}
                      label="Enter your mobile number"
                      name="name"
                      onChange={event => this.handleChange(event)}
                    />
                    {/* <Link to="/smartboard"> */}
                    <button
                      className="primary_btn"
                      type="submit"
                      id="sign-in-button"
                      onClick={event => this.handleSubmit(event)}
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
                <div className="form-wrapper" >
                  <form id="otpForm">
                    <div className="form_div">
                      <label className="form-label mb-2">{this.state.number}</label>
                      <span className="edit-icon" onClick={event => this.backToLogin(event)}></span>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <label className="form-label mb-0">Enter OTP</label>
                        <a className="resend_otp" onClick={event => this.handleSubmit(event)}>Resend OTP</a>
                      </div>
                      <input
                        type="number"
                        name="phone"
                        autoComplete="false"
                        className="form-control"
                        id="phone"
                        value={this.state.otp}
                        onChange={event => this.setState(() => ({ otp: event.target.value, otpError: '' }))}
                      />
                      <span className="text-danger">{this.state.otpError}</span>
                    </div>
                    <button className="primary_btn" type="submit" onClick={event => this.submitOTP(event)}>
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
  }
}

export default LoginForm;
