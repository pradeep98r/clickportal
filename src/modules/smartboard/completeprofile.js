import { Modal } from "react-bootstrap";
import "../smartboard/smartboard.scss";
import "../smartboard/completeprofile.scss";
import close from "../../assets/images/close.svg";
import single_bill from "../../assets/images/bills/single_bill.svg";
import InputField from "../../components/inputField";
import { useState } from "react";
import toastr from "toastr";
import { completeMandiSetup } from "../../actions/loginService";

const CompleteProfile = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  // mandi name
  const [mandiNameField, setMandiNameField] = useState("");
  const [mandiNameError, setMandiNameError] = useState("");
  const handleMandiName = (e) => {
    setMandiNameField(e.target.value);
    commonValidation(e, "mandiname");
  };
  //   mandi type
  const [mandiTypeField, setMandiTypeField] = useState("");
  const [mandiTypeError, setMandiTypeError] = useState("");
  const handleMandiType = (e) => {
    setMandiTypeField(e.target.value);
    commonValidation(e, "manditype");
  };
  //   mandi short code
  const [mandiShortCode, setMandiShortCode] = useState("");
  const [mandiShortCodeError, setMandiShortCodeError] = useState("");
  const handleMandiShortCode = (e) => {
    setMandiShortCode(e.target.value.replace(/[^A-Za-z0-9]/g, " "));
    shortCodeValidation(e);
  };
  const shortCodeValidation = (e) => {
    if (e.target.value.length >= 4) {
      setMandiShortCodeError(
        "Mandi short code can not be more than 4 characters"
      );
    } else {
      setMandiShortCodeError("");
    }
  };
  //   shop number
  const [shopNumberField, setShopNumberField] = useState("");
  const [shopNumberError, setShopNumberError] = useState("");
  const handleShopNumber = (e) => {
    setShopNumberField(e.target.value);
    shopNumberValidation(e);
  };
  const shopNumberValidation = (e) => {
    if (e.target.value.length < 1) {
      setShopNumberError("Shop number must be atleast one design");
    } else if (e.target.value.length >= 7) {
      setShopNumberError("Shop number can't be more than 7 digits");
    } else {
      setShopNumberError("");
    }
  };
  //   contact name
  const [contactName, setContactName] = useState("");
  const [contactNameError, setContactNameError] = useState("");
  const handleContactName = (e) => {
    setContactName(e.target.value.replace(/[^A-Za-z0-9]/g, " "));
    commonValidation(e, "contactname");
  };
  //   mobile number
  const [mobileNumber, setmobileNumber] = useState("");
  const [requiredNumberField, setRequiredNumberField] = useState("");
  const handleMobileNumber = (e) => {
    mobileNumberValidation(e, "mobile");
  };
  const [alternateMobileNumber, setAlternateMobileNumber] = useState("");
  const [alternateMobileNumberError, setAlternateMobileNumberError] =
    useState("");
  const handleAlternateMobileNumber = (e) => {
    mobileNumberValidation(e, "alternateMobile");
  };

  //   common mobilenumber validation
  const mobileNumberValidation = (e, type) => {
    var string1 = "Minimum mobile number length should be 10";
    let onlyNumbers = e.target.value.replace(/[^\d]/g, "");
    if (e.target.value.length < 10) {
      if (type == "mobile") {
        setRequiredNumberField(string1);
      } else {
        setAlternateMobileNumberError(string1);
      }
    } else {
      if (type == "mobile") {
        setRequiredNumberField("");
      } else {
        setAlternateMobileNumberError("");
      }
    }
    let number = onlyNumbers.slice(0, 10);
    if (type == "mobile") setmobileNumber(number);
    else setAlternateMobileNumber(number);
  };
  //  common validatioon
  const commonValidation = (e, type) => {
    var string1 = "Name should be min 2 characters";
    var string2 = "Name should be max 30 characters";
    if (e.target.value.length < 2) {
      if (type == "mandiname") {
        setMandiNameError(string1);
      } else if (type == "manditype") {
        setMandiTypeError(string1);
      } else {
        setContactNameError(string1);
      }
    } else if (e.target.value.length > 30) {
      if (type == "mandiname") {
        setMandiNameError(string2);
      } else if (type == "manditype") {
        setMandiTypeError(string2);
      } else {
        setContactNameError(string2);
      }
    } else {
      if (type == "mandiname") {
        setMandiNameError("");
      } else if (type == "manditype") {
        setMandiTypeError("");
      } else {
        setContactNameError("");
      }
    }
  };
  const onSubmit = () => {
    if (
        mandiNameField.trim().length !== 0 
    //   mobileNumber.trim().length !== 0 &&
    //   shortNameField.trim().length !== 0
    ) {
      addEditMandiSetupApiCall();
    } else if (mandiNameField.trim().length === 0) {
        mandiNameError("Please Enter Name");
      // alert("hii")
    } 
    // else if (mobileNumber.trim().length === 0) {
    //     requiredNumberField("Please Enter Mobile Number");
    // } else if (shortNameField.trim().length === 0) {
    //   setRequiredshortNameField("Please Enter Short Name");
    // }
  };
  const obj = {
    "altMobile": alternateMobileNumber,
    "businessAddress": {
      "addressLine": "string",
      "city": "string",
      "dist": "string",
      "pincode": 0,
      "state": "string",
      "type": "string"
    },
    "businessId": 0,
    "businessName": mandiNameField,
    "businessType": mandiTypeField,
    "contactName": contactName,
    "imageUrl": "string",
    "marketId": 0,
    "mobile": mobileNumber,
    "otherMarket": "string",
    "shopNum": shopNumberField,
    "shortCode": mandiShortCode
  }
  const addEditMandiSetupApiCall = ()=>{
    completeMandiSetup(obj, clickId).then(
      (response) => {
        if (response.data.status.type === "SUCCESS") {
          console.log(response, "add partner");
          localStorage.setItem("businessCreatedStatus",response.data.status.message)
        }
      },
      (error) => {
        toastr.error(error.response.data.status.description);
      }
    );
  }
  return (
    <Modal show={props.show} close={props.close} className="modal_popup">
      <div className="modal-header date_modal_header smartboard_modal_header">
        <h5 className="modal-title header2_text" id="staticBackdropLabel">
          Mandi Details
        </h5>
        <img
          src={close}
          alt="image"
          className="close_icon"
          onClick={props.close}
        />
      </div>
      <div className="modal-body partner_model_body" id="scroll_style">
        <form>
          <div className="row">
            <div className="col-lg-6">
              <InputField
                type="text"
                value=""
                label="Market Name*"
                name="marketName"
                id="marketName"
                onChange={(e) => {}}
              />
              <InputField
                type="text"
                value={mandiTypeField}
                label="Mandi Type"
                name="mandiType"
                id="mandiType"
                onChange={(e) => {
                  handleMandiType(e);
                }}
              />
              <span className="text-danger">{mandiTypeError}</span>
              <InputField
                type="text"
                value={mandiShortCode}
                label="Mandi Short Code*"
                name="mandiShortCode"
                id="mandiShortCode"
                onChange={(e) => {
                  handleMandiShortCode(e);
                }}
              />
              <span className="text-danger">{mandiShortCodeError}</span>
              <InputField
                type="text"
                value={shopNumberField}
                label="Shop Number*"
                name="shopNumber"
                id="shopNumber"
                onChange={(e) => {
                  handleShopNumber(e);
                }}
              />
              <span className="text-danger">{shopNumberError}</span>
              <InputField
                type="text"
                value={mobileNumber}
                label="Mobile Number*"
                name="mobileNumber"
                id="mobileNumber"
                onChange={(e) => {
                  handleMobileNumber(e);
                }}
              />
              <span className="text-danger">{requiredNumberField}</span>
              <label className="input_field address_text mt-0">Address</label>
              <div>
                <label htmlFor="zip" className="input_field">
                  Pincode*
                </label>
                <div>
                  <input
                    id="zip"
                    className="form-control"
                    type="text"
                    label="pincode"
                    name="zip"
                    onChange={(e) => {
                      // onZip(e);
                    }}
                    value=""
                  />
                </div>
              </div>
              <div>
                <label htmlFor="city" className="input_field">
                  City*
                </label>
                <div id="city-input-wrapper">
                  {/* {isEdit ? (
                          <div>
                            <InputField
                              type="text"
                              id="city"
                              name="city"
                              value={cityVal}
                            />
                          </div>
                        ) : ( */}
                  <InputField type="text" id="city" name="city" />
                  {/* // )} */}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <InputField
                type="text"
                value={mandiNameField}
                label="Mandi Name*"
                name="mandiName"
                id="mandiName"
                onChange={(e) => {
                  handleMandiName(e);
                }}
              />
              <span className="text-danger">{mandiNameError}</span>
              <div>
                <label htmlFor="pic" className="input_field">
                  Profile Pic
                </label>
                <div className="file-input">
                  <div className="d-flex align-items-center">
                    <div className="input_file">
                      <img
                        src={
                          // file
                          //   ? URL.createObjectURL(file)
                          single_bill
                        }
                        alt=""
                      />
                    </div>
                    <div>
                      <input
                        type="file"
                        id="file"
                        //   onChange={(e) => setFile(e.target.files[0])}
                      />
                      <label htmlFor="file" className="file">
                        Choose from library
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <InputField
                type="text"
                value={contactName}
                label="Contact Name*"
                name="contactName"
                id="contactName"
                onChange={(e) => {
                  handleContactName(e);
                }}
              />
              <span className="text-danger">{contactNameError}</span>
              <InputField
                type="text"
                value={alternateMobileNumber}
                label="Alternative Mobile"
                name="alternativeMobile"
                id="alternativeMobile"
                onChange={(e) => {
                  handleAlternateMobileNumber(e);
                }}
              />
              <span className="text-danger">{alternateMobileNumberError}</span>
              <div
                //   onClick={() => getPosition()}
                className="location mt-0"
              >
                Select Current Location
              </div>
              {/* <label className="input_field address_text mt-0 hidden_field">Address</label> */}
              <div>
                <label htmlFor="state" className="input_field">
                  State*
                </label>
                {/* {isEdit ? (
                        <input
                          id="state"
                          className="form-control"
                          name="state"
                          value=""
                        />
                      ) : ( */}
                <input id="state" className="form-control" name="state" />
                {/* )} */}
              </div>
              <InputField
                type="text"
                value=""
                label="Street & Village*"
                name="name"
                onChange={(e) => {
                  // handleStreetName(e);
                }}
              />
            </div>
          </div>
          <div className="row">
            <span className="pl-3 note_text">
              Please keep correct Business Address as this address is displayed
              on your cash bills
            </span>
          </div>
        </form>
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="primary_btn"
          onClick={props.close}
          onClick={() => onSubmit()}
        >
          Submit
        </button>
      </div>
    </Modal>
  );
};
export default CompleteProfile;
