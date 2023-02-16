import React, { useEffect } from "react";
import { useState } from "react";
import { getMandiLogoDetails } from "../../actions/billCreationService";
import moment from "moment/moment";
import { useSelector } from "react-redux";
export const BusinessDetails = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  var businessDetails = JSON.parse(localStorage.getItem("businessDetails"));
  var personalDetails = JSON.parse(localStorage.getItem("personalDetails"));
  const [mandiLogoData, setMandiLogoData] = useState({});
  const billViewData = useSelector((state) => state.billViewInfo);
  const [billData, setBillViewData] = useState(billViewData.billViewInfo);
  useEffect(() => {
    getBusinessDetails();
    setBillViewData(JSON.parse(localStorage.getItem("billData")));
  }, [props]);
  const getBusinessDetails = () => {
    getMandiLogoDetails(clickId)
      .then((res) => {
        setMandiLogoData(res.data.data);
        console.log(res);
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
          <p className="medium_text">{personalDetails.ownerName}</p>
        </div>
        <div className="col-lg-5 p-0 text-center credit_bill">
          Cash / Credit Bill
        </div>
        {/* <div className="col-lg-1"></div> */}
        <div className="col-lg-4 p-0 text-right">
          <p className="small_text">Phone</p>
          <div className="d-flex align-items-center justify-content-end">
            <p className="medium_text">{businessDetails.mobile}</p>
            <p className="medium_text">
              {businessDetails.altMobile
                ? "|" +
                  // <p className="medium_text">
                  businessDetails.altMobile
                : // </p>

                  ""}
            </p>
          </div>
        </div>
      </div>
      <div className="row mandi_details_header align_items_center">
        <div className="col-lg-2">
          {mandiLogoData?.logoUrl ? (
            <div className="mandi_logo_image">
              <img src={mandiLogoData?.logoUrl} />
            </div>
          ) : (
            <div className="mandi_circle flex_class">
              <p className="mandi_logo">{businessDetails.shortCode}</p>
            </div>
          )}

          <div className="billid_date_bg">
            <p className="small_text text-center">
              Bill ID : {billData?.caBSeq !== null ? billData?.caBSeq : ""}
            </p>
          </div>
        </div>
        <div className="col-lg-8 text-center p-0">
          <h2 className="large_text">{businessDetails.businessName}</h2>
          <p className="medium_text">{businessDetails.businessType}</p>
          <p className="small_text">
            {businessDetails.businessAddress
              ? businessDetails.businessAddress?.addressLine +
                "," +
                businessDetails.businessAddress?.dist +
                ",Pincode-" +
                businessDetails.businessAddress?.pincode +
                "," +
                businessDetails.businessAddress?.state
              : ""}
          </p>
        </div>
        <div className="col-lg-2 text-center">
          <div className="mandi_circle shop_no">
            <span className="small_text">Shop No</span>
            <p className="mandi_logo shop_number">{businessDetails.shopNum}</p>
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
