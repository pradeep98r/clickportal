import React from 'react'
import date_icon from "../../assets/images/date_icon.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from 'react';
import "../multi_buy_bill/dateSelection.scss";
import { useDispatch, useSelector } from 'react-redux';
import { multiBillSelectDate, selectedDates } from '../../reducers/multiBillSteps';
import moment from "moment";
const DateSelection = ({indexVal}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const listOfDates = useSelector((state)=> state.multiStepsInfo);
    const allDates = listOfDates?.selectedDates;
    const dispatch = useDispatch();
    var datesArray=[];
    const dateSelected =(date)=>{
        const updateDates= [...allDates];
        updateDates[indexVal] = moment(date).format("YYYY-MM-DD");
        dispatch(selectedDates(updateDates));
        setSelectedDate(date)
        dispatch(multiBillSelectDate(indexVal,date));
    }
    return (
        <div className="d-flex align-items-center dateSelection">
            <span className="date_icon m-0">
                <img src={date_icon} alt="icon" className="dateIcon" />
            </span>
            <DatePicker
                dateFormat="dd-MMM-yyyy"
                selected={selectedDate}
                onChange={(date) => dateSelected(date)}
                className="form-control"
                placeholder="Date"
                maxDate={new Date()}
                onKeyDown={(e) => {
                    e.preventDefault();
                }}
            />
        </div>
    )
}

export default DateSelection