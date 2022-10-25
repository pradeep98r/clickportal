import { Component, useState, useEffect } from "react";
import Navigation from "../../components/navigation";
import { Link, Navigate, useNavigate } from "react-router-dom";
import OutlineButton from "../../components/outlineButton";
import "../partners/partner.scss";
import { getPartnerData, addPartner } from "../../actions/billCreationService";
import $ from "jquery";
import single_bill from "../../assets/images/bills/single_bill.svg";
import edit from "../../assets/images/edit_round.svg";
import delete_icon from "../../assets/images/delete.svg";
import close from "../../assets/images/close.svg";
import NoDataAvailable from "../../components/noDataAvailable";
import InputField from "../../components/inputField";
import toastr from "toastr";
const Partner = () => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const [partnerData, setPartnerData] = useState([]);
  const [partyType, setPartyType] = useState("");
  const [linkType, setLinksType] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const cityValue = localStorage.getItem("cityValue");
  const [file, setFile] = useState("");
  console.log(cityValue);
  const [nameError, setNameError] = useState("");
  useEffect(() => {
    tabEvent();
    setLinksType(links);
  }, []);
  const [mobileNumber, setmobileNumber] = useState("0");
  const handleMobileNumber = (e) => {
    let onlyNumbers = e.target.value.replace(/[^\d]/g, "");
    let number = onlyNumbers.slice(0, 10);
    setmobileNumber(number);
  };
  const [aadharNumber, setAadharNumber] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const handleNumber = (e) => {
    let onlyNumbers = e.target.value.replace(/[^\d]/g, "");
    setAadharNumber(onlyNumbers);
  };
  const handleOpeninngBal = (e) => {
    let onlyNumbers = e.target.value.replace(/[^\d]/g, "");
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
    setVehicleType(e.target.value.replace(/[^A-Za-z0-9]/g, ""));
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
      addressLine: "apps",
      city: "ap",
      dist: "string",
      pincode: 535580,
      state: "ap",
      type: "",
    },
    caId: 0,
    createdOn: "2022-10-03T10:55:33.895Z",
    mobile: mobileNumber,
    openingBal: openingBalance,
    openingBalDate: "",
    partyId: 0,
    partyName: nameField,
    partyType: partyType,
    profilePic: "string",
    seqNum: 0,
    shortName: shortNameField,
    trader: true,
    vehicleInfo: {
      vehicleNum: "string",
      vehicleType: "string",
    },
  };
  const onSubmit = () => {
    if (obj.mobile != 0 && obj.name) {
      addPartner(obj, clickId).then(
        (response) => {
          if (response.data.status.type === "SUCCESS") {
            console.log(response, "add partner");
          }
        },
        (error) => {
          toastr.error(error.response.data.status.description);
        }
      );
    } else {
      alert("fields requirde");
    }
  };
  const locationFetch = () => {
    console.log(cityValue);
  };
  const tabEvent = (type) => {
    setPartyType(type);
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
      name: "Seller",
      to: "FARMER",
    },
    {
      id: 2,
      name: "Buyer",
      to: "BUYER",
    },
    {
      id: 3,
      name: "Transporter",
      to: "TRANSPORTER",
    },
    {
      id: 4,
      name: "Coolie",
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
    let postal = address.results[5].address_components[0].short_name;
    $("#city").val(city);
    $("#state").val(state);
    $("#zip").val(pincodeValue);
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
            if (types[k] == "locality") {
              locality.city = result.address_components[j].long_name;
            } else if (types[k] == "administrative_area_level_1") {
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
    console.log(city);
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
  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);
  return (
    <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            {links.map((link) => {
              return (
                <li key={link.id} className="nav-item active">
                  <a
                    className="nav-link"
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
                  {partnerData.length > 0 ? (
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
                                  <h5>{partner.partyName}</h5>
                                  <h6>
                                    {partner.partyType} - {partner.partyId} |{" "}
                                    {partner.mobile}
                                  </h6>
                                  <p>{partner.address.addressLine}</p>
                                </div>
                              </div>
                              <div className="d-flex edit_delete_icons">
                                <img src={edit} alt="img" className="" />
                                <img src={delete_icon} alt="img" />
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
                <div className="col-lg-3">
                  <div className="card default_card add_partner">
                    <div>
                      <h6>
                        {" "}
                        Add{" "}
                        {partyType == "FARMER"
                          ? "seller"
                          : partyType.toLowerCase()}
                      </h6>
                      <p>Loream iipusm text</p>

                      <button className="outline_btn" id="MybtnModal">
                        Add
                        {partyType == "FARMER"
                          ? "seller"
                          : partyType.toLowerCase()}
                      </button>
                    </div>
                    <OutlineButton text="Add Seller" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="staticBackdrop1"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog partner_modal_dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title header2_text" id="staticBackdropLabel">
                Add {partyType}
              </h5>
              <img
                src={close}
                alt="image"
                className="close_icon"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="modal-body partner_model_body" id="scroll_style">
              <form>
                <div className="row">
                  <div className="col-lg-6">
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
                    <InputField
                      type="text"
                      value={nameField}
                      label="Name*"
                      name="name"
                      id="inputName"
                      onChange={(e) => {
                        handleName(e);
                      }}
                    />
                    <span className="text-danger">{nameError}</span>
                    <InputField
                      type="text"
                      value={aadharNumber}
                      label="Aadhar"
                      name="name"
                      onChange={(e) => {
                        handleNumber(e);
                      }}
                    />

                    <InputField
                      type="text"
                      value={openingBalance}
                      label="Opening Balance"
                      name="name"
                      onChange={(e) => {
                        handleOpeninngBal(e);
                      }}
                    />
                    {/* <LocationFetch onClick={locationFetch} /> */}
                    <label className="input_field address_text mt-0">
                        Address
                      </label>
                    <div>
                      <label htmlFor="zip" className="input_field">
                        Pincode
                      </label>
                      <input
                        id="zip"
                        className="form-control"
                        type="text"
                        label="pincode"
                        name="zip"
                        onChange={(e) => {
                          onZip(e);
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="input_field">
                        City
                      </label>
                      <div id="city-input-wrapper">
                        <InputField type="text" id="city" name="city" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <InputField
                      type="text"
                      value={shortNameField}
                      label="Initials (Short Name)*"
                      name="name"
                      onChange={(e) => {
                        handleShortName(e);
                      }}
                    />
                    <span className="text-danger">{nameError}</span>
                    <label htmlFor="pic" className="input_field">
                      Profile Pic
                    </label>
                    <div class="file-input">
                      <div className="d-flex align-items-center">
                        <div className="input_file">
                          <img
                            src={file ? URL.createObjectURL(file) : single_bill}
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
                            Choose from library
                          </label>
                        </div>
                      </div>
                    </div>
                    <InputField
                      type="text"
                      value={shortNameField}
                      label="As on Date"
                      name="name"
                      onChange={(e) => {
                        handleShortName(e);
                      }}
                    />
                    <div onClick={() => getPosition()} className="location">
                      Select Current Location
                    </div>
                    <div>
                      <label htmlFor="state" className="input_field">
                        State
                      </label>
                      <input id="state" className="form-control" name="state" />
                    </div>
                    <InputField
                      type="text"
                      value={shortNameField}
                      label="Street & Village"
                      name="name"
                      onChange={(e) => {
                        handleShortName(e);
                      }}
                    />
                    {/* <div>
                      <h1>Upload and Display Image usign React Hook's</h1>
                      {selectedImage && (
                        <div>
                          <img
                            alt="not fount"
                            width={"250px"}
                            src={URL.createObjectURL(selectedImage)}
                          />
                          <br />
                          <button onClick={() => setSelectedImage(null)}>
                            Remove
                          </button>
                        </div>
                      )}
                      <br />

                      <br />
                      <input
                        type="file"
                        name="myImage"
                        onChange={(event) => {
                          console.log(event.target.files[0]);
                          setSelectedImage(event.target.files[0]);
                        }}
                      />
                    </div> */}
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="secondary_btn"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary_btn"
                onClick={() => onSubmit()}
                data-bs-dismiss="modal"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partner;
