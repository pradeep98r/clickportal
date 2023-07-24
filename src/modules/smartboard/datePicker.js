import React, { Component, useEffect, useState } from "react";
import close from "../../assets/images/close.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import $ from "jquery";
import "../../assets/css/calender.scss";
import { Modal } from "react-bootstrap";
import moment from "moment";
import date_icon from "../../assets/images/date_icon.svg";
import { dateCustomStatus } from "../../reducers/billEditItemSlice";
import { useDispatch, useSelector } from 'react-redux';
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
  const [startDate, setStartsDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const dispatch = useDispatch();
  const ledgersSummary = useSelector((state) => state.ledgerSummaryInfo);
  const allCustom =ledgersSummary?.allCustomTabs;
  useEffect(() => {
    setStartDate(props.prevNextDate)
    localStorage.setItem("billViiewSttatus", false);
    if (link == "/buyerledger" ||
      link == "/sellerledger") {
      if (props.ledgerTabs == "detailedledger") {
        if (billEditItemInfo?.dateCustom) {
          datev = 'Custom';
          setStartsDate(new Date());
          setEndDate(new Date());
        }
        else {
          datev = dateTabs
        }
      }
      else {
        if (props.ledgerTabs == "ledgersummary") {
          if (billEditItemInfo?.dateCustom) {
            datev = 'Custom'
            setStartsDate(new Date());
            setEndDate(new Date());
          }
          else {
            datev = dateTabs
          }
        }
        else {
          datev = dateTabs
        }
      }
    }
    else {
      datev = dateTabs
    }
    if(link == '/advance' || link =='/reports'){
      if(billEditItemInfo?.dateCustom){
          datev = 'Custom';
          setStartsDate(new Date());
          setEndDate(new Date());
      }
      dispatch(dateCustomStatus(false));
    }
    setDateTabs(datev);
  }, [props.show]);


  const [custStDate, setCustStDate] = useState(new Date());
  const [custEndDate, setCustEndDate] = useState(new Date());
  const [sDate, setSDate] = useState(false);
  const [defaultDate, setDefaultDate] = useState(moment(new Date()).format("DD-MMM-YYYY"));

  //New Week Dates
  const [selectedFromDate, setSelectedFromDate] = useState(new Date());
  const [selectedToDate, setSelectedToDate] = useState(new Date());
  const [weekFromDate, setWeekFromDate] = useState(new Date());
  const [weekToDate, setWeekToDate] = useState(new Date());

  const onChangeDate = (dates) => {
    dispatch(dateCustomStatus(false));
    const [start, end] = dates;
    if (dateTabs == 'Weekly') {
      const startOfWeek = new Date(start);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      setSelectedFromDate(startOfWeek);
      setWeekFromDate(startOfWeek)
      setSelectedToDate(endOfWeek);
      setWeekToDate(endOfWeek)
    } else{
      setStartsDate(start);
      setEndDate(end);
      setCustStDate(start);
      setCustEndDate(end);
      if (end == null) {
        setSDate(true);
        setDefaultDate(defaultDate)
      }
      else {
        setSDate(false);
      }
    }
    
  };
  const [selectedMonthDate, setSelectedMonthDate] = useState(new Date());
  const [selectedYearDate, setSelectedyearDate] = useState(new Date());

  const link = localStorage.getItem("LinkPath");
  const [dateTabs, setDateTabs] = useState(
    link == "/buyerledger" ||
      link == "/sellerledger" || 
      props.ledgerTabs == "detailedledger" || link == '/advance'
      ? "Custom"
      : "Daily"
  );
  const [selectedDate, setStartDate] = useState(props.prevNextDate?props.prevNextDate:new Date());
  const [handleTab, setHandleTabs] = useState(false);
  const [dates, setDates] = useState((link == "/buyerledger" || link == "/sellerledger" || link == '/advance') ?
  dateTabs=='Weekly'?'Weekly':'Custom': 'Daily');
  const [dialyDate, setDailyDate] = useState()
  const [monthDate, setMonthDate] = useState(new Date());
  const [yearDate, setyearDate] = useState(new Date());
  const dateOnchangeEvent = (date, type) => {
    setHandleTabs(true);
    setDates(type);
    if (type == "Daily") {
      setStartDate(date);
      setDailyDate(date);
    } else if (type == "Monthly") {
      setSelectedMonthDate(date);
      setMonthDate(date);
    } else if (type == "Yearly") {
      setSelectedyearDate(date);
      setyearDate(date);
    }
    onclickContinue(date);
  };

  const setToDefaultDate = () => {
    if (link == "/buyerledger" || link == "/sellerledger") {
      if (props.ledgerTabs == "detailedledger" || props.ledgerTabs == "ledgersummary") {
        if (dates == 'Daily' && handleTab) {
          setDateTabs("Daily");
          setStartDate(dialyDate)
        } else if (dates == 'Weekly' && handleTab) {
          setDateTabs('Weekly')
          setSelectedFromDate(weekFromDate)
          setSelectedToDate(weekToDate)
        } else if (dates == 'Monthly' && handleTab) {
          setDateTabs('Monthly')
          setSelectedMonthDate(monthDate)
        } else if (dates == 'Yearly' && handleTab) {
          setDateTabs('Yearly')
          setSelectedyearDate(yearDate)
        } else if (dates == 'Custom' && handleTab) {
          setDateTabs('Custom');
          setStartsDate(custStDate);
          setEndDate(custEndDate);
        }
      }
    }
    else {
      commonDateFunction()
    }
  };
  const commonDateFunction = () => {
    if (dates == 'Daily' && handleTab) {
      setDateTabs("Daily");
      setStartDate(dialyDate)
    } else if (dates == 'Weekly' && handleTab) {
      setDateTabs('Weekly')
      setSelectedFromDate(weekFromDate)
      setSelectedToDate(weekToDate);
    } else if (dates == 'Monthly' && handleTab) {
      setDateTabs('Monthly')
      setSelectedMonthDate(monthDate)
    } else if (dates == 'Yearly' && handleTab) {
      setDateTabs('Yearly')
      setSelectedyearDate(yearDate)
    } else if (dates == 'Custom' && handleTab) {
      setDateTabs('Custom');
      setStartsDate(custStDate);
      setEndDate(custEndDate);
    }
  }
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
      firstDate = moment(selectedFromDate).format("YYYY-MM-DD");
      lastDate = moment(selectedToDate).format("YYYY-MM-DD");
      props.parentCallback(firstDate, lastDate, dateTabs);
      props.close();
      setDateTabs("Weekly");
      if (link == '/buy_bill_book' || link == "/sellbillbook"){
        setDates('Weekly')
      }
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
      if (endDate != null) {
        lastDate = moment(endDate).format("YYYY-MM-DD");
      }
      else {
        lastDate = moment(new Date()).format("YYYY-MM-DD");
        setEndDate(new Date());
      }
      firstDate = moment(startDate).format("YYYY-MM-DD");
      dispatch(dateCustomStatus(false));
      props.parentCallback(firstDate, lastDate, dateTabs);
      props.close();
      setDateTabs("Custom");
      if (link == '/buy_bill_book' || link == "/sellbillbook"){
        setDates('Custom')
      }
    }
  };

  const handleDateTabs = (e) => {
    setDateTabs(e.target.value);
    if (dateTabs == e.target.value) {
      setHandleTabs(false);
      setDateTabs(e.target.value);
    } else {
      setDateTabs(e.target.value);
      if (link == '/buy_bill_book' || link == "/sellbillbook") {
        setDates(dates);
        // setDates(e.target.value)
      } else {
        if(e.target.value == 'Weekly'){
          setDates('Weekly');
        } else{
          setDates(dates);
        }
        
      }
      setHandleTabs(true);
    }

    setStartDate(new Date());
    setStartsDate(new Date())
    setEndDate(new Date());
    setSelectedMonthDate(new Date());
    setSelectedyearDate(new Date());
    setSelectedFromDate(new Date());
    setSelectedToDate(new Date());
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
                  onChange={(e) => { handleDateTabs(e) }}
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
                  onChange={(e) => { handleDateTabs(e) }}
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
                  onChange={(e) => { handleDateTabs(e) }}
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
                  onChange={(e) => { handleDateTabs(e) }}
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
                  onChange={(e) => { handleDateTabs(e) }}

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
                key={new Date()}
                dateFormat="yyyy-MMM-dd"
                selected={selectedDate}
                // selected={selectedDate}
                onChange={(date) => dateOnchangeEvent(date, dateTabs)}
                className="form-control"
                placeholder="Date"
                maxDate={new Date()}
                inline
                disabledKeyboardNavigation
              />
            </article>
            <article
              className="week_picker"
              style={{ display: dateTabs === "Weekly" ? "block" : "none" }}
            >
              <DatePicker
                key={new Date()}
                onChange={onChangeDate}
                selectsRange
                inline
                startDate={selectedFromDate}
                endDate={selectedToDate}
                placeholder="Date"
                dateFormat="dd-MMM-yyyy"
                className="form-control"
                maxDate={new Date()}
                disabledKeyboardNavigation
              />
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
                    />
                  </div>
                </div>
              </div>

              <DatePicker
                key={new Date()}
                selected={billEditItemInfo?.dateCustom ? new Date():startDate}
                onChange={onChangeDate}
                startDate={billEditItemInfo?.dateCustom ? new Date() : startDate}
                // startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
                maxDate={new Date()}
                disabledKeyboardNavigation
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
            className="primary_btn datePicker_continue w-100 m-0"
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