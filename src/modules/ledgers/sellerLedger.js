import React from "react";
import { useState } from "react";
import { Fragment } from "react";
import search_img from "../../assets/images/search.svg";
import "../../modules/ledgers/buyerLedger.scss";
import close from "../../assets/images/close.svg";
import DatePicker from "react-datepicker";
import DatePickerModel from "../smartboard/datePicker";
import {
  getLedgerSummary,
  getLedgerSummaryByDate,
  getSelleLedgers,
  getSellerDetailedLedger,
  getSellerDetailedLedgerByDate,
  postRecordPayment,
} from "../../actions/billCreationService";
import { useEffect } from "react";
import single_bill from "../../assets/images/bills/single_bill.svg";
import no_data from "../../assets/images/no_data_available.png";
import add from "../../assets/images/add.svg";
import ReactDatePicker from "react-datepicker";
import close_btn from "../../assets/images/close_btn.svg";
import date_icon from "../../assets/images/date_icon.svg";
import ReactModal from "react-modal";
import { useNavigate } from "react-router-dom";
import right_click from "../../assets/images/right_click.svg";
import $ from "jquery";
import "../../modules/buy_bill_book/buyBillBook.scss";
import moment from "moment";
import NoDataAvailable from "../../components/noDataAvailable";
const SellerLedger = () => {
  const [search, setSearch] = useState("");
  const [openTabs, setOpenTabs] = useState(false);
  const [ledger, setLedgeres] = useState([{}]);
  const [data, setData] = useState({}, ledger);
  const [error, setError] = useState();
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const [ledgerSummary, setSummary] = useState([{}]);
  const [summaryData, setSummaryData] = useState({}, ledgerSummary);
  const [details, setDetails] = useState([{}]);
  const [detailedData, setDetailedData] = useState({}, details);

  const [open, setIsOpen] = useState(false);
  const [selectDate, setSelectDate] = useState(new Date());
  const [paidRcvd, setPaidRcvd] = useState(0);
  const [comments, setComments] = useState(" ");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [dateDisplay, setDateDisplay] = useState(false);

  const [ledgerSummaryByDate, setSummaryByDate] = useState([]);
  //const [summaryDataByDate, setSummaryDataByDate] = useState({}, ledgerSummary);

  const [sellerDetailed, setSellerDetailed] = useState([]);
  const [isActive, setIsActive] = useState(-1);

  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);

  const navigate = useNavigate();
  const [toggleState, setToggleState] = useState("ledgersummary");
  
  const toggleTab = (type) => {
    setToggleState(type);
  };

  const [toggleAC, setToggleAC] = useState("all");
  const toggleAllCustom = (type) => {
    setToggleAC(type);
    if (type === "custom") {
      console.log(type);
      setDateDisplay(!dateDisplay);
      setToggleState("ledgersummary");
    } else if (type === "all") {
      setDateDisplay(false);
    }
  };


  let partyId = 0;
  //Fetch ledger by party Type
  useEffect(() => {
    fetchSellerLedger();
    callbackFunction();
    setDateValue(moment(new Date()).format("DD-MMM-YYYY"))
  }, [clickId]);

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

  const fetchSellerLedger = () => {
    getSelleLedgers(clickId)
      .then((response) => {
        setData(response.data.data);
        setLedgeres(response.data.data.ledgers);
      })
      .catch((error) => {
        setError(error.message);
      });
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
        getSellerLedgerSummary(clickId, id);
        fetchSellerLedgerDetails(clickId, id);
        return item.partyId;
        //navigate("ledgerSummary");
      } else {
        return <p>Not Found</p>;
      }
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
    if (paidRcvd < 0) {
      setRequiredCondition("Amount Recieved Cannot be negative");
    } else if (parseInt(paidRcvd) === 0) {
      setRequiredCondition(langFullData.amountReceivedCannotBeEmpty);
    } else if (isNaN(paidRcvd)) {
      setRequiredCondition("Invalid Amount");
    } else if (
      paidRcvd.trim().length !== 0 &&
      paidRcvd != 0 &&
      paidRcvd < data.totalOutStgAmt &&
      !(paidRcvd < 0)
    ) {
      addRecordPayment();
    } else if (paidRcvd > data.totalOutStgAmt) {
      setRequiredCondition(
        langFullData.enteredAmountCannotMoreThanOutstandingBalance
      );
    }
  };
  const addRecordPayment = (partyId) => {
    const addRecordData = {
      caId: clickId,
      partyId: JSON.parse(localStorage.getItem("partyId")),
      date: selectDate,
      comments: comments,
      paidRcvd: paidRcvd,
      paymentMode: paymentMode,
    };
    console.log(selectDate);
    postRecordPayment(addRecordData)
      .then((response) => {
        console.log(response.data.data);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
    navigate("/sellerledger");
    setIsOpen(false);
    localStorage.removeItem("partyId");
  };
  const clearData =()=>{
    while(sellerDetailed.length>0){
      sellerDetailed.pop();
    }
  }
 
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
      getLedgerSummaryByDate(clickId, partyId, fromDate, toDate)
        .then((response) => {
          console.log(response,"res")
          setSummaryByDate(response.data.data.ledgerSummary);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    else {
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
  }
  
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
  const closePopup = () => {
    $("#myModal").modal("hide");
  };
  return (
    <Fragment>
      <div>
      <div className="main_div_padding">
       {
         ledger.length > 0 ?  <div className="row">
         <div className="col-lg-4 p-0">
           <div id="search-field">
             <form className="d-flex">
               <input
                 className="form-control me-2"
                 id="searchbar"
                 type="search"
                 placeholder={langFullData.searchByNameShortCode}
                 onChange={(e) => {
                   searchInput(e.target.value);
                 }}
               />
             </form>
             <div className="searchicon">
               <img src={search_img} alt="search" />
             </div>
           </div>
           <div className="table-scroll" id="scroll_style">
             <table className="table table-fixed ledger-table">
               <thead className="theadr-tag">
                 <tr>
                   <th scope="col">#</th>
                   <th scope="col">{langFullData.date}</th>
                   <th scope="col">{langFullData.sellerName}</th>
                   <th scope="col">{langFullData.toBePaid}(&#8377;)</th>
                 </tr>
               </thead>
               <tbody>
                 {search.length > 1
                   ? ledgersData.map((item, index) => {
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
                                     {!item.trader ? "Seller" : "Trader"} -{" "}
                                     {item.partyId}&nbsp;
                                   </p>
                                   <p className="mobilee-tag">{item.mobile}</p>
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
                                   ? item.tobePaidRcvd.toFixed(2)
                                   : 0}
                               </p>
                             </td>
                           </tr>
                         </Fragment>
                       );
                     })
                   : ledger.map((item, index) => {
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
                                     {!item.trader ? "Seller" : "Trader"} -{" "}
                                     {item.partyId}&nbsp;
                                   </p>
                                   <p className="mobilee-tag">{item.mobile}</p>
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
                                   ? item.tobePaidRcvd.toFixed(2)
                                   : 0}
                               </p>
                             </td>
                           </tr>
                         </Fragment>
                       );
                     })}
               </tbody>
             </table>
             <div
               id="search-no-data"
               style={{
                 display: valueActive && search.length > 0 ? "block" : "none",
               }}
             >
                <NoDataAvailable />
             </div>
           </div>
           <div className="outstanding-pay d-flex align-items-center justify-content-between">
             <p className="pat-tag">{langFullData.outstandingPayables}:</p>
             <p className="values-tag">
               &#8377;
               {data.totalOutStgAmt ? data.totalOutStgAmt.toFixed(2) : 0}
             </p>
           </div>
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
                 Add Record
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
                          <img src={date_icon} alt="icon" className="mr-2 date_icon_in_custom" />{dateValue}
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
                         partyId = JSON.parse(localStorage.getItem("partyId"));
                         if (item.partyId == partyId) {
                           return (
                             <Fragment>
                               <div className="profilers-details" key={index}>
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
                                       {!item.trader ? langFullData.seller : langFullData.trader} -{" "}
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
                       <p className="coloring">
                         &#8377;
                         {summaryData.totalTobePaidRcvd
                           ? summaryData.totalTobePaidRcvd.toFixed(2)
                           : 0}
                       </p>
                     </p>
                   </div>
                   <div className="col-lg-3" id="verticalLines">
                     <p className="total-paid">
                       {langFullData.totalPaid}
                       <p className="coloring">
                         &#8377;
                         {summaryData.totalRcvdPaid
                           ? summaryData.totalRcvdPaid.toFixed(2)
                           : 0}
                       </p>
                     </p>
                   </div>
                   <div className="col-lg-3 d-flex align-items-center">
                     <p className="out-standing">
                       {langFullData.outstandingPayables}
                       <p className="coloring">
                         &#8377;
                         {summaryData.outStdRcvPayble
                           ? summaryData.outStdRcvPayble.toFixed(2)
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
                         <th className="col-2">{langFullData.refId} | {langFullData.date}</th>
                         <th className="col-3">{langFullData.paid}(&#8377;)</th>
                         <th className="col-3">{langFullData.toBePaid}(&#8377;)</th>
                         <th className="col-3">{langFullData.ledgerBalance}(&#8377;)</th>
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
                                 <p>{moment(item.date).format("DD-MMM-YY")}</p>
                               </td>
                               <td className="col-3">
                                 <p id="p-common">
                                   {item.paidRcvd
                                     ? item.paidRcvd.toFixed(2)
                                     : 0}
                                 </p>
                               </td>
                               <td className="col-3">
                                 <p id="p-common">
                                   {item.tobePaidRcvd
                                     ? item.tobePaidRcvd.toFixed(2)
                                     : 0}
                                 </p>
                               </td>
                               <td className="col-3">
                                 <p className="coloring" id="p-common">
                                   {item.balance ? item.balance.toFixed(2) : 0}
                                 </p>
                               </td>
                             </tr>
                           );
                         })
                       ) : (
                         <p style={{ fontSize: "20px" }}>No Data Available!</p>
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
                         <th className="col-2">{langFullData.refId} | {langFullData.date}</th>
                         <th className="col-3">
                           <p>{langFullData.item}</p>
                           <p>{langFullData.unitKgsRate}</p>
                         </th>
                         <th className="col-2">{langFullData.paid}(&#8377;)</th>
                         <th className="col-2">{langFullData.toBePaid}(&#8377;)</th>
                         <th className="col-2">{langFullData.ledgerBalance}(&#8377;)</th>
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
                                 <p>{moment(item.date).format("DD-MMM-YY")}</p>
                               </td>
                               <td className="col-3">
                                 <p style={{ fontSize: "12px" }}>
                                   {item.itemName}
                                 </p>
                                 <span style={{ fontSize: "13px" }}>
                                   {item.qty ? item.qty.toFixed(1) : 0}{" "}
                                   {(item.unit !== null ? item.unit : "")
                                     .charAt(item)
                                     .toUpperCase()}
                                   &nbsp;|&nbsp;{item.kg ? item.kg : 0}
                                   &nbsp;|&nbsp;{item.rate ? item.rate : 0}
                                 </span>
                               </td>
                               <td className="col-2">
                                 <p>
                                   {item.recieved
                                     ? item.recieved.toFixed(2)
                                     : 0}
                                 </p>
                               </td>
                               <td className="col-2">
                                 <p id="p-common">
                                   {item.toBeRecieved
                                     ? item.toBeRecieved.toFixed(2)
                                     : 0}
                                 </p>
                               </td>
                               <td className="col-2">
                                 <span className="coloring" id="p-common">
                                   {item.balance ? item.balance.toFixed(2) : 0}
                                 </span>
                               </td>
                             </tr>
                           );
                         })
                       ) : (
                         <p style={{ fontSize: "20px" }}>No Data Available!</p>
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
                  {ledgerSummaryByDate.length>0 && ledgerSummaryByDate !==null ? (
                   <table className="table table-bordered ledger-table">
                     {/*ledger-table*/}
                     <thead className="thead-tag">
                       <tr>
                         <th className="col-1" id="sno">
                           #
                         </th>
                         <th className="col-2">{langFullData.refId} | {langFullData.date}</th>
                         <th className="col-3">{langFullData.paid}(&#8377;)</th>
                         <th className="col-3">{langFullData.toBePaid}(&#8377;)</th>
                         <th className="col-3">{langFullData.ledgerBalance}(&#8377;)</th>
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
                                 <p>{moment(item.date).format("DD-MMM-YY")}</p>
                               </td>
                               <td className="col-3">
                                 <p id="p-common">
                                   {item.paidRcvd
                                     ? item.paidRcvd.toFixed(2)
                                     : ''}
                                 </p>
                               </td>
                               <td className="col-3">
                                 <p id="p-common">
                                   {item.tobePaidRcvd
                                     ? item.tobePaidRcvd.toFixed(2)
                                     : ''}
                                 </p>
                               </td>
                               <td className="col-3">
                                 <p className="coloring" id="p-common">
                                   {item.balance ? item.balance.toFixed(2) : ''}
                                 </p>
                               </td>
                             </tr>
                           );
                         })
                        }
                     </tbody>
                   </table>
                  ):(<NoDataAvailable />)
                  }
                 </div>
               </div>
             )}
             {sellerDetailed.length>0 &&
             toggleAC === "custom" && toggleState === "detailedledger" ?  (
               <div className="detailedLedger" id="scroll_style">
                 <div
                   id="detailed-ledger"
                   className={
                     toggleState === "detailedledger"
                       ? "content  active-content"
                       : "content"
                   }
                 >
                  {sellerDetailed.length>0 ? (
                   <table className="table table-bordered ledger-table">
                     <thead className="thead-tag">
                       <tr>
                         <th className="col-1" id="sno">
                           #
                         </th>
                         <th className="col-2">{langFullData.refId} | {langFullData.date}</th>
                         <th className="col-3">
                           <p>{langFullData.item}</p>
                           <p>{langFullData.unitKgsRate}</p>
                         </th>
                         <th className="col-2">{langFullData.paid}(&#8377;)</th>
                         <th className="col-2">{langFullData.toBePaid}(&#8377;)</th>
                         <th className="col-2">{langFullData.ledgerBalance}(&#8377;)</th>
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
                                   {item.qty ? item.qty.toFixed(1) : 0}{" "}
                                   {(item.unit ? item.unit : "")
                                     .charAt(item)
                                     .toUpperCase()}
                                   &nbsp;|&nbsp;{item.kg ? item.kg : 0}
                                   &nbsp;|&nbsp;{item.rate ? item.rate : 0}
                                 </span>
                               </td>
                               <td className="col-3">
                                 <p id="p-common">
                                   {item.recieved
                                     ? item.recieved.toFixed(2)
                                     : 0}
                                 </p>
                               </td>
                               <td className="col-3">
                                 <p id="p-common">
                                   {item.toBeRecieved
                                     ? item.toBeRecieved.toFixed(2)
                                     : 0}
                                 </p>
                               </td>
                               <td className="col-3">
                                 <p className="coloring" id="p-common">
                                   {item.balance ? item.balance.toFixed(2) : 0}
                                 </p>
                               </td>
                             </tr>
                           );
                         }
                       )}
                     </tbody>
                   </table>
                  ):(<NoDataAvailable />)
                  }
                 </div>
               </div>
             ):(<NoDataAvailable />)
             }
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
                         <div className="card-body" id="details-tag">
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
                                           {!item.trader ? "Trans" : "Trader"}{" "}
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
                           <span className="card-text" id="date-tag">
                             <ReactDatePicker
                               className="date_picker_in_modal"
                               selected={selectDate}
                               onChange={(date) => {
                                 setSelectDate(date);
                               }}
                               dateFormat="dd-MMM-yy"
                               maxDate={new Date()}
                               placeholder="Date"
                               showMonthYearDropdown={true}
                               scrollableMonthYearDropdown
                               required
                               style={{
                                 width: "400px",
                                 cursor: "pointer",
                                 right: "300px",
                                 marginTop: "30px",
                                 fontFamily: "Manrope",
                                 fontStyle: "normal",
                                 fontWeight: "600",
                                 fontSize: "15px",
                                 lineHeight: "18px",
                               }}
                             ></ReactDatePicker>
                             <img
                               className="date_icon_in_modal"
                               src={date_icon}
                             />
                           </span>
                         </div>
                       </div>
                       <div id="out-paybles">
                         <p id="p-tag">{langFullData.outstandingPayables}</p>
                         <p id="recieve-tag">
                           &#8377;
                           {data.totalOutStgAmt
                             ? data.totalOutStgAmt.toFixed(2)
                             : 0}
                         </p>
                       </div>
                       <div className="form-group" id="input_in_modal">
                         <label hmtlFor="amtRecieved" id="amt-tag">
                           {langFullData.amount}
                         </label>
                         <input
                           className="form-cont"
                           id="amtRecieved"
                           required
                           onChange={(e) => {
                             setPaidRcvd(e.target.value);
                           }}
                         />
                         <p className="text-valid">{requiredCondition}</p>
                       </div>
                       <div id="radios_in_modal">
                         <p className="payment-tag">{langFullData.paymentMode}</p>
                         <div className="form-check form-check-inline">
                           <input
                             className="form-check-input"
                             type="radio"
                             name="radio"
                             id="inlineRadio1"
                             value="CASH"
                             onChange={(e) => setPaymentMode(e.target.value)}
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
                             className="form-check-input"
                             type="radio"
                             name="radio"
                             id="inlineRadio2"
                             value="UPI"
                             onChange={(e) => setPaymentMode(e.target.value)}
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
                             className="form-check-input"
                             type="radio"
                             name="radio"
                             id="inlineRadio3"
                             value="NEFT"
                             onChange={(e) => setPaymentMode(e.target.value)}
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
                             className="form-check-input"
                             type="radio"
                             name="radio"
                             id="inlineRadio4"
                             value="RTGS"
                             onChange={(e) => setPaymentMode(e.target.value)}
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
                             className="form-check-input"
                             type="radio"
                             name="radio"
                             id="inlineRadio5"
                             value="IMPS"
                             onChange={(e) => setPaymentMode(e.target.value)}
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
         </div>
       </div> : <NoDataAvailable />
       }
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
        <div className="modal fade" id="datePopupmodal">
          <div className="modal-dialog modal-dialog-centered date_modal_dialog">
            <div className="modal-content">
              <div className="modal-header date_modal_header">
                <h5 className="modal-title header2_text" id="staticBackdropLabel">
                  Select Dates
                </h5>
                <img
                  src={close}
                  alt="image"
                  className="close_icon"
                  data-bs-dismiss="modal"
                />
              </div>
              <div className="modal-body date_modal_mody">
                <div className="calender_popup">
                  <div className="row">
                    <div className="dates_div">
                      <div className="flex_class">
                        <input type="radio" id="tab1" name="tab" defaultChecked />
                        <label htmlFor="tab1">Daily</label>
                      </div>
                      <div className="flex_class">
                        <input type="radio" id="tab2" name="tab" />
                        <label htmlFor="tab2">Monthly</label>
                      </div>
                      <div className="flex_class">
                        {" "}
                        <input type="radio" id="tab3" name="tab" />
                        <label htmlFor="tab3">Yearly</label>
                      </div>
                      <div className="flex_class">
                        <input type="radio" id="tab4" name="tab" />
                        <label htmlFor="tab4">Weekly</label>
                      </div>
                      <div className="flex_class">
                        <input type="radio" id="tab5" name="tab" />
                        <label htmlFor="tab5">Custom</label>
                      </div>
                    </div>
                    <article className="date_picker">
                      <DatePicker
                        dateFormat="yyyy-MM-dd"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        className="form-control"
                        placeholder="Date"
                        maxDate={new Date()}
                        inline
                      />
                    </article>
                    <article className="month_picker">
                      <DatePicker
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        showFullMonthYearPicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        className="form-control"
                        placeholder="Date"
                        maxDate={new Date()}
                        showThreeColumnMonthYearPicker
                        inline
                      />
                    </article>
                    <article>
                      <h2>
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          showYearPicker
                          dateFormat="yyyy"
                          className="form-control"
                          maxDate={new Date()}
                          inline
                          // showThreeColumnYearPicker
                          yearItemNumber={9}
                        />
                      </h2>
                    </article>
                    <article className="week_picker">
                      {/* <WeeklyCalendar
                        onWeekPick={handleWeekPick}
                        max={moment().format("DD-MM-YYYY")}
                      /> */}
                    </article>
                    <article className="custom_picker">
                      <div className="flex_class custom_input_div">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          popperClassName="d-none"
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Select from date"
                        />
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          popperClassName="d-none"
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Select to date"
                        />
                      </div>

                      <DatePicker
                        selected={startDate}
                        onChange={onChangeDate}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        inline
                        maxDate={new Date()}
                      />
                    </article>
                  </div>
                </div>
              </div>
              {/* <div className="modal-footer">
                <button
                  type="button"
                  className="secondary_btn"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="primary_btn"
                  // onClick={() => postPreference()}
                  data-bs-dismiss="modal"
                >
                  Next
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SellerLedger;
