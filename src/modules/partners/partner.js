import { useState, useEffect } from "react";
import OutlineButton from "../../components/outlineButton";
import "../partners/partner.scss";
import {
  getPartnerData,
  addPartner,
  deletePartnerId,
  editPartnerItem,
} from "../../actions/billCreationService";
import $ from "jquery";
import single_bill from "../../assets/images/bills/single_bill.svg";
import edit from "../../assets/images/edit_round.svg";
import delete_icon from "../../assets/images/delete.svg";
import close from "../../assets/images/close.svg";
import NoDataAvailable from "../../components/noDataAvailable";
import InputField from "../../components/inputField";
import toastr from "toastr";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import date_icon from "../../assets/images/date_icon.svg";
import { Modal, Button } from "react-bootstrap";
const Partner = () => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const [partnerData, setPartnerData] = useState([]);
  const [partyType, setPartyType] = useState("FARMER");
  const [file, setFile] = useState("");
  const [nameError, setNameError] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShow] = useState(false);
  const [partyIdVal, setPartyIdVal] = useState(0);
  const handleClose = () => setShow(false);

  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);
  console.log(langFullData);

  const handleDelete = (partyId) => {
    //   const deletePartner = (partyId) => {
    deletePartnerId(partyId, clickId).then(
      (response) => {
        if (response.data.status.type === "SUCCESS") {
          console.log(response, "delete partner");
          tabEvent(partyType);
        }
      },
      (error) => {
        toastr.error(error.response.data.status.description);
      }
    );
    setShow(false);
  };
  //   };
  const handleShow = (partyid) => {
    setShow(true);
    setPartyIdVal(partyid);
  };

  useEffect(() => {
    tabEvent(partyType);
  }, []);
  const [mobileNumber, setmobileNumber] = useState("");
  const [requiredNameField, setRequiredNameField] = useState("");
  const [requiredshortNameField, setRequiredshortNameField] = useState("");
  const [requiredNumberField, setRequiredNumberField] = useState("");
  const handleMobileNumber = (e) => {
    let onlyNumbers = e.target.value.replace(/[^\d]/g, " ");
    if(e.target.value.length < 10){
      setRequiredNumberField("Minimum mobile number length should be 10");
      console.log("het")
    }
    else{
    setRequiredNumberField("");
    }
    let number = onlyNumbers.slice(0, 10);
    setmobileNumber(number);
  };
  const [aadharNumber, setAadharNumber] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const handleNumber = (e) => {
    let onlyNumbers = e.target.value.replace(/[^\d]/g, " ");
    setAadharNumber(onlyNumbers);
  };
  const handleOpeninngBal = (e) => {
    let onlyNumbers = e.target.value.replace(/[^\d]/g, " ");
    setOpeningBalance(onlyNumbers);
  };

  const [nameField, setNameField] = useState("");
  const handleName = (e) => {
    setNameField(e.target.value.replace(/[^A-Za-z0-9]/g, " "));
    commonValidation(e);
    setRequiredNameField("");
  };
  const commonValidation = (e) => {
    if (e.target.value.length < 2) {
      setNameError("Name should be min 2 characters");
    } else if (e.target.value.length > 30) {
      setNameError("Name should be max 30 characters");
    } else {
      setNameError("");
    }
  };
  const [shortNameField, setShortNameField] = useState("");
  const handleShortName = (e) => {
    setShortNameField(e.target.value.replace(/[^A-Za-z0-9]/g, " "));
    commonValidation(e);
    setRequiredshortNameField("");
  };
  const [vehicleType, setVehicleType] = useState("");
  const handlevehicleType = (e) => {
    setVehicleType(e.target.value.replace(/[^A-Za-z0-9]/g, " "));
  };
  const [vehicleNum, setVehicleNum] = useState("");
  const handlevehicleNum = (e) => {
    setVehicleNum(e.target.value);
  };
  const [streetVillage, setStreetVillage] = useState("");
  const handleStreetName = (e) => {
    setStreetVillage(e.target.value.replace(/[^A-Za-z0-9]/g, " "));
    commonValidation(e);
  };
  const [startDate, setStartDate] = useState(new Date());
  const partnerSelectDate = moment(startDate).format("YYYY-MM-DD");
  const [pincode, setPincode] = useState("");
  const [cityVal, setCityVal] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [radioValue, setradioValue] = useState("FARMER");

  function onChangeValue(event) {
    setradioValue(event.target.value.toUpperCase());
    console.log(event.target.value);
  }
  const [partnerItem, setPartnerItem] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [addeditText, setAddeditText] = useState("Add");
  const editPartner = (partner) => {
    console.log("hey open", partner);
    setIsEdit(true);
    partnerData.map((item) => {
      if (item.partyId == partner.partyId) {
        setPartnerItem(item);
        setAadharNumber(partner.aadharNum);
        setmobileNumber(partner.mobile);
        setStreetVillage(partner.address.addressLine);
        setShortNameField(partner.shortName);
        setNameField(partner.partyName);
        setCityVal(partner.address.dist);
        setStateVal(partner.address.state);
        setPincode(partner.address.pincode);
        setOpeningBalance(partner.openingBal);
        setradioValue(partner.partyType.toUpperCase());
        setAddeditText("Edit");
      }
    });

    $("#Mymodal").modal("show");
  };

  const obj = {
    aadharNum: aadharNumber,
    address: {
      addressLine: streetVillage,
      city: cityVal,
      dist: cityVal,
      pincode: pincode,
      state: stateVal,
      type: "PERSONAL",
    },
    caId: isEdit ? clickId : 0,
    createdOn: "2022-10-03T10:55:33.895Z",
    mobile: mobileNumber,
    openingBal: openingBalance,
    openingBalDate: partnerSelectDate,
    partyId: isEdit ? partnerItem.partyId : 0,
    partyName: nameField,
    partyType: partyType,
    profilePic: single_bill,
    seqNum: 0,
    shortName: shortNameField,
    trader:(radioValue.trim().length !== 0) ? (radioValue == "FARMER" || radioValue == "BUYER") ? false : true : false,
    vehicleInfo: {
      vehicleNum: "string",
      vehicleType: vehicleType,
    },
  };
  //   file ? URL.createObjectURL(file) :
  
  const onSubmit = () => {
    console.log(obj);
    if (
      nameField.trim().length !== 0 &&
      mobileNumber.trim().length !== 0 &&
      shortNameField.trim().length !== 0
    ) {
      addEditPartnerApiCall();
    } else if (nameField.trim().length === 0) {
      setRequiredNameField(langFullData.pleaseEnterFullName);
      // alert("hii")
    } else if (mobileNumber.trim().length === 0) {
      setRequiredNumberField(langFullData.enterYourMobileNumber);
    } else if (shortNameField.trim().length === 0) {
      setRequiredshortNameField("Please Enter Short Name");
    }
  };
  const addEditPartnerApiCall = () => {
    if (isEdit) {
      editPartnerItem(obj).then(
        (response) => {
          if (response.data.status.type === "SUCCESS") {
            console.log(response, "edit partner");
            tabEvent(partyType);
          }
        },
        (error) => {
          toastr.error(error.response.data.status.description);
        }
      );
    } else {
      addPartner(obj, clickId).then(
        (response) => {
          if (response.data.status.type === "SUCCESS") {
            console.log(response, "add partner");
            tabEvent(partyType);
          }
        },
        (error) => {
          toastr.error(error.response.data.status.description);
        }
      );
    }
    closeAddModal();
  };
  const [valueActive, setIsValueActive] =useState(false);
  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    if (searchInput !== "") {
      const filteredData = partnerData.filter((item) => {
        if(item.partyName.toLowerCase().includes(searchInput.toLowerCase()) ||
            item.mobile.toLowerCase().includes(searchInput.toLowerCase()) ||
            item.partyId
              .toString()
              .toLowerCase()
              .includes(searchInput.toLowerCase())
          )
          {
            return (
              item.partyName.toLowerCase().includes(searchInput.toLowerCase()) ||
              item.mobile.toLowerCase().includes(searchInput.toLowerCase()) ||
              item.partyId
                .toString()
                .toLowerCase()
                .includes(searchInput.toLowerCase())
            );
          }
          else if(searchInput=="" || searchValue===""){
            return setIsValueActive(false);
          }
          else{
            return setIsValueActive(true);
          } 
      });
      setFilteredResults(filteredData);
    } else {
      setFilteredResults(partnerData);
    }
  };
  const tabEvent = (type) => {
    setPartyType(type);
    console.log(type);
    setAadharNumber("");
    setCityVal("");
    setNameField("");
    setOpeningBalance("");
    setmobileNumber("");
    setStateVal("");
    setShortNameField("");
    setStreetVillage("");
    setradioValue("");
    setIsEdit(false);
    setPincode();
    setCityVal("");
    setStateVal("");
    getPartnerData(clickId, type)
      .then((response) => {
        console.log(response.data, "data");
        setPartnerData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const links = [
    {
      id: 1,
      name: langFullData.seller,
      to: "FARMER",
    },
    {
      id: 2,
      name: langFullData.buyer,
      to: "BUYER",
    },
    {
      id: 3,
      name: langFullData.transporter,
      to: "TRANSPORTER",
    },
    {
      id: 4,
      name: langFullData.labor,
      to: "COOLIE",
    },
  ];
  const getPosition = () => {
    console.log("hey");
    if (navigator.geolocation) {
      console.log("heyr");
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
    console.log("hey after", position);
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
  //   $('#close_modal').on('click',function(){
  //     $('#staticBackdrop1').modal();
  // });

  $("#MybtnModal").click(function () {
    // setPincode();
    setAadharNumber("");
    setCityVal("");
    setNameField("");
    setOpeningBalance("");
    setmobileNumber("");
    setStateVal("");
    setShortNameField("");
    setStreetVillage("");
    setradioValue("");
    setIsEdit(false);
    // setPincode();
    setCityVal("");
    setStateVal("");
    setAddeditText("Add");
    console.log(isEdit, "after");
    $("#Mymodal").modal("show");
  });
  const closeAddModal = () => {
    $("#Mymodal").modal("hide");
  };
  
  return (
    <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            {links.map((link) => {
              return (
                <li key={link.id} className="nav-item ">
                  <a
                    className={"nav-link" + (partyType == link.to ? ' active' : '')}
                    href={"#" + partyType}
                    role="tab"
                    aria-controls="home"
                    data-bs-toggle="tab"
                    onClick={() => tabEvent(link.to)}
                  >
                    {link.name}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="tab-content ps-0 pt-3">
            <div
              className="tab-pane active"
              id={partyType}
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              <div className="row">
                <div className="col-lg-9 ps-0">
                  <input
                    icon="search"
                    placeholder={langFullData.search}
                    onChange={(e) => searchItems(e.target.value)}
                    className="search_text"
                  />
                  <div>
                    {searchInput.length > 1 ? (
                      filteredResults.map((partner, index) => {
                        return (
                          <div className="card partner_card" key={index}>
                            <div className="d-flex partner_card_flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <img
                                  src={single_bill}
                                  alt="img"
                                  className="user_img"
                                />
                                <div>
                                  <h5>{partner.partyName}</h5>
                                  <h6>
                                    {partner.partyType} - {partner.partyId} |{" "}
                                    {partner.mobile}
                                  </h6>
                                  <p>{partner.address.addressLine}</p>
                                </div>
                              </div>
                              <div className="d-flex edit_delete_icons">
                                <img
                                  src={edit}
                                  alt="img"
                                  className=""
                                  onClick={() => editPartner(partner)}
                                />
                                <img
                                  src={delete_icon}
                                  alt="img"
                                  onClick={() => handleShow(partner.partyId)}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : partnerData.length > 0 ? (
                      <div>
                        <div className="partner_div" id="scroll_style">
                          {partnerData.map((partner, index) => (
                            <div className="card partner_card" key={index}>
                              <div className="d-flex partner_card_flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <img
                                    src={single_bill}
                                    alt="img"
                                    className="user_img"
                                  />
                                  <div>
                                    <h5>
                                      {partner.partyName +
                                        " " +
                                        partner.shortName}
                                    </h5>
                                    <h6>
                                      {partner.partyType} - {partner.partyId} |{" "}
                                      {partner.mobile}
                                    </h6>
                                    <p>{partner.address.addressLine}</p>
                                  </div>
                                </div>
                                <div className="d-flex edit_delete_icons">
                                  <img
                                    src={edit}
                                    alt="img"
                                    className=""
                                    onClick={() => editPartner(partner)}
                                  />
                                  <img
                                    src={delete_icon}
                                    alt="img"
                                    // onClick={() =>
                                    //   handleOpenDeleteModal(partner.partyId)
                                    // }
                                    onClick={() => handleShow(partner.partyId)}
                                    // onClick={() =>
                                    //   deletePartner(partner.partyId)
                                    // }
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <NoDataAvailable />
                    )}
                  </div>
                  <div id="search-no-data" style={{display:valueActive && searchInput.length>0?"block":"none"}}><p>No Data Found</p></div>
                </div>
                <div className="col-lg-3">
                  <div className="card default_card add_partner">
                    <div>
                      <h6>
                        {" "}
                        Add{" "}
                        {partyType == langFullData.seller
                          ? "seller"
                          : partyType.toLowerCase()}
                      </h6>
                      <p>Loream iipusm text</p>

                      <button className="outline_btn" id="MybtnModal">
                        Add
                        {partyType == langFullData.seller
                          ? "seller"
                          : partyType.toLowerCase()}
                      </button>
                    </div>
                    {/* <OutlineButton text="Add Seller" /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="Mymodal">
        <div className="modal-dialog partner_modal_dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title header2_text" id="staticBackdropLabel">
                {addeditText}{" "}
                {partyType == langFullData.farmer.toUpperCase() ? langFullData.seller : partyType.toLowerCase()}
              </h5>
              <img
                src={close}
                alt="image"
                className="close_icon"
                onClick={closeAddModal}
              />
            </div>
            <div className="modal-body partner_model_body" id="scroll_style">
              <form>
                {partyType == langFullData.farmer.toUpperCase() || partyType == langFullData.buyer.toUpperCase() ? (
                  <div onChange={onChangeValue}>
                    <input
                      type="radio"
                      value={partyType.toLowerCase()}
                      name="radioValue"
                      defaultChecked={(radioValue.trim().length !== 0) ? radioValue === partyType.toLowerCase() : partyType.toLowerCase()}
                    />{" "}
                    {partyType.charAt(0).toUpperCase() + partyType.toLowerCase().slice(1)}
                    {/* {partyType.toLowerCase()} */}
                    <input
                      type="radio"
                      value={langFullData.trader}
                      name="radioValue"
                      defaultChecked={radioValue === langFullData.trader}
                      className="radioBtnVal"
                    />{" "}
                    {langFullData.trader}
                  </div>
                ) : (
                  <div></div>
                )}
                {partyType == "COOLIE" ? (
                  <div className="row">
                    <div className="col-lg-12">
                      <InputField
                        type="text"
                        value={mobileNumber}
                        label={langFullData.mobileNumber+"*"}
                        name="mobileNumber"
                        id="mobileNumber"
                        onChange={(e) => {
                          handleMobileNumber(e);
                        }}
                      />
                      <span className="text-danger">{requiredNumberField}</span>
                      <InputField
                        type="text"
                        value={nameField}
                        label={langFullData.name+"*"}
                        name="name"
                        id="inputName"
                        onChange={(e) => {
                          handleName(e);
                        }}
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
                      />
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
                <div className="row">
                  <div className="col-lg-6 pl-0">
                    {partyType == "FARMER" ||
                    partyType == "BUYER" ||
                    partyType == "TRANSPORTER" ? (
                      <div>
                        <InputField
                          type="text"
                          value={mobileNumber}
                          label={langFullData.mobileNumber+"*"}
                          name="mobileNumber"
                          id="mobileNumber"
                          onChange={(e) => {
                            handleMobileNumber(e);
                          }}
                        />

                        <span className="text-danger">
                          {requiredNumberField}
                        </span>
                        <InputField
                          type="text"
                          value={nameField}
                          label={langFullData.name+"*"}
                          name="name"
                          id="inputName"
                          onChange={(e) => {
                            handleName(e);
                          }}
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
                        />
                      </div>
                    ) : (
                      <div></div>
                    )}
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
                      />
                    ) : (
                      <div></div>
                    )}
                    {/* <LocationFetch onClick={locationFetch} /> */}
                    <label className="input_field address_text mt-0">
                      {langFullData.address}
                    </label>
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
                      </div>
                    </div>
                    <div>
                      <label htmlFor="city" className="input_field">
                        City
                      </label>
                      <div id="city-input-wrapper">
                        {isEdit ? (
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
                    {partyType != "TRANSPORTER" ? (
                      partyType != "COOLIE" ? (
                        <div>
                         <div>
                         <InputField
                            type="text"
                            value={shortNameField}
                            label={langFullData.initialsShortName+"*"}
                            name="name"
                            onChange={(e) => {
                              handleShortName(e);
                            }}
                          />
                          <span className="text-danger">{nameError}</span>
                          <span className="text-danger">
                            {requiredshortNameField}
                          </span>
                           </div>
                          <label htmlFor="pic" className="input_field">
                            {langFullData.profilePic}
                          </label>
                          <div className="file-input">
                            <div className="d-flex align-items-center">
                              <div className="input_file">
                                <img
                                  src={
                                    file
                                      ? URL.createObjectURL(file)
                                      : single_bill
                                  }
                                  alt=""
                                />
                              </div>
                              <div>
                                <input
                                  type="file"
                                  id="file"
                                  onChange={(e) => setFile(e.target.files[0])}
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
                            dateFormat="yyyy-MM-dd"
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            className="form-control"
                            placeholder="Date"
                            maxDate={new Date()}
                          />
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div></div>
                    )}

                    {partyType != "TRANSPORTER" ? (
                      <div></div>
                    ) : (
                      <div className="transpo_height"></div>
                    )}
                    <div
                      onClick={() => getPosition()}
                      className="location mt-0"
                    >
                      {langFullData.selectCurrentLocation}
                    </div>
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
                        />
                      ) : (
                        <input
                          id="state"
                          className="form-control"
                          name="state"
                        />
                      )}
                    </div>
                    <InputField
                      type="text"
                      value={streetVillage}
                      label={langFullData.streetVillage}
                      name="name"
                      onChange={(e) => {
                        handleStreetName(e);
                      }}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="primary_btn"
                onClick={() => onSubmit()}
                // id="close_modal"
                data-bs-dismiss="modal"
              >
                {langFullData.submit}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="delete_modal_dialog modal-dialog-centered"
      >
        <Modal.Header>
          <Modal.Title>Delete Partner</Modal.Title>
          <img
            src={close}
            alt="image"
            onClick={handleClose}
            className="close_icon"
          />
        </Modal.Header>
        <Modal.Body className="partner_model_body">
          {langFullData.areYouSureYouWantToDeleteThisPartnerPermanently}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="secondary_btn"
            onClick={handleClose}
          >
            {langFullData.no}
          </Button>
          <Button
            variant="primary"
            className="primary_btn"
            onClick={() => handleDelete(partyIdVal)}
          >
            {langFullData.yes}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Partner;
