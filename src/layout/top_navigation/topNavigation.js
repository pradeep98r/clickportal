import bell from "../../assets/images/navbar/Bell.svg";
import help from "../../assets/images/navbar/Help.svg";
import leftClick from "../../assets/images/left_click.png";
import "./topNavigation.scss";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../reducers/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import caImage from "../../assets/images/ca_img.svg"
import { getProfile } from "../../actions/profileService"

function TopNavigation() {
  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);

  const linkValue = localStorage.getItem("LinkId");
  var linkPath = localStorage.getItem("LinkPath");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginUserDetails = JSON.parse(localStorage.getItem("loginResponse"));
  const [profileData, setProfileData] = useState(null);
  // const getProfileDetails = () => {
   
  // };
  useEffect(() => {
    getProfile(loginUserDetails.caId)
      .then((response) => {
        setProfileData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const logOutFunction = () => {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
        alert("hii");
      });
    });
    localStorage.setItem("isauth", false);
    dispatch(authActions.logout(false));
    navigate("/login");
    window.location.reload();
    localStorage.removeItem("loginResponse");
    localStorage.removeItem("userType");
    localStorage.removeItem("LinkPath");
    localStorage.removeItem("languageData");
    localStorage.setItem("LinkPath", "/smartboard");
    localStorage.setItem("statusPlan", "FAILURE");
    localStorage.setItem("LinkId", "1");
    localStorage.removeItem("businessCreatedStatus");
  };
  const singleBill = JSON.parse(localStorage.getItem("billData"));

  var billStatus = JSON.parse(localStorage.getItem("billViewStatus"));
  var stepone = JSON.parse(localStorage.getItem("stepOne"));
  var stepOneSingleBill = JSON.parse(localStorage.getItem("stepOneSingleBook"));
  const backToBuyBillBook = () => {
    localStorage.setItem("billViewStatus", false);
    localStorage.setItem("stepOne", false);
    navigate("/buy_bill_book");
  };
  const backToSellBillBook = () => {
    localStorage.setItem("billViewStatus", false);
    localStorage.setItem("stepOneSingleBook", false);
    navigate("/sellbillbook");
  };
  const profileClick = () =>{
    localStorage.setItem("LinkPath","/myprofile");
    localStorage.setItem("LinkId",8)
    navigate("/myprofile");
    window.location.reload();
  }
  return (
    <nav className="navbar navbar-expand-lg bg_white main_nav">
      <div className="container-fluid">
        <div className="page_header">
          <h2>
            {/* {(linkValue == 1 || linkPath == "/smartboard") && "Smartboard"} */}
            {linkValue == 1 && langFullData.smartBoard}
            {linkValue == 2 && "Smartchart"}
            {linkValue == 3 &&
              "Sell Bill Book" &&
              (billStatus === true ? (
                <div className="d-flex">
                  <img
                    src={leftClick}
                    alt="left_click_img"
                    onClick={backToSellBillBook}
                    id="left_click_img"
                  />
                  <p id="bill_id">Bill ID : {singleBill.billId}</p>
                </div>
              ) : stepOneSingleBill === true ? (
                <div className="d-flex">
                  <img
                    src={leftClick}
                    alt="left_click_img"
                    onClick={backToSellBillBook}
                    id="left_click_img"
                  />
                  <p id="bill_id">Add Sell Bill</p>
                </div>
              ) : (
                langFullData.salesBillBook
              ))}
            {linkPath == "/buy_bill_book" &&
              (billStatus === true ? (
                <div className="d-flex">
                  <img
                    src={leftClick}
                    alt="left_click_img"
                    onClick={backToBuyBillBook}
                    id="left_click_img"
                  />
                  <p id="bill_id">Bill ID : {singleBill.billId}</p>
                </div>
              ) : stepone === true ? (
                <div className="d-flex">
                  <img
                    src={leftClick}
                    alt="left_click_img"
                    onClick={backToBuyBillBook}
                    id="left_click_img"
                  />
                  <p id="bill_id">Add Purchase Bill</p>
                </div>
              ) : (
                langFullData.buyBillBook
              ))}
            {linkValue == 5 && "Buyer Ledger"}
            {linkValue == 6 && langFullData.sellerLedger}
            {linkPath == "/partner" && langFullData.partners}
            {linkValue == 8 && langFullData.myProfile}
            {linkValue == 9 && "Reports"}
            {linkValue == 10 && langFullData.transporto}
          </h2>
          {linkValue == 11 && "Advances"}
        </div>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav flex_class">
            <li className="nav-item">
              <div className="nav-link active" aria-current="page" href="#">
                {/* <form className="d-flex" role="search">
                  <input
                    className="form-control search"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                </form> */}
              </div>
            </li>
            {/* <li className="nav-item">
              <a className="nav-link" href="#">
                <img src={help} alt="icon" />
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link bell_icon" href="#">
                <img src={bell} alt="icon" />
              </a>
            </li> */}
            <li className="nav-item">
              <div className="caDetails">
                <div
                  className="nav-link"
                  type="button"
                >
                  <div className="d-flex align-items-center" onClick={()=>profileClick()}>
                    <img src = {caImage} className="mr-2" alt="image"/>
                    <div>
                    <h5>{profileData != null
                    ? profileData.personalDtls.ownerName
                    : ""}
                    </h5>
                     <p>
                      Click ID:
                      {loginUserDetails != null
                        ? loginUserDetails.clickId
                        : loginUserDetails.clickId}
                    </p>
                    </div>
                  </div>
                 
                </div>
              
              </div>
              {/* <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {loginUserDetails.profile.profile.fullName}
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <p>Click Id:{loginUserDetails.profile.profile.clickId}</p>
                </li>
                <li>
                  <p>{loginUserDetails.profile.profile.mobile}</p>
                </li>
                <li className="pb-0">
                  <a className="dropdown-item p-0" href="#">
                    <button onClick={logOutFunction} className="primary_btn ">
                      Logout
                    </button>
                  </a>
                </li>
              </ul> */}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default TopNavigation;
