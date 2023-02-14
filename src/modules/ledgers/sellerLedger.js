import React from "react";
import { useState } from "react";
import { Fragment } from "react";
import "../../modules/ledgers/buyerLedger.scss";
import close from "../../assets/images/close.svg";
import DatePickerModel from "../smartboard/datePicker";
import {
  getLedgerSummary,
  getLedgerSummaryByDate,
  getOutstandingBal,
  getSelleLedgers,
  getSellerDetailedLedger,
  getSellerDetailedLedgerByDate,
  postRecordPayment,
} from "../../actions/billCreationService";
import { useEffect } from "react";
import single_bill from "../../assets/images/bills/single_bill.svg";
import no_data from "../../assets/images/NodataAvailable.svg";
import add from "../../assets/images/add.svg";
import close_btn from "../../assets/images/close_btn.svg";
import date_icon from "../../assets/images/date_icon.svg";
import ReactModal from "react-modal";
import { useNavigate } from "react-router-dom";
import right_click from "../../assets/images/right_click.svg";
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
  getMaskedMobileNumber,
} from "../../components/getCurrencyNumber";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SellerLedger = () => {
  const [search, setSearch] = useState("");
  //const showTabs=localStorage.getItem("openTabs");
  const [openTabs, setOpenTabs] = useState(true)//(showTabs?true:false);
  const [allData, setallData] = useState([]); 
  const [ledger, setLedgeres] = useState(allData);
  // const [ledger, setLedgeres] = useState([{}]);
  const [data, setData] = useState({}, ledger);
  const [error, setError] = useState();
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const [ledgerSummary, setSummary] = useState([{}]);
  const [summaryData, setSummaryData] = useState({}, ledgerSummary);
  const [details, setDetails] = useState([{}]);
  const [detailedData, setDetailedData] = useState({}, details);

  const [open, setIsOpen] = useState(false);
  const [selectDate, setSelectDate] = useState(new Date());
  const [paidRcvd, setPaidRcvd] = useState(0);
  const [paidsRcvd, setPaidsRcvd] = useState(0);
  const [comments, setComments] = useState(" ");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [dateDisplay, setDateDisplay] = useState(false);

  const [ledgerSummaryByDate, setSummaryByDate] = useState([]);
  //const [summaryDataByDate, setSummaryDataByDate] = useState({}, ledgerSummary);

  const [sellerDetailed, setSellerDetailed] = useState([]);
  //const active = localStorage.getItem('isActive');
  const [isActive, setIsActive] = useState(0)//(active>=0?active:-1);

  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);

  const navigate = useNavigate();
  const [toggleState, setToggleState] = useState("ledgersummary");

  const [toggleAC, setToggleAC] = useState("all");
  const toggleAllCustom = (type) => {
    console.log(type,"type");
    setToggleAC(type);
    console.log(toggleState,"toggleSt")
    if (type === "custom") {
      setDateDisplay(true);
      setToggleState("ledgersummary");
      // callbackFunction(date,date,'Daily')
    } else if (type === "all") {
      setDateDisplay(false);
    }
  };
  
  const toggleTab = (type) => {
    setToggleState(type);
  };

  var date = moment(new Date()).format("YYYY-MM-DD")
  let partyId = 0;
  var [dateValue, setDateValue] = useState()
  useEffect(() => {
    fetchSellerLedger()
    getSelleLedgers(clickId).then((res)=>{
      particularLedger(res.data.data.ledgers[0].partyId,0);
    })
    setDateValue(moment(new Date()).format("DD-MMM-YYYY"));
  },[]);


  ;

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
  const [allLedgersSummary, setallLedgersSummary] = useState([]);
  const fetchSellerLedger = () => {
    getSelleLedgers(clickId)
      .then((response) => {
        setData(response.data.data);
        setallData(response.data.data.ledgers);
        setLedgeres(response.data.data.ledgers);
        localStorage.setItem("sellPartyId", JSON.stringify(response.data.data.ledgers[0].partyId));
        setallLedgersSummary(response.data.data.ledgers);
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  //Get partner By partyId
  const particularLedger = (id, indexs) => {
 
    getSellerLedgerSummary(clickId, id);
    fetchSellerLedgerDetails(clickId, id);

    clearLedgerSummary();
    clearData();
    if(toggleAC === 'custom' && toggleState === 'detailedledger'){
      setToggleState("ledgersummary") 
    } else if(toggleAC === 'all' && toggleState === 'detailedledger'){
      setToggleState("ledgersummary");
    }
    setOpenTabs(true);
    setIsActive(indexs);
    ledger.filter((item) => {
      if (item.partyId === id) {
        partyId = id;
        localStorage.setItem("sellPartyId", JSON.stringify(partyId));
        getSellerLedgerSummary(clickId, id);
        fetchSellerLedgerDetails(clickId, id);
        getOutstandingPaybles(clickId, id);
        callbackFunction(date,date,'Daily')
        return item.partyId;
      } else {
        return <p>Not Found</p>;
      }
    });
  };
  const getOutstandingPaybles = (clickId, partyId) => {
    getOutstandingBal(clickId, partyId).then((response) => {
      setPaidRcvd(response.data.data);
    });
  };
  //Get Seller Ledger Summary
  const getSellerLedgerSummary = (clickId, partyId) => {
    getLedgerSummary(clickId, partyId)
      .then((response) => {
        setSummaryData(response.data.data);
        setSummary(response.data.data.ledgerSummary);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  //Get Seller Detailed Ledger
  const fetchSellerLedgerDetails = (clickId, partyId) => {
    getSellerDetailedLedger(clickId, partyId)
      .then((response) => {
        setDetailedData(response.data.data);
        setDetails(response.data.data.details);
        //console.log(details[0].itemName);
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
      setRequiredCondition(langFullData.amountReceivedCannotBeEmpty);
    } else if (isNaN(paidsRcvd)) {
      setRequiredCondition("Invalid Amount");
    } else if (
      paidsRcvd.trim().length !== 0 &&
      paidsRcvd != 0 &&
      paidsRcvd < paidRcvd &&
      !(paidsRcvd < 0)
    ) {
      addRecordPayment();
    } else if (paidsRcvd > paidRcvd) {
      setRequiredCondition(
        langFullData.enteredAmountCannotMoreThanOutstandingBalance
      );
    }
  };
  const addRecordPayment = (partyId) => {
    partyId = JSON.parse(
      localStorage.getItem("sellPartyId")
    );
    const addRecordData = {
      caId: clickId,
      partyId: JSON.parse(localStorage.getItem("sellPartyId")),
      date: moment(selectDate).format("YYYY-MM-DD"),
      comments: comments,
      paidRcvd: paidsRcvd,
      paymentMode: paymentMode,
    };
    postRecordPayment(addRecordData).then((response)=>{
      localStorage.setItem('openTabs',true);
        closePopup();
        toast.success(response.data.status.message,{
          toastId: "errorr2",
        })
        window.setTimeout(function () {
          window.location.reload();
        }, 2000);
        setIsOpen(true);
    }).catch(error=>{
      toast.error(error.response.data.status.message,{
        toastId: "errorr2",
      })
    })
  };
  const clearData = () => {
    while (sellerDetailed.length > 0) {
      sellerDetailed.pop();
    }
  };

  const clearLedgerSummary = () => {
    while (ledgerSummaryByDate.length > 0) {
      ledgerSummaryByDate.pop();
    }
  };
  //Fetch Ledger Summary By Date
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
      
      var fromDate = moment(startDate).format("YYYY-MM-DD");
      var toDate = moment(endDate).format("YYYY-MM-DD");
      clearLedgerSummary();
      getLedgerSummaryByDate(clickId, localStorage.getItem('sellPartyId'), fromDate, toDate)
        .then((response) => {
          console.log(response, "res");
          setSummaryByDate(response.data.data.ledgerSummary);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      clearData();
      var fromDate = moment(startDate).format("YYYY-MM-DD");
      var toDate = moment(endDate).format("YYYY-MM-DD");
      getSellerDetailedLedgerByDate(clickId, partyId, fromDate, toDate)
        .then((response) => {
          console.log(response);
          setSellerDetailed(response.data.data.details);
        })
        .catch((error) => {
          setError(error);
        });
    }
  };

  const handleWeekPick = (startDate, endDate) => {
    console.log(`${startDate} to ${endDate}`);
  };
  const DateModal = () => {
    $("#datePopupmodal").modal("show");
  };

  const [ledgersData, setLedgersData] = useState([]);
  const [valueActive, setIsValueActive] = useState(false);
  //partyId = JSON.parse(localStorage.getItem("partyId"));
  const searchInput = (searchValue) => {
    setSearch(searchValue);
    if (search !== "") {
      console.log(search);
      const filterdNames = ledger.filter((item) => {
        if (
          item.partyName.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.shortName.toLowerCase().includes(searchValue.toLowerCase())
        ) {
          return (
            item.partyName.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.shortName.toLowerCase().includes(searchValue.toLowerCase())
          );
        } else if (search == "" || searchValue === "") {
          return setIsValueActive(false);
        } else {
          return setIsValueActive(true);
        }
      });
      setLedgersData(filterdNames);
      console.log(filterdNames, "filteredNames");
    } else {
      setIsValueActive(false);
      setLedgersData(ledger);
    }
  };
  const getAmountValue = (e) =>{
    setPaidsRcvd(
      e.target.value.replace(/[^\d]/g, "")
    );
    if(e.target.value.length > 0){
      setRequiredCondition("");
    }
  }
  const closePopup = () => {
    setPaidsRcvd(0);
    setRequiredCondition('');
    setPaymentMode("CASH");
    setComments('');
    setSelectDate(new Date());
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

//  useEffect(()=>{
//   if(isActive>=0){
//     console.log("came");
//     var id = JSON.parse(
//     localStorage.getItem("sellPartyId"));
//     getSellerLedgerSummary(clickId, id);
//     fetchSellerLedgerDetails(clickId, id);
//     getOutstandingPaybles(clickId, id);
//   }
// },[])
const resetInput = (e) => {
  if(e.target.value == 0){
    e.target.value = "";
  }
}
  return (
    <Fragment>
      <div>
        <div className="main_div_padding">
          {allLedgersSummary.length > 0 ? (
            <div className="row">
              <div className="col-lg-4 p-0">
                <div id="search-field">
                  <SearchField
                    placeholder={langFullData.searchByNameShortCode}
                    onChange={(event) => {
                      handleSearch(event);
                    }}
                  />
                </div>
                {ledger.length > 0 ? (
                  <div>
                    <div className="table-scroll ledger-table" id="scroll_style">
                      <table className="table table-fixed ">
                        <thead className="theadr-tag">
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">{langFullData.date}</th>
                            <th scope="col">{langFullData.sellerName}</th>
                            <th scope="col">
                              {langFullData.toBePaid}(&#8377;)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {ledger.map((item, index) => {
                             partyId = JSON.parse(
                              localStorage.getItem("sellPartyId")
                            );
                            return (
                              <Fragment>
                                
                                <tr
                                  onClick={(id, indexs) => {
                                    particularLedger(item.partyId, index);
                                  }}
                                  className={
                                    localStorage.getItem("sellPartyId") == item.partyId
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
                                          {!item.trader ? "Seller" : "Trader"} -{" "}
                                          {item.partyId}&nbsp;
                                        </p>
                                        <p className="mobilee-tag">
                                          {getMaskedMobileNumber(item.mobile)}
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
                                    <p className="paid-coloring">
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
                      <p className="pat-tag">
                        {langFullData.outstandingPayables}:
                      </p>
                      <p className="values-tag paid-coloring">
                        {data.totalOutStgAmt
                          ? getCurrencyNumberWithSymbol(data.totalOutStgAmt)
                          : 0}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="table-scroll nodata_scroll">
                    {" "}
                    <NoDataAvailable />
                  </div>
                )}
              </div>
              <div className="col-lg-8">
               {partyId != 0 ? <div>
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
                  <div>
                  {/* <div className="recordbtn-style">
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
                  </div> */}
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
                  </div>
                  <div className="card details-tag">
                    <div className="card-body" id="card-details">
                      <div className="row">
                        {isActive >=0 && (
                          <div className="col-lg-3" id="verticalLines">
                            {ledger.map((item, index) => {
                              partyId = JSON.parse(
                                localStorage.getItem("sellPartyId")
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
                                            {!item.trader
                                              ? langFullData.seller
                                              : langFullData.trader}{" "}
                                            - {item.partyId}&nbsp;
                                          </p>
                                          <p className="mobilee-tag">
                                            {getMaskedMobileNumber(item.mobile)}
                                          </p>
                                         
                                        </div>
                                      </div>
                                    </div>
                                  </Fragment>
                                );
                              } else {
                                <p>{langFullData.noDataFound}</p>;
                              }
                            })}
                          </div>
                        )}
                        <div className="col-lg-3" id="verticalLines">
                          <p className="card-text paid">
                            {langFullData.totalBusiness}
                            <p className="paid-coloring">
                              {summaryData.totalTobePaidRcvd
                                ? getCurrencyNumberWithSymbol(
                                    summaryData.totalTobePaidRcvd
                                  )
                                : ""}
                            </p>
                          </p>
                        </div>
                        <div className="col-lg-3" id="verticalLines">
                          <p className="total-paid">
                            {langFullData.totalPaid}
                            <p className="paid-coloring">
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
                            {langFullData.outstandingPayables}
                            <p className="paid-coloring">
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
                          {langFullData.ledgerSummary}
                        </button>
                        <button
                          className={
                            toggleState === "detailedledger"
                              ? "tabsl active-tabs"
                              : "tabsl"
                          }
                          onClick={() => toggleTab("detailedledger")}
                        >
                          {langFullData.detailedLedger}
                        </button>
                      </div>
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
                              <th className="col-2">
                                Ref ID | {langFullData.date}
                              </th>
                              <th className="col-3">
                                {langFullData.paid}(&#8377;)
                              </th>
                              <th className="col-3">
                                {langFullData.toBePaid}(&#8377;)
                              </th>
                              <th className="col-3">
                                {langFullData.ledgerBalance}(&#8377;)
                              </th>
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
                                      <p
                                        className="paid-coloring"
                                        id="p-common"
                                      >
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
                          className="table table-bordered ledger-table"
                          id="ledger-sum"
                        >
                          <thead className="thead-tag">
                            <tr>
                              <th className="col-1" id="sno">
                                #
                              </th>
                              <th className="col-2">
                                Ref ID | {langFullData.date}
                              </th>
                              <th className="col-3">
                                <p>{langFullData.item}</p>
                                <p>{langFullData.unitKgsRate}</p>
                              </th>
                              <th className="col-2">
                                {langFullData.paid}(&#8377;)
                              </th>
                              <th className="col-2">
                                {langFullData.toBePaid}(&#8377;)
                              </th>
                              <th className="col-2">
                                {langFullData.ledgerBalance}(&#8377;)
                              </th>
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
                                        {item.qty ? item.qty.toFixed(1) : ""}{" "}
                                        {item.unit !== null
                                          ? item.unit
                                              .charAt(item)
                                              .toUpperCase() + " | "
                                          : ""}
                                        {item.kg ? item.kg + " | " : ""}
                                        {item.rate ? item.rate : ""}
                                      </span>
                                    </td>
                                    <td className="col-2">
                                      <p>
                                        {item.paid
                                          ? getCurrencyNumberWithOutSymbol(
                                              item.paid
                                            )
                                          : ""}
                                      </p>
                                    </td>
                                    <td className="col-2">
                                      <p id="p-common">
                                        {item.toBePaid
                                          ? getCurrencyNumberWithOutSymbol(
                                              item.toBePaid
                                            )
                                          : ""}
                                      </p>
                                    </td>
                                    <td className="col-2">
                                      <span
                                        className="coloring paid-coloring"
                                        id="p-common"
                                      >
                                        {item.balance
                                          ? getCurrencyNumberWithOutSymbol(
                                              item.balance
                                            )
                                          : ""}
                                      </span>
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
                        {ledgerSummaryByDate.length > 0 &&
                        ledgerSummaryByDate !== null ? (
                          <table className="table table-bordered ledger-table">
                            {/*ledger-table*/}
                            <thead className="thead-tag">
                              <tr>
                                <th className="col-1" id="sno">
                                  #
                                </th>
                                <th className="col-2">
                                Ref ID | {langFullData.date}
                                </th>
                                <th className="col-3">
                                  {langFullData.paid}(&#8377;)
                                </th>
                                <th className="col-3">
                                  {langFullData.toBePaid}(&#8377;)
                                </th>
                                <th className="col-3">
                                  {langFullData.ledgerBalance}(&#8377;)
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
                                      <p
                                        className="coloring paid-coloring"
                                        id="p-common"
                                      >
                                        {item.balance
                                          ? getCurrencyNumberWithOutSymbol(
                                              item.balance
                                            )
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
                  {toggleAC === "custom" && toggleState === "detailedledger" ? (
                    <div className="detailedLedger" id="scroll_style">
                      <div
                        id="detailed-ledger"
                        className={
                          toggleState === "detailedledger"
                            ? "content  active-content"
                            : "content"
                        }
                      >
                        {sellerDetailed.length > 0 ? (
                          <table className="table table-bordered ledger-table">
                            <thead className="thead-tag">
                              <tr>
                                <th className="col-1" id="sno">
                                  #
                                </th>
                                <th className="col-2">
                                  Ref ID | {langFullData.date}
                                </th>
                                <th className="col-3">
                                  <p>{langFullData.item}</p>
                                  <p>{langFullData.unitKgsRate}</p>
                                </th>
                                <th className="col-2">
                                  {langFullData.paid}(&#8377;)
                                </th>
                                <th className="col-2">
                                  {langFullData.toBePaid}(&#8377;)
                                </th>
                                <th className="col-2">
                                  {langFullData.ledgerBalance}(&#8377;)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {sellerDetailed.map((item, index) => {
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
                                        {item.paid
                                          ? getCurrencyNumberWithOutSymbol(
                                              item.paid
                                            )
                                          : ""}
                                      </p>
                                    </td>
                                    <td className="col-3">
                                      <p id="p-common">
                                        {item.toBePaid
                                          ? getCurrencyNumberWithOutSymbol(
                                              item.toBePaid
                                            )
                                          : ""}
                                      </p>
                                    </td>
                                    <td className="col-3">
                                      <p
                                        className="coloring paid-coloring"
                                        id="p-common"
                                      >
                                        {item.balance
                                          ? getCurrencyNumberWithOutSymbol(
                                              item.balance
                                            )
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
                  ) : (
                    ""
                  )}
                  <div className="modal fade" id="myModal">
                    <div className="modal-dialog transporter_modal modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5
                            className="modal-title header2_text"
                            id="staticBackdropLabel"
                          >
                            {langFullData.addRecordPayment}
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
                            <div className="card">
                              <div
                                className="d-flex justify-content-between card-body"
                                id="details-tag"
                              >
                                {ledger.map((item, index) => {
                                  if (item.partyId == partyId) {
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
                                                  ? "Farmer"
                                                  : "Trader"}{" "}
                                                - {item.partyId}&nbsp;|&nbsp;
                                                {getMaskedMobileNumber(item.mobile)}
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
                                    onKeyDown={(e) => {
                                      e.preventDefault();
                                    }}
                                  ></DatePicker>
                                </div>
                              </div>
                            </div>
                            <div id="out-paybles">
                              <p id="p-tag">
                                {langFullData.outstandingPayables}
                              </p>
                              <p id="recieve-tag">
                                &#8377;
                                {paidRcvd ? paidRcvd.toFixed(2) : 0}
                              </p>
                            </div>
                            <div className="form-group" id="input_in_modal">
                              <label hmtlFor="amtRecieved" id="amt-tag">
                                {langFullData.amount}
                              </label>
                              <input
                                className="form-control"
                                id="amtRecieved"
                                type="text"
                                required
                                onFocus={(e) => resetInput(e)}
                                value={paidsRcvd}
                                onChange={(e) => {
                                  getAmountValue(e)
                                 
                                }}
                              />
                              <p className="text-valid">{requiredCondition}</p>
                            </div>
                            <div id="radios_in_modal">
                              <p className="payment-tag">
                                {langFullData.paymentMode}
                              </p>
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
                                  {langFullData.cash}
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
                                  {langFullData.upi}
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
                                  {langFullData.neft}
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
                                  {langFullData.rtgs}
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
                                  {langFullData.imps}
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
                                  {langFullData.comment}
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
                            {langFullData.submit}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
               </div> : <div className="d-flex align-items-center">
               <img src={no_data} className="no-data-img nodataimage" />
                 </div>}
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

export default SellerLedger;
