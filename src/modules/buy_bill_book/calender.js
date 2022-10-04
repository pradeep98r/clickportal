import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import date_icon from "../../assets/images/date_icon.svg";
import $ from "jquery";
function Calender() {
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
  const [startDate, setStartDate] = useState(new Date());
  // const partnerSelectDate = moment(startDate).format("YYYY-MM-DD");
  <div className="calender_popup">
    <div className="row">
      <div className="dates_div"></div>
      <div>
        <input type="radio" id="tab1" name="tab" defaultChecked />
        <label for="tab1">Daily</label>
        <input type="radio" id="tab2" name="tab" />
        <label for="tab2">Monthly</label>
        <input type="radio" id="tab3" name="tab" />
        <label for="tab3">Yearly</label>
      </div>
      <article>
        <DatePicker
          dateFormat="yyyy-MM-dd"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          className="form-control"
          placeholder="Date"
          maxDate={new Date()}
        />
      </article>
      <article>
        <DatePicker
          dateFormat="MM/yyyy"
          showMonthYearPicker
          showFullMonthYearPicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          className="form-control"
          placeholder="Date"
          maxDate={new Date()}
          showFourColumnMonthYearPicker
        />
      </article>
      <article>
        <h2>
          {" "}
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showYearPicker
            dateFormat="yyyy"
            className="form-control"
            maxDate={new Date()}
          />
        </h2>
      </article>
    </div>
  </div>;
}
export default Calender;
