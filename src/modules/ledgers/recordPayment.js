import React from "react";
import { useState } from "react";
import close from "../../assets/images/close.svg";
import date_icon from "../../assets/images/date_icon.svg";
import DatePicker from "react-datepicker";
import single_bill from "../../assets/images/bills/single_bill.svg";
import add from "../../assets/images/add.svg";
import $ from "jquery";
import {
  getBuyBillId,
  getDetailedLedgerByDate,
  getLedgers,
  getLedgerSummaryByDate,
  getOutstandingBal,
  getSellBillId,
  getSellerDetailedLedger,
  getSellerDetailedLedgerByDate,
  postRecordPayment,
  updateRecordPayment,
} from "../../actions/ledgersService";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getMaskedMobileNumber,
  isEditBill,
} from "../../components/getCurrencyNumber";
import {
  getBuyBills,
  getBuyerDetailedLedger,
  getLedgerSummary,
  getSellBills,
} from "../../actions/billCreationService";
import { useEffect } from "react";
import {
  getParticularTransporter,
  getTransporters,
  getTransportersAll,
} from "../../actions/transporterService";
import SelectBillIds from "./selectBillIds";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { paymentViewInfo } from "../../reducers/paymentViewSlice";
import {
  allBuyBillsData,
  allLedgers,
  businessValues,
  allSellBillsData,
  detaildLedgerInfo,
  fromRecordPayment,
  ledgerSummaryInfo,
  outStandingBal,
  totalRecivables,
} from "../../reducers/ledgerSummarySlice";
import BillView from "../buy_bill_book/billView";
import { billViewInfo } from "../../reducers/billViewSlice";
import {
  allBillIdsObjects,
  dateInRP,
  dates,
} from "../../reducers/ledgersCustomDateSlice";
import { useRef } from "react";
import loading from "../../assets/images/loading.gif";
const RecordPayment = (props) => {
  const ledgerData = props.LedgerData;
  const dispatch = useDispatch();
  const partyId = props.ledgerId;
  const fromBillViewPopup = props.fromBillViewPopup;
  const fromBillbookToRecordPayment = props.fromBillbookToRecordPayment;
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
  const [showBillModalStatus, setShowBillModalStatus] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [selectDate, setSelectDate] = useState(
    props.fromPaymentHistory
      ? fromBillViewPopup
        ? new Date(ledgerData?.billDate)
        : new Date(ledgerData?.date)
      : new Date()
  );
  const paidRcvd = props.fromPaymentHistory
    ? fromBillViewPopup
      ? props.outStbal
      : ledgerData.balance
    : props.outStbal;
  let [paidsRcvd, setPaidsRcvd] = useState(
    props.fromPaymentHistory
      ? fromBillViewPopup
        ? props.partyType == "BUYER"
          ? ledgerData?.actualReceivable
          : ledgerData?.actualPaybles
        : ledgerData?.amount
      : 0
  );
  const [comments, setComments] = useState(
    props.fromPaymentHistory ? ledgerData?.comments : " "
  );
  const [paymentMode, setPaymentMode] = useState(
    props.fromPaymentHistory
      ? fromBillViewPopup
        ? "CASH"
        : ledgerData?.paymentMode
      : "CASH"
  );
  const [requiredCondition, setRequiredCondition] = useState("");

  const [ledgerSummary, setLedgerSummary] = useState([]);
  const [detailedLedger, setdetailedLedger] = useState([]);
  const [outStAmt, setOutStAmt] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [summary, setSummary] = useState([]);

  const [showLisOfBillIdsPopUp, setShowLisOfBillIdsPopUp] = useState(false);
  const [showBillIdsModal, setShowBillIdsModal] = useState(false);

  const [discountRs, setDiscountRs] = useState(0);
  const [discountPerc, setDiscountPerc] = useState(0);
  const [billAmount, setBillAmount] = useState(0);

  const [billIds, setBillIds] = useState([]);
  const [caBSeq, setCabSeq] = useState(
    props.fromPaymentHistory
      ? fromBillViewPopup
        ? []
        : ledgerData?.billIds
      : []
  );

  const [totalRecieved, setTotalRecieved] = useState(0);
  const tabClick = useSelector((state) => state.ledgerSummaryInfo);
  const fromRecordPaymentPay = tabClick?.fromRecordPayment;
  var ledgerTab = tabClick.partnerTabs;
  var allCustomTab = tabClick.allCustomTabs;
  var startDate = tabClick.beginDate;
  var endDate = tabClick.closeDate;
  const recordPayment = tabClick?.trhoughRecordPayment;
  var billViewData = useSelector((state) => state.billViewInfo);
  const disableDaysStatus = billViewData?.disableFromLastDays;
  const numberOfDaysValue = billViewData?.numberOfDays;
  const numberOfDaysSell = billViewData?.numberOfDaysSell;
  useEffect(() => {
    setLoading(false);
  }, [props.showRecordPaymentModal]);
  const getAmountVal = (e) => {
    setPaidsRcvd(
      e.target.value
        .replace(/[^\d.]/g, "")
        .replace(/^(\d*)(\.\d{0,2})\d*$/, "$1$2")
        .replace(/(\.\d{0,2})\d*/, "$1")
        .replace(/(\.\d*)\./, "$1")
    );
    // .replace(/[^\d]/g, ""));
    if (e.target.value.length > 0) {
      setRequiredCondition("");
    }
  };
  const resetInput = (e) => {
    if (e.target.value == 0) {
      e.target.value = "";
    }
  };
  var billidsArray = [];
  const onSubmitRecordPayment = () => {
    if (billIds.length > 0 && !fromBillViewPopup) {
      paidsRcvd = totalRecieved;
      setBillIds([]);
    } else {
      if (fromBillViewPopup) {
        billidsArray.push(ledgerData.billId);
        paidsRcvd = fromBillViewPopup
          ? props.partyType == "BUYER"
            ? ledgerData?.actualReceivable
            : ledgerData?.actualPaybles
          : totalRecieved;
        setBillIds(billidsArray);
      }
    }
    var err1 =
      ledgerData?.type == "FARMER" ||
      props.partyType == "SELLER" ||
      (fromBillViewPopup && props.partyType == "FARMER")
        ? "Amount Paid cannot be negative"
        : "Amount Recieved cannot be negative";
    var errNoval =
      ledgerData?.type == "FARMER" ||
      props.partyType == "SELLER" ||
      (fromBillViewPopup && props.partyType == "FARMER")
        ? "Amount Paid cannot be empty"
        : "Amount Recieved cannot be empty";

    if (paidsRcvd < 0) {
      setRequiredCondition(err1);
      toast.error(err1, {
        toastId: "error4",
      });
    } else if (parseInt(paidsRcvd) === 0) {
      setRequiredCondition(errNoval);
      toast.error(errNoval, {
        toastId: "error5",
      });
    } else if (isNaN(paidsRcvd)) {
      setRequiredCondition("Invalid Amount");
      toast.error("Invalid Amount", {
        toastId: "error6",
      });
    } else if (
      paidsRcvd.toString().trim().length !== 0 &&
      paidsRcvd != 0 &&
      paidsRcvd <= paidRcvd &&
      !(paidsRcvd < 0)
    ) {
      addRecordPayment();
    } else if (parseInt(paidsRcvd) > paidRcvd) {
      setRequiredCondition(
        "Entered Amount  cannot more than Outstanding Balance"
      );
      toast.error("Entered Amount  cannot more than Outstanding Balance", {
        toastId: "error7",
      });
    }
  };

  const addRecordPayment = async () => {
    setLoading(true);
    var h = fromBillViewPopup
      ? billidsArray.map((item) => ledgerData.billId)
      : billIds;

    const addRecordData = {
      caId: clickId,
      partyId: partyId,
      date: moment(selectDate).format("YYYY-MM-DD"),
      comments: comments,
      paidRcvd: paidsRcvd,
      paymentMode: paymentMode,
      billIds: h,
      type: props.fromPaymentHistory
        ? fromBillViewPopup
          ? props.partyType.toUpperCase() == "FARMER"
            ? "SELLER"
            : props.partyType
          : ledgerData?.type
        : props.partyType.toUpperCase() == "FARMER"
        ? "SELLER"
        : props.partyType,
      discount: discountRs,
      writerId: writerId,
    };
    const updateRecordRequest = {
      action: "UPDATE",
      caId: clickId,
      partyId: partyId,
      date: moment(selectDate).format("YYYY-MM-DD"),
      comments: comments,
      paidRcvd: paidsRcvd,
      paymentMode: paymentMode,
      billIds: billIds,
      type: ledgerData?.type == "FARMER" ? "SELLER" : ledgerData?.type,
      discount: discountRs,
      refId: ledgerData?.refId,
      toBePaidRcvd: 0,
      mobile: ledgerData?.mobile,
      writerId: writerId,
      partyName: ledgerData.partyName,
    };
    if (props.fromPaymentHistory && !fromBillViewPopup) {
      var days =
        props.partyType == "BUYER" ? numberOfDaysSell : numberOfDaysValue;
      var value = isEditBill(selectDate, days);
      if (!value) {
        toast.error(
          `Payment Records that are more than ${days} days old can’t be deleted/edited.`,
          {
            toastId: "error6",
          }
        );
        setLoading(false);
      } else {
        await updateRecordPayment(updateRecordRequest).then(
          (res) => {
            toast.success(res.data.status.message, {
              toastId: "errorr2",
            });
            dispatch(paymentViewInfo(updateRecordRequest));
            dispatch(fromRecordPayment(true));
            window.setTimeout(function () {
              props.closeRecordPaymentModal();
              dispatch(paymentViewInfo(updateRecordRequest));
            }, 1000);
          },
          (error) => {
            console.log(error.message);
            toast.error(error.res.data.status.message, {
              toastId: "error3",
            });
            setLoading(false);
          }
        );
      }
    } else {
      if (!enableCreationStatus) {
        await postRecordPayment(addRecordData).then(
          (response) => {
            toast.success(response.data.status.message, {
              toastId: "errorr2",
            });
            window.setTimeout(function () {
              props.closeRecordPaymentModal();
              closePopup();
            }, 1000);
            dispatch(fromRecordPayment(true));
            if (fromBillViewPopup && !fromBillbookToRecordPayment) {
              if (
                props.partyType?.toLowerCase() == "seller" ||
                props.partyType?.toLowerCase() == "farmer"
              ) {
                getBuyBillId(clickId, ledgerData?.caBSeq).then((res) => {
                  if (res.data.status.type === "SUCCESS") {
                    Object.assign(res.data.data, { partyType: "FARMER" });
                    dispatch(billViewInfo(res.data.data));
                    localStorage.setItem(
                      "billData",
                      JSON.stringify(res.data.data)
                    );
                    setShowBillModalStatus(true);
                    setShowBillModal(true);
                  }
                });
              } else {
                getSellBillId(clickId, ledgerData?.caBSeq).then((res) => {
                  if (res.data.status.type === "SUCCESS") {
                    Object.assign(res.data.data, {
                      partyType: props.partyType,
                    });
                    dispatch(billViewInfo(res.data.data));
                    localStorage.setItem(
                      "billData",
                      JSON.stringify(res.data.data)
                    );
                    setShowBillModalStatus(true);
                    setShowBillModal(true);
                  }
                });
              }
            } else {
              if (
                props.partyType?.toLowerCase() == "seller" ||
                props.partyType?.toLowerCase() == "farmer"
              ) {
                getBuyBillId(clickId, ledgerData?.caBSeq).then((res) => {
                  if (res.data.status.type === "SUCCESS") {
                    Object.assign(res.data.data, { partyType: "FARMER" });
                    dispatch(billViewInfo(res.data.data));
                    localStorage.setItem(
                      "billData",
                      JSON.stringify(res.data.data)
                    );
                    setShowBillModalStatus(true);
                    setShowBillModal(true);
                  }
                });
                // startDate
                getBuyBills(clickId, startDate, endDate).then((response) => {
                  if (response.data.data != null) {
                    // setBuyBillData(response.data.data.singleBills);
                    response.data.data.singleBills.map((i, ind) => {
                      Object.assign(i, { index: ind });
                    });
                    dispatch(allBuyBillsData(response.data.data.singleBills));
                    // setBuyBillData(response.data.data.singleBills);
                  }
                });
              } else {
                getSellBillId(clickId, ledgerData?.caBSeq).then((res) => {
                  if (res.data.status.type === "SUCCESS") {
                    Object.assign(res.data.data, {
                      partyType: props.partyType,
                    });
                    dispatch(billViewInfo(res.data.data));
                    localStorage.setItem(
                      "billData",
                      JSON.stringify(res.data.data)
                    );
                    setShowBillModalStatus(true);
                    setShowBillModal(true);
                  }
                });
                getSellBills(clickId, startDate, endDate).then((response) => {
                  if (response.data.data != null) {
                    response.data.data.singleBills.map((i, ind) => {
                      Object.assign(i, { index: ind });
                    });
                    dispatch(allSellBillsData(response.data.data.singleBills));
                  } else {
                    dispatch(allSellBillsData([]));
                  }
                });
              }
            }
          },
          (error) => {
            toast.error(error.response.data.status.message, {
              toastId: "error3",
            });
            setLoading(false);
          }
        );
      } else {
        toast.error(
          `Choose “Select Date” from past ${
            props.partyType == "BUYER" ? numberOfDaysSell : numberOfDaysValue
          } days only. `,
          {
            toastId: "error10",
          }
        );
        setLoading(false);
      }
    }

    if (props.tabs == "paymentledger") {
      getTransportersData();
      getOutstandingPaybles(clickId, partyId);
      paymentLedger(clickId, partyId);
    } else {
      fetchLedgers();
      if (allCustomTab == "all" && ledgerTab == "ledgersummary") {
        summaryData(clickId, partyId);
      } else if (allCustomTab == "all" && ledgerTab == "detailedledger") {
        if (props.partyType == "BUYER" || ledgerData?.type == "BUYER") {
          geyDetailedLedger(clickId, partyId);
        } else {
          sellerDetailed(clickId, partyId);
        }
      } else if (allCustomTab == "custom" && ledgerTab == "ledgersummary") {
        var fromDate = moment(startDate).format("YYYY-MM-DD");
        var toDate = moment(endDate).format("YYYY-MM-DD");
        ledgerSummaryByDate(clickId, partyId, fromDate, toDate);
      } else if (allCustomTab == "custom" && ledgerTab == "detailedledger") {
        var fromDate = moment(startDate).format("YYYY-MM-DD");
        var toDate = moment(endDate).format("YYYY-MM-DD");
        if (props.partyType == "BUYER" || ledgerData?.type == "BUYER") {
          detailedLedgerByDate(clickId, partyId, fromDate, toDate);
        } else {
          sellerDetailedByDate(clickId, partyId, fromDate, toDate);
        }
      }
      getOutstandingPaybles(clickId, partyId);
      // window.setTimeout(function () {
      //     window.location.reload();
      // }, 2000);;
    }
  };

  const getTransportersData = () => {
    getTransportersAll(clickId).then((response) => {
      props.outStAmt(response.data.data);
      props.transData(response.data.data.ledgers);
      // setOutStAmt(response.data.data)
      // setTransData(response.data.data.ledgers)
    });
  };
  //get Payment Ledger
  const paymentLedger = (clickId, partyId) => {
    getParticularTransporter(clickId, partyId)
      .then((response) => {
        props.payledger(response.data.data);
        props.payledgersummary(response.data.data.details);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const summaryData = (clickId, partyId) => {
    getLedgerSummary(clickId, partyId)
      .then((res) => {
        if (res.data.data !== null) {
          if (res.data.status.type === "SUCCESS") {
            if (props.fromPaymentHistory || fromBillViewPopup) {
              dispatch(businessValues(res.data.data));
              dispatch(ledgerSummaryInfo(res.data.data.ledgerSummary));
            } else {
              dispatch(businessValues(res.data.data));
              dispatch(ledgerSummaryInfo(res.data.data.ledgerSummary));
            }
          } else {
            dispatch(businessValues([]));
            dispatch(ledgerSummaryInfo([]));
          }
        } else {
          dispatch(businessValues([]));
          dispatch(ledgerSummaryInfo([]));
        }
      })
      .catch((error) => console.log(error));
  };
  const geyDetailedLedger = (clickId, partyId) => {
    getBuyerDetailedLedger(clickId, partyId)
      .then((res) => {
        if (res.data.status.type === "SUCCESS") {
          if (props.fromPaymentHistory || fromBillViewPopup) {
            dispatch(totalRecivables(res.data.data));
            dispatch(detaildLedgerInfo(res.data.data.details));
          } else {
            dispatch(totalRecivables(res.data.data));
            dispatch(detaildLedgerInfo(res.data.data.details));
          }
        } else {
          dispatch(totalRecivables([]));
          dispatch(detaildLedgerInfo([]));
        }
      })
      .catch((error) => console.log(error));
  };
  //Get Seller Detailed Ledger
  const sellerDetailed = (clickId, partyId) => {
    getSellerDetailedLedger(clickId, partyId)
      .then((res) => {
        if (res.data.status.type === "SUCCESS") {
          if (props.fromPaymentHistory || fromBillViewPopup) {
            dispatch(totalRecivables(res.data.data));
            dispatch(detaildLedgerInfo(res.data.data.details));
          } else {
            dispatch(totalRecivables(res.data.data));
            dispatch(detaildLedgerInfo(res.data.data.details));
          }
        } else {
          dispatch(totalRecivables([]));
          dispatch(detaildLedgerInfo([]));
        }
      })
      .catch((error) => console.log(error));
  };
  const fetchLedgers = () => {
    var partyType = "";
    if (ledgerData?.type == "FARMER" || props.partyType == "FARMER") {
      partyType = "SELLER";
    } else {
      partyType = fromBillViewPopup
        ? props.partyType
        : props.fromPaymentHistory
        ? ledgerData?.type
        : props.partyType;
    }
    getLedgers(clickId, partyType, "", "").then((res) => {
      if (res.data.status.type === "SUCCESS") {
        if (props.allCustomTab == "all" && props.ledgerTab == "ledgersummary") {
        }
        if (props.fromPaymentHistory || fromBillViewPopup) {
          dispatch(allLedgers(res.data.data.ledgers));
          dispatch(outStandingBal(res.data.data));
        } else {
          dispatch(allLedgers(res.data.data.ledgers));
          dispatch(outStandingBal(res.data.data));
        }
      } else {
        dispatch(allLedgers([]));
        dispatch(outStandingBal([]));
      }
    });
  };
  //ledger summary by date
  const ledgerSummaryByDate = (clickId, partyId, fromDate, toDate) => {
    getLedgerSummaryByDate(clickId, partyId, fromDate, toDate)
      .then((res) => {
        if (res.data.data !== null) {
          if (props.fromPaymentHistory || fromBillViewPopup) {
            dispatch(businessValues(res.data.data));
            dispatch(ledgerSummaryInfo(res.data.data.ledgerSummary));
          } else {
            dispatch(businessValues(res.data.data));
            dispatch(ledgerSummaryInfo(res.data.data.ledgerSummary));
          }
        } else {
          dispatch(businessValues([]));
          dispatch(ledgerSummaryInfo([]));
        }
      })
      .catch((error) => console.log(error));
  };
  //Buyer Detailed Ledger By Date
  const detailedLedgerByDate = (clickId, partyId, fromDate, toDate) => {
    getDetailedLedgerByDate(clickId, partyId, fromDate, toDate)
      .then((res) => {
        if (res.data.data !== null) {
          if (props.fromPaymentHistory || fromBillViewPopup) {
            dispatch(totalRecivables(res.data.data));
            dispatch(detaildLedgerInfo(res.data.data.details));
          } else {
            dispatch(totalRecivables(res.data.data));
            dispatch(detaildLedgerInfo(res.data.data.details));
          }
        } else {
          dispatch(totalRecivables([]));
          dispatch(detaildLedgerInfo([]));
        }
      })
      .catch((error) => console.log(error));
  };

  //Seller Detailed ledger By Date
  const sellerDetailedByDate = (clickId, partyId, fromDate, toDate) => {
    getSellerDetailedLedgerByDate(clickId, partyId, fromDate, toDate)
      .then((res) => {
        if (res.data.data !== null) {
          if (props.fromPaymentHistory || fromBillViewPopup) {
            dispatch(totalRecivables(res.data.data));
            dispatch(detaildLedgerInfo(res.data.data.details));
          } else {
            dispatch(totalRecivables(res.data.data));
            dispatch(detaildLedgerInfo(res.data.data.details));
          }
        } else {
          dispatch(totalRecivables([]));
          dispatch(detaildLedgerInfo([]));
        }
      })
      .catch((error) => console.log(error));
  };
  //Get Outstanding balance
  const getOutstandingPaybles = (clickId, partyId) => {
    getOutstandingBal(clickId, partyId).then((response) => {
      if (response.data.data != null) {
        props.setPaidRcvd(response.data.data.tobePaidRcvd);
      }
    });
  };
  const showListOfBillIds = (id) => {
    setShowLisOfBillIdsPopUp(true);
    setShowBillIdsModal(true);
    if (showBillIdsModal) {
      setBillIds([]);
      setCabSeq([]);
    }
  };

  const billidsData = (data) => {
    if (data.length > 0) {
      var values = data.map((item) => item.billId);
      var sequences = data.map((item) => item.caBSeq);
      var recieved = 0;
      data.map((item) => {
        recieved += item.amount;
      });
      setCabSeq(sequences);
      setBillIds(values);
      setTotalRecieved(recieved.toFixed(2));
    } else {
      setBillIds([]);
      setCabSeq([]);
      setTotalRecieved(0);
    }
  };

  const closePopup = () => {
    if (!props.fromPaymentHistory) {
      setPaidsRcvd(0);
      setRequiredCondition("");
      setPaymentMode("CASH");
      setComments("");
      setSelectDate(new Date());
      setBillIds([]);
      setDiscountRs(0);
      setBillAmount(0);
      setDiscountPerc(0);
      setTotalRecieved(0);
    } else {
      if (props.fromPaymentHistory || fromBillViewPopup) {
        if (fromBillViewPopup) {
          setSelectDate(new Date(ledgerData?.billDate));
          setPaymentMode("CASH");
          setComments("");
        } else {
          setPaidsRcvd(ledgerData?.amount);
          setComments(ledgerData?.comments);
          setPaymentMode(ledgerData?.paymentMode);
          setSelectDate(new Date(ledgerData?.date));
        }
      }
      if (fromRecordPayment) {
        setDiscountRs(0);
        setDiscountPerc(0);
      } else {
        if (!fromBillbookToRecordPayment) {
          if (ledgerData?.billIds.length == 0) {
            setBillIds([]);
            setDiscountRs(0);
            setDiscountPerc(0);
          }
        }
      }
    }
  };
  const getDiscountPercentageValue = (e) => {
    var val = e.target.value
      .replace(/[^\d.]/g, "")
      .replace(/^(\d*)(\.\d{0,2})\d*$/, "$1$2")
      .replace(/(\.\d{0,2})\d*/, "$1")
      .replace(/(\.\d*)\./, "$1");
    setDiscountPerc(val);
    if (fromBillViewPopup) {
      if (
        ledgerData.actualReceivable !== 0 ||
        ledgerData?.actualPaybles !== 0
      ) {
        var discountRupees =
          (val / 100) *
          (props.partyType == "BUYER"
            ? ledgerData?.actualReceivable
            : ledgerData?.actualPaybles);
        setBillAmount(
          (
            (props.partyType == "BUYER"
              ? ledgerData?.actualReceivable
              : ledgerData?.actualPaybles) - discountRupees
          ).toFixed(2)
        );
        setDiscountRs(discountRupees.toFixed(2));
      }
    } else {
      if (totalRecieved !== 0) {
        var discountRupees = (val / 100) * totalRecieved;
        setBillAmount((totalRecieved - discountRupees).toFixed(2));
        setDiscountRs(discountRupees.toFixed(2));
      }
    }
  };
  const getDiscountRsValue = (e) => {
    var val = e.target.value
      .replace(/[^\d.]/g, "")
      .replace(/^(\d*)(\.\d{0,2})\d*$/, "$1$2")
      .replace(/(\.\d{0,2})\d*/, "$1")
      .replace(/(\.\d*)\./, "$1");
    setDiscountRs(val);
    if (totalRecieved !== 0) {
      var perc = (val / totalRecieved) * 100;
      setDiscountPerc(perc.toFixed(2));
      setBillAmount((totalRecieved - val).toFixed(2));
    }
  };
  const [enableCreationStatus, setEnableCreationStatus] = useState(false);
  const onChangeDateSelect = (date) => {
    setSelectDate(date);
    dispatch(dateInRP(date));
    dispatch(dates(date));
    var days =
      props.partyType == "BUYER" ? numberOfDaysSell : numberOfDaysValue;
    var value = isEditBill(date, days);
    if (!value) {
      setEnableCreationStatus(true);
      // dispatch(disableFromLastDays(true));
      toast.error(`Choose “Select Date” from past ${days} days only. `, {
        toastId: "error6",
      });
    } else {
      setEnableCreationStatus(false);
      // dispatch(disableFromLastDays(false));
    }
  };
  const handleCommentText = (e) => {
    let text = e.target.value;
    let value = text.slice(0, 25);
    setComments(value);
  };
  return (
    <div>
      <Modal
        show={props.showRecordPaymentModal}
        close={props.closeRecordPaymentModal}
        className="record_payment_modal"
      >
        {isLoading ? (
          <div className="loading_styles">
            <img src={loading} alt="my-gif" className="gif_img" />
          </div>
        ) : (
          ""
        )}
        <div className="modal-body partner_model_body">
          <form>
            <div className="d-flex align-items-center justify-content-between modal_common_header partner_model_body_row">
              <h5 className="modal-title header2_text" id="staticBackdropLabel">
                {props.fromPaymentHistory
                  ? fromBillViewPopup
                    ? props.partyType == "BUYER"
                      ? "Record Receivable"
                      : "Record Payment"
                    : "Update Record"
                  : props.partyType == "BUYER"
                  ? "Record Receivable"
                  : "Record Payment"}
              </h5>
              <button
                onClick={(e) => {
                  props.closeRecordPaymentModal();
                  closePopup();
                  e.preventDefault();
                }}
                data-bs-dismiss="modal"
              >
                <img src={close} alt="image" className="close_icon" />
              </button>
            </div>
            <div className="partner_model_scroll" id="scroll_style">
              <div className="row partner_model_body_row">
                <div className="col-lg-12 p-0">
                  <div className="card record_modal_row">
                    <div
                      className="d-flex justify-content-between align-items-center card-body mb-0"
                      id="details-tag"
                    >
                      <div
                        className="profile-details"
                        key={fromBillViewPopup ? partyId : ledgerData?.partyId}
                      >
                        <div className="d-flex align-items-center">
                          <div>
                            {ledgerData?.profilePic ? (
                              <img
                                id="singles-img"
                                src={ledgerData.profilePic}
                                alt="buy-img"
                              />
                            ) : (
                              <img
                                id="singles-img"
                                src={single_bill}
                                alt="img"
                              />
                            )}
                          </div>
                          <div id="trans-dtl">
                            <p className="namedtl-tag">
                              {fromBillViewPopup
                                ? props.partyType == "BUYER"
                                  ? ledgerData.buyerName
                                  : ledgerData.farmerName
                                : ledgerData.partyName}
                            </p>
                            <p className="mobilee-tag">
                              {!ledgerData.trader
                                ? props.partyType == "BUYER" ||
                                  ledgerData?.type == "BUYER"
                                  ? "Buyer"
                                  : props.type == "TRANS"
                                  ? "Transporter"
                                  : "Seller"
                                : "Trader"}{" "}
                              -{" "}
                              {fromBillViewPopup
                                ? partyId
                                : ledgerData?.partyId}
                              &nbsp;|&nbsp;
                              {fromBillViewPopup
                                ? props.partyType == "BUYER"
                                  ? getMaskedMobileNumber(ledgerData.mobile)
                                  : getMaskedMobileNumber(
                                      ledgerData.farmerMobile
                                    )
                                : getMaskedMobileNumber(ledgerData.mobile)}
                            </p>
                            <p className="addres-tag">
                              {ledgerData.partyAddress
                                ? ledgerData.partyAddress
                                : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="d-flex justify-content-between card-text date_field record_payment_datepicker"
                        id="date-tag"
                      >
                        <img className="date_icon_in_modal" src={date_icon} />
                        <DatePicker
                          //className="date_picker_in_modal"
                          selected={selectDate}
                          onChange={(date) => {
                            onChangeDateSelect(date);
                            // setSelectDate(date);
                          }}
                          dateFormat="dd-MMM-yy"
                          maxDate={new Date()}
                          placeholder="Date"
                          required
                          onKeyDown={(e) => {
                            e.preventDefault();
                          }}
                        ></DatePicker>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center record_modal_row">
                    <div className="col-lg-6 select-bills">
                      <label hmtlFor="amtRecieved" id="amt-tag">
                        Select Bills
                        {billIds.length > 0 ? "(" + billIds.length + ")" : ""}
                      </label>
                      {fromBillViewPopup ? (
                        <input
                          readOnly
                          className="form-cont pselect-bill"
                          id="amtRecieved"
                          placeholder="Select Bill"
                          value={ledgerData.caBSeq}
                          name="billIdDisabled"
                          required
                          disabled
                        />
                      ) : billIds.length > 0 ? (
                        <div>
                          <input
                            className="form-cont pselect-bill"
                            id="amtRecieved"
                            onFocus={(e) => resetInput(e)}
                            value={caBSeq?.length > 0 ? caBSeq.join(" , ") : ""}
                            required
                            onClick={() => {
                              showListOfBillIds(partyId);
                            }}
                            onKeyDown={(event) =>
                              event.key === "Enter"
                                ? showListOfBillIds(partyId)
                                : ""
                            }
                          />
                        </div>
                      ) : (
                        <input
                          readOnly
                          className="form-cont pselect-bill"
                          id="amtRecieved"
                          onFocus={(e) => resetInput(e)}
                          placeholder="Select Bill"
                          required
                          onClick={() => {
                            showListOfBillIds(partyId);
                          }}
                          onKeyDown={(event) =>
                            event.key === "Enter"
                              ? showListOfBillIds(partyId)
                              : ""
                          }
                        />
                      )}
                    </div>
                    <div className="col-lg-6" align="left">
                      {recordPayment ||
                      !props.fromPaymentHistory ||
                      fromBillViewPopup ? (
                        <div className="out-paybles">
                          {ledgerData?.type == "FARMER" ||
                          props.partyType == "SELLER" ||
                          (fromBillViewPopup && props.partyType == "FARMER") ? (
                            <p id="p-tag">Outstanding Payables</p>
                          ) : (
                            <p id="p-tag">Outstanding Recievables</p>
                          )}
                          <p id="recieve-tag">
                            &#8377;
                            {paidRcvd ? paidRcvd.toFixed(2) : 0}
                          </p>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  <div
                    className="form-group record_modal_row mƒb-0"
                    id="input_in_modal"
                  >
                    <label hmtlFor="amtRecieved" id="amt-tag">
                      {ledgerData?.type == "FARMER" ||
                      props.partyType == "SELLER" ||
                      (fromBillViewPopup && props.partyType == "FARMER")
                        ? "Amount Paid*"
                        : "Amount Recieved*"}
                    </label>
                    {fromBillViewPopup ? (
                      <input
                        className="form-cont"
                        id="amtRecieved"
                        onFocus={(e) => resetInput(e)}
                        value={
                          props.partyType == "BUYER"
                            ? ledgerData?.actualReceivable
                            : ledgerData?.actualPaybles
                        }
                        required
                        name="billIdDisabled"
                      />
                    ) : (
                      <input
                        className="form-cont"
                        id="amtRecieved"
                        onFocus={(e) => resetInput(e)}
                        value={totalRecieved > 0 ? totalRecieved : paidsRcvd}
                        required
                        onChange={(e) => {
                          getAmountVal(e);
                        }}
                      />
                    )}
                    <p className="text-valid">{requiredCondition}</p>
                  </div>
                  {billIds.length > 0 ? (
                    <p hmtlFor="amtRecieved" className="discount-label">
                      Discount
                    </p>
                  ) : (
                    ""
                  )}
                  {billIds.length > 0 || fromBillViewPopup ? (
                    <div className="row ">
                      <div className="col-lg-6 discount-prec record_modal_row">
                        <label
                          hmtlFor="amtRecieved"
                          className="disc-per"
                          id="amt-tag"
                        >
                          Discount(%)
                        </label>
                        <input
                          className="form-cont"
                          id="amtRecieved"
                          onFocus={(e) => resetInput(e)}
                          required
                          value={discountPerc}
                          onChange={(e) => {
                            getDiscountPercentageValue(e);
                          }}
                        />
                      </div>
                      <div className="col-lg-6 record_modal_row pl-3 pr-0">
                        <label
                          hmtlFor="amtRecieved"
                          className="disc-per"
                          id="amt-tag"
                        >
                          Discount(Rs)
                        </label>
                        <input
                          className="form-cont"
                          id="amtRecieved"
                          onFocus={(e) => resetInput(e)}
                          value={discountRs}
                          required
                          onChange={(e) => {
                            getDiscountRsValue(e);
                          }}
                        />
                      </div>
                      {billAmount > 0 ? (
                        <div className="amount p-0 record_modal_row">
                          <p className="amt-after-dic">Amount After Discount</p>
                          <p className="bill-amt">&#8377;{billAmount}</p>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  <div id="radios_in_modal" className="record_modal_row">
                    <p className="payment-tag">Payment Mode</p>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input radioBtnVal mb-0"
                        type="radio"
                        name="radio"
                        id="inlineRadio1"
                        value="CASH"
                        onChange={(e) => setPaymentMode(e.target.value)}
                        checked={paymentMode === "CASH"}
                        required
                      />
                      <label className="form-check-label" for="inlineRadio1">
                        CASH
                      </label>
                    </div>
                    <div
                      className="form-check form-check-inline"
                      id="radio-btn-in_modal"
                    >
                      <input
                        className="form-check-input radioBtnVal mb-0"
                        type="radio"
                        name="radio"
                        id="inlineRadio2"
                        value="UPI"
                        onChange={(e) => setPaymentMode(e.target.value)}
                        checked={paymentMode === "UPI"}
                        required
                      />
                      <label className="form-check-label" for="inlineRadio2">
                        UPI
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input radioBtnVal mb-0"
                        type="radio"
                        name="radio"
                        id="inlineRadio3"
                        value="NEFT"
                        onChange={(e) => setPaymentMode(e.target.value)}
                        checked={paymentMode === "NEFT"}
                        required
                      />
                      <label className="form-check-label" for="inlineRadio3">
                        NEFT
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input radioBtnVal mb-0"
                        type="radio"
                        name="radio"
                        id="inlineRadio4"
                        value="RTGS"
                        onChange={(e) => setPaymentMode(e.target.value)}
                        checked={paymentMode === "RTGS"}
                        required
                      />
                      <label className="form-check-label" for="inlineRadio4">
                        RTGS
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input radioBtnVal mb-0"
                        type="radio"
                        name="radio"
                        id="inlineRadio5"
                        value="IMPS"
                        onChange={(e) => setPaymentMode(e.target.value)}
                        checked={paymentMode === "IMPS"}
                        required
                      />
                      <label className="form-check-label" for="inlineRadio5">
                        IMPS
                      </label>
                    </div>
                  </div>
                  <div id="comment_in_modal record_modal_row">
                    <div className="mb-3">
                      <label
                        for="exampleFormControlTextarea1"
                        className="form-label"
                        id="comment-tag"
                      >
                        Comment
                      </label>
                      <textarea
                        className="form-control"
                        id="comments"
                        rows="2"
                        value={comments}
                        onChange={(e) => handleCommentText(e)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer modal_common_footer">
          <div className="row">
            <div className="col-lg-6 pl-0"></div>
            <div className="col-lg-6">
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="secondary_btn mr-2"
                  // id="close_modal"
                  onClick={(e) => {
                    props.closeRecordPaymentModal();
                    closePopup();
                    e.preventDefault();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="primary_btn w-100"
                  onClick={() => {
                    onSubmitRecordPayment();
                  }}
                >
                  {props.fromPaymentHistory
                    ? fromBillViewPopup
                      ? "SUBMIT"
                      : "UPDATE"
                    : "SUBMIT"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {showBillModalStatus ? (
          <BillView
            showBillViewModal={showBillModal}
            closeBillViewModal={() => setShowBillModal(false)}
            // allBillsData={buyBillData}
            fromLedger={true}
          />
        ) : (
          ""
        )}
        <ToastContainer />
      </Modal>
      {showLisOfBillIdsPopUp ? (
        <SelectBillIds
          showBillIdsModal={showBillIdsModal}
          partyId={partyId}
          selectedDate={selectDate}
          billIdsCloseModal={() => setShowBillIdsModal(false)}
          setBillIdsData={billidsData}
          selectedDateTo={selectDate}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default RecordPayment;
