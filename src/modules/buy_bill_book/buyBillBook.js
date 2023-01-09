import React, { Component, useEffect, useState } from "react";
import "../buy_bill_book/buyBillBook.scss";
import { qtyValues } from "../../components/qtyValues";
import single_bill from "../../assets/images/bills/single_bill.svg";
import multi_bills from "../../assets/images/bills/multi_bills.svg";
import { Link, useNavigate, generatePath } from "react-router-dom";
import { getBuyBills } from "../../actions/billCreationService";
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
import { getText } from "../../components/getText";
import Steps from "./steps";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithOneDigit,
} from "../../components/getCurrencyNumber";
import { useDispatch } from "react-redux";
import { selectSteps } from "../../reducers/stepsSlice"
function BuyBillBook() {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const [allData, setAllData] = useState([]);
  const [buyBillData, setBuyBillData] = useState(allData);
  const [isLoading, setLoading] = useState(true);
  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);
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
    console.log(fromDate, toDate, "billbook");
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
    console.log("heyyy");
    getBuyBills(clickId, fromDate, toDate)
      .then((response) => {
        console.log(response.data.data, "billsss");
        if (response.data.data != null) {
          setAllData(response.data.data);
          setBuyBillData(response.data.data.singleBills);
        } else {
          setBuyBillData([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        console.log(error);
      });
  };
  const navigate = useNavigate();
  var billViewStatus = false;
  const billOnClick = (id, bill) => {
    billViewStatus = true;
    localStorage.setItem("billViewStatus", billViewStatus);
    navigate(generatePath(`/bill_view/${id}`, { id }));
    localStorage.setItem("billId", id);
    localStorage.setItem("selectedBillData", JSON.stringify(bill));
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
    dispatch(selectSteps('step1'))
  };

  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = allData.singleBills.filter((data) => {
      if (data.farmerName.toLowerCase().includes(value)) {
        return data.farmerName.toLowerCase().search(value) != -1;
      } else if (data.shortName.toLowerCase().includes(value)) {
        return data.shortName.toLowerCase().search(value) != -1;
      } else if (data.farmerId.toString().includes(value)) {
        return data.farmerId.toString().search(value) != -1;
      }
    });
    setBuyBillData(result);
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
              {isLoading ? (
                <div className="">
                  <img src={loading} alt="my-gif" className="gif_img" />
                </div>
              ) : (
                <div>
                  <div>
                    <div className="d-flex justify-content-between bills_div">
                      <div className="d-flex">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
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
                        </ul>
                      </div>
                      <div onClick={onclickDate} className="color_blue">
                        <span className="date_icon m-0">
                          <img src={date_icon} alt="icon" className="mr-2" />
                        </span>
                        {dateValue}
                      </div>
                      <div className="d-flex">
                        <BillsSearchField
                          placeholder={langFullData.search}
                          onChange={(event) => {
                            handleSearch(event);
                          }}
                        />

                        <a
                          className="primary_btn add_bills_btn"
                          // href="/step1"
                          onClick={handleStep1Header}
                        >
                          {langFullData.singleBill}
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
                          {buyBillData.length > 0 ? (
                            <div>
                              <div className="row header_row">
                                <div className="col-lg-4">
                                  <div className="row">
                                    <div className="col-lg-7 col-sm-12 p-0">
                                      <p>{langFullData.seller}</p>
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
                                      <p>{langFullData.totalPayables} (₹)</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="buy_bills" id="scroll_style">
                                {buyBillData.map((bill, index) => (
                                  <div
                                    onClick={() =>
                                      billOnClick(bill.billId, bill)
                                    }
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
                                                  {bill.farmerName +
                                                    "-" +
                                                    bill.shortName}
                                                </h6>
                                                <h6 className="mobile">
                                                  {bill.partyType +
                                                    "-" +
                                                    bill.farmerId}
                                                </h6>
                                                <h6 className="address">
                                                  {bill.farmerAddress}
                                                </h6>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-lg-5 col-sm-12 billid_div">
                                            <p className="biilid">
                                              {langFullData.billNo}:{" "}
                                              {bill.billId}{" "}
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
                                                    : "#16a02c",
                                              }}
                                            >
                                              {getText(bill.billStatus)}
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
                                              {/* {crop.qtyUnit+crop.qty} */}
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
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <NoDataAvailable />
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
          close={() => setShowDatepickerModal(false)}
          parentCallback={callbackFunction}
        />
      ) : (
        <p></p>
      )}
      {showStepsModalStatus ? (
        <Steps showStepsModal={showStepsModal} closeStepsModal={() => setShowStepsModal(false)} />
      ) : (
        ""
      )}
    </div>
  );
}
export default BuyBillBook;
