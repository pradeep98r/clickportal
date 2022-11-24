import { useState } from "react";
import InputField from "../../components/inputField";
import Navigation from "../../components/navigation";
import { createProfile } from "../../actions/loginService";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";
const Registration = () => {
  const [fullName, setFullNameField] = useState("");
  const [caValue, setCaValue] = useState("");
  const handleNameChange = (e) => {
    setFullNameField(e.target.value.replace(/[^A-Za-z0-9]/g, " "));
    setRequireNameField("");
  };
  const navigate = useNavigate();
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const obj = {
    address: {
      addressLine: "",
      city: "",
      dist: "",
      pincode: 0,
      state: "",
      type: "",
    },
    clickId: clickId,
    fullName: fullName,
    mobile: "",
    userType: caValue,
  };
  const [requireNameField, setRequireNameField]=useState("");
  const handleSUbmit = (e) => {
    e.preventDefault();
    if(fullName.trim().length !== 0){
      createProfile(obj).then(
        (response) => {
          if (response.data.status.type === "SUCCESS") {
            console.log(response.data.data, "reg");
            localStorage.setItem("registerData",response.data.data);
            console.log(localStorage.getItem("registerData"))
            toastr.success(response.data.status.description);
           navigate('/preferredCrops');
           window.location.reload();
          } else if (response.data.status === "FAILURE") {
          } else {
          }
        },
        (error) => {
          toastr.error(error.response.data.status.description);
        }
      );
    }  
    else if(fullName.trim().length == 0){
      setRequireNameField("Please enter CA name")
    }
  };
  function onChangeValue(event) {
    setCaValue(event.target.value);
    console.log(event.target.value)
  }
  return (
    <div>
      <Navigation login_type="registration" />
      <div className="container login_container">
        <div className="row d-flex justify-content-center">
          <div className="col-lg-6 wrapper p-0">
            <div className="form-wrapper">
              <form id="loginForm" onSubmit={(e) => handleSUbmit(e)}>
                <InputField
                  type="text"
                  value={fullName}
                  label="Full Name*"
                  name="name"
                  onChange={(e) => {
                    handleNameChange(e);
                  }}
                />
               <div>
               <span className="color_red">{requireNameField}</span>
               </div>
                <label>User Type*</label>
                <div className="mb-4">
                  <input
                    type="radio"
                    value="Commission Agent"
                    name="radioValue"
                    onChange={(e) => {
                      onChangeValue(e);
                    }}
                    defaultChecked="Commission Agent"
                    /> Commission Agent
                </div>
                <button
                  className="primary_btn"
                  type="submit"
                  id="sign-in-button"
                >
                  CONTINUE
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Registration;
