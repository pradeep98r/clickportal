import { Component, useState, useEffect } from "react";
import Navigation from "../../components/Navigation";
import { Link, Navigate, useNavigate } from "react-router-dom";
import OutlineButton from "../../components/OutlineButton";
import "../partners/Partner.scss";
import { getPartnerData } from "../../actions/billCreationService";
import $ from "jquery";
import single_bill from "../../assets/images/bills/single_bill.svg";
import edit from "../../assets/images/edit_round.svg";
import delete_icon from "../../assets/images/delete.svg";
import close from "../../assets/images/close.svg";
import NoDataAvailable from "../../components/NoDataAvailable";
const Partner = () => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const [partnerData, setPartnerData] = useState([]);
  useEffect(() => {
    tabEvent();
  }, []);
  const tabEvent = (type) => {
    //  fetchPertnerData = () => {
    getPartnerData(clickId, type)
      .then((response) => {
        console.log(response.data, "data");
        setPartnerData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
    // };
  };

  return (
    <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
          <ul className="nav nav-tabs partner_tabs" id="myTab" role="tablist">
            <li className="nav-item active">
              <a
                className="nav-item nav-link active"
                id="nav-home-tab"
                data-toggle="tab"
                href="#seller"
                role="tab"
                aria-controls="nav-home"
                aria-selected="true"
                onClick={(e) => tabEvent("FARMER")}
              >
                Sellers
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#buyer"
                role="tab"
                aria-controls="profile"
                data-toggle="tab"
                onClick={(e) => tabEvent("BUYER")}
              >
                Buyers
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#transporter"
                role="tab"
                aria-controls="messages"
                data-toggle="tab"
                onClick={(e) => tabEvent("TRANSPORTER")}
              >
                Transporters
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#coolie"
                role="tab"
                aria-controls="settings"
                data-toggle="tab"
                onClick={(e) => tabEvent("COOLIE")}
              >
                Coolies
              </a>
            </li>
          </ul>
          <div className="tab-content ps-0">
            <div
              className="tab-pane active"
              id="seller"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
                <div className="row">   
                <div className="col-lg-9 ps-0">
               {partnerData.length > 0 ? (
                 <div>
                   
                   <div className="partner_div" id="scroll_style">
                   {partnerData.map((partner) => (
                   <div className="card partner_card">
                     <div className="d-flex partner_card_flex justify-content-between align-items-center">
                       <div className="d-flex align-items-center">
                         <img
                           src={single_bill}
                           alt="img"
                           className="user_img"
                         />
                         <div>
                           <h5>{partner.partyName}</h5>
                           <h6>{partner.partyType} - {partner.partyId} | {partner.mobile}</h6>
                           <p>
                            {partner.address.addressLine}
                           </p>
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
             
               ) : (<NoDataAvailable />)}
               </div>
                 <div className="col-lg-3">
                 <div className="card default_card">
                   <div
                     data-bs-toggle="modal"
                     data-bs-target="#staticBackdrop1"
                   >
                     Add Seller
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
        <div className="modal-dialog crop_modal_dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title header2_text" id="staticBackdropLabel">
                Select Crop
              </h5>
              <img
                src={close}
                alt="image"
                className="close_icon"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="modal-body crop_modal_body" id="scroll_style">
              heyyy
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
                // onClick={() => postPreference()}
                data-bs-dismiss="modal"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partner;
