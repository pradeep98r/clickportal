import React, { Component, useEffect, useState } from "react";
// import "../buy_bill_book/buyBillBook.scss";
import close from "../../assets/images/close.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import $ from "jquery";
import "../../assets/css/calender.scss";
import { Modal } from "react-bootstrap";
import moment from "moment";
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
    setLoading(false);
  }, []);


  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const onChangeDate = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  const [weekFirstDate, setWeekFirstDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [weekLastDate, setWeekLastDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [weekStartDate, setweekStartDate] = useState(
    moment(new Date()).format("DD-MMM-YYYY")
  );
  const [weekEndDate, setweekEndDate] = useState(
    moment(new Date()).format("DD-MMM-YYYY")
  );
  $(function () {
    var startWeekDate = moment(new Date()).format("YYYY-MM-DD");
    var endWeekDate = new Date();
    var selectCurrentWeek = function () {
      window.setTimeout(function () {
        $(".week-picker")
          .find(".ui-datepicker-current-day a")
          .addClass("ui-state-active");
      }, 1);
    };
    $(".week-picker").datepicker({
      maxDate: new Date(),
      showOtherMonths: true,
      selectOtherMonths: true,
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
        var weekFdate = moment(startWeekDate).format("YYYY-MM-DD");
        var weekLdate = moment(endWeekDate).format("YYYY-MM-DD");
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
  
  const [selectedDate, setSelectedDate] = useState("");
  const onclickContinue = (date) =>{
    setLoading(false);
    console.log(date)
    setSelectedDate(moment(date).format("YYYY-MM-DD"));
    var d = moment(date).format("YYYY-MM-DD") == '' ? moment(new Date()).format("YYYY-MM-DD") :moment(date).format("YYYY-MM-DD")
    props.parentCallback(d);
    props.close();
  }

  return (
     
       <Modal show={props.show} close={props.close} id="datePopupmodal"  aria-labelledby="contained-modal-title-vcenter"
       centered className="samrtboard_calender">
            <div className="modal-header date_modal_header">
              <h5 className="modal-title header2_text" id="staticBackdropLabel">
                Select Dates
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
                      <input type="radio" id="tab1" name="tab" defaultChecked />
                      <label htmlFor="tab1">Daily</label>
                    </p>
                    <div className="flex_class">
                      <input type="radio" id="tab4" name="tab" />
                      <label htmlFor="tab4">Weekly</label>
                    </div>
                    <div className="flex_class">
                      <input type="radio" id="tab2" name="tab" />
                      <label htmlFor="tab2">Monthly</label>
                    </div>
                    <div className="flex_class">
                      {" "}
                      <input type="radio" id="tab3" name="tab" />
                      <label htmlFor="tab3">Yearly</label>
                    </div>
                   
                    <div className="flex_class">
                      <input type="radio" id="tab5" name="tab" />
                      <label htmlFor="tab5">Custom</label>
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
                  <article className="week_picker p-0">
                  <div className="week_cal">
                        <div className="week-picker"></div>
                      </div>
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
                  <article className="yearly">
                    <h2>
                    <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          showYearPicker
                          dateFormat="yyyy"
                          className="form-control"
                          maxDate={new Date()}
                          showFourColumnMonthYearPicker
                          inline
                        />
                    </h2>
                  </article>
                 
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
              <button
                type="button"
                className="primary_btn cont_btn w-100 m-0"
                onClick={()=>{ onclickContinue(startDate)}}
              >
                Continue
              </button>
            </div>
            

        </Modal>
  );
}
export default DatePickerModel;
