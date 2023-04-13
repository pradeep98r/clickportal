import React, { Component, useEffect, useState } from "react";
import "../buy_bill_book/buyBillBook.scss";
import cancel from "../../assets/images/cancel.svg";
import single_bill from "../../assets/images/bills/single_bill.svg";
import { Link, useNavigate, generatePath } from "react-router-dom";
import { getSellBills } from "../../actions/billCreationService";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import date_icon from "../../assets/images/date_icon.svg";
import left_arrow from "../../assets/images/left_arrow.svg";
import $ from "jquery";
import DatePickerModel from "../smartboard/datePicker";
import "../../assets/css/calender.scss";
import loading from "../../assets/images/loading.gif";
import { getPartnerType, getText } from "../../components/getText";
import { qtyValues } from "../../components/qtyValues";
import prev_icon from "../../assets/images/prev_icon.svg";
import next_icon from "../../assets/images/next_icon.svg";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithOneDigit,
} from "../../components/getCurrencyNumber";
import { useDispatch, useSelector } from "react-redux";
import { billViewInfo } from "../../reducers/billViewSlice";
import { selectSteps } from "../../reducers/stepsSlice";
import { selectBuyer } from "../../reducers/buyerSlice";
import Steps from "../buy_bill_book/steps";
import { fromBillbook } from "../../reducers/billEditItemSlice";
import no_data_icon from "../../assets/images/NodataAvailable.svg";
import addbill_icon from "../../assets/images/addbill.svg";
import NoInternetConnection from "../../components/noInternetConnection";
import BillView from "../buy_bill_book/billView";
import { getMaskedMobileNumber } from "../../components/getCurrencyNumber";
import {
  allSellBillsData,
  beginDate,
  closeDate,
} from "../../reducers/ledgerSummarySlice";
import {
  multiSelectPartyType,
  multiStepsVal,
} from "../../reducers/multiBillSteps";
import MultiBillSteps from "../multi_buy_bill/steps";
const SellBillBook = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const [allData, setAllData] = useState([]);
  const ledgersSummary = useSelector((state) => state.ledgerSummaryInfo);
  var sellBillData = ledgersSummary?.allSellBillsData;
  console.log(sellBillData);
  // const [sellBillData, setSellBillData] = useState(allData);
  const [isLoading, setLoading] = useState(true);
  const [isOnline, setOnline] = useState(false);
  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);
  const billViiewSttatus = localStorage.getItem("billViiewSttatus");
  const billViiewDate = localStorage.getItem("billDate");
  var bDate = props.selectedBillviewDate ? props.selectedBillviewDate : "";

  const billData = useSelector((state) => state.billViewInfo);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPrevNext, setShowPrevNext] = useState(true);
  // console.log(billViiewDate)
  const dispatch = useDispatch();
  useEffect(() => {
    callbackFunction();
    setDateValue(moment(new Date()).format("DD-MMM-YYYY"));
  }, []);
  var [dateValue, setDateValue] = useState();
  window.addEventListener("load", function (event) {
    // bDate = '';
  });
  const callbackFunction = (startDate, endDate, dateTab) => {
    var fromDate = moment(bDate ? bDate : startDate).format("YYYY-MM-DD");
    var toDate = moment(bDate ? bDate : endDate).format("YYYY-MM-DD");
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
    } else if (dateTab === "Custom") {
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
    getSellBills(clickId, fromDate, toDate)
      .then((response) => {
        console.log(response.data.data);
        if (response.data.data != null) {
          setAllData(response.data.data);
          response.data.data.singleBills.map((i, ind) => {
            Object.assign(i, { index: ind });
          });
          dispatch(allSellBillsData(response.data.data.singleBills));
          // setSellBillData(response.data.data.singleBills);
        } else {
          dispatch(allSellBillsData([]));
          // setSellBillData([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        if (error.toJSON().message === "Network Error") {
          setOnline(true);
        }
        console.log(error);
      });
  };

  const [billItem, setSelectBill] = useState("");
  const navigate = useNavigate();
  var billViewStatus = false;
  const [showBillModalStatus, setShowBillModalStatus] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const billOnClick = (id, bill, i) => {
    billViewStatus = true;
    localStorage.setItem("billViewStatus", billViewStatus);
    // navigate(generatePath(`/sell_bill_view/${id}`, { id }));
    // navigate(generatePath(`/bill_view/${id}`, { id }))
    setShowBillModalStatus(true);
    setShowBillModal(true);
    localStorage.setItem("billId", id);
    let object = { ...bill };
    Object.assign(object, { index: i });
    dispatch(billViewInfo(bill));
    localStorage.setItem("billData", JSON.stringify(bill));
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
    //stepOneSingleBook
    setShowStepsModalStatus(true);
    setShowStepsModal(true);
    dispatch(selectSteps("step1"));
    dispatch(selectBuyer(null));
    dispatch(fromBillbook(true));
  };
  const getCropUnit = (unit) => {
    var unitType = "";
    switch (unit.toUpperCase()) {
      case "CRATES":
        unitType = "C";
        break;
      case "BOXES":
        unitType = "BX";
        break;
      case "BAGS":
        unitType = "BG";
        break;
      case "SACS":
        unitType = "S";
        break;
    }
    return unitType;
  };
  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = allData.singleBills.filter((data) => {
      if (data.buyerName.toLowerCase().includes(value)) {
        return data.buyerName.toLowerCase().search(value) != -1;
      } else if (data.shortName.toLowerCase().includes(value)) {
        return data.shortName.toLowerCase().search(value) != -1;
      } else if (data.buyerId.toString().includes(value)) {
        return data.buyerId.toString().search(value) != -1;
      }
    });
    dispatch(allSellBillsData(result));
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
  };
  const onNextDate = () => {
    const newDate = new Date(currentDate.getTime());
    newDate.setDate(newDate.getDate() + 1);
    if (newDate < new Date()) {
      setLoading(true);
      callbackFunction(newDate, newDate, "Daily");
      setCurrentDate(newDate);
    }
  };
  const [showMultiStepsModalStatus, setShowMultiStepsModalStatus] =
    useState(false);
  const [showMultiStepsModal, setShowMultiStepsModal] = useState(false);
  const onclickMultibill = () => {
    setShowMultiStepsModalStatus(true);
    setShowMultiStepsModal(true);
    dispatch(multiStepsVal("step1"));
    dispatch(multiSelectPartyType("Buyer"));
  };
  return (
    <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
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

                      {/* <button  className="color_blue"> */}
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

                      {/* </button> */}
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
                          {sellBillData.length > 0 ? (
                            <div>
                              <div className="row header_row">
                                <div className="col-lg-4">
                                  <div className="row">
                                    <div className="col-lg-7 col-sm-12 p-0">
                                      <p>{langFullData.buyer}</p>
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
                                      <p>{langFullData.totalReceivables} (₹)</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="buy_bills" id="scroll_style">
                                {sellBillData.map((bill, index) => (
                                  <button
                                    onClick={() =>
                                      billOnClick(bill.caBSeq, bill, index)
                                    }
                                    key={index}
                                    className="billsDiv"
                                  >
                                    <div className="row bg_white bills_rows bottom_space">
                                      <div className="col-lg-4 col ps-0 flex_class p-0 mr-0">
                                        <div className="row full_width">
                                          <div className="col-lg-7 col-sm-12 p-0 col">
                                            <div className="bill_user_details flex_class mr-0">
                                              {bill.profilePic ? (
                                                <img
                                                  src={bill.profilePic}
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
                                                  {bill.buyerName +
                                                    "-" +
                                                    bill.shortName}
                                                </h6>
                                                <div className="d-flex align-items-center">
                                                  <h6 className="mobile">
                                                    {getPartnerType(
                                                      bill.partyType,
                                                      bill.trader
                                                    ) +
                                                      "-" +
                                                      bill.buyerId}
                                                  </h6>
                                                  <h6 className="mobile desk_responsive">
                                                    &nbsp;
                                                    {" |  " +
                                                      getMaskedMobileNumber(
                                                        bill.mobile
                                                      )}
                                                  </h6>
                                                </div>
                                                <h6 className="mobile mobile_responsive">
                                                  {getMaskedMobileNumber(
                                                    bill.mobile
                                                  )}
                                                </h6>
                                                <h6 className="address">
                                                  {bill.buyerAddress}
                                                </h6>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-lg-5 col-sm-12 billid_div">
                                            <div className="d-flex align-items-center billid_div_flex">
                                              <div className="text-left">
                                                <p className="biilid">
                                                  {langFullData.billNo} :{" "}
                                                  {bill.caBSeq}{" "}
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
                                                  {bill?.paid == true ? (
                                                    <div className="flex_class">
                                                      <div className="complete-dot"></div>
                                                      <div className="bill-name">
                                                        {getText(
                                                          "Amount Received"
                                                        )}
                                                      </div>
                                                    </div>
                                                  ) : (
                                                    <div className="flex_class p-0">
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
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-6 p-0">
                                        {bill.lineItems.map((crop, index) => (
                                          <div
                                            className="row crops_row_bills"
                                            key={index}
                                          >
                                            <div className="col-lg-4 col-sm-12 col">
                                              <p className="flex_class crop_name">
                                                <img
                                                  src={crop.imageUrl}
                                                  className="crop_image"
                                                />
                                                {crop.cropName}
                                              </p>
                                            </div>
                                            <div className="col-lg-4 col-sm-12 col flex_class">
                                              <div
                                                className="d-flex align-items-center"
                                                style={{ height: "100%" }}
                                              >
                                                <div>
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
                                                  {crop.bags !== null &&
                                                  crop.bags.length > 0 ? (
                                                    <div className="flex_class">
                                                      <input
                                                        type="checkbox"
                                                        checked={true}
                                                        id="modal_checkbox"
                                                        value="my-value"
                                                        className="checkbox_t"
                                                      />
                                                      <p className="inv-weight">
                                                        Individual Weights
                                                        <span className="bags-data">
                                                          <div className="bags-values">
                                                            {crop.bags.map(
                                                              (item) => {
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
                                                            ) + "KGS"}
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
                                        ))}
                                      </div>
                                      <div className="col-lg-2 flex_class">
                                        <div
                                          className="row"
                                          style={{ width: "100%" }}
                                        >
                                          <div className="d-flex col-lg-12 col-sm-12 col last_col justify-content-between">
                                            <p className="crop_name payble_text color_green">
                                              {getCurrencyNumberWithOutSymbol(
                                                bill.totalReceivable
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
                          ) : (
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
                                      No bills available for today. <br></br>
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
      </div>
      {showDatepickerModal1 ? (
        <DatePickerModel
          show={showDatepickerModal}
          prevNextDate={currentDate}
          close={() => setShowDatepickerModal(false)}
          parentCallback={callbackFunction}
          defaultDate={billViiewDate}
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
      {showBillModalStatus ? (
        <BillView
          showBillViewModal={showBillModal}
          closeBillViewModal={() => setShowBillModal(false)}
          allBillsData={sellBillData}
          fromLedger={false}
          fromBillbookToRecordPayment={true}
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
    </div>
  );
};
export default SellBillBook;
