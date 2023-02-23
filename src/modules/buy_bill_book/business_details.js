import React, { useEffect } from "react";
import { useState } from "react";
import {
  getMandiDetails,
  getMandiLogoDetails,
} from "../../actions/billCreationService";
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
        setMandiData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
    getMandiLogoDetails(clickId)
      .then((res) => {
        setMandiLogoData(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="bill_view_header">
      <div className="bill_view_top_header px-0">
        <div className="row justify-content-between">
          <div className="text-left">
            <p className="small_text proprietor_name">Proprietor</p>
          </div>
          <div className="p-0 text-center credit_bill">Cash / Credit Bill</div>
          <div className="text-right phone_num_space">
            <p className="small_text">Phone</p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 text-left">
            <p className="medium_text">{mandiData.personalDtls?.ownerName}</p>
          </div>
          <div className="col-lg-5 p-0 text-center credit_bill"></div>
          <div className="col-lg-4 pl-0 text-right">
            <div className="d-flex align-items-center justify-content-end">
              <p className="medium_text">{mandiData.businessDtls?.mobile}</p>
              {mandiData.businessDtls?.altMobile ? (
                <p className="medium_text"></p>
              ) : (
                ""
              )}
              <p className="medium_text">
                {mandiData.businessDtls?.altMobile ? (
                  <p>
                    <span className="px-1">|</span>
                    {mandiData.businessDtls?.altMobile}
                  </p>
                ) : (
                  ""
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="row mandi_details_header px-0 align_items_center">
        <div className="col-lg-2">
          {mandiLogoData?.logoUrl ? (
            <div className="mandi_logo_image d-flex align-items-center">
              <img src={mandiLogoData?.logoUrl} />
            </div>
          ) : (
            <div className="mandi_circle flex_class">
              <p className="mandi_logo">{mandiData.businessDtls?.shortCode}</p>
            </div>
          )}

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
          <div className="d-flex justify-content-center">
            <div className="mandi_circle shop_no">
              <span className="small_text">Shop No</span>
              <p className="mandi_logo shop_number">
                {mandiData.businessDtls?.shopNum}
              </p>
            </div>
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
