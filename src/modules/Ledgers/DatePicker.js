import React from 'react'
import { useState } from 'react';
import ReactDatePicker from 'react-datepicker'

import "react-datepicker/dist/react-datepicker.css";

const DatePicker = () => {
    const [selectDate, setSelectDate] = useState(new Date());
    return (
        <ReactDatePicker className='date_picker'
            selected={selectDate}
            onChange={date => { setSelectDate(date) }}
            dateFormat='yyyy/MM/dd'
            maxDate={new Date()}
            placeholder="Date"
            showMonthYearDropdown={true}
            scrollableMonthYearDropdown
            required
            style=
            {{
                width: "400px",
                cursor: "pointer",
                right: "300px",
                marginTop: "10px",
                fontFamily: 'Manrope',
                fontStyle: "normal",
                fontWeight: "600",
                fontSize: "15px",
                lineHeight: "18px"
            }}
        >
        </ReactDatePicker>
    )
}

export default DatePicker