import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import close from "../../assets/images/close.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  getPartnerData,
  addPartner,
  editPartnerItem,
} from "../../actions/billCreationService";
import $ from "jquery";
import moment from "moment";
import InputField from "../../components/inputField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import single_bill from "../../assets/images/bills/single_bill.svg";
import date_icon from "../../assets/images/date_icon.svg";
import { getText } from "../../components/getText";
import { uploadProfilePic } from "../../actions/uploadProfile";
import location_icon from "../../assets/images/location_icon.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  partnerDataInfo,
  partnersAllData,
  partnerType,
  radioButtonVal,
} from "../../reducers/partnerSlice";
import { singleTransporter } from "../../reducers/transpoSlice";
const PartnerModal = (props) => {
  const dispatch = useDispatch();
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const partnerDataArray = useSelector((state) => state.partnerInfo);
  const clickId = loginData.caId;
  var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
  const partnerData = partnerDataArray?.partnerDataInfo;
  const savetype = localStorage.getItem("partyType");
  const partyType = partnerDataArray?.partnerType;
  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);
  const [nameError, setNameError] = useState("");
  const [shortnameError, setShortNameError] = useState("");
  const [mobileNumber, setmobileNumber] = useState("");
  const [requiredNameField, setRequiredNameField] = useState("");
  const [requiredshortNameField, setRequiredshortNameField] = useState("");
  const [requiredNumberField, setRequiredNumberField] = useState("");
  const fromTrader = partnerDataArray?.isFromTrader;
  const isEdit = partnerDataArray?.isEditPartner;
  const selectedPartnerObj = partnerDataArray?.partnerSingleObj;
  const transpoData = useSelector((state) => state.transpoInfo);
  const getPartyVal = () => {
    var val;
    if (partyType.toUpperCase() === "FARMER" && !fromTrader) {
      val = "FARMER";
    } else if (partyType.toUpperCase() === "BUYER" && !fromTrader) {
      val = "BUYER";
    } else {
      val = langFullData.trader;
    }
    return val;
  };

  useEffect(() => {
    if (isEdit) {
      setAadharNumber(selectedPartnerObj.aadharNum);
      setmobileNumber(selectedPartnerObj.mobile);
      setStreetVillage(selectedPartnerObj.address.addressLine);
      setShortNameField(selectedPartnerObj.shortName);
      setNameField(selectedPartnerObj.partyName);
      setCityVal(selectedPartnerObj.address.dist);
      setStateVal(selectedPartnerObj.address.state);
      setUpdateProfilePic(selectedPartnerObj.profilePic);
      setPincode(selectedPartnerObj.address.pincode);
      setVehicleNum(selectedPartnerObj.vehicleInfo?.vehicleNum);
      setVehicleType(selectedPartnerObj.vehicleInfo?.vehicleType);
      setOpeningBalance(selectedPartnerObj.openingBal);
      if (
        selectedPartnerObj.partyType.toLowerCase() == "farmer" ||
        selectedPartnerObj.partyType.toLowerCase() == "buyer"
      ) {
        if (selectedPartnerObj.trader) {
          dispatch(radioButtonVal("TRADER"));
        } else {
          dispatch(radioButtonVal(selectedPartnerObj.partyType.toUpperCase()));
        }
      }
      setStartDate(new Date(selectedPartnerObj.openingBalDate));
    } else {
      showModalEvent();
    }

    if (partnerDataArray?.fromTranspoFeature) {
      dispatch(partnerType(partyType.toUpperCase()));
    } else {
      dispatch(partnerType(savetype !== null ? savetype : partyType));
    }
    dispatch(radioButtonVal(getPartyVal()));
  }, [props.showModal]);
  const handleMobileNumber = (e) => {
    let onlyNumbers = e.target.value.replace(/[^\d]/g, "");
    if (e.target.value.length < 10) {
      setRequiredNumberField("Minimum mobile number length should be 10");
    } else {
      setRequiredNumberField("");
    }
    let number = onlyNumbers.slice(0, 10);
    setmobileNumber(number);
  };
  const [aadharNumber, setAadharNumber] = useState("");
  const [aadharError, setAadharError] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const handleNumber = (e) => {
    let onlyNumbers = e.target.value.replace(/[^\d]/g, "");
    if (e.target.value.length < 12) {
      setAadharError("Minimum Adhar number length should be 12");
    } else {
      setAadharError("");
    }
    let number = onlyNumbers.slice(0, 12);
    setAadharNumber(number);
  };
  const handleOpeninngBal = (e) => {
    let onlyNumbers = e.target.value.replace(/[^\d]/g, " ");
    setOpeningBalance(onlyNumbers);
  };

  const [nameField, setNameField] = useState("");
  const handleName = (e) => {
    setNameField(e.target.value.replace(/[^A-Za-z0-9]/g, " "));
    commonValidation(e, "name");
    setRequiredNameField("");
  };
  const commonValidation = (e, type) => {
    var string1 = "Name should be min 2 characters";
    var string2 = "Name should be max 30 characters";
    if (e.target.value.length < 2) {
      if (type == "name") {
        setNameError(string1);
      } else if (type == "shortName") {
        setShortNameError(string1);
      }
    } else if (e.target.value.length > 30) {
      if (type == "name") {
        setNameError(string2);
      } else if (type == "shortName") {
        setShortNameError(string2);
      }
    } 
    else {
      if (type == "name") {
        setNameError("");
      } else if (type == "shortName") {
        setShortNameError("");
      }
    }
  };
  const [shortNameField, setShortNameField] = useState("");
  const handleShortName = (e) => {
    setShortNameField(e.target.value.replace(/[^A-Za-z0-9]/g, " "));
    commonValidation(e, "shortName");
    setRequiredshortNameField("");
  };
  const [vehicleType, setVehicleType] = useState("");
  const handlevehicleType = (e) => {
    setVehicleType(e.target.value.replace(/[^A-Za-z0-9]/g, " "));
  };
  const [vehicleNum, setVehicleNum] = useState("");
  const handlevehicleNum = (e) => {
    console.log(e.target.value);
    setVehicleNum(e.target.value);
  };
  const [streetVillage, setStreetVillage] = useState("");
  const handleStreetName = (e) => {
    setStreetVillage(e.target.value);
    commonValidation(e);
  };
  const [startDate, setStartDate] = useState(new Date());
  const partnerSelectDate = moment(startDate).format("YYYY-MM-DD");
  const [pincode, setPincode] = useState("");
  const [cityVal, setCityVal] = useState("");
  const [stateVal, setStateVal] = useState("");
  const radioValue = partnerDataArray?.radioButtonVal;
  function onChangeValue(event) {
    dispatch(radioButtonVal(event.target.value.toUpperCase()));
  }

  const [profilePic, setProfilePic] = useState(null);
  const [updateProfilePic, setUpdateProfilePic] = useState(null);
  const handleProfilePic = (e) => {
    if (isEdit) {
      var output = document.getElementById("output");
      output.src = URL.createObjectURL(e.target.files[0]);
      output.onload = function () {
        URL.revokeObjectURL(output.src);
      };
      var req = {
        file: e.target.files[0],
        type: partyType,
      };
      uploadProfilePic(clickId, mobileNumber, req)
        .then((response) => {
          setUpdateProfilePic(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
      console.log(updateProfilePic);
    } else {
      if (mobileNumber.length !== 0) {
        var output = document.getElementById("output");
        output.src = URL.createObjectURL(e.target.files[0]);
        output.onload = function () {
          URL.revokeObjectURL(output.src);
        };
      }
      let req = {
        file: e.target.files[0],
        type: partyType,
        writerId: writerId,
      };
      uploadProfilePic(clickId, mobileNumber, req)
        .then((response) => {
          setProfilePic(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const obj = {
    aadharNum: aadharNumber,
    address: {
      addressLine: streetVillage,
      city: cityVal,
      dist: cityVal,
      pincode: pincode == 0 ? 0 : pincode,
      state: stateVal,
      type: "PERSONAL",
    },
    caId: isEdit ? clickId : clickId,
    createdOn: "2022-10-03T10:55:33.895Z",
    mobile: mobileNumber,
    openingBal: openingBalance,
    openingBalDate: partnerSelectDate,
    partyId: isEdit ? selectedPartnerObj.partyId : 0,
    partyName: nameField,
    partyType: partyType == "COOLIE" ? 'LABOR' : partyType,
    profilePic: isEdit ? updateProfilePic : profilePic, //single_bill,
    seqNum: 0,
    shortName: shortNameField,
    trader:
      radioValue.trim().length !== 0
        ? radioValue == "FARMER" || radioValue == "BUYER"
          ? false
          : partyType == "COOLIE" || partyType == "TRANSPORTER"
          ? false
          : true
        : false,
    vehicleInfo: {
      vehicleNum: vehicleNum,
      vehicleType: vehicleType,
    },
    writerId: writerId,
  };

  //   file ? URL.createObjectURL(file) :
  var exitStatus = false;
  const handleExitPartner = (mobilee) => {
    partnerData.map((item) => {
      if (item.mobile === mobilee && !isEdit) {
        exitStatus = true;
        return exitStatus;
      }
    });
    return exitStatus;
  };
  const onSubmit = () => {
    if (handleExitPartner(mobileNumber)) {
      toast.error("Partner Already Existed", {
        toastId: "error5",
      });
    } else if (
      nameField.trim().length !== 0 &&
      nameField.trim().length !== 1 &&
      nameField.trim().length < 30 &&
      mobileNumber.trim().length !== 0 &&
      mobileNumber.trim().length >= 10 &&
      (partyType === "TRANSPORTER" || partyType == "COOLIE"
        ? true
        : shortNameField.trim().length !== 0 &&
          shortNameField.trim().length < 15 &&
          shortNameField.trim().length !== 1) &&
      (aadharNumber.trim().length == 0
        ? true
        : aadharNumber.trim().length < 12
        ? false
        : true)
    ) {
      addEditPartnerApiCall();
      localStorage.setItem("partyType", partyType);
    } else if (mobileNumber.trim().length === 0) {
      setRequiredNumberField(langFullData.enterYourMobileNumber);
    } else if (mobileNumber.trim().length < 10) {
      setRequiredNumberField("Minimum mobile number length should be 10");
    } else if (shortNameField.trim().length === 0) {
      setRequiredshortNameField("Please Enter Short Name");
    } else if (nameField.trim().length === 0) {
      setRequiredNameField(langFullData.pleaseEnterFullName);
    } else if (nameField.trim().length === 1) {
      setNameError("Name should be min 2 characters");
    } else if (shortNameField.trim().length === 1) {
      setShortNameError("Name should be min 2 characters");
    } else if (shortNameField.trim().length > 15) {
      setShortNameError("Name should be Max 15 characters");
    } else if (aadharNumber.trim().length < 12) {
      setAadharError("Minimum Adhar number length should be 12");
    }
  };
  const addEditPartnerApiCall = () => {
    var type = partyType == "COOLIE" ? 'LABOR' : partyType;
    console.log(obj, "edit");
    if (isEdit) {
      console.log(pincode, obj);
      editPartnerItem(obj).then(
        (response) => {
          if (response.data.status.type === "SUCCESS") {
            toast.success("Updated Successfully", {
              toastId: "success2",
            });
            props.closeModal();
            
            getPartnerData(clickId, type)
              .then((response) => {
                if (response.data.data != null) {
                  dispatch(partnersAllData(response.data.data));
                  dispatch(partnerDataInfo(response.data.data));
                  var index = response.data.data.findIndex(
                    (obj) =>
                      obj.partyId == transpoData?.singleTransporter?.partyId
                  );
                  if (index != -1) {
                    dispatch(singleTransporter(response.data.data[index]));
                  }
                }
              })
              .catch((error) => {});
          }
        },
        (error) => {
          toast.error(error.response.data.status.message, {
            toastId: "errorr2",
          });
        }
      );
    } else {
      addPartner(obj, clickId).then(
        (response) => {
          if (response.data.status.type === "SUCCESS") {
            toast.success(response.data.status.message, {
              toastId: "success2",
            });

            getPartnerData(clickId, type)
              .then((response) => {
                if (response.data.data != null) {
                  dispatch(partnersAllData(response.data.data));
                  dispatch(partnerDataInfo(response.data.data));
                  console.log(response.data.data);
                }
              })
              .catch((error) => {});
            props.closeModal();
          }
        },
        (error) => {
          toast.error(error.response.data.status.message, {
            toastId: "errorr3",
          });
        }
      );
    }
    closeAddModal();
  };

  const getPosition = () => {
    setStreetVillage("");
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
    var hi = fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${googleKey}`
    )
      .then((res) => res.json())
      .then((address) => setZip(address));
  };
  // Dispatching city, state, and zip code to store state
  const setZip = (address) => {
    var pincodeValue;
    // let pincode = address.results[0].formatted_address;
    for (var i = 0; i < address.results[0].address_components.length; i++) {
      if (address.results[0].address_components[i].types[0] == "postal_code") {
        pincodeValue = address.results[0].address_components[i].long_name;
      }
    }
    pincodeValue = pincodeValue.replace(/\D/g, "");
    let city = address.results[5].address_components[2].short_name;
    let state = address.results[5].address_components[3].short_name;
    $("#city").val(city);
    $("#state").val(state);
    $("#zip").val(pincodeValue);
    setPincode(pincodeValue);
    setCityVal(city);
    setStateVal(state);
  };
  const [pincodeLength, setPincodeLength] = useState(false);
  const onZip = (event) => {
    var zip = $("#zip").val().replace(/[^\d]/g, "");
    let number = zip.slice(0, 6);
    setPincode(number);
    setStreetVillage("");
    var api_key = "AIzaSyBw-hcIThiKSrWzF5Y9EzUSkfyD8T1DT4A";
    if (zip.length >= 6) {
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
      setPincodeLength(false);
    } else {
      console.log("error", zip.length);
      $("#city").val("");
      $("#state").val("");
      setCityVal("");
      setStateVal("");
      setPincodeLength(true);
    }
  };

  function fillCityAndStateFields(localities) {
    var locality = localities[0];
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
    console.log(locality, localities, "locality");
    $("#city").val(locality.city);
    $("#state").val(locality.state);
    var city = localities[0].city;
    setCityVal(city);
    setStateVal(locality.state);
  }
  const keydownEvent = (e) => {
    if (e.keyCode == 9) {
      // e.onKeyDown(e);
      // setopenDatePicker(false);
    } else {
      e.preventDefault();
    }
  };
  const closeAddModal = () => {
    setPincode("");
    setAadharError("");
    setNameError("");
    setStateVal("");
    setStartDate(new Date());
    setAadharNumber("");
    setRequiredNumberField("");
    $("#state").val("");
    $("#city").val("");
    setVehicleNum("");
    setVehicleType("");
    setPincodeLength(false);
    setProfilePic("");
  };
  const showModalEvent = () => {
    setPincode();
    setAadharNumber("");
    setCityVal("");
    setNameField("");
    setOpeningBalance("");
    setmobileNumber("");
    setStateVal("");
    setProfilePic("");
    setShortNameField("");
    setStreetVillage("");
    setProfilePic("");
    getPartyVal();
  };
  return (
    <Modal
      show={props.showModal}
      close={props.closeModal}
      className="partner_modal"
    >
      <div className="modal-body partner_model_body">
        <form>
          <div className="d-flex align-items-center justify-content-between modal_common_header">
            <h5 className="modal-title header2_text" id="staticBackdropLabel">
              {isEdit ? "Edit " : "Add "}
              {partyType == langFullData.farmer.toUpperCase()
                ? "Seller"
                : getText(partyType)}
            </h5>
            <button
              onClick={(e) => {
                closeAddModal();
                props.closeModal();
                e.preventDefault();
              }}
            >
              <img src={close} alt="image" className="close_icon" />
            </button>
          </div>
          <div className="partner_model_scroll" id="scroll_style">
            <div className="row">
              {partyType == langFullData.farmer.toUpperCase() ||
              partyType == langFullData.buyer.toUpperCase() ? (
                <div>
                  <label className="input_field">
                    Select Type <span className="star-color">*</span>
                  </label>

                  <div onChange={onChangeValue}>
                    <input
                      type="radio"
                      value={partyType.toLowerCase()}
                      name="radioValue1"
                      id={partyType.toLowerCase()}
                      checked={
                        radioValue.toLowerCase() === partyType.toLowerCase()
                      }
                      className="radioBtnsVal"
                    />{" "}
                    {getText(partyType)}
                    <input
                      type="radio"
                      value="trader"
                      id="trader"
                      name="radioValue2"
                      checked={radioValue.toLowerCase() === "trader"}
                      className="radioBtnVal"
                    />{" "}
                    {langFullData.trader}
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            {partyType == "COOLIE" ? (
              <div>
                <div className="row">
                  <div className="col-lg-12 p-0">
                    <InputField
                      type="text"
                      value={mobileNumber}
                      label={langFullData.mobileNumber}
                      name="mobileNumber"
                      id="mobileNumber"
                      onChange={(e) => {
                        handleMobileNumber(e);
                      }}
                      starRequired={true}
                    />
                    <span className="text-danger">{requiredNumberField}</span>
                    <InputField
                      type="text"
                      value={nameField}
                      label={"Name"}
                      name="name"
                      id="inputName"
                      onChange={(e) => {
                        handleName(e);
                      }}
                      starRequired={true}
                    />
                    <span className="text-danger">{nameError}</span>
                    <span className="text-danger">{requiredNameField}</span>
                    <InputField
                      type="text"
                      value={aadharNumber}
                      label={langFullData.aadhar}
                      name="name"
                      onChange={(e) => {
                        handleNumber(e);
                      }}
                      starRequired={false}
                    />
                    <span className="text-danger">{aadharError}</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 pl-0">
                    {" "}
                    <label className="input_field address_text mt-0">
                      {langFullData.address}
                    </label>
                  </div>
                  <div className="col-lg-6">
                    {" "}
                    <div
                      onClick={() => getPosition()}
                      className="location mt-0"
                    >
                      <div className="d-flex align-items-center">
                        <img src={location_icon} alt="" className="mr-2" />
                        {langFullData.selectCurrentLocation}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 pl-0">
                    {" "}
                    <div>
                      <label htmlFor="zip" className="input_field">
                        {langFullData.pincode}
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
                        {pincodeLength ? (
                          <span className="text-danger">
                            Minimum pincode length should be 6
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label htmlFor="state" className="input_field">
                        {langFullData.state}
                      </label>
                      {isEdit ? (
                        <input
                          id="state"
                          className="form-control"
                          name="state"
                          value={stateVal}
                          onChange={(e) =>
                            setStateVal(
                              e.target.value.replace(/[^A-Za-z0-9]/g, " ")
                            )
                          }
                        />
                      ) : (
                        <InputField
                          id="state"
                          className="form-control"
                          name="state"
                          value={stateVal}
                          onChange={(e) =>
                            setStateVal(
                              e.target.value.replace(/[^A-Za-z0-9]/g, " ")
                            )
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 pl-0">
                    {" "}
                    <div>
                      <label htmlFor="city" className="input_field">
                        District
                      </label>
                      <div>
                        {isEdit ? (
                          <div>
                            <InputField
                              type="text"
                              id="city"
                              name="city"
                              value={cityVal}
                              onChange={(e) => {
                                setCityVal(
                                  e.target.value.replace(/[^A-Za-z0-9]/g, " ")
                                );
                              }}
                            />
                          </div>
                        ) : (
                          <InputField
                            type="text"
                            id="city"
                            name="city"
                            value={cityVal}
                            onChange={(e) => {
                              setCityVal(
                                e.target.value.replace(/[^A-Za-z0-9]/g, " ")
                              );
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    {" "}
                    <InputField
                      type="text"
                      value={streetVillage}
                      label={langFullData.streetVillage}
                      name="name"
                      onChange={(e) => {
                        handleStreetName(e);
                      }}
                      starRequired={false}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div></div>
            )}

            {partyType == "FARMER" ||
            partyType == "BUYER" ||
            partyType == "TRANSPORTER" ? (
              <div>
                <div className="row">
                  <div className="col-lg-6 pl-0">
                    <InputField
                      type="text"
                      value={mobileNumber}
                      label={langFullData.mobileNumber}
                      name="mobileNumber"
                      id="mobileNumber"
                      onChange={(e) => {
                        handleMobileNumber(e);
                      }}
                      starRequired={true}
                    />

                    <span className="text-danger">{requiredNumberField}</span>
                  </div>
                  <div className="col-lg-6">
                    {partyType != "TRANSPORTER" ? (
                      partyType != "COOLIE" ? (
                        <div>
                          <InputField
                            type="text"
                            value={shortNameField}
                            label={langFullData.initialsShortName}
                            name="name"
                            onChange={(e) => {
                              handleShortName(e);
                            }}
                            starRequired={true}
                          />
                          <span className="text-danger">{shortnameError}</span>
                          <span className="text-danger">
                            {requiredshortNameField}
                          </span>
                        </div>
                      ) : (
                        <div></div>
                      )
                    ) : (
                      <div>
                        <InputField
                          type="text"
                          value={vehicleNum}
                          label={langFullData.vehicleNumber}
                          name="name"
                          onChange={(e) => {
                            handlevehicleNum(e);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 pl-0">
                    <div>
                      <InputField
                        type="text"
                        value={nameField}
                        label={"Name"}
                        name="name"
                        id="inputName"
                        onChange={(e) => {
                          handleName(e);
                        }}
                        starRequired={true}
                      />
                      <span className="text-danger">{nameError}</span>
                      <span className="text-danger">{requiredNameField}</span>
                      <InputField
                        type="text"
                        value={aadharNumber}
                        label={langFullData.aadhar}
                        name="name"
                        onChange={(e) => {
                          handleNumber(e);
                        }}
                        starRequired={false}
                      />
                      <span className="text-danger">{aadharError}</span>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    {partyType != "TRANSPORTER" ? (
                      partyType != "COOLIE" ? (
                        <div>
                          <label htmlFor="pic" className="input_field">
                            {langFullData.profilePic}
                          </label>
                          <div className="file-input">
                            <div className="d-flex align-items-center">
                              <div className="input_file">
                                {isEdit ? (
                                  <img
                                    src={
                                      isEdit
                                        ? updateProfilePic === ""
                                          ? single_bill
                                          : updateProfilePic
                                        : single_bill
                                    }
                                    id="output"
                                    alt=""
                                  />
                                ) : (
                                  <img
                                    src={profilePic ? profilePic : single_bill}
                                    id="output"
                                    alt=""
                                  />
                                )}
                              </div>
                              <div>
                                <input
                                  type="file"
                                  id="file"
                                  name="file"
                                  onChange={(e) => {
                                    handleProfilePic(e);
                                  }}
                                />
                                <label htmlFor="file" className="file">
                                  {langFullData.chooseFromLibrary}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div></div>
                      )
                    ) : (
                      <div>
                        <InputField
                          type="text"
                          value={vehicleType}
                          label={langFullData.vehicleType}
                          name="vehicleType"
                          onChange={(e) => {
                            handlevehicleType(e);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 pl-0">
                    {partyType == "FARMER" ||
                    partyType == "BUYER" ||
                    partyType == "TRANSPORTER" ? (
                      <InputField
                        type="text"
                        value={openingBalance}
                        label={langFullData.openingBalance}
                        name="name"
                        onChange={(e) => {
                          handleOpeninngBal(e);
                        }}
                        starRequired={false}
                      />
                    ) : (
                      <div></div>
                    )}
                  </div>
                  <div className="col-lg-6">
                    {partyType == "FARMER" ||
                    partyType == "BUYER" ||
                    partyType == "TRANSPORTER" ? (
                      <div>
                        <label htmlFor="pic" className="input_field">
                          {langFullData.asOnDate}
                        </label>
                        <label
                          className="d-flex align-items-baseline date_label"
                          onClick={(e) => e.preventDefault()}
                        >
                          <span className="date_icon m-0">
                            <img src={date_icon} alt="icon" />
                          </span>
                          <div className="date_field partner_date">
                            <DatePicker
                              dateFormat="dd-MMM-yyyy"
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                              className="form-control"
                              placeholder="Date"
                              maxDate={new Date()}
                              name="date"
                              enableTabLoop={false}
                              onKeyDown={(e) => {
                                keydownEvent(e);
                              }}
                            />
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 pl-0">
                    {" "}
                    <label className="input_field address_text mt-0">
                      {langFullData.address}
                    </label>
                  </div>
                  <div className="col-lg-6">
                    {" "}
                    <div
                      onClick={() => getPosition()}
                      className="location mt-0"
                    >
                      <div className="d-flex align-items-center">
                        <img src={location_icon} alt="" className="mr-2" />
                        {langFullData.selectCurrentLocation}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 pl-0">
                    {" "}
                    <div>
                      <label htmlFor="zip" className="input_field">
                        {langFullData.pincode}
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
                        {pincodeLength ? (
                          <span className="text-danger">
                            Minimum pincode length should be 6
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label htmlFor="state" className="input_field">
                        {langFullData.state}
                      </label>
                      {isEdit ? (
                        <input
                          id="state"
                          className="form-control"
                          name="state"
                          value={stateVal}
                          onChange={(e) =>
                            setStateVal(
                              e.target.value.replace(/[^A-Za-z0-9]/g, " ")
                            )
                          }
                        />
                      ) : (
                        <InputField
                          id="state"
                          className="form-control"
                          name="state"
                          value={stateVal}
                          onChange={(e) =>
                            setStateVal(
                              e.target.value.replace(/[^A-Za-z0-9]/g, " ")
                            )
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 pl-0">
                    {" "}
                    <div>
                      <label htmlFor="city" className="input_field">
                        District
                      </label>
                      <div>
                        {isEdit ? (
                          <div>
                            <InputField
                              type="text"
                              id="city"
                              name="city"
                              value={cityVal}
                              onChange={(e) => {
                                setCityVal(
                                  e.target.value.replace(/[^A-Za-z0-9]/g, " ")
                                );
                              }}
                            />
                          </div>
                        ) : (
                          <InputField
                            type="text"
                            id="city"
                            name="city"
                            value={cityVal}
                            onChange={(e) => {
                              setCityVal(
                                e.target.value.replace(/[^A-Za-z0-9]/g, " ")
                              );
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    {" "}
                    <InputField
                      type="text"
                      value={streetVillage}
                      label={langFullData.streetVillage}
                      name="name"
                      onChange={(e) => {
                        handleStreetName(e);
                      }}
                      starRequired={false}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </form>
      </div>
      <div className="modal-footer modal_common_footer">
        <div className="row">
          <div className="col-lg-6 pl-0"></div>
          <div className="col-lg-6">
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="secondary_btn mr-2"
                onClick={() => {
                  closeAddModal();
                  props.closeModal();
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary_btn"
                onClick={() => onSubmit()}
              >
                save
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </Modal>
  );
};
export default PartnerModal;
