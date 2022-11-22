import React, { Component, useEffect, useState } from "react";
import "../buy_bill_book/buyBillBook.scss";
import Button from "../../components/button";
import single_bill from "../../assets/images/bills/single_bill.svg";
import multi_bills from "../../assets/images/bills/multi_bills.svg";
import { Link, useNavigate, generatePath } from "react-router-dom";
import { getSellBills } from "../../actions/billCreationService";
import close from "../../assets/images/close.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import $ from "jquery";
import date_icon from "../../assets/images/date_icon.svg";
import DatePickerModel from "../smartboard/datePicker";
import "../../assets/css/calender.scss";
import loading from "../../assets/images/loading.gif";
import SelectCrop from "../buy_bill_book/selectCrop";
import NoDataAvailable from "../../components/noDataAvailable";

const SellBillBook = () => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const [sellBillData, setSellBillData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    callbackFunction();
  }, []);

  var [dateValue, setDateValue] = useState(moment(new Date()).format("DD-MMM-YYYY"));

  const callbackFunction = (startDate, endDate,dateTab) => {
    var fromDate = moment(startDate).format("YYYY-MM-DD");
    var toDate = moment(endDate).format("YYYY-MM-DD");
    dateValue=fromDate
    if(dateTab === "Daily"){
      setDateValue(moment(fromDate).format("DD-MMM-YYYY"));
    } else if(dateTab === "Weekly"){
      setDateValue(moment(fromDate).format("DD-MMM-YYYY")+" to "+moment(toDate).format("DD-MMM-YYYY"))
    } else if(dateTab === "Monthly"){
      setDateValue(moment(fromDate).format("MMM-YYYY"));
    } else if(dateTab === "Yearly"){
      console.log("yearly",dateTab)
      setDateValue(moment(fromDate).format("YYYY"));
    }else{
      setDateValue(moment(fromDate).format("DD-MMM-YYYY")+" to "+moment(toDate).format("DD-MMM-YYYY"))
    }
    getSellBills(clickId, fromDate, toDate)
      .then((response) => {
        console.log(response, "billsss");
        console.log(response.data.data, "billsss");
        setSellBillData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [billItem, setSelectBill] = useState("");
  const navigate = useNavigate();
  var billViewStatus = false;

  const billOnClick = (id, bill) => {
    billViewStatus = true;
    localStorage.setItem("billViewStatus", billViewStatus);
    navigate(generatePath(`/bill_view/${id}`, { id }));
    localStorage.setItem("billId", id);
    localStorage.setItem("selectedBillData", JSON.stringify(bill));
  };

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showDatepickerModal, setShowDatepickerModal] = useState(false);
  const [showDatepickerModal1, setShowDatepickerModal1] = useState(false);
  const onclickDate = () => {
    setShowDatepickerModal1(true);
    setShowDatepickerModal(true);
  };
  // const onChangeDate = (dates) => {
  //   const [start, end] = dates;
  //   setStartDate(start);
  //   setEndDate(end);
  // };
  var stepOneHeader = false;
  const handleStep1Header = () => {
    stepOneHeader = true;
    localStorage.setItem("stepOneSingleBook", stepOneHeader);
    console.log(stepOneHeader);
    navigate("/sellbillstep1");
  };
  const getCropUnit = (unit) => {
    console.log(unit);
    var unitType = "";
    switch (unit) {
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
  const businessCreatedStatus =
  localStorage.getItem("businessCreatedStatus") != null
    ? localStorage.getItem("businessCreatedStatus")
    : "";
  return (
    <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
        {loginData.businessCreated === false && businessCreatedStatus == '' ? (
            <div className="row">
              <div className="col-lg-9 smartboard_div p-0">
                <div className="complete_profile d-flex justify-content-between align-items-center">
                  <p>Complete your Mandi Setup</p>
                  
                  
                </div>
                <NoDataAvailable />
              </div>
              <div className="col-lg-3"></div>
            </div>
          ):
         <div>
         {isLoading ? (
            <div className="">
              <img src={loading} alt="my-gif" className="gif_img" />
            </div>
          ) : (
            <div>
              {sellBillData != null ? (
                sellBillData.singleBills.length > 0 && (
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
                              All
                            </a>
                          </li>
                        </ul>
                      </div>

                      <div onClick={onclickDate} className="color_blue">
                    <span className="date_icon m-0"><img src={date_icon} alt="icon" className="mr-2" />
                    </span>{dateValue}
                    </div>
                      <div className="d-flex">
                        <div className="d-flex mx-3" role="search">
                          <input
                            className="form-control search"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            onChange={(event) =>
                              setSelectBill(event.target.value)
                            }
                          />
                        </div>
                        <div className="dropdown">
                          <button
                            className="primary_btn add_bills_btn dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton1"
                            data-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Add Bill
                          </button>

                          <div className="dropdown-menu">
                            <a
                              className="dropdown-item"
                              href="/sellbillstep1"
                              onClick={handleStep1Header}
                            >
                              Single Bill
                            </a>
                          </div>
                        </div>
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
                          <div className="row header_row">
                            <div className="col-lg-4">
                              <div className="row">
                                <div className="col-lg-7 col-sm-12 p-0">
                                  <p>Buyer</p>
                                </div>
                                <div className="col-lg-5 col-sm-12">
                                  <p>Bill ID</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 p-0">
                              <div className="row">
                                <div className="col-lg-4 col-sm-12">
                                  <p>Particulars</p>
                                </div>
                                <div className="col-lg-4 col-sm-12">
                                  <p>Qty. </p>
                                </div>
                                <div className="col-lg-2 col-sm-12">
                                  <p>Rate (₹) </p>
                                </div>
                                <div className="col-lg-2 col-sm-12">
                                  <p>Total (₹)</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-2">
                              <div className="row">
                                <div className="col-lg-12 col-sm-12">
                                  <p>Total Recievables (₹)</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="buy_bills" id="scroll_style">
                            {sellBillData.singleBills
                              .filter((bill) => {
                                if (billItem === "") {
                                  return bill;
                                } else if (
                                  bill.farmerName
                                    .toLowerCase()
                                    .includes(billItem.toLowerCase())
                                ) {
                                  return bill;
                                } else if (
                                  bill.shortName
                                    .toLowerCase()
                                    .includes(billItem.toLowerCase())
                                ) {
                                  return bill;
                                }
                              })
                              .map((bill, index) => (
                                <div
                                  onClick={() => billOnClick(bill.billId, bill)}
                                  key={index}
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
                                            Bill No : {bill.billId}{" "}
                                          </p>
                                          <p>{bill.billDate}</p>
                                          <p>{bill.billStatus}</p>
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
                                            <p className="crop_name">
                                              {crop.qty +
                                                getCropUnit(crop.qtyUnit)}
                                              | {crop.weight + "KGS"}
                                              <span className="color_red">
                                                {crop.wastage != 0
                                                  ? " - " + crop.wastage + "KGS"
                                                  : ""}{" "}
                                              </span>
                                            </p>
                                          </div>
                                          <div className="col-lg-2 col-sm-12 col flex_class">
                                            <p className="number_overflow crop_name">
                                              {crop.rate}
                                            </p>
                                          </div>
                                          <div className="col-lg-2 col-sm-12 col flex_class">
                                            <p className="number_overflow crop_name">
                                              {crop.total}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="col-lg-2 flex_class">
                                      <div className="row">
                                        <div className="col-lg-12 col-sm-12 col last_col">
                                          <p className="crop_name payble_text">
                                            {bill.actualReceivable}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="card default_card text-center">
                  <div className="row no_data_row">
                    <div className="col-lg-6 col1">
                      <div>
                        <img
                          src={single_bill}
                          alt="image"
                          className="flex_class"
                        />
                        <p>
                          Lorem ipsum is placeholder text commonly used in the
                          graphic
                        </p>
                        <button
                          text="Single Bill"
                          className="primary_btn buttons d-flex mx-auto mt-3"
                          onClick={handleStep1Header}
                        >
                          Single Bill
                        </button>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div>
                        <img
                          src={multi_bills}
                          alt="image"
                          className="flex_class"
                        />
                        <p>
                          Lorem ipsum is placeholder text commonly used in the
                          graphic
                        </p>
                        <button
                          className="primary_btn buttons d-flex mx-auto mt-3"
                        
                        >
                          Multi Bill
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
        />
      ) : (
        <p></p>
      )}
    </div>
  );
};
export default SellBillBook;
