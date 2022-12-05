import React, { Component, useState, useEffect } from "react";
import NoDataAvailable from "../../components/noDataAvailable";
import { getSmartboardData } from "../../actions/smartBoardService";
import OutlineButton from "../../components/outlineButton";
import { Link } from "react-router-dom";
import "../smartboard/smartboard.scss";
import single_bill from "../../assets/images/bills/single_bill.svg";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import date_icon from "../../assets/images/date_icon.svg";
import $ from "jquery";
import close from "../../assets/images/close.svg";
import "jquery-ui";
import "jquery-ui/ui/widgets/datepicker";
import NoDataText from "../../components/noDataText";
import loading from "../../assets/images/loading.gif";
import prev_icon from "../../assets/images/prev_icon.png";
import next_icon from "../../assets/images/next_icon.png";
import CompleteProfile from "./completeprofile";
import Modal from "react-modal/lib/components/Modal";
const SmartBoard = () => {
  const [tabType, setTabType] = useState("Daily");
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const [smartboardData, setSmartboardData] = useState({});
  const [outStandingBal, setOutStandingBal] = useState({});
  const [salesReprtData, setsalesReprtData] = useState({});
  const [purchaseReprtData, setpurchaseReprtData] = useState({});
  const [sellRecentTxs, setsellRecentTxs] = useState([]);
  const [buyRecentTxs, setbuyRecentTxs] = useState([]);
  const [buyerData, setbuyerData] = useState([]);
  const [farmerData, setfarmerData] = useState([]);
  const [cropSalesData, setcropSalesData] = useState([]);
  const [cropPurchaseData, setcropPurchaseData] = useState([]);
  const [commissionEarns, setcommissionEarns] = useState({});
  const [isLoading, setLoading] = useState(true);

  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);

  const [weekFirstDate, setWeekFirstDate] = useState(
    moment(new Date()).format("YYYY-MMM-DD")
  );
  const [weekLastDate, setWeekLastDate] = useState(
    moment(new Date()).format("YYYY-MMM-DD")
  );
  const [weekStartDate, setweekStartDate] = useState(
    moment(new Date()).format("DD-MMM-YYYY")
  );
  const [weekEndDate, setweekEndDate] = useState(
    moment(new Date()).format("DD-MMM-YYYY")
  );
  $(function () {
    var startWeekDate = moment(new Date()).format("YYYY-MMM-DD");
    var endWeekDate = new Date();
    var selectCurrentWeek = function () {
      window.setTimeout(function () {
        $(".week-picker")
          .find(".ui-datepicker-current-day a")
          .addClass("ui-state-active");
      }, 1);
    };
    $(".week-picker").datepicker({
      maxDate: new Date(),
      showOtherMonths: true,
      selectOtherMonths: true,
      dateFormat: "dd-MM-yy",
      onSelect: function (dateText, inst) {
        var date = $(this).datepicker("getDate");
        startWeekDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() - date.getDay()
        );
        endWeekDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() - date.getDay() + 6
        );
        var dateFormat =
          inst.settings.dateFormat || $.datepicker._defaults.dateFormat;
        var weekFdate = moment(startWeekDate).format("YYYY-MMM-DD");
        var weekLdate = moment(endWeekDate).format("YYYY-MMM-DD");
        setWeekFirstDate(weekFdate);
        setWeekLastDate(weekLdate);
        setweekStartDate(moment(startWeekDate).format("DD-MMM-YYYY"));
        setweekEndDate(moment(endWeekDate).format("DD-MMM-YYYY"));
        $("#endWeekDate").text(
          $.datepicker.formatDate(dateFormat, endWeekDate, inst.settings)
        );

        selectCurrentWeek();
      },
      beforeShowDay: function (date) {
        var cssClass = "";
        if (date >= startWeekDate && date <= endWeekDate)
          cssClass = "ui-datepicker-current-day";
        return [true, cssClass];
      },
      onChangeMonthYear: function (year, month, inst) {
        selectCurrentWeek();
      },
    });
  });
  const links = [
    {
      id: 1,
      name: langFullData.daily,
      to: "Daily",
    },
    {
      id: 2,
      name: langFullData.weekly,
      to: "Weekly",
    },
    {
      id: 3,
      name: langFullData.monthly,
      to: "Monthly",
    },
    {
      id: 4,
      name: langFullData.yearly,
      to: "Yearly",
    },
  ];
  useEffect(() => {
    tabChange(tabType);
  }, []);
  const [cropItem, setCropItem] = useState(null);
  const [selectedDate, setStartDate] = useState(new Date());
  const [selectedMonthDate, setSelectedMonthDate] = useState(new Date());
  const [selectedYearDate, setSelectedyearDate] = useState(new Date());
  const partnerSelectDate = moment(selectedDate).format("DD-MMM-YYYY");
  const monthSelectDate = moment(selectedMonthDate).format("MMM yyyy");
  const yearSelectDate = moment(selectedYearDate).format("yyyy");
  var fromDate = "";
  var toDate = "";
  const tabChange = async (type) => {
    setTabType(type);

    if (type === "Daily") {
      fromDate = moment(selectedDate).format("YYYY-MM-DD");
      toDate = moment(selectedDate).format("YYYY-MM-DD");
      getSmartBoardResponse(type, fromDate, toDate);
    } else if (type === "Yearly") {
      const currentYear = selectedYearDate.getFullYear();
      const firstDay = new Date(currentYear, 0, 1);
      const lastDay = new Date(currentYear, 11, 31);
      fromDate = moment(firstDay).format("YYYY-MM-DD");
      toDate = moment(lastDay).format("YYYY-MM-DD");
      getSmartBoardResponse(type, fromDate, toDate);
    }
    else if (tabType == "Weekly") {
      fromDate = weekFirstDate;
      toDate = weekLastDate;
      getSmartBoardResponse(type, fromDate, toDate);
    }
    else{
      console.log(selectedMonthDate);
      var lastDay = new Date(
        selectedMonthDate.getFullYear(),
        selectedMonthDate.getMonth() + 1,
        0
      );
      var fromDate = moment(selectedMonthDate).format("YYYY-MM-DD");
      var toDate = moment(lastDay).format("YYYY-MM-DD")
      
      getSmartBoardResponse(type, fromDate, toDate);
    }
  };

  const car = {
    dots: false,
    nav: false,
    responsive: {
      1000: {
        items: 1,
      },
    },
  };

  const [buycropItem, setBuyCropItem] = useState(null);
  const cropOnclick = (crop) => {
    setCropItem(crop);
  };
  const buyCropOnclick = (crop) => {
    setBuyCropItem(crop);
  };
  const DateModalPopup = () => {
    $("#datePopupmodalPopup").modal("show");
  };
  const closePopup = () => {
    $("#datePopupmodalPopup").modal("hide");
  };
  const getDateValue = async (dateValue) => {
    var lastDay = new Date(
      dateValue.getFullYear(),
      dateValue.getMonth() + 1,
      0
    );
    var firstDate = moment(dateValue).format("YYYY-MM-DD");
    var lastDate = moment(lastDay).format("YYYY-MM-DD");
    if (tabType == "Daily") {
      lastDate = firstDate;
    } else if (tabType == "Yearly") {
      const currentYear = dateValue.getFullYear();
      const firstDay = new Date(currentYear, 0, 1);
      lastDay = new Date(currentYear, 11, 31);
      firstDate = moment(firstDay).format("YYYY-MM-DD");
      lastDate = moment(lastDay).format("YYYY-MM-DD");
    } else if (tabType == "Weekly") {
      firstDate = weekFirstDate;
      lastDate = weekLastDate;
    }
    closePopup();
    getSmartboardData(clickId, tabType, firstDate, lastDate)
      .then((response) => {
        const data = response.data.data;
        setSmartboardData(data);
        setOutStandingBal(data.outStandingBal);
        setsalesReprtData(data.salesReprtData);
        setpurchaseReprtData(data.purchaseReprtData);
        const arr = data.sellRecentTxs.slice(0, 2);
        setsellRecentTxs(arr);
        const buyTrans = data.buyRecentTxs.slice(0, 2);
        setbuyRecentTxs(buyTrans);
        setbuyerData(data.buyerData);
        setfarmerData(data.farmerData);
        setcropSalesData(data.cropSalesData);
        setcropPurchaseData(data.cropPurchaseData);
        setcommissionEarns(data.commissionEarns);
        setCropItem(data.cropSalesData[0]);
        setBuyCropItem(data.cropPurchaseData[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getSmartBoardResponse = (tabType, fromDate, toDate) => {
    getSmartboardData(clickId, tabType, fromDate, toDate)
      .then((response) => {
        console.log(response.data.data);
        const data = response.data.data;
        setSmartboardData(data);
        setOutStandingBal(data.outStandingBal);
        setsalesReprtData(data.salesReprtData);
        setpurchaseReprtData(data.purchaseReprtData);
        const arr = data.sellRecentTxs.slice(0, 2);
        setsellRecentTxs(arr);
        const buyTrans = data.buyRecentTxs.slice(0, 2);
        setbuyRecentTxs(buyTrans);
        setbuyerData(data.buyerData);
        setfarmerData(data.farmerData);
        setcropSalesData(data.cropSalesData);
        setcropPurchaseData(data.cropPurchaseData);
        setcommissionEarns(data.commissionEarns);
        setCropItem(data.cropSalesData[0]);
        setBuyCropItem(data.cropPurchaseData[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const onPrevDate = () => {
    var currentDate = selectedDate;
    var yesterdayDate = currentDate.setDate(currentDate.getDate() - 1);
    // var yDate = moment(+new Date(yesterdayDate)).format("YYYY-MM-DD");
    setStartDate(new Date(yesterdayDate));
    getDateValue(new Date(yesterdayDate));
  };
  const onNextDate = () => {
    var currentDate = selectedDate;
    if (
      moment(selectedDate).format("YYYY-MM-DD") !==
      moment(new Date()).format("YYYY-MM-DD")
    ) {
      var yesterdayDate = currentDate.setDate(currentDate.getDate() + 1);
      var yDate = moment(+new Date(yesterdayDate)).format("YYYY-MM-DD");
      setStartDate(new Date(yesterdayDate));
      getDateValue(new Date(yesterdayDate));
    }
  };
  const [showModal, setShowModal] = useState(false);
  const businessCreatedStatus =
    localStorage.getItem("businessCreatedStatus") != null
      ? localStorage.getItem("businessCreatedStatus")
      : "";
  const [showModalStatus, setShowModalStatus] = useState(false);
  const onClickProfiles = () => {
    setShowModal(true);
    setShowModalStatus(true);
    localStorage.removeItem("mandiEditStatus");
    localStorage.setItem("mandiEditStatus", false);
  };

  const handleLinks = (path)=>{
    console.log(path)
    if(path === '/sellbillbook'){
      localStorage.setItem("LinkId", 3);
      localStorage.setItem("LinkPath", "/sellbillbook");
    } else if(path === '/buy_bill_book'){
      localStorage.setItem("LinkId", 4);
      localStorage.setItem("LinkPath", "/buy_bill_book");
    } else if(path === '/buyerledger'){
      localStorage.setItem("LinkId", 5);
      localStorage.setItem("LinkPath", "/buyerledger");
    } else{
      localStorage.setItem("LinkId", 6);
      localStorage.setItem("LinkPath", "/sellerledger");
    }
  }
  return (
    <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
          {loginData.businessCreated === false &&
            businessCreatedStatus == "" ? (
            <div className="row">
              <div className="col-lg-9 smartboard_div p-0">
                <div className="complete_profile d-flex justify-content-between align-items-center">
                  <p>{langFullData.completeTheCompanySetup}</p>
                  <button onClick={onClickProfiles}>{langFullData.completeNow}</button>
                  {showModalStatus ? (
                    <CompleteProfile
                      show={showModal}
                      close={() => setShowModal(false)}
                    />
                  ) : (
                    ""
                  )}
                </div>
                <NoDataAvailable />
              </div>
              <div className="col-lg-3"></div>
            </div>
          ) : (
            <div>
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                {links.map((link) => {
                  return (
                    <li key={link.id} className="nav-item ">
                      <a
                        className={
                          "nav-link" + (tabType == link.to ? " active" : "")
                        }
                        href={"#" + tabType}
                        role="tab"
                        aria-controls="home"
                        data-bs-toggle="tab"
                        onClick={() => tabChange(link.to)}
                      >
                        {link.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div className="tab-content ps-0 pt-3">
                <div
                  className="tab-pane active"
                  id={tabType}
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  <div className="smartboard_date">
                    {tabType == langFullData.daily ? (
                      <span className="" onClick={onPrevDate}>
                        <img src={prev_icon} alt="icon" className="mr-2" />
                      </span>
                    ) : (
                      ""
                    )}

                    <div onClick={DateModalPopup} className="selected_date m-0">
                      <div className="d-flex align-items-center">
                        <span className="date_icon m-0">
                          <img src={date_icon} alt="icon" className="mr-2" />
                        </span>
                        {(() => {
                          if (tabType == "Daily") {
                            return <p>{partnerSelectDate}</p>;
                          } else if (tabType == "Weekly") {
                            return (
                              <p>
                                <span id="startWeekDate">{weekStartDate}</span>{" "}
                                to <span id="endWeekDate">{weekEndDate}</span>
                              </p>
                            );
                          } else if (tabType == "Monthly") {
                            return <p>{monthSelectDate}</p>;
                          } else if (tabType == "Yearly") {
                            return <p>{yearSelectDate}</p>;
                          }
                        })()}
                      </div>
                    </div>
                    {tabType == "Daily" ? (
                      <span className="" onClick={onNextDate}>
                        <img src={next_icon} alt="icon" className="ml-2" />
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  {isLoading ? (
                    <div className="">
                      <img src={loading} alt="my-gif" className="gif_img" />
                    </div>
                  ) : (
                    <div>
                      {smartboardData != null ? (
                        // {tabType}
                        
                        <div className="row smartboard_row" id="scroll_style">
                          {/* left side */}
                          <div className="col-sm-9 smartboard_div smartboard_div1 p-0">
                            <div className="outstanding_balance margin_bottom">
                              <h4 className="smartboard_main_header">
                                {langFullData.outstandingBalances}
                              </h4>
                              <div className="row">
                                <div className="col-md-6 p-0">
                                  <div className="card pending_rec_card green_card empty_card">
                                    <div className="row">
                                      <div className="col-lg-6 col_left_border">
                                        <h5 className="color_head_subtext">
                                          {langFullData.pendingReceivables}{" "}
                                        </h5>
                                        {outStandingBal.pendingRecievables ==
                                          0 ? (
                                          <p className="nodata">
                                            {langFullData.noDataAvailable}
                                          </p>
                                        ) : (
                                          <h6 className="color_head_subtext">
                                            {outStandingBal.pendingRecievables.toLocaleString(
                                              "en-IN",
                                              {
                                                maximumFractionDigits: 2,
                                                style: "currency",
                                                currency: "INR",
                                              }
                                            )}
                                          </h6>
                                        )}
                                        <p>
                                          {outStandingBal.pendingRecievables ==
                                            0 ? (
                                            ""
                                          ) : (
                                            <a
                                              id="buyer-link"
                                              href="/buyerledger" onClick={()=>{handleLinks("/buyerledger")}}
                                            >
                                              {langFullData.seeBuyerLedger}
                                            </a>
                                          )}
                                        </p>
                                      </div>
                                      <div className="col-lg-6 col2">
                                        <h5 className="color_head_subtext">
                                          {langData.sellBills}{" "}
                                        </h5>
                                        {outStandingBal.totalSellBills == 0 ? (
                                          <p className="nodata">
                                            {langFullData.noDataAvailable}
                                          </p>
                                        ) : (
                                          <h6 className="color_head_subtext">
                                            {outStandingBal.totalSellBills.toLocaleString(
                                              "en-IN",
                                              {
                                                currency: "INR",
                                              }
                                            )}
                                          </h6>
                                        )}

                                        <p>
                                          {outStandingBal.totalSellBills == 0
                                            ? ""
                                            : langFullData.seeAll}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-6 pr-0">
                                  <div className="card pending_rec_card pending_pay_card warning_card empty_card">
                                    <div className="row">
                                      <div className="col-lg-6 col_left_border">
                                        <h5 className="">Pending Payables </h5>
                                        {outStandingBal.pendingPaybles == 0 ? (
                                          <p className="nodata color_black">
                                            {langFullData.noDataAvailable}
                                          </p>
                                        ) : (
                                          <h6 className="color_red">
                                            {outStandingBal.pendingPaybles.toLocaleString(
                                              "en-IN",
                                              {
                                                maximumFractionDigits: 2,
                                                style: "currency",
                                                currency: "INR",
                                              }
                                            )}
                                          </h6>
                                        )}

                                        <p className="color_blue">
                                          {outStandingBal.pendingPaybles ==
                                            0 ? (
                                            ""
                                          ) : (
                                            <a href="/sellerledger" onClick={()=>{handleLinks("/sellerledger")}}>
                                              {langFullData.seeSellerLedger}
                                            </a>
                                          )}
                                        </p>
                                      </div>
                                      <div className="col-lg-6 col2">
                                        <h5 className="">{langFullData.buyBills} </h5>
                                        {outStandingBal.totalBuyBills == 0 ? (
                                          <p className="nodata color_black">
                                            {langFullData.noDataAvailable}
                                          </p>
                                        ) : (
                                          <h6 className="color_red">
                                            {outStandingBal.totalBuyBills.toLocaleString(
                                              "en-IN",
                                              {
                                                currency: "INR",
                                              }
                                            )}
                                          </h6>
                                        )}

                                        <p className="color_blue">
                                          {outStandingBal.totalBuyBills == 0
                                            ? ""
                                            : langFullData.seeAll}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="reports_cards margin_bottom">
                              <div className="row margin_bottom">
                                <div className="col-md-6 col_left pr-0">
                                  <h4 className="smartboard_main_header">
                                    {langFullData.salesReportText}
                                  </h4>
                                  <div className="card default_card empty_card">
                                    <div className="row">
                                      <div className="col-lg-6 col_left_border">
                                        <h5 className="">{langFullData.totalSales} </h5>
                                        <h6 className="">
                                          {salesReprtData.totalBusiness == 0
                                            ? ""
                                            : salesReprtData.totalBusiness.toLocaleString(
                                              "en-IN",
                                              {
                                                maximumFractionDigits: 2,
                                                style: "currency",
                                                currency: "INR",
                                              }
                                            )}
                                        </h6>
                                      </div>
                                      <div className="col-lg-6 col2">
                                        <h5 className="">{langFullData.totalQuantity} </h5>
                                        <h6 className="">
                                          {salesReprtData.totalUnits == 0
                                            ? ""
                                            : salesReprtData.totalUnits.toLocaleString(
                                              undefined, {
                                                minimumFractionDigits: 1,
                                              maximumFractionDigits: 2
                                            })
                                            +
                                            (salesReprtData.totalWeight
                                              ? " | " +
                                              salesReprtData.totalWeight.toLocaleString(
                                                undefined, {
                                                  minimumFractionDigits: 1,
                                                maximumFractionDigits: 2
                                              }) +
                                              langFullData.kgs
                                              : "")}
                                        </h6>
                                      </div>
                                    </div>
                                    {salesReprtData.totalBusiness == 0 ? (
                                      <NoDataText />
                                    ) : (
                                      <div className="row top_border">
                                        <p className="color_blue text-center">
                                          {langFullData.seeAll}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-md-6 col_right">
                                  <h4 className="smartboard_main_header">
                                    {langFullData.purchaseReports}
                                  </h4>
                                  <div className="card default_card empty_card">
                                    <div className="row">
                                      <div className="col-lg-6 col_left_border">
                                        <h5 className="">{langFullData.totalPurchases}</h5>
                                        <h6 className="">
                                          {purchaseReprtData.totalBusiness == 0
                                            ? ""
                                            : purchaseReprtData.totalBusiness.toLocaleString(
                                              "en-IN",
                                              {
                                                maximumFractionDigits: 2,
                                                style: "currency",
                                                currency: "INR",
                                              }
                                            )}
                                        </h6>
                                      </div>
                                      <div className="col-lg-6 col2">
                                        <h5 className="">{langFullData.totalQuantity} </h5>
                                        <h6 className="">
                                          {purchaseReprtData.totalUnits == 0
                                            ? ""
                                            : purchaseReprtData.totalUnits.toLocaleString(
                                              undefined, {
                                                minimumFractionDigits: 1,
                                              maximumFractionDigits: 2
                                            }) +
                                            (purchaseReprtData.totalWeight
                                              ? " | " +
                                              purchaseReprtData.totalWeight.toLocaleString(
                                                undefined, {
                                                  minimumFractionDigits: 1,
                                                maximumFractionDigits: 2
                                              })
                                              +
                                              langFullData.kgs
                                              : "")}
                                        </h6>
                                      </div>
                                    </div>
                                    {purchaseReprtData.totalBusiness == 0 ? (
                                      <NoDataText />
                                    ) : (
                                      <div className="row top_border">
                                        <p className="color_blue text-center">
                                          {langFullData.seeAll}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="row margin_bottom">
                                <div className="col-md-6 col_left pr-0">
                                  <div className="card default_card empty_card1">
                                    <h5 className="text-center mb-2">
                                      {langFullData.salesByCrop}
                                    </h5>
                                    {cropSalesData.length != 0 ? (
                                      <div>
                                        <div className="d-flex crop_data">
                                          {cropSalesData.map(
                                            (sellCrop, index) => {
                                              return (
                                                <div className="" key={index}>
                                                  <div
                                                    className={
                                                      "crop_div" +
                                                      (cropItem == sellCrop
                                                        ? " active"
                                                        : "")
                                                    }
                                                    onClick={() =>
                                                      cropOnclick(sellCrop)
                                                    }
                                                  >
                                                    <img
                                                      src={sellCrop.imageUrl}
                                                    />
                                                    <p className="crop_text">
                                                      {sellCrop.cropName}
                                                    </p>
                                                  </div>
                                                </div>
                                              );
                                            }
                                          )}
                                        </div>
                                        {cropItem != null && (
                                          <div>
                                            <div className="row mt-3">
                                              <div className="col-lg-6 col_left_border">
                                                <h5 className="">
                                                  {" "}
                                                  {langFullData.totalSales}{" "}
                                                </h5>
                                                <h6 className="">
                                                  {cropItem.totalBusiness.toLocaleString(
                                                    "en-IN",
                                                    {
                                                      maximumFractionDigits: 2,
                                                      style: "currency",
                                                      currency: "INR",
                                                    }
                                                  )}
                                                </h6>
                                              </div>
                                              <div className="col-lg-6 col2">
                                                <h5 className="">
                                                  {langFullData.totalQuantity}{" "}
                                                </h5>
                                                <h6 className="">
                                                  {cropItem.totalQty == 0
                                                    ? ""
                                                    : cropItem.totalQty.toLocaleString(
                                                      undefined, {
                                                        minimumFractionDigits: 1,
                                                      maximumFractionDigits: 2
                                                    }) +
                                                    (cropItem.totalWeight
                                                      ? " | " +
                                                      cropItem.totalWeight.toLocaleString(
                                                        undefined, {
                                                          minimumFractionDigits: 1,
                                                        maximumFractionDigits: 2
                                                      }) +
                                                      langFullData.kgs
                                                      : "")}
                                                </h6>
                                              </div>
                                            </div>
                                            <div className="row top_border">
                                              <p className="color_blue text-center">
                                                {langFullData.seeAll}
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <NoDataText />
                                    )}
                                  </div>
                                </div>
                                <div className="col-md-6 col_right">
                                  <div className="card default_card empty_card1">
                                    <h5 className="text-center mb-2">
                                      {langFullData.purchaseByCrop}
                                    </h5>
                                    {cropPurchaseData.length != 0 ? (
                                      <div>
                                        <div className="d-flex crop_data">
                                          {cropPurchaseData.map(
                                            (buyCrop, index) => {
                                              return (
                                                <div className="" key={index}>
                                                  <div
                                                    className={
                                                      "crop_div" +
                                                      (buycropItem == buyCrop
                                                        ? " active"
                                                        : "")
                                                    }
                                                    onClick={() =>
                                                      buyCropOnclick(buyCrop)
                                                    }
                                                  >
                                                    <img
                                                      src={buyCrop.imageUrl}
                                                    />
                                                    <p className="crop_text">
                                                      {buyCrop.cropName}
                                                    </p>
                                                  </div>
                                                </div>
                                              );
                                            }
                                          )}
                                        </div>
                                        {buycropItem != null && (
                                          <div>
                                            <div className="row mt-3">
                                              <div className="col-lg-6 col_left_border">
                                                <h5 className="">
                                                  {" "}
                                                  {langFullData.totalPurchases}{" "}
                                                </h5>
                                                <h6 className="">
                                                  {buycropItem.totalBusiness.toLocaleString(
                                                    "en-IN",
                                                    {
                                                      maximumFractionDigits: 2,
                                                      style: "currency",
                                                      currency: "INR",
                                                    }
                                                  )}
                                                </h6>
                                              </div>
                                              <div className="col-lg-6 col2">
                                                <h5 className="">
                                                  {langFullData.totalQuantity}{" "}
                                                </h5>
                                                <h6 className="">
                                                  {buycropItem.totalQty == 0
                                                    ? ""
                                                    : buycropItem.totalQty.toLocaleString(
                                                      "en-IN",
                                                      {
                                                        maximumFractionDigits: 2,
                                                        currency: "INR",
                                                      }
                                                    ) +
                                                    (buycropItem.totalWeight
                                                      ? " | " +
                                                      buycropItem.totalWeight.toLocaleString(
                                                        "en-IN",
                                                        {
                                                          maximumFractionDigits: 2,
                                                          currency: "INR",
                                                        }
                                                      ) +
                                                      " KGS"
                                                      : "")}
                                                </h6>
                                              </div>
                                            </div>
                                            <div className="row top_border">
                                              <p className="color_blue text-center">
                                                {langFullData.seeAll}
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <NoDataText />
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="row margin_bottom">
                                <div className="col-md-6 col_left pr-0">
                                  <div className="card default_card empty_card2">
                                    <h5 className="text-center mb-2">
                                      {langFullData.salesByBuyer}{" "}
                                    </h5>
                                    {buyerData.length != 0 ? (
                                      <OwlCarousel
                                        className="owl-theme owl_car"
                                        items={1}
                                        stagePadding={30}
                                        margin={20}
                                        responsive={car.responsive}
                                      >
                                        {buyerData.map((buyerItem, index) => {
                                          return (
                                            <div key={index}>
                                              <div className="d-flex item_div align-items-center">
                                                <img
                                                  src={single_bill}
                                                  alt="image"
                                                  className="userIcon"
                                                />
                                                <div>
                                                  <h4>{buyerItem.partyName}</h4>
                                                  <h5>{buyerItem.mobile}</h5>
                                                  <h3>
                                                    {buyerItem.trader
                                                      ? langFullData.trader
                                                      : langFullData.buyer}
                                                  </h3>
                                                </div>
                                              </div>
                                              <div>
                                                <div className="row mt-3">
                                                  <div className="col-lg-6 col_left_border">
                                                    <h5 className="">
                                                      {" "}
                                                      {langFullData.totalSales}{" "}
                                                    </h5>
                                                    <h6 className="">
                                                      {buyerItem.totalBusiness.toLocaleString(
                                                        "en-IN",
                                                        {
                                                          maximumFractionDigits: 2,
                                                          style: "currency",
                                                          currency: "INR",
                                                        }
                                                      )}
                                                    </h6>
                                                  </div>
                                                  <div className="col-lg-6 col2">
                                                    <h5 className="">
                                                      {langFullData.totalQuantity}{" "}
                                                    </h5>
                                                    <h6 className="">
                                                      {buyerItem.totalQty ==
                                                        0
                                                        ? ""
                                                        : buyerItem.totalQty.toLocaleString(
                                                          undefined, {
                                                            minimumFractionDigits: 1,
                                                          maximumFractionDigits: 2
                                                        }) +
                                                        (buyerItem.totalWeight
                                                          ? " | " +
                                                          buyerItem.totalWeight.toLocaleString(
                                                            undefined, {
                                                              minimumFractionDigits: 1,
                                                            maximumFractionDigits: 2
                                                          }) +
                                                          langFullData.kgs
                                                          : "")}
                                                    </h6>
                                                  </div>
                                                </div>
                                                <div className="row top_border">
                                                  <p className="color_blue text-center">
                                                    {langFullData.seeAll}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </OwlCarousel>
                                    ) : (
                                      <NoDataText />
                                    )}
                                  </div>
                                </div>
                                <div className="col-md-6 col_right">
                                  <div className="card default_card empty_card2">
                                    <h5 className="text-center mb-2">
                                      {langFullData.purchaseBySeller}{" "}
                                    </h5>
                                    {farmerData.length != 0 ? (
                                      <OwlCarousel
                                        className="owl-theme owl_car"
                                        items={1}
                                        stagePadding={30}
                                        margin={20}
                                        responsive={car.responsive}
                                      >
                                        {farmerData.map((farmerItem, index) => {
                                          return (
                                            <div key={index}>
                                              <div className="d-flex item_div align-items-center">
                                                <img
                                                  src={single_bill}
                                                  alt="image"
                                                  className="userIcon"
                                                />
                                                <div>
                                                  <h4>
                                                    {farmerItem.partyName}
                                                  </h4>
                                                  <h5>{farmerItem.mobile}</h5>
                                                  <h3>
                                                    {farmerItem.trader
                                                      ? langFullData.trader
                                                      : langFullData.seller}
                                                  </h3>
                                                </div>
                                              </div>
                                              <div className="row mt-3">
                                                <div className="col-lg-6 col_left_border">
                                                  <h5 className="">
                                                    {" "}
                                                    {langFullData.totalPurchases}{" "}
                                                  </h5>
                                                  <h6 className="">
                                                    {farmerItem.totalBusiness.toLocaleString(
                                                      "en-IN",
                                                      {
                                                        maximumFractionDigits: 2,
                                                        style: "currency",
                                                        currency: "INR",
                                                      }
                                                    )}
                                                  </h6>
                                                </div>
                                                <div className="col-lg-6 col2">
                                                  <h5 className="">
                                                    {langFullData.totalQuantity}{" "}
                                                  </h5>
                                                  <h6 className="">
                                                    {farmerItem.totalQty ==
                                                      0
                                                      ? ""
                                                      : farmerItem.totalQty.toLocaleString(
                                                        undefined, {
                                                          minimumFractionDigits: 1,
                                                        maximumFractionDigits: 2
                                                      }) +
                                                      (farmerItem.totalWeight
                                                        ? " | " +
                                                        farmerItem.totalWeight.toLocaleString(
                                                          undefined, {
                                                            minimumFractionDigits: 1,
                                                          maximumFractionDigits: 2
                                                        }) +
                                                        langFullData.kgs
                                                        : "")}
                                                  </h6>
                                                </div>
                                              </div>
                                              <div className="row top_border">
                                                <p className="color_blue text-center">
                                                  {langFullData.seeAll}
                                                </p>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </OwlCarousel>
                                    ) : (
                                      <NoDataText />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="reports_cards margin_bottom">
                              <h4 className="smartboard_main_header">
                                {langFullData.recentTransactions}
                              </h4>
                              <div className="row margin_bottom">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                  <h4 className="trans_title">
                                    {langFullData.buyTransactions}
                                  </h4>
                                  <p className="trans_title color_blue">
                                    {buyRecentTxs.length != 0 ? langFullData.seeAll : ""}
                                  </p>
                                </div>
                                {buyRecentTxs.length != 0 ? (
                                  <table className="table table-bordered trans_table">
                                    <thead>
                                      <tr>
                                        <th className="col-3">{langFullData.name}</th>
                                        <th className="col-2">{langFullData.paid}(&#8377;)</th>
                                        <th className="col-2">
                                          {langFullData.toBePaid}(&#8377;)
                                        </th>
                                        <th className="col-2">
                                          {langFullData.pastBalance}(&#8377;)
                                        </th>
                                        <th className="col-3">
                                          {langFullData.totalOutstandingPayables}(&#8377;)
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {buyRecentTxs.map((item, index) => {
                                        return (
                                          <tr key={index}>
                                            <td className="name_data">
                                              <div className="d-flex">
                                                <img
                                                  src={single_bill}
                                                  alt="image"
                                                  className="userIcon"
                                                />
                                                <div>
                                                  <h4>{item.farmerName}</h4>
                                                  <h4>{langFullData.billNo}:
                                                    <span style={{ color: '#0066FF' }}>{item.billId}</span></h4>
                                                </div>
                                              </div>
                                            </td>
                                            <td>0</td>
                                            <td>{item.totalPayble}</td>
                                            <td>{item.pastBal}</td>
                                            <td>{item.totalOutstdPay}</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                ) : (
                                  <div className="default_card w-100">
                                    <NoDataText />
                                  </div>
                                )}
                                <div className="d-flex align-items-center justify-content-between w-100 mt-4">
                                  <h4 className="trans_title">
                                    {langFullData.sellTransactions}
                                  </h4>
                                  <p className="trans_title color_blue">
                                    {sellRecentTxs.length != 0 ? langFullData.seeAll : ""}
                                  </p>
                                </div>
                                {sellRecentTxs.length != 0 ? (
                                  <table className="table table-bordered trans_table">
                                    <thead>
                                      <tr>
                                        <th className="col-3">{langFullData.name}</th>
                                        <th className="col-2">
                                          {langFullData.received}(&#8377;)
                                        </th>
                                        <th className="col-2">
                                          {langFullData.toBeReceived}(&#8377;)
                                        </th>
                                        <th className="col-2">
                                          {langFullData.pastBalance}(&#8377;)
                                        </th>
                                        <th className="col-3">
                                          {langFullData.totalOutstandingReceivables}(&#8377;)
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {sellRecentTxs.map((item, index) => {
                                        return (
                                          <tr key={index}>
                                            <td className="name_data">
                                              <div className="d-flex ">
                                                <img
                                                  src={single_bill}
                                                  alt="image"
                                                  className="userIcon"
                                                />
                                                <div>
                                                  <h4>{item.buyerName}</h4>
                                                  <h4>{langFullData.billNo}:
                                                    <span style={{ color: '#0066FF' }}>{item.billId}</span></h4>
                                                </div>
                                              </div>
                                            </td>
                                            <td>0</td>
                                            <td>{item.totalReceivable}</td>
                                            <td>{item.pastBal}</td>
                                            <td>{item.totalOutstdRcv}</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                ) : (
                                  <div className="default_card w-100">
                                    <NoDataText />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* right side */}
                          <div className="col-lg-3 smartboard_div">
                            <div className="smartboard_right_cards">
                              <div className="comission margin_bottom">
                                <h4 className="smartboard_main_header">
                                  {langFullData.myCommissions}
                                </h4>
                                <div className="card default_card">
                                  <div className="row">
                                    <div className="col-lg-6 col_left_border">
                                      <h5 className="">{langFullData.commissionEarned} </h5>
                                      <h6 className="">
                                        {commissionEarns.totalComm == 0
                                          ? ""
                                          : commissionEarns.totalComm.toLocaleString(
                                            "en-IN",
                                            {
                                              maximumFractionDigits: 2,
                                              style: "currency",
                                              currency: "INR",
                                            }
                                          )}
                                      </h6>
                                    </div>
                                    <div className="col-lg-6 pr-0">
                                      <h5 className="">Net Commission </h5>
                                      <h6 className="">
                                        {commissionEarns.netComm == 0
                                          ? ""
                                          : commissionEarns.netComm.toLocaleString(
                                            "en-IN",
                                            {
                                              maximumFractionDigits: 2,
                                              style: "currency",
                                              currency: "INR",
                                            }
                                          )}
                                      </h6>
                                    </div>
                                  </div>
                                  {(commissionEarns.totalComm &&
                                    commissionEarns.netComm) == 0 ? (
                                    <NoDataText />
                                  ) : (
                                    <p className="color_blue see_all">
                                      {langFullData.seeAll}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="margin_bottom">
                                <h4 className="smartboard_main_header">
                                  Quick Actions
                                </h4>
                                <div className="card default_card">
                                  <h4 className="smartboard_main_header">
                                    {langFullData.salesBillBook}
                                  </h4>
                                  <Link to="/sellbillbook" onClick={()=>{handleLinks("/sellbillbook")}}>
                                    <OutlineButton text={langFullData.addSalesBill} />
                                  </Link>
                                </div>
                                <div className="card default_card mt-3">
                                  <h4 className="smartboard_main_header">
                                    {langFullData.buyBillBook}
                                  </h4>
                                  <Link to="/buy_bill_book" onClick={()=>{handleLinks("/buy_bill_book")}}>
                                    <OutlineButton text={langFullData.addPurchaseBill} />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <NoDataAvailable />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="modal fade" id="datePopupmodalPopup">
        <div className="modal-dialog modal-dialog-centered date_modal_dialog samrtboard_calender">
          <div className="modal-content">
            <div className="modal-header date_modal_header smartboard_modal_header">
              <h5 className="modal-title header2_text" id="staticBackdropLabel">
                Select{" "}
                {tabType == "Daily"
                  ? langFullData.date
                  : tabType == "Weekly"
                    ? "Week"
                    : tabType == "Monthly"
                      ? "Month"
                      : tabType == "Year"}
              </h5>
              <img
                src={close}
                alt="image"
                className="close_icon"
                onClick={closePopup}
              />
            </div>
            <div className="modal-body date_modal_mody smartboard_modal_mody">
              <div className="calender_popup ">
                {(() => {
                  if (tabType == "Daily") {
                    return (
                      <div className="daily">
                        <DatePicker
                          dateFormat="dd-MMM-yy"
                          selected={selectedDate}
                          onChange={(date) => setStartDate(date)}
                          className="form-control"
                          placeholder="Date"
                          maxDate={new Date()}
                          inline
                        />
                      </div>
                    );
                  } else if (tabType == "Weekly") {
                    return (
                      <div className="week_cal">
                        <div className="week-picker"></div>
                      </div>
                    );
                  } else if (tabType == "Monthly") {
                    return (
                      <div className="weekly">
                        <DatePicker
                          dateFormat="dd-MMM-yy"
                          showMonthYearPicker
                          showFullMonthYearPicker
                          selected={selectedMonthDate}
                          onChange={(date) => setSelectedMonthDate(date)}
                          className="form-control"
                          placeholder="Date"
                          maxDate={new Date()}
                          showFourColumnMonthYearPicker
                          inline
                        />
                      </div>
                    );
                  } else if (tabType == "Yearly") {
                    return (
                      <div className="yearly">
                        <DatePicker
                          selected={selectedYearDate}
                          onChange={(date) => setSelectedyearDate(date)}
                          showYearPicker
                          dateFormat="yyyy"
                          className="form-control"
                          maxDate={new Date()}
                          showFourColumnMonthYearPicker
                          inline
                        />
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
            <div className="modal-footer p-0">
              <button
                type="button"
                className="primary_btn cont_btn w-100 m-0"
                onClick={() =>
                  getDateValue(
                    tabType == "Daily"
                      ? selectedDate
                      : tabType == "Yearly"
                        ? selectedYearDate
                        : selectedMonthDate
                  )
                }
              >
                {langFullData.continue_}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartBoard;
