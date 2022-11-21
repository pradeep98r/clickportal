import React from "react";
import { useState } from "react";
import { Fragment } from "react";
import search_img from "../../assets/images/search.svg";
import "../../modules/ledgers/buyerLedger.scss";
import close from "../../assets/images/close.svg";
import {
  getBuyerDetailedLedger,
  getBuyerLedgers,
  getDetailedLedgerByDate,
  getLedgerSummary,
  getLedgerSummaryByDate,
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
const BuyerLedger = () => {
  const [search, setSearch] = useState("");
  const [openTabs, setOpenTabs] = useState(false);
  const [ledger, setLedgeres] = useState([]);
  const [data, setData] = useState({});
  const [error, setError] = useState();
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const [ledgerSummary, setSummary] = useState([{}]);
  const [summaryData, setSummaryData] = useState({}, ledgerSummary);
  const [details, setDetails] = useState([{}]);
  //const [detailedData, setDetailedData] = useState({}, details);

  const [open, setIsOpen] = useState(false);
  const [selectDate, setSelectDate] = useState(new Date());
  const [paidRcvd, setPaidRcvd] = useState(0);
  const [comments, setComments] = useState(" ");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [dateDisplay, setDateDisplay] = useState(false);

  const [ledgerSummaryByDate, setSummaryByDate] = useState([{}]);
  //const [summaryDataByDate, setSummaryDataByDate] = useState({}, ledgerSummaryByDate);
  const [detailsByDate, setDetailsByDate] = useState([{}]);
  //const [detailedDataByDate, setDetailedDataByDate] = useState({}, detailsByDate);
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
      console.log(type);
      setDateDisplay(!dateDisplay);
      setToggleState("ledgersummary")
    } else if (type === "all") {
      setDateDisplay(false);
    }
  };

  let partyId = 0;
  let fromDate = null;
  let toDate = null;
  //Fetch ledger by party Type
  useEffect(() => {
    fetchBuyerLedger();
  }, [clickId]);
  const fetchBuyerLedger = () => {
    getBuyerLedgers(clickId)
      .then((response) => {
        setData(response.data.data);
        setLedgeres(response.data.data.ledgers);
        console(response.data.data, "Buyer Details");
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
        getBuyerLedgerSummary(clickId, id);
        fetchBuyerLedgerDetails(clickId, id);
        return item.partyId;
        //navigate("ledgerSummary");
      } else {
        return <p>Not Found</p>;
      }
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
  //Convert standard date to date
  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  //Add Record payment
  const [requiredCondition, setRequiredCondition] = useState("");
  const onSubmitRecordPayment = () => {
    if (paidRcvd < 0) {
      setRequiredCondition("Amount Recieved Cannot be negative");
    } else if (parseInt(paidRcvd) === 0) {
      setRequiredCondition("Amount Received cannot be empty");
    } else if (isNaN(paidRcvd)) {
      setRequiredCondition("Invalid Amount");
    }
    else if (paidRcvd.trim().length !== 0 && paidRcvd != 0
      && paidRcvd < data.totalOutStgAmt && !(paidRcvd < 0)) {
      addRecordPayment();
    }
    else if (paidRcvd > data.totalOutStgAmt) {
      setRequiredCondition("Entered Amount  cannot more than Outstanding Balance");
    }

  }
  const addRecordPayment = (partyId) => {
    const addRecordData = {
      caId: clickId,
      partyId: JSON.parse(localStorage.getItem("partyId")),
      date: convert(selectDate),
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
    navigate("/buyerledger");
    setIsOpen(false);
    localStorage.removeItem("partyId");
  };
  //Fetch Ledger Summary By Date
  const fetchLedgerSummaryByDate = (clickId, partyId, fromDate, toDate) => {
    console.log(fromDate, toDate);
    getLedgerSummaryByDate(clickId, partyId, fromDate, toDate)
      .then((response) => {
        //setSummaryDataByDate(response.data.data);
        setSummaryByDate(response.data.data.ledgerSummary);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchDetailedLedgerByDate = (clickId, partyId, fromDate, toDate) => {
    getDetailedLedgerByDate(clickId, partyId, fromDate, toDate)
      .then((response) => {
        setDetailsByDate(response.data.data.details);
        //setDetailedDataByDate(response.data.data)
      })
      .catch((error) => {
        setError(error);
        console.log(error.message);
      });
  };
  //Date Range Select
  $("[name=tab]").each(function (i, d) {
    var p = $(this).prop("checked");
    if (p) {
      $("article").eq(i).addClass("on");
    }
  });
  $("[name=tab]").on("change", function () {
    var p = $(this).prop("checked");

    // $(type).index(this) == nth-of-type
    var i = $("[name=tab]").index(this);

    $("article").removeClass("on");
    $("article").eq(i).addClass("on");
  });

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const onChangeDate = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleWeekPick = (startDate, endDate) => {
    console.log(`${startDate} to ${endDate}`);
  };
  const DateModal = () => {
    $("#datePopupmodal").modal("show");
  };
  const getDate = () => {
    fromDate = convert(startDate);
    toDate = convert(endDate);
    localStorage.setItem("fromDate", JSON.stringify(fromDate));
    localStorage.setItem("toDate", JSON.stringify(toDate));
    fetchLedgerSummaryByDate(clickId, partyId, fromDate, toDate);
    fetchDetailedLedgerByDate(clickId, partyId, fromDate, toDate);
    $("#datePopupmodal").modal("hide");
    setIsOpen(false);
  };
  const [ledgersData, setLedgersData] = useState([]);
  const [valueActive, setIsValueActive] = useState(false);
  //partyId = JSON.parse(localStorage.getItem("partyId"));
  const searchInput = (searchValue) => {
    setSearch(searchValue);
    if (search !== "") {
      console.log(search);
      const filterdNames = ledger.filter(item => {
        if (item.partyName.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.shortName.toLowerCase().includes(searchValue.toLowerCase())) {
          return (
            item.partyName.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.shortName.toLowerCase().includes(searchValue.toLowerCase())
          )
        }
        else if (search == "" || searchValue === "") {
          return setIsValueActive(false);
        }
        else {
          return setIsValueActive(true);
        }
      })
      setLedgersData(filterdNames);
      console.log(filterdNames, "filteredNames");
    } else {
      setLedgersData(ledger);
    }
  }
  const closePopup = () => {
    $("#myModal").modal("hide");
  };
  return (
    <Fragment>
      <div className="main_div_padding">
        <div class="row">
          <div class="col-lg-4 p-0">
            <div id="search-field">
              <form class="d-flex">
                <input class="form-control me-2" id="searchbar" type="search" placeholder='Search by Name / Short Code'
                  onChange={(e) => { searchInput(e.target.value) }} />
              </form>
              <div className='searchicon'><img src={search_img} alt="search" /></div>
            </div>
            <div className="table-scroll" id="scroll_style">
              <table class="table table-fixed" className="ledger-table">
                <thead className="theadr-tag">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Date</th>
                    <th scope="col">Buyer Name</th>
                    <th scope="col">To Be Recieved(&#8377;)</th>
                  </tr>
                </thead>
                <tbody>
                  {search.length > 1 ? (
                    ledgersData.map((item, index) => {
                      return (
                        <Fragment>
                          <tr
                            onClick={(id, indexs) => {
                              particularLedger(item.partyId, index);
                            }}
                            className={
                              isActive === index ? "tabRowSelected" : "tr-tags"
                            }
                          >
                            <td scope="row">{index + 1}</td>
                            <td key={item.date}>
                              {moment(item.date).format("DD-MMM-YY")}
                            </td>
                            <td key={item.partyName}>
                              <div className="d-flex">
                                <div class="c-img">
                                  {item.profilePic ? (
                                    <img className="profile-img" src={item.profilePic} alt="pref-img" />
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
                                  <p className="mobilee-tag">{!item.trader ? "Buyer" : "Trader"} - {item.partyId}&nbsp;</p>
                                  <p className="mobilee-tag">{item.mobile}</p>
                                  <p className="address-tag">
                                    {item.partyAddress ? item.partyAddress : ""}
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
                  ) : (
                    ledger.map((item, index) => {
                      return (
                        <Fragment>
                          <tr
                            onClick={(id, indexs) => {
                              particularLedger(item.partyId, index);
                            }}
                            className={
                              isActive === index ? "tabRowSelected" : "tr-tags"
                            }
                          >
                            <td scope="row">{index + 1}</td>
                            <td key={item.date}>
                              {moment(item.date).format("DD-MMM-YY")}
                            </td>
                            <td key={item.partyName}>
                              <div className="d-flex">
                                <div class="c-img">
                                  {item.profilePic ? (
                                    <img className="profile-img" src={item.profilePic} alt="pref-img" />
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
                                  <p className="mobilee-tag">{!item.trader ? "Buyer" : "Trader"} - {item.partyId}&nbsp;</p>
                                  <p className="mobilee-tag">{item.mobile}</p>
                                  <p className="address-tag">
                                    {item.partyAddress ? item.partyAddress : ""}
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
                  )
                  }
                </tbody>
              </table>
              <div id="search-no-data" style={{ display: valueActive && search.length > 0 ? "block" : "none" }}><p>No Data Found</p></div>
            </div>
            <div className="outstanding-pay d-flex align-items-center justify-content-between">
              <p className="pat-tag">Outstanding Recievables:</p>
              <p className="values-tag">
                &#8377;
                {data.totalOutStgAmt ? data.totalOutStgAmt.toFixed(2) : 0}
              </p>
            </div>
          </div>
          <div class="col-lg-8">
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
                <button
                  className={toggleAC === "all" ? "tabers active-tab" : "tabers"}
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
                <div id="horizontal-lines-tag"></div>
                <div
                  className="dateRangePicker"
                  style={{ display: dateDisplay ? "block" : "none" }}
                >
                  <div className="flex">
                    <div onClick={DateModal} id="date_range_picker">
                      <img id="date_icon" src={date_icon} />
                    </div>
                  </div>
                  <div className="modal fade" id="datePopupmodal">
                    <div className="modal-dialog modal-dialog-centered date_modal_dialog">
                      <div className="modal-content">
                        <div className="modal-header date_modal_header">
                          <h5
                            className="modal-title header2_text"
                            id="staticBackdropLabel"
                          >
                            Select Dates
                          </h5>
                          <img
                            src={close_btn}
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
                                  <input
                                    type="radio"
                                    id="tab1"
                                    name="tab"
                                    defaultChecked
                                  />
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
                                <ReactDatePicker
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
                                <ReactDatePicker
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
                                  <ReactDatePicker
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
                                  <ReactDatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    popperClassName="d-none"
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Select from date"
                                  />
                                  <ReactDatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    popperClassName="d-none"
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Select to date"
                                  />
                                </div>
                                <ReactDatePicker
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
                          <button className="continue-btn" onClick={getDate}>
                            CONTINUE
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card" className="details-tag">
                <div class="card-body" id="card-details">
                  <div className="row">
                    {isActive !== -1 &&
                      <div className="col-lg-3" id="verticalLines">
                        {ledger.map((item, index) => {
                          partyId = JSON.parse(localStorage.getItem('partyId'));
                          if (item.partyId == partyId) {
                            return (
                              <Fragment>
                                <div
                                  className="profilers-details"
                                  key={index}
                                >
                                  <div class="d-flex">
                                    <div>
                                      {item.profilePic ? (
                                        <img id="singles-img" src={item.profilePic} alt="buy-img" />
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
                                      <p className="mobilee-tag">{!item.trader ? "Buyer" : "Trader"} - {item.partyId}&nbsp;</p>
                                      <p className="mobilee-tag">{item.mobile}</p>
                                      <p className="address-tag">
                                        {item.partyAddress ? item.partyAddress : ""}
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
                    }
                    <div className="col-lg-3" id="verticalLines">
                      <p class="card-text" className="paid">
                        Total Business
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
                        Total Paid
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
                        Outstanding Recievables
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
                    <table class="table table-bordered ledger-table">{/*ledger-table*/}
                      <thead className="thead-tag">
                        <tr>
                          <th className="col-1" id="sno">#</th>
                          <th className="col-2">RefId | Date</th>
                          <th className="col-3">Received(&#8377;)</th>
                          <th className="col-3">To Be Received(&#8377;)</th>
                          <th className="col-3">Ledger Balance(&#8377;)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ledgerSummary.length > 0 ? (
                          ledgerSummary.map((item, index) => {
                            return (
                              <tr className="tr-tags" scope="row" kery={item.partyId}>
                                <td className="col-1"><p id="p-common-sno">{index + 1}</p></td>
                                <td className="col-2">
                                  <p style={{ color: "#0066FF" }}>
                                    {item.refId}
                                  </p>
                                  <p>{moment(item.date).format("DD-MMM-YY")}</p>
                                </td>
                                <td className="col-3">
                                  <p id="p-common">{item.paidRcvd ? item.paidRcvd.toFixed(2) : 0}</p>
                                </td>
                                <td className="col-3">
                                  <p id="p-common">{item.tobePaidRcvd
                                    ? item.tobePaidRcvd.toFixed(2)
                                    : 0}</p>
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
                    <table class="table table-bordered ledger-table" id="ledger-sum">
                      <thead className="thead-tag">
                        <tr>
                          <th class="col-1" id="sno">#</th>
                          <th class="col-2">RefId | Date</th>
                          <th class="col-3">
                            <p>Item</p>
                            <p> Unit | Kgs | Rate</p>
                          </th>
                          <th class="col-2">Recieved(&#8377;)</th>
                          <th class="col-2">To Be Recieved(&#8377;)</th>
                          <th class="col-2">Ledger Balance(&#8377;)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.length > 0 ? (
                          details.map((item, index) => {
                            return (
                              <tr className="tr-tags" key={item.partyId}>
                                <td class="col-1" id="p-common-sno">{index + 1}</td>
                                <td class="col-2">
                                  <p style={{ color: "#0066FF" }}>
                                    {item.refId}
                                  </p>
                                  <p>{moment(item.date).format("DD-MMM-YY")}</p>
                                </td>
                                <td class="col-3">
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
                                  <p id="p-common"
                                  >{item.recieved ? item.recieved.toFixed(2) : 0}</p>
                                </td>
                                <td class="col-2">
                                  <p id="p-common">{item.toBeRecieved
                                    ? item.toBeRecieved.toFixed(2)
                                    : 0}</p>
                                </td>
                                <td className="col-2">
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
                    <table class="table table-bordered ledger-table">{/*ledger-table*/}
                      <thead className="thead-tag">
                        <tr>
                          <th className="col-1" id="sno">#</th>
                          <th className="col-2">RefId | Date</th>
                          <th className="col-3">Received(&#8377;)</th>
                          <th className="col-3">To Be Received(&#8377;)</th>
                          <th className="col-3">Ledger Balance(&#8377;)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ledgerSummaryByDate.length > 0 ? (
                          ledgerSummaryByDate.map((item, index) => {
                            return (
                              <tr className="tr-tags" scope="row" kery={item.partyId}>
                                <td className="col-1"><p id="p-common-sno">{index + 1}</p></td>
                                <td className="col-2">
                                  <p style={{ color: "#0066FF" }}>
                                    {item.refId}
                                  </p>
                                  <p>{moment(item.date).format("DD-MMM-YY")}</p>
                                </td>
                                <td className="col-3">
                                  <p id="p-common">{item.paidRcvd ? item.paidRcvd.toFixed(2) : 0}</p>
                                </td>
                                <td className="col-3">
                                  <p id="p-common">{item.tobePaidRcvd
                                    ? item.tobePaidRcvd.toFixed(2)
                                    : 0}</p>
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
              {toggleAC === "custom" && toggleState === "detailedledger" && (
                <div className="detailedLedger" id="scroll_style">
                  <div
                    id="detailed-ledger"
                    className={
                      toggleState === "detailedledger"
                        ? "content  active-content"
                        : "content"
                    }
                  >
                    <table class="table table-bordered ledger-table">
                      <thead className="thead-tag">
                        <tr>
                          <th class="col-1" id="sno">#</th>
                          <th class="col-2">RefId | Date</th>
                          <th class="col-3">
                            <p>Item</p>
                            <p> Unit | Kgs | Rate</p>
                          </th>
                          <th class="col-2">Recieved(&#8377;)</th>
                          <th class="col-2">To Be Recieved(&#8377;)</th>
                          <th class="col-2">Ledger Balance(&#8377;)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailsByDate.length > 0 ? (
                          detailsByDate.map((item, index) => {
                            return (
                              <tr className="tr-tags" key={item.partyId}>
                                <td class="col-1" id="p-common-sno">{index + 1}</td>
                                <td class="col-2">
                                  <p style={{ color: "#0066FF" }}>
                                    {item.refId ? item.refId : ""}
                                  </p>{" "}
                                  {moment(item.date).format("DD-MMM-YY")}
                                </td>
                                <td class="col-3">
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
                                <td class="col-3">
                                  <p id="p-common">{item.recieved ? item.recieved.toFixed(2) : 0}</p>
                                </td>
                                <td class="col-3">
                                  <p id="p-common">{item.toBeRecieved
                                    ? item.toBeRecieved.toFixed(2)
                                    : 0}</p>
                                </td>
                                <td class="col-3">
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
              <div className="modal fade" id="myModal">
                <div className="modal-dialog transporter_modal modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title header2_text" id="staticBackdropLabel">
                        Add Record Payment
                      </h5>
                      <img
                        src={close}
                        alt="image"
                        className="close_icon"
                        onClick={closePopup}
                      />
                    </div>
                    <div className="modal-body transporter_model_body" id="scroll_style">
                      <form>
                        <div className="card">
                          <div className="card-body" id="details-tag">
                            {
                              ledger.map((item, index) => {
                                if (item.partyId == partyId) {
                                  return (
                                    <Fragment>
                                      <div
                                        className="profile-details"
                                        key={item.partyName}
                                      >
                                        <div class="d-flex">
                                          <div>
                                            {item.profilePic ? (
                                              <img id="singles-img" src={item.profilePic} alt="buy-img" />
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
                                            <p className="mobilee-tag">{!item.trader ? "Trans" : "Trader"} - {item.partyId}&nbsp;|&nbsp;{item.mobile}</p>
                                            <p className="addres-tag">
                                              {item.partyAddress ? item.partyAddress : ""}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </Fragment>
                                  )
                                }
                              })
                            }
                            <span class="card-text" id="date-tag">
                              <ReactDatePicker className='date_picker_in_modal'
                                selected={selectDate}
                                onChange={date => { setSelectDate(date) }}
                                dateFormat='dd-MMM-yy'
                                maxDate={new Date()}
                                placeholder="Date"
                                showMonthYearDropdown={true}
                                scrollableMonthYearDropdown
                                required
                                style=
                                {{
                                  width: "400px",
                                  cursor: "pointer",
                                  right: "300px",
                                  marginTop: "30px",
                                  fontFamily: 'Manrope',
                                  fontStyle: "normal",
                                  fontWeight: "600",
                                  fontSize: "15px",
                                  lineHeight: "18px"
                                }}
                              >
                              </ReactDatePicker>
                              <img className="date_icon_in_modal" src={date_icon} />
                            </span>
                          </div>
                        </div>
                        <div id="out-paybles">
                          <p id='p-tag'>Outstanding Paybles</p>
                          <p id="recieve-tag">&#8377;{data.totalOutStgAmt ? data.totalOutStgAmt.toFixed(2) : 0}</p>
                        </div>
                        <div class="form-group" id="input_in_modal">
                          <label hmtlFor="amtRecieved" id="amt-tag">Amount</label>
                          <input class="form-cont" id="amtRecieved" required
                            onChange={(e) => { setPaidRcvd(e.target.value) }} />
                          <p className="text-valid">{requiredCondition}</p>
                        </div>
                        <div id="radios_in_modal">
                          <p className='payment-tag'>Payment Mode</p>
                          <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="radio" id="inlineRadio1" value="CASH"
                              onChange={(e) => setPaymentMode(e.target.value)} checked={paymentMode === 'CASH'} required />
                            <label class="form-check-label" for="inlineRadio1">CASH</label>
                          </div>
                          <div class="form-check form-check-inline" id="radio-btn-in_modal">
                            <input class="form-check-input" type="radio" name="radio" id="inlineRadio2" value="UPI"
                              onChange={(e) => setPaymentMode(e.target.value)} checked={paymentMode === 'UPI'} required />
                            <label class="form-check-label" for="inlineRadio2">UPI</label>
                          </div>
                          <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="radio" id="inlineRadio3" value="NEFT"
                              onChange={(e) => setPaymentMode(e.target.value)} checked={paymentMode === 'NEFT'} required />
                            <label class="form-check-label" for="inlineRadio3">NEFT</label>
                          </div>
                          <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="radio" id="inlineRadio4" value="RTGS"
                              onChange={(e) => setPaymentMode(e.target.value)} checked={paymentMode === 'RTGS'} required />
                            <label class="form-check-label" for="inlineRadio4">RTGS</label>
                          </div>
                          <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="radio" id="inlineRadio5" value="IMPS"
                              onChange={(e) => setPaymentMode(e.target.value)} checked={paymentMode === 'IMPS'} required />
                            <label class="form-check-label" for="inlineRadio5">IMPS</label>
                          </div>
                        </div>
                        <div id="comment_in_modal">
                          <div class="mb-3">
                            <label for="exampleFormControlTextarea1" class="form-label" id="comment-tag">Comment</label>
                            <textarea class="form-control" id="comments" rows="2" value={comments}
                              onChange={(e) => setComments(e.target.value)}></textarea>
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
      </div>

    </Fragment>
  );
};

export default BuyerLedger;
