import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import moment from "moment";
const langData = localStorage.getItem("languageData");
const langFullData = JSON.parse(langData);
const BillDateSelection = (props) => {
    console.log(props.billDate)
  const [selectedDate, setStartDate] = useState(props.billDate != null ? props.billDate : new Date());
  props.parentCallbackDate(selectedDate)
  const [checked, setChecked] = useState(localStorage.getItem("defaultDate"));
  const handleCheckEvent = () => {
    if (!checked) {
      setChecked(!checked);
      localStorage.setItem("defaultDate", true);
      setStartDate(selectedDate);
    } else {
      setChecked(!checked);
      localStorage.removeItem("defaultDate");
      setStartDate(new Date());
    }
  };
  return (
    <div className="date_col d-flex align-items-center justify-content-between">
      <DatePicker
        dateFormat="dd-MMM-yyyy"
        selected={selectedDate}
        onChange={(date) => setStartDate(date)}
        className="form-control"
        placeholder="Date"
        maxDate={new Date()}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
      />
      <label className="custom-control custom-checkbox mb-0">
        <input
          type="checkbox"
          checked={checked && localStorage.getItem("defaultDate")}
          className="custom-control-input"
          id="modal_checkbox"
          value="my-value"
          onChange={handleCheckEvent}
        />
        <span className="custom-control-indicator"></span>
        <span className="custom-control-description">
          {langFullData.setAsADefault}
          {langFullData.date}
        </span>
      </label>
    </div>
  );
};
export default BillDateSelection;