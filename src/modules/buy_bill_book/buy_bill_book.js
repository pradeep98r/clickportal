import React, { Component, useEffect, useState } from "react";
import "../buy_bill_book/buy_bill_book.scss";
import Button from "../../components/button";
import single_bill from "../../assets/images/bills/single_bill.svg";
import multi_bills from "../../assets/images/bills/multi_bills.svg";
import { Link, useNavigate, generatePath } from "react-router-dom";
import { getBuyBills } from "../../services/billCreationService";
import close from "../../assets/images/close.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import $ from "jquery";
function BuyBillBook() {
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
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const clientId = loginData.authKeys.clientId;
  const clientSecret = loginData.authKeys.clientSecret;
  const [buyBillData, setBuyBillData] = useState([]);
  useEffect(() => {
    getAllBuyBills();
  }, []);
  const getAllBuyBills = () => {
    getBuyBills(clickId, clientId, clientSecret)
      .then((response) => {
        setBuyBillData(response.data.data);
        console.log(response.data.data, "billsss");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [billItem, setSelectBill] = useState("");
  const navigate = useNavigate();
  const billOnClick = (id, bill) => {
    navigate(generatePath(`/bill_view/${id}`, { id }));
    localStorage.setItem("billId", id);
    localStorage.setItem("selectedBillData", JSON.stringify(bill));
  };
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const onChangeDate = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  return (
    <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
          {buyBillData.length > 0 ? (
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
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#profile"
                        role="tab"
                        aria-controls="profile"
                        data-bs-toggle="tab"
                      >
                        Completed
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#messages"
                        role="tab"
                        aria-controls="messages"
                        data-bs-toggle="tab"
                      >
                        Pending
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#settings"
                        role="tab"
                        aria-controls="settings"
                        data-bs-toggle="tab"
                      >
                        Cancelled
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="d-flex">
                  <div data-bs-toggle="modal" data-bs-target="#date_popup">
                    date
                  </div>
                  <div className="d-flex me-3" role="search">
                    <input
                      className="form-control search"
                      type="search"
                      placeholder="Search"
                      aria-label="Search"
                      onChange={(event) => setSelectBill(event.target.value)}
                    />
                  </div>
                  <div className="dropdown">
                    <button
                      className="primary_btn add_bills_btn dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Add Bill
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <li>
                        <a className="dropdown-item" href="/bill_creation">
                          Single Bill
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Multi Bills
                        </a>
                      </li>
                    </ul>
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
                            <p>Seller</p>
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
                            <p>Total Payables (₹)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="buy_bills" id="scroll_style">
                      {buyBillData
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
                              <div className="col-lg-4 col ps-0 flex_class">
                                <div className="row full_width">
                                  <div className="col-lg-7 col-sm-12 p-0 col">
                                    <div className="bill_user_details flex_class">
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
                                          {bill.partyType + "-" + bill.farmerId}
                                        </h6>
                                        <h6 className="address">
                                          {bill.farmerAddress}
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
                                        {crop.qtyUnit + ":" + crop.qty} |
                                        Weight:{" "}
                                        {crop.weight == null
                                          ? "0"
                                          : crop.weight}
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
                                      {bill.totalPayables}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div
                    className="tab-pane"
                    id="profile"
                    role="tabpanel"
                    aria-labelledby="profile-tab"
                  >
                    Profile...
                  </div>
                  <div
                    className="tab-pane"
                    id="messages"
                    role="tabpanel"
                    aria-labelledby="messages-tab"
                  >
                    Messages...
                  </div>
                  <div
                    className="tab-pane"
                    id="settings"
                    role="tabpanel"
                    aria-labelledby="settings-tab"
                  >
                    Settings...
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card default_card text-center">
              <div className="row no_data_row">
                <div className="col-lg-6 col1">
                  <div>
                    <img src={single_bill} alt="image" className="flex_class" />
                    <p>
                      Lorem ipsum is placeholder text commonly used in the
                      graphic
                    </p>
                    <Link to="/bill_creation">
                      <Button text="Single Bill" />
                    </Link>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div>
                    <img src={multi_bills} alt="image" className="flex_class" />
                    <p>
                      Lorem ipsum is placeholder text commonly used in the
                      graphic
                    </p>
                    <Button text="Multi Bill" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className="modal fade"
        id="date_popup"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
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
                      <label for="tab1">Daily</label>
                    </div>
                    <div className="flex_class">
                      <input type="radio" id="tab2" name="tab" />
                      <label for="tab2">Monthly</label>
                    </div>
                    <div className="flex_class">
                      {" "}
                      <input type="radio" id="tab3" name="tab" />
                      <label for="tab3">Yearly</label>
                    </div>
                    <div className="flex_class">
                      <input type="radio" id="tab3" name="tab" />
                      <label for="tab3">Weekly</label>
                    </div>
                    <div className="flex_class">
                      <input type="radio" id="tab3" name="tab" />
                      <label for="tab3">Custom</label>
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
                  <article>week</article>
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
  );
}
export default BuyBillBook;
