import React, { Component, useEffect, useState } from "react";
import close from "../../assets/images/close.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import $ from "jquery";
import "../../assets/css/calender.scss";
import { Modal } from "react-bootstrap";
import moment from "moment";
import date_icon from "../../assets/images/date_icon.svg";
import {dateCustomStatus} from "../../reducers/billEditItemSlice";
import { useDispatch,useSelector } from 'react-redux';
function DatePickerModel(props) {
  $("[name=tab]").each(function (i, d) {
    var p = $(this).prop("checked");
    if (p) {
      $("article").eq(i).addClass("on");
    }
  });
  $("[name=tab]").on("change", function () {
    var p = $(this).prop("checked");
    var i = $("[name=tab]").index(this);

    $("article").removeClass("on");
    $("article").eq(i).addClass("on");
  });
  var datev = '';
  const billEditItemInfo = useSelector((state) => state.billEditItemInfo);
  const [dateCustom, setDateCustom] = useState(billEditItemInfo?.dateCustom);
  const dispatch = useDispatch();
  useEffect(() => {
    localStorage.setItem("billViiewSttatus", false);
    // setDateCustom(props.dateCustom)
    console.log(billEditItemInfo?.dateCustom,link,props.ledgerTabs)
    if(link == "/buyerledger" ||
    link == "/sellerledger"){
      if(props.ledgerTabs == "detailedledger"){
        if(billEditItemInfo?.dateCustom){
          datev = 'Custom';
          console.log(endDate,startDate)
          setStartsDate(new Date());
          setEndDate(new Date());
          console.log('detailded')
         }
         else{
          datev = dateTabs
         }
      }
      
       else{
         if(props.ledgerTabs == "ledgersummary"){
          if(billEditItemInfo?.dateCustom){
            datev = 'Custom'
            setStartsDate(new Date());
            setEndDate(new Date());
            console.log('summary')
           }
           else{
            datev = dateTabs
           }
         }
         else{
          datev = dateTabs
         }
       }
    }
    else{
      datev = "Daily"
    }
    setDateTabs(datev);
  }, [props.show]);

  const [startDate, setStartsDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [sDate, setSDate] = useState(false);
  const [defaultDate, setDefaultDate] = useState(moment(new Date()).format("DD-MMM-YYYY"));
  const onChangeDate = (dates) => {
    const [start, end] = dates;
    console.log(start,end,dates)
    setStartsDate(start);
    setEndDate(end);
    if(end == null){
      setSDate(true);
      setDefaultDate(defaultDate)
      // setEndDate(new Date());
    }
    else{
      setSDate(false);
    }
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
        //moment(startWeekDate, "DD-MMM-YYYY");
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

  //const [active, setActive] =useState(false);
  const link = localStorage.getItem("LinkPath");
  const [dateTabs, setDateTabs] = useState(
    link == "/buyerledger" ||
      link == "/sellerledger" ||
      props.ledgerTabs == "detailedledger"
      ? "Custom"
      : "Daily"
  );
  const [selectedDate, setStartDate] = useState("");

  const dateOnchangeEvent = (date, type) => {
    if (type == "Daily") {
      setStartDate(date);
    } else if (type == "Monthly") {
      setSelectedMonthDate(date);
    } else if (type == "Yearly") {
      setSelectedyearDate(date);
    }
    onclickContinue(date);
  };
  const setToDefaultDate = () => {
    if (link == "/buyerledger" || link == "/sellerledger") {
      if (props.ledgerTabs == "detailedledger" || props.ledgerTabs == "ledgersummary") {
        if(billEditItemInfo?.dateCustom){
          console.log("customled")
        setDateTabs("Custom");
        }
        else{
          setDateTabs(dateTabs);
        }
        // setStartsDate(new Date());
        // setEndDate(new Date());
      }
    } else {
      setDateTabs("Daily");
    }
  };

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
      setDateTabs("Daily");
      setDateCustom(false);
      dispatch(dateCustomStatus(false));
    } else if (dateTabs == "Weekly") {
      firstDate = weekFirstDate;
      lastDate = weekLastDate;
      props.parentCallback(firstDate, lastDate, dateTabs);
      props.close();
      setDateTabs("Weekly");
      setDateCustom(false);
      dispatch(dateCustomStatus(false));
    } else if (dateTabs == "Yearly") {
      const currentYear = dateValue.getFullYear();
      const firstDay = new Date(currentYear, 0, 1);
      lastDay = new Date(currentYear, 11, 31);
      firstDate = moment(firstDay).format("YYYY-MM-DD");
      lastDate = moment(lastDay).format("YYYY-MM-DD");
      props.parentCallback(firstDate, lastDate, dateTabs);
      props.close();
      setDateTabs("Yearly");
      setDateCustom(false);
      dispatch(dateCustomStatus(false));
    } else if (dateTabs == "Monthly") {
      const currentYear = dateValue.getFullYear();
      const firstDay = new Date(currentYear, dateValue.getMonth(), 1);
      lastDay = new Date(currentYear, dateValue.getMonth() + 1, 0);
      firstDate = moment(firstDay).format("YYYY-MM-DD");
      lastDate = moment(lastDay).format("YYYY-MM-DD");
      props.parentCallback(firstDate, lastDate, dateTabs);
      props.close();
      setDateTabs("Monthly");
      setDateCustom(false);
      dispatch(dateCustomStatus(false));
    } else if (dateTabs == "Custom") {
      console.log(dateTabs,endDate)
      if(endDate != null){
        lastDate = moment(endDate).format("YYYY-MM-DD");
      }
      else{
        lastDate = moment(new Date()).format("YYYY-MM-DD");
        setEndDate(new Date());
        console.log(lastDate,"else")
      }
      firstDate = moment(startDate).format("YYYY-MM-DD");
      dispatch(dateCustomStatus(false));
      console.log(firstDate,lastDate)
      props.parentCallback(firstDate, lastDate, dateTabs);
      props.close();
      setDateTabs("Custom");
    }
  };

  const handleDateTabs = (e) =>{
    console.log(e.target.value);
    setDateTabs(e.target.value);
    setStartsDate(new Date());
    setEndDate(new Date());
    setSelectedMonthDate(new Date());
    setSelectedyearDate(new Date());

  }
  return (
    <Modal
      show={props.show}
      close={() => {
        setToDefaultDate();
        props.close();
      }}
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
            : dateTabs == "Yearly"
            ? "Year" : "Date"}
        </h5>
        <img
          src={close}
          alt="image"
          className="close_icon"
          onClick={() => {
            setToDefaultDate();
            props.close();
          }}
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
                  onChange={(e) => {handleDateTabs(e)}}
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
                  onChange={(e) => {handleDateTabs(e)}}
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
                  onChange={(e) => {handleDateTabs(e)}}
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
                  onChange={(e) => {handleDateTabs(e)}}
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
                  onChange={(e) => {handleDateTabs(e)}}
                  
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
                onChange={(date) => dateOnchangeEvent(date, dateTabs)}
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
                onChange={(date) => dateOnchangeEvent(date, dateTabs)}
                className="form-control"
                placeholder="Date"
                maxDate={new Date()}
                showFourColumnMonthYearPicker
                inline
                disabledKeyboardNavigation
              />
            </article>
            <article
              className="yearly year_comm"
              style={{ display: dateTabs === "Yearly" ? "block" : "none" }}
            >
              <h2>
                <DatePicker
                  selected={selectedYearDate}
                  onChange={(date) => dateOnchangeEvent(date, dateTabs)}
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
                      id="startDate"
                      name="startDateTime"
                      value={startDate}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <p>To</p>
                  <div className="d-flex date_flex">
                    <img src={date_icon} className="d_icon" />
                    
                    <DatePicker
                      selected={endDate}
                      name="endDateTime"
                      onChange={(date) => setEndDate(date)}
                      popperClassName="d-none"
                      dateFormat="dd-MMM-yyyy"
                      placeholderText="Select to date"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      id="endDate"
                      value={sDate ? defaultDate : endDate}
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
        {dateTabs == "Daily" ||
        dateTabs == "Monthly" ||
        dateTabs == "Yearly" ? (
          ""
        ) : (
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
        )}
      </div>
    </Modal>
  );
}
export default DatePickerModel;
