import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../modules/buy_bill_book/step2.scss";
import "../sell_bill_book/step3.scss";
import { useState, useEffect } from "react";
import "../../modules/buy_bill_book/step1.scss";
import Step3PartySelect from "../buy_bill_book/step3PartySelect";
import {
  getDefaultSystemSettings,
  getGeneratedBillId,
  getOutstandingBal,
  getSystemSettings,
} from "../../actions/billCreationService";
import CommissionCard from "../../components/commissionCard";
import CommonCard from "../../components/card";
import { getText } from "../../components/getText";
import {
  postsellbillApi,
  editbuybillApi,
} from "../../actions/billCreationService";
import clo from "../../assets/images/clo.png";
import moment from "moment";
import { selectSteps } from "../../reducers/stepsSlice";
import $ from "jquery";
import { selectTrans } from "../../reducers/transSlice";
import { selectBuyer } from "../../reducers/buyerSlice";
import loading from "../../assets/images/loading.gif";
import {
  fromBillbook,
  generatedBillId,
  tableEditStatus,
} from "../../reducers/billEditItemSlice";
import {
  getCurrencyNumberWithOutSymbol,
  isEditBill,
} from "../../components/getCurrencyNumber";
import { getSellBillId } from "../../actions/ledgersService";
import {
  billViewInfo,
  disableFromLastDaysSell,
} from "../../reducers/billViewSlice";
const SellBillStep3 = (props) => {
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
  var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
  const navigate = useNavigate();
  var buyerInfo = users.buyerInfo;
  var partnerSelectDate = moment(billDateSelected).format("YYYY-MM-DD");
  const editStatus = billEditItemInfo?.billEditStatus;
  const [partnerSelectedData, setpartnerSelectedData] = useState(
    editStatus ? billEditItemInfo.selectedBillInfo : buyerInfo
  );
  const [transpoSelectedData, setTranspoSelectedData] = useState(
    transusers.transInfo
  );
  const [includeComm, setIncludeComm] = useState("");
  const [includeRetComm, setIncludeRetComm] = useState("");
  const [addRetComm, setAddRetComm] = useState(false);
  const [outBal, setOutsBal] = useState(0);
  const [outBalAdvance, setOutBalAdvance] = useState(0);
  const [outBalformStatusvalue, setOutBalformStatusvalue] = useState(false);

  const billEditItem = editStatus
    ? billEditItemInfo.selectedBillInfo
    : props.slectedSellCropsArray;
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
  const [grossTotal, setGrossTotal] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);

  const [tableChangeStatus, setTableChangeStatus] = useState(false);
  var tableChangeStatusval;
  const [isShown, setisShown] = useState(false);
  const [allGroups, setAllGroups] = useState([]);
  const [commentFieldText, setCommentFieldText] = useState(
    billEditItemInfo?.selectedBillInfo?.comments != ""
      ? billEditItemInfo?.selectedBillInfo?.comments
      : ""
  );
  var billViewData = useSelector((state) => state.billViewInfo);
  const disableDaysStatus = billViewData?.disableFromLastDaysSell;
  const numberOfDaysValue = billViewData?.numberOfDaysSell;
  const [isLoading, setLoading] = useState(true);
  const [billIdVal, setBillIdVal] = useState(
    billEditItemInfo?.generatedBillId != 0
      ? billEditItemInfo?.generatedBillId
      : 0
  );
  const [billCreationStatus, setBillCreationStatus] = useState(
    billEditItemInfo?.generatedBillId != 0 ? false : editStatus ? false : true
  );
  const [outBalStatus, setOutBalStatus] = useState(false);
  useEffect(() => {
    $("#disable").attr("disabled", false);
    var cropArrays = editStatus
      ? step2CropEditStatus
        ? // ? billEditItemInfo.selectedBillInfo.lineItems
          props.slectedSellCropsArray
        : billEditItem.lineItems
      : props.slectedSellCropsArray;
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
      setLoading(true);
      var pID = editStatus ? billEditItem.buyerId : partnerSelectedData.partyId;
      if (pID != 0) {
        getOutstandingBal(clickId, pID).then(
          (res) => {
            console.log(res, "out");
            setLoading(false);
            setOutsBal(res.data.data == null ? 0 : res.data.data.tobePaidRcvd);
            setOutBalAdvance(res.data.data == null ? 0 : res.data.data.advance);
            $("#disable").attr("disabled", false);
            setOutBalStatus(true);
          },
          (error) => {
            // $("#disable").attr("disabled", true);
            setLoading(false);
            setOutBalStatus(false);
            toast.error(error.res.data.status.description, {
              toastId: "error10",
            });
          }
        );
      }
    }
    getGrossTotalValue(
      editStatus
        ? step2CropEditStatus
          ? props.slectedSellCropsArray
          : billEditItemInfo.selectedBillInfo.lineItems
        : props.slectedSellCropsArray
    );
    getSystemSettings(clickId).then((res) => {
      var response;

      //  Filter the array to include only objects where type=buy and formStatus=1
      const filteredArray = res.data.data.billSetting.filter((object) => {
        return object.billType === "SELL" && object.formStatus === 1;
      });
      filteredArray.sort((a, b) => a.groupId - b.groupId);
      if (filteredArray.length > 0) {
        response = res.data.data.billSetting;
        for (var i = 0; i < filteredArray.length; i++) {
          if (filteredArray[i].billType === "SELL") {
            if (filteredArray[i].formStatus === 1) {
              Object.assign(filteredArray[i], {
                settingName: filteredArray[i].settingName,
                tableType: 0,
                subText: "",
                subText2: "",
                totalVal: 0,
                cstmName: "",
                commentText: "",
              });

              if (
                filteredArray[i].settingName === "DEFAULT_RATE_TYPE" ||
                filteredArray[i].settingName === "SKIP_INDIVIDUAL_EXP" ||
                filteredArray[i].settingName == "WASTAGE"
              ) {
              } else {
                if (filteredArray[i]?.settingName.includes("ADVANCES")) {
                  filteredArray[i].settingName = "";
                }
                listSettings(filteredArray[i].settingName, filteredArray, i);
                allGroups.push(filteredArray[i]);
              }
              if (filteredArray[i].settingName === "OUT_ST_BALANCE")
                setOutBalformStatusvalue(true);
            }

            if (filteredArray[i].settingName === "COMMISSION") {
              setIncludeComm(
                filteredArray[i].includeInLedger == 1 ? true : false
              );
              setisShown(filteredArray[i].isShown == 1 ? true : false);
            } else if (filteredArray[i].settingName === "RETURN_COMMISSION") {
              setAddRetComm(filteredArray[i].addToGt == 1 ? false : true);
              setIncludeRetComm(
                filteredArray[i].includeInLedger == 1 ? true : false
              );
            }
          }
        }
      } else {
        getDefaultSystemSettings().then((res) => {
          response = res.data.data.sort((a, b) => a.id - b.id);
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
                } else {
                  var substring = "CUSTOM_FIELD";
                  if (response[i]?.name.includes(substring)) {
                    response[i].name = "";
                    substring = "";
                  } else if (response[i]?.name.includes("ADVANCES")) {
                    response[i].name = "";
                  }
                  listSettings(response[i].name, response, i);
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

    var partyID = editStatus
      ? billEditItem.buyerId
      : partnerSelectedData.partyId;
    if (billCreationStatus) {
      const generateBillObj = {
        caId: clickId,
        multiBill: false,
        partyId: partyID,
        type: "SELL",
        writerId: writerId,
      };
      getGeneratedBillId(generateBillObj).then((res) => {
        setBillIdVal(res.data.data == null ? 0 : res.data.data);
        dispatch(generatedBillId(res.data.data == null ? 0 : res.data.data));
      });
    }
    var value = isEditBill(partnerSelectDate, numberOfDaysValue);
    if (!value) {
      dispatch(disableFromLastDaysSell(true));
      toast.error(
        `Bills that are more than ${numberOfDaysValue} days old can’t be edited. `,
        {
          toastId: "error6",
        }
      );
    } else {
      dispatch(disableFromLastDaysSell(false));
    }
  }, []);

  const [questionsTitle, setQuestionsTitle] = useState([]);
  var gTotal = 0;
  const [cashRcdStatus, setcashRcdStatus] = useState(false);
  const getSingleValues = (val, v) => {
    return editStatus ? (step2CropEditStatus ? val : val) : v;
  };
  var cstmArray = [];
  const listSettings = (name, res, index) => {
    var totalQty = 0;
    var item = editStatus
      ? step2CropEditStatus
        ? props.slectedSellCropsArray
        : billEditItemInfo.selectedBillInfo.lineItems
      : props.slectedSellCropsArray;
    for (var i = 0; i < item.length; i++) {
      totalQty += parseFloat(item[i].qty);
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
                ? billEditItem?.commPercenttage
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
                ? billEditItem?.retCommPercenttage
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
                ? billEditItem?.mandiFeePercentage
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
                ? billEditItem?.transportation == 0
                  ? 0
                  : billEditItem?.transportation != 0
                  ? billEditItem?.transportation
                  : res[j].value
                : billEditItem?.transVal
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
              subText: "Per Bag /Box /Crate /Sac",
              subText2: "Number of Units",
              totalVal: totalV.toFixed(2),
              value: trVa.toFixed(2),
            };
            break;
          case "RENT":
            var trVa = editStatus
              ? tableChangeStatusval
                ? billEditItem?.rent == 0
                  ? 0
                  : billEditItem?.rent != 0
                  ? billEditItem?.rent
                  : res[j].value
                : billEditItem?.rentUnitVal
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
              subText: "Per Bag /Box /Crate /Sac",
              subText2: "Number of Units",
              totalVal: totalV.toFixed(2),
              value: trVa.toFixed(2),
            };
            break;
          case "LABOUR_CHARGES":
            var trVa = editStatus
              ? tableChangeStatusval
                ? billEditItem?.labourCharges == 0
                  ? 0
                  : billEditItem?.labourCharges != 0
                  ? billEditItem?.labourCharges
                  : res[j].value
                : billEditItem?.labourChargesVal
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
              subText: "Per Bag /Box /Crate /Sac",
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
          case substring:
            var newitem = 0;
            var newItem;
            var commentTextFor = "";
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
            var c = editStatus
              ? billEditItem?.customFields.map((items, i) => {
                  if (items.fee != 0) {
                    if (items.field === res[j].settingName) {
                      commentTextFor = items.comments;
                      return commentTextFor;
                    }
                  }
                })
              : (commentTextFor = res[j].commentText);
            setQuestionsTitle(
              editStatus
                ? step2CropEditStatus
                  ? billEditItem?.customFields
                  : billEditItem?.customFields
                : []
            );
            if (res[j].fieldType == "SIMPLE" || res[j].fieldType == null) {
              // var trVa = res[j].value != 0 ? getSingleValues(newitem) : 0;
              var trVa = newitem != 0 ? getSingleValues(newitem, newitem) : 0;
              res[j] = {
                ...res[j],
                settingName: res[j].customFieldName,
                cstmName: res[j].settingName,
                tableType: 1,
                value: trVa,
                fieldType: "SIMPlE",
                commentText: commentTextFor,
                comments: res[j].comments,
              };
            }
            if (res[j].fieldType == "COMPLEX_RS") {
              // var trVa = getSingleValues(newitem);
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
                value: trVa != 0 ? trVa.toFixed(2) : trVa,
                totalVal: totalV.toFixed(2),
                commentText: commentTextFor,
                subText: "Default Rs",
                subText2: "Number of units",
                comments: res[j].comments,
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
              // var trVa =getSingleValues(newitem);
              res[j] = {
                ...res[j],
                settingName: res[j].customFieldName,
                cstmName: res[j].settingName,
                tableType: 2,
                value: trVa != 0 ? trVa.toFixed(2) : trVa,
                totalVal: totalV.toFixed(2),
                commentText: commentTextFor,
                subText: "Default Percentage %",
                comments: res[j].comments,
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
    let updatedCustomItems = updatedItem.map((item, i) => {
      if (i == index) {
        if (updatedItem[i].cstmName != "") {
          let tab = [...cstmArray];
          let tabIndex = tab.findIndex((x) => x.index === index);
          if (tabIndex !== -1) {
            tab[tabIndex].fee =
              updatedItem[i].totalVal != 0
                ? updatedItem[i].totalVal
                : updatedItem[i].value;
          } else {
            if (editStatus) {
              let tabIndex = tab.findIndex(
                (x) => x.fieldName === updatedItem[i].settingName
              );
              if (tabIndex == -1) {
                tab.push({
                  comments: "",
                  fee:
                    updatedItem[i].totalVal != 0
                      ? updatedItem[i].totalVal
                      : updatedItem[i].value,
                  field: updatedItem[i].cstmName,
                  fieldName: updatedItem[i].settingName,
                  fieldType: updatedItem[i].fieldType,
                  index: i,
                  less: updatedItem[i].addToGt == 1 ? false : true,
                });
              } else {
                let tabObje = { ...tab[tabIndex] };
                tabObje = {
                  ...tabObje,
                  fee: getTargetValue(updatedItem[i].value, updatedItem[i], i),
                };
                tab[tabIndex] = tabObje;
              }
            } else {
              tab.push({
                comments: "",
                fee:
                  updatedItem[i].totalVal != 0
                    ? updatedItem[i].totalVal
                    : updatedItem[i].value,
                field: updatedItem[i].cstmName,
                fieldName: updatedItem[i].settingName,
                fieldType: updatedItem[i].fieldType,
                index: i,
                less: updatedItem[i].addToGt == 1 ? false : true,
              });
            }
          }
          cstmArray = tab;
          setQuestionsTitle([...tab, ...questionsTitle]);
        }
      }
    });
    // return type;
  };
  const getGrossTotalValue = (items) => {
    var total = 0;
    var totalunitvalue = 0;
    for (var i = 0; i < items.length; i++) {
      if (items[i].status != 0) {
        total += editStatus
          ? step2CropEditStatus
            ? items[i].total
            : items[i].total
          : items[i].total;
      }
      totalunitvalue += editStatus
        ? step2CropEditStatus
          ? parseFloat(items[i].qty)
          : parseFloat(items[i].qty) // items[i].lineItems[i].qty
        : parseFloat(items[i].qty);
      gTotal = total;
      setGrossTotal(total);
      setTotalUnits(totalunitvalue);
    }
  };
  const getTotalValue = (value) => {
    return (value / 100) * grossTotal;
  };
  const getTotalUnits = (val) => {
    return val * totalUnits;
  };
  const getTotalBillAmount = () => {
    var t = Number(
      // getTotalValue(commValue) +
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
        Number(otherfeeValue)
      // +
      // Number(advancesValue)
    );
    let totalValue = grossTotal + t;
    if (includeComm) {
      if (isShown) {
        totalValue = totalValue + getTotalValue(commValue);
      }
    } else {
      if (isShown) {
        totalValue = totalValue + getTotalValue(commValue);
      }
    }
    for (var i = 0; i < questionsTitle.length; i++) {
      if (questionsTitle[i].field != "") {
        if (questionsTitle[i].less) {
          var t = 0;
          totalValue = totalValue - Number(questionsTitle[i].fee);
        } else {
          totalValue = totalValue + Number(questionsTitle[i].fee);
        }
      }
    }
    if (addRetComm) {
      totalValue = (totalValue - getTotalValue(retcommValue)).toFixed(2);
    } else {
      totalValue = (totalValue + getTotalValue(retcommValue)).toFixed(2);
    }
    return totalValue;
  };
  const getTotalRcble = () => {
    if (!includeComm || includeComm) {
      return Number(getTotalBillAmount());
      // if (isShown) {
      //   return Number(getTotalBillAmount()) - Number(cashRcvdValue);
      // } else {
      //   return Number(getTotalBillAmount()) - Number(cashRcvdValue);
      // }
    }
    // else {
    //   return Number(getTotalBillAmount());
    //   // if (isShown) {
    //   //   return Number(getTotalBillAmount()) - Number(cashRcvdValue);
    //   // } else {
    //   //   return Number(getTotalBillAmount()) - Number(cashRcvdValue).toFixed(2);
    //   // }
    // }
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
        Number(otherfeeValue)
      // Number(advancesValue)
    );
    var finalValue = grossTotal + t;
    var finalVal = finalValue;
    if (editStatus ? billEditItem?.commIncluded : includeComm) {
      // if (isShown) {
      finalVal = finalValue + getTotalValue(commValue);
      // }
    }
    if (editStatus ? !billEditItem?.less : !addRetComm) {
      if (editStatus ? billEditItem?.rtCommIncluded : includeRetComm) {
        finalVal = finalVal + getTotalValue(retcommValue);
      }
      //  else {
      //   finalVal = finalVal - getTotalValue(retcommValue);
      // }
    } else {
      if (editStatus ? billEditItem?.rtCommIncluded : includeRetComm) {
        finalVal = finalVal - getTotalValue(retcommValue);
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
    var outBalance = editStatus ? billEditItem?.outStBal : outBal;
    return Number(finalVal) + outBalance;
  };
  const getFinalOutstandingBal = () => {
    return getFinalLedgerbalance() - Number(cashRcvdValue).toFixed(2);
  };
  var lineItemsArray = [];
  // var cropArray = props.slectedSellCropsArray;
  var cropArray = editStatus
    ? step2CropEditStatus
      ? props.slectedSellCropsArray
      : billEditItemInfo.selectedBillInfo.lineItems
    : props.slectedSellCropsArray;
  var len = cropArray.length;
  for (var i = 0; i < len; i++) {
    lineItemsArray.push({
      cropId: cropArray[i].cropId,
      qty: parseFloat(cropArray[i].qty),
      qtyUnit: cropArray[i].qtyUnit.toUpperCase(),
      rate: parseFloat(cropArray[i].rate),
      total: cropArray[i].total,
      wastage: cropArray[i].wastage,
      weight: parseFloat(cropArray[i].weight),
      id: cropArray[i].id,
      sellBillId: billEditItem.billId,
      //bags:[],
      partyId: cropArray[i].buyerId,
      status: cropArray[i].status,
      rateType:
        cropArray[i].rateType.toLowerCase() == "kgs" ||
        cropArray[i].qtyUnit.toLowerCase() == "loads" ||
        cropArray[i].rateType == "RATE_PER_KG"
          ? "RATE_PER_KG"
          : "RATE_PER_UNIT",
      bags: cropArray[i].bags,
      cropSufx: cropArray[i].cropSufx,
      pkgUnit: "",
      mnLotId: cropArray[i].mnLotId,
      mnSubLotId: cropArray[i].mnSubLotId,
    });
  }
  const getActualRcvd = () => {
    var actualRcvd = getTotalBillAmount() - Number(cashRcvdValue);
    if (includeComm) {
      if (!isShown) {
        actualRcvd = actualRcvd + getTotalValue(commValue);
      }
    } else {
      if (isShown) {
        actualRcvd = actualRcvd - getTotalValue(commValue);
      }
    }

    if (addRetComm) {
      if (!includeRetComm) {
        actualRcvd = (actualRcvd + getTotalValue(retcommValue)).toFixed(2);
      }
    } else {
      if (!includeRetComm) {
        actualRcvd = (actualRcvd - getTotalValue(retcommValue)).toFixed(2);
      }
    }
    return actualRcvd;
  };
  const [cashCommentTextVal, setCashCommentVal] = useState(
    billEditItemInfo?.selectedBillInfo?.cashRcvdCmnt != ""
      ? billEditItemInfo?.selectedBillInfo?.cashRcvdCmnt
      : ""
  );
  const [transTotalValue, setTransTotalValue] = useState(0);
  const [labourTotalValue, setLaborTotalValue] = useState(0);
  const [rentTotalValue, setRentTotalValue] = useState(0);
  const sellBillRequestObj = {
    actualReceivable: Number(getActualRcvd()),
    // advance: Number(advancesValue),
    billDate: partnerSelectDate,
    billStatus: "COMPLETED",
    billId: billIdVal,
    caId: clickId,
    cashRcvd: Number(cashRcvdValue),
    cashRcvdCmnt: cashCommentTextVal,
    comm: Number(getTotalValue(commValue).toFixed(2)),
    commIncluded: includeComm,
    commShown: isShown,
    comments: commentFieldText,
    createdBy: 0,
    buyerId: editStatus ? billEditItem.buyerId : buyerInfo.partyId, //partnerSelectedData.partyId,
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
    otherFee: Number(otherfeeValue),
    outStBal: outBal,
    paidTo: 100,
    rent:
      rentTotalValue != 0
        ? Number(rentTotalValue)
        : tableChangeStatus
        ? Number(rentValue)
        : Number(getTotalUnits(rentValue).toFixed(2)),
    rtComm: Number(getTotalValue(retcommValue).toFixed(2)),
    rtCommIncluded: includeRetComm,
    totalReceivable: Number(getTotalRcble().toFixed(2)),
    transportation:
      transTotalValue != 0
        ? Number(transTotalValue)
        : tableChangeStatus
        ? Number(transportationValue)
        : Number(getTotalUnits(transportationValue).toFixed(2)),
    transporterId:
      transpoSelectedData != null ? transpoSelectedData.partyId : "",
    updatedOn: "",
    writerId: writerId,
    timeStamp: "",
    customFields: questionsTitle,
    source: "WEB",
    billAmt: getTotalBillAmount() != 0 ? Number(getTotalBillAmount()) : 0,
    // advBal: 0,
    finalLedgerBal:
      getFinalLedgerbalance() != 0
        ? Number(getFinalLedgerbalance().toFixed(2))
        : 0,
    finalOutStBal: Number(getFinalOutstandingBal().toFixed(2)),
  };
  const editBillRequestObj = {
    action: "UPDATE",
    billAttributes: {
      actualPayRecieevable: Number(getActualRcvd()),
      // advance: 0,
      billDate: partnerSelectDate,
      cashRcvd: Number(cashRcvdValue),
      CashCmnt: cashCommentTextVal,
      comm: Number(getTotalValue(commValue).toFixed(2)),
      commIncluded: billEditItem?.commIncluded,
      comments: commentFieldText,
      customFields: questionsTitle,
      govtLevies: Number(levisValue),
      grossTotal: grossTotal,
      labourCharges:
        labourTotalValue != 0
          ? Number(labourTotalValue)
          : tableChangeStatus
          ? Number(laborChargeValue)
          : Number(getTotalUnits(laborChargeValue).toFixed(2)),
      less: billEditItem?.less,
      mandiFee: Number(getTotalValue(mandifeeValue).toFixed(2)),
      misc: Number(otherfeeValue),
      otherFee: Number(otherfeeValue),
      outStBal: editStatus ? billEditItem?.outStBal : outBal,
      paidTo: 0,
      partyId: billEditItem.buyerId, //partnerSelectedData.partyId,
      rent:
        rentTotalValue != 0
          ? Number(rentTotalValue)
          : tableChangeStatus
          ? Number(rentValue)
          : Number(getTotalUnits(rentValue).toFixed(2)),
      rtComm: Number(getTotalValue(retcommValue).toFixed(2)),
      rtCommIncluded: billEditItem?.rtCommIncluded,
      totalPayRecieevable: Number(getTotalRcble().toFixed(2)),
      transportation:
        transTotalValue != 0
          ? Number(transTotalValue)
          : tableChangeStatus
          ? Number(transportationValue)
          : Number(getTotalUnits(transportationValue).toFixed(2)),

      transporterId:
        transpoSelectedData != null ? transpoSelectedData?.transporterId : 0,
      billAmt: getTotalBillAmount() != 0 ? Number(getTotalBillAmount()) : 0,
      // advBal: 0,
      finalLedgerBal:
        getFinalLedgerbalance() != 0
          ? Number(getFinalLedgerbalance().toFixed(2))
          : 0,
      finalOutStBal: Number(getFinalOutstandingBal().toFixed(2)),
    },
    billId: billEditItem.billId,
    billType: "SELL",
    caBSeq: billEditItem.caBSeq,
    caId: clickId,
    lineItems: step2CropEditStatus ? lineItemsArray : [],
    updatedBy: 0,
    updatedOn: "",
    writerId: writerId,
    source: "WEB",
    // advBal: 0,
  };

  const postsellbill = () => {
    console.log(editBillRequestObj, "sellBillRequestObj");
    // if(advancesValue > outBalAdvance){
    //   toast.error('You have entered advances amount higher than outstanding advance.Please correct it before sumitting the bill.', {
    //     toastId: "error10",
    //   });
    //   $("#disable").attr("disabled", false);
    // }

    if (editStatus) {
      editbuybillApi(editBillRequestObj).then(
        (response) => {
          if (response.data.status.type === "SUCCESS") {
            toast.success(response.data.status.message, {
              toastId: "success1",
            });
            // props.closeStep3Modal();
            localStorage.setItem("stepOneSingleBook", false);
            localStorage.setItem("billViewStatus", false);
            if (!props.fromLedger) {
              window.setTimeout(function () {
                props.closem();
              }, 800);
              window.setTimeout(function () {
                navigate("/sellbillbook");
                window.location.reload();
              }, 1000);
            } else {
              console.log("from ledger step3", props.fromLedger);
              window.setTimeout(function () {
                props.closem();
              }, 800);
              getSellBillId(clickId, billEditItem?.caBSeq).then((res) => {
                if (res.data.status.type === "SUCCESS") {
                  Object.assign(res.data.data, { partyType: "BUYER" });
                  dispatch(billViewInfo(res.data.data));
                  localStorage.setItem(
                    "billData",
                    JSON.stringify(res.data.data)
                  );
                }
              });
              window.setTimeout(function () {
                navigate("/buyerLedger");
                window.location.reload();
              }, 1000);
            }
          }
        },
        (error) => {
          toast.error(error.response.data.status.description, {
            toastId: "error1",
          });
          $("#disable").attr("disabled", false);
        }
      );
    } else {
      if (outBalStatus) {
        if (!disableDaysStatus) {
          postsellbillApi(sellBillRequestObj).then(
            (response) => {
              if (response.data.status.message === "SUCCESS") {
                toast.success(response.data.status.description?.toUpperCase(), {
                  toastId: "success1",
                });
                localStorage.setItem("stepOneSingleBook", false);
                window.setTimeout(function () {
                  props.closem();
                }, 800);
                window.setTimeout(function () {
                  navigate("/sellbillbook");
                  window.location.reload();
                }, 1000);
              }
            },
            (error) => {
              toast.error(error.response.data.status.description, {
                toastId: "error1",
              });
              $("#disable").attr("disabled", false);
              setBillCreationStatus(billIdVal != 0 ? false : true);
            }
          );
        } else {
          toast.error(
            `Select a “Bill Date” from past ${numberOfDaysValue} days only. `,
            {
              toastId: "error6",
            }
          );
        }
      } else {
        toast.error("Failed to fetch Outstanding Balance", {
          toastId: "error5",
        });
        $("#disable").attr("disabled", false);
      }
    }
  };

  const [enterVal, setEnterVal] = useState();
  const advLevOnchangeEvent = (groupLiist, index) => (e) => {
    var val = e.target.value
      .replace(/[^\d.]/g, "")
      .replace(/^(\d*)(\.\d{0,2})\d*$/, "$1$2")
      .replace(/(\.\d{0,2})\d*/, "$1")
      .replace(/(\.\d*)\./, "$1");
    let updatedItems = groupLiist.map((item, i) => {
      if (i == index) {
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
            if (editStatus) {
              let tabIndex = tab.findIndex(
                (x) => x.fieldName === groupLiist[i].settingName
              );
              if (tabIndex == -1) {
                tab.push({
                  comments: "",
                  fee: getTargetValue(e.target.value, groupLiist[i], i),
                  field: groupLiist[i].cstmName,
                  fieldName: groupLiist[i].settingName,
                  fieldType: groupLiist[i].fieldType,
                  index: index,
                  less: groupLiist[i].addToGt == 1 ? false : true,
                });
              } else {
                let tabObje = { ...tab[tabIndex] };
                tabObje = {
                  ...tabObje,
                  fee: getTargetValue(e.target.value, groupLiist[i], i),
                };
                tab[tabIndex] = tabObje;
              }
            } else {
              tab.push({
                comments: "",
                fee: getTargetValue(e.target.value, groupLiist[i], i),
                field: groupLiist[i].cstmName,
                fieldName: groupLiist[i].settingName,
                fieldType: groupLiist[i].fieldType,
                index: index,
                less: groupLiist[i].addToGt == 1 ? false : true,
              });
            }
          }
          setQuestionsTitle(tab);
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
  const fieldOnchangeEvent = (groupLiist, index) => (e) => {
    var val = e.target.value
      .replace(/[^\d.]/g, "")
      .replace(/^(\d*)(\.\d{0,2})\d*$/, "$1$2")
      .replace(/(\.\d{0,2})\d*/, "$1")
      .replace(/(\.\d*)\./, "$1");
    let updatedItem3 = groupLiist.map((item, i) => {
      if (i == index) {
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
            if (editStatus) {
              let tabIndex = tab.findIndex(
                (x) => x.fieldName === groupLiist[i].settingName
              );
              if (tabIndex == -1) {
                tab.push({
                  comments: "",
                  fee: getTargetValue(e.target.value, groupLiist[i], i),
                  field: groupLiist[i].cstmName,
                  fieldName: groupLiist[i].settingName,
                  fieldType: groupLiist[i].fieldType,
                  index: index,
                  less: groupLiist[i].addToGt == 1 ? false : true,
                });
              } else {
                let tabObje = { ...tab[tabIndex] };
                tabObje = {
                  ...tabObje,
                  fee: getTargetValue(e.target.value, groupLiist[i], i),
                };
                tab[tabIndex] = tabObje;
              }
            } else {
              tab.push({
                comments: "",
                fee: getTargetValue(e.target.value, groupLiist[i], i),
                field: groupLiist[i].cstmName,
                fieldName: groupLiist[i].settingName,
                fieldType: groupLiist[i].fieldType,
                index: index,
                less: groupLiist[i].addToGt == 1 ? false : true,
              });
            }
          }
          setQuestionsTitle(tab);
        }
        getAdditionValues(groupLiist[i], val);
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
            if (editStatus) {
              let tabIndex = tab.findIndex(
                (x) => x.fieldName === groupLiist[i].settingName
              );
              if (tabIndex == -1) {
                tab.push({
                  comments: "",
                  fee: Number(e.target.value),
                  field: groupLiist[i].cstmName,
                  fieldName: groupLiist[i].settingName,
                  fieldType: groupLiist[i].fieldType,
                  index: index,
                  less: groupLiist[i].addToGt == 1 ? false : true,
                });
              } else {
                let tabObje = { ...tab[tabIndex] };
                tabObje = { ...tabObje, fee: Number(e.target.value) };
                tab[tabIndex] = tabObje;
              }
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
            }
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
    var val = e.target.value
      .replace(/[^\d.]/g, "")
      .replace(/^(\d*)(\.\d{0,2})\d*$/, "$1$2")
      .replace(/(\.\d{0,2})\d*/, "$1")
      .replace(/(\.\d*)\./, "$1");
    let updatedItem2 = groupLiist.map((item, i) => {
      if (i == index) {
        if (groupLiist[i].cstmName != "") {
          let tab = [...questionsTitle];
          let tabIndex = tab.findIndex((x) => x.index === i);
          if (tabIndex !== -1) {
            tab[tabIndex].fee = getTargetValue(
              e.target.value,
              groupLiist[i],
              i
            );
          } else {
            if (editStatus) {
              let tabIndex = tab.findIndex(
                (x) => x.fieldName === groupLiist[i].settingName
              );
              if (tabIndex == -1) {
                tab.push({
                  comments: "",
                  fee: getTargetValue(e.target.value, groupLiist[i], i),
                  field: groupLiist[i].cstmName,
                  fieldName: groupLiist[i].settingName,
                  fieldType: groupLiist[i].fieldType,
                  index: i,
                  less: groupLiist[i].addToGt == 1 ? false : true,
                });
              } else {
                let tabObje = { ...tab[tabIndex] };
                tabObje = {
                  ...tabObje,
                  fee: getTargetValue(e.target.value, groupLiist[i], i),
                };
                tab[tabIndex] = tabObje;
              }
            } else {
              tab.push({
                comments: "",
                fee: getTargetValue(e.target.value, groupLiist[i], i),
                field: groupLiist[i].cstmName,
                fieldName: groupLiist[i].settingName,
                fieldType: groupLiist[i].fieldType,
                index: i,
                less: groupLiist[i].addToGt == 1 ? false : true,
              });
            }
            setQuestionsTitle(tab);
          }
        }
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
    setEnterVal(val);
  };
  const commRetComTotalOnchangeEvent = (groupLiist, index) => (e) => {
    var val = e.target.value.replace(/[^0-9.]/g, "");
    let updatedItem = groupLiist.map((item, i) => {
      if (i == index) {
        var v = (val / grossTotal) * 100;
        if (v != 0) {
          v = v;
        }
        if (groupLiist[i].cstmName != "") {
          let tab = [...questionsTitle];
          let tabIndex = tab.findIndex((x) => x.index === index);
          if (tabIndex !== -1) {
            tab[tabIndex].fee = Number(e.target.value);
          } else {
            if (editStatus) {
              let tabIndex = tab.findIndex(
                (x) => x.fieldName === groupLiist[i].settingName
              );
              if (tabIndex == -1) {
                tab.push({
                  comments: "",
                  fee: Number(e.target.value),
                  field: groupLiist[i].cstmName,
                  fieldName: groupLiist[i].settingName,
                  fieldType: groupLiist[i].fieldType,
                  index: index,
                  less: groupLiist[i].addToGt == 1 ? false : true,
                });
              } else {
                let tabObje = { ...tab[tabIndex] };
                tabObje = { ...tabObje, fee: Number(e.target.value) };
                tab[tabIndex] = tabObje;
              }
            } else {
              tab.push({
                comments: "",
                fee: Number(e.target.value),
                field: groupLiist[i].cstmName,
                fieldName: groupLiist[i].settingName,
                fieldType: groupLiist[i].fieldType,
                index: index,
                less: groupLiist[i].addToGt == 1 ? false : true,
              });
            }
            setQuestionsTitle(tab);
          }

          setQuestionsTitle(tab);
        }
        getAdditionValues(groupLiist[i], v);
        return { ...groupLiist[i], value: v.toFixed(2), totalVal: val };
      } else {
        return { ...groupLiist[i] };
      }
    });
    setAllGroups([...updatedItem]);
  };
  const getTargetValue = (val, list, index) => {
    if (list.fieldType == "SIMPlE" || list.fieldType == null) {
      return (list.fee = Number(val));
    } else if (list.fieldType == "COMPLEX_RS") {
      if (tableChangeStatus) {
        return (list.fee = Number(val));
      } else {
        return (list.fee = Number(getTotalUnits(val).toFixed(2)));
      }
    } else if (list.fieldType == "COMPLEX_PERCENTAGE") {
      return (list.fee = Number(getTotalValue(val).toFixed(2)));
    }
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
      getMandiFeeInput(v);
    }
    if (groupLiist.settingName == "OTHER_FEE") {
      getOtherfeeValue(v);
    }
    if (groupLiist.settingName == "GOVT_LEVIES") {
      getlevisValue(v);
    }
    if (groupLiist.settingName == "CASH_RECEIVED") {
      getCashRcvdValue(v);
    }
    if (groupLiist.settingName == "ADVANCES") {
      getAdvancesValue(v);
    }
  };

  const resetInput = (e) => {
    if (e.target.value == 0) {
      e.target.value = "";
    }
  };

  const [selectedBilldate, setselectedbilldate] = useState(false);
  const [cropEditObject, setcropEditObject] = useState([]);
  const [slectedCropstableArray, setslectedCropstableArray] = useState([]);
  const [selectedPartyType, setselectedPartyType] = useState("");
  const [cropTableEditStatus, setcropTableEditStatus] = useState(
    billEditItemInfo?.cropTableEditStatus
  );
  const [selectedCrops, setselectedCrops] = useState([]);
  const callbackFunctionPartySelect = (
    partyselectedarray,
    trans,
    cropEditObject,
    slectedCropstableArray,
    selectedCrops
  ) => {
    setpartnerSelectedData(partyselectedarray);
    setTranspoSelectedData(trans);
    props.step3ParentCallback(
      cropEditObject,
      slectedCropstableArray,
      selectedCrops
    );
    setcropEditObject(cropEditObject);
    setselectedCrops(selectedCrops);
    setslectedCropstableArray(slectedCropstableArray);
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
    dispatch(fromBillbook(false));
    dispatch(tableEditStatus(true));
    props.step3ParentCallback(
      slectedCropstableArray,
      slectedCropstableArray,
      selectedCrops
    );
  };
  const cancelStep = () => {
    dispatch(selectTrans(null));
    dispatch(selectBuyer(null));
    props.closem();
    if (editStatus) {
      window.location.reload();
    }
  };
  const [commentShownStatus, setCommentShownStatus] = useState(
    editStatus
      ? billEditItemInfo?.selectedBillInfo?.comments != ""
        ? true
        : false
      : false
  );
  const [cashPaidCommentStatus, setCashPaidComment] = useState(
    editStatus
      ? billEditItemInfo?.selectedBillInfo?.cashRcvdCmnt != ""
        ? true
        : false
      : false
  );
  const addCommentClick = () => {
    setCommentShownStatus(true);
  };
  const addCashCommentClick = () => {
    setCashPaidComment(true);
  };
  const commentText = (e) => {
    var val = e.target.value;
    setCommentFieldText(val);
  };
  const cashCommentText = (e) => {
    var val = e.target.value;
    setCashCommentVal(val);
  };
  $("#disable").on("click", function () {
    $("#disable").attr("disabled", true);
  });
  const cstmCommentText = (groupLiist, index) => (e) => {
    var val = e.target.value;
    let updatedItems = groupLiist.map((item, i) => {
      if (i == index) {
        if (groupLiist[i].cstmName != "") {
          let tab = [...questionsTitle];
          let tabIndex = tab.findIndex((x) => x.index === index);
          if (tabIndex !== -1) {
            tab[tabIndex].comments = val;
            if (
              groupLiist[index]?.fieldType.toUpperCase() == "SIMPLE" ||
              groupLiist[index].fieldType == null
            ) {
              tab[tabIndex].fee = parseFloat(groupLiist[i].value);
            } else if (
              groupLiist[index]?.fieldType.toUpperCase() == "COMPLEX_RS"
            ) {
              tab[tabIndex].fee = parseFloat(groupLiist[i].value);
            } else {
              tab[tabIndex].fee = groupLiist[i].totalVal;
            }
          } else {
            tab.push({
              comments: val,
              fee:
                groupLiist[index]?.fieldType == "SIMPLE"
                  ? parseFloat(groupLiist[i].value)
                  : groupLiist[index]?.fieldType.toUpperCase() == "COMPLEX_RS"
                  ? parseFloat(groupLiist[i].value)
                  : groupLiist[i].totalVal,
              field: groupLiist[i].cstmName,
              fieldName: groupLiist[i].settingName,
              fieldType: groupLiist[i].fieldType,
              index: index,
              less: groupLiist[i].addToGt == 1 ? false : true,
            });
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
    <>
      {isLoading ? (
        <div className="">
          <img src={loading} alt="my-gif" className="gif_img" />
        </div>
      ) : (
        <div>
          <div className="main_div_padding">
            <div className="row">
              <div className="col-lg-3 p-0">
                <Step3PartySelect
                  parentSelectedParty={callbackFunctionPartySelect}
                  billEditItemval={billEditItem}
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
                        ? props.slectedSellCropsArray
                        : billEditItemInfo.selectedBillInfo
                      : props.slectedSellCropsArray
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
                            <div>
                              <CommissionCard
                                title={item.settingName}
                                rateTitle={item.subText}
                                onChange={commRetCommOnchangeEvent(
                                  allGroups,
                                  index
                                )}
                                inputValue={allGroups[index].value}
                                inputText={allGroups[index].totalVal}
                                totalTitle="Total"
                                totalOnChange={commRetComTotalOnchangeEvent(
                                  allGroups,
                                  index
                                )}
                              />
                              {item?.comments ? (
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
                            </div>
                          );
                        } else if (allGroups[index].tableType == 3) {
                          return tableChangeStatus ? (
                            <div>
                              {allGroups[index]?.settingName == null ? (
                                ""
                              ) : (
                                <div className="comm_cards">
                                  <div className="card input_card">
                                    <div className="row">
                                      <div className="col-lg-3 title_bg">
                                        <h5 className="comm_card_title mb-0">
                                          {allGroups[index]?.settingName == null
                                            ? ""
                                            : //  (allGroups[index]?.cstmName != '' ? (allGroups[index]?.customFieldName != null ? getText(allGroups[index]?.customFieldName) : getText(allGroups[index]?.cstmName)) : getText(allGroups[index]?.cstmName) )
                                              getText(
                                                allGroups[index]?.settingName
                                              )}
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
                              )}

                              {item?.comments ? (
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
                              onChangeTotals={fieldOnchangeTotals(
                                allGroups,
                                index
                              )}
                            />
                          );
                        } else if (allGroups[index].tableType == 1) {
                          return (
                            <div>
                              {allGroups[index]?.settingName == null ? (
                                ""
                              ) : (
                                <div className="comm_cards">
                                  <div className="card input_card">
                                    <div className="row">
                                      <div className="col-lg-3 title_bg">
                                        <h5 className="comm_card_title mb-0">
                                          {allGroups[index]?.settingName == null
                                            ? ""
                                            : // (allGroups[index]?.cstmName != '' ? (allGroups[index]?.customFieldName != null ? getText(allGroups[index]?.customFieldName) : getText(allGroups[index]?.cstmName)) : getText(allGroups[index]?.cstmName) )
                                              getText(
                                                allGroups[index]?.settingName
                                              )}
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
                              )}
                              {item?.comments ? (
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
                                  <button
                                    className="comment_text"
                                    onClick={() => addCommentClick()}
                                  >
                                    +Add Comment
                                  </button>
                                )
                              ) : (
                                ""
                              )}
                              {allGroups[index].settingName ==
                              "CASH_RECEIVED" ? (
                                cashPaidCommentStatus ? (
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
                                            value={cashCommentTextVal}
                                            onChange={cashCommentText}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    className="comment_text"
                                    onClick={() => addCashCommentClick()}
                                  >
                                    +Add Comment
                                  </button>
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
              <div className="col-lg-3 pl-0">
                <h5 className="head_modal">Totals</h5>
                <div className="default_card comm_total_card total_bal">
                  <div className="totals_value pt-0">
                    <h5>Gross Total (₹)</h5>
                    <h6 className="black_color">
                      {getCurrencyNumberWithOutSymbol(grossTotal)}
                    </h6>
                  </div>
                  <div className="totals_value">
                    <h5>Total Bill Amount (₹)</h5>
                    <h6 className="color_green">
                      {getCurrencyNumberWithOutSymbol(
                        Number(getTotalBillAmount())
                      )}
                    </h6>
                  </div>
                  {outBalformStatusvalue ? (
                    <div className="totals_value">
                      <h5>Outstanding Balance (₹)</h5>
                      <h6 className="color_green">
                        {outBal != 0
                          ? editStatus
                            ? billEditItem?.outStBal != 0
                              ? getCurrencyNumberWithOutSymbol(
                                  billEditItem?.outStBal
                                )
                              : 0
                            : getCurrencyNumberWithOutSymbol(outBal)
                          : "0"}
                      </h6>
                    </div>
                  ) : (
                    ""
                  )}

                  {/* {outBalformStatusvalue ? ( */}
                  <div className="totals_value">
                    <h5>Final Ledger Balance (₹)</h5>
                    <h6 className="color_green">
                      {getCurrencyNumberWithOutSymbol(getFinalLedgerbalance())}
                    </h6>
                  </div>
                  {/* // ) : (
              //   <div className="totals_value">
              //     <h5>Total Receivables (₹)</h5>
              //     <h6 className="color_green">
              //       {getCurrencyNumberWithOutSymbol(getTotalRcble())}
              //     </h6>
              //   </div>
              // )} */}
                  {cashRcvdValue != 0 ? (
                    <div className="totals_value">
                      <h5>Cash Received (₹)</h5>
                      <h6>
                        -
                        {billEditItem?.cashRcvd
                          ? cashRcdStatus
                            ? getCurrencyNumberWithOutSymbol(
                                Number(cashRcvdValue)
                              )
                            : getCurrencyNumberWithOutSymbol(
                                billEditItem?.cashRcvd
                              )
                          : getCurrencyNumberWithOutSymbol(
                              Number(cashRcvdValue)
                            )}
                      </h6>
                    </div>
                  ) : (
                    ""
                  )}
                  {outBalformStatusvalue ? (
                    <div className="totals_value">
                      <h5>Final Outstanding Balance (₹)</h5>
                      <h6 className="color_green">
                        {getCurrencyNumberWithOutSymbol(
                          getFinalOutstandingBal()
                        )}
                      </h6>
                    </div>
                  ) : (
                    <div className="totals_value">
                      <h5>Total Receivables (₹)</h5>
                      <h6 className="color_green">
                        {getCurrencyNumberWithOutSymbol(getTotalRcble())}
                      </h6>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <ToastContainer />
          </div>
          <div className="bottom_div">
            <div className="d-flex align-items-center justify-content-between">
              <button className="secondary_btn" onClick={cancelStep}>
                cancel
              </button>
              <div className="d-flex align-items-center">
                <button
                  className="secondary_btn no_delete_btn"
                  onClick={() => previousStep()}
                >
                  Previous
                </button>
                <button
                  className="primary_btn"
                  id="disable"
                  onClick={() => postsellbill()}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SellBillStep3;
