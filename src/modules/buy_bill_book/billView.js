import React, { useEffect, useState } from "react";
import {
  getMandiDetails,
  getSystemSettings,
} from "../../actions/billCreationService";
import single_bill from "../../assets/images/bills/single_bill.svg";
import moment from "moment/moment";
var groupOne = [];
var grouptwo = [];
var groupthree = [];
var groupfour =[];
function BillView() {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const clientId = loginData.authKeys.clientId;
  const clientSecret = loginData.authKeys.clientSecret;
  const [mandiData, setMandiData] = useState({});
  const singleBillData = JSON.parse(localStorage.getItem("selectedBillData"));
  const [billSettingResponse, billSettingData] = useState([]);
  console.log(singleBillData);
  useEffect(() => {
    getBusinessDetails();
    getBuyBillsById();
  }, []);
  const getBusinessDetails = () => {
    getMandiDetails(clickId)
      .then((response) => {
        setMandiData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [groupone, setGroupOne] = useState([]);
  const [groupTwo, setGroupTwo] = useState([]);
  const [groupThree, setGroupThre] = useState([]);
  const [groupFour, setGroupFour] = useState([]);

  const getBuyBillsById = () => {
    getSystemSettings(clickId, clientId, clientSecret).then((res) => {
      groupOne=[];
      grouptwo=[];
      groupthree=[];
      groupfour=[];
      billSettingData(res.data.data.billSetting);
      for (var i = 0; i < res.data.data.billSetting.length; i++) {
        if (res.data.data.billSetting[i].groupId === 1 && res.data.data.billSetting[i].billType === 'BUY' && res.data.data.billSetting[i].value != 0) {
          groupOne.push(res.data.data.billSetting[i]);
          setGroupOne([...groupone, ...groupOne])
        }
        else if (res.data.data.billSetting[i].groupId == 2 && res.data.data.billSetting[i].billType === 'BUY' && res.data.data.billSetting[i].value != 0) {
          grouptwo.push(res.data.data.billSetting[i]);
          setGroupTwo([...groupTwo,...grouptwo]);
        }
        else if (res.data.data.billSetting[i].groupId == 3 && res.data.data.billSetting[i].billType === 'BUY' && res.data.data.billSetting[i].value != 0) {
          groupthree.push(res.data.data.billSetting[i]);
          setGroupThre([...groupThree,...groupthree]);
        }
        else if(res.data.data.billSetting[i].groupId === 4 && res.data.data.billSetting[i].billType === 'BUY' && res.data.data.billSetting[i].value != 0) {
          groupfour.push(res.data.data.billSetting[i]);
          setGroupFour([...groupFour,...groupfour]);
        }
      }
    });
  };
  // console.log(groupOne);
  const handleGroupNames = (name) =>{
    var value = 0;
    switch(name){
      case "COMMISSION":
        value = singleBillData?.comm;
        break;
      case "RETURN_COMMISSION":
        value = singleBillData?.rtComm;
        break;
      case "TRANSPORTATION":
        value = singleBillData?.transportation;
        break;
      case "LABOUR_CHARGES":
        value = singleBillData?.labourCharges;
        break;
      case "RENT":
        value = singleBillData?.rent;
        break;
      case "MANDI_FEE":
        value = singleBillData?.mandiFee;
        break;
      case "OTHER_FEE":
        value = singleBillData?.otherFee;
        break;
      case "GOVT_LEVIES":
        value= singleBillData?.govtLevies;
        break;
      case "CASH_PAID":
        value = singleBillData?.cashPaid;
        break;
      case "ADVANCES":
        value = singleBillData?.advance;
        break;
      case "CUSTOM_FIELD1":
        value = singleBillData.customFields.map(item=>{
          if(item.field === name){
            return item.fee;
          }
        });
        break;
      case "CUSTOM_FIELD2":
        value = singleBillData.customFields.map(item=>{
          if(item.field === name){
            return item.fee;
          }
        });
        break;
      case "CUSTOM_FIELD3":
        value = singleBillData.customFields.map(item=>{
          if(item.field === name){
            return item.fee;
          }
        });
        break;
      case "CUSTOM_FIELD4":
        value = singleBillData.customFields.map(item=>{
          if(item.field === name){
            return item.fee;
          }
        });
        break;
    }
    return value;
  }
  var cratesTotal = 0;
  var sacsTotal = 0;
  var bagsTotal = 0;
  var boxesTotal =0;
  var kgsTotal = 0;
  var groupOneTotal = 0;
  var groupTwoTotal = 0;
  var groupThreeTotal = 0;
  var groupFourTotal = 0;
  const groupOneTotals = () =>{
    groupone.map(item=>{
      groupOneTotal += handleGroupNames(item.settingName);
    })
    return groupOneTotal;
  }
  const groupTwoTotals = () =>{
    groupTwo.map(item=>{
      groupTwoTotal += handleGroupNames(item.settingName);
    })
    return groupTwoTotal;
  }
  const groupThreeTotals = () =>{
    groupThree.map(item=>{
      groupThreeTotal += handleGroupNames(item.settingName);
    })
    return groupThreeTotal;
  }
  const groupFourTotals = () =>{
    groupFour.map(item=>{
      groupFourTotal += handleGroupNames(item.settingName);
    })
    return groupFourTotal;
  }
  
  
  return (
    <div className="main_div_padding">
      <div className="container-fluid px-0">
        <div className="row">
          <div className="col-lg-8 col_left">
            <div className="bill_view_card buy_bills_view" id="scroll_style">
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
                  <div className="col-lg-3 text-end">
                    <p className="small_text">
                      {mandiData.businessDtls?.contactName}
                    </p>
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
                        Bill ID : {singleBillData.billId}
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
                      {
                        mandiData.businessDtls?.businessAddress ? mandiData.businessDtls?.businessAddress?.addressLine +
                          "," +
                          mandiData.businessDtls?.businessAddress?.dist +
                          ",Pincode-" +
                          mandiData.businessDtls?.businessAddress?.pincode +
                          "," +
                          mandiData.businessDtls?.businessAddress?.state : ''
                      }
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
                        {singleBillData.billDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bill_crop_details">
                <div className="row partner_info_padding">
                  <div className="col-lg-4">
                    <div className="partner_info">
                      <p className="small_text">
                        Bill To {singleBillData.partyType}:{" "}
                      </p>
                      <h6 className="small_text">
                        {singleBillData.farmerName}
                      </h6>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="partner_info">
                      <p className="small_text">Address: </p>
                      <h6 className="small_text">
                        {singleBillData.farmerAddress}
                      </h6>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="partner_info">
                      <p className="small_text">Transporter :</p>
                      <h6 className="small_text">
                        {singleBillData.transporterName}
                      </h6>
                    </div>
                  </div>
                </div>
                {/* table */}
                <table className="table table-bordered mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Particulars</th>
                      <th>Qty. </th>
                      <th>Rate (₹)</th>
                      <th>Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="crop-tbl">
                    {singleBillData.lineItems.map((item, key) => {
                      return (
                        <tr key={item}>
                          <td>{key + 1}</td>
                          <td>
                            <div className="flex_class crop_name">
                              <img
                                src={item.imageUrl}
                                className="crop_image_bill"
                              />
                              <p> {item.cropName}</p>
                            </div>
                          </td>
                          <td>
                            {" "}
                            <p>{item.qtyUnit + ":" + item.qty}</p>
                            <p>{item.rate}</p>
                            <p>{item.weight}</p>
                            <p className="red_text">
                              {item.wastage == null ? "0" : item.wastage}
                            </p>
                          </td>
                          <td>{item.rate.toFixed(2)}</td>
                          <td>{item.total.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="row gross_profit">
                  <div className="col-lg-2"></div>
                  <div className="col-lg-4">
                    {
                      singleBillData.lineItems.map(item =>{
                        if(item.qtyUnit === 'CRATES'){
                          cratesTotal += item.qty;
                        }else if(item.qtyUnit === 'SACS'){
                          sacsTotal += item.qty;
                        }else if(item.qtyUnit === 'BAGS'){
                          bagsTotal += item.qty;
                        }else if(item.qtyUnit === 'BOXES'){
                          boxesTotal += item.qty;
                        }else{
                          kgsTotal += item.qty;
                        }
                      })
                    }
                    <p className="total-qty">{cratesTotal?cratesTotal.toFixed(2) + 'C |':''}  {sacsTotal?sacsTotal.toFixed(2) + 'S |':''}  {bagsTotal?bagsTotal.toFixed(2) + 'Bg |':''}
                      {boxesTotal?boxesTotal.toFixed(2) + 'BX |':''}  {kgsTotal?kgsTotal.toFixed(2) + 'KGS':''}</p>
                  </div>
                  <div className="col-lg-6 ">
                    <div className="row">
                      <div className="col-lg-2"></div>
                      <div className="col-lg-6">
                        <p className="total_value">Gross Total : </p>
                      </div>
                      <div className="col-lg-4">
                        <p className="total_value number_overflow">
                          {singleBillData.grossTotal}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6"></div>
                  <div className="col-lg-6 col_border_left">
                    <div>
                      {groupOne.map((item, index) => {
                        return <div className="row" key={index}>
                          <div className="col-lg-2"></div>
                          <div className="col-lg-6 align-items">
                            <p className="groups_value"> {(item.settingName).replace('_',' ').toUpperCase()} : </p>
                          </div>
                          <div className="col-lg-4">
                            <p className="groups_value">{handleGroupNames(item.settingName)}</p>
                          </div>
                        </div>;
                      })}
                      <div className="group-one-total">
                        <p>{groupOneTotals()}</p>
                      </div>
                    </div>
                    <div>
                      {groupTwo.map((item, index) => {
                        return <div className="row" key={index}>
                          <div className="col-lg-2"></div>
                          <div className="col-lg-6">
                            <p className="groups_value"> {(item.settingName).replace('_',' ').toUpperCase()} : </p>
                          </div>
                          <div className="col-lg-4">
                            <p className="groups_value">{handleGroupNames(item.settingName)}</p>
                          </div>
                        </div>;
                      })}
                      <div className="group-one-total">
                        <p>{groupTwoTotals()}</p>
                      </div>
                    </div>
                    <div>
                      {groupThree.map((item, index) => {
                        return <div className="row" key={index}>
                          <div className="col-lg-2"></div>
                          <div className="col-lg-6">
                            <p className="groups_value"> {(item.settingName).replace('_',' ').toUpperCase()} : </p>
                          </div>
                          <div className="col-lg-4">
                            <p className="groups_value">{handleGroupNames(item.settingName)}</p>
                          </div>
                        </div>;
                      })}
                      <div className="group-one-total">
                        <p>{groupThreeTotals()}</p>
                      </div>
                    </div>
                    <div>
                      {groupFour.map((item, index) => {
                        return <div className="row" key={index}>
                          <div className="col-lg-2"></div>
                          <div className="col-lg-6">
                            <p className="groups_value"> {(item.settingName).replace('_',' ').toUpperCase()} : </p>
                          </div>
                          <div className="col-lg-4">
                            <p className="groups_value">{handleGroupNames(item.settingName)}</p>
                          </div>
                        </div>;
                      })}
                      <div className="group-one-total">
                        <p>{groupFourTotals()}</p>
                      </div>
                    </div>
                    <div className="d-flex total-pay">
                      <p>Total Paybles : </p>
                      <p className="pay-value">{singleBillData?.totalPayables}</p>
                    </div>
                  </div>
                </div>
                <div className="row out-st-bal">
                  <div className="col-lg-6"></div>
                  <div className="col-lg-6">
                  <div className="d-flex total-pay">
                      <p className="out-st">Outstanding Balance : </p>
                      <p className="out-value">{singleBillData?.outStBal}</p>
                    </div>
                  </div>
                </div>
                {/*  */}
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="row more-inf-tag">
              <div className="more-info">
                <p class-className="more-p-tag">More Info</p>
              </div>
              <div className="hr-line"></div>
              <div className="d-flex buy-dtl">
                <div className="col-lg-6">
                  <div className="d-flex">
                    <div className="buyer-image">
                      {singleBillData.farmerProfilePic ? (
                        <img src={singleBillData?.farmerProfilePic} alt="buyerimage" className="buyer_img" />
                      ) : (
                        <img src={single_bill} alt="buyerimage" className="buyer_img" />
                      )
                      }
                    </div>
                    <div className="buy-details">
                      <p className="b-cr-by">Bill Created By</p>
                      <p className="b-name">{singleBillData?.farmerName}</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  {/* <div className="date-and-time"> */}
                    <p className="d-a-time">Date And Time</p>
                    <p className="d-a-value">{moment((singleBillData?.timeStamp)).format("DD-MMM-YY | hh:mm:ss:A")}</p>
                  {/* </div> */}
                </div>
              </div>
              <div className="hr-line"></div>
              <div className="actions">
                <p class-className="more-p-tag">Actions</p>
              </div>
              <div className="hr-line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BillView;
