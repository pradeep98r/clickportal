import React, { useEffect, useState } from 'react'
import ReactModal from 'react-modal';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getBuyerLedgers } from '../../actions/billCreationService';
import "../Ledgers/BuyerLedger.scss";
import close_btn from "../../assets/images/close_btn.svg";
import date_picker from "../../assets/images/date_picker.svg";
import ReactDatePicker from 'react-datepicker';
import date_icon from "../../assets/images/date_icon.svg";

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
    useEffect(() => {
        fetchBuyerLedger();
    }, []);
    const fetchBuyerLedger = () => {
        getBuyerLedgers(clickId).then(response => {
            setData(response.data.data);
            setLedgeres(response.data.data.ledger);
            console(response.data.data, "Buyer Details");
        })
            .catch(error => {
                setError(error.message);
            })
    }

    /*const particularLedger=(partyId)=>{
        details.map((item,index)=>{
            if(item.partyId.includes(partyId)){
                return item;
            }
        })
    }*/
    const particularLedger = (id) => {
        ledger.filter((item) => {
            if (item.partyId === id) {
                return item;
            }
            else {
                return <p>Not Found</p>
            }
        });
    }

    const addRecordPayment=(e)=>{
        e.preventDefault();
        console.log("Record Payment Done Successfully")
        navigate("/buyerledger")
        setIsOpen(false);
    }
    return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <form class="d-flex">
                        <input id="searchbar" class="form-control me-12" type="search" placeholder="Search" aria-label="Search"
                            onChange={(e) => { setSearch(e.target.value) }} />
                    </form>
                </div>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav">
                        <Link to="ledgersummary" className="ledgersummary">LedgerSummary</Link>
                        <Link to="detailedledger" className="detailedledger">Detailed Ledger</Link>
                    </div>
                    <Outlet />
                </div>
                <ReactModal isOpen={isOpen}
                    style={
                        {
                            overlay: {
                                position: 'absolute',
                                top: 90,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                marginLeft: "350px",
                                width: "750px",
                                height: "540px",
                                overflow:'visible',
                                transition:'ease-out'
                            }
                        }
                    }>
                    <img src={close_btn} className="close-btn" onClick={() => setIsOpen(false)} />
                    <h5>Add Record Recivable</h5>
                    <div class="card"  id="recievable-card">
                        <div class="card-body">
                            <p class="card-text" id="date-tag">
                            <ReactDatePicker  className='date_picker'
                            selected={selectDate}
                            onChange={date=>{setSelectDate(date)}}
                            dateFormat='dd/MM/yyyy'
                            maxDate={new Date()}
                            showMonthYearDropdown={true}
                            scrollableMonthYearDropdown
                            style=
                            {{
                                width:"400px",
                                cursor: "pointer",
                                right:"300px"
                            }}
                            >
                            </ReactDatePicker>
                            <img id="date_icon" src={date_icon} />
                            </p>
                        </div>
                    </div>
                    <p id='p-tag'>Total Outstanding Recievables</p>
                    <p id="recieve-tag">&#8377;{data.totalRecievables}123456</p>
                    <form>
                        <div class="form-group">
                            <label for="exampleInputEmail1" id="amt-tag">Amount Recieved</label>
                            <input class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="&#8377;" />
                        </div>
                    </form>
                    <p className='payment-tag'>Payment Method</p>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="radio" id="inlineRadio1" value="Cash" />
                        <label class="form-check-label" for="inlineRadio1">Cash</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="radio" id="inlineRadio2" value="UPI" />
                        <label class="form-check-label" for="inlineRadio2">UPI</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="radio" id="inlineRadio3" value="NEFT" />
                        <label class="form-check-label" for="inlineRadio3">NEFT</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="radio" id="inlineRadio4" value="RTGS" />
                        <label class="form-check-label" for="inlineRadio4">RTGS</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio4" value="IMPS" />
                        <label class="form-check-label" for="inlineRadio5">IMPS</label>
                    </div>
                    <div class="mb-3">
                        <label for="exampleFormControlTextarea1" class="form-label" id="comment-tag">Comment</label>
                        <textarea class="form-control" id="exampleFormControlTextarea1" rows="2"></textarea>
                    </div>
                <button className='submit-btn' onClick={addRecordPayment}>SUBMIT</button>
                </ReactModal>
                <button class="record-btn" onClick={() => setIsOpen(!isOpen)}>Add Record</button>
            </nav>
            <table class="table" id="ledger-table">
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
                                    <tr onClick={particularLedger(item.partyId)}>
                                        <td scope="row">{index}</td>
                                        <th key={item.date}>{item.date}</th>
                                        <td key={item.partyName}><span class="name-tag">
                                            {item.partyName}
                                            {item.partyAddress}
                                            {item.mobile}
                                        </span>
                                        </td>
                                        <td key={item.tobePaidRcvd}><span class="recieved-tag">&#8377;
                                            {item.tobePaidRcvd ? item.tobePaidRcvd : 0}</span></td>
                                    </tr>
                                )
                            })

                    }
                </tbody>
            </table>
        </div>
    )
}

export default BuyerLedger
