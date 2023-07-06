import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { billDate } from "../../reducers/billEditItemSlice";
import date_icon from "../../assets/images/date_icon.svg";
import { editStatus } from "../../reducers/billEditItemSlice";

const langData = localStorage.getItem("languageData");
const langFullData = JSON.parse(langData);
const SellBillDateSelection = (props) => {
  const billEditItemInfo = useSelector((state) => state.billEditItemInfo);
  const billDateselected = billEditItemInfo?.selectedBillDate;
  const [selectedDate, setStartDate] = useState(
    billDateselected !== null ? billDateselected : new Date()
  );
  const dispatch = useDispatch();
  const onclickDate = (date) => {
    setStartDate(date);
    localStorage.setItem("setDate1", date);
    dispatch(billDate(date));
  };
  const [checked, setChecked] = useState(
    localStorage.getItem("defaultDateSell") !== null ? true : false
  );
  const handleCheckEvent = () => {
    if (!checked) {
      setChecked(!checked);
      localStorage.setItem("defaultDateSell", true);
      setStartDate(selectedDate);
      dispatch(billDate(selectedDate));
      localStorage.setItem("setDate1", selectedDate);
    } else {
      setChecked(!checked);
      localStorage.removeItem("defaultDateSell");
      setStartDate(new Date());
      dispatch(billDate(new Date()));
    }
  };
  useEffect(() => {
    if (billEditItemInfo.billEditStatus) {
      setStartDate(new Date(billDateselected));
      dispatch(billDate(new Date(billDateselected)));
    } else if (!checked) {
      console.log(selectedDate, "else if");
      setStartDate(selectedDate);
      dispatch(billDate(selectedDate));
    } else {
      console.log(new Date(localStorage.getItem("setDate1")), "else");
      setStartDate(new Date(localStorage.getItem("setDate1")));
      dispatch(billDate(new Date(localStorage.getItem("setDate1"))));
    }
    console.log(checked, localStorage.getItem("defaultDateSell"), "useeffect");
  }, []);

  return (
    <div className="date_col d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center dateSelection">
        <span className="date_icon m-0">
          <img src={date_icon} alt="icon" className="dateIcon" />
        </span>
        <DatePicker
          dateFormat="dd-MMM-yyyy"
          selected={selectedDate}
          onChange={(date) => onclickDate(date)}
          className="form-control"
          placeholder="Date"
          maxDate={new Date()}
          onKeyDown={(e) => {
            e.preventDefault();
          }}
        />
      </div>
      <label className="custom-control custom-checkbox mb-0">
        <input
          type="checkbox"
          checked={checked && localStorage.getItem("defaultDateSell")}
          className="custom-control-input"
          id="modal_checkbox"
          value="my-value"
          onChange={() => {
            handleCheckEvent();
          }}
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
export default SellBillDateSelection;