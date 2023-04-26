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
} from "../../reducers/multiBillSteps";
import moment from "moment";
const DateSelection = ({ indexVal,fromStep3BillDate }) => {
  const listOfDates = useSelector((state) => state.multiStepsInfo);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const multiSelectPartnersArray = listOfDates?.multiSelectPartners;
  const allDates = listOfDates?.selectedDates;
  const dispatch = useDispatch();
  useEffect(()=>{
    let clonedArray = [...multiSelectPartnersArray];
    let clonedObject = { ...multiSelectPartnersArray[indexVal] };
    if(!fromStep3BillDate){
      Object.assign(clonedObject, {
        selectedDate: moment(new Date()).format("YYYY-MM-DD"),
      });
    }
    else{
      setSelectedDate(new Date(multiSelectPartnersArray[indexVal].selectedDate));
    console.log(multiSelectPartnersArray[indexVal],multiSelectPartnersArray[indexVal].selectedDate,'else')
    }
    clonedArray[indexVal] = clonedObject;
    dispatch(multiSelectPartners(clonedArray))
  },[])
  const dateSelected = (date) => {
    const updateDates = [...allDates];
    updateDates[indexVal] = moment(date).format("YYYY-MM-DD");
    dispatch(selectedDates(updateDates));
    setSelectedDate(date);
    dispatch(multiBillSelectDate(indexVal, date));
    let clonedArray = [...multiSelectPartnersArray];
    let clonedObject = { ...multiSelectPartnersArray[indexVal] };
    Object.assign(clonedObject, {
      selectedDate: moment(date).format("YYYY-MM-DD"),
    });
    clonedArray[indexVal] = clonedObject;
    dispatch(multiSelectPartners(clonedArray))
  };
  return (
    <div className="d-flex align-items-center dateSelection">
      <span className="date_icon m-0">
        <img src={date_icon} alt="icon" className="dateIcon" />
      </span>
      <div className="date_field date_step2_field partner_date">
        <DatePicker
          dateFormat="dd-MMM-yyyy"
          selected={selectedDate}
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
  );
};

export default DateSelection;
