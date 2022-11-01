import { Modal } from "react-bootstrap";
import "../smartboard/smartboard.scss";
import "../smartboard/completeprofile.scss";
import close from "../../assets/images/close.svg";
import single_bill from "../../assets/images/bills/single_bill.svg";
import InputField from "../../components/inputField";
import { useState, useEffect } from "react";
import toastr from "toastr";
import { completeMandiSetup, editMandiSetup } from "../../actions/loginService";
import $ from "jquery";
import { useSelector } from "react-redux";
import { getAllMarkets } from "../../actions/loginService";
const CompleteProfile = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const mandiEditStatus = localStorage.getItem("mandiEditStatus");
  const data = localStorage.getItem("mandiEditDetails");
  const mandiData = JSON.parse(data);
  const mandiUserDetails = useSelector(
    (state) => state.mandiInfo.isMandiDetails
  );
  const [allMarketsData, setAllMarketsData] = useState([]);
  useEffect(() => {
    getAllMarkets().then(
      (response) => {
        if (response.data.status.type === "SUCCESS") {
          setAllMarketsData(response.data.data);
        }
      },
      (error) => {}
    );
  }, []);
  // mandi name
  const [mandiNameField, setMandiNameField] = useState(
    mandiEditStatus ? mandiData.businessName : ""
  );
  const [mandiNameError, setMandiNameError] = useState("");
  const handleMandiName = (e) => {
    e.preventDefault();
    setMandiNameField(e.target.value);
    commonValidation(e, "mandiname");
  };
  //   mandi type
  const [mandiTypeField, setMandiTypeField] = useState(
    mandiEditStatus ? mandiData.businessType : ""
  );
  const [mandiTypeError, setMandiTypeError] = useState("");
  const handleMandiType = (e) => {
    setMandiTypeField(e.target.value);
    commonValidation(e, "manditype");
  };
  //   mandi short code
  const [mandiShortCode, setMandiShortCode] = useState(
    mandiEditStatus ? mandiData.shortCode : ""
  );
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
  const [shopNumberField, setShopNumberField] = useState(
    mandiEditStatus ? mandiData.shopNum : ""
  );
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
  const [contactName, setContactName] = useState(
    mandiEditStatus ? mandiData.contactName : ""
  );
  const [contactNameError, setContactNameError] = useState("");
  const handleContactName = (e) => {
    setContactName(e.target.value.replace(/[^A-Za-z0-9]/g, " "));
    commonValidation(e, "contactname");
  };
  //   mobile number
  const [mobileNumber, setmobileNumber] = useState(
    mandiEditStatus ? mandiData.mobile : ""
  );
  const [requiredNumberField, setRequiredNumberField] = useState("");
  const handleMobileNumber = (e) => {
    mobileNumberValidation(e, "mobile");
  };
  const [alternateMobileNumber, setAlternateMobileNumber] = useState(
    mandiEditStatus ? mandiData.altMobile : ""
  );
  const [alternateMobileNumberError, setAlternateMobileNumberError] =
    useState("");
  const handleAlternateMobileNumber = (e) => {
    mobileNumberValidation(e, "alternateMobile");
  };
  const [pincode, setPincode] = useState(
    mandiEditStatus ? mandiData.businessAddress.pincode : ""
  );
  const [cityVal, setCityVal] = useState(
    mandiEditStatus ? mandiData.businessAddress.dist : ""
  );
  const [stateVal, setStateVal] = useState(
    mandiEditStatus ? mandiData.businessAddress.state : ""
  );
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
  const [streetVillage, setStreetVillage] = useState(
    mandiEditStatus ? mandiData.businessAddress.addressLine : ""
  );
  const [streetvillageError, setStreetvillageError] = useState("");
  const handleStreetName = (e) => {
    setStreetVillage(e.target.value.replace(/[^A-Za-z0-9]/g, " "));
    commonValidation(e, "streetvillage");
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
      } else if (type == "streetvillage") {
        setStreetvillageError(string1);
      } else {
        setContactNameError(string1);
      }
    } else if (e.target.value.length > 30) {
      if (type == "mandiname") {
        setMandiNameError(string2);
      } else if (type == "manditype") {
        setMandiTypeError(string2);
      } else if (type == "streetvillage") {
        setStreetvillageError(string2);
      } else {
        setContactNameError(string2);
      }
    } else {
      if (type == "mandiname") {
        setMandiNameError("");
      } else if (type == "manditype") {
        setMandiTypeError("");
      } else if (type == "streetvillage") {
        setStreetvillageError("");
      } else {
        setContactNameError("");
      }
    }
  };
  const [submitStatus, setSubmitStatus] = useState(false);
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
    altMobile: mandiEditStatus ? mandiData.altMobile : alternateMobileNumber,
    businessAddress: {
      addressLine: streetVillage,
      city: cityVal,
      dist: cityVal,
      pincode: pincode,
      state: stateVal,
      type: "BUSINESS",
    },
    businessId: mandiEditStatus ? mandiData.businessId : 0,
    businessName: mandiNameField,
    businessType: mandiTypeField,
    contactName: contactName,
    imageUrl: "string",
    marketId: mandiEditStatus ? mandiData.marketId : selectMarketId,
    mobile: mobileNumber,
    otherMarket: "string",
    shopNum: shopNumberField,
    shortCode: mandiShortCode,
  };
  const addEditMandiSetupApiCall = () => {
    if (mandiEditStatus) {
      editMandiSetup(obj, clickId).then(
        (response) => {
          if (response.data.status.type === "SUCCESS") {
            console.log(response, "update partner");
            toastr.success(response.data.status.message);
            localStorage.setItem("submitStatus", true);
          }
        },
        (error) => {
          toastr.error(error.response.data.status.description);
        }
      );
    } else {
      completeMandiSetup(obj, clickId).then(
        (response) => {
          if (response.data.status.type === "SUCCESS") {
            console.log(response, "add partner");
            setMandiNameField(mandiNameField);
            localStorage.setItem(
              "businessCreatedStatus",
              response.data.status.message
            );
          }
        },
        (error) => {
          toastr.error(error.response.data.status.description);
        }
      );
    }
  };
  // address details
  const getPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, posError);
    } else {
      alert("Sorry, Geolocation is not supported by this browser.");
      // Alert is browser does not support geolocation
    }
  };
  const posError = () => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((res) => {
        if (res.state === "denied") {
          alert(
            "Enable location permissions for this website in your browser settings."
          );
        }
      });
    } else {
      alert(
        "Unable to access your location. You can continue by submitting location manually."
      ); // Obtaining Lat/long from address necessary
    }
  };
  const showPosition = async (position) => {
    let lat = position.coords.latitude; // You have obtained latitude coordinate!
    let long = position.coords.longitude; // You have obtained
    await getAddress(lat, long, "AIzaSyBw-hcIThiKSrWzF5Y9EzUSkfyD8T1DT4A");
  };
  // Converting lat/long from browser geolocation into city, state, and zip code using Google Geocoding API
  const getAddress = (lat, long, googleKey) => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${googleKey}`
    )
      .then((res) => res.json())
      .then((address) => setZip(address));
  };
  // Dispatching city, state, and zip code to store state
  const setZip = (address) => {
    let pincode = address.results[0].formatted_address;
    var pincodeValue = pincode.replace(/\D/g, "");
    let city = address.results[5].address_components[2].short_name;
    let state = address.results[5].address_components[4].short_name;
    $("#city").val(city);
    $("#state").val(state);
    $("#zip").val(pincodeValue);
    setPincode(pincodeValue);
    setCityVal(city);
    setStateVal(state);
    localStorage.setItem("cityValue", city);
    var $input;
    var $text = $(document.createElement("input"));
    $text.attr("value", city);
    $text.attr("type", "text");
    $text.attr("type", "text");
    $text.attr("class", "form-control");
    $input = $text;
    $("#city-input-wrapper").html($input);
  };
  const onZip = (event) => {
    var zip = $("#zip").val().replace(/[^\d]/g, "");
    setPincode(zip);
    var api_key = "AIzaSyBw-hcIThiKSrWzF5Y9EzUSkfyD8T1DT4A";
    if (zip.length) {
      //make a request to the google geocode api with the zipcode as the address parameter and your api key
      $.get(
        "https://maps.googleapis.com/maps/api/geocode/json?address=" +
          zip +
          "&key=" +
          api_key
      ).then(function (response) {
        //parse the response for a list of matching city/state
        var possibleLocalities = geocodeResponseToCityState(response);
        fillCityAndStateFields(possibleLocalities);
      });
    }
  };

  function fillCityAndStateFields(localities) {
    var locality = localities[0]; //use the first city/state object

    $("#city").val(locality.city);
    $("#state").val(locality.state);
  }

  function geocodeResponseToCityState(geocodeJSON) {
    //will return and array of matching {city,state} objects
    var parsedLocalities = [];
    if (geocodeJSON.results.length) {
      for (var i = 0; i < geocodeJSON.results.length; i++) {
        var result = geocodeJSON.results[i];
        var locality = {};
        for (var j = 0; j < result.address_components.length; j++) {
          var types = result.address_components[j].types;
          for (var k = 0; k < types.length; k++) {
            if (types[k] === "locality") {
              locality.city = result.address_components[j].long_name;
            } else if (types[k] === "administrative_area_level_1") {
              locality.state = result.address_components[j].short_name;
            }
          }
        }
        parsedLocalities.push(locality);

        //check for additional cities within this zip code
        if (result.postcode_localities) {
          for (var l = 0; l < result.postcode_localities.length; l++) {
            parsedLocalities.push({
              city: result.postcode_localities[l],
              state: locality.state,
            });
          }
        }
      }
    } else {
      console.log("error: no address components found");
    }
    return parsedLocalities;
  }
  function fillCityAndStateFields(localities) {
    var locality = localities[0];
    $("#city").val(locality.city);
    $("#state").val(locality.state);
    var $input;
    var city = localities[0].city;
    setCityVal(city);
    setStateVal(locality.state);
    var $text = $(document.createElement("input"));
    $text.attr("value", city);
    $text.attr("type", "text");
    $text.attr("type", "text");
    $text.attr("class", "form-control");
    $input = $text;
    $("#city-input-wrapper").html($input);
  }
  const [selectMarket, setSelectedOption] = useState("marke name");
  const [selectMarketId, setSelectedMarketId] = useState(0);
  const selectedValue = (e) => {
    console.log(e.target.value);
    setSelectedOption(e.target.value);
    allMarketsData.map((item) => {
      if (item.marketName == e.target.value) {
        console.log(item.marketId,"id");
        setSelectedMarketId(item.marketId)
      }
    });
  };
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
              <label htmlFor="zip" className="input_field">
                Market Name*
              </label>
              <select
                className="form-control"
                value={selectMarket}
                onChange={selectedValue}
              >
                {allMarketsData.map((market) => (
                  <option value={market.marketName}>{market.marketName}</option>
                ))}
              </select>

              {/* <InputField
                type="text"
                value=""
                label="Market Name*"
                name="marketName"
                id="marketName"
                onChange={(e) => {}}
              /> */}
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
                      onZip(e);
                    }}
                    value={pincode}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="city" className="input_field">
                  City*
                </label>
                <div id="city-input-wrapper">
                  {mandiEditStatus ? (
                    <div>
                      <InputField
                        type="text"
                        id="city"
                        name="city"
                        value={cityVal}
                      />
                    </div>
                  ) : (
                    <InputField type="text" id="city" name="city" />
                  )}
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
              <div onClick={() => getPosition()} className="location mt-0">
                Select Current Location
              </div>

              <div>
                <label htmlFor="state" className="input_field">
                  State*
                </label>
                {mandiEditStatus ? (
                  <input
                    id="state"
                    className="form-control"
                    name="state"
                    value={stateVal}
                  />
                ) : (
                  <input id="state" className="form-control" name="state" />
                )}
              </div>
              <InputField
                type="text"
                value={streetVillage}
                label="Street & Village*"
                name="name"
                onChange={(e) => {
                  handleStreetName(e);
                }}
              />
              <span className="text-danger">{streetvillageError}</span>
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
          // onClick={props.close}
          onClick={() => onSubmit()}
        >
          Submit
        </button>
      </div>
    </Modal>
  );
};
export default CompleteProfile;
