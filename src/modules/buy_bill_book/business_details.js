import React, { useEffect } from "react";
import { useState } from "react";
import { getMandiDetails, getMandiLogoDetails } from "../../actions/billCreationService";
import moment from "moment/moment";
import { useSelector } from "react-redux";
export const BusinessDetails = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const [mandiData, setMandiData] = useState({});
  const [mandiLogoData, setMandiLogoData] = useState({});
  const billViewData = useSelector((state) => state.billViewInfo);
  const [billData, setBillViewData] = useState(billViewData.billViewInfo);
  useEffect(() => {
    getBusinessDetails();
    setBillViewData(JSON.parse(localStorage.getItem("billData")));
  }, [props]);
  const getBusinessDetails = () => {
    getMandiDetails(clickId)
      .then((response) => {
        console.log(response,"rese");
        setMandiData(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
      getMandiLogoDetails(clickId)
      .then((res) => {
        setMandiLogoData(res.data.data);
        console.log(res)
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="bill_view_header">
      <div className="row bill_view_top_header">
        <div className="col-lg-3 text-left">
          <p className="small_text">Proprietor</p>
          <p className="medium_text">{mandiData.personalDtls?.ownerName}</p>
        </div>
        <div className="col-lg-5 p-0 text-center credit_bill">
          Cash / Credit Bill
        </div>
        {/* <div className="col-lg-1"></div> */}
        <div className="col-lg-4 p-0 text-right">
          <p className="small_text">Phone</p>
          <div className="d-flex align-items-center justify-content-end">
            <p className="medium_text">{mandiData.businessDtls?.mobile}</p>
            <p className="medium_text">{mandiData.businessDtls?.altMobile
              ? "|" +
                
                  // <p className="medium_text">
                    mandiData.businessDtls?.altMobile
                  // </p>
                
              : ""}</p>
          </div>
        </div>
      </div>
      <div className="row mandi_details_header align_items_center">
        <div className="col-lg-2">
          {mandiLogoData.logoUrl ? (<div className="mandi_logo_image"><img src={mandiLogoData.logoUrl}/></div>) : (<div className="mandi_circle flex_class">
            <p className="mandi_logo">{mandiData.businessDtls?.shortCode}</p>
          </div>) }
          
          <div className="billid_date_bg">
            <p className="small_text text-center">
              Bill ID : {billData?.caBSeq !== null ? billData?.caBSeq : ""}
            </p>
          </div>
        </div>
        <div className="col-lg-8 text-center p-0">
          <h2 className="large_text">{mandiData.businessDtls?.businessName}</h2>
          <p className="medium_text">{mandiData.businessDtls?.businessType}</p>
          <p className="small_text">
            {mandiData.businessDtls?.businessAddress
              ? mandiData.businessDtls?.businessAddress?.addressLine +
                "," +
                mandiData.businessDtls?.businessAddress?.dist +
                ",Pincode-" +
                mandiData.businessDtls?.businessAddress?.pincode +
                "," +
                mandiData.businessDtls?.businessAddress?.state
              : ""}
          </p>
        </div>
        <div className="col-lg-2 text-center">
          <div className="mandi_circle shop_no">
            <span className="small_text">Shop No</span>
            <p className="mandi_logo shop_number">
              {mandiData.businessDtls?.shopNum}
            </p>
          </div>
          <div className="billid_date_bg">
            <p className="small_text text-center">
              {moment(billData?.billDate).format("DD-MMM-YY")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BusinessDetails;
