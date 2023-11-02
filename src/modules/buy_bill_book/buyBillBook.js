import React, { Component, useEffect, useState } from "react";
import "../buy_bill_book/buyBillBook.scss";
import { qtyValues } from "../../components/qtyValues";
import single_bill from "../../assets/images/bills/single_bill.svg";
import { Link, useNavigate, generatePath } from "react-router-dom";
import { getBuyBills } from "../../actions/billCreationService";
import cancel from "../../assets/images/cancel.svg";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import $ from "jquery";
import date_icon from "../../assets/images/date_icon.svg";
import left_arrow from "../../assets/images/left_arrow.svg";
import DatePickerModel from "../smartboard/datePicker";
import "../../assets/css/calender.scss";
import loading from "../../assets/images/loading.gif";
import NoDataAvailable from "../../components/noDataAvailable";
import BillsSearchField from "../../components/billsSearchField";
import no_data_icon from "../../assets/images/NodataAvailable.svg";
import { getPartnerType, getText } from "../../components/getText";
import Steps from "./steps";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithOneDigit,
  getCurrencyNumberWithSymbol,
} from "../../components/getCurrencyNumber";
import { useDispatch, useSelector } from "react-redux";
import { selectSteps } from "../../reducers/stepsSlice";
import { billViewInfo } from "../../reducers/billViewSlice";
import { selectBuyer } from "../../reducers/buyerSlice";
import { selectTrans } from "../../reducers/transSlice";
import { billDate, fromBillbook } from "../../reducers/billEditItemSlice";
import addbill_icon from "../../assets/images/addbill.svg";
import NoInternetConnection from "../../components/noInternetConnection";
import BillView from "./billView";
import { getMaskedMobileNumber } from "../../components/getCurrencyNumber";
import prev_icon from "../../assets/images/prev_icon.svg";
import next_icon from "../../assets/images/next_icon.svg";
import {
  beginDate,
  closeDate,
  allBuyBillsData,
  allMultiBuyBillsData,
} from "../../reducers/ledgerSummarySlice";
import {
  fromMultiBillBook,
  fromMultiBillView,
  multiSelectPartners,
  multiSelectPartyType,
  multiStepsVal,
  selectedMultBillArray,
} from "../../reducers/multiBillSteps";
import MultiBillSteps from "../multi_buy_bill/steps";
import MultiBillView from "../multi_buy_bill/multiBillView";
function BuyBillBook() {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const ledgersSummary = useSelector((state) => state.ledgerSummaryInfo);
  const [allData, setAllDataStatus] = useState(false);
  var buyBillData = ledgersSummary?.allBuyBillsData;
  var multiBuyBillData = ledgersSummary?.allMultiBuyBillsData;
  // const [buyBillData, setBuyBillData] = useState(allData);
  const [isLoading, setLoading] = useState(true);
  const [isOnline, setOnline] = useState(false);
  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);

  const billData = useSelector((state) => state.billViewInfo);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPrevNext, setShowPrevNext] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    callbackFunction();
    setDateValue(moment(new Date()).format("DD-MMM-YYYY"));
  }, []);

  var [dateValue, setDateValue] = useState();

  const businessCreatedStatus =
    localStorage.getItem("businessCreatedStatus") != null
      ? localStorage.getItem("businessCreatedStatus")
      : loginData.useStatus == "WRITER"
      ? "writer"
      : "ca";

  const callbackFunction = (startDate, endDate, dateTab) => {
    var fromDate = moment(startDate).format("YYYY-MM-DD");
    var toDate = moment(endDate).format("YYYY-MM-DD");
    dateValue = fromDate;
    if (dateTab === "Daily") {
      setShowPrevNext(true);
      setLoading(true);
      setDateValue(moment(fromDate).format("DD-MMM-YYYY"));
      setCurrentDate(new Date(fromDate));
    } else if (dateTab === "Weekly") {
      setDateValue(
        moment(fromDate).format("DD-MMM-YYYY") +
          " to " +
          moment(toDate).format("DD-MMM-YYYY")
      );
      setLoading(true);
      setShowPrevNext(false);
    } else if (dateTab === "Monthly") {
      setDateValue(moment(fromDate).format("MMM-YYYY"));
      setLoading(true);
      setShowPrevNext(false);
    } else if (dateTab === "Yearly") {
      setDateValue(moment(fromDate).format("YYYY"));
      setLoading(true);
      setShowPrevNext(false);
    } else if (dateTab == "Custom") {
      setDateValue(
        moment(fromDate).format("DD-MMM-YYYY") +
          " to " +
          moment(toDate).format("DD-MMM-YYYY")
      );
      setLoading(true);
      setShowPrevNext(false);
    }
    dispatch(beginDate(fromDate));
    dispatch(closeDate(toDate));
    getBuyBills(clickId, fromDate, toDate)
      .then((response) => {
        if (response.data.data != null) {
          if (
            response.data.data.singleBills.length != 0 ||
            response.data.data.groupBills.length != 0
          ) {
            console.log("status");
            setAllDataStatus(true);
          }
          // setBuyBillData(response.data.data.singleBills);
          response.data.data.singleBills.map((i, ind) => {
            Object.assign(i, { index: ind });
          });
          console.log(response.data.data, "bills");
          dispatch(allBuyBillsData(response.data.data.singleBills));
          console.log(response.data.data.singleBills, "sinnglebillls");
          if (response.data.data.groupBills.length > 0) {
            response.data.data.groupBills.map((i, ind) => {
              Object.assign(i, { index: ind });
            });
            dispatch(allMultiBuyBillsData(response.data.data.groupBills));
          }
          // setBuyBillData(response.data.data.singleBills);
          setOnline(false);
        } else {
          dispatch(allBuyBillsData([]));
          dispatch(allMultiBuyBillsData([]));
          // setBuyBillData([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        if (error.toJSON().message === "Network Error") {
          console.log(error.message);
          setOnline(true);
        }
        setOnline(true);
      });
  };
  var billViewStatus = false;
  const [showBillModalStatus, setShowBillModalStatus] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const billOnClick = (id, bill, i) => {
    billViewStatus = true;
    localStorage.setItem("billViewStatus", billViewStatus);
    setShowBillModalStatus(true);
    setShowBillModal(true);
    // navigate(generatePath(`/bill_view/${id}`, { id }));
    localStorage.setItem("billId", id);
    let object = { ...bill };
    Object.assign(object, { index: i });
    dispatch(billViewInfo(bill));
    localStorage.setItem("billData", JSON.stringify(bill));
    dispatch(fromMultiBillBook(false));
  };
  const [showMultiBillModalStatus, setMultiShowBillModalStatus] =
    useState(false);
  const [showMultiBillModal, setMultiShowBillModal] = useState(false);
  const multiBillOnClick = (bill, i) => {
    setMultiShowBillModalStatus(true);
    setMultiShowBillModal(true);
    dispatch(selectedMultBillArray(bill));
    dispatch(multiSelectPartyType("FARMER"));
    dispatch(fromMultiBillBook(true));
  };
  const [showDatepickerModal, setShowDatepickerModal] = useState(false);
  const [showDatepickerModal1, setShowDatepickerModal1] = useState(false);

  const onclickDate = () => {
    setShowDatepickerModal1(true);
    setShowDatepickerModal(true);
  };
  var stepOneHeader = false;
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [showStepsModalStatus, setShowStepsModalStatus] = useState(false);
  const handleStep1Header = () => {
    stepOneHeader = true;
    localStorage.setItem("stepOne", stepOneHeader);
    setShowStepsModalStatus(true);
    setShowStepsModal(true);
    dispatch(selectSteps("step1"));
    dispatch(selectBuyer(null));
    dispatch(selectTrans(null));
    dispatch(fromBillbook(true));
  };

  const totalBagsValue = (bags) => {
    var totalValue = 0;
    bags.map((item) => {
      totalValue += item.weight - item.wastage;
    });
    return totalValue;
  };

  const onPrevDate = () => {
    const newDate = new Date(currentDate.getTime());
    newDate.setDate(newDate.getDate() - 1);
    setLoading(true);
    callbackFunction(newDate, newDate, "Daily");
    setCurrentDate(newDate);
    dispatch(billDate(newDate));
  };
  const onNextDate = () => {
    const newDate = new Date(currentDate.getTime());
    newDate.setDate(newDate.getDate() + 1);
    if (newDate < new Date()) {
      setLoading(true);
      callbackFunction(newDate, newDate, "Daily");
      setCurrentDate(newDate);
    }
    dispatch(billDate(newDate));
  };
  const [showMultiStepsModalStatus, setShowMultiStepsModalStatus] =
    useState(false);
  const [showMultiStepsModal, setShowMultiStepsModal] = useState(false);
  const onclickMultibill = () => {
    setShowMultiStepsModalStatus(true);
    setShowMultiStepsModal(true);
    dispatch(multiStepsVal("step1"));
    dispatch(multiSelectPartyType("Seller"));
    dispatch(multiSelectPartners([]));
    dispatch(fromMultiBillView(false));
  };

  return (
    <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
          {(loginData.businessCreated === false
            ? loginData.useStatus == "WRITER"
            : true) && businessCreatedStatus == "" ? (
            <div className="row">
              <div className="col-lg-9 smartboard_div p-0">
                <div className="complete_profile d-flex justify-content-between align-items-center">
                  <p>{langFullData.completeTheCompanySetup}</p>
                </div>
                <NoDataAvailable />
              </div>
              <div className="col-lg-3"></div>
            </div>
          ) : (
            <div>
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
                      <div>
                        <div className="d-flex justify-content-center bills_div">
                          {/* <ul className="nav nav-tabs bills_div_tabs" id="myTab" role="tablist">
                          <li className="nav-item active">
                            <a
                              className="nav-link active"
                              href="#home"
                              role="tab"
                              aria-controls="home"
                              data-bs-toggle="tab"
                            >
                              {langFullData.all}
                            </a>
                          </li>
                        </ul> */}
                          <div className="d-flex align-items-center color_blue">
                            {showPrevNext ? (
                              <button onClick={onPrevDate} className="p-0">
                                <span className="" onClick={onPrevDate}>
                                  <img
                                    src={prev_icon}
                                    alt="icon"
                                    className="mr-3"
                                  />
                                </span>
                              </button>
                            ) : (
                              ""
                            )}
                            <button onClick={onclickDate} className="p-0">
                              <span className="date_icon m-0 d-flex color_blue">
                                <img
                                  src={date_icon}
                                  alt="icon"
                                  className="mr-2 d-flex"
                                />
                                {dateValue}
                              </span>
                            </button>
                            {showPrevNext ? (
                              <button onClick={onNextDate}>
                                <span className="" onClick={onNextDate}>
                                  <img
                                    src={next_icon}
                                    alt="icon"
                                    className="ml-3"
                                  />
                                </span>
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                          {/* <button onClick={onclickDate} className="color_blue">
                            <div className="d-flex align-items-center">
                              <p className="date_icon m-0">
                                <img
                                  src={date_icon}
                                  alt="icon"
                                  className="mr-2 d-flex"
                                />
                              </p>
                              <p className="date_text_book">{dateValue}</p>
                            </div>
                          </button> */}
                          <div className="d-flex btn_bill_book">
                            {/* <BillsSearchField
                          placeholder={langFullData.search}
                          onChange={(event) => {
                            handleSearch(event);
                          }}
                        /> */}

                            <button
                              className="primary_btn add_bills_btn mr-2"
                              onClick={onclickMultibill}
                            >
                              <img
                                src={addbill_icon}
                                alt="image"
                                className="mr-2"
                              />
                              Add Multi Bill
                            </button>
                            <button
                              className="primary_btn add_bills_btn"
                              onClick={handleStep1Header}
                            >
                              <img
                                src={addbill_icon}
                                alt="image"
                                className="mr-2"
                              />
                              Add single Bill
                            </button>
                          </div>
                        </div>
                        <div>
                          <div className="tab-content">
                            <div
                              className="tab-pane active"
                              id="home"
                              role="tabpanel"
                              aria-labelledby="home-tab"
                            >
                              {!allData ? (
                                <div className="row partner_no_data_widget_row">
                                  <div className="col-lg-5">
                                    <div className="partner_no_data_widget">
                                      <div className="text-center">
                                        <img
                                          src={no_data_icon}
                                          alt="icon"
                                          className="d-flex mx-auto justify-content-center"
                                        />
                                        <p>
                                          No bills available for today.{" "}
                                          <br></br>
                                          Add to create a new bill
                                        </p>
                                        <button
                                          className="primary_btn mr-2"
                                          onClick={onclickMultibill}
                                        >
                                          Add Multi Bill
                                        </button>
                                        <button
                                          className="primary_btn"
                                          onClick={handleStep1Header}
                                        >
                                          Add single Bill
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="row header_row">
                                    <div className="col-lg-4">
                                      <div className="row">
                                        <div className="col-lg-7 col-sm-12 p-0">
                                          <p>Seller</p>
                                        </div>
                                        <div className="col-lg-5 col-sm-12">
                                          <p>{langFullData.billId}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 p-0">
                                      <div className="row">
                                        <div className="col-lg-4 col-sm-12">
                                          <p>{langFullData.particulars}</p>
                                        </div>
                                        <div className="col-lg-4 col-sm-12">
                                          <p>{langFullData.qty}</p>
                                        </div>
                                        <div className="col-lg-2 col-sm-12">
                                          <p>{langFullData.rate}(₹) </p>
                                        </div>
                                        <div className="col-lg-2 col-sm-12">
                                          <p>{langFullData.total}(₹)</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-2 p-0">
                                      <div className="row">
                                        <div className="col-lg-12 col-sm-12">
                                          <p>
                                            {langFullData.totalPayables} (₹)
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="buy_bills" id="scroll_style">
                                    {multiBuyBillData.length > 0 && (
                                      <div>
                                        <div className="" id="">
                                          {multiBuyBillData.map(
                                            (bill, index) => (
                                              <button
                                                onClick={() =>
                                                  multiBillOnClick(bill, index)
                                                }
                                                key={index}
                                                className="billsDiv"
                                              >
                                                <div className="bills_rows p-0 multi_bill_row">
                                                  {bill?.billInfo.map(
                                                    (item, pIndex) => {
                                                      return (
                                                        <div className="row main_row mb-0 bg_white bottom_space">
                                                          <div className="col-lg-4 col ps-0 flex_class p-0 mr-0">
                                                            <div className="row full_width">
                                                              <div className="col-lg-7 col-sm-12 p-0 col">
                                                                <div className="bill_user_details flex_class mr-0">
                                                                  {item.profilePic ? (
                                                                    <img
                                                                      src={
                                                                        item.profilePic
                                                                      }
                                                                      className="user_icon"
                                                                      alt="icon"
                                                                    />
                                                                  ) : (
                                                                    <img
                                                                      src={
                                                                        single_bill
                                                                      }
                                                                      className="user_icon"
                                                                      alt="icon"
                                                                    />
                                                                  )}
                                                                  <div className="text-left">
                                                                    <h6 className="userName">
                                                                      {item.farmerName +
                                                                        "" +
                                                                        "-" +
                                                                        item.shortName}
                                                                    </h6>
                                                                    <div className="d-flex align-items-center">
                                                                      <div>
                                                                        <h6 className="mobile">
                                                                          {getPartnerType(
                                                                            item.partyType,
                                                                            item.trader
                                                                          ) +
                                                                            "-" +
                                                                            item.farmerId}
                                                                        </h6>
                                                                      </div>
                                                                      <h6 className="mobile desk_responsive">
                                                                        &nbsp;
                                                                        {" |  " +
                                                                          getMaskedMobileNumber(
                                                                            item.farmerMobile
                                                                          )}
                                                                      </h6>
                                                                    </div>
                                                                    <h6 className="mobile mobile_responsive">
                                                                      {getMaskedMobileNumber(
                                                                        item.farmerMobile
                                                                      )}
                                                                    </h6>
                                                                    <h6 className="address">
                                                                      {
                                                                        item.farmerAddress
                                                                      }
                                                                    </h6>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                              <div className="col-lg-5 col-sm-12 billid_div"></div>
                                                            </div>
                                                          </div>
                                                          <div className="col-lg-6 p-0">
                                                            {item.lineItems.map(
                                                              (crop, index) => (
                                                                <div
                                                                  className="row crops_row_bills"
                                                                  key={index}
                                                                >
                                                                  <div className="col-lg-4 col-sm-12 col">
                                                                    <p className="flex_class crop_name">
                                                                      <img
                                                                        src={
                                                                          crop.imageUrl
                                                                        }
                                                                        className="crop_image"
                                                                      />
                                                                      {crop.cropSufx !=
                                                                      null
                                                                        ? crop.cropSufx !=
                                                                          ""
                                                                          ? crop.cropName +
                                                                            " " +
                                                                            `(${crop.cropSufx})`
                                                                          : crop.cropName
                                                                        : crop.cropName}
                                                                    </p>
                                                                  </div>
                                                                  <div className="col-lg-4 col-sm-12 col">
                                                                    {/* {crop.qtyUnit+crop.qty} */}
                                                                    <div
                                                                      className="d-flex align-items-center"
                                                                      style={{
                                                                        height:
                                                                          "100%",
                                                                      }}
                                                                    >
                                                                      <div className="text-left">
                                                                        <div>
                                                                          {" "}
                                                                          {qtyValues(
                                                                            crop.qty,
                                                                            crop.qtyUnit,
                                                                            crop.weight,
                                                                            crop.wastage,
                                                                            crop.rateType
                                                                          )}
                                                                        </div>
                                                                        {crop.bags !==
                                                                          null &&
                                                                        crop
                                                                          .bags
                                                                          .length >
                                                                          0 ? (
                                                                          <div className="flex_class">
                                                                            <input
                                                                              type="checkbox"
                                                                              checked={
                                                                                true
                                                                              }
                                                                              id="modal_checkbox"
                                                                              value="my-value"
                                                                              className="checkbox_t"
                                                                            />
                                                                            <p className="inv-weight">
                                                                              Individual
                                                                              Weights
                                                                              <span className="bags-data">
                                                                                <div className="bags-values">
                                                                                  {crop.bags.map(
                                                                                    (
                                                                                      itemBag
                                                                                    ) => {
                                                                                      return (
                                                                                        <span>
                                                                                          <span>
                                                                                            {itemBag.weight
                                                                                              ? itemBag.weight +
                                                                                                " "
                                                                                              : ""}
                                                                                          </span>
                                                                                          <span className="wastsge_color">
                                                                                            {itemBag.wastage
                                                                                              ? " - "
                                                                                              : ""}
                                                                                          </span>
                                                                                          <span className="wastsge_color">
                                                                                            {itemBag.wastage
                                                                                              ? itemBag.wastage
                                                                                              : ""}
                                                                                          </span>
                                                                                          <span>
                                                                                            ,{" "}
                                                                                          </span>
                                                                                        </span>
                                                                                      );
                                                                                    }
                                                                                  )}
                                                                                </div>
                                                                                <span>
                                                                                  ={" "}
                                                                                  {totalBagsValue(
                                                                                    crop.bags
                                                                                  ) +
                                                                                    "KGS"}
                                                                                </span>
                                                                              </span>
                                                                            </p>
                                                                          </div>
                                                                        ) : (
                                                                          ""
                                                                        )}
                                                                      </div>
                                                                    </div>
                                                                  </div>
                                                                  <div className="col-lg-2 col-sm-12 col flex_class">
                                                                    <p className="number_overflow crop_name">
                                                                      {getCurrencyNumberWithOutSymbol(
                                                                        crop.rate
                                                                      )}
                                                                    </p>
                                                                  </div>
                                                                  <div className="col-lg-2 col-sm-12 col flex_class">
                                                                    <p className="number_overflow crop_name">
                                                                      {getCurrencyNumberWithOutSymbol(
                                                                        crop.total
                                                                      )}
                                                                    </p>
                                                                  </div>
                                                                </div>
                                                              )
                                                            )}
                                                          </div>
                                                          <div className="col-lg-2 flex_class">
                                                            <div
                                                              className="row"
                                                              style={{
                                                                width: "100%",
                                                              }}
                                                            >
                                                              <div className="d-flex col-lg-12 col-sm-12 col last_col justify-content-between">
                                                                <p className="crop_name payble_text">
                                                                  {getCurrencyNumberWithOutSymbol(
                                                                    item.totalPayables
                                                                  )}
                                                                </p>
                                                                <img
                                                                  src={
                                                                    left_arrow
                                                                  }
                                                                  alt="left-arrow"
                                                                  className="left-arrow-img"
                                                                />
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                                <div className="totals_col_grp ">
                                                  <div className="row">
                                                    <div className="col-lg-2"></div>
                                                    <div className="col-lg-3">
                                                      <div className="d-flex align-items-center billid_div_flex">
                                                        <div className="text-left">
                                                          <p className="biilid">
                                                            Group ID :{" "}
                                                            {bill.groupId}{" "}
                                                          </p>

                                                          <div className="d-flex">
                                                            <p className="d-a-value">
                                                              {moment(
                                                                bill
                                                                  ?.billInfo[0]
                                                                  .timeStamp
                                                              ).format(
                                                                "DD-MMM-YY | hh:mm:A"
                                                              )}
                                                            </p>
                                                          </div>
                                                          <p
                                                            style={{
                                                              color:
                                                                bill
                                                                  ?.billInfo[0]
                                                                  .billStatus ==
                                                                "CANCELLED"
                                                                  ? "#d43939"
                                                                  : "#1C1C1C",
                                                            }}
                                                          >
                                                            <div className="flex_class">
                                                              {bill?.billInfo[0]
                                                                .billStatus ==
                                                              "CANCELLED" ? (
                                                                <div className="complete-dot cancel_dot"></div>
                                                              ) : (
                                                                <div className="complete-dot"></div>
                                                              )}
                                                              <div className="bill-name">
                                                                {getText(
                                                                  bill
                                                                    ?.billInfo[0]
                                                                    .billStatus
                                                                )}
                                                              </div>
                                                            </div>
                                                          </p>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="col-lg-7">
                                                      <div className="row d-flex flex-end">
                                                        <div className="col-lg-4">
                                                          <p>Group Total :</p>
                                                        </div>
                                                        <div className="col-lg-3">
                                                          <p className="payble_text">
                                                            {getCurrencyNumberWithSymbol(
                                                              bill?.grossTotal
                                                            )}
                                                          </p>
                                                        </div>
                                                      </div>
                                                      <div className="row d-flex flex-end">
                                                        <div className="col-lg-4">
                                                          <p>
                                                            Total Expenses :
                                                          </p>
                                                        </div>
                                                        <div className="col-lg-3">
                                                          <p className="payble_text">
                                                            {bill?.totalExpenses !=
                                                            0
                                                              ? getCurrencyNumberWithSymbol(
                                                                  bill?.totalExpenses
                                                                )
                                                              : 0}
                                                          </p>
                                                        </div>
                                                      </div>
                                                      <div className="row d-flex flex-end">
                                                        <div className="col-lg-4">
                                                          <p>COGS :</p>
                                                        </div>
                                                        <div className="col-lg-3">
                                                          <p className="payble_text">
                                                            {" "}
                                                            {getCurrencyNumberWithSymbol(
                                                              bill?.totalRevenue
                                                            )}{" "}
                                                          </p>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </button>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    {buyBillData.length > 0 && (
                                      <div>
                                        <div>
                                          {buyBillData.map((bill, index) => (
                                            <button
                                              onClick={() =>
                                                billOnClick(
                                                  bill.caBSeq,
                                                  bill,
                                                  index
                                                )
                                              }
                                              key={index}
                                              className="billsDiv"
                                            >
                                              <div className="row bills_rows bg_white bottom_space">
                                                <div className="col-lg-4 col ps-0 flex_class p-0 mr-0">
                                                  <div className="row full_width">
                                                    <div className="col-lg-7 col-sm-12 p-0 col">
                                                      <div className="bill_user_details flex_class mr-0">
                                                        {bill.profilePic ? (
                                                          <img
                                                            src={
                                                              bill.profilePic
                                                            }
                                                            className="user_icon"
                                                            alt="icon"
                                                          />
                                                        ) : (
                                                          <img
                                                            src={single_bill}
                                                            className="user_icon"
                                                            alt="icon"
                                                          />
                                                        )}
                                                        <div className="text-left">
                                                          <h6 className="userName">
                                                            {bill.farmerName +
                                                              "" +
                                                              "-" +
                                                              bill.shortName}
                                                          </h6>
                                                          <div className="d-flex align-items-center">
                                                            <div>
                                                              <h6 className="mobile">
                                                                {getPartnerType(
                                                                  bill.partyType,
                                                                  bill.trader
                                                                ) +
                                                                  "-" +
                                                                  bill.farmerId}
                                                              </h6>
                                                            </div>
                                                            <h6 className="mobile desk_responsive">
                                                              &nbsp;
                                                              {" |  " +
                                                                getMaskedMobileNumber(
                                                                  bill.farmerMobile
                                                                )}
                                                            </h6>
                                                          </div>
                                                          <h6 className="mobile mobile_responsive">
                                                            {getMaskedMobileNumber(
                                                              bill.farmerMobile
                                                            )}
                                                          </h6>
                                                          <h6 className="address">
                                                            {bill.farmerAddress}
                                                          </h6>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="col-lg-5 col-sm-12 billid_div">
                                                      <div className="d-flex align-items-center billid_div_flex">
                                                        <div className="text-left">
                                                          <p className="biilid">
                                                            {
                                                              langFullData.billNo
                                                            }
                                                            : {bill.caBSeq}{" "}
                                                          </p>

                                                          <div className="d-flex">
                                                            <p className="d-a-value">
                                                              {moment(
                                                                bill?.timeStamp
                                                              ).format(
                                                                "DD-MMM-YY | hh:mm:A"
                                                              )}
                                                            </p>
                                                          </div>
                                                          <p
                                                            style={{
                                                              color:
                                                                bill.billStatus ==
                                                                "CANCELLED"
                                                                  ? "#d43939"
                                                                  : "#1C1C1C",
                                                            }}
                                                          >
                                                            <div className="flex_class p-0">
                                                              {bill?.paid ==
                                                              true ? (
                                                                <div className="flex_class">
                                                                  <div className="complete-dot"></div>
                                                                  <div className="bill-name">
                                                                    {getText(
                                                                      "Amount Paid"
                                                                    )}
                                                                  </div>
                                                                </div>
                                                              ) : (
                                                                <div className="flex_class">
                                                                  {bill.billStatus ==
                                                                  "CANCELLED" ? (
                                                                    <div className="complete-dot cancel_dot"></div>
                                                                  ) : (
                                                                    <div className="complete-dot"></div>
                                                                  )}
                                                                  <div className="bill-name">
                                                                    {getText(
                                                                      bill.billStatus
                                                                    )}
                                                                  </div>
                                                                </div>
                                                              )}
                                                            </div>
                                                          </p>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="col-lg-6 p-0">
                                                  {bill.lineItems.map(
                                                    (crop, index) => (
                                                      <div
                                                        className="row crops_row_bills"
                                                        key={index}
                                                      >
                                                        <div className="col-lg-4 col-sm-12 col">
                                                          <p className="flex_class crop_name">
                                                            <img
                                                              src={
                                                                crop.imageUrl
                                                              }
                                                              className="crop_image"
                                                            />
                                                            {crop.cropSufx !=
                                                            null
                                                              ? crop.cropSufx !=
                                                                ""
                                                                ? crop.cropName +
                                                                  " " +
                                                                  `(${crop.cropSufx})`
                                                                : crop.cropName
                                                              : crop.cropName}
                                                          </p>
                                                          <p className="crop_name color_green">
                                                            {(crop.mnLotId !=
                                                            "0"
                                                              ? crop.mnLotId
                                                              : "") +
                                                              (crop.mnLotId !=
                                                              ""
                                                                ? crop.mnLotId !=
                                                                  "0"
                                                                  ? "/"
                                                                  : ""
                                                                : "") +
                                                              (crop.mnSubLotId !=
                                                              "0"
                                                                ? crop.mnSubLotId
                                                                : "")}
                                                          </p>
                                                        </div>
                                                        <div className="col-lg-4 col-sm-12 col">
                                                          {/* {crop.qtyUnit+crop.qty} */}
                                                          <div
                                                            className="d-flex align-items-center"
                                                            style={{
                                                              height: "100%",
                                                            }}
                                                          >
                                                            <div className="text-left">
                                                              <div>
                                                                {" "}
                                                                {qtyValues(
                                                                  crop.qty,
                                                                  crop.qtyUnit,
                                                                  crop.weight,
                                                                  crop.wastage,
                                                                  crop.rateType
                                                                )}
                                                              </div>
                                                              {crop.bags !==
                                                                null &&
                                                              crop.bags.length >
                                                                0 ? (
                                                                <div className="flex_class">
                                                                  <input
                                                                    type="checkbox"
                                                                    checked={
                                                                      true
                                                                    }
                                                                    id="modal_checkbox"
                                                                    value="my-value"
                                                                    className="checkbox_t"
                                                                  />
                                                                  <p className="inv-weight">
                                                                    Individual
                                                                    Weights
                                                                    <span className="bags-data">
                                                                      <div className="bags-values">
                                                                        {crop.bags.map(
                                                                          (
                                                                            item
                                                                          ) => {
                                                                            return (
                                                                              <span>
                                                                                <span>
                                                                                  {item.weight
                                                                                    ? item.weight +
                                                                                      " "
                                                                                    : ""}
                                                                                </span>
                                                                                <span className="wastsge_color">
                                                                                  {item.wastage
                                                                                    ? " - "
                                                                                    : ""}
                                                                                </span>
                                                                                <span className="wastsge_color">
                                                                                  {item.wastage
                                                                                    ? item.wastage
                                                                                    : ""}
                                                                                </span>
                                                                                <span>
                                                                                  ,{" "}
                                                                                </span>
                                                                              </span>
                                                                            );
                                                                          }
                                                                        )}
                                                                      </div>
                                                                      <span>
                                                                        ={" "}
                                                                        {totalBagsValue(
                                                                          crop.bags
                                                                        ) +
                                                                          "KGS"}
                                                                      </span>
                                                                    </span>
                                                                  </p>
                                                                </div>
                                                              ) : (
                                                                ""
                                                              )}
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div className="col-lg-2 col-sm-12 col flex_class">
                                                          <p className="number_overflow crop_name">
                                                            {getCurrencyNumberWithOutSymbol(
                                                              crop.rate
                                                            )}
                                                          </p>
                                                        </div>
                                                        <div className="col-lg-2 col-sm-12 col flex_class">
                                                          <p className="number_overflow crop_name">
                                                            {getCurrencyNumberWithOutSymbol(
                                                              crop.total
                                                            )}
                                                          </p>
                                                        </div>
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                                <div className="col-lg-2 flex_class">
                                                  <div
                                                    className="row"
                                                    style={{ width: "100%" }}
                                                  >
                                                    <div className="d-flex col-lg-12 col-sm-12 col last_col justify-content-between">
                                                      <p className="crop_name payble_text">
                                                        {getCurrencyNumberWithOutSymbol(
                                                          bill.totalPayables
                                                        )}
                                                      </p>
                                                      <img
                                                        src={left_arrow}
                                                        alt="left-arrow"
                                                        className="left-arrow-img"
                                                      />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showDatepickerModal1 ? (
        <DatePickerModel
          show={showDatepickerModal}
          close={() => setShowDatepickerModal(false)}
          parentCallback={callbackFunction}
          prevNextDate={currentDate}
        />
      ) : (
        <p></p>
      )}
      {showStepsModalStatus ? (
        <Steps
          showStepsModal={showStepsModal}
          closeStepsModal={() => setShowStepsModal(false)}
        />
      ) : (
        ""
      )}
      {showMultiStepsModalStatus ? (
        <MultiBillSteps
          showMultiStepsModal={showMultiStepsModal}
          closeMultiStepsModal={() => setShowMultiStepsModal(false)}
        />
      ) : (
        ""
      )}
      {showBillModalStatus ? (
        <BillView
          showBillViewModal={showBillModal}
          closeBillViewModal={() => setShowBillModal(false)}
          allBillsData={buyBillData}
          fromLedger={false}
          fromBillbookToRecordPayment={true}
        />
      ) : (
        ""
      )}
      {showMultiBillModalStatus ? (
        <MultiBillView
          showMultiBillViewModal={showMultiBillModal}
          closeMultiBillViewModal={() => setMultiShowBillModal(false)}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default BuyBillBook;
