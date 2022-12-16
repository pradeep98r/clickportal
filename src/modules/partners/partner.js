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
import { Modal, Button, Image } from "react-bootstrap";
import SearchField from "../../components/searchField";
import { getText } from "../../components/getText";
import { uploadProfilePic } from "../../actions/uploadProfile";
import location_icon from "../../assets/images/location_icon.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Partner = () => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const [allData, setAllData] = useState([]);
  const [partnerData, setPartnerData] = useState(allData);
  const [saveType, setSaveType] = useState("FARMER");
  const savetype = localStorage.getItem("partyType");
  const [partyType, setPartyType] = useState(
    savetype !== null ? savetype : "FARMER"
  );
  const [file, setFile] = useState("");
  const [nameError, setNameError] = useState("");
  const [shortnameError, setShortNameError] = useState("");
  const [showModal, setShow] = useState(false);
  const [partyIdVal, setPartyIdVal] = useState(0);
  const handleClose = () => setShow(false);

  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);

  const handleDelete = (partyId) => {
    //   const deletePartner = (partyId) => {
    deletePartnerId(partyId, clickId).then(
      (response) => {
        if (response.data.status.type === "SUCCESS") {
          tabEvent(partyType);
          toast.success("Partner Deleted Successfully", {
            toastId: "success1",
          });
        }
      },
      (error) => {
        toast.error(error.response.data.status.description, {
          toastId: "errorr1",
        });
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
    } else {
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
  const [radioValue, setradioValue] = useState("FARMER");

  function onChangeValue(event) {
    setradioValue(event.target.value.toUpperCase());
    console.log(event.target.value.toUpperCase(), "radio value");
  }
  const [partnerItem, setPartnerItem] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [addeditText, setAddeditText] = useState("Add");
  const editPartner = (partner) => {
    setIsEdit(true);
    partnerData.map((item) => {
      if (item.partyId == partner.partyId) {
        console.log(partner.trader);
        setPartnerItem(item);
        setAadharNumber(partner.aadharNum);
        setmobileNumber(partner.mobile);
        setStreetVillage(partner.address.addressLine);
        setShortNameField(partner.shortName);
        setNameField(partner.partyName);
        setCityVal(partner.address.dist);
        setStateVal(partner.address.state);
        setUpdateProfilePic(partner.profilePic);
        setPincode(partner.address.pincode);
        setOpeningBalance(partner.openingBal);
        if (
          partner.partyType.toLowerCase() == "farmer" ||
          partner.partyType.toLowerCase() == "buyer"
        ) {
          if (partner.trader) {
            setradioValue("TRADER");
          } else {
            setradioValue(partner.partyType.toUpperCase());
          }
        }
        setAddeditText("Edit");
        setStartDate(new Date(partner.openingBalDate));
      }
    });

    $("#Mymodal").modal("show");
  };

  const [profilePic, setProfilePic] = useState("");
  const [updateProfilePic, setUpdateProfilePic] = useState("");
  const handleProfilePic = (e) => {
    console.log(e);
    if (isEdit) {
      console.log("came to edit");
      setFile(e.target.files[0]);
      var req = {
        file: e.target.files[0],
        type: partyType,
      };
      uploadProfilePic(clickId, mobileNumber, req)
        .then((response) => {
          setUpdateProfilePic(response.data.data);
          console.log(updateProfilePic);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("came to normal");
      setFile(e.target.files[0]);
      let req = {
        file: e.target.files[0],
        type: partyType,
      };
      uploadProfilePic(clickId, mobileNumber, req)
        .then((response) => {
          setProfilePic(response.data.data);
          console.log(profilePic);
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
      pincode: pincode,
      state: stateVal,
      type: "PERSONAL",
    },
    caId: isEdit ? clickId : clickId,
    createdOn: "2022-10-03T10:55:33.895Z",
    mobile: mobileNumber,
    openingBal: openingBalance,
    openingBalDate: partnerSelectDate,
    partyId: isEdit ? partnerItem.partyId : 0,
    partyName: nameField,
    partyType: partyType,
    profilePic: isEdit ? updateProfilePic : profilePic, //single_bill,
    seqNum: 0,
    shortName: shortNameField,
    trader:
      radioValue.trim().length !== 0
        ? radioValue == "FARMER" || radioValue == "BUYER"
          ? false
          : true
        : false,
    vehicleInfo: {
      vehicleNum: "string",
      vehicleType: vehicleType,
    },
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
    console.log(aadharNumber.trim().length);
    if (handleExitPartner(mobileNumber)) {
      toast.error("Partner Already Existed", {
        toastId: "error5",
      });
    } else if (
      nameField.trim().length !== 0 &&
      nameField.trim().length !== 1 &&
      mobileNumber.trim().length !== 0 &&
      //aadharNumber.trim().length >0 ? true:false &&
      (partyType === "TRANSPORTER" || partyType == "COOLIE"
        ? true
        : shortNameField.trim().length !== 0 &&
          shortNameField.trim().length !== 1) &&
      (aadharNumber.trim().length == 0
        ? true
        : aadharNumber.trim().length < 12
        ? false
        : true)
    ) {
      addEditPartnerApiCall();
      setSaveType(partyType);
      localStorage.setItem("partyType", partyType);
      window.setTimeout(function () {
        window.location.reload();
      }, 2000);
    } else if (aadharNumber.trim().length < 12) {
      setAadharError("Minimum Adhar number length should be 12");
    } else if (nameField.trim().length === 0) {
      setRequiredNameField(langFullData.pleaseEnterFullName);
    } else if (mobileNumber.trim().length === 0) {
      setRequiredNumberField(langFullData.enterYourMobileNumber);
    } else if (shortNameField.trim().length === 0) {
      setRequiredshortNameField("Please Enter Short Name");
    } else if (nameField.trim().length === 1) {
      setNameError("Name should be min 2 characters");
    } else if (shortNameField.trim().length === 1) {
      setShortNameError("Name should be min 2 characters");
    }
    console.log("done");
  };
  const addEditPartnerApiCall = () => {
    if (isEdit) {
      console.log("ediitt", obj);
      editPartnerItem(obj).then(
        (response) => {
          if (response.data.status.type === "SUCCESS") {
            console.log(response, "edit partner");
            tabEvent(partyType);
            toast.success("Updated Successfully", {
              toastId: "success2",
            });
          }
        },
        (error) => {
          toast.error(error.response.data.status.message, {
            toastId: "errorr2",
          });
        }
      );
    } else {
      console.log("create", obj);
      addPartner(obj, clickId).then(
        (response) => {
          if (response.data.status.type === "SUCCESS") {
            tabEvent(partyType);
            toast.success(response.data.status.message, {
              toastId: "success2",
            });
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
  const tabEvent = (type) => {
    console.log(type, "type");
    setPartyType(type);
    setAadharNumber("");
    setCityVal("");
    setNameField("");
    setOpeningBalance("");
    setmobileNumber("");
    setStateVal("");
    setProfilePic("");
    setShortNameField("");
    setStreetVillage("");
    if (type.toUpperCase() === "FARMER") {
      setradioValue("FARMER");
    } else if (type.toUpperCase() === "BUYER") {
      setradioValue("BUYER");
    } else {
      setradioValue(langFullData.trader);
    }
    setIsEdit(false);
    setPincode("");
    setCityVal("");
    setStateVal("");
    setSearchValue("");
    getPartnerData(clickId, type)
      .then((response) => {
        setAllData(response.data.data);
        setPartnerData(response.data.data);
        console.log(response.data.data);
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
    console.log("pos");
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
    let pincode = address.results[0].formatted_address;

    var pincodeValue = pincode.replace(
      address.results[0].address_components[0].long_name,
      ""
    );
    pincodeValue = pincodeValue.replace(/\D/g, "");
    console.log(address, pincodeValue, "address");
    let city = address.results[5].address_components[2].short_name;
    let state = address.results[5].address_components[3].short_name;
    $("#city").val(city);
    $("#state").val(state);
    $("#zip").val(pincodeValue);
    setPincode(pincodeValue);
    setCityVal(city);
    setStateVal(state);
    // localStorage.setItem("cityValue", city);
    // var $input;
    // var $text = $(document.createElement("input"));
    // $text.attr("value", city);
    // $text.attr("type", "text");
    // $text.attr("type", "text");
    // $text.attr("class", "form-control");
    // $input = $text;
    // $("#city-input-wrapper").html($input);
    // console.log(pincodeValue, city, state);
  };
  const onZip = (event) => {
    var zip = $("#zip").val().replace(/[^\d]/g, "");
    setPincode(zip);
    setStreetVillage("");
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
    console.log(locality);
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
    console.log(parsedLocalities);
    return parsedLocalities;
  }
  function fillCityAndStateFields(localities) {
    var locality = localities[0];
    $("#city").val(locality.city);
    $("#state").val(locality.state);
    console.log(locality.city);
    var city = localities[0].city;
    setCityVal(city);
    setStateVal(locality.state);
    // var $text = $(document.createElement("input"));
    // $text.attr("value", city);
    // $text.attr("type", "text");
    // $text.attr("type", "text");
    // $text.attr("class", "form-control");
    // $input = $text;
    // $("#city-input-wrapper").html($input);
    console.log(city, locality.state);
  }

  const [rVal, setrVal] = useState(false);
  const MybtnModal = (type) => {
    // setPincode();
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
    if (type.toUpperCase() == "FARMER") {
      setradioValue("FARMER");
    } else if (type.toUpperCase() == "BUYER") {
      setradioValue("BUYER");
    } else {
      console.log(type);
      setradioValue("TRADER");
    }
    setIsEdit(false);
    // setPincode();
    setCityVal("");
    setAddeditText("Add");
    console.log(isEdit, radioValue, cityVal, "after");
    $("#Mymodal").modal("show");
  };
  var $input;
  const closeAddModal = () => {
    setPincode("");
    setAadharError("");
    setNameError("");
    setStateVal("");
    setStartDate(new Date());
    setAadharNumber("");
    setRequiredNumberField("");
    $("#Mymodal").modal("hide");
    console.log("hiding");
    $("#state").val("");
    $("#city").val("");
  };
  const getPartnerType = (item, trader) => {
    var party = item;
    switch (item) {
      case "FARMER":
        if (trader) {
          party = "TRADER";
        } else {
          party = item;
        }
        break;
      case "BUYER":
        if (trader) {
          party = "TRADER";
        } else {
          party = item;
        }
        break;
    }
    return party;
  };
  const [searchValue, setSearchValue] = useState("");
  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = allData.filter((data) => {
      if (data.mobile.includes(value)) {
        return data.mobile.search(value) != -1;
      } else if (data.partyName.toLowerCase().includes(value)) {
        return data.partyName.toLowerCase().search(value) != -1;
      } else if (data.partyId.toString().includes(value)) {
        return data.partyId.toString().search(value) != -1;
      } else if (data.shortName.toLowerCase().includes(value)) {
        return data.shortName.toLowerCase().search(value) != -1;
      }
    });
    setPartnerData(result);
    setSearchValue(value);
  };
  return (
    <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
          <ul className="nav nav-tabs partner_tabs" id="myTab" role="tablist">
            {links.map((link) => {
              return (
                <li key={link.id} className="nav-item ">
                  <a
                    className={
                      "nav-link" + (partyType == link.to ? " active" : "")
                    }
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
                <div className="col-lg-9 pl-0">
                  <SearchField
                    placeholder="Search by Name / Mobile / Short Code / Party id"
                    val={searchValue}
                    onChange={(event) => {
                      handleSearch(event);
                    }}
                  />

                  <div>
                    {partnerData.length > 0 ? (
                      <div>
                        <div className="partner_div" id="scroll_style">
                          {partnerData.map((partner, index) => (
                            <div className="card partner_card" key={index}>
                              <div className="d-flex partner_card_flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  
                                  {partner.profilePic ? (
                                    <img
                                      src={partner.profilePic}
                                      alt="profile_img"
                                      className="user_img"
                                    />
                                  ) : (
                                    <img
                                      src={single_bill}
                                      alt="img"
                                      className="user_img"
                                    />
                                  )}
                                  <div>
                                    <h5>
                                      {partner.partyName +
                                        " " +
                                        partner.shortName}
                                    </h5>
                                    <h6>
                                      {getPartnerType(
                                        partner.partyType,
                                        partner.trader
                                      )}{" "}
                                      - {partner.partyId} | {partner.mobile}
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
                          ))}
                        </div>
                      </div>
                    ) : (
                      <NoDataAvailable />
                    )}
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="card default_card add_partner">
                    <div>
                      <h6>
                        {" "}
                        Add{" "}
                        {partyType.toLowerCase() == "farmer"
                          ? "Seller"
                          : getText(partyType)}
                      </h6>
                      <button
                        className="outline_btn mr-2"
                        onClick={() => MybtnModal(partyType)}
                      >
                        Add
                        {partyType == langFullData.seller
                          ? "seller"
                          : " " + getText(partyType)}
                      </button>
                      {partyType.toLowerCase() == "farmer" ||
                      partyType.toLowerCase() == "buyer" ? (
                        <button
                          className="outline_btn mt-3"
                          onClick={() => MybtnModal("trader")}
                        >
                          Add Trader
                        </button>
                      ) : (
                        ""
                      )}
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
                {partyType == langFullData.farmer.toUpperCase()
                  ? langFullData.seller
                  : getText(partyType)}
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
                          //className="custom-control-input"
                          value={partyType.toLowerCase()}
                          name="radioValue"
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
                          name="radioValue"
                          checked={radioValue.toLowerCase() === "trader"}
                          //className="custom-control-input"
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
                        <span className="text-danger">
                          {requiredNumberField}
                        </span>
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
                            />
                          ) : (
                            <input
                              id="state"
                              className="form-control"
                              name="state"
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
                                />
                              </div>
                            ) : (
                              <InputField
                                type="text"
                                id="city"
                                name="city"
                                value={cityVal}
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

                        <span className="text-danger">
                          {requiredNumberField}
                        </span>
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
                              <span className="text-danger">
                                {shortnameError}
                              </span>
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
                          <span className="text-danger">
                            {requiredNameField}
                          </span>
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
                                        // src={
                                        //   file
                                        //     ? URL.createObjectURL(file)
                                        //     : single_bill
                                        // }
                                        alt=""
                                      />
                                    ) : (
                                      <img
                                        src={
                                          profilePic ? profilePic : single_bill
                                        }
                                        // src={
                                        //   file
                                        //     ? URL.createObjectURL(file)
                                        //     : single_bill
                                        // }
                                        alt=""
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <input
                                      type="file"
                                      id="file"
                                      //onChange={(e) => setFile(e.target.files[0])}
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
                                  onKeyDown={(e) => {
                                    e.preventDefault();
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
                            />
                          ) : (
                            <input
                              id="state"
                              className="form-control"
                              name="state"
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
                                />
                              </div>
                            ) : (
                              <InputField
                                type="text"
                                id="city"
                                name="city"
                                value={cityVal}
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
              </form>
            </div>
            <div className="modal-footer p-0">
              <button
                type="button"
                className="primary_btn"
                onClick={() => onSubmit()}
                // id="close_modal"
                data-bs-dismiss="modal"
              >
                save
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
            className="secondary_btn mr-2"
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
      <ToastContainer />
    </div>
  );
};

export default Partner;
