import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Fragment } from 'react'
import ReactDatePicker from 'react-datepicker';
import ReactModal from 'react-modal';
import { Link, Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';
import { getLedgerSummary, getSelleLedgers, postRecordPayment } from '../../actions/billCreationService';
import "./buyerLedger.scss";
import date_icon from "../../assets/images/date_icon.svg";
import close_btn from "../../assets/images/close_btn.svg";
import add from "../../assets/images/add.svg";
import no_data from "../../assets/images/no_data.svg";
import pdf from "../../assets/images/pdf.svg";
import share from "../../assets/images/share.svg";
import print from "../../assets/images/print.svg";

import right_click from "../../assets/images/right_click.svg";

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

    useEffect(() => {
        fetchSellerLedger();
    }, []);
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
            date: new Date(),
            comments: comments,
            paidRcvd: paidRcvd,
            paymentMode: paymentMode,
            partyId: partyId
        }
        console.log(selectDate);
        postRecordPayment(addRecordData).then(response => {
            console.log(response.data.data);
        })
        .catch(error => {
            console.log(error);
        })
        navigate("/sellerledger")
        setIsOpen(false);
    }
    useEffect(() => {
        getSellerLedgerSummary();
      }, []);
    
      const getSellerLedgerSummary = () => {
        getLedgerSummary(clickId,partyId).then(response => {
            setSellerSummaryData(response.data.data);
        })
        .catch(error => {
           setError(error.message);
        });
      }
  return (
    <Fragment>
        <div className='seller-ledgers'>
        <div className='record-update' style={{display: record?'block':'none'}}>
                <p>{recordDisplay}</p>
                <img src={right_click} className="right-click" />
                <img src={close_btn} className="recordclose-btn" onClick={()=>setRecord(false)}/>
            </div>
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <form className="d-flex">
                        <span><img src={search} /></span>
                        <input id="searchbar" className="form-control me-12" type="search" placeholder="Search" aria-label="Search"
                            onChange={(e) => { setSearch(e.target.value) }} />
                    </form>
                </div>
                <div className="collapse navbar-collapse links-tag" id="navbarNavAltMarkup" 
                style={{display: displayLink ? 'block' : 'none' }}>
                    <div className="card details">
                        <div className="card-body">
                        {
                                ledger.map((item,index)=>{
                                    if(item.partyId==partyId){
                                        return(
                                            <div>
                                            <p className='profile-details'>
                                            {item.profilePic}{item.partyName}</p>
                                            <p className='address'>{item.partyAddress}{item.mobile}</p>
                                            </div>
                                        )
                                    }
                                    else{
                                        <p>No Data Found</p>
                                    }
                                })
                            }
                            <p className="card-text paid">Total Business<br/> <span className='coloring'>
                            &#8377;{sellerSummaryData.totalTobePaidRcvd? sellerSummaryData.totalTobePaidRcvd:0}</span></p>
                            <p className='total-paid'>Total Paid <br/><span className='coloring'>
                            &#8377;{sellerSummaryData.totalRcvdPaid? sellerSummaryData.totalRcvdPaid:0}</span> </p> 
                            <p className='out-standing'>Outstanding Paybles <br /><span className='coloring'>
                            &#8377;{sellerSummaryData.outStdRcvPayble?sellerSummaryData.outStdRcvPayble:0}</span></p>
                            
                            <hr style={{color:"blue", marginTop:"25px"}}/>
                            <Link to={`sellerledgersummary/${partyId}`} className="ledgersummary">LedgerSummary</Link>
                            <Link to={`sellerdetailedledger/${partyId}`} className="detailedledger">Detailed Ledger</Link>
                            <Outlet />
                            <div className="images">
                            <img src={pdf} className="pdf"/>
                            <img src={share} className="share" />
                            <img src={print} className="print"/>
                            </div>
                        </div>
                        <button className="record-btn" onClick={() => setIsOpen(!isOpen)}><img src={add} className="add"/>Add Record</button>
                    </div>
                </div>    
                <ReactModal isOpen={isOpen}
                    style={
                        {
                            overlay: {
                                position: 'absolute',
                                top: "85px",
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
                    <h5>Add Record Recivable</h5>
                    <form onSubmit={addRecordPayment}>
                        <div className="card" id="recievable-card">
                            <div className="card-body">
                                {
                                    ledger.map((item,index)=>{
                                        return(
                                            <Fragment>
                                            <tr>
                                            <td scope="row">{index}</td>
                                            <th key={item.date}>{item.date}</th>
                                            <td key={item.partyName}><span className="name-tag">
                                                {item.partyName}<br />
                                                {item.partyAddress}
                                                {item.mobile}
                                                {item.profilePic}
                                            </span>
                                            </td>
                                            </tr>
                                        </Fragment>
                                        )
                                    })
                                }
                                <p className="card-text" id="date-tag">
                                    <ReactDatePicker className='date_picker'
                                        selected={selectDate}
                                        onChange={date => { setSelectDate(date) }}
                                        dateFormat='dd/MM/yyyy'
                                        maxDate={new Date()}
                                        showMonthYearDropdown={true}
                                        scrollableMonthYearDropdown
                                        style=
                                        {{
                                            width: "400px",
                                            cursor: "pointer",
                                            right: "300px"
                                        }}
                                    >
                                    </ReactDatePicker>
                                    <img id="date_icon" src={date_icon} />
                                </p>
                            </div>
                        </div> 
                        <p id='p-tag'>Total Outstanding Recievables</p>
                        <p id="recieve-tag">&#8377;{sellerSummaryData.outStdRcvPayble}</p>

                        <div className="form-group">
                            <label for="amtRecieved" id="amt-tag">Amount Recieved</label>
                            <input className="form-control" id="amtRecieved" value={paidRcvd} placeholder="&#8377;"
                                onChange={(e) => setPaidRcvd(e.target.value)} />
                        </div>
                        <p className='payment-tag'>Payment Method</p>

                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="radio" id="inlineRadio1" value={paymentMode}
                                onChange={(e) => setPaymentMode(e.target.value)} />
                            <label className="form-check-label" for="inlineRadio1">Cash</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="radio" id="inlineRadio2" value={paymentMode}
                                onChange={(e) => setPaymentMode(e.target.value)} />
                            <label className="form-check-label" for="inlineRadio2">UPI</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="radio" id="inlineRadio3" value={paymentMode}
                                onChange={(e) => setPaymentMode(e.target.value)} />
                            <label className="form-check-NEFT" for="inlineRadio3">NEFT</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="radio" id="inlineRadio4" value={paymentMode}
                                onChange={(e) => setPaymentMode(e.target.value)} />
                            <label className="form-check-label" for="inlineRadio4">RTGS</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio5" value={paymentMode}
                                onChange={(e) => setPaymentMode(e.target.value)} />
                            <label className="form-check-label" for="inlineRadio5">IMPS</label>
                        </div>
                        <div className="mb-3">
                            <label for="exampleFormControlTextarea1" className="form-label" id="comment-tag">Comment</label>
                            <textarea className="form-control" id="exampleFormControlTextarea1" rows="2" value={comments}
                                onChange={(e) => setComments(e.target.value)}></textarea>
                        </div>
                        <button className='submit-btn' type='sumit'>SUBMIT</button>
                    </form>
                </ReactModal>
            </nav>
            <table className="table" id="ledger-table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Date</th>
                        <th scope="col">Seller Name</th>
                        <th scope="col">To Be Paid</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        ledger.length > 0 ? (
                            ledger.filter((value) => {
                                if (search === " ") return <p>Not Found</p>;
                                else if (value.partyName.toLowerCase().includes(search.toLowerCase())) {
                                    return value;
                                }
                                else {
                                    return <p>Not Found</p>
                                }
                            })
                                .map((item, index) => {
                                    return (
                                        <Fragment>
                                        <tr onClick={(id) => { particularLedger(item.partyId) }}>
                                            <td scope="row">{index}</td>
                                            <th key={item.date}>{item.date}</th>
                                            <td key={item.partyName}><span className="name-tag">
                                                {item.partyName}<br />
                                                {item.partyAddress}
                                                {item.mobile}
                                            </span>
                                            </td>
                                            <td key={item.toBePaid}><span className="recieved-tag">&#8377;
                                                {item.toBePaid ? item.toBePaid : 0}</span></td>
                                        </tr>                    
                                        </Fragment>
                                    )
                                })
                        ) : (
                        <div>
                        <img src={no_data}/>
                        <p>No Data Available</p>
                        </div>
                        )
                    }
                </tbody>
            </table>
            </div>
        </div>
    </Fragment>

  )
}

export default SellerLedger