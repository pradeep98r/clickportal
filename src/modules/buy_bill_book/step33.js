import { useSelector, useDispatch } from "react-redux";
import { selectSteps } from "../../reducers/stepsSlice";
import "../../modules/buy_bill_book/step2.scss";
import "../../modules/buy_bill_book/step3.scss";
import { useState, useEffect } from "react";
import "../../modules/buy_bill_book/step1.scss";
import moment from "moment";
import {
  getSystemSettings,
  getOutstandingBal,
  getDefaultSystemSettings,
} from "../../actions/billCreationService";
import CommissionCard from "../../components/commissionCard";
import CommonCard from "../../components/card";
import {
  postbuybillApi,
  editbuybillApi,
} from "../../actions/billCreationService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { getText } from "../../components/getText";
import Step3PartySelect from "./step3PartySelect";
import $ from "jquery";
import { selectTrans } from "../../reducers/transSlice";
import { selectBuyer } from "../../reducers/buyerSlice";
import {
  tableEditStatus,
  fromBillbook,
} from "../../reducers/billEditItemSlice";

const Step33 = (props) => {
  const users = useSelector((state) => state.buyerInfo);
  const billEditItemInfo = useSelector((state) => state.billEditItemInfo);
  const billDateSelected =
    billEditItemInfo.selectedBillDate !== null
      ? billEditItemInfo.selectedBillDate
      : new Date();
  var step2CropEditStatus = billEditItemInfo?.step2CropEditStatus;
  const transusers = useSelector((state) => state.transInfo);
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const navigate = useNavigate();
  var partnerSelectDate = moment(billDateSelected).format("YYYY-MM-DD");
  var buyerInfo = users.buyerInfo;
  const editStatus = billEditItemInfo?.billEditStatus;
  const [partnerSelectedData, setpartnerSelectedData] = useState(
    //users.buyerInfo
    editStatus ? billEditItemInfo.selectedBillInfo : buyerInfo
  );
  const [transpoSelectedData, setTranspoSelectedData] = useState(
    transusers.transInfo
  );
  const [includeComm, setIncludeComm] = useState("");
  const [includeRetComm, setIncludeRetComm] = useState("");
  const [addRetComm, setAddRetComm] = useState(false);
  const [outBal, setOutsBal] = useState(0);
  const [outBalformStatusvalue, setOutBalformStatusvalue] = useState(false);

  const billEditItem = editStatus
    ? billEditItemInfo.selectedBillInfo
    : props.slectedCropsArray;
    console.log(transpoSelectedData,"data")
  const [commValue, getCommInput] = useState(0);
  const [retcommValue, getRetCommInput] = useState(0);
  const [mandifeeValue, getMandiFeeInput] = useState(0);
  const [transportationValue, getTransportationValue] = useState(0);
  const [laborChargeValue, getLaborChargeValue] = useState(0);
  const [rentValue, getRentValue] = useState(0);
  const [levisValue, getlevisValue] = useState(0);
  const [otherfeeValue, getOtherfeeValue] = useState(0);
  const [cashpaidValue, getCashpaidValue] = useState(0);
  const [advancesValue, getAdvancesValue] = useState(0);
  const [grossTotal, setGrossTotal] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);
  const [cstmFieldVal, getcstmFieldVal] = useState(0);
  const [allGroups, setAllGroups] = useState([]);
  var tableChangeStatusval;
  const [tableChangeStatus, setTableChangeStatus] = useState(false);
  const [isShown, setisShown] = useState(false);
  useEffect(() => {
    console.log("came to step3 useeffect");
    var cropArrays = editStatus
      ? step2CropEditStatus
        ? // ? billEditItemInfo.selectedBillInfo.lineItems
          props.slectedCropsArray
        : billEditItem.lineItems
      : props.slectedCropsArray;
    var h = [];
    for (var c = 0; c < cropArrays.length; c++) {
      if (
        cropArrays[c].qtyUnit.toLowerCase() == "kgs" ||
        cropArrays[c].qtyUnit.toLowerCase() == "loads" ||
        cropArrays[c].qtyUnit.toLowerCase() == "pieces"
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
      var pID = editStatus
        ? billEditItem.farmerId
        : partnerSelectedData.partyId;
      getOutstandingBal(clickId, pID).then((res) => {
        setOutsBal(res.data.data == null ? 0 : res.data.data);
      });
    }

    getGrossTotalValue(
      editStatus
        ? step2CropEditStatus
          ? props.slectedCropsArray
          : billEditItemInfo.selectedBillInfo.lineItems
        : props.slectedCropsArray
    );
    getUnitsTotalValue(
      editStatus
        ? step2CropEditStatus
          ? props.slectedCropsArray
          : billEditItemInfo.selectedBillInfo.lineItems
        : props.slectedCropsArray
    );

    getSystemSettings(clickId).then((res) => {
      var response;
      if (res.data.data.billSetting.length > 0) {
        response = res.data.data.billSetting;
        for (var i = 0; i < response.length; i++) {
          if (response[i].billType === "BUY") {
            if (response[i].formStatus === 1) {
              Object.assign(response[i], {
                settingName: response[i].settingName,
                tableType: 0,
                subText: "",
                subText2: "",
                totalVal: 0,
                cstmName: "",
                commentText: "",
              });

              if (
                response[i].settingName === "DEFAULT_RATE_TYPE" ||
                response[i].settingName === "SKIP_INDIVIDUAL_EXP" ||
                response[i].settingName == "WASTAGE"
              ) {
                console.log("");
              } else {
                listSettings(response[i].settingName, response, i);
                allGroups.push(response[i]);
              }

              if (response[i].settingName === "OUT_ST_BALANCE")
                setOutBalformStatusvalue(true);
            }

            if (response[i].settingName === "COMMISSION") {
              setIncludeComm(response[i].includeInLedger == 1 ? true : false);
              setisShown(response[i].isShown == 1 ? true : false);
            } else if (response[i].settingName === "RETURN_COMMISSION") {
              setAddRetComm(response[i].addToGt == 1 ? false : true);
              setIncludeRetComm(
                response[i].includeInLedger == 1 ? true : false
              );
            }
          }
        }
      } else {
        getDefaultSystemSettings().then((res) => {
          response = res.data.data;
          for (var i = 0; i < response.length; i++) {
            if (
              response[i].type === "BILL" ||
              response[i].type === "DAILY_CHART"
            ) {
              if (response[i].status === 1) {
                Object.assign(response[i], {
                  settingName: response[i].name,
                  tableType: 0,
                  subText: "",
                  subText2: "",
                  totalVal: 0,
                  cstmName: "",
                  value: 0,
                  fieldType: null,
                });

                if (
                  response[i].name === "DEFAULT_RATE_TYPE" ||
                  response[i].name === "SKIP_INDIVIDUAL_EXP" ||
                  response[i].name == "WASTAGE"
                ) {
                  console.log("");
                } else {
                  var substring = "CUSTOM_FIELD";
                  if (response[i]?.name.includes(substring)) {
                    response[i].name = "";
                    substring = "";
                  }
                  listSettings(response[i]?.name, response, i);
                  allGroups.push(response[i]);
                }

                if (response[i].name === "OUT_ST_BALANCE")
                  setOutBalformStatusvalue(true);
              }

              if (response[i].name === "COMMISSION") {
                setIncludeComm(true);
                setisShown(true);
              } else if (response[i].name === "RETURN_COMMISSION") {
                setAddRetComm(false);
                setIncludeRetComm(true);
              }
            }
          }
        });
      }
    });
  }, []);
  var gTotal = 0;
  const getGrossTotalValue = (items) => {
    var total = 0;
    for (var i = 0; i < items.length; i++) {
      total += editStatus
        ? step2CropEditStatus
          ? items[i].total
          : items[i].total
        : items[i].total;
      setGrossTotal(total);
      gTotal = total;
    }
  };
  const listSettings = (name, res, index) => {
    var totalQty = 0;
    var item = editStatus
      ? step2CropEditStatus
        ? props.slectedCropsArray
        : billEditItemInfo.selectedBillInfo.lineItems
      : props.slectedCropsArray;
    for (var i = 0; i < item.length; i++) {
      totalQty += parseInt(item[i].qty);
    }
    var substring = "CUSTOM_FIELD";
    if (name.includes(substring)) {
      substring = name;
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
                ? tableChangeStatusval
                  ? trVa
                  : totalQty * trVa
                : billEditItem.transportation
              : tableChangeStatusval
              ? res[j].value
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
                ? tableChangeStatusval
                  ? trVa
                  : totalQty * trVa
                : billEditItem.rent
              : tableChangeStatusval
              ? res[j].value
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
                ? tableChangeStatusval
                  ? trVa
                  : totalQty * trVa
                : billEditItem.labourCharges
              : tableChangeStatusval
              ? res[j].value
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
            var trVa = getSingleValues(billEditItem?.misc, res[j].value);
            getOtherfeeValue(trVa);
            res[j] = { ...res[j], tableType: 1, value: trVa };
            break;
          // case "CASH_RECEIVED":
          //   var trVa = getSingleValues(billEditItem?.cashRcvd, res[j].value);

          //   res[j] = { ...res[j], tableType: 1, value: trVa };
          //   break;
          case "CASH_PAID":
            var trVa = getSingleValues(billEditItem?.cashPaid, res[j].value);
            getCashpaidValue(trVa);
            setcashPaidStatus(true);
            res[j] = { ...res[j], tableType: 1, value: trVa };
            break;
          case "ADVANCES":
            var trVa = getSingleValues(billEditItem?.advance, res[j].value);
            getAdvancesValue(trVa);
            res[j] = { ...res[j], tableType: 1, value: trVa };
            break;
          case substring:
            var newitem = 0;
            var newItem;
            newItem = editStatus
              ? billEditItem?.customFields.map((items, i) => {
                  if (items.fee != 0) {
                    if (items.field === res[j].settingName) {
                      newitem = items.fee;
                      return newitem;
                    }
                  }
                })
              : (newitem = res[j].value);
            setQuestionsTitle(
              editStatus
                ? step2CropEditStatus
                  ? billEditItem?.customFields
                  : billEditItem?.customFields
                : []
            );
            if (res[j].fieldType == "SIMPLE" || res[j].fieldType == null) {
              var trVa = newitem != 0 ? getSingleValues(newitem) : 0;
              res[j] = {
                ...res[j],
                settingName: res[j].customFieldName,
                cstmName: res[j].settingName,
                tableType: 1,
                value: trVa,
              };
            }
            if (res[j].fieldType == "COMPLEX_RS") {
              var trVa = editStatus
                ? tableChangeStatusval
                  ? res[j].value
                  : Number((newitem / totalQty).toFixed(2))
                : res[j].value;
              var totalV = editStatus
                ? step2CropEditStatus
                  ? Number((totalQty * trVa).toFixed(2))
                  : newitem
                : res[j].value * totalQty;
              res[j] = {
                ...res[j],
                settingName: res[j].customFieldName,
                cstmName: res[j].settingName,
                tableType: 3,
                value: trVa,
                totalVal: totalV,
              };
            }
            if (res[j].fieldType == "COMPLEX_PERCENTAGE") {
              var trVa = editStatus
                ? step2CropEditStatus
                  ? (newitem / gTotal) * 100
                  : (newitem / billEditItem?.grossTotal) * 100
                : res[j].value;
              var totalV = editStatus
                ? step2CropEditStatus
                  ? (trVa / 100) * gTotal
                  : newitem
                : (trVa / 100) * gTotal;
              res[j] = {
                ...res[j],
                settingName: res[j].customFieldName,
                cstmName: res[j].settingName,
                tableType: 2,
                value: trVa,
                totalVal: totalV,
              };
            }
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

  const [commentFieldText, setCommentFieldText] = useState(
    billEditItemInfo?.selectedBillInfo?.comments != ""
      ? billEditItemInfo?.selectedBillInfo?.comments
      : ""
  );
  const [transTotalValue, setTransTotalValue] = useState(0);
  const [labourTotalValue, setLaborTotalValue] = useState(0);
  const [rentTotalValue, setRentTotalValue] = useState(0);
  const [cashPaidStatus, setcashPaidStatus] = useState(false);
  const getSingleValues = (val, v) => {
    return editStatus ? (step2CropEditStatus ? val : val) : v;
  };
  const [selectedDate, setStartDate] = useState(billDateSelected);

  const [questionsTitle, setQuestionsTitle] = useState([]);

  const getUnitsTotalValue = (items) => {
    var totalunitvalue = 0;
    var it = editStatus ? (step2CropEditStatus ? items : items) : items;
    for (var i = 0; i < it.length; i++) {
      totalunitvalue += editStatus
        ? step2CropEditStatus
          ? parseInt(it[i].qty)
          : it[i].qty
        : parseInt(it[i].qty);
      setTotalUnits(totalunitvalue);
    }
  };

  const getTotalValue = (value) => {
    return (value / 100) * grossTotal;
  };
  const getTotalUnits = (val) => {
    return val * totalUnits;
  };
  const [enterVal, setEnterVal] = useState();
  const [cstmval, setCstmval] = useState(false);
  const getTotalBillAmount = () => {
    var t = Number(
      (transTotalValue != 0
        ? Number(transTotalValue)
        : tableChangeStatus
        ? Number(transportationValue)
        : getTotalUnits(transportationValue)) +
        (labourTotalValue != 0
          ? Number(labourTotalValue)
          : tableChangeStatus
          ? Number(laborChargeValue)
          : getTotalUnits(laborChargeValue)) +
        (rentTotalValue != 0
          ? Number(rentTotalValue)
          : tableChangeStatus
          ? Number(rentValue)
          : getTotalUnits(rentValue)) +
        getTotalValue(mandifeeValue) +
        Number(levisValue) +
        Number(otherfeeValue) +
        Number(advancesValue)
    );
    let totalValue = grossTotal - t;
    for (var i = 0; i < questionsTitle.length; i++) {
      console.log(questionsTitle);
      if (questionsTitle[i].field != "") {
        console.log(questionsTitle[i].field, questionsTitle[i].less);
        if (questionsTitle[i].less) {
          var t = 0;
          totalValue = totalValue - Number(questionsTitle[i].fee);
        } else {
          totalValue = totalValue + Number(questionsTitle[i].fee);
        }
      }
    }
    if (includeComm) {
      if (isShown) {
        totalValue = totalValue - getTotalValue(commValue);
      }
    }
    if (addRetComm) {
      totalValue = (totalValue - getTotalValue(retcommValue)).toFixed(2);
    } else {
      totalValue = (totalValue + getTotalValue(retcommValue)).toFixed(2);
    }

    return totalValue;
  };
  const getActualPayble = () => {
    var actualPay = getTotalBillAmount() - Number(cashpaidValue);
    if (includeComm) {
      if (!isShown) {
        actualPay = actualPay - getTotalValue(commValue);
      }
    }
    if (addRetComm) {
      if (!includeRetComm) {
        actualPay = (actualPay - getTotalValue(retcommValue)).toFixed(2);
      }
    } else {
      if (!includeRetComm) {
        actualPay = (actualPay + getTotalValue(retcommValue)).toFixed(2);
      }
    }
    return actualPay;
  };
  const getTotalPayble = () => {
    return Number(getTotalBillAmount()) - Number(cashpaidValue).toFixed(2);
  };
  const getFinalLedgerbalance = () => {
    var t = Number(
      (transTotalValue != 0
        ? Number(transTotalValue)
        : tableChangeStatus
        ? Number(transportationValue)
        : getTotalUnits(transportationValue)) +
        (labourTotalValue != 0
          ? Number(labourTotalValue)
          : tableChangeStatus
          ? Number(laborChargeValue)
          : getTotalUnits(laborChargeValue)) +
        (rentTotalValue != 0
          ? Number(rentTotalValue)
          : tableChangeStatus
          ? Number(rentValue)
          : getTotalUnits(rentValue)) +
        getTotalValue(mandifeeValue) +
        Number(levisValue) +
        Number(otherfeeValue) +
        Number(advancesValue)
    );
    var finalValue = grossTotal - t;
    var finalVal = finalValue;
    if (includeComm) {
      if (isShown) {
        finalVal = finalValue - getTotalValue(commValue);
      }
    }
    for (var i = 0; i < questionsTitle.length; i++) {
      if (questionsTitle[i].field != "") {
        if (questionsTitle[i].less) {
          var t = 0;
          finalVal = finalVal - Number(questionsTitle[i].fee);
        } else {
          finalVal = finalVal + Number(questionsTitle[i].fee);
        }
      }
    }

    if (addRetComm) {
      if (includeRetComm) {
        finalVal = (finalVal - getTotalValue(retcommValue)).toFixed(2);
      }
    } else {
      if (includeRetComm) {
        finalVal = (finalVal + getTotalValue(retcommValue)).toFixed(2);
      }
    }
    var outBalance = editStatus ? billEditItem?.outStBal : outBal;

    return (Number(finalVal) + outBalance).toFixed(2) - Number(cashpaidValue);
  };
  var lineItemsArray = [];

  // if (props.slectedCropsArray.length > 0) {

  var cropArray = editStatus
    ? step2CropEditStatus
      ? props.slectedCropsArray
      : billEditItemInfo.selectedBillInfo.lineItems
    : props.slectedCropsArray; //billEditItem.lineItems
  // : props.slectedCropsArray;
  // console.log(cropArray,props.slectedCropsArray,"which one");
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
      rateType:
        cropArray[i].rateType == "kgs" ? "RATE_PER_KG" : "RATE_PER_UNIT",
      id: cropArray[i].id,
      partyId: cropArray[i].farmerId,
      status: cropArray[i].status,
      bags: cropArray[i].bags,
    });
  }
  // }
  const billRequestObj = {
    actualPayble: Number(getActualPayble()),
    advance: Number(advancesValue),
    billDate: partnerSelectDate,
    billStatus: "COMPLETED",
    caId: clickId,
    cashPaid: Number(cashpaidValue),
    comm: Number(getTotalValue(commValue).toFixed(2)),
    commIncluded: includeComm,
    commShown: true,
    comments: commentFieldText,
    createdBy: 0,
    farmerId: editStatus ? billEditItem.farmerId : partnerSelectedData.partyId, //partnerSelectedData.partyId,
    customFields: questionsTitle,
    govtLevies: Number(levisValue),
    grossTotal: grossTotal,
    labourCharges:
      labourTotalValue != 0
        ? Number(labourTotalValue)
        : tableChangeStatus
        ? Number(laborChargeValue)
        : Number(getTotalUnits(laborChargeValue).toFixed(2)),
    less: addRetComm,
    lineItems: lineItemsArray,
    mandiFee: Number(getTotalValue(mandifeeValue).toFixed(2)),
    misc: Number(otherfeeValue),
    outStBal: 0,
    paidTo: 100,
    rent:
      rentTotalValue != 0
        ? Number(rentTotalValue)
        : tableChangeStatus
        ? Number(rentValue)
        : Number(getTotalUnits(rentValue).toFixed(2)),
    rtComm: Number(getTotalValue(retcommValue).toFixed(2)),
    rtCommIncluded: includeRetComm,
    totalPayble: getTotalPayble(),
    transportation:
      transTotalValue != 0
        ? Number(transTotalValue)
        : tableChangeStatus
        ? Number(transportationValue)
        : Number(getTotalUnits(transportationValue).toFixed(2)),
    transporterId:
      transpoSelectedData != null ? transpoSelectedData.partyId : "",
    updatedOn: "",
    writerId: 0,
    timeStamp: "",
  };
  const editBillRequestObj = {
    action: "UPDATE",
    billAttributes: {
      actualPayRecieevable: getActualPayble(),
      advance: Number(advancesValue),
      billDate: partnerSelectDate,
      cashRcvd: Number(cashpaidValue),
      comm: Number(getTotalValue(commValue).toFixed(2)),
      commIncluded: includeComm,
      comments: commentFieldText,
      customFields: editStatus
        ? cstmval
          ? questionsTitle
          : billEditItem?.customFields
        : questionsTitle,
      govtLevies: Number(levisValue),
      grossTotal: grossTotal,
      labourCharges:
        labourTotalValue != 0
          ? Number(labourTotalValue)
          : tableChangeStatus
          ? Number(laborChargeValue)
          : Number(getTotalUnits(laborChargeValue).toFixed(2)),
      less: addRetComm,
      mandiFee: Number(getTotalValue(mandifeeValue).toFixed(2)),
      misc: Number(otherfeeValue),
      otherFee: Number(otherfeeValue),
      outStBal: outBal,
      paidTo: 0,
      partyId: billEditItem.farmerId, //partnerSelectedData.partyId,
      rent:
        rentTotalValue != 0
          ? Number(rentTotalValue)
          : tableChangeStatus
          ? Number(rentValue)
          : Number(getTotalUnits(rentValue).toFixed(2)),
      rtComm: Number(getTotalValue(retcommValue).toFixed(2)),
      rtCommIncluded: includeRetComm,
      totalPayRecieevable: getTotalPayble(),
      transportation:
        transTotalValue != 0
          ? Number(transTotalValue)
          : tableChangeStatus
          ? Number(transportationValue)
          : Number(getTotalUnits(transportationValue).toFixed(2)),
      transporterId:
      transpoSelectedData != null ? transpoSelectedData.partyId : 0,
    },
    billId: billEditItem?.billId,
    billType: "BUY",
    caBSeq: billEditItem?.caBSeq,
    caId: clickId,
    lineItems: step2CropEditStatus ? lineItemsArray : [],
    updatedBy: 0,
    updatedOn: "",
    writerId: 0,
  };
  // post bill request api call
  const postbuybill = () => {
    console.log(editBillRequestObj)
    if (editStatus) {
      console.log(editBillRequestObj);
      editbuybillApi(editBillRequestObj).then(
        (response) => {
          if (response.data.status.type === "SUCCESS") {
            toast.success(response.data.status.message, {
              toastId: "success1",
            });

            // props.closeStep3Modal();
            localStorage.setItem("stepOne", false);
            localStorage.setItem("billViewStatus", false);
            localStorage.setItem("LinkPath", "/buy_bill_book");

            window.setTimeout(function () {
              props.closem();
              navigate("/buy_bill_book");
              window.location.reload();
            }, 2000);
          }
        },
        (error) => {
          toast.error(error.response.data.status.description, {
            toastId: "error1",
          });
        }
      );
    } else {
      console.log(billRequestObj);
      postbuybillApi(billRequestObj).then(
        (response) => {
          if (response.data.status.type === "SUCCESS") {
            toast.success(response.data.status.description, {
              toastId: "success1",
            });

            // props.closeStep3Modal();
            localStorage.setItem("stepOne", false);
            localStorage.setItem("LinkPath", "/buy_bill_book");
            // props.closem();
            props.closem();
            window.setTimeout(function () {
             
              navigate("/buy_bill_book");
              window.location.reload();
            }, 2000);
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
  const [checked, setChecked] = useState(localStorage.getItem("defaultDate"));
  const handleCheckEvent = () => {
    if (!checked) {
      setChecked(!checked);
      localStorage.setItem("defaultDate", true);
      setStartDate(selectedDate);
    } else {
      setChecked(!checked);
      localStorage.removeItem("defaultDate");
      setStartDate(new Date());
    }
  };

  const handleInputValueEvent = (e) => {
    $("input").keypress(function (e) {
      var a = [];
      var k = e.which;
      if (e.charCode === 46) {
        // if dot is the first symbol
        if (e.target.value.length === 0) {
          e.preventDefault();
          return;
        }

        // if there are dots already
        if (e.target.value.indexOf(".") !== -1) {
          e.preventDefault();
          return;
        }

        a.push(e.charCode);
      }
      for (i = 48; i < 58; i++) a.push(i);
      if (!($.inArray(k, a) >= 0)) e.preventDefault();
    });
  };
  const advLevOnchangeEvent = (groupLiist, index) => (e) => {
    var val = e.target.value.replace(/[^0-9.]/g, "");
    let updatedItems = groupLiist.map((item, i) => {
      if (i == index) {
        groupLiist[i].value = val;
        if (groupLiist[i].cstmName != "") {
          let tab = [...questionsTitle];
          let tabIndex = tab.findIndex((x) => x.index === index);
          if (tabIndex !== -1) {
            tab[tabIndex].fee = getTargetValue(
              e.target.value,
              groupLiist[i],
              i
            );
          } else {
            tab.push({
              comments: "string",
              fee: getTargetValue(e.target.value, groupLiist[i], i),
              field: groupLiist[i].cstmName,
              fieldName: groupLiist[i].settingName,
              fieldType: groupLiist[i].fieldType,
              index: index,
              less: groupLiist[i].addToGt == 1 ? false : true,
            });
            setCstmval(true);
            setQuestionsTitle(tab);
          }
        }
        getAdditionValues(groupLiist[i], val);

        return { ...groupLiist[i], value: val };
      } else {
        return { ...groupLiist[i] };
      }
    });
    setAllGroups([...updatedItems]);
    setEnterVal(val);
  };
  const getTargetValue = (val, list, index) => {
    if (list.fieldType == "SIMPLE" || list.fieldType == null) {
      return (list.fee = Number(val));
    } else if (list.fieldType == "COMPLEX_RS") {
      return (list.fee = Number(getTotalUnits(val).toFixed(2)));
    } else if (list.fieldType == "COMPLEX_PERCENTAGE") {
      return (list.fee = Number(getTotalValue(val).toFixed(2)));
    }
  };
  const fieldOnchangeEvent = (groupLiist, index) => (e) => {
    var val = e.target.value.replace(/[^0-9.]/g, "");
    let updatedItem3 = groupLiist.map((item, i) => {
      if (i == index) {
        getAdditionValues(groupLiist[i], val);
        if (groupLiist[i].cstmName != "") {
          let tab = [...questionsTitle];
          let tabIndex = tab.findIndex((x) => x.index === index);
          if (tabIndex !== -1) {
            tab[tabIndex].fee = getTargetValue(
              e.target.value,
              groupLiist[i],
              i
            );
          } else {
            tab.push({
              comments: "string",
              fee: getTargetValue(e.target.value, groupLiist[i], i),
              field: groupLiist[i].cstmName,
              fieldName: groupLiist[i].settingName,
              fieldType: groupLiist[i].fieldType,
              index: index,
              less: groupLiist[i].addToGt == 1 ? false : true,
            });
            setCstmval(true);
          }
          setQuestionsTitle(tab);
        }
        return {
          ...groupLiist[i],
          value: val,
          totalVal: Number(getTotalUnits(val).toFixed(2)),
        };
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
        if (groupLiist[i].cstmName != "") {
          let tab = [...questionsTitle];
          let tabIndex = tab.findIndex((x) => x.index === index);
          if (tabIndex !== -1) {
            tab[tabIndex].fee = Number(e.target.value);
          } else {
            tab.push({
              comments: "string",
              fee: Number(e.target.value),
              field: groupLiist[i].cstmName,
              fieldName: groupLiist[i].settingName,
              fieldType: groupLiist[i].fieldType,
              index: index,
              less: groupLiist[i].addToGt == 1 ? false : true,
            });
            setCstmval(true);
          }
          setQuestionsTitle(tab);
        }
        getOnchangeTotals(groupLiist[i], val);
        getAdditionValues(groupLiist[i], v);
        return { ...groupLiist[i], value: v, totalVal: val };
      } else {
        return { ...groupLiist[i] };
      }
    });
    setAllGroups([...updatedItem]);
  };
  const commRetCommOnchangeEvent = (groupLiist, index) => (e) => {
    // var val = e.target.value.replace(/[^0-9.]/g, "");
    handleInputValueEvent(e);
    // if (val != 0) {
    var val = e.target.value;
    let updatedItem2 = groupLiist.map((item, i) => {
      if (i == index) {
        getAdditionValues(groupLiist[i], val);
        if (groupLiist[i].cstmName != "") {
          let tab = [...questionsTitle];
          let tabIndex = tab.findIndex((x) => x.index === index);
          if (tabIndex !== -1) {
            tab[tabIndex].fee = getTargetValue(
              e.target.value,
              groupLiist[i],
              i
            );
          } else {
            tab.push({
              comments: "string",
              fee: getTargetValue(e.target.value, groupLiist[i], i),
              field: groupLiist[i].cstmName,
              fieldName: groupLiist[i].settingName,
              fieldType: groupLiist[i].fieldType,
              index: index,
              less: groupLiist[i].addToGt == 1 ? false : true,
            });
            setCstmval(true);
          }
          setQuestionsTitle(tab);
        }
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
        if (groupLiist[i].cstmName != "") {
          let tab = [...questionsTitle];
          let tabIndex = tab.findIndex((x) => x.index === index);
          if (tabIndex !== -1) {
            tab[tabIndex].fee = Number(e.target.value);
          } else {
            tab.push({
              comments: "string",
              fee: Number(e.target.value),
              field: groupLiist[i].cstmName,
              fieldName: groupLiist[i].settingName,
              fieldType: groupLiist[i].fieldType,
              index: index,
              less: groupLiist[i].addToGt == 1 ? false : true,
            });
            setCstmval(true);
          }
          setQuestionsTitle(tab);
        }
        getAdditionValues(groupLiist[i], v);
        return { ...groupLiist[i], value: v, totalVal: val };
      } else {
        return { ...groupLiist[i] };
      }
    });
    setAllGroups([...updatedItem]);
  };
  const getOnchangeTotals = (groupLiist, v) => {
    if (groupLiist.settingName.toLowerCase() == "transportation") {
      setTransTotalValue(v);
    }
    if (groupLiist.settingName.toLowerCase() == "labour_charges") {
      setLaborTotalValue(v);
    }
    if (groupLiist.settingName.toLowerCase() == "rent") {
      setRentTotalValue(v);
    }
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
    if (groupLiist.settingName == "CASH_PAID") {
      if (v != "") {
        getCashpaidValue(v);
      }
    }
    if (groupLiist.settingName == "ADVANCES") {
      if (v != "") {
        getAdvancesValue(v);
      }
    }
    var subString = "CUSTOM_FIELD";
    if (groupLiist.cstmName.includes(subString)) {
      if (v != "") {
        getcstmFieldVal(v);
      }
    }
  };

  //   click on input to reset 0 to enter value
  const resetInput = (e) => {
    if (e.target.value == 0) {
      e.target.value = "";
    }
  };
  // close popup
  const cancelStep = () => {
    dispatch(selectTrans(null));
    dispatch(selectBuyer(null));
    props.closem();
    if (editStatus) {
      window.location.reload();
    }
  };
  const [selectedBilldate, setselectedbilldate] = useState(false);
  const [cropEditObject, setcropEditObject] = useState([]);
  const [slectedCropstableArray, setslectedCropstableArray] = useState([]);
  const [selectedPartyType, setselectedPartyType] = useState("");
  const [selectedCrops, setselectedCrops] = useState([]);
  const callbackFunctionPartySelect = (
    partyselectedarray,
    trans,
    // cropTableEditStatus,
    cropEditObject,
    // billEditStatus,
    slectedCropstableArray,
    selectedCrops
    // selectedPartyType,
    // selectedBilldate
  ) => {
    setpartnerSelectedData(partyselectedarray);
    setTranspoSelectedData(trans);
    props.step3ParentCallback(
      //   cropTableEditStatus,
      cropEditObject,
      //   billEditStatus,
      slectedCropstableArray,
      selectedCrops
      //   selectedPartyType,
      //   selectedBilldate
    );
    setcropEditObject(cropEditObject);
    setslectedCropstableArray(slectedCropstableArray);
    setselectedCrops(selectedCrops);
  };
  const dispatch = useDispatch();
  const previousStep = () => {
    dispatch(selectSteps("step2"));
    dispatch(selectBuyer(buyerInfo));
    dispatch(
      selectTrans(
        transusers.transInfo != null
          ? transusers.transInfo
          : transpoSelectedData
      )
    );
    dispatch(tableEditStatus(true));
    props.step3ParentCallback(
      slectedCropstableArray,
      slectedCropstableArray,
      selectedCrops
    );
    dispatch(fromBillbook(false));
  };
  const [commentShownStatus, setCommentShownStatus] = useState(
    editStatus
      ? billEditItemInfo?.selectedBillInfo?.comments != ""
        ? true
        : false
      : false
  );
  const addCommentClick = () => {
    setCommentShownStatus(true);
  };
  const commentText = (e) => {
    var val = e.target.value;
    setCommentFieldText(val);
  };
  const cstmCommentText = (groupLiist, index) => (e) => {
    var val = e.target.value;
    let updatedItems = groupLiist.map((item, i) => {
      if (i == index) {
        if (groupLiist[i].cstmName != "") {
          let tab = [...questionsTitle];
          let tabIndex = tab.findIndex((x) => x.index === index);
          if (tabIndex !== -1) {
            tab[tabIndex].fee = groupLiist[i].value;
          } else {
            tab.push({
              comments: val,
              fee: groupLiist[i].value,
              field: groupLiist[i].cstmName,
              fieldName: groupLiist[i].settingName,
              fieldType: groupLiist[i].fieldType,
              index: index,
              less: groupLiist[i].addToGt == 1 ? false : true,
            });
            setCstmval(true);
            setQuestionsTitle(tab);
          }
        }
        return { ...groupLiist[i], commentText: val };
      } else {
        return { ...groupLiist[i] };
      }
    });
    setAllGroups([...updatedItems]);
  };
  return (
    <div>
      <div className="main_div_padding">
        <div className="row">
          <div className="col-lg-3 p-0">
            <Step3PartySelect
              parentSelectedParty={callbackFunctionPartySelect}
              billEditItemval={billEditItem}
              //   selectdDate={partnerSelectDate}
              //   step2CropEditStatus={step2CropEditStatus}
              //   editStatus={editStatus}
              //   selectedPartyType="seller"
              selectedBuyerSellerData={
                editStatus
                  ? billEditItemInfo.selectedBillInfo
                  : partnerSelectedData
              }
              transpoSelectedData={
                editStatus
                  ? billEditItemInfo.selectedBillInfo
                  : transpoSelectedData
              }
              selectedCrop={
                editStatus
                  ? step2CropEditStatus
                    ? props.slectedCropsArray
                    : billEditItemInfo.selectedBillInfo
                  : props.slectedCropsArray
              }
            />
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
                                  {getText(allGroups[index]?.settingName)}
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
                        <div>
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
                          {allGroups[index].comments == true ? (
                            <div className="comm_cards">
                              <div className="card input_card">
                                <div className="row">
                                  <div className="col-lg-3 title_bg">
                                    <h5 className="comm_card_title mb-0">
                                      Comments
                                    </h5>
                                  </div>
                                  <div className="col-lg-9 col-sm-12 col_left_border">
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={allGroups[index].commentText}
                                      onChange={cstmCommentText(
                                        allGroups,
                                        index
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          {allGroups[index].settingName == "OTHER_FEE" ? (
                            commentShownStatus ? (
                              <div className="comm_cards">
                                <div className="card input_card">
                                  <div className="row">
                                    <div className="col-lg-3 title_bg">
                                      <h5 className="comm_card_title mb-0">
                                        Comments
                                      </h5>
                                    </div>
                                    <div className="col-lg-9 col-sm-12 col_left_border">
                                      <input
                                        type="text"
                                        placeholder=""
                                        value={commentFieldText}
                                        onChange={commentText}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p
                                className="comment_text"
                                onClick={() => addCommentClick()}
                              >
                                +Add Comment
                              </p>
                            )
                          ) : (
                            ""
                          )}
                        </div>
                      );
                    }
                  })
                : ""}
            </div>
          </div>
          <div className="col-lg-3 p-0">
            <h5 className="head_modal">Totals</h5>
            <div className="default_card comm_total_card total_bal">
              <div className="totals_value pt-0">
                <h5>Gross Total (₹)</h5>
                <h6 className="black_color">{grossTotal.toFixed(2)}</h6>
              </div>
              <div className="totals_value">
                <h5>Total Bill Amount (₹)</h5>
                <h6>{getTotalBillAmount()}</h6>
              </div>
              {outBalformStatusvalue ? (
                <div className="totals_value">
                  <h5>Outstanding Balance (₹)</h5>
                  <h6>
                    {outBal != 0
                      ? editStatus
                        ? billEditItem?.outStBal
                        : outBal.toFixed(2)
                      : "0"}
                  </h6>
                </div>
              ) : (
                ""
              )}

              {cashpaidValue != 0 ? (
                <div className="totals_value">
                  <h5>Cash Paid</h5>
                  <h6 className="black_color">
                    -
                    {billEditItem?.cashPaid
                      ? cashPaidStatus
                        ? cashpaidValue
                        : billEditItem?.cashPaid
                      : cashpaidValue}
                  </h6>
                </div>
              ) : (
                ""
              )}
              {outBalformStatusvalue ? (
                <div className="totals_value">
                  <h5>Final Ledger Balance (₹)</h5>
                  <h6>{getFinalLedgerbalance().toFixed(2)}</h6>
                </div>
              ) : (
                <div className="totals_value">
                  <h5>Total Paybles (₹)</h5>
                  <h6>{getTotalPayble().toFixed(2)}</h6>
                </div>
              )}
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
      <div className="bottom_div">
        <div className="d-flex align-items-center justify-content-between">
          <button className="secondary_btn" onClick={() => cancelStep()}>
            cancel
          </button>
          <div className="d-flex align-items-center">
            <button className="secondary_btn no_delete_btn" onClick={() => previousStep()}>
              Previous
            </button>
            <button className="primary_btn" onClick={() => postbuybill()}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Step33;
