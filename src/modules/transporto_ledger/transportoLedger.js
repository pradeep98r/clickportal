import { Fragment, useEffect, useState } from "react";
import ComingSoon from "../../components/comingSoon";
import search_img from "../../assets/images/search.svg";
import "../../modules/transporto_ledger/transportoLedger.scss"
import close from "../../assets/images/close.svg";
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
  const [isValid, setIsValid]=useState(false);
  const [valid, setValid]= useState(false);

  const addRecordPayment = (transId) => {
    const addRecordData = {
        caId: clickId,
        partyId:JSON.parse(localStorage.getItem("transId")),
        date: convert(selectDate),
        comments: comments,
        paidRcvd: paidRcvd,
        paymentMode: paymentMode,
    }
    postRecordPayment(addRecordData).then(response => {
        console.log(response.data.data);
        window.location.reload();
        //setRecordDisplay("Record Updated Successfully");
        //setRecord(true);
      })
      .catch(error => {
        console.log(error);
      })
      navigate("/transportoledger");
      localStorage.removeItem("partyId");
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
    if(qty===0){
      setIsValid(true);
      console.log(qty);
    }
    else if(qty<0){
      setValid(true)
      console.log(qty);
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
  const closePopup = () => {
    $("#myModal").modal("hide");
  };
  //transId=JSON.parse(localStorage.getItem('transId'));
  return (
    <Fragment>
      <div className="row">
        <div className="col-lg-4">
          <div id="search-field">
            <form class="d-flex">
              <input class="form-control me-2" id="searchbar" type="search" placeholder='Search by Name / Short Code'
                onChange={(e) => { setSearchName(e.target.value) }} />
            </form>
            <div className='searchicon'><img src={search_img} alt="search" /></div>
          </div>
          <div className='table-scroll' id="scroll_style">
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
                              <td key={item.partyName}>
                              <div className="d-flex" id="trans-details">
                                <div>
                                  {item.profilePic ? (
                                    <img className="profile-img" src={item.profilePic} alt="pref-img" />
                                  ) : (
                                    <img
                                      className="profile-img"
                                      src={single_bill}
                                      alt="img"
                                    />
                                  )}
                                  </div>
                                  <div>
                                    <p className="namedtl-tag">
                                      {item.partyName}
                                    </p>
                                    <p className="address-tag">
                                      {item.partyAddress ? item.partyAddress : ""}
                                    </p>
                                    <p className="mobile-tag">{item.mobile}</p>
                                  </div>
                              </div>
                              </td>
                              <td key={item.tobePaidRcvd}><p className='paid-coloring'>&#8377;
                                {item.tobePaidRcvd ? item.tobePaidRcvd.toFixed(2) : 0}</p></td>
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
          </div>
          <div className="outstanding-pay">
            <div className="d-flex">
              <p className="p-tag">Outstanding Paybles:</p>
              <p className="value-tag">&#8377;{data.totalOutStgAmt ? data.totalOutStgAmt.toFixed(2) : 0}</p>
            </div>
          </div>
        </div>
        <div class="col-lg-8"> 
        <div className="container-fluid px-0" id="tabsEvents" style={{ display: openTabs ? 'block' : 'none' }}>
          {isActive!==-1 &&
          <div class="card" className='transport-details'>
            <div class="card-body">
              <div className="row">
                <div className="col-lg-3" id="verticalLines">
                  {
                  transporter.map((item, index) => {
                    transId=JSON.parse(localStorage.getItem('transId'));
                    if (item.partyId == transId) {
                        return (
                            <Fragment>
                                <div
                                  className="profile-details"
                                  key={item.partyName}
                                  >
                                  <div class="d-flex">
                                  <div>
                                    {item.profilePic ? (
                                    <img className="singles-img" src={item.profilePic} alt="buy-img" />
                                      ) : (
                                      <img
                                        id="singles-img"
                                        src={single_bill}
                                        alt="img"
                                      />
                                    )}
                                  </div>
                                    <div id="trans-dtl">
                                      <p className="namedtl-tag">
                                        {item.partyName}
                                      </p>
                                      <p className="mobilee-tag">{!item.trader?"Trans":"Trader"}-{item.partyId}&nbsp;|&nbsp;{item.mobile}</p>
                                      <p className="addres-tag">
                                        {item.partyAddress ? item.partyAddress : ""}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                            </Fragment>
                            )
                        }
                        else {
                          <p>No Data Found</p>
                      }
                  })
                  }
                </div>
                <div className="col-lg-3" id="verticalLines">
                  <p class="card-text" className='paid'>Total Business <p className='coloring'>
                  &#8377;{payLedger.totalTobePaidRcvd ? payLedger.totalTobePaidRcvd.toFixed(2): 0}</p></p>
                </div>
                <div className="col-lg-3" id="verticalLines">
                  <p className='total-paid'>Total Paid<p className='coloring'>
                  &#8377;{payLedger.totalRcvdPaid ? payLedger.totalRcvdPaid.toFixed(2) : 0}</p> </p>  
                </div>
                <div className="col-lg-3" >
                  <p className='out-standing'>Outstanding Paybles<p className='coloring'>
                  &#8377;{payLedger.outStdRcvPayble ? payLedger.outStdRcvPayble.toFixed(2): 0}</p></p>
                </div>
                <div className="bloc-tabs">
                  <button
                    className={toggleState === 'paymentledger' ? "tabs active-tabs" : "tabs"}
                    onClick={() => toggleTab('paymentledger')}
                  >
                    Payment Ledger
                  </button>
                  <button
                    className={toggleState === 'inventoryledger' ? "tabs active-tabs" : "tabs"}
                    onClick={() => toggleTab('inventoryledger')}
                  >
                    Inventory Ledger
                  </button>
                </div>
              </div>
              <div className="d-flex recordbtn-style">
                <button className="add-record-btn" onClick={() =>
                  {toggleState === 'paymentledger'? setIsOpen(!open)
                  : setOpenInventory(!openInventory)}}  data-toggle="modal" data-target="#myModal">
                  <div className="add-pay-btn"><img src={add} className='addrecord-img'/></div> Add Record</button>
              </div>
            </div>
            <span id="horizontal-line-tag"></span>
          </div>
          }
          {toggleState==='paymentledger' &&
            <div className="modal fade" id="myModal">
              <div className="modal-dialog transporter_modal modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title header2_text" id="staticBackdropLabel">
                      Add Record Payment
                    </h5>
                    <img
                      src={close}
                      alt="image"
                      className="close_icon"
                      onClick={closePopup}
                    />
                  </div>
                  <div className="modal-body transporter_model_body" id="scroll_style">
                    <form>
                      <div className="card">
                        <div className="card-body" id="details-tag">
                          {
                            transporter.map((item, index) => {
                              if (item.partyId == transId) {
                                  return (
                                      <Fragment>
                                          <div
                                            className="profile-details"
                                            key={item.partyName}
                                            >
                                            <div class="d-flex">
                                            <div>
                                              {item.profilePic ? (
                                              <img className="singles-img" src={item.profilePic} alt="buy-img" />
                                                ) : (
                                                <img
                                                  id="singles-img"
                                                  src={single_bill}
                                                  alt="img"
                                                />
                                              )}
                                            </div>
                                              <div>
                                                <p className="namedtl-tag">
                                                  {item.partyName}
                                                </p>
                                                <p className="mobilee-tag">{!item.trader?"Trans":"Trader"}|{item.partyId}&nbsp;|&nbsp;{item.mobile}</p>
                                                <p className="addres-tag">
                                                  {item.partyAddress ? item.partyAddress : ""}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                      </Fragment>
                                  )
                              }
                            })
                          }
                          <span class="card-text" id="date-tag">
                            <ReactDatePicker className='date_picker_in_modal'
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
                            <img className="date_icon_in_modal" src={date_icon} />
                          </span>
                        </div>
                      </div>
                      <div id="out-paybles">
                      <p id='p-tag'>Outstanding Paybles</p>
                      <p id="recieve-tag">&#8377;{payLedger.outStdRcvPayble?payLedger.outStdRcvPayble.toFixed(2) :0}</p>
                      </div>
                      <div class="form-group" id="input_in_modal">
                        <label hmtlFor="amtRecieved" id="amt-tag">Amount</label>
                        <input class="form-control" id="amtRecieved"  required
                          onChange={(e) =>{setPaidRcvd(e.target.value)}} />
                      </div>
                      <div id="radios_in_modal">
                      <p className='payment-tag'>Payment Mode</p>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="radio" id="inlineRadio1" value="CASH"
                          onChange={(e) => setPaymentMode(e.target.value)} checked={paymentMode==='CASH'}required />
                        <label class="form-check-label" for="inlineRadio1">CASH</label>
                      </div>
                      <div class="form-check form-check-inline" id="radio-btn-in_modal">
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
                      </div>
                      <div id="comment_in_modal">
                      <div class="mb-3">
                        <label for="exampleFormControlTextarea1" class="form-label" id="comment-tag">Comment</label>
                        <textarea class="form-control" id="comments" rows="2" value={comments}
                          onChange={(e) => setComments(e.target.value)}></textarea>
                      </div>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer" id="modal_footer">
                    <button
                      type="button"
                      id="submit_btn_in_modal"
                      className="primary_btn cont_btn w-100"
                      onClick={addRecordPayment}
                      // id="close_modal"
                      data-bs-dismiss="modal"
                    >
                      SUBMIT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }
          {toggleState==='paymentledger' &&
          <div className='transporterSummary' id="scroll_style">      
            <div id="transporter-summary" className={toggleState === 'paymentledger' ? "content  active-content" : "content"}>
            {ledgerSummary.length > 0 ? (
                <table class="table table-fixed ledger-table">
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
            </div>
            }
            {toggleState==='inventoryledger' &&
            <div className="transporterDetailed" id="scroll_style">
              <div id="detailed-inventory" className={toggleState === 'inventoryledger' ?
              "content  active-content" : "content"}>
                {invDetails.length > 0 ? (
                <table class="table table-fixed ledger-table">
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
              </div>
              }
            <div>
            {toggleState==='inventoryledger' &&
              <div className="modal fade" id="myModal">
                <div className="modal-dialog transporter_inventory_modal modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title header2_text" id="staticBackdropLabel">
                        Add Record Inventory
                      </h5>
                      <div className="bloc-tab">
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
                      <img
                        src={close}
                        alt="image"
                        className="close_icon"
                        onClick={closePopup}
                      /> 
                    </div>
                    <div className="modal-body transporter_inventory_model_body" id="scroll_style">
                      <div  className={toggleInventory === 'Given' || toggleInventory === 'Collected' ?
                                  "content  active-content" : "content"}>
                          <form>
                            <div className="card">
                              <div className="card-body" id="details-tag">
                                {
                                  transporter.map((item, index) => {
                                    if (item.partyId == transId) {
                                        return (
                                            <Fragment>
                                                <div
                                                  className="profile-details"
                                                  key={item.partyName}
                                                  >
                                                  <div class="d-flex">
                                                  <div>
                                                    {item.profilePic ? (
                                                    <img className="singles-img" src={item.profilePic} alt="buy-img" />
                                                      ) : (
                                                      <img
                                                        id="singles-img"
                                                        src={single_bill}
                                                        alt="img"
                                                      />
                                                    )}
                                                  </div>
                                                    <div>
                                                      <p className="namedtl-tag">
                                                        {item.partyName}
                                                      </p>
                                                      <p className="mobilee-tag">{!item.trader?"Trans":"Trader"}|{item.partyId}&nbsp;|&nbsp;{item.mobile}</p>
                                                      <p className="addres-tag">
                                                        {item.partyAddress ? item.partyAddress : ""}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                            </Fragment>
                                        )
                                    }
                                  })
                                }
                                <span class="card-text" id="date-tag">
                                  <ReactDatePicker className='date_picker_in_modal'
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
                                  <img className="date_icon_in_modal" src={date_icon} />
                                </span>
                              </div>
                            </div>
                            <div id="out-paybles">
                              <p id='p-tag'>Inventory Balance</p>
                              {toggleState==='inventoryledger' &&
                                getInventor.map(item=>{
                                    return(
                                    <p id="recieved-tag">{item.unit}:{item.qty.toFixed(1)}</p>
                                    )
                                })
                              }
                            </div>
                            <div id="radios_in_modal">
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
                            {isValid?
                              <p>Your Value Is Zero</p>:''
                            }
                            <div class="mb-3">
                              <label for="exampleFormControlTextarea1" class="form-label" id="comments-tag">Comment</label>
                              <textarea class="form-control" id="comments" rows="2" value={comments}
                                onChange={(e) => setComments(e.target.value)}></textarea>
                            </div>
                            </div>
                          </form>
                        </div>
                      </div>
                      <div class="modal-footer" id="modal_footer">
                        <button type="button"
                          id="submit_btn_in_modal"
                          className="primary_btn cont_btn w-100"
                          onClick={postRecordInventory}
                          // id="close_modal"
                          /*</div>data-dismiss="modal"*/>SUBMIT</button>
                      </div>
                    </div>
                  </div>
                </div>
                }
            </div> 
        </div>
        </div>
      </div> 
    </Fragment>
  );
};
export default TransportoLedger;
