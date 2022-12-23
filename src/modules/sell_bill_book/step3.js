import { Modal } from "react-bootstrap";
import "../../modules/buy_bill_book/step2.scss";
import "../sell_bill_book/step3.scss";
import { useState, useEffect } from "react";
import single_bill from "../../assets/images/bills/single_bill.svg";
import d_arrow from "../../assets/images/d_arrow.png";
import "../../modules/buy_bill_book/step1.scss";
import {
  getPartnerData,
  getSystemSettings,
  getOutstandingBal,
} from "../../actions/billCreationService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CommissionCard from "../../components/commissionCard";
import CommonCard from "../../components/card";
import { getText } from "../../components/getText";
import {
  postsellbillApi,
  editbuybillApi,
} from "../../actions/billCreationService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import SellbillStep2Modal from "./step2";
import clo from "../../assets/images/clo.png";
const SellbillStep3Modal = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const navigate = useNavigate();
  const partnerSelectedData = JSON.parse(localStorage.getItem("selectedBuyer"));
  const transpoSelectedData = JSON.parse(
    localStorage.getItem("selectedTransporter")
  );
  const [partyType, setPartnerType] = useState("Buyer");
  const [includeComm, setIncludeComm] = useState("");
  const [includeRetComm, setIncludeRetComm] = useState("");
  const [addRetComm, setAddRetComm] = useState(false);
  const [outBal, setOutsBal] = useState(0);
  const [outBalformStatusvalue, setOutBalformStatusvalue] = useState(false);
  const editStatus = props.billEditStatus;
  const billEditItem = props.slectedSellCropsArray[0];
  var step2CropEditStatus = props.step2CropEditStatus;
  const [commValue, getCommInput] = useState(0);
  const [retcommValue, getRetCommInput] = useState(0);
  const [mandifeeValue, getMandiFeeInput] = useState(0);
  const [transportationValue, getTransportationValue] = useState(0);
  const [laborChargeValue, getLaborChargeValue] = useState(0);
  const [rentValue, getRentValue] = useState(0);
  const [levisValue, getlevisValue] = useState(0);
  const [otherfeeValue, getOtherfeeValue] = useState(0);
  const [cashRcvdValue, getCashRcvdValue] = useState(0);
  const [advancesValue, getAdvancesValue] = useState(0);

  const [tableChangeStatus, setTableChangeStatus] = useState(false);
  var tableChangeStatusval;
  const [allGroups, setAllGroups] = useState([]);
  useEffect(() => {
    console.log(props.slectedSellCropsArray[0],"step3")
    fetchPertnerData(partyType);
    var cropArrays = editStatus
      ? step2CropEditStatus
        ? props.slectedSellCropsArray[0].lineItems
        : billEditItem.lineItems
      : props.slectedSellCropsArray;
    var h = [];
    for (var c = 0; c < cropArrays.length; c++) {
      if (
        cropArrays[c].qtyUnit == "kgs" ||
        cropArrays[c].qtyUnit == "loads" ||
        cropArrays[c].qtyUnit == "pieces"
      ) {
        h.push(cropArrays[c]);
      } else if (cropArrays[c].qtyUnit == "") {
        h.push(cropArrays[c]);
      }
    }
    if (cropArrays.length == h.length) {
      tableChangeStatusval = true;
      setTableChangeStatus(true);
    }
    if (partnerSelectedData != null) {
      getOutstandingBal(clickId, partnerSelectedData.partyId).then((res) => {
        setOutsBal(res.data.data == null ? 0 : res.data.data);
      });
    }
    getGrossTotalValue(
      editStatus
        ? step2CropEditStatus
          ? props.slectedSellCropsArray[0].lineItems
          : props.slectedSellCropsArray
        : props.slectedSellCropsArray
    );
    getSystemSettings(clickId).then((res) => {
      var response = res.data.data.billSetting;
      for (var i = 0; i < response.length; i++) {
        if (response[i].billType === "SELL") {
          if (response[i].formStatus === 1) {
           
            Object.assign(response[i], {
              settingName: response[i].settingName,
              tableType: 0,
              subText: "",
              subText2: "",
              totalVal: 0,
            });

            if (
              response[i].settingName === "DEFAULT_RATE_TYPE" ||
              response[i].settingName === "SKIP_INDIVIDUAL_EXP" ||
              response[i].settingName == "WASTAGE"
            ) {
              console.log("hey");
            } else {
              listSettings(response[i].settingName, response, i);
              allGroups.push(response[i]);
            }
             if (response[i].settingName === "OUT_ST_BALANCE")
              setOutBalformStatusvalue(true);
          }

          if (response[i].settingName === "COMMISSION") {
            setIncludeComm(response[i].includeInLedger == 1 ? true : false);
          } else if (response[i].settingName === "RETURN_COMMISSION") {
            setAddRetComm(response[i].addToGt == 1 ? true : false);
            setIncludeRetComm(response[i].includeInLedger == 1 ? true : false);
          }
        }
      }
    });
   
  }, []);
  var gTotal = 0;
  const [cashRcdStatus, setcashRcdStatus] = useState(false);
  const getSingleValues = (val, v) => {
    return editStatus ? (step2CropEditStatus ? val : val) : v;
  };
  const listSettings = (name, res, index) => {
    var totalQty = 0;
    var item = editStatus
      ? step2CropEditStatus
        ? props.slectedSellCropsArray[0].lineItems
        : props.slectedSellCropsArray[0].lineItems
      : props.slectedSellCropsArray;
    for (var i = 0; i < item.length; i++) {
      totalQty += parseInt(item[i].qty);
    }
    let updatedItem = res.map((item, j) => {
      if (j == index) {
        switch (name) {
          case "COMMISSION":
            var trVa = editStatus
              ? step2CropEditStatus
                ? (billEditItem?.comm / gTotal) * 100
                : (billEditItem?.comm / billEditItem?.grossTotal) * 100
              : res[j].value;
            var totalV = editStatus
              ? step2CropEditStatus
                ? (trVa / 100) * gTotal
                : billEditItem.comm
              : (res[j].value / 100) * gTotal;
            getCommInput(trVa);
            res[j] = {
              ...res[j],
              tableType: 2,
              subText: "Default Percentage %",
              value: trVa.toFixed(2),
              totalVal: totalV.toFixed(2),
            };
            break;
          case "RETURN_COMMISSION":
            var trVa = editStatus
              ? step2CropEditStatus
                ? (billEditItem?.rtComm / gTotal) * 100
                : (billEditItem?.rtComm / billEditItem?.grossTotal) * 100
              : res[j].value;
            var totalV = editStatus
              ? step2CropEditStatus
                ? (trVa / 100) * gTotal
                : billEditItem.rtComm
              : (res[j].value / 100) * gTotal;
            getRetCommInput(trVa);
            res[j] = {
              ...res[j],
              tableType: 2,
              subText: "Default Percentage %",
              value: trVa.toFixed(2),
              totalVal: totalV.toFixed(2),
            };
            break;
          case "MANDI_FEE":
            var trVa = editStatus
              ? step2CropEditStatus
                ? (billEditItem?.mandiFee / gTotal) * 100
                : (billEditItem?.mandiFee / billEditItem?.grossTotal) * 100
              : res[j].value;
            var totalV = editStatus
              ? step2CropEditStatus
                ? (trVa / 100) * gTotal
                : billEditItem.mandiFee
              : (trVa / 100) * gTotal;
              console.log(totalV,trVa,gTotal)
            getMandiFeeInput(trVa);
            res[j] = {
              ...res[j],
              tableType: 2,
              subText: "Default Percentage %",
              value: trVa.toFixed(2),
              totalVal: totalV.toFixed(2),
            };

            break;
          case "TRANSPORTATION":
            var trVa = editStatus
              ? tableChangeStatusval
                ? res[j].value
                : billEditItem?.transportation / totalQty
              : res[j].value;
            var totalV = editStatus
              ? step2CropEditStatus
                ? totalQty * trVa
                : billEditItem.transportation
              : res[j].value * totalQty;
            getTransportationValue(trVa);
            res[j] = {
              ...res[j],
              tableType: 3,
              subText: "Per Bag/Box /Creat /Sac",
              subText2: "Number of Units",
              totalVal: totalV.toFixed(2),
              value: trVa.toFixed(2),
            };
            break;
          case "RENT":
            var trVa = editStatus
              ? tableChangeStatusval
                ? res[j].value
                : billEditItem?.rent / totalQty
              : res[j].value;
            var totalV = editStatus
              ? step2CropEditStatus
                ? totalQty * trVa
                : billEditItem.rent
              : res[j].value * totalQty;
            getRentValue(trVa);
            res[j] = {
              ...res[j],
              tableType: 3,
              subText: "Per Bag/Box /Creat /Sac",
              subText2: "Number of Units",
              totalVal: totalV.toFixed(2),
              value: trVa.toFixed(2),
            };
            break;
          case "LABOUR_CHARGES":
            var trVa = editStatus
              ? tableChangeStatusval
                ? res[j].value
                : billEditItem?.labourCharges / totalQty
              : res[j].value;
            var totalV = editStatus
              ? step2CropEditStatus
                ? totalQty * trVa
                : billEditItem.labourCharges
              : res[j].value * totalQty;
            getLaborChargeValue(trVa);
            res[j] = {
              ...res[j],
              tableType: 3,
              subText: "Per Bag/Box /Creat /Sac",
              subText2: "Number of Units",
              totalVal: totalV.toFixed(2),
              value: trVa.toFixed(2),
            };
            break;
          case "GOVT_LEVIES":
            var trVa = getSingleValues(billEditItem?.govtLevies, res[j].value);
           
            getlevisValue(trVa);
            res[j] = { ...res[j], tableType: 1, value: trVa };
            break;
          case "OTHER_FEE":
            var trVa = getSingleValues(billEditItem?.otherFee, res[j].value);
            getOtherfeeValue(trVa);
            res[j] = { ...res[j], tableType: 1, value: trVa };
            break;
          
          case "CASH_RECEIVED":
            var trVa = getSingleValues(billEditItem?.cashRcvd, res[j].value);
            getCashRcvdValue(trVa);
            setcashRcdStatus(true);
            res[j] = { ...res[j], tableType: 1, value: trVa };
            break;
          case "ADVANCES":
            var trVa = getSingleValues(billEditItem?.advance, res[j].value);
            getAdvancesValue(trVa);
            res[j] = { ...res[j], tableType: 1, value: trVa };
            break;
        }
        return { ...res[j] };
      } else {
        return { ...res[j] };
      }
    });
    setAllGroups(updatedItem);

    // return type;
  };
  const [getPartyItem, setGetPartyItem] = useState(null);
  let [partnerData, setpartnerData] = useState([]);
  const [selectedDate, setStartDate] = useState(props.sellBilldateSelected);
  const partnerSelectDate = moment(selectedDate).format("YYYY-MM-DD");
  const fetchPertnerData = (type) => {
    var partnerType = "Buyer";
    if (type == "Transporter") {
      partnerType = "TRANSPORTER";
    } else if (type == "Buyer") {
      partnerType = "BUYER";
    }
    getPartnerData(clickId, partnerType)
      .then((response) => {
        console.log(response);
        setpartnerData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [partySelectStatus, setPartySelectStatus] = useState(false);
  const partySelect = (item, type) => {
    setGetPartyItem(item);
    if (type == "Transporter") {
      setTranspoDataStatus(false);
      localStorage.setItem("selectedTransporter", JSON.stringify(item));
      getOutstandingBal(clickId, item.partyId).then((res) => {
        setOutsBal(res.data.data);
      });
    } else if (type == "Buyer") {
      setTranspoDataStatus(false);
      localStorage.setItem("selectedBuyer", JSON.stringify(item));
      setPartySelectStatus(true);
    }
    setPartnerType(type);
  };
  const [searchPartyItem, setSearchPartyItem] = useState("");
  const [partnerDataStatus, setPartnerDataStatus] = useState(false);
  const [transpoDataStatus, setTranspoDataStatus] = useState(false);
  const partnerClick = (type) => {
    if (type == "Buyer") {
      setPartnerDataStatus(true);
      setPartnerType(type);
      fetchPertnerData(type);
    } else if (type == "Transporter") {
      setTranspoDataStatus(true);
      setPartnerType(type);
      fetchPertnerData(type);
    }
  };

  const [grossTotal, setGrossTotal] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);
  const getGrossTotalValue = (items) => {
    var total = 0;
    var totalunitvalue = 0;
    for (var i = 0; i < items.length; i++) {
      total += editStatus
        ? step2CropEditStatus
          ? items[i].total
          : items[i].grossTotal
        : items[i].total;
      totalunitvalue += editStatus
        ? step2CropEditStatus
          ? parseInt(items[i].qty)
          : items[i].lineItems[i].qty
        : parseInt(items[i].qty);
        gTotal = total;
      setGrossTotal(total);
      setTotalUnits(totalunitvalue);
    }
  };
  const getTotalValue = (value) => {
    return (value / 100) * grossTotal;
  };
  const getTotalUnits = (val) => {
    return (val * totalUnits);
  };
  const getTotalBillAmount = () => {
    var t = Number(
      getTotalValue(commValue) +
        getTotalUnits(transportationValue) +
        getTotalUnits(laborChargeValue) +
        getTotalUnits(rentValue) +
        getTotalValue(mandifeeValue) +
        Number(levisValue) +
        Number(otherfeeValue) +
        Number(advancesValue)
    );
    let totalValue = grossTotal + t;
    if (addRetComm) {
      return (totalValue + getTotalValue(retcommValue)).toFixed(2);
    } else {
      return (totalValue - getTotalValue(retcommValue)).toFixed(2);
    }
  };
  const getTotalRcble = () =>{
    return (Number(getTotalBillAmount()) - Number(cashRcvdValue).toFixed(2));
  }
  const getFinalLedgerbalance = () => {
    var t = Number(
      getTotalUnits(transportationValue) +
        getTotalUnits(laborChargeValue) +
        getTotalUnits(rentValue) +
        getTotalValue(mandifeeValue) +
        Number(levisValue) +
        Number(otherfeeValue) +
        Number(advancesValue)
    );
    var finalValue = grossTotal + t;
    var finalVal = 0;
    if (includeComm) {
      finalVal = finalValue + getTotalValue(commValue);
    }
    if (addRetComm) {
      if (includeRetComm) {
        finalVal = finalVal + getTotalValue(retcommValue);
      }
    } else {
      if (includeRetComm) {
        finalVal = finalVal - getTotalValue(retcommValue);
      }
    }
    return (Number(finalVal) + outBal - Number(cashRcvdValue)).toFixed(2);
  };
  var lineItemsArray = [];
  // var cropArray = props.slectedSellCropsArray;
  var cropArray = editStatus
    ? step2CropEditStatus
      ? props.slectedSellCropsArray[0].lineItems
      : billEditItem.lineItems
    : props.slectedSellCropsArray;
  var len = cropArray.length;
  for (var i = 0; i < len; i++) {
    lineItemsArray.push({
      cropId: cropArray[i].cropId,
      qty: parseInt(cropArray[i].qty),
      qtyUnit: cropArray[i].qtyUnit,
      rate: parseInt(cropArray[i].rate),
      total: cropArray[i].total,
      wastage: cropArray[i].wastage,
      weight: parseInt(cropArray[i].weight),
      id: cropArray[i].id,
      sellBillId: billEditItem.billId,
      //bags:[],
      partyId: billEditItem.buyerId,
      status: cropArray[i].status,
      rateType:
        cropArray[i].rateType == "kgs" ? "RATE_PER_KG" : "RATE_PER_UNIT",
      bags: cropArray[i].bags,
    });
  }
  const getActualRcvd = () => {
    var actualRcvd = getTotalBillAmount() - Number(cashRcvdValue);
    if (!includeComm) {
      actualRcvd = actualRcvd - getTotalValue(commValue);
    }
    if (!includeRetComm) {
      if (addRetComm) {
        actualRcvd = (actualRcvd - getTotalValue(retcommValue)).toFixed(2);
      } else {
        actualRcvd = (actualRcvd + getTotalValue(retcommValue)).toFixed(2);
      }
    }
    return actualRcvd;
  };
  const sellBillRequestObj = {
    actualReceivable: Number(getActualRcvd()),
    advance: Number(advancesValue),
    billDate: partnerSelectDate,
    billStatus: "Completed",
    caId: clickId,
    cashRcvd: Number(cashRcvdValue),
    comm: Number(getTotalValue(commValue).toFixed(2)),
    commIncluded: includeComm,
    commShown: true,
    comments: "hi",
    createdBy: 0,
    buyerId: partnerSelectedData.partyId,
    govtLevies: Number(levisValue),
    grossTotal: grossTotal,
    labourCharges: Number(getTotalUnits(laborChargeValue).toFixed(2)),
    less: addRetComm,
    lineItems: lineItemsArray,
    mandiFee:  Number(getTotalValue(mandifeeValue).toFixed(2)),
    otherFee: Number(otherfeeValue),
    outStBal: outBal,
    paidTo: 100,
    rent: Number(getTotalUnits(rentValue).toFixed(2)),
    rtComm: Number(getTotalValue(retcommValue).toFixed(2)),
    rtCommIncluded: includeRetComm,
    totalReceivable:Number(getTotalRcble().toFixed(2)),
    transportation: Number(getTotalUnits(transportationValue).toFixed(2)),
    transporterId:
      transpoSelectedData != null ? transpoSelectedData.partyId : "",
    updatedOn: "",
    writerId: 0,
    timeStamp: "",
  };
  //console.log(props.slectedSellCropsArray[0].lineItems,"values");
  const editBillRequestObj = {
    action: "UPDATE",
    billAttributes: {
      actualPayRecieevable: Number(getActualRcvd()),
      advance: Number(advancesValue),
      billDate: partnerSelectDate,
      cashRcvd: Number(cashRcvdValue),
      comm: Number(getTotalValue(commValue).toFixed(2)),
      commIncluded: includeComm,
      comments: "hi",
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
      govtLevies: Number(levisValue),
      grossTotal: grossTotal,
      labourCharges: Number(getTotalUnits(laborChargeValue).toFixed(2)),
      less: addRetComm,
      mandiFee:  Number(getTotalValue(mandifeeValue).toFixed(2)),
      misc: Number(otherfeeValue),
      otherFee: Number(otherfeeValue).toFixed(2),
      outStBal: outBal,
      paidTo: 0,
      partyId: billEditItem.buyerId,//partnerSelectedData.partyId,
      rent: Number(getTotalUnits(rentValue).toFixed(2)),
      rtComm: Number(getTotalValue(retcommValue).toFixed(2)),
      rtCommIncluded: includeRetComm,
      totalPayRecieevable: Number(getTotalRcble().toFixed(2)),
      transportation: Number(getTotalUnits(transportationValue).toFixed(2)),
      transporterId:
        transpoSelectedData != null ? transpoSelectedData.partyId : 0,
    },
    billId: billEditItem.billId,
    billType: "SELL",
    caBSeq: billEditItem.caBSeq,
    caId: clickId,
    lineItems: step2CropEditStatus ? lineItemsArray : [],
    updatedBy: 0,
    updatedOn: "",
    writerId: 0,
  };
  // post bill request api call
  const postsellbill = () => {
    if (editStatus) {
      editbuybillApi(editBillRequestObj).then(
        (response) => {
          if (response.data.status.type === "SUCCESS") {
            toast.success(response.data.status.message, {
              toastId: "success1",
            });
            console.log(editBillRequestObj, "edit bill request");
            console.log(response);
            props.closeStep3Modal();
            localStorage.setItem("stepOneSingleBook",false);
            localStorage.setItem("billViewStatus",false)
            navigate("/sellbillbook");
          }
        },
        (error) => {
          toast.error(error.response.data.status.description, {
            toastId: "error1",
          });
        }
      );
    } else {
      console.log(sellBillRequestObj, "post req");
      postsellbillApi(sellBillRequestObj).then(
        (response) => {
          if (response.data.status.message === "SUCCESS") {
            toast.success(response.data.status.description, {
              toastId: "success1",
            });
          
            props.closeStep3Modal();
            localStorage.setItem("stepOneSingleBook",false);
            navigate("/sellbillbook");
          }
        },
        (error) => {
          toast.error(error.response.data.status.description, {
            toastId: "error1",
          });
        }
      );
    }
  };

  const [enterVal, setEnterVal] = useState();
  const advLevOnchangeEvent = (groupLiist, index) => (e) => {
    var val = e.target.value.replace(/[^0-9.]/g,'');

    let updatedItems = groupLiist.map((item, i) => {
      if (i == index) {
        getAdditionValues(groupLiist[i], val);
        return { ...groupLiist[i], value: val };
      } else {
        return { ...groupLiist[i] };
      }
    });
    setAllGroups([...updatedItems]);

    setEnterVal(val);
  };
  const fieldOnchangeEvent = (groupLiist, index) => (e) => {
    var val = e.target.value.replace(/[^0-9.]/g,'');

    let updatedItem3 = groupLiist.map((item, i) => {
      if (i == index) {
        getAdditionValues(groupLiist[i], val);
        return { ...groupLiist[i], value: val, totalVal: Number(getTotalUnits(val).toFixed(2)) };
      } else {
        return { ...groupLiist[i] };
      }
    });
    setAllGroups([...updatedItem3]);

    setEnterVal(val);
  };
  const fieldOnchangeTotals = (groupLiist, index) => (e) => {
    var val = e.target.value.replace(/[^0-9.]/g, "");
    let updatedItem = groupLiist.map((item, i) => {
      if (i == index) {
        var v = val / totalUnits;
        if (v != 0) {
          v = v.toFixed(2);
        }
        getAdditionValues(groupLiist[i], v);
        return { ...groupLiist[i], value: v, totalVal: Number(val.toFixed(2)) };
      } else {
        return { ...groupLiist[i] };
      }
    });
    setAllGroups([...updatedItem]);
  };
  const commRetCommOnchangeEvent = (groupLiist, index) => (e) => {
    var val = e.target.value.replace(/[^0-9.]/g, "");
    // if (val != 0) {
    let updatedItem2 = groupLiist.map((item, i) => {
      if (i == index) {
        getAdditionValues(groupLiist[i], val);
        return {
          ...groupLiist[i],
          value: val,
          totalVal: Number(getTotalValue(val).toFixed(2)),
        };
      } else {
        return { ...groupLiist[i] };
      }
    });
    setAllGroups([...updatedItem2]);
    // }
    setEnterVal(val);
  };
  const commRetComTotalOnchangeEvent = (groupLiist, index) => (e) => {
    var val = e.target.value.replace(/[^0-9.]/g, "");
    let updatedItem = groupLiist.map((item, i) => {
      if (i == index) {
        var v = (val / grossTotal) * 100;
        if (v != 0) {
          v = v.toFixed(2);
        }
        getAdditionValues(groupLiist[i], v);
        return { ...groupLiist[i], value: v, totalVal: Number(val.toFixed(2)) };
      } else {
        return { ...groupLiist[i] };
      }
    });
    setAllGroups([...updatedItem]);
  };
  const getAdditionValues = (groupLiist, v) => {
    if (groupLiist.settingName.toLowerCase() == "transportation") {
      getTransportationValue(v);
    }
    if (groupLiist.settingName.toLowerCase() == "labour_charges") {
      getLaborChargeValue(v);
    }
    if (groupLiist.settingName.toLowerCase() == "rent") {
      getRentValue(v);
    }
    if (groupLiist.settingName == "COMMISSION") {
      getCommInput(v);
    }
    if (groupLiist.settingName == "RETURN_COMMISSION") {
      getRetCommInput(v);
    }
    if (groupLiist.settingName == "MANDI_FEE") {
      if (v != "") {
        getMandiFeeInput(v);
      }
    }
    if (groupLiist.settingName == "OTHER_FEE") {
      if (v != "") {
        getOtherfeeValue(v);
      }
    }
    if (groupLiist.settingName == "GOVT_LEVIES") {
      if (v != "") {
        getlevisValue(v);
      }
    }
    if (groupLiist.settingName == "CASH_RECEIVED") {
      if (v != "") {
        getCashRcvdValue(v);
      }
    }
    if (groupLiist.settingName == "ADVANCES") {
      if (v != "") {
        getAdvancesValue(v);
      }
    }
  };
  const [showCropModal, setShowCropModal] = useState(false);
  const [showCropModalStatus, setShowCropModalStatus] = useState(false);
  const [cropEditvalArray, setcropEditvalArray] = useState([]);
  const editCropTable = (cropEditArray) => {
    step2CropTableOnclick(cropEditArray);
  };
  const step2Cancel = (cropEditArray) => {
    if (!editStatus) {
      if (step2CropEditStatus) {
        step2CropTableOnclick(cropEditArray);
      }
    } else {
      setShowCropModalStatus(false);
      setShowCropModal(false);

    }
    props.closeStep3Modal();
  };
  const step2CropTableOnclick = (cropEditArray) =>{
    step2CropEditStatus = true;
    setShowCropModalStatus(true);
    setShowCropModal(true);
    setcropEditvalArray(cropEditArray);
  }
  const resetInput = (e) => {
    if (e.target.value == 0) {
      e.target.value = "";
    }
  };
  return (
    <Modal
      show={props.show}
      close={props.closeStep3Modal}
      className="cropmodal_poopup"
    >
      <div className="modal-header date_modal_header smartboard_modal_header">
        <h5 className="modal-title header2_text" id="staticBackdropLabel">
          Additions/Deductions
        </h5>
        <img alt="image" src={clo} onClick={() => step2Cancel(billEditItem.lineItems)} />
      </div>

      <div className="modal-body">
        <div className="row">
          <div className="col-lg-3 pr-0">
            <h5 className="head_modal">Bill Information </h5>

            <div className="party_div">
              <div
                className="selectparty_field d-flex align-items-center justify-content-between"
                onClick={() => partnerClick("Buyer")}
              >
                <div className="partner_card">
                  <div className="d-flex align-items-center">
                    <img src={single_bill} className="icon_user" />
                    <div>
                      <h5>
                        {editStatus
                          ? partySelectStatus
                            ? partnerSelectedData.partyName
                            : billEditItem.farmerName
                          : partnerSelectedData.partyName}
                      </h5>
                      <h6>
                        {editStatus
                          ? partySelectStatus
                            ? partnerSelectedData.partyType
                            : billEditItem.partyType
                          : partnerSelectedData.partyType}{" "}
                        -{" "}
                        {editStatus
                          ? partySelectStatus
                            ? partnerSelectedData.partyId
                            : billEditItem.buyerId
                          : partnerSelectedData.partyId}{" "}
                        |{" "}
                        {editStatus
                          ? partySelectStatus
                            ? partnerSelectedData.mobile
                            : billEditItem.mobile
                          : partnerSelectedData.mobile}
                      </h6>
                      {/* <h6>
                        {partnerSelectedData.partyType} -{" "}
                        {partnerSelectedData.partyId} |{" "}
                        {partnerSelectedData.mobile}
                      </h6> */}
                      <p>{partnerData.buyerAddress}</p>
                    </div>
                  </div>
                </div>
                <img src={d_arrow} />
              </div>
            </div>
            <div className="date_sec date_step3">
              <div className="date_col d-flex align-items-center justify-content-between">
                <DatePicker
                  dateFormat="dd-MMM-yyyy"
                  selected={selectedDate}
                  onChange={(date) => setStartDate(date)}
                  className="form-control"
                  placeholder="Date"
                  maxDate={new Date()}
                />
                <label className="custom-control custom-checkbox mb-0">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="modal_checkbox"
                    value="my-value"
                  />
                  <span className="custom-control-indicator"></span>
                  <span className="custom-control-description">
                    Set as a Default Date
                  </span>
                </label>
              </div>
            </div>
            {transpoSelectedData != null ? (
              <div className="transporter_div">
                <div
                  className="selectparty_field d-flex align-items-center justify-content-between"
                  // onClick={() => partnerClick("Transporter")}
                >
                  <div className="partner_card">
                    <div className="d-flex align-items-center">
                      <img src={single_bill} className="icon_user" />
                      <div>
                        <h5>{transpoSelectedData.partyName}</h5>
                        <h6>
                          {transpoSelectedData.partyType} -{" "}
                          {transpoSelectedData.partyId} |{" "}
                          {transpoSelectedData.mobile}
                        </h6>
                        <p>{transpoSelectedData.address.addressLine}</p>
                      </div>
                    </div>
                  </div>
                  <img src={d_arrow} />
                </div>
                {transpoDataStatus ? (
                  <div className="partners_div" id="scroll_style">
                    <div className="d-flex searchparty" role="search">
                      <input
                        className="form-control mb-0"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        onChange={(event) =>
                          setSearchPartyItem(event.target.value)
                        }
                      />
                    </div>

                    <div>
                      {partnerData.length > 0 ? (
                        <div>
                          <ul>
                            {partnerData
                              .filter((item) => {
                                if (searchPartyItem === "") {
                                  return item;
                                } else if (
                                  item.partyName
                                    .toLowerCase()
                                    .includes(searchPartyItem.toLowerCase())
                                ) {
                                  return item;
                                } else if (
                                  item.mobile
                                    .toLowerCase()
                                    .includes(searchPartyItem)
                                ) {
                                  return item;
                                } else if (
                                  item.partyId
                                    .toString()
                                    .toLowerCase()
                                    .includes(searchPartyItem)
                                ) {
                                  return item;
                                }
                              })
                              .map((item) => {
                                return (
                                  <li
                                    key={item.partyId}
                                    onClick={() =>
                                      partySelect(item, "Transporter")
                                    }
                                    className={
                                      "nav-item " +
                                      (item == getPartyItem
                                        ? "active_class"
                                        : "")
                                    }
                                  >
                                    <div className="partner_card">
                                      <div className="d-flex align-items-center">
                                        <img
                                          src={single_bill}
                                          className="icon_user"
                                        />
                                        <div>
                                          <h5>{item.partyName}</h5>
                                          <h6>
                                            {item.trader
                                              ? "TRADER"
                                              : item.partyType}{" "}
                                            - {item.partyId} | {item.mobile}
                                          </h6>
                                          <p>{item.address.addressLine}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      ) : (
                        <p></p>
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <div>
                {/* <div
                  className="selectparty_field d-flex align-items-center justify-content-between"
                  onClick={() => partnerClick("Transporter")}
                ></div> */}
              </div>
            )}
            <h5 className="date_sec head_modal">Crop Information </h5>
            <div className="selectparty_field edit_crop_item_div">
              <div className="d-flex align-items-center justify-content-between">
                <p className="d-flex align-items-center">
                  {editStatus ? (
                    <div className="d-flex">
                      <img
                        src={billEditItem.lineItems[0]?.imageUrl}
                        className="edit_crop_item"
                      />
                      <p className="edit_crop_item_len d-flex align-items-center">
                        <p>{billEditItem.lineItems.length}</p>
                        <span className="ml-3">Crops</span>
                      </p>
                    </div>
                  ) : (
                    <div className="d-flex">
                      <img
                        src={props.slectedSellCropsArray[0].imageUrl}
                        className="edit_crop_item"
                      />
                      <p className="edit_crop_item_len d-flex align-items-center">
                        <p>{props.slectedSellCropsArray.length}</p>
                        <span className="ml-3">Crops</span>
                      </p>
                    </div>
                  )}
                </p>
                <p onClick={() => editCropTable(billEditItem.lineItems)}>
                  Edit
                </p>
              </div>
            </div>
            {/* <div className="cropinfo_div" onClick={()=>editCropTable(billEditItem.lineItems)}><p>edit</p> </div> */}
          </div>
          <div className="col-lg-6">
            <h5 className="head_modal">Additions/Deductions</h5>
            <div
              className="card default_card comm_total_card"
              id="scroll_style"
            >
              {allGroups.length > 0
                ? allGroups.map((item, index) => {
                    if (item.tableType == 2) {
                      return (
                        <CommissionCard
                          title={item.settingName}
                          rateTitle={item.subText}
                          onChange={commRetCommOnchangeEvent(allGroups, index)}
                          inputValue={allGroups[index].value}
                          inputText={allGroups[index].totalVal}
                          totalTitle="Total"
                          totalOnChange={commRetComTotalOnchangeEvent(
                            allGroups,
                            index
                          )}
                        />
                      );
                    } else if (allGroups[index].tableType == 3) {
                      return tableChangeStatus ? (
                        <div className="comm_cards">
                          <div className="card input_card">
                            <div className="row">
                              <div className="col-lg-3 title_bg">
                                <h5 className="comm_card_title mb-0">
                                  {getText(allGroups[index].settingName)}
                                </h5>
                              </div>
                              <div className="col-lg-9 col-sm-12 col_left_border">
                                <input
                                  type="text"
                                  placeholder=""
                                  onFocus={(e) => resetInput(e)}
                                  value={allGroups[index].value}
                                  onChange={advLevOnchangeEvent(
                                    allGroups,
                                    index
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <CommonCard
                          title={allGroups[index].settingName}
                          rateTitle={allGroups[index].subText}
                          onChange={fieldOnchangeEvent(allGroups, index)}
                          inputValue={allGroups[index].value}
                          inputText={allGroups[index].totalVal}
                          totalTitle="Total"
                          unitsTitle={allGroups[index].subText2}
                          units={totalUnits}
                          onChangeTotals={fieldOnchangeTotals(allGroups, index)}
                        />
                      );
                    } else if (allGroups[index].tableType == 1) {
                      return (
                        <div className="comm_cards">
                          <div className="card input_card">
                            <div className="row">
                              <div className="col-lg-3 title_bg">
                                <h5 className="comm_card_title mb-0">
                                  {getText(allGroups[index].settingName)}
                                </h5>
                              </div>
                              <div className="col-lg-9 col-sm-12 col_left_border">
                                <input
                                  type="text"
                                  placeholder=""
                                  onFocus={(e) => resetInput(e)}
                                  value={allGroups[index].value}
                                  onChange={advLevOnchangeEvent(
                                    allGroups,
                                    index
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })
                : ""}
            </div>
          </div>
          <div className="col-lg-3 pl-0">
            <h5 className="head_modal">Totals</h5>
            <div className="default_card comm_total_card total_bal">
              <div className="totals_value pt-0">
                <h5>Gross Total (₹)</h5>
                <h6 className="black_color">{grossTotal.toFixed(2)}</h6>
              </div>
              <div className="totals_value">
                <h5>Total Bill Amount (₹)</h5>
                <h6 className="color_green">{getTotalBillAmount()}</h6>
              </div>
              {outBalformStatusvalue ? (
                <div className="totals_value">
                  <h5>Outstanding Balance (₹)</h5>
                  <h6 className="color_green">{outBal.toFixed(2)}</h6>
                </div>
              ) : (
                ""
              )}

              {cashRcvdValue != 0 ? (
                <div className="totals_value">
                  <h5>Cash Received</h5>
                  <h6 className="black_color">-
                  {billEditItem?.cashRcvd
                      ? cashRcdStatus
                        ? cashRcvdValue
                        : billEditItem?.cashRcvd
                      : cashRcvdValue}
                  </h6>
                </div>
              ) : (
                ""
              )}
              {outBalformStatusvalue ? (
                <div className="totals_value">
                  <h5>Final Ledger Balance (₹)</h5>
                  <h6 className="color_green">{getFinalLedgerbalance()}</h6>
                </div>
              ) : (
                <div className="totals_value">
                  <h5>Total Receivables (₹)</h5>
                  <h6 className="color_green">
                    {getTotalRcble().toFixed(2)}
                  </h6>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bottom_div main_div popup_bottom_div step3_bottom">
        <div className="d-flex align-items-center justify-content-end">
          <button className="primary_btn" onClick={postsellbill}>
            Next
          </button>
        </div>
      </div>
      <ToastContainer />
      {showCropModalStatus ? (
        <SellbillStep2Modal
          show={showCropModal}
          closeStep2CropModal={() => setShowCropModal(false)}
          cropTableEditStatus={true}
          cropEditObject={cropEditvalArray}
          billEditStatus={editStatus?true:false}
          slectedCropstableArray={props.slectedSellCropsArray}
        />
      ) : (
        ""
      )}
    </Modal>
  );
};
export default SellbillStep3Modal;
