import { Fragment, useEffect, useState } from "react";
import ComingSoon from "../../components/comingSoon";
import search_img from "../../assets/images/search.svg";
import "../../modules/transporto_ledger/transportoLedger.scss"
import { 
  addRecordInventory,
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

const TransportoLedger = () => {
  const [transporter, setTransporter] = useState([{}]);
  const [data, setData] = useState({}, transporter);
  const [search, setSearch] = useState(" ");
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
  const [paymentMode, setPaymentMode] = useState('');
  const [displayLink, setDisplayLink]= useState(false);
  const [recordDisplay, setRecordDisplay]= useState("");
  const [record, setRecord]=useState(false);
  const [unit, setUnit]= useState('');
  const [qty, setQty]= useState(0);
  const [type, setType]= useState(" ");
  const [openInventory, setOpenInventory]= useState(false);
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
  const particularLedger = (id) => {
    console.log(id);
    transId=id;
    setOpenTabs(!openTabs);
    //getTransportersData(clickId, id);
    transporter.filter((item) => {
      if (item.partyId === id) {
        transId=id;
        localStorage.setItem('transId', JSON.stringify(transId));
        paymentLedger(clickId, id);
        inventoryLedger(clickId, id);
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
        setRecordDisplay("Record Updated Successfully");
        setRecord(true);
    })
    .catch(error => {
      console.log(error);
    })
    navigate("/transportoledger")
    setIsOpen(false);
    localStorage.removeItem("transId");
  }

  //Add Record Inventory
  const postRecordInventory =()=>{
    const inventoryRequest={
      caId:clickId,
      transId:JSON.parse(localStorage.getItem("transId")),
      comments: comments,
      date: convert(selectDate),
      type:toggleInventory.toUpperCase(),
      details:{
        qty:parseInt(qty),
        unit:unit
      }
    }
    addRecordInventory(inventoryRequest)
    .then(response=>{
      console.log(response.data.data);
      window.location.reload();
      setRecordDisplay("Record Updated Successfully");
      setRecord(true);
    }).catch(error=>{setError(error); console.log(error.message)});
    navigate("/transportoledger");
    setIsOpen(false);
  }
  return (
    /*<div className="main_div_padding">
      <div className="container-fluid px-0">
       <ComingSoon/>
      </div>
    </div>*/
    <Fragment>
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
        <div className="bloc-tabs">
          <a href={"#paymentledger"}
            className={toggleState === 'paymentledger' ? "tabers active-tabs" : "tabers"}
            onClick={() => toggleTab('paymentledger')}
          >
            Payment Ledger
          </a>
          <a href={"#inventoryledger"}
            className={toggleState === 'inventoryledger' ? "tabers active-tabs" : "tabers"}
            onClick={() => toggleTab('inventoryledger')}
          >
            Inventory Ledger
          </a>
        </div>
        <div className="recordbtn-style">
         <img src={add} className='addrecord-img'/>
          <button className="add-record-btn" onClick={() =>
            {toggleState === 'paymentledger'? setIsOpen(!open)
            : setOpenInventory(!openInventory)}}>Add Record</button>
        </div>
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
              <h6 className="record-name">Record Payment</h6>
              <form onSubmit={addRecordPayment}>
                <div className="card">
                  <div className="card-body" id="details-tag">
                    {
                      transporter.map((item, index) => {
                        transId=JSON.parse(localStorage.getItem('transId'))
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
                <p id="recieve-tag">&#8377;{payLedger.outStdRcvPayble?payLedger.outStdRcvPayble:0}</p>
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
        <div id="transporter-summary" className={toggleState === 'paymentledger' ? "content  active-content" : "content"}>
            <table class="table table-fixed" className="ledger-table">
              <thead className="thead-tag">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">RefId | Date</th>
                  <th scope="col">Paid(&#8377;)</th>
                  <th scope="col">To Be Paid(&#8377;)</th>
                  <th scope="col">Ledger Balance(&#8377;)</th>
                </tr>
              </thead>
              <tbody>
                {
                  ledgerSummary.length > 0 ? (
                    ledgerSummary.map((item, index) => {
                      return (
                        <tr className="tr-tags">
                          <th scope="row">{index + 1}</th>
                          <td><span style={{'color':'#0066FF'}}>{item.refId}</span> <br />{item.date}</td>
                          <td>{item.paidRcvd ? item.paidRcvd : 0}</td>
                          <td><span className='paid-coloring'>&#8377;{item.tobePaidRcvd ? item.tobePaidRcvd : 0}</span></td>
                          <td>{item.balance ? item.balance : 0}</td>
                        </tr>
                      )
                    })
                  ) : (<p style={{ fontSize: "20px" }}>No Data Available!</p>)
                }
              </tbody>
            </table>
          </div>
          <div id="detailed-inventory" className={toggleState === 'inventoryledger' ?
           "content  active-content" : "content"}>
            <table class="table table-fixed" className="ledger-table">
              <thead className="thead-tag">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">RefId | Date</th>
                  <th scope="col">Collected</th>
                  <th scope="col">Given</th>
                  <th scope="col">Balance</th>
                </tr>
              </thead>
              <tbody>
                {
                  invDetails.length > 0 ? (
                    invDetails.map((item, index) => {
                      return (
                        <tr className="tr-tags">
                          <th scope="row">{index + 1}</th>
                          <td><span style={{'color':'#0066FF'}}>{item.refId}</span> <br />{item.date}</td>
                          <td>{item.collected ? item.collected : 0}&nbsp;{item.unit.charAt(0).toUpperCase()}</td>
                          <td>{item.given ? item.given : 0}&nbsp;{item.unit.charAt(0).toUpperCase()}</td>
                          <td>{item.balance ? item.balance : 0}&nbsp;{item.unit.charAt(0).toUpperCase()}</td>
                        </tr>
                      )
                    })
                  ) : (<p style={{ fontSize: "20px" }}>No Data Available!</p>)
                }
              </tbody>
            </table>
          </div>
          <div>
          <ReactModal isOpen={openInventory} className='modal-tag' 
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
                <img src={close_btn} className="closing-btn" onClick={() => setOpenInventory(false)} />
              </div>
              <h6 className="inventory-name">Record Inventory</h6>
              <div className="bloc-tabs">
                <a 
                  className={toggleInventory === 'Given' ? "tab active-tab" : "tab"}
                  onClick={() => toggleTabs('Given')}
                >
                   Given
                </a>
                <a
                  className={toggleInventory === 'Collected' ? "tab active-tab" : "tab"}
                  onClick={() => toggleTabs('Collected')}
                >
                  Collected
                </a>
              </div>
              <hr className="hr-tag"/>
              <div  className={toggleInventory === 'Given' || toggleInventory === 'Collected' ?
                      "content  active-content" : "content"}>
              <form onSubmit={postRecordInventory}>
                <div className="card">
                  <div className="card-body" id="detail-tag">
                    {
                      transporter.map((item, index) => {
                        transId=JSON.parse(localStorage.getItem('transId'))
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
                <p id="recieves-tag">&#8377;{invDetails.balance?invDetails.balance:0}</p>
                {toggleInventory==='Given' ?<p className='select-tag'>Select Given Type</p>
                  :<p className='select-tag'>Select Collected Type</p>}
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="radio" id="inlineRadio1" value="CRATES"
                    onChange={(e) => setUnit(e.target.value)} required />
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
                  <input class="form-control" id="amtRecieved" value={qty} placeholder="&#8377;" required
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
          </ReactModal>
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
                        <tr onClick={(id) => { particularLedger(item.partyId) }} className="tr-tags">
                          <td scope="row">{index + 1}</td>
                          <td key={item.date}>{item.date}</td>
                          <td key={item.partyName}><span className="namedtl-tag">
                            {item.partyName}<br /></span>
                            {item.partyAddress}<br />
                            {item.mobile}
                            {item.profilePic? item.profilePic
                              :<img id="profile-img" src={single_bill} alt="img"/>}
                          </td>
                          <td key={item.tobePaidRcvd}><span className='paid-coloring'>&#8377;
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
          <p className="p-tag">Outstanding Paybles:</p>
          <p className="value-tag">&#8377;{data.totalOutStgAmt ? data.totalOutStgAmt : 0}</p>
        </div>
      </div>
    </Fragment>
  );
};
export default TransportoLedger;
