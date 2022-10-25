import { Fragment, useEffect, useState } from "react";
import ComingSoon from "../../components/comingSoon";
import search_img from "../../assets/images/search.svg";
import "../../modules/transporto_ledger/transportoLedger.scss"
import { 
  addRecordInventory,
  getInventory,
  getInventoryLedgers,
  getParticularTransporter,
  getTransporters,
  postRecordPayment
} from "../../actions/transporterService";
import no_data from "../../assets/images/no_data.svg";
import add from "../../assets/images/add.svg";
import ReactModal from "react-modal";
import close_btn from "../../assets/images/close_btn.svg";
import ReactDatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import date_icon from "../../assets/images/date_icon.svg";
import single_bill from "../../assets/images/bills/single_bill.svg";
import moment from "moment/moment";
import $ from "jquery";
import context from "react-bootstrap/esm/AccordionContext";
const TransportoLedger = () => {
  const [transporter, setTransporter] = useState([{}]);
  const [data, setData] = useState({}, transporter);
  const [searchName, setSearchName] = useState('');
  const [error, setError] = useState();
  const [openTabs, setOpenTabs] = useState(false);

  const [ledgerSummary, setLedgerSummary] = useState([{}])
  const [payLedger, setPayLedger] = useState({}, ledgerSummary);

  const [invLedger, setInvLedger] = useState([{}]);
  const [invDetails, setInvDetails]= useState({}, invLedger);

  const [open, setIsOpen] = useState(false);

  const [selectDate, setSelectDate] = useState(new Date());
  const [paidRcvd, setPaidRcvd] = useState(0);
  const [comments, setComments] = useState(" ");
  const [paymentMode, setPaymentMode] = useState('CASH');
  //const [recordDisplay, setRecordDisplay]= useState("");
  //const [record, setRecord]=useState(false);
  const [unit, setUnit]= useState('CRATES');
  const [qty, setQty]= useState(0);
  const [openInventory, setOpenInventory]= useState(false);
  const [isActive, setIsActive] = useState(-1);
  const [getInventor, setGetInventory]=useState([]);
  const navigate=useNavigate();
  
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  let transId=0;

  const [toggleState, setToggleState] = useState("paymentledger");
  const toggleTab = (type) => {
    setToggleState(type);
  };

  const [toggleInventory, setToggleInventory]= useState("Given");
  const toggleTabs =(type) =>{
    setToggleInventory(type);
  }
  useEffect(() => {
    getTransportersData();
  }, [clickId])

  const getTransportersData = () => {
    getTransporters(clickId).then(response => {
      setData(response.data.data);
      setTransporter(response.data.data.ledgers);
      console(response.data.data, "Transporter Details");
    })
      .catch(error => {
        setError(error);
      })
  }

  //get Payment Ledger
  const paymentLedger = (clickId, partyId) => {
    getParticularTransporter(clickId, partyId)
      .then(response => {
        setPayLedger(response.data.data);
        setLedgerSummary(response.data.data.ledgerSummary);
        console.log(payLedger, "payledger");
      }).catch(error => { setError(error) });
  }

  // get Inventory Ledger
  const inventoryLedger = (clickId, transId) => {
    getInventoryLedgers(clickId, transId)
      .then(response => {
        setInvLedger(response.data.data);
        setInvDetails(response.data.data.details);
        console.log(invLedger, "Inv Ledger");
      }).catch(error => { setError(error) });
  }

  //Get transporter By partyId
  const particularLedger = (id,indexs) => {
    transId=id;
    setOpenTabs(true);
    setIsActive(indexs);
    //getTransportersData(clickId, id);
    transporter.filter((item) => {
      if (item.partyId === id) {
        transId=id;
        localStorage.setItem('transId', JSON.stringify(transId));
        paymentLedger(clickId, id);
        inventoryLedger(clickId, id);
        getInventoryRecord();
        //return item.partyId;
      }
      else {
        return <p>Not Found</p>
      }
    });
  }
  // Convert standard date time to normal date
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
        partyId:JSON.parse(localStorage.getItem("transId")),
        date: convert(selectDate),
        comments: comments,
        paidRcvd: paidRcvd,
        paymentMode: paymentMode,
    }
    console.log(selectDate);
    postRecordPayment(addRecordData).then(response => {
        console.log(response.data.data);
        window.location.reload();
        //setRecordDisplay("Record Updated Successfully");
        //setRecord(true);
    })
    .catch(error => {
      console.log(error);
    })
    navigate("/transportoledger")
    setIsOpen(false);
  }

  //Add Record Inventory
  const postRecordInventory =()=>{
    const inventoryRequest={
      caId:clickId,
      transId:JSON.parse(localStorage.getItem("transId")),
      comments: comments,
      date: convert(selectDate),
      type:toggleInventory.toUpperCase(),
      details:[{
        qty:parseInt(qty),
        unit:unit
      }]
    }
    addRecordInventory(inventoryRequest)
    .then(response=>{
      console.log(response.data.data);
      window.location.reload();
      //setRecordDisplay("Record Updated Successfully");
      //setRecord(true);
    })
    .catch(error=>{setError(error);console.log(error.message)});
    navigate("/transportoledger");
    setOpenInventory(false);
    localStorage.removeItem("transId");
  }
  //get Inventory
  const getInventoryRecord=()=>{
    getInventory(clickId,transId).then(response=>{
      console.log(response.data.data);
      setGetInventory(response.data.data)
    })
    .catch(error=>{
      console.log(error);
    })
  }
  //transId=JSON.parse(localStorage.getItem('transId'));
  return (
    <Fragment>
      <nav class="navbar navbar-expand-lg ">
        <div class="container-fluid">
          <form class="d-flex">
            <input id="searchbar" type="search" value={searchName} placeholder='Search by Name / Short Code'
              onChange={(e) => { setSearchName(e.target.value) }} className='searchbar-input' />
          </form>
          <div className='searchicon'><img src={search_img} alt="search" /></div>
        </div>
      </nav>
      <div className="container-fluid px-0" id="tabsEvents" style={{ display: openTabs ? 'block' : 'none' }}>
        {isActive!==-1 &&
        <div class="card" className='transport-details'>
          <div class="card-body">
            {
              transporter.map((item, index) => {
                transId=JSON.parse(localStorage.getItem('transId'));
                if (item.partyId == transId) {
                    return (
                        <Fragment>
                            <tr>
                                <td className='profile-details' key={item.partyName}>
                                    <p className='names-tag'>{item.partyName}</p><br />
                                    <p className='profiles-dtl'>{item.mobile}<br />{item.partyAddress}</p>
                                    {item.profilePic ? item.profilePic
                                    :<img id="singles-img" src={single_bill} alt="img"/>}
                                    <span id="verticalLine"></span>
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
            <p class="card-text" className='paid'>Total Business<span id="vertical-line1"></span><br /> <span className='coloring'>
              &#8377;{payLedger.totalTobePaidRcvd ? payLedger.totalTobePaidRcvd.toFixed(2): 0}</span></p>
            <p className='total-paid'>Total Paid<span id="vertical-line"></span> <br /><span className='coloring'>
              &#8377;{payLedger.totalRcvdPaid ? payLedger.totalRcvdPaid.toFixed(2) : 0}</span> </p>
            <p className='out-standing'>Outstanding Paybles<br /><span className='coloring'>
              &#8377;{payLedger.outStdRcvPayble ? payLedger.outStdRcvPayble.toFixed(2): 0}</span></p>
            <span id="horizontal-line"></span>
            {/*<hr style={{
                background: '#FFFFFF', postion: 'absolute',
                border: '1px solid #E4E4E4', height: '0px', marginTop: '50px', width: '100%',
                paddingRight: '-40px',
            }} />*/}
            <div className="bloc-tabs">
              <button href={"#paymentledger"}
                className={toggleState === 'paymentledger' ? "tabs active-tabs" : "tabs"}
                onClick={() => toggleTab('paymentledger')}
              >
                Payment Ledger
              </button>
              <button href={"#inventoryledger"}
                className={toggleState === 'inventoryledger' ? "tabs active-tabs" : "tabs"}
                onClick={() => toggleTab('inventoryledger')}
              >
                Inventory Ledger
              </button>
            </div>
            <div className="recordbtn-style">
              <button className="add-record-btn" onClick={() =>
                {toggleState === 'paymentledger'? setIsOpen(!open)
                : setOpenInventory(!openInventory)}}  data-toggle="modal" data-target="#myModal">
                  <div className="add-pay-btn"><img src={add} className='addrecord-img'/></div> Add Record</button>
            </div>
          </div>
        </div>
        }
        {toggleState==='paymentledger' &&
        <div id="myModal" class="modal fade" role="dialog" data-backdrop="static">
          <div class="modal-dialog modal-lg transporter_modal d" id="modal-dailoges"
            style={{height:'500px',width:'748px',marginLeft:'270px',top:'50px'}}>
            <div class="modal-content" id="modal-content">
              <div class="modal-body" id="body-modal">
              <div className="add-record">
              <div className="btn-round">
                <img src={close_btn} className="closing-btn" data-dismiss="modal" onClick={() => setIsOpen(false)} />
              </div>
              <h6 className="record-name">Record Payment</h6>
              <form onSubmit={addRecordPayment}>
                <div className="card">
                  <div className="card-body" id="details-tag">
                    {
                      transporter.map((item, index) => {
                        if (item.partyId == transId) {
                            return (
                                <Fragment>
                                    <tr>
                                         <td className='profile-details' key={item.partyName}>
                                            <p className='name-tag'>{item.partyName}</p><br />
                                            <p className='profile-dtl'>{item.mobile}<br />{item.partyAddress}</p>
                                            {item.profilePic ? item.profilePic
                                            :<img id="single-img" src={single_bill} alt="img"/>}
                                            
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
                <p id='p-tag'>Outstanding Paybles</p>
                <p id="recieve-tag">&#8377;{payLedger.outStdRcvPayble?payLedger.outStdRcvPayble.toFixed(2) :0}</p>
                <div class="form-group">
                  <label hmtlFor="amtRecieved" id="amt-tag">Amount</label>
                  <input class="form-control" id="amtRecieved"  required
                    onChange={(e) => setPaidRcvd(e.target.value)}/>
                </div>
                <p className='payment-tag'>Payment Mode</p>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="radio" id="inlineRadio1" value="CASH"
                    onChange={(e) => setPaymentMode(e.target.value)} checked={paymentMode==='CASH'}required />
                  <label class="form-check-label" for="inlineRadio1">CASH</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="radio" id="inlineRadio2" value="UPI"
                    onChange={(e) => setPaymentMode(e.target.value)} checked={paymentMode==='UPI'} required />
                  <label class="form-check-label" for="inlineRadio2">UPI</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="radio" id="inlineRadio3" value="NEFT"
                    onChange={(e) => setPaymentMode(e.target.value)} checked={paymentMode==='NEFT'} required />
                  <label class="form-check-label" for="inlineRadio3">NEFT</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="radio" id="inlineRadio4" value="RTGS"
                    onChange={(e) => setPaymentMode(e.target.value)} checked={paymentMode==='RTGS'} required />
                  <label class="form-check-label" for="inlineRadio4">RTGS</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="radio" id="inlineRadio5" value="IMPS"
                    onChange={(e) => setPaymentMode(e.target.value)} checked={paymentMode==='IMPS'} required />
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
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div> }        
        <div id="transporter-summary" className={toggleState === 'paymentledger' ? "content  active-content" : "content"}>
        {ledgerSummary.length > 0 ? (
            <table class="table table-fixed" className="ledger-table">
              <thead className="thead-tag">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Ref ID</th>
                  <th scope="col">Paid(&#8377;)</th>
                  <th scope="col">To Be Paid(&#8377;)</th>
                  <th scope="col">Ledger Balance(&#8377;)</th>
                </tr>
              </thead>
              <tbody>
                {
                    ledgerSummary.map((item, index) => {
                      return (
                        <tr className="trs-tags">
                          <th scope="row">{index + 1}</th>
                          <td><span style={{'color':'#0066FF',cursor:'pointer'}}>{item.refId}</span> <br />
                          {moment(item.date).format("DD-MMM-YY")}</td>
                          <td>{item.paidRcvd ? item.paidRcvd.toFixed(2)  : 0}</td>
                          <td><span className='paid-coloring'>{item.tobePaidRcvd ? item.tobePaidRcvd.toFixed(2)  : 0}</span></td>
                          <td>{item.balance ? item.balance.toFixed(2) : 0}</td>
                        </tr>
                      )
                    })
                }
              </tbody>
            </table>
            ) : (<img src={no_data} alt="no_data" id="nodata-svg"/>)}
          </div>
          <div id="detailed-inventory" className={toggleState === 'inventoryledger' ?
           "content  active-content" : "content"}>
            {invDetails.length > 0 ? (
            <table class="table table-fixed" className="ledger-table">
              <thead className="thead-tag">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Ref ID</th>
                  <th scope="col">Collected</th>
                  <th scope="col">Given</th>
                  <th scope="col">Balance</th>
                </tr>
              </thead>
              <tbody>
                {
                  
                    invDetails.map((item, index) => {
                      return (
                        <tr className="trs-tags">
                          <th scope="row">{index + 1}</th>
                          <td><span style={{'color':'#0066FF',cursor:'pointer'}}>{item.refId}</span> <br />
                          {moment(item.date).format("DD-MMM-YY")}</td>
                          <td>{item.collected ? item.collected.toFixed(1) : 0}&nbsp;
                          {item.unit==='BAGS'?item.unit.charAt(0).toUpperCase()+item.unit.slice(2,3).toLowerCase():
                            item.unit==='BOXES'?item.unit.charAt(0).toUpperCase()+item.unit.slice(2,3).toLowerCase():
                            item.unit==='CRATES'||'SACS'?item.unit.charAt(item).toUpperCase():''}</td>
                          <td>{item.given ? item.given.toFixed(1) : 0}&nbsp;
                          {item.unit==='BAGS'?item.unit.charAt(0).toUpperCase()+item.unit.slice(2,3).toLowerCase():
                            item.unit==='BOXES'?item.unit.charAt(0).toUpperCase()+item.unit.slice(2,3).toLowerCase():
                            item.unit==='CRATES'||'SACS'?item.unit.charAt(item).toUpperCase():''}</td>
                          <td>
                            {item.unit==='CRATES'?item.cratesBalance.toFixed(1):item.unit==='SACS'?item.sacsBalance.toFixed(1):
                            item.unit==='BAGS'?item.bagsBalance.toFixed(1):item.unit==='BOXES'?item.boxesBalance.toFixed(1):0}
                            &nbsp;{
                            item.unit==='BAGS'?item.unit.charAt(0).toUpperCase()+item.unit.slice(2,3).toLowerCase():
                            item.unit==='BOXES'?item.unit.charAt(0).toUpperCase()+item.unit.slice(2,3).toLowerCase():
                            item.unit==='CRATES'||'SACS'?item.unit.charAt(item).toUpperCase():''
                            }
                          </td>
                        </tr>
                      )
                    }) 
                }
              </tbody>
            </table>
          ) : (<img src={no_data} alt="no_data" id="nodata-svg"/>)}
           </div>
          <div>
            {toggleState==='inventoryledger' &&
            <div id="myModal" class="modal fade" role="dialog" data-backdrop="static">
              <div class="modal-dialog modal-lg transporter_modal"
                style={{height:'500px',width:'748px',marginLeft:'270px',top:'50px'}}>
                <div class="modal-content">
                  <div class="modal-body">
                    <div className="add-record">
                      <div className="btn-round">
                        <img src={close_btn} className="closing-btn" data-dismiss="modal" onClick={() => setOpenInventory(false)} />
                      </div>
                      <h6 className="inventory-name">Record Inventory</h6>
                      <div className="bloc-tabs">
                        <button 
                          className={toggleInventory === 'Given' ? "tab active-tab" : "tab"}
                          onClick={() => toggleTabs('Given')}
                        >
                          Given
                        </button>
                        <button
                          className={toggleInventory === 'Collected' ? "tab active-tab" : "tab"}
                          onClick={() => toggleTabs('Collected')}
                        >
                          Collected
                        </button>
                      </div>
                      <span id="horizontal-lines"></span>
                      <div  className={toggleInventory === 'Given' || toggleInventory === 'Collected' ?
                              "content  active-content" : "content"}>
                      <form onSubmit={postRecordInventory}>
                        <div className="card">
                          <div className="card-body" id="detail-tag">
                            {
                              transporter.map((item, index) => {
                                if (item.partyId == transId) {
                                    return (
                                        <Fragment>
                                            <tr>
                                                <td className='profile-details' key={item.partyName}>
                                                    <p className='name-tag'>{item.partyName}</p><br />
                                                    <p className='profile-dtl'>{item.mobile}<br />{item.partyAddress}</p>
                                                    {item.profilePic ? item.profilePic
                                                    :<img id="single-img" src={single_bill} alt="img"/>}
                                                    
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
                        <p id='para-tag'>Inventory Balance</p>
                        {toggleState==='inventoryledger' &&
                          getInventor.map(item=>{
                              return(
                              <p id="recieves-tag">{item.unit}:{item.qty.toFixed(1)}</p>
                              )
                          })
                        }
                        {toggleInventory==='Given' ?<p className='select-tag'>Select Given Type</p>
                          :<p className='select-tag'>Select Collected Type</p>}

                        <div class="form-check form-check-inline">
                          <input class="form-check-input" type="radio" name="radio" id="inlineRadio1" value="CRATES"
                            onChange={(e) => setUnit(e.target.value)} checked={unit==='CRATES'} required />
                          <label class="form-check-label" for="inlineRadio1" id="crates">CRATES</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input class="form-check-input" type="radio" name="radio" id="inlineRadio2" value="SACS"
                            onChange={(e) => setUnit(e.target.value)} required />
                          <label class="form-check-label" for="inlineRadio2" id="sacs">SACS</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input class="form-check-input" type="radio" name="radio" id="inlineRadio3" value="BOXES"
                            onChange={(e) => setUnit(e.target.value)} required />
                          <label class="form-check-label" for="inlineRadio3" id="boxes">BOXES</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input class="form-check-input" type="radio" name="radio" id="inlineRadio4" value="BAGS"
                            onChange={(e) => setUnit(e.target.value)} required />
                          <label class="form-check-label" for="inlineRadio4" id="bags">BAGS</label>
                        </div>
                        <div class="form-group">
                          <label hmtlFor="amtRecieved" id="count-tag">Number of {unit}</label>
                          <input class="form-control" id="amtRecieved"   required
                            onChange={(e) => setQty(e.target.value)}/>
                        </div>
                        <div class="mb-3">
                          <label for="exampleFormControlTextarea1" class="form-label" id="comments-tag">Comment</label>
                          <textarea class="form-control" id="comments" rows="2" value={comments}
                            onChange={(e) => setComments(e.target.value)}></textarea>
                        </div>
                        <button className='submit-btn' type='sumit'>SUBMIT</button>
                      </form>
                    </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
            }
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
              transporter.length > 0 ? (
                transporter.filter((item) => {
                  if (searchName === '') return <p>Not Found</p>;
                  else if (item.partyName.toLowerCase().includes(searchName.toLowerCase())) {
                    console.log(item.partyName.toLowerCase());
                    console.log(searchName)
                    return (<p>item.partyName</p>);
                  }
                  else {
                    return <p>Not Found</p>
                  }
                })
                  .map((item, index) => {
                    return (
                      <Fragment>
                        <tr onClick={(id,indexs) => { particularLedger(item.partyId,index) }}
                           className={isActive===index?'tableRowActive':"tr-tags"}>
                          <td key={index}>{index + 1}</td>
                          <td key={item.date}>{moment(item.date).format("DD-MMM-YY")}</td>
                          <td key={item.partyName}><span className="namedtl-tag">
                            {item.partyName}<br /></span>
                            <span className="address-tag">{item.partyAddress}<br /></span>
                            <span className="mobile-tag"></span>{item.mobile}
                            {item.profilePic? item.profilePic
                              :<img id="profile-img" src={single_bill} alt="img"/>}
                          </td>
                          <td key={item.tobePaidRcvd}><span className='paid-coloring'>&#8377;
                            {item.tobePaidRcvd ? item.tobePaidRcvd.toFixed(2) : 0}</span></td>
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
          <p className="p-tag">Outstanding Paybles:</p>
          <p className="value-tag">&#8377;{data.totalOutStgAmt ? data.totalOutStgAmt.toFixed(2) : 0}</p>
        </div>
      </div>
    </Fragment>
  );
};
export default TransportoLedger;
