import React, { useEffect } from 'react'
import { useState } from 'react';
import { getMandiDetails } from '../../actions/billCreationService';
import moment from "moment/moment";
import { useSelector } from 'react-redux';
export const BusinessDetails = () => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const clientId = loginData.authKeys.clientId;
  const clientSecret = loginData.authKeys.clientSecret;
  const [mandiData, setMandiData] = useState({});
  //const singleBillData = JSON.parse(localStorage.getItem("selectedBillData"));
  const  billData = useSelector((state)=> state.billViewInfo);
  useEffect(()=>{
    getBusinessDetails();
  },[]);
  const getBusinessDetails = () => {
    getMandiDetails(clickId)
      .then((response) => {
        setMandiData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="bill_view_header">
      <div className="row bill_view_top_header">
        <div className="col-lg-3">
          <p className="small_text">Proprietor</p>
          <p className="medium_text">
            {mandiData.personalDtls?.ownerName}
          </p>
        </div>
        <div className="col-lg-6 text-center credit_bill">
          Cash / Credit Bill
        </div>
        <div className="col-lg-1"></div>
        <div className="col-lg-2 text-end">
          <p className="small_text">Phone</p>
          <p className="medium_text">
            {mandiData.businessDtls?.mobile}
          </p>
        </div>
      </div>
      <div className="row mandi_details_header align_items_center">
        <div className="col-lg-2">
          <div className="mandi_circle flex_class">
            <p className="mandi_logo">
              {mandiData.businessDtls?.shortCode}
            </p>
          </div>
          <div className="billid_date_bg">
            <p className="small_text text-center">
              Bill ID : {billData.billViewInfo.billId!==null?billData.billViewInfo.billId:''}
            </p>
          </div>
        </div>
        <div className="col-lg-8 text-center p-0">
          <h2 className="large_text">
            {mandiData.businessDtls?.businessName}
          </h2>
          <p className="medium_text">
            {mandiData.businessDtls?.businessType}
          </p>
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
              {moment(billData.billViewInfo.billDate).format("DD-MMM-YY")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default BusinessDetails;
