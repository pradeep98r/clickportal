import { useEffect, useRef, useState } from 'react'
import { DateRange, DateRangePicker } from 'react-date-range'
import close from "../../assets/images/close.svg";

import format from 'date-fns/format'
import { addDays } from 'date-fns'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import ReactModal from 'react-modal'
import close_btn from "../../assets/images/close_btn.svg";
import "../Ledgers/DatePickerRange.scss";

const DateRangeComp = () => {


  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ])
  // open close
    const [open, setOpen] = useState(false)
    const [dateRange, setdateRange] = useState(" ");

  // get the target element to toggle 
  const refOne = useRef(null)

  useEffect(() => {
    // event listeners
    document.addEventListener("keydown", hideOnEscape, true)
    document.addEventListener("click", hideOnClickOutside, true)
    console.log(dateRange);
  }, [])

  // hide dropdown on ESC press
  const hideOnEscape = (e) => {
    // console.log(e.key)
    if( e.key === "Escape" ) {
      setOpen(false)
    }
  }

  // Hide on outside click
  const hideOnClickOutside = (e) => {
    // console.log(refOne.current)
    // console.log(e.target)
    if( refOne.current && !refOne.current.contains(e.target) ) {
      setOpen(false)
    }
  }
  const handleDateRange=()=>{
    setOpen(!open);
    console.log(range[0].startDate+"\t"+ range[0].endDate)
  }
  return (
    <div className="calendarWrap">

      <input
        value={`${format(range[0].startDate, "yyyy-MM-dd")} to ${format(range[0].endDate, "yyyy-MM-dd")}`}
        readOnly
        className="inputBox"
        onClick={handleDateRange}
      />
    <ReactModal isOpen={open} className='datepickerrange'
      shouldCloseOnOverlayClick={false}
        style={
          {
              overlay: {
                  position: 'absolute',
                  top: "75px",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  marginLeft: "350px",
                  width: "600px",
                  height: "470px",
                  overflow: 'visible',
                  transition: 'ease-out',
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  marginLeft: '400px',
                  marginTop: '20px'
              }
            }
          }>
          <div>
            <h5 className='select-date'>Select Date</h5>
            <form>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="radio" id="inlineRadio1" value={dateRange}
                onChange={(e) => setdateRange(e.target.value)} required />
              <label class="form-check-label" for="inlineRadio1">Daily</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="radio" id="inlineRadio2" value={dateRange}
                onChange={(e) => setdateRange(e.target.value)} required />
              <label class="form-check-label" for="inlineRadio2">Weekly</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="radio" id="inlineRadio3" value={dateRange}
                onChange={(e) => setdateRange(e.target.value)} required />
              <label class="form-check-label" for="inlineRadio3">Monthly</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="radio" id="inlineRadio4" value={dateRange}
                onChange={(e) => setdateRange(e.target.value)} required />
              <label class="form-check-label" for="inlineRadio4">Yearly</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="radio" id="inlineRadio5" value={dateRange}
                onChange={(e) => setdateRange(e.target.value)} required />
              <label class="form-check-label" for="inlineRadio5">Custom</label>
            </div>
            </form>
            <hr style={{background: '#FFFFFF' ,border: '1px solid #E4E4E4'}}/>
          <div ref={refOne}>
          <DateRange
            onChange={item => setRange([item.selection])}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            //ranges={range}
            months={1}
            hoverRange="month" ranges={[]} oneTap
            direction="horizontal"
            className="calendarElement"
            style={{
              width: "600px",
              height: "270px",
              top:'0px'
            }}
          />
          <div className='close-button'  onClick={() => setOpen(false)} >
          <img src={close_btn} className="closedate-btn"/>
          </div>
          <button className='submitbtn-tag'>CONTINUE</button>
          </div>
      </div>
      </ReactModal>
    </div>
  )
}
export default DateRangeComp