import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import single_bill from "../../assets/images/bills/single_bill.svg";
import moment from "moment/moment";
import ono_connect_click from "../../assets/images/ono-click-connect.svg";
import edit from "../../assets/images/edit_round.svg";
import { Navigate, useNavigate } from "react-router-dom";
import { qtyValues } from "../../components/qtyValues";
import SellBillBook from "./sellBillBook";
import {
  getMandiDetails,
  getSystemSettings,
} from "../../actions/billCreationService";
import SellbillStep3Modal from "./step3";
import cancel from "../../assets/images/cancel.svg";
import { editbuybillApi } from "../../actions/billCreationService";
import { ToastContainer, toast } from "react-toastify";
import $ from "jquery";
import cancel_bill_stamp from "../../assets/images/cancel_stamp.svg";
import close from "../../assets/images/close.svg";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
} from "../../components/getCurrencyNumber";
import { useDispatch } from "react-redux";
import { billDate, editStatus, selectBill, selectedParty, tableEditStatus, cropEditStatus } from "../../reducers/billEditItemSlice";
import { selectSteps } from "../../reducers/stepsSlice";
import Steps from "../buy_bill_book/steps";
const SellBillView = () => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const clientId = loginData.authKeys.clientId;
  const clientSecret = loginData.authKeys.clientSecret;
  const [mandiData, setMandiData] = useState({});
  const singleBillData = JSON.parse(localStorage.getItem("selectedBillData"));
  const [billSettingResponse, billSettingData] = useState([]);
  const dispatch = useDispatch();
  const [displayCancel, setDisplayCancel] = useState(false);
  const navigate = useNavigate();
  // const [billviewStatus, setBillViewStatus] = useState(false);
  useEffect(() => {
    cancelBillStatus();
    getBusinessDetails();
    getBuyBillsById();
    // setBillViewStatus(true);
    localStorage.setItem("billViiewSttatus",true);
    localStorage.setItem("billDate",singleBillData.billDate);
  }, []);

  const cancelBillStatus = () => {
    if (singleBillData.billStatus === "CANCELLED") {
      setDisplayCancel(true);
    } else {
      setDisplayCancel(displayCancel);
    }
  };
  const getBusinessDetails = () => {
    getMandiDetails(clickId)
      .then((response) => {
        setMandiData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  var grOne = [];
  var grTwo = [];
  var grThree = [];
  var grFour = [];

  const [grone, setGrOne] = useState([]);
  const [grtwo, setGrTwo] = useState([]);
  const [grthree, setGrThree] = useState([]);
  const [grfour, setGrFour] = useState([]);
  const [status, setStatus] = useState(false);
  const [includeComm, setIncludeComm] = useState("");
  const [includeRetComm, setIncludeRetComm] = useState("");
  const [addRetComm, setAddRetComm] = useState(false);
  const [isShown, setisShown] = useState(false);
  const getBuyBillsById = () => {
    getSystemSettings(clickId, clientId, clientSecret).then((res) => {
      billSettingData(res.data.data.billSetting);
      for (var i = 0; i < res.data.data.billSetting.length; i++) {
        if (
          res.data.data.billSetting[i].groupId === 1 &&
          res.data.data.billSetting[i].billType === "SELL" &&
          res.data.data.billSetting[i].formStatus === 1
        ) {
          if (res.data.data.billSetting[i].settingName === "COMMISSION") {
            setIncludeComm(
              res.data.data.billSetting[i].includeInLedger == 1 ? true : false
            );
            setisShown(res.data.data.billSetting[i].isShown == 1 ? true : false)
            if(!(res.data.data.billSetting[i].isShown)){
              setStatus(true);
            }
          }
          if (res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE") {
            setStatus(true);
          } else if (
            res.data.data.billSetting[i].settingName === "RETURN_COMMISSION"
          ) {
            setAddRetComm(
              res.data.data.billSetting[i].addToGt == 1 ? true : false
            );
            setIncludeRetComm(
              res.data.data.billSetting[i].includeInLedger == 1 ? true : false
            );
          }
          grOne = [res.data.data.billSetting[i], ...grOne];
          setGrOne([grone, ...grOne]);
        } else if (
          res.data.data.billSetting[i].groupId === 2 &&
          res.data.data.billSetting[i].billType === "SELL" &&
          res.data.data.billSetting[i].formStatus === 1
        ) {
          if (res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE") {
            setStatus(true);
          }
          if (res.data.data.billSetting[i].settingName === "COMMISSION") {
            setIncludeComm(
              res.data.data.billSetting[i].includeInLedger == 1 ? true : false
            );
            setisShown(res.data.data.billSetting[i].isShown == 1 ? true : false)
          } else if (
            res.data.data.billSetting[i].settingName === "RETURN_COMMISSION"
          ) {
            setAddRetComm(
              res.data.data.billSetting[i].addToGt == 1 ? true : false
            );
            setIncludeRetComm(
              res.data.data.billSetting[i].includeInLedger == 1 ? true : false
            );
          }
          grTwo = [res.data.data.billSetting[i], ...grTwo];
          setGrTwo([grtwo, ...grTwo]);
        } else if (
          res.data.data.billSetting[i].groupId === 3 &&
          res.data.data.billSetting[i].billType === "SELL" &&
          res.data.data.billSetting[i].formStatus === 1
        ) {
          if (res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE") {
            setStatus(true);
          }
          if (res.data.data.billSetting[i].settingName === "COMMISSION") {
            setIncludeComm(
              res.data.data.billSetting[i].includeInLedger == 1 ? true : false
            );
            setisShown(res.data.data.billSetting[i].isShown == 1 ? true : false)
          } else if (
            res.data.data.billSetting[i].settingName === "RETURN_COMMISSION"
          ) {
            setAddRetComm(
              res.data.data.billSetting[i].addToGt == 1 ? true : false
            );
            setIncludeRetComm(
              res.data.data.billSetting[i].includeInLedger == 1 ? true : false
            );
          }
          grThree = [res.data.data.billSetting[i], ...grThree];
          setGrThree([grthree, ...grThree]);
        } else if (
          res.data.data.billSetting[i].groupId === 4 &&
          res.data.data.billSetting[i].billType === "SELL" &&
          res.data.data.billSetting[i].formStatus === 1
        ) {
          if (res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE") {
            setStatus(true);
          }
          if (res.data.data.billSetting[i].settingName === "COMMISSION") {
            setIncludeComm(
              res.data.data.billSetting[i].includeInLedger == 1 ? true : false
            );
            setisShown(res.data.data.billSetting[i].isShown == 1 ? true : false)
          } else if (
            res.data.data.billSetting[i].settingName === "RETURN_COMMISSION"
          ) {
            setAddRetComm(
              res.data.data.billSetting[i].addToGt == 1 ? true : false
            );
            setIncludeRetComm(
              res.data.data.billSetting[i].includeInLedger == 1 ? true : false
            );
          }
          grFour = [res.data.data.billSetting[i], ...grFour];
          setGrFour([grfour, ...grFour]);
        }
      }
    });
  };
  const handleGroupNames = (name) => {
    var value = 0;
    var substring = "CUSTOM_FIELD";
    if (name?.includes(substring)) {
      substring = name;
    }
    switch (name) {
      case "COMMISSION":
        value = singleBillData?.commShown ? singleBillData?.comm : 0;
        break;
      case "RETURN_COMMISSION":
        value = singleBillData?.rtComm;
        grone.map((item) => {
          if (item.addToGt == 1) {
            value = +singleBillData?.rtComm;
            return value;
          } else if (
            item.addToGt == 0 &&
            item.settingName === "RETURN_COMMISSION"
          ) {
            value = -singleBillData?.rtComm;
            return value;
          }
        });
        grtwo.map((item) => {
          if (item.addToGt == 1) {
            value = +singleBillData?.rtComm;
            return value;
          } else if (
            item.addToGt == 0 &&
            item.settingName === "RETURN_COMMISSION"
          ) {
            value =  -singleBillData?.rtComm;
            return value;
          }
        });
        grthree.map((item) => {
          if (item.addToGt == 1) {
            value = +singleBillData?.rtComm;
            return value;
          } else if (
            item.addToGt == 0 &&
            item.settingName === "RETURN_COMMISSION"
          ) {
            value = -singleBillData?.rtComm;
            return value;
          }
        });
        grFour.map((item) => {
          if (item.addToGt == 1) {
            value = +singleBillData?.rtComm;
            return value;
          } else if (
            item.addToGt == 0 &&
            item.settingName === "RETURN_COMMISSION"
          ) {
            value = -singleBillData?.rtComm;
            return value;
          }
        });
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
        if (singleBillData.partyType === "BUYER") {
          value = singleBillData?.otherFee;
        } else {
          value = singleBillData?.misc;
        }
        break;
      case "GOVT_LEVIES":
        value = singleBillData?.govtLevies;
        break;
      case "ADVANCES":
        value = singleBillData?.advance;
        break;
        case substring:
        singleBillData.customFields.map((item) => {
          if(item.fee != 0){
          if (item.field === name) {
            value = item.fee;
            return value;
          }}
        });
        break;
   
    }
    return value;
  };
  var cratesTotal = 0;
  var sacsTotal = 0;
  var bagsTotal = 0;
  var boxesTotal = 0;
  var kgsTotal = 0;
  var groupOneTotal = 0;
  var groupTwoTotal = 0;
  var groupThreeTotal = 0;
  var groupFourTotal = 0;
  const getCropUnit = (unit) => {
    var unitType = "";
    switch (unit.toUpperCase()) {
      case "CRATES":
        unitType = "C";
        break;
      case "BOXES":
        unitType = "BX";
        break;
      case "BAGS":
        unitType = "Bg";
        break;
      case "SACS":
        unitType = "S";
        break;
    }
    return unitType;
  };
  const handleSettingName = (item,list) => {
    var substring = "CUSTOM_FIELD";
    if (item?.includes(substring)) {
      substring = item;
    }
    switch (item) {
      case "COMM_INCLUDE":
        item = "";
        break;
      case "DEFAULT_RATE_TYPE":
        item = "";
        break;
      case "SKIP_INDIVIDUAL_EXP":
        item = "";
        break;
      case "BILL_EDIT":
        item = "";
        break;
      case "WASTAGE":
        item = "";
        break;
      case "OUT_ST_BALANCE":
        item = "";
        break;
      case "CASH_PAID":
        item = "";
        break;
      case "CASH_RECEIVED":
        item = "";
        break;
        case "COMMISSION":
         if(!(list.isShown)){
          item = "";
         }
          break;
          case substring:
            singleBillData.customFields.map((items) => {
              if (items.fee != 0) {
                if (items.field === item) {
                  item = items.field;
                  return item;
                }
              }
            });
            break;
    }
    return item;
  };

  grone.map((item) => {
    return (groupOneTotal += handleGroupNames(item.settingName));
  });
  grtwo.map((item) => {
    return (groupTwoTotal += handleGroupNames(item.settingName));
  });

  grthree.map((item) => {
    return (groupThreeTotal += handleGroupNames(item.settingName));
  });

  grfour.map((item) => {
    return (groupFourTotal += handleGroupNames(item.settingName));
  });
  const getFinalLedgerbalance = () => {
    var t = parseInt(
      singleBillData.transportation +
        singleBillData.labourCharges +
        singleBillData.rent +
        singleBillData.mandiFee +
        singleBillData.govtLevies +
        singleBillData.otherFee
    );
    var finalValue = singleBillData.grossTotal + t;
    var finalVal = finalValue;
    if (includeComm) {
      finalVal = finalVal + singleBillData.comm;
    }
    if (addRetComm) {
      if (includeRetComm) {
        finalVal = finalVal + singleBillData.rtComm;
      }
    } else {
      // if (includeRetComm) {
        finalVal = finalVal - singleBillData.rtComm;
      // }
    }
    var cashRecieved =
      singleBillData.cashRcvd === null ? 0 : singleBillData.cashRcvd;
  
    return (
      (Number(finalVal) + singleBillData.outStBal).toFixed(2) - cashRecieved
    ).toFixed(2);
  };
  const [showStep3Modal, setShowStep3Modal] = useState(false);
  const [showStep3ModalStatus, setShowStep3ModalStatus] = useState(false);
  const [slectedCropArray, setSlectedCropArray] = useState([]);
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [editCancelStatus, setEditCancelStatus] = useState(false);
  const [showStepsModalStatus, setShowStepsModalStatus] = useState(false);
  
  const editBill = (itemVal) => {
    console.log(singleBillData.partyType);
    var arr = [];
    arr.push(itemVal);
    setSlectedCropArray(arr);
    console.log('edit')
    dispatch(selectSteps("step3"));
    setShowStepsModalStatus(true);
    setShowStepsModal(true);
    dispatch(selectBill(arr[0]))
    dispatch(editStatus(true))
    dispatch(tableEditStatus(false))
    dispatch(billDate(new Date(singleBillData.billDate)))
    dispatch(selectedParty(singleBillData.partyType));
    dispatch(cropEditStatus(false));
    // var arr = [];
    // arr.push(itemVal);
    // setSlectedCropArray(arr);
    // console.log('edit')
    // dispatch(selectSteps("step3"))
    // setShowStepsModalStatus(true);
    // setShowStepsModal(true);
    // // setShowStep3ModalStatus(true);
    // // setShowStep3Modal(true);
    // // setShowStepsModal(true);
    // dispatch(selectBill(arr[0]))
    // dispatch(editStatus(true))
    // dispatch(tableEditStatus(false))
    // dispatch(billDate(new Date(singleBillData.billDate)))
    // dispatch(selectedParty(singleBillData.partyType));
    // setEditCancelStatus(true);
  };
  const cancelBill = (itemVal) => {
    $("#cancelBill").modal("hide");
    setDisplayCancel(!displayCancel);
    cancelbillApiCall();
  };
  const editBillRequestObj = {
    action: "CANCEL",
    billAttributes: {
      actualPayRecieevable: singleBillData.actualReceivable,
      advance: singleBillData.advance,
      billDate: singleBillData.billDate,
      cashRcvd: singleBillData.cashRcvd,
      comm: singleBillData.comm,
      commIncluded: singleBillData.commIncluded,
      comments: singleBillData.comments,
      // customFields: [
      //   {
      //     "comments": "string",
      //     "fee": 0,
      //     "field": "string",
      //     "fieldName": "string",
      //     "fieldType": "string",
      //     "less": true
      //   }
      // ],
      govtLevies: singleBillData.govtLevies,
      grossTotal: singleBillData.grossTotal,
      labourCharges: singleBillData.labourCharges,
      less: singleBillData.less,
      mandiFee: singleBillData.mandiData,
      misc: singleBillData.misc,
      otherFee: singleBillData.misc,
      outStBal: singleBillData.outStBal,
      paidTo: 0,
      partyId: singleBillData.buyerId,
      rrent: singleBillData.rent,
      rtComm: singleBillData.rtComm,
      rtCommIncluded: singleBillData.rtCommIncluded,
      totalPayRecieevable: singleBillData.totalReceivable,
      transportation: singleBillData.transportation,
      transporterId: singleBillData.transporterId,
    },
    billId: singleBillData.billId,
    billType: "SELL",
    caBSeq: singleBillData.caBSeq,
    caId: clickId,
    lineItems: singleBillData.lineItems,
    updatedBy: 0,
    updatedOn: "",
    writerId: 0,
  };
  const [sellbillbookStatus,setsellbillbookStatus] = useState(false);
  const cancelbillApiCall = () => {
    editbuybillApi(editBillRequestObj).then(
      (response) => {
        if (response.data.status.type === "SUCCESS") {
          toast.success(response.data.status.message, {
            toastId: "success1",
          });
          console.log(editBillRequestObj, "edit bill request");
          console.log(response.data, "edit bill");
          localStorage.setItem("billViewStatus", false);
          setsellbillbookStatus(true);
          navigate("/sellbillbook");
        }
      },
      (error) => {
        toast.error(error.response.data.status.description, {
          toastId: "error1",
        });
      }
    );
  };
  const handleCheckEvent = () => {
    $("#cancelBill").modal("show");
  };
  const closePopup = () => {
    $("#cancelBill").modal("hide");
  };
  return (
    <div className="main_div_padding">
      <div className="container-fluid px-0">
        <div className="row">
          <div className="col-lg-7 col_left">
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
                        {moment(singleBillData.billDate).format("DD-MMM-YY")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bill_crop_details">
                <div className="row partner_info_padding">
                  <div className="col-lg-3 pl-0">
                    <div className="partner_info">
                      <p className="small_text">
                        Bill To {singleBillData.partyType}:{" "}
                      </p>
                      <h6 className="small_text">{singleBillData.buyerName}</h6>
                    </div>
                  </div>
                  {singleBillData.buyerAddress != '' ? <div className="col-lg-3">
                    <div className="partner_info">
                      <p className="small_text">Address: </p>
                      <h6 className="small_text">
                        {singleBillData.buyerAddress}
                      </h6>
                    </div>
                  </div> : ''}
                  
                  {singleBillData.transporterId != 0 ? <div className="col-lg-3">
                    <div className="partner_info">
                      <p className="small_text">Transporter :</p>
                      <h6 className="small_text">
                        {singleBillData.transporterName}
                      </h6>
                    </div>
                  </div> : ''}
                 
                </div>
                {/* table */}
                <div className="row">
                  <div className="col-lg-8"></div>
                  <div className="col-lg-4 stamp_img">
                    {displayCancel && (
                      <img src={cancel_bill_stamp} alt="stammp_img" />
                    )}
                  </div>
                </div>
                <table className="table table-bordered bill_view mb-0">
                  <thead>
                    <tr>
                      <th className="col-1">#</th>
                      <th className="col-4">Particulars</th>
                      <th className="col-3">Qty. </th>
                      <th className="col-2">Rate (₹)</th>
                      <th className="col-2">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="crop-tbl">
                    {singleBillData.lineItems.map((item, key) => {
                      return (
                        <tr key={item}>
                          <td className="col-1">{key + 1}</td>
                          <td className="col-4">
                            <div className="flex_class crop_name">
                              <img
                                src={item.imageUrl}
                                className="crop_image_bill"
                              />
                              <p className="crop-name"> {item.cropName}</p>
                            </div>
                          </td>
                          <td className="col-3">
                            {" "}
                            <div> {qtyValues(item.qty,item.qtyUnit,item.weight,item.wastage,item.rateType)}</div>
                          
                          </td>
                          <td className="col-2">
                            {item.rate
                              ? getCurrencyNumberWithOutSymbol(item.rate)
                              : ""}
                          </td>
                          <td className="col-2 color_green">
                            {item.total
                              ? getCurrencyNumberWithOutSymbol(item.total)
                              : ""}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="row gross_profit">
                  <div className="col-lg-2"></div>
                  <div className="col-lg-4">
                    {singleBillData.lineItems.map((item) => {
                      if (item.qtyUnit === "CRATES") {
                        cratesTotal += item.qty;
                      } else if (item.qtyUnit === "SACS") {
                        sacsTotal += item.qty;
                      } else if (item.qtyUnit === "BAGS") {
                        bagsTotal += item.qty;
                      } else if (item.qtyUnit === "BOXES") {
                        boxesTotal += item.qty;
                      } else {
                        kgsTotal += item.qty;
                      }
                    })}
                    <p className="total-qty">
                      {cratesTotal ? cratesTotal.toFixed(2) + "C |" : ""}{" "}
                      {sacsTotal ? sacsTotal.toFixed(2) + "S |" : ""}{" "}
                      {bagsTotal ? bagsTotal.toFixed(2) + "Bg |" : ""}
                      {boxesTotal ? boxesTotal.toFixed(2) + "BX |" : ""}{" "}
                      {kgsTotal ? kgsTotal.toFixed(2) + "KGS" : ""}
                    </p>
                  </div>
                  <div className="col-lg-6 ">
                    <div className="row">
                      <div className="col-lg-4"></div>
                      <div className="col-lg-4">
                        <p className="total_value">Gross Total </p>
                      </div>
                      <div className="col-lg-4">
                        <p className="total_value number_overflow">
                          {singleBillData.grossTotal.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                            style: "currency",
                            currency: "INR",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6"></div>
                  <div className="pl-0 col-lg-6 col_border_left pr-0">
                    <div>
                      {grone.map((item, index) => {
                        return (
                          <div>
                            <div className="row" key={index}>
                              <div className="col-lg-2"></div>
                              <div className="col-lg-6 align-items">
                                <p className="groups_value">
                                  {(
                                    item.settingName !==
                                    handleSettingName(item.settingName,item)
                                      ? " "
                                      : handleGroupNames(item.settingName) ===
                                          0 ||
                                        handleGroupNames(item.settingName) ===
                                          null
                                  )
                                    ? " "
                                    :( item.settingName.includes("CUSTOM_FIELD") ? item.customFieldName : item.settingName?.replaceAll("_", " "))}
                                </p>
                              </div>
                              <div className="col-lg-4">
                                <p className="groups_value">
                                  {handleGroupNames(
                                    handleSettingName(item.settingName,item)
                                  ) === 0
                                    ? " "
                                    : handleGroupNames(item.settingName)}
                                </p>
                              </div>
                            </div>
                            <div
                              className={
                                (
                                  item.settingName !==
                                  handleSettingName(item.settingName,item)
                                    ? " "
                                    : handleGroupNames(item.settingName) === 0
                                )
                                  ? " "
                                  : item.settingName?.replaceAll("_", " ")
                                  ? "hrs-line"
                                  : ""
                              }
                            ></div>
                          </div>
                        );
                      })}
                      <div className="row group-one-total">
                        <div className="pl-0 col-lg-8 pr-0"></div>
                        <div className="col-lg-4">
                          <p>
                            {groupOneTotal === 0 || null
                              ? ""
                              : (
                                  singleBillData.grossTotal + groupOneTotal
                                ).toLocaleString("en-IN", {
                                  maximumFractionDigits: 2,
                                  style: "currency",
                                  currency: "INR",
                                })}
                          </p>{" "}
                        </div>
                        <div
                          className={
                            groupOneTotal === 0 || null
                              ? ""
                              : "hr-line-in-totals"
                          }
                        ></div>
                      </div>
                    </div>
                    <div>
                      {grtwo.map((item, index) => {
                        return (
                          <div>
                            <div className="row" key={index}>
                              <div className="col-lg-2"></div>
                              <div className="col-lg-6">
                                <p className="groups_value">
                                  {" "}
                                  {(
                                    item.settingName !==
                                    handleSettingName(item.settingName,item)
                                      ? " "
                                      : handleGroupNames(item.settingName) ===
                                          0 ||
                                        handleGroupNames(item.settingName) ===
                                          null
                                  )
                                    ? " "
                                    : ( item.settingName.includes("CUSTOM_FIELD") ? item.customFieldName : item.settingName?.replaceAll("_", " "))}
                                </p>
                              </div>
                              <div className="col-lg-4">
                                <p className="groups_value">
                                  {handleGroupNames(
                                    handleSettingName(item.settingName,item)
                                  ) === 0
                                    ? " "
                                    : handleGroupNames(item.settingName)}
                                </p>
                              </div>
                            </div>
                            <div
                              className={
                                (
                                  item.settingName !==
                                  handleSettingName(item.settingName,item)
                                    ? " "
                                    : handleGroupNames(item.settingName) === 0
                                )
                                  ? " "
                                  : item.settingName?.replaceAll("_", " ")
                                  ? "hrs-line"
                                  : ""
                              }
                            ></div>
                          </div>
                        );
                      })}
                      <div className="row group-one-total">
                        <div className="pl-0 col-lg-8 pr-0"></div>
                        <div className="col-lg-4">
                          <p>
                            {groupTwoTotal === 0 || null
                              ? ""
                              : (
                                  singleBillData?.grossTotal +
                                  (groupTwoTotal + groupOneTotal)
                                ).toLocaleString("en-IN", {
                                  maximumFractionDigits: 2,
                                  style: "currency",
                                  currency: "INR",
                                })}
                          </p>
                        </div>
                        <div
                          className={
                            groupTwoTotal === 0 || null
                              ? ""
                              : "hr-line-in-totals"
                          }
                        ></div>
                      </div>
                    </div>
                    <div>
                      {grthree.map((item, index) => {
                        return (
                          <div>
                            <div className="row" key={index}>
                              <div className="col-lg-2"></div>
                              <div className="col-lg-6">
                                <p className="groups_value">
                                  {" "}
                                  {(
                                    item.settingName !==
                                    handleSettingName(item.settingName,item)
                                      ? " "
                                      : handleGroupNames(item.settingName) ===
                                          0 ||
                                        handleGroupNames(item.settingName) ===
                                          null
                                  )
                                    ? " "
                                    : ( item.settingName.includes("CUSTOM_FIELD") ? item.customFieldName : item.settingName?.replaceAll("_", " "))}{" "}
                                </p>
                              </div>
                              <div className="col-lg-4">
                                <p className="groups_value">
                                  {handleGroupNames(
                                    handleSettingName(item.settingName,item)
                                  ) === 0
                                    ? " "
                                    : handleGroupNames(item.settingName)}
                                </p>
                              </div>
                            </div>
                            <div
                              className={
                                (
                                  item.settingName !==
                                  handleSettingName(item.settingName,item)
                                    ? " "
                                    : handleGroupNames(item.settingName) === 0
                                )
                                  ? " "
                                  : item.settingName?.replaceAll("_", " ")
                                  ? "hrs-line"
                                  : ""
                              }
                            ></div>
                          </div>
                        );
                      })}
                      <div className="row group-one-total">
                        <div className="pl-0 col-lg-8 pr-0"></div>
                        <div className="col-lg-4">
                          <p>
                            {groupThreeTotal === 0 || null
                              ? ""
                              : (
                                  singleBillData?.grossTotal +
                                  (groupThreeTotal +
                                    groupTwoTotal +
                                    groupOneTotal)
                                ).toLocaleString("en-IN", {
                                  maximumFractionDigits: 2,
                                  style: "currency",
                                  currency: "INR",
                                })}
                          </p>
                        </div>
                        <div
                          className={
                            groupThreeTotal === 0 || null
                              ? ""
                              : "hr-line-in-totals"
                          }
                        ></div>
                      </div>
                    </div>
                    <div>
                      {grfour.map((item, index) => {
                        return (
                          <div>
                            <div className="row" key={index}>
                              <div className="col-lg-2"></div>
                              <div className="col-lg-6">
                                <p className="groups_value">
                                  {" "}
                                  {(
                                    item.settingName !==
                                    handleSettingName(item.settingName,item)
                                      ? " "
                                      : handleGroupNames(item.settingName) ===
                                          0 ||
                                        handleGroupNames(item.settingName) ===
                                          null
                                  )
                                    ? " "
                                    : ( item.settingName.includes("CUSTOM_FIELD") ? item.customFieldName : item.settingName?.replaceAll("_", " "))}
                                </p>
                              </div>
                              <div className="col-lg-4">
                                <p className="groups_value">
                                  {handleGroupNames(
                                    handleSettingName(item.settingName,item)
                                  ) === 0
                                    ? " "
                                    : handleGroupNames(item.settingName)}
                                </p>
                              </div>
                            </div>
                            <div
                              className={
                                (
                                  item.settingName !==
                                  handleSettingName(item.settingName,item)
                                    ? " "
                                    : handleGroupNames(item.settingName) === 0
                                )
                                  ? " "
                                  : item.settingName?.replaceAll("_", " ")
                                  ? "hrs-line"
                                  : ""
                              }
                            ></div>
                          </div>
                        );
                      })}
                      <div className="row group-one-total">
                        <div className="pl-0 col-lg-8 pr-0"></div>
                        <div className="col-lg-4">
                          <p>
                            {groupFourTotal === 0 || null
                              ? ""
                              : (
                                  singleBillData?.grossTotal +
                                  (groupFourTotal +
                                    groupThreeTotal +
                                    groupTwoTotal +
                                    groupOneTotal)
                                ).toLocaleString("en-IN", {
                                  maximumFractionDigits: 2,
                                  style: "currency",
                                  currency: "INR",
                                })}
                          </p>
                        </div>
                        <div
                          className={
                            groupFourTotal === 0 || null
                              ? ""
                              : "hr-line-in-totals"
                          }
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="row">
                        <div className="col-lg-2"></div>
                        <div className="col-lg-6">
                          <div>
                            {singleBillData?.grossTotal +
                              (groupFourTotal +
                                groupThreeTotal +
                                groupTwoTotal +
                                groupOneTotal) ===
                              0 ||
                            singleBillData?.grossTotal +
                              (groupFourTotal +
                                groupThreeTotal +
                                groupTwoTotal +
                                groupOneTotal) ===
                              null ? (
                              ""
                            ) : (
                              <p className="grouping_value">
                                Total Bill Amount :
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <p className="grouping_value color_green">
                            {singleBillData?.grossTotal +
                              (groupFourTotal +
                                groupThreeTotal +
                                groupTwoTotal +
                                groupOneTotal) ===
                              0 ||
                            singleBillData?.grossTotal +
                              (groupFourTotal +
                                groupThreeTotal +
                                groupTwoTotal +
                                groupOneTotal) ===
                              null
                              ? " "
                              : (
                                  singleBillData?.grossTotal +
                                  (groupFourTotal +
                                    groupThreeTotal +
                                    groupTwoTotal +
                                    groupOneTotal)
                                ).toLocaleString("en-IN", {
                                  maximumFractionDigits: 2,
                                  style: "currency",
                                  currency: "INR",
                                })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="row">
                        <div className="col-lg-2"></div>
                        <div className="col-lg-6">
                          {singleBillData.cashRcvd === 0 ||
                          singleBillData.cashRcvd === null ? (
                            ""
                          ) : (
                            <p className="grouping_value">Cash Received</p>
                          )}
                        </div>
                        <div className="col-lg-4">
                          <p className="grouping_value ">
                            {singleBillData.cashRcvd === 0 ||
                            singleBillData.cashRcvd === null
                              ? ""
                              : '-' + getCurrencyNumberWithSymbol(singleBillData?.cashRcvd)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="row">
                        <div className="col-lg-2"></div>
                        <div className="col-lg-6">
                          <p
                            className="grouping_value"
                            style={{ display: status ? "block" : "none" }}
                          >
                            Outstanding Balance:s
                          </p>
                        </div>
                        <div className="col-lg-4">
                          <p
                            className="grouping_value color_green"
                            style={{ display: status ? "block" : "none" }}
                          >
                            {(singleBillData?.outStBal).toLocaleString(
                              "en-IN",
                              {
                                maximumFractionDigits: 2,
                                style: "currency",
                                currency: "INR",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
                {!status ? (
                  <div className="row out-st-bal align-items-center">
                    <div className="col-lg-5">
                      <div className="d-flex footer-img">
                        <img src={ono_connect_click} alt="ono_connect" />
                      </div>
                    </div>
                    <div className="col-lg-2"></div>
                    <div className="col-lg-3">
                      {singleBillData.totalReceivable === 0 ||
                      singleBillData.totalReceivable === null ? (
                        ""
                      ) : (
                        <p
                          className="groups_value"
                          style={{ display: !status ? "block" : "none" }}
                        >
                          Total Receivables:
                        </p>
                      )}
                    </div>
                    <div className="col-lg-2">
                      {singleBillData.totalReceivable === 0 ||
                      singleBillData.totalReceivable === null ? (
                        ""
                      ) : (
                        <p
                          className="groups_value color_green"
                          style={{ display: !status ? "block" : "none" }}
                        >
                          {singleBillData?.totalReceivable.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 2,
                              style: "currency",
                              currency: "INR",
                            }
                          )}
                        </p>
                      )}
                    </div>
                    {/* <div className="col-lg-4">
                    <p
                      className="out-st"
                      style={{ display: status ? "block" : "none" }}
                    >
                      Final Ledger Balance
                    </p>
                  </div>
                  <div className="col-lg-2">
                    <span
                      className="out-value"
                      style={{ display: status ? "block" : "none" }}
                    >
                      {getFinalLedgerbalance()}
                    </span>
                  </div> */}
                  </div>
                ) : (
                  <div className="row out-st-bal align-items-center">
                    <div className="col-lg-2">
                      <div className="d-flex footer-img">
                        <img src={ono_connect_click} alt="ono_connect" />
                      </div>
                    </div>
                    <div className="col-lg-3"></div>
                    <div className="col-lg-5">
                      <p
                        className="out-st"
                        style={{ display: status ? "block" : "none" }}
                      >
                        Final Ledger Balance
                      </p>
                    </div>
                    <div className="col-lg-2">
                      <span
                        className="out-value color_green"
                        style={{ display: status ? "block" : "none" }}
                      >
                        {getFinalLedgerbalance()}
                      </span>
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-lg-6">
                    <p className="ono-footer">
                      ONO-{moment(singleBillData.billDate).format("DDMMYYYY")}
                      -CLICK-
                      {singleBillData.actualReceivable.toFixed(2)}
                    </p>
                  </div>
                </div>
                {/*  */}
              </div>
            </div>
          </div>
          <div className="col-lg-5">
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
                        <img
                          src={singleBillData?.profilePic}
                          alt="buyerimage"
                          className="buyer_img"
                        />
                      ) : (
                        <img
                          src={single_bill}
                          alt="buyerimage"
                          className="buyer_img"
                        />
                      )}
                    </div>
                    <div className="buy-details">
                      <p className="b-cr-by">Bill Created By</p>
                      <p className="b-name">{singleBillData?.buyerName}</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  {/* <div className="date-and-time"> */}
                  <p className="d-a-time">Date And Time</p>
                  <p className="d-a-value">
                    {moment(singleBillData?.timeStamp).format(
                      "DD-MMM-YY | hh:mm:ss:A"
                    )}
                  </p>
                  {/* </div> */}
                </div>
              </div>
              <div className="hr-line"></div>
              {singleBillData.billStatus == "CANCELLED" ? (
                ""
              ) : (
                <div>
                
                  <div className="d-flex more-info action_icons">
                 <div className="items_div">
                 <img
                      src={cancel}
                      alt="img"
                      className=""
                      onClick={handleCheckEvent}
                    />
                    <p>Cancel</p>
                   </div>
                  <div className="items_div">
                  <img
                      src={edit}
                      alt="img"
                      onClick={() => editBill(singleBillData)}
                    />
                    <p>Edit</p>
                    </div>
                    
                  </div>
                </div>
              )}
            
             
              {/* <div className="d-flex more-info">
                                <img
                                src={edit}
                                alt="img"
                                className=""
                                onClick={() => editBill(singleBillData)}
                                />
                            </div> */}
            </div>
          </div>
        </div>

      {showStep3ModalStatus ? (
        <SellbillStep3Modal
          show={showStep3Modal}
          closeStep3Modal={() => setShowStep3Modal(false)}
          slectedSellCropsArray={slectedCropArray}
          billEditStatus={true}
          step2CropEditStatus={false}
          sellBilldateSelected = {new Date(singleBillData.billDate)}
          selectedBillData={slectedCropArray}
        />
      ) : (
        ""
      )}
      </div>
      {showStepsModalStatus?(
        <Steps showStepsModal={showStepsModal} closeStepsModal={() => setShowStepsModal(false)} />
      ):('')}
        {/* sellbillbookStatus ? <SellBillBook selectedBillviewDate={singleBillData.billDate}/> : ''} */}
      <div className="modal fade" id="cancelBill">
        <div className="modal-dialog cancelBill_modal_popup">
          <div className="modal-content">
            <div className="modal-header date_modal_header smartboard_modal_header">
              <h5 className="modal-title header2_text" id="staticBackdropLabel">
                Cancel Bill
              </h5>
              <img
                src={close}
                alt="image"
                className="close_icon"
                onClick={closePopup}
              />
            </div>
            <div className="modal-body">
              <div className=" row terms_popup ">
                <div className="col-lg-3"></div>
                <div className="col-lg-7">
                  <div className="cancel_img">
                    <img src={cancel} alt="img" className="" />
                  </div>
                  <div className="cancel_bill">
                    <p className="cancel_billp">
                      Are you sure you want to cancel the bill
                    </p>
                  </div>
                  <div className="col-lg-2"></div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-1"></div>
                <div className="col-lg-10">
                  <p className="desc-tag">
                    Please note that cancellation of bill result in ledger
                    adjustments (rol back) and you will see an adjustment record
                    in ledger for the same bill
                  </p>
                </div>
                <div className="col-lg-1"></div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="d-flex">
                <button
                  type="button"
                  className="secondary_btn mr-2"
                  onClick={closePopup}
                  data-bs-dismiss="modal"
                >
                  NO
                </button>

                <button
                  type="button"
                  className="primary_btn"
                  onClick={() => cancelBill(singleBillData)}
                  data-bs-dismiss="modal"
                >
                  YES
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SellBillView;
