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

  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);
  console.log(langFullData);

  useEffect(() => {
    callbackFunction();
  }, []);

  var dateValue = moment(new Date()).format("YYYY-MM-DD");

  const callbackFunction = (startDate, endDate) => {
    var fromDate = moment(startDate).format("YYYY-MM-DD");
    var toDate = moment(endDate).format("YYYY-MM-DD");
    dateValue=fromDate
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
  var billViewStatus = false

  const billOnClick = (id, bill) => {
    billViewStatus = true;
    localStorage.setItem("billViewStatus",billViewStatus);
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
  var stepOneHeader=false
  const handleStep1Header = () =>{
    stepOneHeader=true;
    localStorage.setItem("stepOneSingleBook",stepOneHeader); 
  }
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

  const [singleBillData, setSingleBillData] = useState([]);
  const [valueActive, setIsValueActive] = useState(false);

  const searchInput = (searchValue) => {
    setSelectBill(searchValue);
    if(billItem !== ""){
      const filteredItems = sellBillData.singleBills.filter((item)=>{
        console.log(item);
        if(
          item.buyerName.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.shortName.toLowerCase().includes(searchValue.toLowerCase())
        ){
          return(
            item.buyerName.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.shortName.toLowerCase().includes(searchValue.toLowerCase())
          )
        }else if (billItem === "" || searchValue === "") {
          return setIsValueActive(false);
        } else {
          return setIsValueActive(true);
        }
      })
      setSingleBillData(filteredItems);
      console.log(singleBillData);
    }else{
      setSingleBillData(sellBillData);
    }
  }
  return (
    <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
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
                      {dateValue}
                    </div>
                    <div className="d-flex">
                      <div className="d-flex mx-3" role="search">
                        <input
                          className="form-control search"
                          type="search"
                          placeholder={langFullData.search}
                          aria-label="Search"
                          onChange={(event) => searchInput(event.target.value)}
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
                          {langFullData.addBill}
                        </button>

                        <div className="dropdown-menu">
                          <a className="dropdown-item" href="/sellbillstep1" onClick={handleStep1Header}>
                          {langFullData.singleBill}
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
                          {billItem.length > 1 && singleBillData!==null
                            ? singleBillData
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
                                          {langFullData.billNo} : {bill.billId}{" "}
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
                                            {crop.qty + getCropUnit(crop.qtyUnit)}
                                            | {crop.weight + "KGS"}
                                            <span className="color_red">
                                              {crop.wastage != 0
                                                ? " - " + crop.wastage + langFullData.kgs
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
                            )):
                            (sellBillData.singleBills
                              .map((bill, index) => (
                                <div
                                  onClick={() =>
                                    billOnClick(bill.billId, bill)
                                  }
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
                                                {bill.farmerAddress}
                                              </h6>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-lg-5 col-sm-12 billid_div">
                                          <p className="biilid">
                                            {langFullData.billNo} : {bill.billId}{" "}
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
                                                getCropUnit(
                                                  crop.qtyUnit
                                                )}{" "}
                                              | {crop.weight + "KGS"}
                                              <span className="color_red">
                                                {crop.wastage != 0
                                                  ? " - " +
                                                    crop.wastage +
                                                    langFullData.kgs
                                                  : ""}{" "}
                                              </span>
                                              {/* {crop.qtyUnit + ":" + crop.qty}  */}
                                              {/* |
                                        Weight:{" "}
                                        {crop.weight == null
                                          ? "0"
                                          : crop.weight} */}
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
                                            {bill.actualPaybles}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )
                          }
                          <div
                          id="search-data"
                            style={{
                              display:billItem.length > 0 ? "block" : "none",
                            }}
                            >
                            <NoDataAvailable />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
    </div>
  );
};
export default SellBillBook;
