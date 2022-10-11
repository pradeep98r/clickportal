import React, { useEffect, useState } from 'react'
import ReactModal from 'react-modal';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getBuyerLedgers, getLedgerSummary, postRecordPayment } from '../../actions/billCreationService';
import "../Ledgers/BuyerLedger.scss";
import close_btn from "../../assets/images/close_btn.svg";
import date_picker from "../../assets/images/date_picker.svg";
import ReactDatePicker from 'react-datepicker';
import date_icon from "../../assets/images/date_icon.svg";
import moment from 'moment/moment';
import { Fragment } from 'react';
import add from "../../assets/images/add.svg";
import search_img from "../../assets/images/search.svg";
import pdf from "../../assets/images/pdf.svg";
import share from "../../assets/images/share.svg";
import print from "../../assets/images/print.svg";
import no_data from "../../assets/images/no_data.svg";
import right_click from "../../assets/images/right_click.svg";
import { NonceProvider } from 'react-select';
import DateRangeComp from './DateRangeComp';
import DatePicker from './DatePicker';

const Span = styled.span`
    font-size: 15px;
    color:red;
    font-weight: bold;
`
const Card = styled.h5`
    font-weight: bold;
    font-size: 12px;
    color:black;
`
const BuyerLedger = () => {
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
    const [ledgerSummaryData, setLedgerSummaryData] = useState({});
    const [recordDisplay, setRecordDisplay]=useState("");
    const [record, setRecord]=useState(false);
    const [partyType, setPartyType] = useState("");
    const [dateDisplay, setDateDisplay]=useState(false);
    
    useEffect(() => {
        fetchBuyerLedger();
    }, [clickId]);
    const fetchBuyerLedger = () => {
        getBuyerLedgers(clickId).then(response => {
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
        getBuyerLedgerSummary(clickId, id);
        ledger.filter((item) => {
            if (item.partyId === id) {
                setDisplayLink(!displayLink);
                navigate(`ledgersummary/${id}`);
                return item.partyId;
                //navigate("ledgerSummary");
            }
            else {
                return <p>Not Found</p>
            }
        });
    }
    useEffect(() => {
        tabEvent();;
        getBuyerLedgerSummary(clickId,partyId);
      }, [clickId,partyId]);
    
      const getBuyerLedgerSummary = (clickId, partyId) => {
        getLedgerSummary(clickId,partyId).then(response => {
            setLedgerSummaryData(response.data.data);
        })
        .catch(error => {
           setError(error.message);
        });
      }
    
    const addRecordPayment = (e) => {
        const addRecordData = {
            caId: clickId,
            date: new Date(),
            comments: comments,
            paidRcvd: paidRcvd,
            paymentMode: paymentMode,
            partyId: partyId
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
        navigate("/buyerledger")
        setIsOpen(false);
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
        if(type==='All'){  
            console.log(type)   
            setDateDisplay(false);              
            navigate(`ledgersummary/${partyId}`);
        }
        else if(type==='Custom'){
            console.log(type);
            setDateDisplay(!dateDisplay);
        }
      };
    return (
        <div className="ledger">
            <div className='record-update' style={{display: record?'block':'none'}}>
                <p>{recordDisplay}</p>
                <img src={right_click} className="right-click" />
                <img src={close_btn} className="recordclose-btn" onClick={()=>setRecord(false)}/>
            </div>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <form class="d-flex">
                        <input id="searchbar"  type="text" value={search} placeholder='Search by Name / Short Code'
                            onChange={(e) => { setSearch(e.target.value) }}  className='searchbar' />
                    </form>
                    <div className='searchicon'><img src={search_img} alt="search" /></div>
                </div>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup" className='links-tag'
                    style={{display: displayLink ? 'block' : 'none' }}>
                    <div className='date-byledgers' style={{display: dateDisplay ? 'block':'none'}}>
                        <div className='dateRangePicker' style={{display: dateDisplay ? 'block':'none'}}>
                            <DateRangeComp />
                        <img id="date_icon" src={date_icon} />
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
                            <p class="card-text" className='paid'>Total Business<br/> <span className='coloring'>
                            &#8377;{ledgerSummaryData.totalTobePaidRcvd? ledgerSummaryData.totalTobePaidRcvd:0}</span></p>
                            <p className='total-paid'>Total Paid <br/><span className='coloring'>
                            &#8377;{ledgerSummaryData.totalRcvdPaid? ledgerSummaryData.totalRcvdPaid:0}</span> </p> 
                            <p className='out-standing'>Outstanding Recievables <br /><span className='coloring'>
                            &#8377;{ledgerSummaryData.outStdRcvPayble?ledgerSummaryData.outStdRcvPayble:0}</span></p>  
                            <hr style={{background: '#FFFFFF',postion:'absolute',
                                        border: '1px solid #E4E4E4',height:'0px',marginTop:'50px',width:'600px',
                                        paddingRight:'-20px',
                            }}/>
                            
                            <nav className='links'>
                                <Link to={`ledgersummary/${partyId}`} className="ledgersummary">LedgerSummary</Link>
                                <Link to={`detailedledger/${partyId}`} className="detailedledger">Detailed Ledger</Link>
                                <Outlet />
                        </nav>         
                            {/*<hr style={{color:"blue", marginTop:"25px"}}/>
                            <div className="images">
                            <img src={pdf} className="pdf"/>
                            <img src={share} className="share" />
                            <img src={print} className="print"/>
                            </div>*/}
                        </div>
                        <button className="record-btn" onClick={() => setIsOpen(!isOpen)}>
                            <img src={add} className='record-img' />Add Record</button>
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
                        <div class="card" id="recievable-card">
                            <div class="card-body">
                                {
                                    ledger.map((item,index)=>{
                                        return(
                                            <Fragment>
                                            <tr>
                                            <td className='profile-details' key={item.partyName}>
                                                {item.partyName}
                                                {item.mobile}<br />
                                                {item.profilePic}
                                                {item.partyAddress}
                                            
                                            </td>
                                            </tr>
                                        </Fragment>
                                        )
                                    })
                                }
                                <p class="card-text" id="date-tag">
                                <DatePicker />
                                <img className="date_icon" src={date_icon} />
                                </p>
                            </div>
                        </div> 
                        <p id='p-tag'>Total Outstanding Recievables</p>
                        <p id="recieve-tag">&#8377;{ledgerSummaryData.outStdRcvPayble}</p>

                        <div class="form-group">
                            <label hmtlFor="amtRecieved" id="amt-tag">Amount Recieved</label>
                            <input class="form-control" id="amtRecieved" value={paidRcvd} placeholder="&#8377;" required
                                onChange={(e) => setPaidRcvd(e.target.value)} />
                        </div>
                        <p className='payment-tag'>Payment Method</p>

                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="radio" id="inlineRadio1" value={paymentMode}
                                onChange={(e) => setPaymentMode(e.target.value)}  required/>
                            <label class="form-check-label" for="inlineRadio1">Cash</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="radio" id="inlineRadio2" value={paymentMode}
                                onChange={(e) => setPaymentMode(e.target.value)} required/>
                            <label class="form-check-label" for="inlineRadio2">UPI</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="radio" id="inlineRadio3" value={paymentMode}
                                onChange={(e) => setPaymentMode(e.target.value)} required/>
                            <label class="form-check-label" for="inlineRadio3">NEFT</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="radio" id="inlineRadio4" value={paymentMode}
                                onChange={(e) => setPaymentMode(e.target.value)} required/>
                            <label class="form-check-label" for="inlineRadio4">RTGS</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="radio" id="inlineRadio5" value={paymentMode}
                                onChange={(e) => setPaymentMode(e.target.value)} required/>
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
                                if (search ===" ") return <p>Not Found</p>;
                                else if (item.partyName.toLowerCase().includes(search.toLowerCase())) {
                                    console.log(item.partyName);
                                    console.log(search)
                                    return(<p>item.partyName</p>);
                                }
                                else {
                                    return <p>Not Found</p>
                                }
                            })
                                .map((item, index) => {
                                    return (
                                        <Fragment>
                                        <tr onClick={(id) => { particularLedger(item.partyId) }}>
                                            <td scope="row">{index+1}</td>
                                            <td key={item.date}>{item.date}</td>
                                            <td key={item.partyName}><span class="name-tag">
                                                {item.partyName}<br />
                                                {item.partyAddress}
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
                            <img src={no_data}/>
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

export default BuyerLedger
