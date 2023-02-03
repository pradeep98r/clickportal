import { Modal } from "react-bootstrap";
import "../smartboard/smartboard.scss";
import "../smartboard/completeprofile.scss";
import close from "../../assets/images/close.svg";
import single_bill from "../../assets/images/bills/single_bill.svg";
import location_icon from "../../assets/images/location_icon.svg";
import drop_down_btn from "../../assets/images/dropdown.svg";
import InputField from "../../components/inputField";
import { useState, useEffect } from "react";
import toastr from "toastr";
import { completeMandiSetup, editMandiSetup } from "../../actions/loginService";
import $ from "jquery";
import { useSelector } from "react-redux";
import { getAllMarkets } from "../../actions/loginService";
import search_img from "../../assets/images/search.svg";
import markets from "../../assets/images/mandi.svg";
import { Fragment } from "react";
import SearchField from "../../components/searchField";
import NoDataAvailable from "../../components/noDataAvailable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CompleteProfile = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const mandiEditStatus = localStorage.getItem("mandiEditStatus");
  const data = localStorage.getItem("mandiEditDetails");
  const mandiData = JSON.parse(data);
  const [allData, setAllData] = useState([]);
  const [allMarketsData, setAllMarketsData] = useState(allData);
  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);
  useEffect(() => {
    getAllMarkets().then(
      (response) => {
        if (response.data.status.type === "SUCCESS") {
          setAllData(response.data.data);
          setAllMarketsData(response.data.data);
        }
      },
      (error) => {}
    );
  }, []);
  // mandi name
  const [mandiNameField, setMandiNameField] = useState(
    mandiEditStatus === "true" ? mandiData.businessName : ""
  );
  const [mandiNameError, setMandiNameError] = useState("");
  const handleMandiName = (e) => {
    e.preventDefault();
    setMandiNameField(e.target.value);
    commonValidation(e, "mandiname");
  };
  //   mandi type
  const [mandiTypeField, setMandiTypeField] = useState(
    mandiEditStatus == "true" ? mandiData.businessType : ""
  );
  const [mandiTypeError, setMandiTypeError] = useState("");
  const handleMandiType = (e) => {
    setMandiTypeField(e.target.value);
    commonValidation(e, "manditype");
  };
  //   mandi short code
  const [mandiShortCode, setMandiShortCode] = useState(
    mandiEditStatus == "true" ? mandiData.shortCode : ""
  );
  const [mandiShortCodeError, setMandiShortCodeError] = useState("");
  const handleMandiShortCode = (e) => {
    setMandiShortCode(e.target.value.replace(/[^A-Za-z0-9]/g, " "));
    shortCodeValidation(e);
  };
  const shortCodeValidation = (e) => {
    if (e.target.value.length > 4) {
      setMandiShortCodeError(
        "Mandi short code can not be more than 4 characters"
      );
    } else {
      setMandiShortCodeError("");
    }
  };
  //   shop number
  const [shopNumberField, setShopNumberField] = useState(
    mandiEditStatus == "true" ? mandiData.shopNum : ""
  );
  const [shopNumberError, setShopNumberError] = useState("");
  const handleShopNumber = (e) => {
    setShopNumberField(e.target.value);
    shopNumberValidation(e);
  };
  const shopNumberValidation = (e) => {
    if (e.target.value.length < 1) {
      setShopNumberError("Shop number must be atleast one digit");
    } else if (e.target.value.length >= 7) {
      setShopNumberError("Shop number can't be more than 7 digits");
    } else {
      setShopNumberError("");
    }
  };
  //   contact name
  const [contactName, setContactName] = useState(
    mandiEditStatus == "true" ? mandiData.contactName : ""
  );
  const [contactNameError, setContactNameError] = useState("");
  const handleContactName = (e) => {
    setContactName(e.target.value.replace(/[^A-Za-z0-9]/g, " "));
    commonValidation(e, "contactname");
  };
  //   mobile number
  const [mobileNumber, setmobileNumber] = useState(
    mandiEditStatus == "true" ? mandiData.mobile : ""
  );
  const [marketname, setMarketName] = useState(
    mandiEditStatus === "true" ? mandiData.marketName : ""
  );
  const [requiredNumberField, setRequiredNumberField] = useState("");
  const handleMobileNumber = (e) => {
    mobileNumberValidation(e, "mobile");
  };
  const [alternateMobileNumber, setAlternateMobileNumber] = useState(
    mandiEditStatus == "true" ? mandiData.altMobile : ""
  );
  const [alternateMobileNumberError, setAlternateMobileNumberError] =
    useState("");
  const handleAlternateMobileNumber = (e) => {
    mobileNumberValidation(e, "alternateMobile");
  };
  const [pincode, setPincode] = useState(
    mandiEditStatus == "true" ? mandiData.businessAddress.pincode : ""
  );
  const [cityVal, setCityVal] = useState(
    mandiEditStatus == "true" ? mandiData.businessAddress.dist : ""
  );
  const [stateVal, setStateVal] = useState(
    mandiEditStatus == "true" ? mandiData.businessAddress.state : ""
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
      // else if(e.target.val)
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
    mandiEditStatus == "true" ? mandiData.businessAddress.addressLine : ""
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
  const [pincodeError, setPincodeError] = useState("");
  const [cityValError, setCityValError] = useState("");
  const [stateValError, setStateValError] = useState("");
  const onSubmit = () => {
    if (
      mandiNameField.trim().length !== 0 &&
      mobileNumber.trim().length !== 0 &&
      !(mobileNumber.trim().length<10) &&
      mandiShortCode.trim().length !== 0 &&
      mandiShortCode.trim().length <= 4 &&
      shopNumberField.trim().length !== 0 &&
      contactName.trim().length !== 0 &&
      !(contactName.trim().length<2) &&
      !(mandiTypeField.trim().length<2) &&
      !(mandiNameField.trim().length<2) &&
      marketname.trim().length !== 0 &&
      pincode.toString().trim().length !== 0 &&
      cityVal.trim().length !== 0 &&
      stateVal.trim().length !== 0 &&
      streetVillage.trim().length !== 0
    ) {
      addEditMandiSetupApiCall();
      
    } else if (mandiNameField.trim().length === 0) {
      setMandiNameError("Please Enter Name");
    } else if (mandiShortCode.trim().length === 0) {
      setMandiShortCodeError("Please Enter Short Code");
    } else if (shopNumberField.trim().length === 0) {
      setShopNumberError("Please Enter Shop Number");
    } else if (mobileNumber.trim().length === 0) {
      setRequiredNumberField("Please Enter Mobile Number");
    } else if (contactName.trim().length === 0) {
      setContactNameError("Please Enter Contact Name");
    } else if (pincode.toString().trim().length === 0) {
      setPincodeError("Please enter pincode");
    } else if (cityVal.trim().length === 0) {
      setCityValError("Please enter city/dist");
    } else if (stateVal.trim().length === 0) {
      setStateValError("Please enter state");
    } else if (streetVillage.trim().length === 0) {
      setStreetvillageError("Please enter street or village");
    }
  };
  const obj = {
    altMobile: alternateMobileNumber,
    //mandiEditStatus == "true" ? mandiData.altMobile : alternateMobileNumber,
    businessAddress: {
      addressLine: streetVillage,
      city: cityVal,
      dist: cityVal,
      pincode: pincode,
      state: stateVal,
      type: "BUSINESS",
    },
    businessId: mandiEditStatus == "true" ? mandiData.businessId : 0,
    businessName: mandiNameField,
    businessType: mandiTypeField,
    contactName: contactName,
    imageUrl: "string",
    //marketId: (mandiEditStatus == 'true') ? mandiData.marketId : selectMarketId,
    mobile: mobileNumber,
    otherMarket: marketname ? marketname : "", //"string",
    shopNum: shopNumberField,
    shortCode: mandiShortCode,
  };
  const addEditMandiSetupApiCall = () => {
    if (mandiEditStatus == "true") {
      editMandiSetup(obj, clickId).then(
        (response) => {
          if (response.data.status.type === "SUCCESS") {
            toast.success("Mandi Details Updated Successfully", {
              toastId: "success",
            });
            localStorage.setItem("submitStatus", true);
            props.close();
            window.setTimeout(function () {
              window.location.reload();
            }, 2000);
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
            setMandiNameField(mandiNameField);
            localStorage.setItem(
              "businessCreatedStatus",
              response.data.status.message
            );
            props.close();
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
    setStreetVillage("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, posError);
    } else {
      alert("Sorry, Geolocation is not supported by this browser.");
      // Alert is browser does not support geolocation
    }
    setPincodeError("");
    setCityValError("");
    setStateValError("");
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
    var pincodeValue;
    // let pincode = address.results[0].formatted_address;
    for(var i=0; i<address.results[0].address_components.length; i++){
      if(address.results[0].address_components[i].types[0] == 'postal_code'){
        pincodeValue = address.results[0].address_components[i].long_name
      }
    }
    // var pincodeValue = pincode.replace(
    //   address.results[0].address_components[0].long_name,
    //   ""
    // );
    pincodeValue = pincodeValue.replace(/\D/g, "");
    let city = address.results[5].address_components[2].short_name;
    let state = address.results[5].address_components[3].short_name;
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
    }  else{
      $("#city").val('');
      $("#state").val('');
      setCityVal('');
      setStateVal('');
    }
    setPincodeError("");
    setCityValError("");
    setStateValError("");
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
    setSelectedOption(e.target.value);
    allMarketsData.map((item) => {
      if (item.marketName === e.target.value) {
        setSelectedMarketId(item.marketId);
      }
    });
  };
  const openMarketNamePopUpModal = () => {
    $("#marketNamePopUpModal").modal("show");
  };
  const closePopup = () => {
    setSearchValue('')
    setAllMarketsData(allData);
    $("#marketNamePopUpModal").modal("hide");
  };

  const openOtheModalPopUp = () => {
    $("#otherModalPopUp").modal("show");
  };
  const closeOtheModalPopUp = () => {
    $("#otherModalPopUp").modal("hide");
  };
  const handleMarketName = () => {
    openMarketNamePopUpModal();
  };
  // const [search, setSearch] = useState("");
  const [marketName, setMarketname] = useState([]);
  const searchMarketName = (searchValue) => {
    // setSearch(searchValue);
    if (search !== "") {
      const filteredNames = allMarketsData.filter((item) => {
        if (item.marketName.toLowerCase().includes(search.toLowerCase())) {
          return item.marketName.toLowerCase().includes(search.toLowerCase());
        }
      });
      setMarketname(filteredNames);
    } else {
      setMarketname(allMarketsData);
    }
  };
  const [search, setSearchValue] = useState("");
  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = allData.filter((data) => {
      if (data.marketName.toLowerCase().includes(value)) {
        return data.marketName.toLowerCase().search(value) != -1;
      } 
    });
    setAllMarketsData(result);
    setSearchValue(value)
  };

  const handleOtherName = () => {
    openOtheModalPopUp();
    setMarketName(marketname);
  };
  const handleMarketSelection = (name) => {
    if (name.toLowerCase().includes("other")) {
      //openOtheModalPopUp();
      //setMarketName(marketname)
      handleOtherName();
    } else {
      setMarketName(name);
      closePopup();
    }
  };
  const handleOtherMarketName = (e) => {
    setMarketname(e.target.value);
    closeOtheModalPopUp();
    closePopup();
  };
  return (
    <Modal show={props.show} close={props.close} className="modal_popup">
      
      <div className="modal-body partner_model_body profileModal" id="">
        <form>
          <div className="d-flex justify-content-between all_popup_header">
          <h5 className="modal-title header2_text" id="staticBackdropLabel">
          {langFullData.businessDetails}
        </h5>
        <img
          src={close}
          alt="image"
          className="close_icon"
          onClick={props.close}
        />
          </div>
          <div className="partner_model_scroll" id="scroll_style">
          <div className="row">
            <div className="col-lg-6 pl-0">
              <label htmlFor="zip" className="input_field">
                {langFullData.marketName}
                <span className="star-color">*</span>
                <img
                  src={drop_down_btn}
                  alt="dropdown"
                  className="drop-down-image"
                />
              </label>
              <input
                className="form-control marketfrom"
                value={marketname ? marketname : langFullData.selectMarketName}
                onClick={handleMarketName}
              />
            </div>
            <div className="col-lg-6">
              <InputField
                type="text"
                value={mandiNameField}
                label={langFullData.businessName}
                name="mandiName"
                id="mandiName"
                onChange={(e) => {
                  handleMandiName(e);
                }}
                starRequired={true}
              />
              <span className="text-danger">{mandiNameError}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 pl-0">
              <InputField
                type="text"
                value={mandiTypeField}
                label={langFullData.businessType}
                name="mandiType"
                id="mandiType"
                onChange={(e) => {
                  handleMandiType(e);
                }}
                starRequired={false}
              />
              <span className="text-danger">{mandiTypeError}</span>
            </div>
            <div className="col-lg-6">
              <InputField
                type="text"
                value={mandiShortCode}
                label="Mandi Short Code"
                name="mandiShortCode"
                id="mandiShortCode"
                onChange={(e) => {
                  handleMandiShortCode(e);
                }}
                starRequired={true}
              />
              <span className="text-danger">{mandiShortCodeError}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 pl-0">
              <InputField
                type="text"
                value={shopNumberField}
                label={langFullData.shopNumber}
                name="shopNumber"
                id="shopNumber"
                onChange={(e) => {
                  handleShopNumber(e);
                }}
                starRequired={true}
              />
              <span className="text-danger">{shopNumberError}</span>
            </div>
            <div className="col-lg-6">
              <InputField
                type="text"
                value={contactName}
                label={langFullData.contactName}
                name="contactName"
                id="contactName"
                onChange={(e) => {
                  handleContactName(e);
                }}
                starRequired={true}
              />
              <span className="text-danger">{contactNameError}</span>
            </div>
          </div>
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
              <div>
                <span className="text-danger">{requiredNumberField}</span>
              </div>
            </div>
            <div className="col-lg-6">
              <InputField
                type="text"
                value={alternateMobileNumber}
                label={langFullData.alternativeMobile}
                name="alternativeMobile"
                id="alternativeMobile"
                onChange={(e) => {
                  handleAlternateMobileNumber(e);
                }}
                starRequired={false}
              />
              <span className="text-danger">{alternateMobileNumberError}</span>
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
              <div onClick={() => getPosition()} className="d-flex location mt-0">
              <img src={location_icon} alt="" className="mr-2" />
                {langFullData.selectCurrentLocation}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 pl-0">
              <div>
                <label htmlFor="zip" className="input_field">
                  {langFullData.pincode}<span className="star-color">*</span>
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
              </div>{" "}
              <span className="text-danger">{pincodeError}</span>
            </div>
            <div className="col-lg-6">
              {" "}
              <div>
                <label htmlFor="state" className="input_field">
                  {langFullData.state}<span className="star-color">*</span>
                </label>
                {mandiEditStatus == "true" ? (
                  <input
                    id="state"
                    className="form-control"
                    name="state"
                    value={stateVal}
                    onChange = {(e)=>setStateVal(e.target.value.replace(/[^A-Za-z0-9]/g, " "))}
                  />
                ) : (
                  <input id="state" className="form-control" name="state" />
                )}
              </div>{" "}
              <span className="text-danger">{stateValError}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 pl-0">
              {" "}
              <div>
                <label htmlFor="city" className="input_field">
                  District<span className="star-color">*</span>
                </label>
                <div id="city-input-wrapper">
                  {mandiEditStatus == "true" ? (
                    <div>
                      <InputField
                        type="text"
                        id="city"
                        name="city"
                        value={cityVal}
                        starRequired={true}
                        onChange ={(e) =>{setCityVal(e.target.value.replace(/[^A-Za-z0-9]/g, " "))}}
                      />
                    </div>
                  ) : (
                    <InputField type="text" id="city" name="city"  starRequired={true}/>
                  )}
                </div>
              </div>
              <span className="text-danger">{cityValError}</span>{" "}
            </div>
            <div className="col-lg-6">
              <InputField
                type="text"
                value={streetVillage}
                label={langFullData.streetVillage}
                name="name"
                onChange={(e) => {
                  handleStreetName(e);
                }}
                starRequired={true}
              />
              <span className="text-danger">{streetvillageError}</span>
            </div>
          </div>

          <div className="row">
            <span className="pl-3 note_text">
              {
                langFullData.pleaseKeepCorrectBusinessAddressAsThisAddressIsDisplayed
              }
            </span>
          </div>
          </div>
        </form>
      </div>
      <div className="modal-footer modal_common_footer">
              <div className="row">
                <div className="col-lg-6 pl-0">
                 
                </div>
                <div className="col-lg-6">
                 <div className="d-flex justify-content-end">
                 <button
                    type="button"
                    className="secondary_btn"
                    data-bs-dismiss="modal"
                    onClick={props.close}
                  >
                    Cancel
                  </button>
                <button
          type="button"
          className="primary_btn"
          onClick={() => onSubmit()}
        >
          UPDATE
        </button>
                 </div>
                </div>
              </div>
            </div>
      
      <div className="modal fade profileModal" id="marketNamePopUpModal">
        <div className="modal-dialog  markets_name_popup">
          <div className="modal-content" id="market-modal-content">
            
            <div className="row">
            <div className="modal-body markets_name_modal_mody profileModal markets_name_modal" id="scroll_style">
              <div className="col-lg-8" id="market-div">
               <div className="d-flex align-items-center justify-content-between">
               <h5 className="modal-title header2_text" id="mk-header">
                    Select Market
                </h5>
                <img
                src={close}
                alt="image"
                className="close_icon"
                onClick={closePopup}
              />
               </div>
                <SearchField
                    placeholder="Search By Name"
                    // {langFullData.searchByNameShortCode}
                    val={search}
                    onChange={(event) => {
                      handleSearch(event);
                    }}
                  />
                  {allMarketsData.length > 0 ? <div className="market-names" id="scroll_style">
                  {allMarketsData.map((item, index) => {
                    if (index === allMarketsData.length - 1)
                      return (
                        <div>
                        {search.length == 0 || search.toUpperCase =='OTHER'? 
                        <div
                          id="mk-other-name"
                          onClick={(e) => {
                            handleOtherName(e);
                          }}
                        >
                          <div className="d-flex" id="ot-m-img">
                            <img src={markets} alt="markets" />
                            <p id="mk-other-Name">{item.marketName}</p>
                          </div>
                        </div>
                        :''}
                        </div>
                      );
                  })}
                  {
                  // search.length > 1 && marketName.length > 0
                  //   ? marketName.map((item) => {
                  //       return (
                  //         <div
                  //           id="mk-name"
                  //           onClick={(name) => {
                  //             handleMarketSelection(item.marketName);
                  //           }}
                  //         >
                  //           <div className="d-flex">
                  //             <img src={markets} alt="markets" />
                  //             <p key={item.id} id="mk-Name">
                  //               {item.marketName}
                  //             </p>
                  //           </div>
                  //           <span id="hr-lines"></span>
                  //         </div>
                  //       );
                  //     })
                  //   : 
                    allMarketsData.map((item) => {
                        return (
                            <div
                              id="mk-name"
                              onClick={(name) => {
                                handleMarketSelection(item.marketName);
                              }}
                            >
                              <div className="d-flex">
                                <img src={markets} alt="markets" />
                                <p key={item.id} id="mk-Name">
                                  {item.marketName}
                                </p>
                              </div>

                              <span id="hr-lines"></span>
                            </div>
                        );
                      })}
                </div>: <NoDataAvailable />}
                
              </div>
            </div>
           
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade profileModal" id="otherModalPopUp">
        <div className="modal-dialog  market_name_popup">
          <div className="modal-content" id="other-modal-content">
            
            <div className="modal-body market_name_modal_mody px-0 profileModal others_name_modal" id="scroll_style">
           <div className="container">
             <div className="d-flex justify-content-between align-items-center mb-2">
             <h5 className="modal-title header2_text pl-0" id="mk-header">
                Select Market
              </h5>
              <img
                src={close}
                alt="image"
                className="close_icon othermarkerClose"
                onClick={closeOtheModalPopUp}
              />
             </div>
           <div className="row">
              <div className="col-lg-12 p-0" id="market-div">
               <div>
               <div id="search-mk-field">
                  <form className="d-flex">
                    <input
                      className="form-control me-2 searchbar-input"
                      id="searchbar-mk"
                      type="text"
                      value={"OTHER"}
                      onChange={(e) => {
                        searchMarketName(e.target.value);
                      }}
                    />
                  </form>
                </div>
                <div id="search-mk-field">
                  <InputField
                    type="text"
                    //value={mandiTypeField}
                    label={langFullData.marketName}
                    name="marketName"
                    id="marketName"
                    onChange={(e) => {
                      setMarketName(e.target.value);
                    }}
                    starRequired={true}
                  />
                </div>
              </div>
               </div>
              </div>
           </div>
            </div>
            <div className="modal-footer p-0">
              <button
                type="button"
                className="primary_btn cont_btn w-100 m-0"
                onClick={(e) => {
                  handleOtherMarketName(e);
                }}
              >
                {langFullData.continue_}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </Modal>
  );
};
export default CompleteProfile;
