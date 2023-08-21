import React, { Fragment, useState } from "react";
import { useEffect } from "react";
import {
  getBuyerDetailedLedger,
  getLedgers,
  getLedgerSummary,
  getLedgerSummaryByDate,
  getOutstandingBal,
  getSellerDetailedLedger,
  getSellerDetailedLedgerByDate,
} from "../../actions/ledgersService";
import SearchField from "../../components/searchField";
import no_data_icon from "../../assets/images/NodataAvailable.svg";
import "../../modules/ledgers/buyerLedger.scss";
import "../../modules/transporto_ledger/transportoLedger.scss";
import moment from "moment";
import single_bill from "../../assets/images/bills/single_bill.svg";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
  getCurrencyNumberWithOneDigit,
  getMaskedMobileNumber,
  getMaskedMobileNumber1,
} from "../../components/getCurrencyNumber";
import { getDetailedLedgerByDate } from "../../actions/billCreationService";
import DatePickerModel from "../smartboard/datePicker";
import LedgerSummary from "./ledgerSummary";
import DetailedLedger from "./detailedLedger";
import date_icon from "../../assets/images/date_icon.svg";
import loading from "../../assets/images/loading.gif";
import NoInternetConnection from "../../components/noInternetConnection";
import RecordPayment from "./recordPayment";
import { useDispatch, useSelector } from "react-redux";
import { dateCustomStatus } from "../../reducers/billEditItemSlice";
import addbill_icon from "../../assets/images/addbill.svg";
import print from "../../assets/images/print_bill.svg";
import download_icon from "../../assets/images/dwnld.svg";
import { ToastContainer, toast } from "react-toastify";
import {
  allCustomTabs,
  detaildLedgerInfo,
  ledgerSummaryInfo,
  partnerTabs,
  beginDate,
  closeDate,
  allLedgers,
  outStandingBal,
  businessValues,
  totalRecivables,
  trhoughRecordPayment,
} from "../../reducers/ledgerSummarySlice";
import PaymentHistoryView from "./paymentHistory";
import { getLedgerSummaryJson } from "../../actions/pdfservice/billpdf/getLedgerSummaryJson";
import { generateLedgerSummary } from "../../actions/pdfservice/singleBillPdf";
const Ledgers = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const ledgersSummary = useSelector((state) => state.ledgerSummaryInfo);
  const ledgers = ledgersSummary?.allLedgers;
  const dispatch = useDispatch();
  const clickId = loginData.caId;
  const [allData, setAllData] = useState(ledgersSummary?.allLedgers);
  const outStAmt = ledgersSummary?.outStandingBal;
  const [partyId, setPartyId] = useState(0);
  const summary = ledgersSummary?.businessValues;
  const ledgerType = props.type;
  const [ledgerSummary, setLedgerSummary] = useState([]);
  const [detailedLedger, setdetailedLedger] = useState([]);
  const [allCustom, setAllCustom] = useState("all");
  const [ledgerTabs, setLedgerTabs] = useState("ledgersummary");
  const [summaryByDate, setSummaryByDate] = useState([]);
  const [detailedByDate, setdetailedLedgerByDate] = useState([]);
  const [showDatepickerModal, setShowDatepickerModal] = useState(false);
  const [showDatepickerModal1, setShowDatepickerModal1] = useState(false);
  const cardDetails = ledgersSummary?.businessValues;
  const cardDetailed = ledgersSummary?.totalRecivables;
  const [ledgerData, setLedgerData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isOnline, setOnline] = useState(false);
  const detailedTotal = ledgersSummary?.totalRecivables;
  var date = moment(new Date()).format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(date);
  const [endDate, setEndDate] = useState(date);
  var defaultDate = moment(new Date()).format("DD-MMM-YYYY");
  const [dateDisplay, setDateDisplay] = useState(false);
  var [dateValue, setDateValue] = useState(defaultDate + " to " + defaultDate);
  const [handleDate, sethandleDate] = useState(false);
  const [paidRcvd, setPaidRcvd] = useState(0);
  const [open, setIsOpen] = useState(false);
  const tabs = [
    {
      id: 1,
      name: "All",
      to: "all",
    },
    {
      id: 2,
      name: "Custom",
      to: "custom",
    },
  ];

  const links = [
    {
      id: 1,
      name: "Ledger Summary",
      to: "ledgersummary",
    },
    {
      id: 2,
      name: "Detailed Ledger",
      to: "detailedledger",
    },
  ];

  const onclickDate = () => {
    setShowDatepickerModal1(true);
    setShowDatepickerModal(true);
  };
  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = allData.filter((data) => {
      if (data.mobile.includes(value)) {
        return data.mobile.search(value) != -1;
      } else if (data.partyName.toLowerCase().includes(value)) {
        return data.partyName.toLowerCase().search(value) != -1;
      } else if (data.partyId.toString().includes(value)) {
        return data.partyId.toString().search(value) != -1;
      } else if (data.partyAddress.toLowerCase().includes(value)) {
        return data.partyAddress.toLowerCase().search(value) != -1;
      } else if (data.shortName.toLowerCase().includes(value)) {
        return data.shortName.toLowerCase().search(value) != -1;
      }
    });
    dispatch(allLedgers(result));
  };

  useEffect(() => {
    fetchLedgers();
    dispatch(partnerTabs("ledgersummary"));
    dispatch(beginDate(startDate));
    dispatch(closeDate(endDate));
    allCustomEvent("all");
    setDateValue(defaultDate + " to " + defaultDate);
  }, [props]);

  //Fetch ledgers using clickId and type
  const fetchLedgers = () => {
    getLedgers(clickId, ledgerType)
      .then((res) => {
        if (res.data.status.type === "SUCCESS") {
          setLoading(false);
          if (res.data.data !== null) {
            setAllData(res.data.data.ledgers);
            dispatch(outStandingBal(res.data.data));
            dispatch(allLedgers(res.data.data.ledgers));
            setPartyId(res.data.data.ledgers[0].partyId);
            summaryData(clickId, res.data.data.ledgers[0].partyId);
            getOutstandingPaybles(clickId, res.data.data.ledgers[0].partyId);
            setLedgerData(res.data.data.ledgers[0]);

            if (ledgerType == "BUYER") {
              geyDetailedLedger(clickId, res.data.data.ledgers[0].partyId);
            } else {
              sellerDetailed(clickId, res.data.data.ledgers[0].partyId);
            }
          } else {
            dispatch(allLedgers([]));
            dispatch(setLedgerData(null));
          }
        }
      })
      .catch((error) => {
        // if (error.toJSON().message === "Network Error") {
        // setOnline(true);
        // }
      });
  };

  //Get Outstanding balance
  const getOutstandingPaybles = (clickId, partyId) => {
    getOutstandingBal(clickId, partyId).then((response) => {
      setPaidRcvd(response.data.data);
    });
  };
  const [customDateHanlde, setCustomDateHandle] = useState(false);
  //Get Particular ledger data
  const particularLedgerData = (ledgerId, item) => {
    var customTab = "";
    setPartyId(ledgerId);
    setLedgerData(item);
    setAllCustom("all");
    setCustomDateHandle(true);
    getOutstandingPaybles(clickId, ledgerId);

    if (allCustom == "custom") {
      var customTab = "all";
      setDateDisplay(false);
      dispatch(dateCustomStatus(true));
    }
    var tabs = "";
    if (
      ledgerTabs == "detailedledger" ||
      (ledgerTabs == "ledgersummary" && allCustom == "custom")
    ) {
      dispatch(partnerTabs("ledgersummary"));
      dispatch(allCustomTabs("all"));
      setLedgerTabs("ledgersummary");
      setAllCustom("all");
      tabs = "ledgersummary";
    }
    if ((customTab == "all" && tabs == "ledgersummary") || allCustom == "all") {
      summaryData(clickId, ledgerId);
    } else if (customTab == "custom" && tabs == "ledgersummary") {
      ledgerSummaryByDate(clickId, ledgerId, date, date);
    }
    setDateValue(defaultDate + " to " + defaultDate);
  };

  //Get Outstanding balances, Total Business
  const summaryData = (clickId, partyId) => {
    getLedgerSummary(clickId, partyId)
      .then((res) => {
        if (res.data.data !== null) {
          if (res.data.status.type === "SUCCESS") {
            dispatch(businessValues(res.data.data));
            dispatch(ledgerSummaryInfo(res.data.data.ledgerSummary));
          } else {
            dispatch(businessValues([]));
            dispatch(ledgerSummaryInfo([]));
          }
        } else {
          dispatch(businessValues([]));
          dispatch(ledgerSummaryInfo([]));
        }
      })
      .catch((error) => console.log(error), console.log("came to here"));
  };

  //Get Detailed Ledger
  const geyDetailedLedger = (clickId, partyId) => {
    getBuyerDetailedLedger(clickId, partyId)
      .then((res) => {
        if (res.data.data !== null) {
          if (res.data.status.type === "SUCCESS") {
            dispatch(totalRecivables(res.data.data));
            dispatch(detaildLedgerInfo(res.data.data.details));
            setdetailedLedger(res.data.data.details);
          } else {
            dispatch(totalRecivables([]));
            dispatch(detaildLedgerInfo([]));
            setdetailedLedger([]);
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
        if (res.data.data !== null) {
          if (res.data.status.type === "SUCCESS") {
            dispatch(totalRecivables(res.data.data));
            dispatch(detaildLedgerInfo(res.data.data.details));
            setdetailedLedger(res.data.data.details);
          } else {
            dispatch(totalRecivables([]));
            dispatch(detaildLedgerInfo([]));
            setdetailedLedger([]);
          }
        } else {
          dispatch(totalRecivables([]));
          dispatch(detaildLedgerInfo([]));
        }
      })
      .catch((error) => console.log(error));
  };

  //All and Custom Tabs
  const allCustomEvent = (type) => {
    dispatch(allCustomTabs(type));
    if (type == "custom") {
      setDateDisplay(true);
    } else {
      setDateDisplay(false);
    }
    if (handleDate) {
      setDateValue(defaultDate + " to " + defaultDate);
      setStartDate(date);
      setEndDate(date);
    }
    if (type == "all") {
      summaryData(clickId, partyId);
    }
    if (type == "custom" && ledgerTabs == "detailedledger") {
      dispatch(partnerTabs("ledgersummary"));
      setLedgerTabs("ledgersummary");
    } else if (type == "all" && ledgerTabs == "detailedledger") {
      dispatch(partnerTabs("ledgersummary"));
      setLedgerTabs("ledgersummary");
    }
    if (type == "custom" && ledgerTabs == "ledgersummary" && customDateHanlde) {
      setCustomDateHandle(false);
      ledgerSummaryByDate(clickId, partyId, date, date);
    } else if (type == "custom") {
      ledgerSummaryByDate(clickId, partyId, startDate, endDate);
    }
    setAllCustom(type);
  };
  const [dateCustom, setdateCustom] = useState(false);
  //ledger and detailed ledger tabs
  const ledgerTabEvent = (ledgerTabType) => {
    dispatch(partnerTabs(ledgerTabType));
    if (allCustom == "all" && ledgerTabType == "ledgersummary") {
      summaryData(clickId, partyId);
    }
    if (allCustom == "all" && ledgerTabType == "detailedledger") {
      if (ledgerType == "BUYER") {
        geyDetailedLedger(clickId, partyId);
      } else {
        sellerDetailed(clickId, partyId);
      }
    }
    if (allCustom == "custom" && ledgerTabType == "ledgersummary") {
      setDateValue(defaultDate + " to " + defaultDate);
      ledgerSummaryByDate(clickId, partyId, date, date);
      sethandleDate(true);
      dispatch(dateCustomStatus(true));
    }
    if (allCustom == "custom" && ledgerTabType == "detailedledger") {
      if (ledgerType == "BUYER") {
        setDateValue(defaultDate + " to " + defaultDate);
        sethandleDate(true);
        detailedLedgerByDate(clickId, partyId, date, date);
        dispatch(dateCustomStatus(true));
        setdateCustom(true);
      } else {
        setDateValue(defaultDate + " to " + defaultDate);
        sellerDetailedByDate(clickId, partyId, date, date);
        setdateCustom(true);
        dispatch(dateCustomStatus(true));
      }
    }
    setLedgerTabs(ledgerTabType);
  };

  //ledger summary by date
  const ledgerSummaryByDate = (clickId, partyId, fromDate, toDate) => {
    getLedgerSummaryByDate(clickId, partyId, fromDate, toDate)
      .then((res) => {
        if (res.data.data !== null) {
          setSummaryByDate(res.data.data.ledgerSummary);
          dispatch(ledgerSummaryInfo(res.data.data.ledgerSummary));
          dispatch(businessValues(res.data.data));
        } else {
          setSummaryByDate([]);
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
          setdetailedLedgerByDate(res.data.data.details);
          dispatch(totalRecivables(res.data.data));
          dispatch(detaildLedgerInfo(res.data.data.details));
        } else {
          setdetailedLedgerByDate([]);
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
          setdetailedLedgerByDate(res.data.data.details);
          dispatch(detaildLedgerInfo(res.data.data.details));
          dispatch(totalRecivables(res.data.data));
        } else {
          setdetailedLedgerByDate([]);
          dispatch(detaildLedgerInfo([]));
          dispatch(totalRecivables([]));
        }
      })
      .catch((error) => console.log(error));
  };
  //Date Selection
  const callbackFunction = (startDate, endDate, dateTab) => {
    dispatch(beginDate(startDate));
    dispatch(closeDate(endDate));
    var fromDate = moment(startDate).format("YYYY-MM-DD");
    var toDate = moment(endDate).format("YYYY-MM-DD");
    dateValue = fromDate;
    if (dateTab === "Daily") {
      setDateValue(moment(fromDate).format("DD-MMM-YYYY"));
    } else if (dateTab === "Weekly") {
      setDateValue(
        moment(fromDate).format("DD-MMM-YYYY") +
          " to " +
          moment(toDate).format("DD-MMM-YYYY")
      );
    } else if (dateTab === "Monthly") {
      setDateValue(moment(fromDate).format("MMM-YYYY"));
    } else if (dateTab === "Yearly") {
      setDateValue(moment(fromDate).format("YYYY"));
    } else {
      setDateValue(
        moment(fromDate).format("DD-MMM-YYYY") +
          " to " +
          moment(toDate).format("DD-MMM-YYYY")
      );
    }
    if (allCustom == "custom" && ledgerTabs == "ledgersummary") {
      var fromDate = moment(startDate).format("YYYY-MM-DD");
      var toDate = moment(endDate).format("YYYY-MM-DD");
      date = fromDate;
      setStartDate(fromDate);
      setEndDate(toDate);
      ledgerSummaryByDate(clickId, partyId, fromDate, toDate);
    } else {
      var fromDate = moment(startDate).format("YYYY-MM-DD");
      var toDate = moment(endDate).format("YYYY-MM-DD");
      if (ledgerType == "BUYER") {
        setStartDate(date);
        setEndDate(date);
        sethandleDate(true);
        detailedLedgerByDate(clickId, partyId, fromDate, toDate);
      } else {
        setStartDate(date);
        setEndDate(date);
        sethandleDate(true);
        sellerDetailedByDate(clickId, partyId, fromDate, toDate);
      }
    }
  };
  const getData = (data) => {
    if (allCustom == "all" && ledgerTabs == "ledgersummary") {
      setLedgerSummary(data);
    } else if (allCustom == "all" && ledgerTabs == "detailedledger") {
      setdetailedLedger(data);
    } else if (allCustom == "custom" && ledgerTabs == "ledgersummary") {
      setSummaryByDate(data);
    } else {
      setdetailedLedgerByDate(data);
    }
  };
  const getOutstAmt = (data) => {
    dispatch(outStandingBal(data));
    // setOutStAmt(data);
  };
  const getALlLedgers = (data) => {
    // setLedgers(data);
    dispatch(allLedgers(data));
  };
  const getCardDtl = (data) => {
    if (allCustom == "all" && ledgerTabs == "ledgersummary") {
      // setSummary(data);
      dispatch(businessValues(data));
    } else if (allCustom == "all" && ledgerTabs == "detailedledger") {
      dispatch(totalRecivables(data));
      // setTotalDetailed(data);
    } else if (allCustom == "custom" && ledgerTabs == "ledgersummary") {
      dispatch(businessValues(data));
      // setcardDetails(data);
    } else if (allCustom == "custom" && ledgerTabs == "detailedledger") {
      // setcardDetailed(data);
      dispatch(totalRecivables(data));
    }
  };
  const getPaidRcvd = (rcvd) => {
    setPaidRcvd(rcvd);
  };

  const [recordPaymentModalStatus, setRecordPaymentModalStatus] =
    useState(false);
  const [recordPaymentModal, setRecordPaymentModal] = useState(false);
  const recordPaymentOnClickEvent = () => {
    dispatch(trhoughRecordPayment(true));
    setRecordPaymentModalStatus(true);
    setRecordPaymentModal(true);
  };
  async function handleLedgerSummaryJson() {
    var ledgerJsonBody = getLedgerSummaryJson(
      allCustom === "custom" ? summaryByDate : ledgers,
      ledgerData,
      allCustom === "custom" ? dateValue : "",
      ledgerType,
      getTotalBusiness(),
      getTotalOutstandings()
    );
    var pdfResponse = await generateLedgerSummary(ledgerJsonBody);
    if (pdfResponse.status !== 200) {
      toast.error("Something went wrong", {
        toastId: "errorr2",
      });
      return;
    } else {
      toast.success("Pdf generated SuccessFully", {
        toastId: "errorr2",
      });
      var bufferData = Buffer.from(pdfResponse.data);
      var blob = new Blob([bufferData], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    }
  }
  function getTotalBusiness() {
    return allCustom == "custom" && ledgerTabs == "ledgersummary"
      ? cardDetails.totalTobePaidRcvd
        ? cardDetails.totalTobePaidRcvd
          ? getCurrencyNumberWithSymbol(cardDetails.totalTobePaidRcvd)
          : 0
        : 0
      : allCustom == "custom" &&
        ledgerType == "BUYER" &&
        ledgerTabs == "detailedledger"
      ? cardDetailed.totalToBeRecived
        ? cardDetailed.totalToBeRecived
          ? getCurrencyNumberWithSymbol(cardDetailed.totalToBeRecived)
          : 0
        : 0
      : allCustom == "custom" &&
        ledgerType == "SELLER" &&
        ledgerTabs == "detailedledger"
      ? cardDetailed.totalToBePaid
        ? cardDetailed.totalToBePaid
          ? getCurrencyNumberWithSymbol(cardDetailed.totalToBePaid)
          : 0
        : 0
      : allCustom == "all" &&
        ledgerType == "BUYER" &&
        ledgerTabs == "detailedledger"
      ? detailedTotal.totalToBeRecived
        ? detailedTotal.totalToBeRecived
          ? getCurrencyNumberWithSymbol(detailedTotal.totalToBeRecived)
          : 0
        : 0
      : allCustom == "all" &&
        ledgerType == "SELLER" &&
        ledgerTabs == "detailedledger"
      ? detailedTotal.totalToBePaid
        ? detailedTotal.totalToBePaid
          ? getCurrencyNumberWithSymbol(detailedTotal.totalToBePaid)
          : 0
        : 0
      : summary.totalTobePaidRcvd
      ? getCurrencyNumberWithSymbol(summary.totalTobePaidRcvd)
      : 0;
  }
  function getTotalOutstandings() {
    return allCustom == "custom" && ledgerTabs == "ledgersummary"
      ? cardDetails.outStdRcvPayble
        ? cardDetails?.outStdRcvPayble
          ? getCurrencyNumberWithSymbol(cardDetails.outStdRcvPayble)
          : 0
        : 0
      : allCustom == "custom" && ledgerTabs == "detailedledger"
      ? cardDetailed.totalOutStandingBalance
        ? cardDetailed?.totalOutStandingBalance
          ? getCurrencyNumberWithSymbol(cardDetailed.totalOutStandingBalance)
          : 0
        : 0
      : allCustom == "all" && ledgerTabs == "detailedledger"
      ? detailedTotal.totalOutStandingBalance
        ? detailedTotal?.totalOutStandingBalance
          ? getCurrencyNumberWithSymbol(detailedTotal.totalOutStandingBalance)
          : 0
        : 0
      : summary.outStdRcvPayble
      ? getCurrencyNumberWithSymbol(summary.outStdRcvPayble)
      : 0;
  }
  return (
    <div className="main_div_padding">
      {isOnline ? (
        <NoInternetConnection />
      ) : (
        <div>
          {isLoading ? (
            <div className="">
              <img src={loading} alt="my-gif" className="gif_img" />
            </div>
          ) : (
            <div>
              {allData.length > 0 ? (
                <div className="row">
                  <div className="col-lg-5 pl-0">
                    <div id="search-field">
                      <SearchField
                        placeholder="Search by Name / Short Code"
                        onChange={(event) => {
                          handleSearch(event);
                        }}
                      />
                    </div>
                    {ledgers.length > 0 ? (
                      <div>
                        <div className="ledger-table">
                          <div className="ledgers ledger_table_col">
                            <div className="row theadr-tag p-0">
                              <th class="col-lg-1">#</th>
                              <th class="col-lg-2">Date</th>
                              {ledgerType == "BUYER" ? (
                                <th class="col-lg-6">Buyer Name</th>
                              ) : (
                                <th class="col-lg-6">Seller Name</th>
                              )}
                              {ledgerType == "BUYER" ? (
                                <th class="col-lg-3">
                                  To Be Recieved(&#8377;)
                                </th>
                              ) : (
                                <th class="col-lg-3">To Be Paid(&#8377;)</th>
                              )}
                            </div>
                            <div className="table-scroll" id="scroll_style">
                              {ledgers.map((item, index) => {
                                return (
                                  <Fragment>
                                    <button
                                      className={
                                        partyId == item.partyId
                                          ? "tabRowSelected p-0"
                                          : "tr-tags p-0"
                                      }
                                      onClick={() =>
                                        particularLedgerData(item.partyId, item)
                                      }
                                    >
                                      <div className="row align-items-center">
                                        <td className="col-lg-1">
                                          {index + 1}
                                        </td>
                                        <td
                                          key={item.date}
                                          className="col-lg-2"
                                        >
                                          <p className="date_ledger_val">
                                            {" "}
                                            {moment(item.date).format(
                                              "DD-MMM-YY"
                                            )}
                                          </p>
                                        </td>
                                        <td
                                          key={item.partyName}
                                          className="col-lg-6"
                                        >
                                          <div className="d-flex">
                                            <div className="c-img">
                                              {item.profilePic ? (
                                                <img
                                                  className="profile-img"
                                                  src={item.profilePic}
                                                  alt="pref-img"
                                                />
                                              ) : (
                                                <img
                                                  className="profile-img"
                                                  src={single_bill}
                                                  alt="img"
                                                />
                                              )}
                                            </div>
                                            <div>
                                              <p className="namedtl-tag">
                                                {item.partyName} -{" "}
                                                {item.shortName}
                                              </p>
                                              <div className="d-flex align-items-center">
                                                <p className="mobilee-tag">
                                                  {!item.trader
                                                    ? ledgerType == "BUYER"
                                                      ? "Buyer"
                                                      : "Farmer"
                                                    : "Trader"}{" "}
                                                  - {item.partyId}&nbsp;
                                                </p>
                                                <p className="mobilee-tag desk_responsive">
                                                  {" | " +
                                                    getMaskedMobileNumber(
                                                      item.mobile
                                                    )}
                                                </p>
                                              </div>
                                              <p className="mobilee-tag mobile_responsive">
                                                {getMaskedMobileNumber(
                                                  item.mobile
                                                )}
                                              </p>
                                              <p className="address-tag">
                                                {item.partyAddress
                                                  ? item.partyAddress
                                                  : ""}
                                              </p>
                                            </div>
                                          </div>
                                        </td>
                                        <td
                                          className="col-lg-3"
                                          key={item.tobePaidRcvd}
                                        >
                                          <p
                                            className={
                                              ledgerType == "BUYER"
                                                ? "coloring"
                                                : "paid-coloring"
                                            }
                                          >
                                            {item.tobePaidRcvd
                                              ? getCurrencyNumberWithOutSymbol(
                                                  item.tobePaidRcvd
                                                )
                                              : 0}
                                          </p>
                                        </td>
                                      </div>
                                    </button>
                                  </Fragment>
                                );
                              })}
                            </div>
                          </div>
                          {/* <table className="table table-fixed ledgers">
                            <thead className="theadr-tag">
                              <tr>
                                <th scope="col-4">#</th>
                                <th scope="col">Date</th>
                                {ledgerType == "BUYER" ? (
                                  <th scope="col">Buyer Name</th>
                                ) : (
                                  <th scope="col">Seller Name</th>
                                )}
                                {ledgerType == "BUYER" ? (
                                  <th scope="col">To Be Recieved(&#8377;)</th>
                                ) : (
                                  <th scope="col">To Be Paid(&#8377;)</th>
                                )}
                              </tr>
                            </thead>
                            
                          </table> */}
                        </div>
                        <div className="outstanding-pay d-flex align-items-center justify-content-between">
                          {ledgerType == "BUYER" ? (
                            <p className="pat-tag">Outstanding Recievables:</p>
                          ) : (
                            <p className="pat-tag">Outstanding Payables:</p>
                          )}
                          <p
                            className={
                              ledgerType == "BUYER"
                                ? "values-tag"
                                : "paid-coloring"
                            }
                          >
                            {outStAmt?.totalOutStgAmt
                              ? getCurrencyNumberWithSymbol(
                                  outStAmt?.totalOutStgAmt
                                )
                              : 0}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="table-scroll nodata_scroll">
                        <div className="row partner_no_data_widget_rows">
                          <div className="col-lg-5">
                            <div className="partner_no_data_widget">
                              <div className="text-center">
                                <img
                                  src={no_data_icon}
                                  alt="icon"
                                  className="d-flex mx-auto justify-content-center"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-lg-7 p-0">
                    <div className="d-flex partner_tabs mb-0 ledger_all_custom justify-content-between align-items-end">
                      <ul
                        className="nav nav-tabs mb-0"
                        id="myTab"
                        role="tablist"
                      >
                        {tabs.map((tab) => {
                          return (
                            <li key={tab.id} className="nav-item ">
                              <a
                                className={
                                  "nav-link" +
                                  (allCustom == tab.to ? " active" : "")
                                }
                                href={"#" + tab.name}
                                role="tab"
                                aria-controls="home"
                                data-bs-toggle="tab"
                                onClick={() => allCustomEvent(tab.to)}
                              >
                                {tab.name}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                      <button
                        className="primary_btn add_bills_btn"
                        onClick={recordPaymentOnClickEvent}
                      >
                        <img src={addbill_icon} alt="image" className="mr-2" />
                        {ledgerType == "BUYER"
                          ? "Record Receivable"
                          : "Record Payment"}
                      </button>
                    </div>
                    <p className={dateDisplay ? "" : "padding_all"}></p>
                    <div className="my-2">
                      <div
                        style={{ display: dateDisplay ? "flex" : "none" }}
                        className="dateRangePicker justify-content-center"
                      >
                        <button onClick={onclickDate} className="color_blue">
                          <div className="date_icon m-0">
                            <img
                              src={date_icon}
                              alt="icon"
                              className="mr-2 date_icon_in_custom"
                            />
                            {dateValue}
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="card details-tag">
                      <div className="card-body" id="card-details">
                        <div className="row">
                          <div className="col-lg-3" id="verticalLines">
                            {ledgerData != null ? (
                              <div
                                className="profilers-details"
                                key={ledgerData.partyId}
                              >
                                <div className="d-flex">
                                  <div>
                                    {ledgerData.profilePic ? (
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
                                  <div id="ptr-dtls">
                                    <p className="namedtl-tag">
                                      {ledgerData.partyName}
                                    </p>
                                    <p className="mobilee-tag">
                                      {!ledgerData.trader
                                        ? props.type == "BUYER"
                                          ? "Buyer"
                                          : "Farmer"
                                        : "Trader"}{" "}
                                      - {ledgerData.partyId}&nbsp;
                                    </p>
                                    <p className="mobilee-tag">
                                      {ledgerData.mobile}
                                      {/* {ledgerData?.mobile != '' ?
                                    getMaskedMobileNumber(ledgerData?.mobile) : ''} */}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          <div
                            className="col-lg-3 d-flex align-items-center"
                            id="verticalLines"
                          >
                            <p className="card-text paid">
                              Total Business
                              <p
                                className={
                                  ledgerType == "BUYER"
                                    ? "coloring"
                                    : "paid-coloring"
                                }
                              >
                                {allCustom == "custom" &&
                                ledgerTabs == "ledgersummary"
                                  ? cardDetails.totalTobePaidRcvd
                                    ? cardDetails.totalTobePaidRcvd
                                      ? getCurrencyNumberWithSymbol(
                                          cardDetails.totalTobePaidRcvd
                                        )
                                      : 0
                                    : 0
                                  : allCustom == "custom" &&
                                    ledgerType == "BUYER" &&
                                    ledgerTabs == "detailedledger"
                                  ? cardDetailed.totalToBeRecived
                                    ? cardDetailed.totalToBeRecived
                                      ? getCurrencyNumberWithSymbol(
                                          cardDetailed.totalToBeRecived
                                        )
                                      : 0
                                    : 0
                                  : allCustom == "custom" &&
                                    ledgerType == "SELLER" &&
                                    ledgerTabs == "detailedledger"
                                  ? cardDetailed.totalToBePaid
                                    ? cardDetailed.totalToBePaid
                                      ? getCurrencyNumberWithSymbol(
                                          cardDetailed.totalToBePaid
                                        )
                                      : 0
                                    : 0
                                  : allCustom == "all" &&
                                    ledgerType == "BUYER" &&
                                    ledgerTabs == "detailedledger"
                                  ? detailedTotal.totalToBeRecived
                                    ? detailedTotal.totalToBeRecived
                                      ? getCurrencyNumberWithSymbol(
                                          detailedTotal.totalToBeRecived
                                        )
                                      : 0
                                    : 0
                                  : allCustom == "all" &&
                                    ledgerType == "SELLER" &&
                                    ledgerTabs == "detailedledger"
                                  ? detailedTotal.totalToBePaid
                                    ? detailedTotal.totalToBePaid
                                      ? getCurrencyNumberWithSymbol(
                                          detailedTotal.totalToBePaid
                                        )
                                      : 0
                                    : 0
                                  : summary.totalTobePaidRcvd
                                  ? getCurrencyNumberWithSymbol(
                                      summary.totalTobePaidRcvd
                                    )
                                  : 0}
                              </p>
                            </p>
                          </div>
                          <div
                            className="col-lg-3 d-flex align-items-center"
                            id="verticalLines"
                          >
                            <div>
                              {ledgerType == "BUYER" ? (
                                <p className="total-paid">Total Recieved</p>
                              ) : (
                                <p className="total-paid">Total Paid</p>
                              )}
                              <p
                                className={
                                  ledgerType == "BUYER"
                                    ? "coloring"
                                    : "paid-coloring"
                                }
                              >
                                {allCustom == "custom" &&
                                ledgerTabs == "ledgersummary"
                                  ? cardDetails.totalRcvdPaid
                                    ? cardDetails.totalRcvdPaid
                                      ? getCurrencyNumberWithSymbol(
                                          cardDetails.totalRcvdPaid
                                        )
                                      : 0
                                    : 0
                                  : allCustom == "custom" &&
                                    ledgerType == "BUYER" &&
                                    ledgerTabs == "detailedledger"
                                  ? cardDetailed.totalRecieved
                                    ? cardDetailed.totalRecieved
                                      ? getCurrencyNumberWithSymbol(
                                          cardDetailed.totalRecieved
                                        )
                                      : 0
                                    : 0
                                  : allCustom == "custom" &&
                                    ledgerType == "SELLER" &&
                                    ledgerTabs == "detailedledger"
                                  ? cardDetailed.totalPaid
                                    ? cardDetailed.totalPaid
                                      ? getCurrencyNumberWithSymbol(
                                          cardDetailed.totalPaid
                                        )
                                      : 0
                                    : 0
                                  : allCustom == "all" &&
                                    ledgerType == "BUYER" &&
                                    ledgerTabs == "detailedledger"
                                  ? detailedTotal.totalRecieved
                                    ? detailedTotal.totalRecieved
                                      ? getCurrencyNumberWithSymbol(
                                          detailedTotal.totalRecieved
                                        )
                                      : 0
                                    : 0
                                  : allCustom == "all" &&
                                    ledgerType == "SELLER" &&
                                    ledgerTabs == "detailedledger"
                                  ? detailedTotal.totalPaid
                                    ? detailedTotal.totalPaid
                                      ? getCurrencyNumberWithSymbol(
                                          detailedTotal.totalPaid
                                        )
                                      : 0
                                    : 0
                                  : summary.totalRcvdPaid
                                  ? getCurrencyNumberWithSymbol(
                                      summary.totalRcvdPaid
                                    )
                                  : 0}
                              </p>
                            </div>
                          </div>
                          <div className="col-lg-3 d-flex align-items-center">
                            <div>
                              {ledgerType == "BUYER" ? (
                                <p className="out-standing">
                                  Outstanding Recievables
                                </p>
                              ) : (
                                <p className="out-standing">
                                  Outstanding Payables
                                </p>
                              )}
                              <p
                                className={
                                  ledgerType == "BUYER"
                                    ? "coloring"
                                    : "paid-coloring"
                                }
                              >
                                {allCustom == "custom" &&
                                ledgerTabs == "ledgersummary"
                                  ? cardDetails.outStdRcvPayble
                                    ? cardDetails?.outStdRcvPayble
                                      ? getCurrencyNumberWithSymbol(
                                          cardDetails.outStdRcvPayble
                                        )
                                      : 0
                                    : 0
                                  : allCustom == "custom" &&
                                    ledgerTabs == "detailedledger"
                                  ? cardDetailed.totalOutStandingBalance
                                    ? cardDetailed?.totalOutStandingBalance
                                      ? getCurrencyNumberWithSymbol(
                                          cardDetailed.totalOutStandingBalance
                                        )
                                      : 0
                                    : 0
                                  : allCustom == "all" &&
                                    ledgerTabs == "detailedledger"
                                  ? detailedTotal.totalOutStandingBalance
                                    ? detailedTotal?.totalOutStandingBalance
                                      ? getCurrencyNumberWithSymbol(
                                          detailedTotal.totalOutStandingBalance
                                        )
                                      : 0
                                    : 0
                                  : summary.outStdRcvPayble
                                  ? getCurrencyNumberWithSymbol(
                                      summary.outStdRcvPayble
                                    )
                                  : 0}
                              </p>
                            </div>

                            {/* </p> */}
                          </div>
                        </div>
                        <span id="horizontal-line"></span>
                        <div className="d-flex justify-content-between">
                          <ul
                            className="nav nav-tabs ledger_tabs"
                            id="myTab"
                            role="tablist"
                          >
                            {links.map((link) => {
                              return (
                                <li key={link.id} className="nav-item ">
                                  <a
                                    className={
                                      "nav-link" +
                                      (ledgerTabs == link.to ? " active" : "")
                                    }
                                    href={"#" + link.to}
                                    role="tab"
                                    aria-controls="home"
                                    data-bs-toggle="tab"
                                    onClick={() => ledgerTabEvent(link.to)}
                                  >
                                    {link.name}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                          <div className="print_dwnld_icons">
                            <button
                            // onClick={() => {
                            //   getDownloadPdf().then();
                            // }}
                            >
                              <img src={download_icon} alt="img" />
                            </button>
                            <button
                              onClick={() => {
                                handleLedgerSummaryJson().then();
                              }}
                            >
                              <img src={print} alt="img" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      {allCustom == "all" && ledgerTabs == "ledgersummary" ? (
                        <LedgerSummary
                          ledgerTab={ledgerTabs}
                          allCustomTab={allCustom}
                          LedgerSummary={ledgerSummary}
                          partyType={props.type}
                          dateDisplay={dateDisplay}
                          partyId={partyId}
                        />
                      ) : (
                        ""
                      )}
                      {allCustom == "all" && ledgerTabs == "detailedledger" ? (
                        <DetailedLedger
                          detailedLedger={detailedLedger}
                          ledgerTab={ledgerTabs}
                          allCustomTab={allCustom}
                          partyType={props.type}
                          dateDisplay={dateDisplay}
                          partyId={partyId}
                        />
                      ) : (
                        ""
                      )}
                      {allCustom == "custom" &&
                      ledgerTabs == "ledgersummary" ? (
                        <LedgerSummary
                          LedgerSummaryByDate={summaryByDate}
                          ledgerTab={ledgerTabs}
                          allCustomTab={allCustom}
                          partyType={props.type}
                          partyId={partyId}
                          dateDisplay={dateDisplay}
                        />
                      ) : (
                        ""
                      )}
                      {allCustom == "custom" &&
                      ledgerTabs == "detailedledger" ? (
                        <DetailedLedger
                          DetailedLedgerByDate={detailedByDate}
                          ledgerTab={ledgerTabs}
                          allCustomTab={allCustom}
                          partyType={props.type}
                          partyId={partyId}
                          dateDisplay={dateDisplay}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row partner_no_data_widget_rows">
                  <div className="col-lg-5">
                    <div className="partner_no_data_widget">
                      <div className="text-center">
                        <img
                          src={no_data_icon}
                          alt="icon"
                          className="d-flex mx-auto justify-content-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {showDatepickerModal1 ? (
            <DatePickerModel
              show={showDatepickerModal}
              close={() => setShowDatepickerModal(false)}
              parentCallback={callbackFunction}
              ledgerTabs={ledgerTabs}
              dateCustom={dateCustom}
            />
          ) : (
            <p></p>
          )}
          {recordPaymentModalStatus ? (
            <RecordPayment
              showRecordPaymentModal={recordPaymentModal}
              closeRecordPaymentModal={() => setRecordPaymentModal(false)}
              LedgerData={ledgerData}
              ledgerId={partyId}
              ledgerSummary={ledgerSummary}
              outStbal={paidRcvd}
              setSummary={getCardDtl}
              ledgerSummaryData={getData}
              ledgerTab={ledgerTabs}
              allCustomTab={allCustom}
              partyType={ledgerType}
              ledgers={getALlLedgers}
              outStAmt={getOutstAmt}
              setPaidRcvd={getPaidRcvd}
              startDate={startDate}
              endDate={endDate}
            />
          ) : (
            ""
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Ledgers;
