import React from 'react'
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal } from "react-bootstrap";
import close from "../../assets/images/close.svg";
import "react-datepicker/dist/react-datepicker.css";
import date_icon from "../../assets/images/date_icon.svg";
import "../../assets/css/calender.scss";
import { useState } from 'react';
import { getListOfBillIds } from '../../actions/ledgersService';
import { useDispatch } from 'react-redux';
import { closeDate, dates } from '../../reducers/ledgersCustomDateSlice';
const CustomDateSelection = (props) => {
    const partyId=props.partyId;
    const loginData = JSON.parse(localStorage.getItem("loginResponse"));
    const clickId = loginData.caId;
    console.log(props.beginDate,"begonDate")
    const [startDate, setStartsDate] = useState(new Date(props.beginDate)?new Date(props.beginDate): new Date());
    const [endDate, setEndDate] = useState(new Date(props.closeDate)?new Date(props.closeDate):new Date());
    const dispatch = useDispatch()
    const onChangeDate = (dates) => {
        const [start, end] = dates;
        console.log(start, end, "date")
        setStartsDate(start);
        setEndDate(end);
      };
      const sendCustomDates=()=>{
        console.log(startDate,endDate,"in cistom")
        dispatch(dates(startDate));
        dispatch(closeDate(endDate?endDate:new Date()));
        props.closeCustomDatePopUp();
        props.fromCustomDate(true);
        var frDate= moment(startDate).format("YYYY-MM-DD");
        var toDate=moment(endDate?endDate: new Date()).format("YYYY-MM-DD");
        console.log(frDate,toDate)
        getListOfBillIds(clickId,partyId,frDate,toDate).then(res=>{
            props.allBillIdsDate(res.data.data);
            console.log("contine")
            localStorage.setItem("listOfBillIds", JSON.stringify(res.data.data));
        })
      }
      const clearDates=()=>{;
        dispatch(dates(startDate));
        dispatch(closeDate(endDate));
        props.fromCustomDate(true);
        localStorage.removeItem("listOfBillIds");
      }
    return (
        <Modal
            show={props.showCustDate}
            close={
                props.closeCustomDatePopUp
            }
            aria-labelledby="contained-modal-title-vcenter"
            
            className="record_payment_modal select_billID_popup"
        >
            <div className="modal-header d-block date_modal_header pb-0 w-100">
                <div className="d-flex align-items-center justify-content-between">
                    <h5 className="modal-title header2_text" id="staticBackdropLabel">
                        Select Dates</h5>
                        <button onClick={() => {
                                clearDates();
                                props.closeCustomDatePopUp()
                            }}
                            data-bs-dismiss="modal">
                        <img
                            src={close}
                            alt="image"
                            className="close_icon"
                        />
                    </button>
                </div>
                </div>
                <div className="modal-body date_modal_mody partner_model_body pb-0" style={{'height':'100%'}}>
                    <div className="calender_popup" style={{'height':'100%'}}>
                        <div className="row">
                            <div
                                className="custom_picker">
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
                                                selected={endDate?endDate:new Date()}
                                                name="endDateTime"
                                                onChange={(date) => setEndDate(date)}
                                                popperClassName="d-none"
                                                dateFormat="dd-MMM-yyyy"
                                                placeholderText="Select to date"
                                                onKeyDown={(e) => {
                                                    e.preventDefault();
                                                }}
                                                id="endDate"
                                                value={endDate}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DatePicker
                                    key={new Date()}
                                    selected={startDate}
                                    onChange={onChangeDate}
                                    // startDate={billEditItemInfo?.dateCustom ? new Date() : startDate}
                                    startDate={startDate}
                                    endDate={endDate}
                                    selectsRange
                                    inline
                                    maxDate={new Date()}
                                    disabledKeyboardNavigation
                                />
                            </div>
                        </div>
                    </div>
                   
                </div>
                <div className='modal-footer p-0'>
                <button
                        type="button"
                        className="primary_btn datePicker_continue w-100 m-0"
                        onClick={()=>{sendCustomDates()}}>
                        
                        Continue
                    </button>
                </div>
            
        </Modal>
    )
}

export default CustomDateSelection