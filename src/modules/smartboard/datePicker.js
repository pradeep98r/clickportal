import React, { Component, useEffect, useState } from "react";
// import "../buy_bill_book/buyBillBook.scss";
import close from "../../assets/images/close.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import $ from "jquery";
import "../../assets/css/calender.scss";
import { Modal } from "react-bootstrap";
import moment from "moment";
import date_icon from "../../assets/images/date_icon.svg";

function DatePickerModel(props) {
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
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    localStorage.setItem("billViiewSttatus", false);
    console.log(props.billViiewDate);
    setLoading(false);
  }, []);

  const [startDate, setStartsDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const onChangeDate = (dates) => {
    const [start, end] = dates;
    setStartsDate(start);
    setEndDate(end);
  };
  const [selectedMonthDate, setSelectedMonthDate] = useState(new Date());
  const [selectedYearDate, setSelectedyearDate] = useState(new Date());

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
  // Getter
  var hideIfNoPrevNext = $(".week-picker").datepicker(
    "option",
    "hideIfNoPrevNext"
  );

  // Setter
  $(".week-picker").datepicker("option", "hideIfNoPrevNext", true);
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
      showOtherMonths: false,
      selectOtherMonths: false,
      maxDate: new Date(),
      // showOtherMonths: true,
      // selectOtherMonths: true,
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
        var weekFdate = moment(startWeekDate, "DD-MMM-YYYY");
        var weekLdate = moment(endWeekDate).format("YYYY-MMM-DD");
        console.log(weekFdate, weekLdate, "Dates");
        setWeekFirstDate(weekFdate);
        setWeekLastDate(weekLdate);
        // moment(startWeekDate, "MM-DD-YYYY");
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

  //const [active, setActive] =useState(false);
  const [dateTabs, setDateTabs] = useState("Daily");
  const [selectedDate, setStartDate] = useState("");
  const onclickContinue = async (dateValue) => {
    var lastDay = new Date(
      dateValue.getFullYear(),
      dateValue.getMonth() + 1,
      0
    );
    var firstDate = moment(dateValue).format("YYYY-MM-DD");
    var lastDate = moment(lastDay).format("YYYY-MM-DD");
    if (dateTabs == "Daily") {
      lastDate = firstDate;
      props.parentCallback(firstDate, lastDate, dateTabs);
      props.close();
      console.log(firstDate, lastDate);
    } else if (dateTabs == "Weekly") {
      firstDate = weekFirstDate;
      lastDate = weekLastDate;
      console.log(firstDate, lastDate,"week");
      props.parentCallback(firstDate, lastDate, dateTabs);
      props.close();
    } else if (dateTabs == "Yearly") {
      const currentYear = dateValue.getFullYear();
      const firstDay = new Date(currentYear, 0, 1);
      lastDay = new Date(currentYear, 11, 31);
      firstDate = moment(firstDay).format("YYYY-MM-DD");
      lastDate = moment(lastDay).format("YYYY-MM-DD");
      console.log(firstDate, lastDate);
      props.parentCallback(firstDate, lastDate, dateTabs);
      props.close();
    } else if (dateTabs == "Monthly") {
      const currentYear = dateValue.getFullYear();
      const firstDay = new Date(currentYear, dateValue.getMonth(), 1);
      lastDay = new Date(currentYear, dateValue.getMonth() + 1, 0);
      firstDate = moment(firstDay).format("YYYY-MM-DD");
      lastDate = moment(lastDay).format("YYYY-MM-DD");
      console.log(firstDate, lastDate, dateTabs);
      props.parentCallback(firstDate, lastDate, dateTabs);
      props.close();
    } else if (dateTabs == "Custom") {
      firstDate = moment(startDate).format("YYYY-MM-DD");
      lastDate = moment(endDate).format("YYYY-MM-DD");
      props.parentCallback(firstDate, lastDate, dateTabs);
      props.close();
      console.log(firstDate, lastDate);
    }
  };

  // const onclickContinue = (date) =>{
  //   setLoading(false);
  //   console.log(date)
  //   //setSelectedDate(moment(date).format("YYYY-MM-DD"));
  //   var d = moment(date).format("YYYY-MM-DD") == '' ? moment(new Date()).format("YYYY-MM-DD") :moment(date).format("YYYY-MM-DD")
  //   props.parentCallback(d);
  //   props.close();
  //  window.location.reload();
  // }
  return (
    <Modal
      show={props.show}
      close={props.close}
      id="datePopupmodal"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="samrtboard_calender bills_calender"
    >
      <div className="modal-header date_modal_header">
        <h5 className="modal-title header2_text" id="staticBackdropLabel">
          Select{" "}
          {dateTabs == "Daily"
            ? "Date"
            : dateTabs == "Weekly"
            ? "Week"
            : dateTabs == "Monthly"
            ? "Month"
            : dateTabs == "Year"}
        </h5>
        <img
          src={close}
          alt="image"
          className="close_icon"
          onClick={props.close}
          data-bs-dismiss="modal"
        />
      </div>
      <div className="modal-body date_modal_mody">
        <div className="calender_popup">
          <div className="row">
            <div className="dates_div">
              <p className="flex_class">
                <input
                  type="radio"
                  id="tab1"
                  name="tab"
                  value="Daily"
                  onChange={(e) => {
                    setDateTabs(e.target.value);
                  }}
                  checked={dateTabs === "Daily"}
                  className="radioBtnVal m-0 mr-1"
                />
                <label htmlFor="tab1">Daily</label>
              </p>
              <div className="flex_class">
                <input
                  type="radio"
                  className="radioBtnVal m-0 mr-1"
                  id="tab4"
                  name="tab"
                  value={"Weekly"}
                  onChange={(e) => {
                    setDateTabs(e.target.value);
                  }}
                  checked={dateTabs === "Weekly"}
                />
                <label htmlFor="tab4">Weekly</label>
              </div>
              <div className="flex_class">
                <input
                  type="radio"
                  id="tab2"
                  name="tab"
                  value={"Monthly"}
                  onChange={(e) => {
                    setDateTabs(e.target.value);
                  }}
                  className="radioBtnVal m-0 mr-1"
                  checked={dateTabs === "Monthly"}
                />
                <label htmlFor="tab2">Monthly</label>
              </div>
              <div className="flex_class">
                {" "}
                <input
                  type="radio"
                  id="tab3"
                  name="tab"
                  value={"Yearly"}
                  onChange={(e) => {
                    setDateTabs(e.target.value);
                  }}
                  className="radioBtnVal m-0 mr-1"
                  checked={dateTabs === "Yearly"}
                />
                <label htmlFor="tab3">Yearly</label>
              </div>

              <div className="flex_class">
                <input
                  type="radio"
                  id="tab5"
                  name="tab"
                  value={"Custom"}
                  onChange={(e) => {
                    setDateTabs(e.target.value);
                  }}
                  className="radioBtnVal m-0 mr-1"
                  checked={dateTabs === "Custom"}
                />
                <label htmlFor="tab5">Custom</label>
              </div>
            </div>
            <article
              className={"date_picker"}
              style={{ display: dateTabs === "Daily" ? "block" : "none" }}
            >
              <DatePicker
                dateFormat="yyyy-MMM-dd"
                selected={selectedDate}
                onChange={(date) => setStartDate(date)}
                className="form-control"
                placeholder="Date"
                maxDate={new Date()}
                inline
                disabledKeyboardNavigation
              />
            </article>
            <article
              className="week_picker p-0"
              style={{ display: dateTabs === "Weekly" ? "block" : "none" }}
            >
              <div className="week_cal">
                <div className="week-picker"></div>
              </div>
            </article>
            <article
              className="month_picker"
              style={{ display: dateTabs === "Monthly" ? "block" : "none" }}
            >
              <DatePicker
                dateFormat="MM/yyyy"
                showMonthYearPicker
                showFullMonthYearPicker
                selected={selectedMonthDate}
                onChange={(date) => setSelectedMonthDate(date)}
                className="form-control"
                placeholder="Date"
                maxDate={new Date()}
                showThreeColumnMonthYearPicker
                inline
                disabledKeyboardNavigation
              />
            </article>
            <article
              className="yearly"
              style={{ display: dateTabs === "Yearly" ? "block" : "none" }}
            >
              <h2>
                <DatePicker
                  selected={selectedYearDate}
                  onChange={(date) => setSelectedyearDate(date)}
                  showYearPicker
                  dateFormat="yyyy"
                  className="form-control"
                  maxDate={new Date()}
                  showFourColumnMonthYearPicker
                  inline
                  disabledKeyboardNavigation
                />
              </h2>
            </article>

            <article
              className="custom_picker"
              style={{ display: dateTabs === "Custom" ? "block" : "none" }}
            >
              <div className="flex_class justify-content-between custom_input_div mr-0">
                <div className="d-flex align-items-center">
                  <p>From</p>
                  <div className="d-flex date_flex">
                    <img src={date_icon} className="d_icon" />
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartsDate(date)}
                      popperClassName="d-none"
                      dateFormat="dd-MMM-yyyy"
                      placeholderText="Select from date"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <p>To</p>
                  <div className="d-flex date_flex">
                    <img src={date_icon} className="d_icon" />
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      popperClassName="d-none"
                      dateFormat="dd-MMM-yyyy"
                      placeholderText="Select to date"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      // className="date_in_custom"
                    />
                  </div>
                </div>
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
        <button
          type="button"
          className="primary_btn cont_btn w-100 m-0"
          onClick={() => {
            onclickContinue(
              dateTabs == "Daily"
                ? selectedDate
                : dateTabs == "Yearly"
                ? selectedYearDate
                : selectedMonthDate
            );
          }}
        >
          Continue
        </button>
      </div>
    </Modal>
  );
}
export default DatePickerModel;
