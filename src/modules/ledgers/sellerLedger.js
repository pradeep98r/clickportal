import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Fragment } from 'react'
import ReactDatePicker from 'react-datepicker';
import ReactModal from 'react-modal';
import { createSearchParams, Link, Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';
import { getLedgerSummary, getSelleLedgers, postRecordPayment } from '../../actions/billCreationService';
import "./buyerLedger.scss";
import date_icon from "../../assets/images/date_icon.svg";
import close_btn from "../../assets/images/close_btn.svg";
import add from "../../assets/images/add.svg";
import no_data from "../../assets/images/no_data.svg";
import pdf from "../../assets/images/pdf.svg";
import share from "../../assets/images/share.svg";
import print from "../../assets/images/print.svg";
import search_img from "../../assets/images/search.svg";
import right_click from "../../assets/images/right_click.svg";
import $ from "jquery";
import "../../modules/buy_bill_book/buyBillBook.scss";


const SellerLedger = () => {
    
    const [ledger, setLedgeres] = useState([{}]);
    const [data, setData] = useState({}, ledger);
    const [search, setSearch] = useState(" ");
    const [error, setError] = useState();
    const navigate = useNavigate();
    const loginData = JSON.parse(localStorage.getItem("loginResponse"));
    const clickId = loginData.clickId;
    const [isOpen, setIsOpen] = useState(false);
    const [selectDate, setSelectDate] = useState(new Date());
    const [paidRcvd, setPaidRcvd] = useState(0);
    const [comments, setComments] = useState(" ");
    const [paymentMode, setPaymentMode] = useState(" ");

    const [displayLink, setDisplayLink]=useState(false);
    const { partyId } = useParams();
    const [sellerSummaryData, setSellerSummaryData] = useState({});
    const [recordDisplay, setRecordDisplay]=useState("");
    const [record, setRecord]=useState(false);
    const [partyType, setPartyType] = useState("");
    const [dateDisplay, setDateDisplay] = useState(false);

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
    const [endDate, setEndDate] = useState(new Date());
    const onChangeDate = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    const handleWeekPick = (startDate, endDate) => {
        console.log(`${startDate} to ${endDate}`);
    };
    const DateModal = () => {
        $("#datePopupmodal").modal("show");
    };

    useEffect(() => {
        fetchSellerLedger();
    }, [clickId]);
    const fetchSellerLedger = () => {
        getSelleLedgers(clickId).then(response => {
            setData(response.data.data);
            setLedgeres(response.data.data.ledgers);
            console(response.data.data, "Buyer Details");
        })
        .catch(error => {
            setError(error.message);
        })
    }

    const particularLedger = (id) => {
        console.log(id);
        ledger.filter((item) => {
            if (item.partyId === id) {
                setDisplayLink(!displayLink);
                navigate(`sellerledgersummary/${id}`);
                return item;
                //navigate("ledgerSummary");
            }
            else {
                return <p>Not Found</p>
            }
        });
    }
    useEffect(() => {
        addRecordPayment();
    }, []);
    const addRecordPayment = (e) => {
        const addRecordData = {
            caId: clickId,
            partyId: partyId,
            date: convert(selectDate),
            comments: comments,
            paidRcvd: paidRcvd,
            paymentMode: paymentMode,
            
        }
        postRecordPayment(addRecordData).then(response => {
            console.log(response.data.data);
            window.location.reload();
            setRecordDisplay("Record Updated Successfully");
            setRecord(true);
        })
        .catch(error => {
            console.log(error);
        })
        navigate("/sellerledger")
        setIsOpen(false);
    }
    useEffect(() => {
        getSellerLedgerSummary(clickId, partyId);
      }, [clickId, partyId]);
    
      const getSellerLedgerSummary = () => {
        getLedgerSummary(clickId,partyId).then(response => {
            setSellerSummaryData(response.data.data);
        })
        .catch(error => {
           setError(error.message);
        });
      }
      const links = [
        {
            id: 1,
            name: "All",
            to: `All`,
        },
        {
            id: 2,
            name: "Custom",
            to: `Custom`,
        }
    ];
    const tabEvent = (type) => {
        setPartyType(type);
        if (type === 'All') {
            console.log(type)
            setDateDisplay(false);
            localStorage.setItem('All', JSON.stringify(type))
            navigate(`sellerledgersummary/${partyId}`);
        }
        else if (type === 'Custom') {
            console.log(type);
            localStorage.setItem('Custom', JSON.stringify(type))
            setDateDisplay(!dateDisplay);
        }
    };
    function convert(str) {
        var date = new Date(str),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2);
          //console.log(convert("Thu Jun 09 2011 00:00:00 GMT+0530 (India Standard Time)")
        return [date.getFullYear(), mnth, day].join("-");
    }

    const getDate=()=>{
        let fromDate=convert(startDate);
        let toDate=convert(endDate);
        console.log(fromDate);
        console.log(toDate);
        localStorage.setItem('fromDate', JSON.stringify(fromDate))
        localStorage.setItem('toDate', JSON.stringify(toDate))
        console.log(`sellerledgersummary/${partyId}?fromDate=${fromDate}&toDate=${toDate}`);
        navigate(`sellerledgersummary/${partyId}?fromDate=${fromDate}&toDate=${toDate}`)
        $("#datePopupmodal").modal("hide");
        setIsOpen(false);
    }
  return (
    <div className="ledger">
            <div className='record-update' style={{ display: record ? 'block' : 'none' }}>
                <p>{recordDisplay}</p>
                <img src={right_click} className="right-click" />
                <img src={close_btn} className="recordclose-btn" onClick={() => setRecord(false)} />
            </div>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <form class="d-flex">
                        <input id="searchbar" type="text" value={search} placeholder='Search by Name / Short Code'
                            onChange={(e) => { setSearch(e.target.value) }} className='searchbar-input' />
                    </form>
                    <div className='searchicon'><img src={search_img} alt="search" /></div>
                </div>
                <div class="collapse navbar-collapse links-tag" id="navbarNavAltMarkup" className='links-tag'
                    style={{ display: displayLink ? 'block' : 'none' }}>
                    <div className='date-byledgers' style={{ display: dateDisplay ? 'block' : 'none' }}>
                        <div className='dateRangePicker' style={{ display: dateDisplay ? 'block' : 'none' }}>
                            <div className="d-flex">
                                <div onClick={DateModal}><img id="date_icon" src={date_icon} /></div>
                                </div>
                                <div className="modal fade" id="datePopupmodal"
                                // data-bs-backdrop="static"
                                // data-bs-keyboard="false"
                                // aria-labelledby="staticBackdropLabel"
                                // aria-hidden="true"
                                >
                                    <div className="modal-dialog modal-dialog-centered date_modal_dialog">
                                        <div className="modal-content">
                                            <div className="modal-header date_modal_header">
                                                <h5 className="modal-title header2_text" id="staticBackdropLabel">
                                                    Select Dates
                                                </h5>
                                                <img
                                                    src={close_btn}
                                                    alt="image"
                                                    className="close_icon"
                                                    data-bs-dismiss="modal"
                                                />
                                            </div>
                                            <div className="modal-body date_modal_mody">
                                                <div className="calender_popup">
                                                    <div className="row">
                                                        <div className="dates_div">
                                                            <div className="flex_class">
                                                                <input type="radio" id="tab1" name="tab" defaultChecked />
                                                                <label htmlFor="tab1">Daily</label>
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
                                                                <input type="radio" id="tab4" name="tab" />
                                                                <label htmlFor="tab4">Weekly</label>
                                                            </div>
                                                            <div className="flex_class">
                                                                <input type="radio" id="tab5" name="tab" />
                                                                <label htmlFor="tab5">Custom</label>
                                                            </div>
                                                        </div>
                                                        <article className="date_picker">
                                                            <ReactDatePicker
                                                                dateFormat="yyyy-MM-dd"
                                                                selected={startDate}
                                                                onChange={(date) => setStartDate(date)}
                                                                className="form-control"
                                                                placeholder="Date"
                                                                maxDate={new Date()}
                                                                inline
                                                            />
                                                        </article>
                                                        <article className="month_picker">
                                                            <ReactDatePicker
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
                                                        <article>
                                                            <h2>
                                                                <ReactDatePicker
                                                                    selected={startDate}
                                                                    onChange={(date) => setStartDate(date)}
                                                                    showYearPicker
                                                                    dateFormat="yyyy"
                                                                    className="form-control"
                                                                    maxDate={new Date()}
                                                                    inline
                                                                    // showThreeColumnYearPicker
                                                                    yearItemNumber={9}
                                                                />
                                                            </h2>
                                                        </article>
                                                        <article className="week_picker">
                                                            {/* <WeeklyCalendar
                      onWeekPick={handleWeekPick}
                      max={moment().format("DD-MM-YYYY")}
                    /> */}
                                                        </article>
                                                        <article className="custom_picker">
                                                            <div className="flex_class custom_input_div">
                                                                <ReactDatePicker
                                                                    selected={startDate}
                                                                    onChange={(date) => setStartDate(date)}
                                                                    popperClassName="d-none"
                                                                    dateFormat="yyyy-MM-dd"
                                                                    placeholderText="Select from date"
                                                                />
                                                                <ReactDatePicker
                                                                    selected={endDate}
                                                                    onChange={(date) => setEndDate(date)}
                                                                    popperClassName="d-none"
                                                                    dateFormat="yyyy-MM-dd"
                                                                    placeholderText="Select to date"
                                                                />
                                                            </div>

                                                            <ReactDatePicker
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
                                                <button className='continue-btn' onClick={getDate}>CONTINUE</button>
                                            </div>
                                            {/* <div className="modal-footer">
              <button
                type="button"
                className="secondary_btn"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary_btn"
                // onClick={() => postPreference()}
                data-bs-dismiss="modal"
              >
                Next
              </button>
            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container-fluid px-0">
                            <ul className="nav nav-tabs" id="ledgersTab" role="tablist">
                                {links.map((link) => {
                                    return (
                                        <li key={link.id} className="nav-item active">
                                            <a
                                                className="nav-link"
                                                href={"#" + partyType}
                                                role="tab"
                                                aria-controls="home"
                                                data-bs-toggle="tab"
                                                onClick={() => tabEvent(link.to)}
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div class="card" className='details-tag'>
                            <div class="card-body">
                                {
                                    ledger.map((item, index) => {
                                        if (item.partyId == partyId) {
                                            return (
                                                <div>
                                                    <p className='profile-details'>
                                                        {item.profilePic}{item.partyName}</p>
                                                    <p className='address'>
                                                        {item.partyAddress}<br/>
                                                        {item.mobile}</p>
                                                </div>
                                            )
                                        }
                                        else {
                                            <p>No Data Found</p>
                                        }
                                    })
                                }
                                <p class="card-text" className='paid'>Total Business<br /> <span className='coloring'>
                                    &#8377;{sellerSummaryData.totalTobePaidRcvd ? sellerSummaryData.totalTobePaidRcvd : 0}</span></p>
                                <p className='total-paid'>Total Paid <br /><span className='coloring'>
                                    &#8377;{sellerSummaryData.totalRcvdPaid ? sellerSummaryData.totalRcvdPaid : 0}</span> </p>
                                <p className='out-standing'>Outstanding Recievables <br /><span className='coloring'>
                                    &#8377;{sellerSummaryData.outStdRcvPayble ? sellerSummaryData.outStdRcvPayble : 0}</span></p>
                                <hr style={{
                                    background: '#FFFFFF', postion: 'absolute',
                                    border: '1px solid #E4E4E4', height: '0px', marginTop: '45px', width: '600px',
                                    paddingRight: '-40px',
                                }} />

                                <nav className='links'>
                                <Link to={`sellerledgersummary/${partyId}`} className="ledgersummary" active>LedgerSummary</Link>
                                <Link to={`sellerdetailedledger/${partyId}`} className="detailedledger">Detailed Ledger</Link>
                                    <Outlet />
                                </nav>
                                {/*<hr style={{color:"blue", marginTop:"25px"}}/>
                            <div className="images">
                            <img src={pdf} className="pdf"/>
                            <img src={share} className="share" />
                            <img src={print} className="print"/>
                            </div>*/}
                            </div>
                            <button className="record-btn" onClick={() => setIsOpen(!isOpen)}><img src={add} className="add" />Add Record</button>
                        </div>
                    </div>
                    <ReactModal isOpen={isOpen}
                        style={
                            {
                                overlay: {
                                    position: 'absolute',
                                    top: "75px",
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    marginLeft: "350px",
                                    width: "750px",
                                    height: "540px",
                                    overflow: 'visible',
                                    transition: 'ease-out'
                                }
                            }
                        }>
                        <img src={close_btn} className="close-btn" onClick={() => setIsOpen(false)} />
                        <h5 className='addrecord-tag'>Add Record Recivable</h5>
                        <form onSubmit={addRecordPayment}>
                            <div className="card" id="recievable-card">
                                <div className="card-body">
                                    {
                                        ledger.map((item, index) => {
                                            if(item.partyId==partyId){
                                            return (
                                                <Fragment>
                                                    <tr>
                                                        <td className='profile-details' key={item.partyName}>
                                                            {item.partyName}<br/>
                                                            {item.mobile}<br />
                                                            {item.profilePic}
                                                            {item.partyAddress}

                                                        </td>
                                                    </tr>
                                                </Fragment>
                                            )
                                            }
                                        })
                                    }
                                    <p class="card-text" id="date-tag">
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
                                        <img className="date_icon" src={date_icon} />
                                    </p>
                                </div>
                            </div>
                            <p id='p-tag'>Total Outstanding Recievables</p>
                            <p id="recieve-tag">&#8377;{sellerSummaryData.outStdRcvPayble}</p>
                            <div class="form-group">
                                <label hmtlFor="amtRecieved" id="amt-tag">Amount Recieved</label>
                                <input class="form-control" id="amtRecieved" value={paidRcvd} placeholder="&#8377;" required
                                    onChange={(e) => setPaidRcvd(e.target.value)} />
                            </div>
                            <p className='payment-tag'>Payment Method</p>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="radio" id="inlineRadio1" value={paymentMode}
                                    onChange={(e) => setPaymentMode(e.target.value)} required />
                                <label class="form-check-label" for="inlineRadio1">Cash</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="radio" id="inlineRadio2" value={paymentMode}
                                    onChange={(e) => setPaymentMode(e.target.value)} required />
                                <label class="form-check-label" for="inlineRadio2">UPI</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="radio" id="inlineRadio3" value={paymentMode}
                                    onChange={(e) => setPaymentMode(e.target.value)} required />
                                <label class="form-check-label" for="inlineRadio3">NEFT</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="radio" id="inlineRadio4" value={paymentMode}
                                    onChange={(e) => setPaymentMode(e.target.value)} required />
                                <label class="form-check-label" for="inlineRadio4">RTGS</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="radio" id="inlineRadio5" value={paymentMode}
                                    onChange={(e) => setPaymentMode(e.target.value)} required />
                                <label class="form-check-label" for="inlineRadio5">IMPS</label>
                            </div>
                            <div class="mb-3">
                                <label for="exampleFormControlTextarea1" class="form-label" id="comment-tag">Comment</label>
                                <textarea class="form-control" id="comments" rows="2" value={comments}
                                    onChange={(e) => setComments(e.target.value)}></textarea>
                            </div>
                            <button className='submit-btn' type='sumit'>SUBMIT</button>
                        </form>
                    </ReactModal>
            </nav>
            <div className='table-scroll'>
                <table class="table table-fixed" id="ledger-table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Date</th>
                            <th scope="col">Buyer</th>
                            <th scope="col">To Be Recieved</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            ledger.length > 0 ? (
                                ledger.filter((item) => {
                                    if (search === " ") return <p>Not Found</p>;
                                    else if (item.partyName.toLowerCase().includes(search.toLowerCase())) {
                                        console.log(item.partyName);
                                        console.log(search)
                                        return (<p>item.partyName</p>);
                                    }
                                    else {
                                        return <p>Not Found</p>
                                    }
                                })
                                    .map((item, index) => {
                                        return (
                                            <Fragment>
                                                <tr onClick={(id) => { particularLedger(item.partyId) }}>
                                                    <td scope="row">{index + 1}</td>
                                                    <td key={item.date}>{item.date}</td>
                                                    <td key={item.partyName}><span class="name-tag">
                                                        {item.partyName}<br />
                                                        {item.partyAddress}<br />
                                                        {item.mobile}
                                                        {item.profilePic}
                                                    </span>
                                                    </td>
                                                    <td key={item.tobePaidRcvd}><span className='coloring'>&#8377;
                                                        {item.tobePaidRcvd ? item.tobePaidRcvd : 0}</span></td>
                                                </tr>
                                            </Fragment>
                                        )
                                    })
                            ) : (<div>
                                <img src={no_data} />
                                <p>No Data Available</p>
                            </div>
                            )

                        }
                    </tbody>
                </table>
            </div>
        </div>

  )
}

export default SellerLedger