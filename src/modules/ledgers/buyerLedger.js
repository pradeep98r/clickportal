import React from 'react'
import { useState } from 'react';
import { Fragment } from 'react'
import search_img from "../../assets/images/search.svg";
import "../../modules/ledgers/buyerLedger.scss";
import { 
    getBuyerDetailedLedger,
    getBuyerLedgers,
    getDetailedLedgerByDate,
    getLedgerSummary, 
    getLedgerSummaryByDate, 
    postRecordPayment} 
    from '../../actions/billCreationService';
import { useEffect } from 'react';
import single_bill from "../../assets/images/bills/single_bill.svg";
import no_data from "../../assets/images/no_data_available.png";
import add from "../../assets/images/add.svg";
import ReactDatePicker from 'react-datepicker';
import close_btn from "../../assets/images/close_btn.svg";
import date_icon from "../../assets/images/date_icon.svg";
import ReactModal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import right_click from "../../assets/images/right_click.svg";
import $ from "jquery";
import "../../modules/buy_bill_book/buyBillBook.scss";
import moment from 'moment';
const BuyerLedger = () => {
    const [search, setSearch] = useState("");
    const [openTabs, setOpenTabs] = useState(false);
    const [ledger, setLedgeres] = useState([{}]);
    const [data, setData] = useState({}, ledger);
    const [error, setError] = useState();
    const loginData = JSON.parse(localStorage.getItem("loginResponse"));
    const clickId = loginData.clickId;
    const [ledgerSummary, setSummary] = useState([{}]);
    const [summaryData, setSummaryData] = useState({}, ledgerSummary);
    const [details, setDetails] = useState([{}]);
    //const [detailedData, setDetailedData] = useState({}, details);
    
    const [open, setIsOpen] = useState(false);
    const [selectDate, setSelectDate] = useState(new Date());
    const [paidRcvd, setPaidRcvd] = useState(0);
    const [comments, setComments] = useState(" ");
    const [paymentMode, setPaymentMode] = useState('');
    const [dateDisplay, setDateDisplay] = useState(false);
    
    const [ledgerSummaryByDate, setSummaryByDate] = useState([{}]);
    //const [summaryDataByDate, setSummaryDataByDate] = useState({}, ledgerSummaryByDate);
    const [detailsByDate, setDetailsByDate] = useState([{}]);
    //const [detailedDataByDate, setDetailedDataByDate] = useState({}, detailsByDate);

    const navigate=useNavigate();
    const [toggleState, setToggleState] = useState("ledgersummary");
    const toggleTab = (type) => {
        setToggleState(type);
    };
    const [toggleAC, setToggleAC] = useState("all");
    const toggleAllCustom = (type) => {
        setToggleAC(type);
        if(type==='custom'){
            console.log(type);
            setDateDisplay(!dateDisplay);
        }
        else if(type==='all'){
            setDateDisplay(false);
        }
    };

    let partyId=0;
    let fromDate=null;
    let toDate=null;
    //Fetch ledger by party Type
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
    //Get partner By partyId
    const particularLedger = (id) => {
        console.log(id);
        //getBuyerLedgerSummary(clickId, id);
        setOpenTabs(true);
        ledger.filter((item) => {
            if (item.partyId === id) {
                partyId=id;
                localStorage.setItem('partyId', JSON.stringify(partyId));
                getBuyerLedgerSummary(clickId, id);
                fetchBuyerLedgerDetails(clickId, id);
                return item.partyId;
                //navigate("ledgerSummary");
            }
            else {
                return <p>Not Found</p>
            }
        });
    }
    //Get Buyer Ledger Summary
    const getBuyerLedgerSummary = (clickId,partyId) => {
        getLedgerSummary(clickId,partyId).then(response => {
            setSummaryData(response.data.data);
            setSummary(response.data.data.ledgerSummary)
        }).catch(error => {
          setError(error.message);
       });
    }
      
    //Get Buyer Detailed Ledger
    const fetchBuyerLedgerDetails = (clickId,partyId) => {
        getBuyerDetailedLedger(clickId,partyId).then(response => {
            //setDetailedData(response.data.data);
            setDetails(response.data.data.details);
        })
        .catch(error => {
          setError(error.message);
        })
    }
    //Convert standard date to date
    function convert(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }
     //Add Record payment
    const addRecordPayment = (transId) => {
        const addRecordData = {
            caId: clickId,
            partyId:JSON.parse(localStorage.getItem("partyId")),
            date: convert(selectDate),
            comments: comments,
            paidRcvd: paidRcvd,
            paymentMode: paymentMode,
        }
        console.log(selectDate);
        postRecordPayment(addRecordData).then(response => {
             console.log(response.data.data);
             window.location.reload();
            
         })
         .catch(error => {
           console.log(error);
         })
        navigate("/buyerledger")
        setIsOpen(false);
        localStorage.removeItem("partyId");
    }
    //Fetch Ledger Summary By Date
    const fetchLedgerSummaryByDate=(clickId,partyId,fromDate,toDate)=>{
      console.log(fromDate, toDate);
        getLedgerSummaryByDate(clickId,partyId,fromDate,toDate)
        .then(response=>{
          //setSummaryDataByDate(response.data.data);
          setSummaryByDate(response.data.data.ledgerSummary);
        }).catch(error => {
            console.log(error);
          })
    }
    const fetchDetailedLedgerByDate=(clickId, partyId,fromDate,toDate)=>{
      getDetailedLedgerByDate(clickId, partyId, fromDate, toDate)
      .then(response=>{
        setDetailsByDate(response.data.data.details);
        //setDetailedDataByDate(response.data.data)
      }).catch(error=>{
        setError(error);
        console.log(error.message);
      })
    }
    //Date Range Select
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
    const getDate = () => {
        fromDate = convert(startDate);
        toDate = convert(endDate);
        localStorage.setItem('fromDate', JSON.stringify(fromDate))
        localStorage.setItem('toDate', JSON.stringify(toDate))
        fetchLedgerSummaryByDate(clickId,partyId,fromDate,toDate);
        fetchDetailedLedgerByDate(clickId,partyId,fromDate,toDate);
        $("#datePopupmodal").modal("hide");
        setIsOpen(false);
    }
  return (
    <Fragment>
      <div className='no_data_found' style={{ display: openTabs ? 'none' : 'block' }}>
        <img src={no_data} className='no-data-img' /></div>
        <nav class="navbar navbar-expand-lg ">
           <div class="container-fluid">
           <form class="d-flex">
             <input id="searchbar" type="text" value={search} placeholder='Search by Name / Short Code'
               onChange={(e) => { setSearch(e.target.value) }} className='searchbar-input' />
           </form>
           <div className='searchicon'><img src={search_img} alt="search" /></div>
         </div>
       </nav>
       <div className="container-fluid px-0" id="tabsEvents" style={{ display: openTabs ? 'block' : 'none' }}>
          <div className="bloc-tab">
              <a href={"#All"}
                  className={toggleAC === 'all' ? "tabers active-tab" : "tabers"}
                  onClick={() => toggleAllCustom('all')}
              >All</a>
              <a href={"#Custom"}
                  className={toggleAC === 'custom' ? "tabers active-tab" : "tabers"}
                  onClick={() => toggleAllCustom('custom')}
              >Custom</a>
            </div>
            <div class="card" className='details-tag'>
                <div class="card-body">
                    {
                        ledger.map((item, index) => {
                            partyId=JSON.parse(localStorage.getItem('partyId'));
                            if (item.partyId == partyId) {
                                return (
                                    <Fragment>
                                        <tr>
                                            <td className='profile-details' key={item.partyName}>
                                                <p className='names-tag'>{item.partyName}</p><br />
                                                <p className='profiles-dtl'>{item.mobile}<br />{item.partyAddress}</p>
                                                {item.profilePic ? item.profilePic
                                                :<img id="singles-img" src={single_bill} alt="img"/>}
                                                
                                            </td>
                                        </tr>
                                    </Fragment>
                                    )
                                }
                                else {
                                    <p>No Data Found</p>
                                }
                            })
                    }
                    <p class="card-text" className='paid'>Total Business<br /> <span className='coloring'>
                        &#8377;{summaryData.totalTobePaidRcvd ? summaryData.totalTobePaidRcvd : 0}</span></p>
                    <p className='total-paid'>Total Paid <br /><span className='coloring'>
                        &#8377;{summaryData.totalRcvdPaid ? summaryData.totalRcvdPaid : 0}</span> </p>
                    <p className='out-standing'>Outstanding Recievables <br /><span className='coloring'>
                        &#8377;{summaryData.outStdRcvPayble ? summaryData.outStdRcvPayble : 0}</span></p>
                    <hr style={{
                        background: '#FFFFFF', postion: 'absolute',
                        border: '1px solid #E4E4E4', height: '0px', marginTop: '45px', width: '100%',
                        paddingRight: '-40px',
                    }} />
                    <div className="bloc-tabs">
                        <a href={"#ledgersummary"}
                            className={toggleState === 'ledgersummary' ? "tabs active-tabs" : "tabs"}
                            onClick={() => toggleTab('ledgersummary')}
                        >
                            Ledger Summary
                        </a>
                        <a href={"#detailedledger"}
                            className={toggleState === 'detailedledger' ? "tabs active-tabs" : "tabs"}
                            onClick={() => toggleTab('detailedledger')}
                        >
                            Detailed Ledger
                        </a>
                    </div>
                    {/*<hr style={{color:"blue", marginTop:"25px"}}/>
                            <div className="images">
                            <img src={pdf} className="pdf"/>
                            <img src={share} className="share" />
                            <img src={print} className="print"/>
                            </div>*/}
                </div>
            </div>
         <div className="recordbtn-style">
            <button className="add-record-btn" onClick={() =>
            {(toggleState === 'ledgersummary' || toggleState === 'detailedledger')
             && setIsOpen(!open)}}><img src={add} id='addrecord-img'/> Add Record</button>
         </div>
         <hr style={{background: '#FFFFFF', postion: 'absolute',
                        border: '1px solid #E4E4E4', height: '0px', marginTop: '25px', width: '100%',
                        width:'500px',paddingLeft:'480px'}} />
         {toggleAC==='all' && toggleState === 'ledgersummary' &&
         <div id="ledger-summary" className={toggleState === 'ledgersummary' ? "content  active-content" : "content"}>
            <table class="table table-fixed" className="ledger-table">
               <thead className="thead-tag">
                 <tr>
                   <th scope="col">#</th>
                   <th scope="col">RefId | Date</th>
                   <th scope="col">Paid</th>
                   <th scope="col">To Be Paid</th>
                  <th scope="col">Ledger Balance</th>
                 </tr>
              </thead>
              <tbody>
                 {
                   ledgerSummary.length > 0 ? (
                     ledgerSummary.map((item, index) => {
                       return (
                         <tr className="tr-tags">
                           <th scope="row">{index + 1}</th>
                           <td><span style={{'color':'#0066FF'}}>{item.refId}</span> <br />
                           {moment(item.date).format("DD-MMM-YY")}</td>
                           <td>&#8377;{item.paidRcvd ? item.paidRcvd : 0}</td>
                           <td>&#8377;{item.tobePaidRcvd ? item.tobePaidRcvd : 0}</td>
                           <td><span className='coloring'>&#8377;{item.balance ? item.balance : 0}</span></td>
                         </tr>
                        )
                     })
                   ) : (<p style={{ fontSize: "20px" }}>No Data Available!</p>)
                 }
               </tbody>
             </table>
           </div>}
           {toggleAC==='all' && toggleState === 'detailedledger' &&
           <div id="ledger-summary" className={toggleState === 'detailedledger' ? "content  active-content" : "content"}>
            <table class="table table-fixed" className="ledger-table">
               <thead className="thead-tag">
                 <tr>
                   <th scope="col">#</th>
                   <th scope="col">RefId | Date</th>
                   <th scope="col">Item<br/> Unit | Kgs | Rate</th>
                   <th scope="col">Recieved</th>
                   <th scope='col'>To Be Recieved</th>
                  <th scope="col">Ledger Balance(&#8377;)</th>
                 </tr>
              </thead>
              <tbody>
                 {
                   details.length > 0 ? (
                     details.map((item, index) => {
                       return (
                         <tr className="tr-tags">
                           <th scope="row">{index + 1}</th>
                           <td><span style={{'color':'#0066FF'}}>{item.refId}</span> <br />
                           {moment(item.date).format("DD-MMM-YY")}</td>
                           <td>{item.itemName} {item.unit}&nbsp;{item.kg}&nbsp;{item.rate}</td>
                           <td>&#8377;{item.recieved ? item.recieved : 0}</td>
                           <td>{item.toBeRecieved ? item.toBeRecieved : 0}</td>
                           <td><span className='coloring'>&#8377;{item.balance ? item.balance : 0}</span></td>
                         </tr>
                        )
                     })
                   ) : (<p style={{ fontSize: "20px" }}>No Data Available!</p>)
                 }
               </tbody>
             </table>
           </div>
          }
          {toggleAC==='custom' && toggleState === 'ledgersummary' &&
          <div id="ledger-summary" className={toggleState === 'ledgersummary' ? "content  active-content" : "content"}>
             <table class="table table-fixed" className="ledger-table">
                <thead className="thead-tag">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">RefId | Date</th>
                    <th scope="col">Paid</th>
                    <th scope="col">To Be Paid</th>
                   <th scope="col">Ledger Balance</th>
                  </tr>
               </thead>
               <tbody>
                  {
                    ledgerSummaryByDate.length > 0 ? (
                      ledgerSummaryByDate.map((item, index) => {
                        return (
                          <tr className="tr-tags">
                            <th scope="row">{index + 1}</th>
                            <td><span style={{'color':'#0066FF'}}>{item.refId}</span> <br />
                            {moment(item.date).format("DD-MMM-YY")}</td>
                            <td>&#8377;{item.paidRcvd ? item.paidRcvd : 0}</td>
                            <td>&#8377;{item.tobePaidRcvd ? item.tobePaidRcvd : 0}</td>
                            <td><span className='coloring'>&#8377;{item.balance ? item.balance : 0}</span></td>
                          </tr>
                         )
                      })
                    ) : (<p style={{ fontSize: "20px" }}>No Data Available!</p>)
                  }
                </tbody>
              </table>
            </div>}
            {toggleAC==='custom' && toggleState === 'detailedledger' &&
            <div id="ledger-summary" className={toggleState === 'detailedledger' ? "content  active-content" : "content"}>
             <table class="table table-fixed" className="ledger-table">
                <thead className="thead-tag">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">RefId | Date</th>
                    <th scope="col">Item<br/> Unit | Kgs | Rate</th>
                    <th scope="col">Recieved</th>
                    <th scope='col'>To Be Recieved</th>
                   <th scope="col">Ledger Balance(&#8377;)</th>
                  </tr>
               </thead>
               <tbody>
                  {
                    detailsByDate.length > 0 ? (
                      detailsByDate.map((item, index) => {
                        return (
                          <tr className="tr-tags">
                            <th scope="row">{index + 1}</th>
                            <td><span style={{'color':'#0066FF'}}>{item.refId}</span> <br />
                            {moment(item.date).format("DD-MMM-YY")}</td>
                            <td><span style={{fontSize:'12px'}}>{item.itemName}</span><br/>
                           <span style={{fontSize:'13px'}}>{item.qty?item.qty:0} {(item.unit?item.unit:'').charAt(item).toUpperCase()}
                            &nbsp;|&nbsp;{item.kg?item.kg :0}&nbsp;|&nbsp;{item.rate?item.rate:0}</span></td>
                            <td>&#8377;{item.recieved ? item.recieved : 0}</td>
                            <td>{item.toBeRecieved ? item.toBeRecieved : 0}</td>
                            <td><span className='coloring'>&#8377;{item.balance ? item.balance : 0}</span></td>
                          </tr>
                         )
                      })
                    ) : (<p style={{ fontSize: "20px"}}>No Data Available!</p>)
                  }
                </tbody>
              </table>
            </div>
           }
           <ReactModal isOpen={open} className='modal-tag' 
            style={
              {
                   overlay: {
                       position: 'absolute',
                       top: "85px",
                       left: 0,
                       right: 0,
                       bottom: 0,
                       marginLeft: "350px",
                       width: "730px",
                       height: "500px",
                       transition: 'ease-out',
                       border:'none',
                       borderRadius: '10px'
                   }
               }
             }>
             <div className="add-record">
               <div className="btn-round">
                 <img src={close_btn} className="closing-btn" onClick={() => setIsOpen(false)} />
               </div>
               <h6 className="record-name">Record Record Recievable</h6>
               <form onSubmit={addRecordPayment}>
                 <div className="card">
                   <div className="card-body" id="pref-details-tag">
                     {
                       ledger.map((item, index) => {
                         partyId=JSON.parse(localStorage.getItem('partyId'))
                         if (item.partyId == partyId) {
                             return (
                                 <Fragment>
                                     <tr>
                                          <td className='profile-details' key={item.partyName}>
                                             <p className='names-tag'>{item.partyName}</p><br />
                                             <p className='profiles-dtl'>{item.mobile}<br />{item.partyAddress}</p>
                                             {item.profilePic ? item.profilePic
                                             :<img id="singles-img" src={single_bill} alt="img"/>}
                                             
                                         </td>
                                     </tr>
                                 </Fragment>
                             )
                         }
                       })
                     }
                     <span class="card-text" id="date-tag">
                       <ReactDatePicker className='date_picker'
                         selected={selectDate}
                         onChange={date => { setSelectDate(date) }}
                         dateFormat='dd-MMM-yy'
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
                           marginTop: "30px",
                           fontFamily: 'Manrope',
                           fontStyle: "normal",
                           fontWeight: "600",
                           fontSize: "15px",
                           lineHeight: "18px"
                         }}
                        >
                       </ReactDatePicker>
                       <img className="date_icon" src={date_icon} />
                     </span>
                   </div>
                 </div>
                 <p id='out-tag'>Outstanding Paybles</p>
                 <p id="recieve-tag">&#8377;{data.totalOutStgAmt ? data.totalOutStgAmt : 0}</p>
                 <div class="form-group">
                   <label hmtlFor="amtRecieved" id="amt-tag">Amount</label>
                   <input class="form-control" id="amtRecieved" value={paidRcvd} placeholder="&#8377;" required
                     onChange={(e) => setPaidRcvd(e.target.value)}/>
                 </div>
                 <p className='payment-tag'>Payment Method</p>
                 <div class="form-check form-check-inline">
                   <input class="form-check-input" type="radio" name="radio" id="inlineRadio1" value="CASH"
                     onChange={(e) => setPaymentMode(e.target.value)} required />
                   <label class="form-check-label" for="inlineRadio1">CASH</label>
                 </div>
                 <div class="form-check form-check-inline">
                   <input class="form-check-input" type="radio" name="radio" id="inlineRadio2" value="UPI"
                     onChange={(e) => setPaymentMode(e.target.value)} required />
                   <label class="form-check-label" for="inlineRadio2">UPI</label>
                 </div>
                 <div class="form-check form-check-inline">
                   <input class="form-check-input" type="radio" name="radio" id="inlineRadio3" value="NEFT"
                     onChange={(e) => setPaymentMode(e.target.value)} required />
                   <label class="form-check-label" for="inlineRadio3">NEFT</label>
                 </div>
                 <div class="form-check form-check-inline">
                   <input class="form-check-input" type="radio" name="radio" id="inlineRadio4" value="RTGS"
                     onChange={(e) => setPaymentMode(e.target.value)} required />
                   <label class="form-check-label" for="inlineRadio4">RTGS</label>
                 </div>
                 <div class="form-check form-check-inline">
                   <input class="form-check-input" type="radio" name="radio" id="inlineRadio5" value="IMPS"
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
             </div>
            </ReactModal>
             <div className='dateRangePicker' style={{ display: dateDisplay ? 'block' : 'none' }}>
                <div className="flex">
                    <div onClick={DateModal}><img id="date_icon" src={date_icon} /></div>
                </div>
                <div className="modal fade" id="datePopupmodal">
                    <div className="modal-dialog modal-dialog-centered date_modal_dialog">
                        <div className="modal-content">
                            <div className="modal-header date_modal_header">
                                <h5 className="modal-title header2_text" id="staticBackdropLabel">Select Dates</h5>
                                <img src={close_btn} alt="image" className="close_icon" data-bs-dismiss="modal"/>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='table-scroll'>
         <table class="table table-fixed" className="ledger-table">
           <thead className="thead-tag">
             <tr>
               <th scope="col">#</th>
               <th scope="col">Date</th>
               <th scope="col">Transporter Name</th>
               <th scope="col">To Be Paid</th>
             </tr>
           </thead>
           <tbody>
             {
               ledger.length > 0 ? (
                 ledger.filter((item) => {
                   if (search === " ") return <p>Not Found</p>;
                   else if (item.partyName===search) {
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
                         <tr onClick={(id) => { particularLedger(item.partyId) }} className="tr-tags">
                           <td scope="row">{index + 1}</td>
                           <td key={item.date}>{moment(item.date).format("DD-MMM-YY")}</td>
                           <td key={item.partyName}><span className="namedtl-tag">
                             {item.partyName}<br /></span>
                             {item.partyAddress}<br />
                             {item.mobile}
                             {item.profilePic? item.profilePic
                               :<img className="profile-img" src={single_bill} alt="img"/>}
                           </td>
                           <td key={item.tobePaidRcvd}><span className='coloring'>&#8377;
                             {item.tobePaidRcvd ? item.tobePaidRcvd : 0}</span></td>
                         </tr>
                       </Fragment>
                     )
                   })
               ) :
                 (<div>
                   <img src={no_data} />
                   <p>No Data Available</p>
                 </div>
                 )
 
             }
           </tbody>
         </table>
         <div className="outstanding-pay">
           <p className="pat-tag">Outstanding Recievables:</p>
           <p className="values-tag">&#8377;{data.totalOutStgAmt ? data.totalOutStgAmt : 0}</p>
         </div>
       </div>
    </Fragment>
  )
}

export default BuyerLedger