import React from "react";
import { useState } from "react";
import { Fragment } from "react";
import search_img from "../../assets/images/search.svg";
import "../../modules/ledgers/buyerLedger.scss";
import close from "../../assets/images/close.svg";
import DatePickerModel from "../smartboard/datePicker";
import {
  getBuyerDetailedLedger,
  getBuyerLedgers,
  getDetailedLedgerByDate,
  getLedgerSummary,
  getLedgerSummaryByDate,
  getOutstandingBal,
  postRecordPayment,
} from "../../actions/billCreationService";
import { useEffect } from "react";
import single_bill from "../../assets/images/bills/single_bill.svg";
import no_data from "../../assets/images/NodataAvailable.svg";
import add from "../../assets/images/add.svg";
import date_icon from "../../assets/images/date_icon.svg";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import "../../modules/buy_bill_book/buyBillBook.scss";
import moment from "moment";
import NoDataAvailable from "../../components/noDataAvailable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchField from "../../components/searchField";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
  getCurrencyNumberWithOneDigit,
} from "../../components/getCurrencyNumber";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BuyerLedger = () => {
  const [openTabs, setOpenTabs] = useState(false);
  const [allData, setallData] = useState([]);
  const [ledger, setLedgeres] = useState(allData);
  const [data, setData] = useState({});
  const [error, setError] = useState();
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const [ledgerSummary, setSummary] = useState([]);
  const [summaryData, setSummaryData] = useState({}, ledgerSummary);
  const [details, setDetails] = useState([]);

  const [open, setIsOpen] = useState(false);
  const [selectDate, setSelectDate] = useState(new Date());
  const [paidRcvd, setPaidRcvd] = useState(0);
  const [paidsRcvd, setPaidsRcvd] = useState(0);
  const [comments, setComments] = useState(" ");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [dateDisplay, setDateDisplay] = useState(false);

  const [ledgerSummaryByDate, setSummaryByDate] = useState([]);
  const [detailsByDate, setDetailsByDate] = useState([]);
  const [isActive, setIsActive] = useState(-1);
  const navigate = useNavigate();
  const [toggleState, setToggleState] = useState("ledgersummary");
  const toggleTab = (type) => {
    setToggleState(type);
  };
  const [toggleAC, setToggleAC] = useState("all");
  const toggleAllCustom = (type) => {
    setToggleAC(type);
    if (type === "custom") {
      console.log(type, dateDisplay);
      setDateDisplay(true);
      setToggleState("ledgersummary");
    } else if (type === "all") {
      setDateDisplay(false);
    }
  };

  let partyId = 0;
  //Fetch ledger by party Type
  useEffect(() => {
    fetchBuyerLedger();
    callbackFunction();
    setDateValue(moment(new Date()).format("DD-MMM-YYYY"));
  }, []);
  const [allLedgersSummary, setallLedgersSummary] = useState([]);
  const fetchBuyerLedger = () => {
    getBuyerLedgers(clickId)
      .then((response) => {
        console.log(response);
        setData(response.data.data);
        setallData(response.data.data.ledgers);
        setLedgeres(response.data.data.ledgers);
        setallLedgersSummary(response.data.data.ledgers);
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  var [dateValue, setDateValue] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showDatepickerModal, setShowDatepickerModal] = useState(false);
  const [showDatepickerModal1, setShowDatepickerModal1] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const onChangeDate = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  const onclickDate = () => {
    setShowDatepickerModal1(true);
    setShowDatepickerModal(true);
  };

  //Get partner By partyId
  const particularLedger = (id, indexs) => {
    console.log(id);
    //getBuyerLedgerSummary(clickId, id);
    setOpenTabs(true);
    setIsActive(indexs);
    ledger.filter((item) => {
      if (item.partyId === id) {
        partyId = id;
        localStorage.setItem("partyId", JSON.stringify(partyId));
        localStorage.setItem("partyItem", JSON.stringify(item));
        getBuyerLedgerSummary(clickId, id);
        fetchBuyerLedgerDetails(clickId, id);
        getOutstandingPaybles(clickId, id);
        return item.partyId;
        //navigate("ledgerSummary");
      } else {
        return <p>Not Found</p>;
      }
    });
  };

  const getOutstandingPaybles = (clickId, partyId) => {
    getOutstandingBal(clickId, partyId).then((response) => {
      console.log(response);
      console.log(response.data);
      setPaidRcvd(response.data.data);
    });
  };
  //Get Buyer Ledger Summary
  const getBuyerLedgerSummary = (clickId, partyId) => {
    getLedgerSummary(clickId, partyId)
      .then((response) => {
        setSummaryData(response.data.data);
        setSummary(response.data.data.ledgerSummary);
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  //Get Buyer Detailed Ledger
  const fetchBuyerLedgerDetails = (clickId, partyId) => {
    getBuyerDetailedLedger(clickId, partyId)
      .then((response) => {
        //setDetailedData(response.data.data);
        setDetails(response.data.data.details);
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  //Add Record payment
  const [requiredCondition, setRequiredCondition] = useState("");
  const onSubmitRecordPayment = () => {
    if (paidsRcvd < 0) {
      setRequiredCondition("Amount Recieved Cannot be negative");
    } else if (parseInt(paidsRcvd) === 0) {
      setRequiredCondition("Amount Received cannot be empty");
    } else if (isNaN(paidsRcvd)) {
      setRequiredCondition("Invalid Amount");
    } else if (
      paidsRcvd.trim().length !== 0 &&
      paidsRcvd != 0 &&
      paidsRcvd < paidRcvd &&
      !(paidsRcvd < 0)
    ) {
      addRecordPayment();
    } else if (parseInt(paidsRcvd) > paidRcvd) {
      setRequiredCondition(
        "Entered Amount  cannot more than Outstanding Balance"
      );
    }
  };

  const addRecordPayment = () => {
    partyId = JSON.parse(
      localStorage.getItem("partyId")
    );
    console.log(partyId);
    const addRecordData = {
      caId: clickId,
      partyId: JSON.parse(localStorage.getItem("partyId")),
      date: moment(selectDate).format("YYYY-MM-DD"),
      comments: comments,
      paidRcvd: paidsRcvd,
      paymentMode: paymentMode,
    };
    console.log(selectDate, addRecordData);
    postRecordPayment(addRecordData).then((response) => {
      console.log(response.data.data);
      setIsOpen(false);
      window.location.reload();
    },
    (error) => {
     
      toast.error(error.response.data.status.message, {
        toastId: "errorr2",
      });
    });
    setOpenTabs(true);
    // setIsActive(indexs);
    // navigate("/buyerledger");
    setIsOpen(false);
    localStorage.removeItem("partyId");
  };
  //Fetch Ledger Summary By Date
  const clearData = () => {
    while (detailsByDate.length > 0) {
      detailsByDate.pop();
    }
  };
  const clearLedgerSummary = () => {
    while (ledgerSummaryByDate.length > 0) {
      ledgerSummaryByDate.pop();
    }
  };
  const callbackFunction = (startDate, endDate, dateTab) => {
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
      console.log("yearly", dateTab);
      setDateValue(moment(fromDate).format("YYYY"));
    } else {
      setDateValue(
        moment(fromDate).format("DD-MMM-YYYY") +
          " to " +
          moment(toDate).format("DD-MMM-YYYY")
      );
    }
    if (toggleState === "ledgersummary" && toggleAC === "custom") {
      clearLedgerSummary();
      var fromDate = moment(startDate).format("YYYY-MM-DD");
      var toDate = moment(endDate).format("YYYY-MM-DD");
      getLedgerSummaryByDate(clickId, partyId, fromDate, toDate)
        .then((response) => {
          console.log(response);
          setSummaryByDate(response.data.data.ledgerSummary);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      clearData();
      var fromDate = moment(startDate).format("YYYY-MM-DD");
      var toDate = moment(endDate).format("YYYY-MM-DD");
      getDetailedLedgerByDate(clickId, partyId, fromDate, toDate)
        .then((response) => {
          console.log(response);
          setDetailsByDate(response.data.data.details);
        })
        .catch((error) => {
          setError(error);
          console.log(error.message);
        });
    }
  };

  const closePopup = () => {
    setPaidsRcvd('');
    $("#myModal").modal("hide");
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
      }
    });
    setLedgeres(result);
  };
  return (
    <Fragment>
      <div>
        <div className="main_div_padding">
          {allLedgersSummary.length > 0 ? (
            <div className="row">
              <div className="col-lg-4 p-0">
                <div id="search-field">
                  <SearchField
                    placeholder="Search by Name / Short Code"
                    onChange={(event) => {
                      handleSearch(event);
                    }}
                  />
                </div>
                {ledger.length > 0 ? (
                  <div>
                    <div
                      className="table-scroll ledger-table"
                      id="scroll_style"
                    >
                      <table className="table table-fixed">
                        <thead className="theadr-tag">
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Date</th>
                            <th scope="col">Buyer Name</th>
                            <th scope="col">To Be Recieved(&#8377;)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ledger.map((item, index) => {
                            return (
                              <Fragment>
                                <tr
                                  onClick={(id, indexs) => {
                                    particularLedger(item.partyId, index);
                                  }}
                                  className={
                                    isActive === index
                                      ? "tabRowSelected"
                                      : "tr-tags"
                                  }
                                >
                                  <td scope="row">{index + 1}</td>
                                  <td key={item.date}>
                                    {moment(item.date).format("DD-MMM-YY")}
                                  </td>
                                  <td key={item.partyName}>
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
                                          {item.partyName}
                                        </p>
                                        <p className="mobilee-tag">
                                          {!item.trader ? "Buyer" : "Trader"} -{" "}
                                          {item.partyId}&nbsp;
                                        </p>
                                        <p className="mobilee-tag">
                                          {item.mobile}
                                        </p>
                                        <p className="address-tag">
                                          {item.partyAddress
                                            ? item.partyAddress
                                            : ""}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td key={item.tobePaidRcvd}>
                                    <p className="coloring">
                                      {item.tobePaidRcvd
                                        ? getCurrencyNumberWithOutSymbol(
                                            item.tobePaidRcvd
                                          )
                                        : 0}
                                    </p>
                                  </td>
                                </tr>
                              </Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="outstanding-pay d-flex align-items-center justify-content-between">
                      <p className="pat-tag">Outstanding Recievables:</p>
                      <p className="values-tag">
                        {data.totalOutStgAmt
                          ? getCurrencyNumberWithSymbol(data.totalOutStgAmt)
                          : 0}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="table-scroll nodata_scroll">
                    <NoDataAvailable />
                  </div>
                )}
              </div>
              <div className="col-lg-8">
                <div
                  className="no_data_found"
                  style={{ display: openTabs ? "none" : "block" }}
                >
                  <img src={no_data} className="no-data-img" />
                </div>
                <div
                  className="container-fluid px-0"
                  id="tabsEvents"
                  style={{ display: openTabs ? "block" : "none" }}
                >
                  <div className="recordbtn-style">
                    <button
                      className="add-record-btns"
                      onClick={() => {
                        (toggleState === "ledgersummary" ||
                          toggleState === "detailedledger") &&
                          setIsOpen(!open);
                      }}
                      data-toggle="modal"
                      data-target="#myModal"
                    >
                      Record payment
                    </button>

                    <div className="add-pays-btn">
                      <img src={add} id="addrecord-img" />
                    </div>
                  </div>
                  <div className="blockers-tab">
                    <div className="d-flex">
                      <button
                        className={
                          toggleAC === "all" ? "tabers active-tab" : "tabers"
                        }
                        onClick={() => toggleAllCustom("all")}
                      >
                        All
                      </button>
                      <button
                        className={
                          toggleAC === "custom" ? "tabers active-tab" : "tabers"
                        }
                        onClick={() => toggleAllCustom("custom")}
                      >
                        Custom
                      </button>
                      <div
                        className="dateRangePicker"
                        style={{ display: dateDisplay ? "flex" : "none" }}
                      >
                        <div onClick={onclickDate} className="color_blue">
                          <div className="date_icon m-0">
                            <img
                              src={date_icon}
                              alt="icon"
                              className="mr-2 date_icon_in_custom"
                            />
                            {dateValue}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="horizontal-lines-tag"></div>
                  </div>

                  <div className="card details-tag">
                    <div className="card-body" id="card-details">
                      <div className="row">
                        {isActive !== -1 && (
                          <div className="col-lg-3" id="verticalLines">
                            {ledger.map((item, index) => {
                              partyId = JSON.parse(
                                localStorage.getItem("partyId")
                              );
                              if (item.partyId == partyId) {
                                return (
                                  <Fragment>
                                    <div
                                      className="profilers-details"
                                      key={index}
                                    >
                                      <div className="d-flex">
                                        <div>
                                          {item.profilePic ? (
                                            <img
                                              id="singles-img"
                                              src={item.profilePic}
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
                                            {item.partyName}
                                          </p>
                                          <p className="mobilee-tag">
                                            {!item.trader ? "Buyer" : "Trader"}{" "}
                                            - {item.partyId}&nbsp;
                                          </p>
                                          <p className="mobilee-tag">
                                            {item.mobile}
                                          </p>
                                          <p className="address-tag">
                                            {item.partyAddress
                                              ? item.partyAddress
                                              : ""}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </Fragment>
                                );
                              } else {
                                <p>No Data Found</p>;
                              }
                            })}
                          </div>
                        )}
                        <div className="col-lg-3" id="verticalLines">
                          <p className="card-text paid">
                            Total Business
                            <p className="coloring">
                              {summaryData.totalTobePaidRcvd
                                ? getCurrencyNumberWithSymbol(
                                    summaryData.totalTobePaidRcvd
                                  )
                                : 0}
                            </p>
                          </p>
                        </div>
                        <div className="col-lg-3" id="verticalLines">
                          <p className="total-paid">
                            Total Recieved
                            <p className="coloring">
                              {summaryData.totalRcvdPaid
                                ? getCurrencyNumberWithSymbol(
                                    summaryData.totalRcvdPaid
                                  )
                                : 0}
                            </p>
                          </p>
                        </div>
                        <div className="col-lg-3 d-flex align-items-center">
                          <p className="out-standing">
                            Outstanding Recievables
                            <p className="coloring">
                              {summaryData.outStdRcvPayble
                                ? getCurrencyNumberWithSymbol(
                                    summaryData.outStdRcvPayble
                                  )
                                : 0}
                            </p>
                          </p>
                        </div>
                      </div>
                      <span id="horizontal-line"></span>
                      <div className="bloc-tabs">
                        <button
                          className={
                            toggleState === "ledgersummary"
                              ? "tabsl active-tabs"
                              : "tabsl"
                          }
                          onClick={() => toggleTab("ledgersummary")}
                        >
                          Ledger Summary
                        </button>
                        <button
                          className={
                            toggleState === "detailedledger"
                              ? "tabsl active-tabs"
                              : "tabsl"
                          }
                          onClick={() => toggleTab("detailedledger")}
                        >
                          Detailed Ledger
                        </button>
                      </div>
                      {/*<hr style={{color:"blue", marginTop:"25px"}}/>
                              <div className="images">
                              <img src={pdf} className="pdf"/>
                              <img src={share} className="share" />
                              <img src={print} className="print"/>
                              </div>*/}
                    </div>
                  </div>
                  {toggleAC === "all" && toggleState === "ledgersummary" && (
                    <div className="ledgerSummary" id="scroll_style">
                      <div
                        id="ledger-summary"
                        className={
                          toggleState === "ledgersummary"
                            ? "content  active-content"
                            : "content"
                        }
                      >
                        <table className="table table-bordered ledger-table">
                          {/*ledger-table*/}
                          <thead className="thead-tag">
                            <tr>
                              <th className="col-1" id="sno">
                                #
                              </th>
                              <th className="col-2">Ref ID | Date</th>
                              <th className="col-3">Received(&#8377;)</th>
                              <th className="col-3">To Be Received(&#8377;)</th>
                              <th className="col-3">Ledger Balance(&#8377;)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ledgerSummary.length > 0 ? (
                              ledgerSummary.map((item, index) => {
                                return (
                                  <tr
                                    className="tr-tags"
                                    scope="row"
                                    kery={item.partyId}
                                  >
                                    <td className="col-1">
                                      <p id="p-common-sno">{index + 1}</p>
                                    </td>
                                    <td className="col-2">
                                      <p style={{ color: "#0066FF" }}>
                                        {item.refId}
                                      </p>
                                      <p>
                                        {moment(item.date).format("DD-MMM-YY")}
                                      </p>
                                    </td>
                                    <td className="col-3">
                                      <p id="p-common">
                                        {item.paidRcvd
                                          ? getCurrencyNumberWithOutSymbol(
                                              item.paidRcvd
                                            )
                                          : ""}
                                      </p>
                                    </td>
                                    <td className="col-3">
                                      <p id="p-common">
                                        {item.tobePaidRcvd
                                          ? getCurrencyNumberWithOutSymbol(
                                              item.tobePaidRcvd
                                            )
                                          : ""}
                                      </p>
                                    </td>
                                    <td className="col-3">
                                      <p className="coloring" id="p-common">
                                        {item.balance
                                          ? getCurrencyNumberWithOutSymbol(
                                              item.balance
                                            )
                                          : ""}
                                      </p>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <p style={{ fontSize: "20px" }}>
                                No Data Available!
                              </p>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {toggleAC === "all" && toggleState === "detailedledger" && (
                    <div className="detailedLedger" id="scroll_style">
                      <div
                        id="detailed-ledger"
                        className={
                          toggleState === "detailedledger"
                            ? "content  active-content"
                            : "content"
                        }
                      >
                        <table
                          className="table table-bordered"
                          id="ledger-sum"
                        >
                          <thead className="thead-tag">
                            <tr>
                              <th className="col-1" id="sno">
                                #
                              </th>
                              <th className="col-2">Ref ID | Date</th>
                              <th className="col-3">
                                <p>Item</p>
                                <p> Unit | Kgs | Rate</p>
                              </th>
                              <th className="col-2">Recieved(&#8377;)</th>
                              <th className="col-2">To Be Recieved(&#8377;)</th>
                              <th className="col-2">Ledger Balance(&#8377;)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {details.length > 0 ? (
                              details.map((item, index) => {
                                return (
                                  <tr className="tr-tags" key={item.partyId}>
                                    <td className="col-1" id="p-common-sno">
                                      {index + 1}
                                    </td>
                                    <td className="col-2">
                                      <p style={{ color: "#0066FF" }}>
                                        {item.refId}
                                      </p>
                                      <p>
                                        {moment(item.date).format("DD-MMM-YY")}
                                      </p>
                                    </td>
                                    <td className="col-3">
                                      <p style={{ fontSize: "12px" }}>
                                        {item.itemName}
                                      </p>
                                      <span style={{ fontSize: "13px" }}>
                                        {item.qty
                                          ? getCurrencyNumberWithOneDigit(
                                              item.qty
                                            )
                                          : ""}{" "}
                                        {item.unit !== null
                                          ? item.unit
                                              .charAt(item)
                                              .toUpperCase() + " | "
                                          : ""}{" "}
                                        {item.kg
                                          ? getCurrencyNumberWithOneDigit(
                                              item.kg
                                            ) + " | "
                                          : ""}{" "}
                                        {item.rate
                                          ? getCurrencyNumberWithOutSymbol(
                                              item.rate
                                            )
                                          : ""}
                                      </span>
                                    </td>
                                    <td className="col-2">
                                      <p id="p-common">
                                        {item.recieved
                                          ? getCurrencyNumberWithOutSymbol(
                                              item.recieved
                                            )
                                          : ""}
                                      </p>
                                    </td>
                                    <td className="col-2">
                                      <p id="p-common">
                                        {item.toBeRecieved
                                          ? getCurrencyNumberWithOutSymbol(
                                              item.toBeRecieved
                                            )
                                          : ""}
                                      </p>
                                    </td>
                                    <td className="col-2">
                                      <p className="coloring" id="p-common">
                                        {item.balance
                                          ? getCurrencyNumberWithOutSymbol(
                                              item.balance
                                            )
                                          : ""}
                                      </p>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <p style={{ fontSize: "20px" }}>
                                No Data Available!
                              </p>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {toggleAC === "custom" && toggleState === "ledgersummary" && (
                    <div className="ledgerSummary" id="scroll_style">
                      <div
                        id="ledger-summary"
                        className={
                          toggleState === "ledgersummary"
                            ? "content  active-content"
                            : "content"
                        }
                      >
                        {ledgerSummaryByDate.length > 0 ? (
                          <table className="table table-bordered ledger-table">
                            {/*ledger-table*/}
                            <thead className="thead-tag">
                              <tr>
                                <th className="col-1" id="sno">
                                  #
                                </th>
                                <th className="col-2">Ref ID | Date</th>
                                <th className="col-3">Received(&#8377;)</th>
                                <th className="col-3">
                                  To Be Received(&#8377;)
                                </th>
                                <th className="col-3">
                                  Ledger Balance(&#8377;)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {ledgerSummaryByDate.map((item, index) => {
                                return (
                                  <tr
                                    className="tr-tags"
                                    scope="row"
                                    kery={item.partyId}
                                  >
                                    <td className="col-1">
                                      <p id="p-common-sno">{index + 1}</p>
                                    </td>
                                    <td className="col-2">
                                      <p style={{ color: "#0066FF" }}>
                                        {item.refId}
                                      </p>
                                      <p>
                                        {moment(item.date).format("DD-MMM-YY")}
                                      </p>
                                    </td>
                                    <td className="col-3">
                                      <p id="p-common">
                                        {item.paidRcvd
                                          ? item.paidRcvd.toFixed(2)
                                          : ""}
                                      </p>
                                    </td>
                                    <td className="col-3">
                                      <p id="p-common">
                                        {item.tobePaidRcvd
                                          ? item.tobePaidRcvd.toFixed(2)
                                          : ""}
                                      </p>
                                    </td>
                                    <td className="col-3">
                                      <p className="coloring" id="p-common">
                                        {item.balance
                                          ? item.balance.toFixed(2)
                                          : ""}
                                      </p>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        ) : (
                          <NoDataAvailable />
                        )}
                      </div>
                    </div>
                  )}
                  {toggleAC === "custom" &&
                    toggleState === "detailedledger" && (
                      <div className="detailedLedger" id="scroll_style">
                        <div
                          id="detailed-ledger"
                          className={
                            toggleState === "detailedledger"
                              ? "content  active-content"
                              : "content"
                          }
                        >
                          {detailsByDate.length > 0 ? (
                            <table className="table table-bordered">
                              <thead className="thead-tag">
                                <tr>
                                  <th className="col-1" id="sno">
                                    #
                                  </th>
                                  <th className="col-2">Ref ID | Date</th>
                                  <th className="col-3">
                                    <p>Item</p>
                                    <p> Unit | Kgs | Rate</p>
                                  </th>
                                  <th className="col-2">Recieved(&#8377;)</th>
                                  <th className="col-2">
                                    To Be Recieved(&#8377;)
                                  </th>
                                  <th className="col-2">
                                    Ledger Balance(&#8377;)
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {detailsByDate.map((item, index) => {
                                  return (
                                    <tr className="tr-tags" key={item.partyId}>
                                      <td className="col-1" id="p-common-sno">
                                        {index + 1}
                                      </td>
                                      <td className="col-2">
                                        <p style={{ color: "#0066FF" }}>
                                          {item.refId ? item.refId : ""}
                                        </p>{" "}
                                        {moment(item.date).format("DD-MMM-YY")}
                                      </td>
                                      <td className="col-3">
                                        <p style={{ fontSize: "12px" }}>
                                          {item.itemName}
                                        </p>
                                        <span style={{ fontSize: "13px" }}>
                                          {item.qty ? item.qty.toFixed(1) : ""}{" "}
                                          {item.unit
                                            ? item.unit
                                                .charAt(item)
                                                .toUpperCase() + " | "
                                            : ""}
                                          {item.kg ? item.kg + " | " : ""}
                                          {item.rate ? item.rate : ""}
                                        </span>
                                      </td>
                                      <td className="col-3">
                                        <p id="p-common">
                                          {item.recieved
                                            ? item.recieved.toFixed(2)
                                            : ""}
                                        </p>
                                      </td>
                                      <td className="col-3">
                                        <p id="p-common">
                                          {item.toBeRecieved
                                            ? item.toBeRecieved.toFixed(2)
                                            : ""}
                                        </p>
                                      </td>
                                      <td className="col-3">
                                        <p className="coloring" id="p-common">
                                          {item.balance
                                            ? item.balance.toFixed(2)
                                            : ""}
                                        </p>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          ) : (
                            <NoDataAvailable />
                          )}
                        </div>
                      </div>
                    )}
                  <div className="modal fade" id="myModal">
                    <div className="modal-dialog transporter_modal modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5
                            className="modal-title header2_text"
                            id="staticBackdropLabel"
                          >
                            Add Record Payment
                          </h5>
                          <img
                            src={close}
                            alt="image"
                            className="close_icon"
                            onClick={closePopup}
                          />
                        </div>
                        <div
                          className="modal-body transporter_model_body"
                          id="scroll_style"
                        >
                          <form>
                            <div className="row">
                             <div className="col-lg-12">
                             <div className="card">
                              <div
                                className="d-flex justify-content-between card-body"
                                id="details-tag"
                              >
                                {ledger.map((item, index) => {
                                  
                                  if (item.partyId == parseInt(partyId)) {
                                    return (
                                      <Fragment>
                                        <div
                                          className="profile-details"
                                          key={item.partyName}
                                        >
                                          <div className="d-flex">
                                            <div>
                                              {item.profilePic ? (
                                                <img
                                                  id="singles-img"
                                                  src={item.profilePic}
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
                                                {item.partyName}
                                              </p>
                                              <p className="mobilee-tag">
                                                {!item.trader
                                                  ? "Buyer"
                                                  : "Trader"}{" "}
                                                - {item.partyId}&nbsp;|&nbsp;
                                                {item.mobile}
                                              </p>
                                              <p className="addres-tag">
                                                {item.partyAddress
                                                  ? item.partyAddress
                                                  : ""}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </Fragment>
                                    );
                                  }
                                 
                                })}
                                <div
                                  className="d-flex justify-content-between card-text date_field"
                                  id="date-tag"
                                >
                                  
                                  <img
                                    className="date_icon_in_modal"
                                    src={date_icon}
                                  />
                                  <DatePicker
                                    //className="date_picker_in_modal"
                                    selected={selectDate}
                                    onChange={(date) => {
                                      setSelectDate(date);
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
                            <div id="out-paybles">
                              <p id="p-tag">Outstanding Recievables</p>
                              <p id="recieve-tag">
                                &#8377;
                                {paidRcvd ? paidRcvd.toFixed(2) : 0}
                              </p>
                            </div>
                            <div className="form-group" id="input_in_modal">
                              <label hmtlFor="amtRecieved" id="amt-tag">
                                Amount
                              </label>
                              <input
                                className="form-cont"
                                id="amtRecieved"
                                value={paidsRcvd}
                                required
                                onChange={(e) => {
                                  setPaidsRcvd(
                                    e.target.value.replace(/[^\d]/g, "")
                                  );
                                }}
                              />
                              <p className="text-valid">{requiredCondition}</p>
                            </div>
                            <div id="radios_in_modal">
                              <p className="payment-tag">Payment Mode</p>
                              <div className="form-check form-check-inline">
                                <input
                                  className="form-check-input radioBtnVal mb-0"
                                  type="radio"
                                  name="radio"
                                  id="inlineRadio1"
                                  value="CASH"
                                  onChange={(e) =>
                                    setPaymentMode(e.target.value)
                                  }
                                  checked={paymentMode === "CASH"}
                                  required
                                />
                                <label
                                  className="form-check-label"
                                  for="inlineRadio1"
                                >
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
                                  onChange={(e) =>
                                    setPaymentMode(e.target.value)
                                  }
                                  checked={paymentMode === "UPI"}
                                  required
                                />
                                <label
                                  className="form-check-label"
                                  for="inlineRadio2"
                                >
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
                                  onChange={(e) =>
                                    setPaymentMode(e.target.value)
                                  }
                                  checked={paymentMode === "NEFT"}
                                  required
                                />
                                <label
                                  className="form-check-label"
                                  for="inlineRadio3"
                                >
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
                                  onChange={(e) =>
                                    setPaymentMode(e.target.value)
                                  }
                                  checked={paymentMode === "RTGS"}
                                  required
                                />
                                <label
                                  className="form-check-label"
                                  for="inlineRadio4"
                                >
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
                                  onChange={(e) =>
                                    setPaymentMode(e.target.value)
                                  }
                                  checked={paymentMode === "IMPS"}
                                  required
                                />
                                <label
                                  className="form-check-label"
                                  for="inlineRadio5"
                                >
                                  IMPS
                                </label>
                              </div>
                            </div>
                            <div id="comment_in_modal">
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
                                  onChange={(e) => setComments(e.target.value)}
                                ></textarea>
                              </div>
                            </div>
                             </div>
                            </div>
                          </form>
                        </div>
                        <div className="modal-footer" id="modal_footer">
                          <button
                            type="button"
                            id="submit_btn_in_modal"
                            className="primary_btn cont_btn w-100"
                            onClick={onSubmitRecordPayment}
                            // id="close_modal"
                            data-bs-dismiss="modal"
                          >
                            SUBMIT
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <NoDataAvailable />
          )}
        </div>
        {showDatepickerModal1 ? (
          <DatePickerModel
            show={showDatepickerModal}
            close={() => setShowDatepickerModal(false)}
            parentCallback={callbackFunction}
          />
        ) : (
          <p></p>
        )}
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default BuyerLedger;
