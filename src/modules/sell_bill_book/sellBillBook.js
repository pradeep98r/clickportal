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
import { getText } from "../../components/getText";
import { qtyValues } from "../../components/qtyValues";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithOneDigit,
} from "../../components/getCurrencyNumber";
import { useDispatch, useSelector } from "react-redux";
import { billViewInfo } from "../../reducers/billViewSlice"
import { selectSteps } from "../../reducers/stepsSlice";
import { selectBuyer } from "../../reducers/buyerSlice"
import Steps from "../buy_bill_book/steps";
import { fromBillbook } from "../../reducers/billEditItemSlice";
import no_data_icon from "../../assets/images/NodataAvailable.svg";
import addbill_icon from "../../assets/images/addbill.svg";
import NoInternetConnection from "../../components/noInternetConnection";
import BillView from "../buy_bill_book/billView";
const SellBillBook = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const [allData, setAllData] = useState([]);
  const [sellBillData, setSellBillData] = useState(allData);
  const [isLoading, setLoading] = useState(true);
  const [isOnline, setOnline] = useState(false);
  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);
  const billViiewSttatus = localStorage.getItem("billViiewSttatus");
  const billViiewDate = localStorage.getItem("billDate");
  var bDate = props.selectedBillviewDate ? props.selectedBillviewDate : '';
  
  const  billData = useSelector((state)=> state.billViewInfo);
  // console.log(billViiewDate)
  const dispatch = useDispatch();
  useEffect(() => {
    callbackFunction();
    setDateValue(moment(new Date()).format("DD-MMM-YYYY"));
  }, []);
  var [dateValue, setDateValue] = useState();
  window.addEventListener('load', function(event) {
    // bDate = '';
  });
  const callbackFunction = (startDate, endDate, dateTab) => {
    var fromDate = moment(bDate ? bDate :startDate).format("YYYY-MM-DD");
    var toDate = moment(bDate ? bDate :endDate).format("YYYY-MM-DD");
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

    getSellBills(clickId, fromDate, toDate)
      .then((response) => {
        console.log(response.data.data);
        if (response.data.data != null) {
          setAllData(response.data.data);
          setSellBillData(response.data.data.singleBills);
        } else {
          setSellBillData([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        if(error.message.toUpperCase() == 'NETWORK ERROR'){
          setOnline(true);
        }
        setOnline(true);
        console.log(error);
      });
  };

  const [billItem, setSelectBill] = useState("");
  const navigate = useNavigate();
  var billViewStatus = false;
  const [showBillModalStatus, setShowBillModalStatus] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const billOnClick = (id, bill) => {
    billViewStatus = true;
    localStorage.setItem("billViewStatus", billViewStatus);
    // navigate(generatePath(`/sell_bill_view/${id}`, { id }));
    // navigate(generatePath(`/bill_view/${id}`, { id }))
    setShowBillModalStatus(true);
    setShowBillModal(true);
    localStorage.setItem("billId", id);
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
    dispatch(selectSteps('step1'))
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
    setSellBillData(result);
  };
  return (
    <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
        {isOnline?<NoInternetConnection />:
          <div>
          {isLoading ? (
            <div className="">
              <img src={loading} alt="my-gif" className="gif_img" />
            </div>
          ) : (
            <div>
              <div>
                <div className="d-flex justify-content-between bills_div">
                  <div className="d-flex">
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
                  </div>

                  <div onClick={onclickDate} className="color_blue">
                    <span className="date_icon m-0">
                      <img src={date_icon} alt="icon" className="mr-2" />
                    </span>
                    {dateValue}
                  </div>
                  <div className="d-flex">
                    {/* <BillsSearchField
                      placeholder={langFullData.search}
                      onChange={(event) => {
                        handleSearch(event);
                      }}
                    /> */}
                    <a
                      className="primary_btn add_bills_btn"
                      // href="/sellbillstep1"
                      onClick={handleStep1Header}
                    >
                      <img src={addbill_icon} alt="image" className="mr-2" />
                      ADD BILL
                    </a>
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
                            <div className="col-lg-2">
                              <div className="row">
                                <div className="col-lg-12 col-sm-12">
                                  <p>{langFullData.totalReceivables} (₹)</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="buy_bills" id="scroll_style">
                            {sellBillData.map((bill, index) => (
                              <div
                                onClick={() => billOnClick(bill.caBSeq, bill)}
                                key={index}
                                className="billsDiv"
                              >
                                <div className="row bills_rows bg_white bottom_space">
                                  <div className="col-lg-4 col ps-0 flex_class p-0 mr-0">
                                    <div className="row full_width">
                                      <div className="col-lg-7 col-sm-12 p-0 col">
                                        <div className="bill_user_details flex_class mr-0">
                                          <img
                                            src={single_bill}
                                            className="user_icon"
                                            alt="icon"
                                          />
                                          <div>
                                            <h6 className="userName">
                                              {bill.buyerName +
                                                "-" +
                                                bill.shortName}
                                            </h6>
                                            <h6 className="mobile">
                                              {bill.partyType +
                                                "-" +
                                                bill.buyerId}
                                            </h6>
                                            <h6 className="address">
                                              {bill.buyerAddress}
                                            </h6>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-5 col-sm-12 billid_div">
                                        <p className="biilid">
                                          {langFullData.billNo} : {bill.caBSeq}{" "}
                                        </p>
                                        <p>
                                          {moment(bill.billDate).format(
                                            "DD-MMM-YYYY"
                                          )}
                                        </p>
                                        <p
                                              style={{
                                                color:
                                                  bill.billStatus == "CANCELLED"
                                                    ? "#d43939"
                                                    : "#1C1C1C",
                                              }}
                                              >
                                              <div className="flex_class">
                                              {bill.billStatus == "CANCELLED"?
                                              <img src={cancel} width="10px" height="10px" />:
                                                <div className="complete-dot"></div>
                                                }
                                                <div className="bill-name">{getText(bill.billStatus)}</div>
                                              </div>
                                            </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 p-0">
                                    {bill.lineItems.map((crop, index) => (
                                      <div className="row" key={index}>
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
                              </div>
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
                                      className="primary_btn"
                                      onClick={handleStep1Header}
                                    >
                                      Add Bill
                                      
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
          }
        </div>
      </div>
      {showDatepickerModal1 ? (
        <DatePickerModel
          show={showDatepickerModal}
          close={() => setShowDatepickerModal(false)}
          parentCallback={callbackFunction}
          defaultDate={billViiewDate}
        />
      ) : (
        <p></p>
      )}
      {showStepsModalStatus ? (
        <Steps showStepsModal={showStepsModal} closeStepsModal={() => setShowStepsModal(false)} />
      ) : (
        ""
      )}
       {showBillModalStatus ? (
        <BillView
        showBillViewModal={showBillModal}
        closeBillViewModal={() => setShowBillModal(false)}
        allBillsData ={sellBillData}
        />
      ) : (
        ""
      )}
    </div>
  );
};
export default SellBillBook;
