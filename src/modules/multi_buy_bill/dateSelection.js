import React, { useEffect } from "react";
import date_icon from "../../assets/images/date_icon.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import "../multi_buy_bill/dateSelection.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  multiBillSelectDate,
  multiSelectPartners,
  selectedDates,
  slectedBillDate,
} from "../../reducers/multiBillSteps";
import moment from "moment";
const DateSelection = ({ fromStep3BillDate }) => {
  const listOfDates = useSelector((state) => state.multiStepsInfo);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const multiSelectPartnersArray = listOfDates?.fromMultiBillView
    ? listOfDates?.multiSelectPartners
    : listOfDates?.multiSelectPartners;
  const fromPreviousStep3Status = listOfDates?.fromPreviousStep3;
  const slectedBillDateVal = listOfDates?.slectedBillDate != '' ? listOfDates?.slectedBillDate : new Date();
  const dispatch = useDispatch();

  var arr = [];
  useEffect(() => {
    let clonedArray = [...multiSelectPartnersArray];
    for (var i = 0; i < multiSelectPartnersArray.length; i++) {
      let clonedObject = { ...multiSelectPartnersArray[i] };
      if (!fromPreviousStep3Status) {
        Object.assign(clonedObject, {
          billDate: moment(new Date()).format("YYYY-MM-DD"),
        });
      } else {
        dispatch(slectedBillDate(new Date(multiSelectPartnersArray[i].billDate)));
        setSelectedDate(new Date(multiSelectPartnersArray[i].billDate));
      }
      clonedArray[i] = clonedObject;
      arr.push(clonedArray[i]);
    }
    dispatch(multiSelectPartners(clonedArray));
  }, []);
  var arrMain = [];
  const dateSelected = (date) => {
    multiSelectPartnersArray.map(function (entry) {
      const objCopy = { ...entry };
      objCopy.billDate = moment(date).format("YYYY-MM-DD");
      setSelectedDate(new Date(objCopy.billDate));
      dispatch(slectedBillDate(date));
      arrMain.push(objCopy);
      return entry;
    });
    console.log(arrMain)
    dispatch(multiSelectPartners(arrMain));
  };
  return (
   <div>
      <div className="d-flex align-items-center dateSelection">   
      <span className="date_icon m-0">
        <img src={date_icon} alt="icon" className="dateIcon" />
      </span>
      <div className="date_field date_step2_field partner_date">
        <DatePicker
          dateFormat="dd-MMM-yyyy"
          selected={slectedBillDateVal}
          onChange={(date) => dateSelected(date)}
          className="form-control input_date"
          placeholder="Date"
          maxDate={new Date()}
          onKeyDown={(e) => {
            e.preventDefault();
          }}
        />
      </div>
    </div>
   </div>
  );
};

export default DateSelection;
