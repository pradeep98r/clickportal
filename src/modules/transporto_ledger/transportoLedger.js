import { Fragment, useEffect, useState } from "react";
import ComingSoon from "../../components/comingSoon";
import search_img from "../../assets/images/search.svg";
import "../../modules/transporto_ledger/transportoLedger.scss";
import close from "../../assets/images/close.svg";
import {
  addRecordInventory,
  getInventory,
  getInventoryLedgers,
  getParticularTransporter,
  getTransporters,
  postRecordPayment,
} from "../../actions/transporterService";
import no_data from "../../assets/images/no_data.svg";
import add from "../../assets/images/add.svg";
import ReactModal from "react-modal";
import close_btn from "../../assets/images/close_btn.svg";
import { useNavigate } from "react-router-dom";
import date_icon from "../../assets/images/date_icon.svg";
import single_bill from "../../assets/images/bills/single_bill.svg";
import moment from "moment/moment";
import $ from "jquery";
import context from "react-bootstrap/esm/AccordionContext";
import NoDataAvailable from "../../components/noDataAvailable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getOutstandingBal } from "../../actions/billCreationService";
import SearchField from "../../components/searchField";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithOneDigit,
  getCurrencyNumberWithSymbol
} from "../../components/getCurrencyNumber";
const TransportoLedger = () => {

  const [transporter, setTransporter] = useState([{}]);
  const [data, setData] = useState({}, transporter);
  const [search, setSearch] = useState("");
  const [error, setError] = useState();
  const [openTabs, setOpenTabs] = useState(false);

  const [ledgerSummary, setLedgerSummary] = useState([{}]);
  const [payLedger, setPayLedger] = useState({}, ledgerSummary);

  const [invLedger, setInvLedger] = useState([{}]);
  const [invDetails, setInvDetails] = useState({}, invLedger);

  const [open, setIsOpen] = useState(false);

  const [selectDate, setSelectDate] = useState(new Date());
  const [paidRcvd, setPaidRcvd] = useState(0);
  const [paidsRcvd, setPaidsRcvd] = useState(0);
  const [comments, setComments] = useState(" ");
  const [paymentMode, setPaymentMode] = useState("CASH");
  //const [recordDisplay, setRecordDisplay]= useState("");
  //const [record, setRecord]=useState(false);
  const [unit, setUnit] = useState("CRATES");
  const [qty, setQty] = useState(0);
  const [openInventory, setOpenInventory] = useState(false);
  const [isActive, setIsActive] = useState(-1);
  const [getInventor, setGetInventory] = useState([]);
  const navigate = useNavigate();

  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  let transId = 0;

  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);
  //console.log(langFullData);

  const [toggleState, setToggleState] = useState("paymentledger");
  const toggleTab = (type) => {
    setToggleState(type);
  };

  const [toggleInventory, setToggleInventory] = useState("Given");
  const toggleTabs = (type) => {
    setToggleInventory(type);
  };
  useEffect(() => {
    getTransportersData();
  }, []);
  const getTransportersData = () =>{
    getTransporters(clickId).then((response)=>{
      console.log(response,"response");
      setData(response.data.data);
      setTransporter(response.data.data.ledgers);
    })
  }

  //get Payment Ledger
  const paymentLedger = (clickId, partyId) => {
    getParticularTransporter(clickId, partyId)
      .then((response) => {
        console.log(response, "payledger");
        setPayLedger(response.data.data);
        setLedgerSummary(response.data.data.details);
        
      })
      .catch((error) => {
        setError(error);
      });
  };

  const getOutstandingPaybles = (clickId, partyId)=>{
    getOutstandingBal(clickId,partyId)
    .then((response)=>{
      console.log(response);
      setPaidRcvd(response.data.data);
    })
  }
  // get Inventory Ledger
  const inventoryLedger = (clickId, transId) => {
    getInventoryLedgers(clickId, transId)
      .then((response) => {
        setInvLedger(response.data.data);
        setInvDetails(response.data.data.details);
        console.log(invLedger, "Inv Ledger");
      })
      .catch((error) => {
        setError(error);
      });
  };

  //Get transporter By partyId
  const particularLedger = (id, indexs) => {
    transId = id;
    setOpenTabs(true);
    setIsActive(indexs);
    //getTransportersData(clickId, id);
    transporter.filter((item) => {
      if (item.partyId === id) {
        transId = id;
        localStorage.setItem("transId", JSON.stringify(transId));
        paymentLedger(clickId, id);
        inventoryLedger(clickId, id);
        getOutstandingPaybles(clickId,id);
        getInventoryRecord();
      } else {
        return <p>Not Found</p>;
      }
    });
  };
  // Convert standard date time to normal date
  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  //Add Record payment
  const [requiredCondition, setRequiredCondition] = useState("");

  const onSubmitRecordPayment = (transId) => {
    if (paidsRcvd < 0) {
      setRequiredCondition("Amount Recieved Cannot be negative");
    }else if (parseInt(paidsRcvd) > paidRcvd) {
      setRequiredCondition("Enterd Amount cannot more than outstanding balance"
        //langFullData.enteredAmountCannotMoreThanOutstandingBalance
      );
    }
     else if (parseInt(paidsRcvd) === 0) {
      setRequiredCondition(langFullData.amountReceivedCannotBeEmpty);
    } else if (isNaN(paidsRcvd)) {
      setRequiredCondition("Invalid Amount");
    } else if (
      paidsRcvd.trim().length !== 0 &&
      paidsRcvd != 0 &&
      paidsRcvd < paidRcvd &&
      !(paidsRcvd < 0)
    ) {
      addRecordPayment();
    }
  };
  const addRecordPayment = () => {
    const addRecordData = {
      caId: clickId,
      partyId: JSON.parse(localStorage.getItem("transId")),
      date: convert(selectDate),
      comments: comments,
      paidRcvd: paidRcvd,
      paymentMode: paymentMode,
    };
    postRecordPayment(addRecordData)
      .then((response) => {
        console.log(response.data.data);
        setOpenTabs(true);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
    navigate("/transportoledger");
    localStorage.removeItem("partyId");
    setIsOpen(false);
  };

  const onSubmitRecordInventory = () => {
    if (qty < 0) {
      setRequiredCondition("Quantity Recieved Cannot be negative");
    } else if (parseInt(qty) === 0) {
      setRequiredCondition("Quantity Received cannot be empty");
    } else if (isNaN(qty)) {
      setRequiredCondition("Invalid Quantity");
    } else if (qty.trim().length !== 0 && !(qty < 0)) {
      postRecordInventory();
    }
  };
  //Add Record Inventory
  const postRecordInventory = () => {
    const inventoryRequest = {
      caId: clickId,
      transId: JSON.parse(localStorage.getItem("transId")),
      comments: comments,
      date: convert(selectDate),
      type: toggleInventory.toUpperCase(),
      details: [
        {
          qty: parseInt(qty),
          unit: unit,
        },
      ],
    };
    addRecordInventory(inventoryRequest)
      .then((response) => {
        console.log(response.data.data);
        window.location.reload();

      })
      .catch((error) => {
        setError(error);
        console.log(error.message);
      });
      setOpenTabs(true);
    navigate("/transportoledger");
    setOpenInventory(false);
    localStorage.removeItem("transId");
  };

  //get Inventory
  const getInventoryRecord = () => {
    getInventory(clickId, transId)
      .then((response) => {
        console.log(response.data.data);
        setGetInventory(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const closePopup = () => {
    setPaidsRcvd(0);
    setRequiredCondition("");
    $("#myModal").modal("hide");
  };
  //transId=JSON.parse(localStorage.getItem('transId'));
  const [ledgersData, setLedgersData] = useState([]);
  const [valueActive, setIsValueActive] = useState(false);
  const searchInput = (searchValue) => {
    setSearch(searchValue);
    if (search !== "") {
      const filterdNames = transporter.filter((item) => {
        if (
          item.partyName.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.shortName.toLowerCase().includes(searchValue.toLowerCase())
        ) {
          return (
            item.partyName.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.shortName.toLowerCase().includes(searchValue.toLowerCase())
          );
        } else if (search == "" || searchValue === "") {
          return setIsValueActive(false);
        } else {
          return setIsValueActive(true);
        }
      });
      setLedgersData(filterdNames);
      console.log(filterdNames, "filteredNames");
    } else {
      setLedgersData(transporter);
    }
  };
  return (
    <Fragment>
      <div className="main_div_padding">
       {
         transporter.length > 0 ?  <div className="row">
         <div className="col-lg-4  p-0">
           <div id="search-field">
           <SearchField placeholder={langFullData.searchByNameShortCode} onChange={(e) => {
                      searchInput(e.target.value);
                    }} />
            
           </div>
           <div className="table-scroll" id="scroll_style">
             <table className="table table-fixed ledger-table">
               <thead className="theadr-tag">
                 <tr>
                   <th scope="col">#</th>
                   <th scope="col">{langFullData.date}</th>
                   <th scope="col">{langFullData.transporterName}</th>
                   <th scope="col">{langFullData.toBePaid}(&#8377;)</th>
                 </tr>
               </thead>
               <tbody>
                 {search.length > 1
                   ? ledgersData.map((item, index) => {
                       return (
                         <Fragment>
                           <tr
                             onClick={(id, indexs) => {
                               particularLedger(item.partyId, index);
                             }}
                             className={
                               isActive === index
                                 ? "tableRowActive"
                                 : "tr-tags"
                             }
                           >
                             <td key={index}>{index + 1}</td>
                             <td key={item.date}>
                               {moment(item.date).format("DD-MMM-YY")}
                             </td>
                             <td key={item.partyName}>
                               <div className="d-flex" id="trans-details">
                                 <div>
                                   {item.profilePic ? (
                                     <img
                                       className="profile-img"
                                       src={item.profilePic}
                                       alt="pref-img"
                                     />
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
                                   <p className="mobilee-tag">
                                     {!item.trader ? "Transporter" : "Trader"}{" "}
                                     - {item.partyId}&nbsp;
                                   </p>
                                   <p className="mobilee-tag">{item.mobile}</p>
                                   <p className="address-tag">
                                     {item.partyAddress
                                       ? item.partyAddress
                                       : ""}
                                   </p>
                                 </div>
                               </div>
                             </td>
                             <td key={item.tobePaidRcvd}>
                               <p className="paid-coloring">
                                 {item.tobePaidRcvd
                                   ? getCurrencyNumberWithOutSymbol(item.tobePaidRcvd)
                                   : 0}
                               </p>
                             </td>
                           </tr>
                         </Fragment>
                       );
                     })
                   : transporter.map((item, index) => {
                       return (
                         <Fragment>
                           <tr
                             onClick={(id, indexs) => {
                               particularLedger(item.partyId, index);
                             }}
                             className={
                               isActive === index
                                 ? "tableRowActive"
                                 : "tr-tags"
                             }
                           >
                             <td key={index}>{index + 1}</td>
                             <td key={item.date}>
                               {moment(item.date).format("DD-MMM-YY")}
                             </td>
                             <td key={item.partyName}>
                               <div className="d-flex" id="trans-details">
                                 <div id="c-img">
                                   {item.profilePic ? (
                                     <img
                                       className="profile-img"
                                       src={item.profilePic}
                                       alt="pref-img"
                                     />
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
                                   <p className="mobilee-tag">
                                     {!item.trader ? "Transporter" : "Trader"}{" "}
                                     - {item.partyId}&nbsp;
                                   </p>
                                   <p className="mobilee-tag">{item.mobile}</p>
                                   <p className="address-tag">
                                     {item.partyAddress
                                       ? item.partyAddress
                                       : ""}
                                   </p>
                                 </div>
                               </div>
                             </td>
                             <td key={item.tobePaidRcvd}>
                               <p className="paid-coloring">
                                 {item.tobePaidRcvd
                                   ? getCurrencyNumberWithOutSymbol(item.tobePaidRcvd)
                                   : 0}
                               </p>
                             </td>
                           </tr>
                         </Fragment>
                       );
                     })}
               </tbody>
             </table>
             <div
               id="search-no-data"
               style={{
                 display: valueActive && search.length > 0 ? "block" : "none",
               }}
             >
               <NoDataAvailable />
             </div>
             {/* ) : (<img src={no_data} alt="no_data" id="nodata-svg"/>)} */}
           </div>
           <div className="outstanding-pay d-flex align-items-center justify-content-between">
             <p className="pat-tag">{langFullData.outstandingPayables}:</p>
             <p className="values-tag paid-coloring">
               
               {data.totalOutStgAmt ? getCurrencyNumberWithSymbol(data.totalOutStgAmt) : 0}
             </p>
           </div>
         </div>
         <div className="col-lg-8">
           <div
             className="container-fluid px-0"
             id="tabsEvents"
             style={{ display: openTabs ? "block" : "none" }}
           >
             {isActive !== -1 && (
               <div className="card details-tag">
                 <div className="card-body" id="card-details">
                   <div className="row">
                     <div className="col-lg-3" id="verticalLines">
                       {transporter.map((item, index) => {
                         transId = JSON.parse(localStorage.getItem("transId"));
                         if (item.partyId == transId) {
                           return (
                             <Fragment>
                               <div
                                 className="profile-details"
                                 key={item.partyName}
                               >
                                 <div className="d-flex">
                                   <div>
                                     {item.profilePic ? (
                                       <img
                                         id="singles-img"
                                         src={item.profilePic}
                                         alt="buy-img"
                                       />
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
                                     <p className="mobilee-tag">
                                       {!item.trader
                                         ? langFullData.transporter
                                         : langFullData.trader}{" "}
                                       - {item.partyId}&nbsp;
                                     </p>
                                     <p className="mobilee-tag">
                                       {item.mobile}
                                     </p>
                                     <p className="address-tag">
                                       {item.partyAddress
                                         ? item.partyAddress
                                         : ""}
                                     </p>
                                   </div>
                                 </div>
                               </div>
                             </Fragment>
                           );
                         } else {
                           <p>No Data Found</p>;
                         }
                       })}
                     </div>
                     <div className="col-lg-3" id="verticalLines">
                       <p className="card-text paid">
                         {langFullData.totalBusiness}{" "}
                         <p className="coloring color_black">
                           
                           {payLedger.totalToBePaid
                             ? getCurrencyNumberWithSymbol(payLedger.totalToBePaid)
                             : 0}
                         </p>
                       </p>
                     </div>
                     <div className="col-lg-3" id="verticalLines">
                       <p className="total-paid">
                         {langFullData.totalPaid}
                         <p className="coloring color_black">
                          
                           {payLedger.totalPaid
                             ? getCurrencyNumberWithSymbol(payLedger.totalPaid)
                             : 0}
                         </p>{" "}
                       </p>
                     </div>
                     <div className="col-lg-3">
                       <p className="out-standing">
                       {langFullData.outstandingPayables}
                         <p className="coloring color_black">
                           
                           {payLedger.totalOutStandingBalance
                             ? getCurrencyNumberWithSymbol(payLedger.totalOutStandingBalance)
                             : 0}
                         </p>
                       </p>
                     </div>
                   </div>
                 </div>
                 <span id="horizontal-line-card"></span>
                 <div className="d-flex justify-content-between">
                   <div className="bloc-tabs">
                     <button
                       className={
                         toggleState === "paymentledger"
                           ? "tabs active-tabs"
                           : "tabs"
                       }
                       onClick={() => toggleTab("paymentledger")}
                     >
                       {langFullData.paymentLedger}
                     </button>
                     <button
                       className={
                         toggleState === "inventoryledger"
                           ? "tabs active-tabs"
                           : "tabs"
                       }
                       onClick={() => toggleTab("inventoryledger")}
                     >
                       {langFullData.inventoryLedger}
                     </button>
                   </div>
                   <div className="d-flex recordbtns-style">
                     <button
                       className="add-record-btn"
                       onClick={() => {
                         toggleState === "paymentledger"
                           ? setIsOpen(!open)
                           : setOpenInventory(!openInventory);
                       }}
                       data-toggle="modal"
                       data-target="#myModal"
                     >
                       <div className="add-pay-btn">
                         <img src={add} className="addrecord-img" />
                       </div>{" "}
                       Add Record
                     </button>
                   </div>
                 </div>
               </div>
             )}
             {toggleState === "paymentledger" && (
               <div className="modal fade" id="myModal">
                 <div className="modal-dialog transporter_modal modal-dialog-centered">
                   <div className="modal-content">
                     <div className="modal-header">
                       <h5
                         className="modal-title header2_text"
                         id="staticBackdropLabel"
                       >
                        {langFullData.addRecordPayment}
                       </h5>
                       <img
                         src={close}
                         alt="image"
                         className="close_icon"
                         onClick={closePopup}
                       />
                     </div>
                     <div
                       className="modal-body transporter_model_body"
                       id="scroll_style"
                     >
                       <form>
                         <div className="d-flex card">
                           <div className="d-flex justify-content-between card-body" id="details-tag">
                             {transporter.map((item, index) => {
                               if (item.partyId == transId) {
                                 return (
                                   <Fragment>
                                     <div
                                       className="profile-details"
                                       key={item.partyName}
                                     >
                                       <div className="d-flex">
                                         <div>
                                           {item.profilePic ? (
                                             <img
                                               id="singles-img"
                                               src={item.profilePic}
                                               alt="buy-img"
                                             />
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
                                           <p className="mobilee-tag">
                                             {!item.trader
                                               ? langFullData.transporter
                                               : langFullData.trader}{" "}
                                             - {item.partyId}&nbsp;|&nbsp;
                                             {item.mobile}
                                           </p>
                                           <p className="addres-tag">
                                             {item.partyAddress
                                               ? item.partyAddress
                                               : ""}
                                           </p>
                                         </div>
                                       </div>
                                     </div>
                                   </Fragment>
                                 );
                               }
                             })}
                             <div className="d-flex card-text" id="date-tag">
                                <img
                                 className="date_icon_in_modal"
                                 src={date_icon}
                                />
                               <DatePicker
                                 //className="date_picker_in_modal"
                                 selected={selectDate}
                                 onChange={(date) => {
                                   setSelectDate(date);
                                 }}
                                 dateFormat="dd-MMM-yy"
                                 maxDate={new Date()}
                                 placeholder="Date"
                                 required
                               ></DatePicker>
                             </div>
                           </div>
                         </div>
                         <div id="out-paybles">
                           <p id="p-tag">{langFullData.outstandingPayables}</p>
                           <p id="recieve-tag">
                             &#8377;
                             {paidRcvd
                               ? paidRcvd
                               : 0}
                           </p>
                         </div>
                         <div className="form-group" id="input_in_modal">
                           <label hmtlFor="amtRecieved" id="amt-tag">
                             {langFullData.amount}
                           </label>
                           <input
                             className="form-cont"
                             id="amtRecieved"
                             required
                             onChange={(e) => {
                               setPaidsRcvd(e.target.value);
                             }}
                           />
                           <p className="text-valid">{requiredCondition}</p>
                         </div>
                         <div id="radios_in_modal">
                           <p className="payments-tag">{langFullData.paymentMode}</p>
                           <div className="form-check form-check-inline">
                             <input
                               className="form-check-input"
                               type="radio"
                               name="radio"
                               id="inlineRadio1"
                               value="CASH"
                               onChange={(e) => setPaymentMode(e.target.value)}
                               checked={paymentMode === "CASH"}
                               required
                             />
                             <label
                               className="form-check-label"
                               for="inlineRadio1"
                             >
                               {langFullData.cash}
                             </label>
                           </div>
                           <div
                             className="form-check form-check-inline"
                             id="radio-btn-in_modal"
                           >
                             <input
                               className="form-check-input"
                               type="radio"
                               name="radio"
                               id="inlineRadio2"
                               value="UPI"
                               onChange={(e) => setPaymentMode(e.target.value)}
                               checked={paymentMode === "UPI"}
                               required
                             />
                             <label
                               className="form-check-label"
                               for="inlineRadio2"
                             >
                               {langFullData.upi}
                             </label>
                           </div>
                           <div className="form-check form-check-inline">
                             <input
                               className="form-check-input"
                               type="radio"
                               name="radio"
                               id="inlineRadio3"
                               value="NEFT"
                               onChange={(e) => setPaymentMode(e.target.value)}
                               checked={paymentMode === "NEFT"}
                               required
                             />
                             <label
                               className="form-check-label"
                               for="inlineRadio3"
                             >
                               {langFullData.neft}
                             </label>
                           </div>
                           <div className="form-check form-check-inline">
                             <input
                               className="form-check-input"
                               type="radio"
                               name="radio"
                               id="inlineRadio4"
                               value="RTGS"
                               onChange={(e) => setPaymentMode(e.target.value)}
                               checked={paymentMode === "RTGS"}
                               required
                             />
                             <label
                               className="form-check-label"
                               for="inlineRadio4"
                             >
                               {langFullData.rtgs}
                             </label>
                           </div>
                           <div className="form-check form-check-inline">
                             <input
                               className="form-check-input"
                               type="radio"
                               name="radio"
                               id="inlineRadio5"
                               value="IMPS"
                               onChange={(e) => setPaymentMode(e.target.value)}
                               checked={paymentMode === "IMPS"}
                               required
                             />
                             <label
                               className="form-check-label"
                               for="inlineRadio5"
                             >
                               {langFullData.imps}
                             </label>
                           </div>
                         </div>
                         <div id="comment_in_modal">
                           <div className="mb-3">
                             <label
                               for="exampleFormControlTextarea1"
                               className="form-label"
                               id="comment-tag"
                             >
                               {langFullData.comment}
                             </label>
                             <textarea
                               className="form-control"
                               id="comments"
                               rows="2"
                               value={comments}
                               onChange={(e) => setComments(e.target.value)}
                             ></textarea>
                           </div>
                         </div>
                       </form>
                     </div>
                     <div className="modal-footer" id="modal_footer">
                       <button
                         type="button"
                         id="submit_btn_in_modal"
                         className="primary_btn cont_btn w-100"
                         onClick={onSubmitRecordPayment}
                         // id="close_modal"
                         data-bs-dismiss="modal"
                       >
                         {langFullData.submit}
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
             )}
             {toggleState === "paymentledger" && (
               <div className="transporterSummary" id="scroll_style">
                 <div
                   id="transporter-summary"
                   className={
                     toggleState === "paymentledger"
                       ? "content  active-content"
                       : "content"
                   }
                    >
                   {ledgerSummary.length > 0 ? (
                     <table className="table table-bordered ledger-table">
                       <thead className="thead-tag">
                         <tr>
                           <th className="col-1" id="sno">
                             #
                           </th>
                           <th className="col-2">{langFullData.refId}</th>
                           <th className="col-3">{langFullData.paid}(&#8377;)</th>
                           <th className="col-3">{langFullData.toBePaid}(&#8377;)</th>
                           <th className="col-3">{langFullData.ledgerBalance}(&#8377;)</th>
                         </tr>
                       </thead>
                       <tbody>
                         {ledgerSummary.map((item, index) => {
                           return (
                             <tr
                               className="tr-tags"
                               scope="row"
                               kery={item.partyId}
                             >
                               <td className="col-1">
                                 <p id="p-common-sno">{index + 1}</p>
                               </td>
                               <td className="col-2">
                                 <p style={{ color: "#0066FF" }}>
                                   {item.refId}
                                 </p>
                                 <p>{moment(item.date).format("DD-MMM-YY")}</p>
                               </td>
                               <td className="col-3">
                                 <p id="p-common">
                                   {item.paidRcvd
                                     ? getCurrencyNumberWithOutSymbol(item.paidRcvd)
                                     : ''}
                                 </p>
                               </td>
                               <td className="col-3">
                                 <p id="p-common" className="paid-coloring">
                                   {item.toBePaid
                                     ? getCurrencyNumberWithOutSymbol(item.toBePaid)
                                     : ''}
                                 </p>
                               </td>
                               <td className="col-3">
                                 <p className="coloring color_black" id="p-common">
                                   {item.balance ? getCurrencyNumberWithOutSymbol(item.balance) : ''}
                                 </p>
                               </td>
                             </tr>
                           );
                         })}
                       </tbody>
                     </table>
                   ) : (
                     <NoDataAvailable />
                   )}
                 </div>
               </div>
             )}
             {toggleState === "inventoryledger" && (
               <div className="transporterDetailed" id="scroll_style">
                 <div
                   id="detailed-inventory"
                   className={
                     toggleState === "inventoryledger"
                       ? "content  active-content"
                       : "content"
                   }
                 >
                   {invDetails.length > 0 ? (
                     <table className="table table-bordered ledger-table">
                       <thead className="thead-tag">
                         <tr>
                           <th className="col-1" id="p-common-sno">
                             #
                           </th>
                           <th className="col-2">{langFullData.refId}</th>
                           <th className="col-3">{langFullData.collected}</th>
                           <th className="col-3">{langFullData.given}</th>
                           <th className="col-3">{langFullData.balance}</th>
                         </tr>
                       </thead>
                       <tbody>
                         {invDetails.map((item, index) => {
                           return (
                             <tr className="trs-tags" key={item.partyId}>
                               <td className="col-1" id="p-common-sno">
                                 {index + 1}
                               </td>
                               <td className="col-2">
                                 <p
                                   style={{
                                     color: "#0066FF",
                                     cursor: "pointer",
                                   }}
                                 >
                                   {item.refId}
                                 </p>
                                 <p>{moment(item.date).format("DD-MMM-YY")}</p>
                               </td>
                               <td className="col-3">
                                 <p id="p-common">
                                   {item.collected
                                     ? item.collected.toFixed(1)
                                     : ''}
                                      &nbsp;
                                   {item.collected ? item.unit === "BAGS"
                                     ? item.unit.charAt(item).toUpperCase() +
                                       item.unit.slice(2, 3).toLowerCase()
                                     : item.unit === "BOXES"
                                     ? item.unit.charAt(item).toUpperCase() +
                                       item.unit.slice(2, 3).toLowerCase()
                                     : item.unit === "CRATES" || "SACS"
                                     ? item.unit.charAt(item).toUpperCase()
                                     : "":''}
                                 </p>
                               </td>
                               <td className="col-3">
                                 <p id="p-common">
                                   {item.given ? item.given.toFixed(1) : ''}
                                   &nbsp;
                                   {item.given ? item.unit === "BAGS"
                                     ? item.unit.charAt(0).toUpperCase() +
                                       item.unit.slice(2, 3).toLowerCase()
                                     : item.unit === "BOXES"
                                     ? item.unit.charAt(0).toUpperCase() +
                                       item.unit.slice(2, 3).toLowerCase()
                                     : item.unit === "CRATES" || "SACS"
                                     ? item.unit.charAt(item).toUpperCase()
                                     : "":''}
                                 </p>
                               </td>
                               <td className="col-3">
                                 <p id="p-common">
                                   {item.unit === "CRATES"
                                     ? item.cratesBalance.toFixed(1)
                                     : item.unit === "SACS"
                                     ? item.sacsBalance.toFixed(1)
                                     : item.unit === "BAGS"
                                     ? item.bagsBalance.toFixed(1)
                                     : item.unit === "BOXES"
                                     ? item.boxesBalance.toFixed(1)
                                     : ''}
                                   &nbsp;
                                   {item.unit === "BAGS"
                                     ? item.unit.charAt(0).toUpperCase() +
                                       item.unit.slice(2, 3).toLowerCase()
                                     : item.unit === "BOXES"
                                     ? item.unit.charAt(0).toUpperCase() +
                                       item.unit.slice(2, 3).toLowerCase()
                                     : item.unit === "CRATES" || "SACS"
                                     ? item.unit.charAt(item).toUpperCase()
                                     : ''}
                                 </p>
                               </td>
                             </tr>
                           );
                         })}
                       </tbody>
                     </table>
                   ) : (
                    <NoDataAvailable />
                   )}
                 </div>
               </div>
             )}
             <div>
               {toggleState === "inventoryledger" && (
                 <div className="modal fade" id="myModal">
                   <div className="modal-dialog transporter_inventory_modal modal-dialog-centered">
                     <div className="modal-content">
                       <div className="modal-header">
                         <h5
                           className="modal-title header2_text"
                           id="staticBackdropLabel"
                         >
                           Add Record Inventory
                         </h5>
                         <div className="bloc-tab">
                           <button
                             className={
                               toggleInventory === "Given"
                                 ? "tab active-tab"
                                 : "tab"
                             }
                             onClick={() => toggleTabs("Given")}
                           >
                             {langFullData.given}
                           </button>
                           <button
                             className={
                               toggleInventory === "Collected"
                                 ? "tab active-tab"
                                 : "tab"
                             }
                             onClick={() => toggleTabs("Collected")}
                           >
                             {langFullData.collected}
                           </button>
                         </div>
                         <img
                           src={close}
                           alt="image"
                           className="close_icon"
                           onClick={closePopup}
                         />
                       </div>
                       <div
                         className="modal-body transporter_inventory_model_body"
                         id="scroll_style"
                       >
                         <div
                           className={
                             toggleInventory === "Given" ||
                             toggleInventory === "Collected"
                               ? "content  active-content"
                               : "content"
                           }
                         >
                           <form>
                             <div className="d-flex justify-content-between card">
                               <div className="d-flex justify-content-between card-body" id="details-tag">
                                 {transporter.map((item, index) => {
                                   if (item.partyId == transId) {
                                     return (
                                       <Fragment>
                                         <div
                                           className="profile-details"
                                           key={item.partyName}
                                         >
                                           <div className="d-flex">
                                             <div>
                                               {item.profilePic ? (
                                                 <img
                                                   className="singles-img"
                                                   src={item.profilePic}
                                                   alt="buy-img"
                                                 />
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
                                               <p className="mobilee-tag">
                                                 {!item.trader
                                                   ? "Transporter"
                                                   : "Trader"}{" "}
                                                 - {item.partyId}&nbsp;|&nbsp;
                                                 {item.mobile}
                                               </p>
                                               <p className="addres-tag">
                                                 {item.partyAddress
                                                   ? item.partyAddress
                                                   : ""}
                                               </p>
                                             </div>
                                           </div>
                                         </div>
                                       </Fragment>
                                     );
                                   }
                                 })}
                                 <div className="d-flex card-text" id="date-tag">
                                    <img
                                      className="date_icon_in_modal"
                                      src={date_icon}
                                    />
                                    <div className="d-flex date_popper">
                                      <DatePicker
                                        //className="date_picker_in_modal"
                                        selected={selectDate}
                                        onChange={(date) => {
                                          setSelectDate(date);
                                        }}
                                        dateFormat="dd-MMM-yy"
                                        maxDate={new Date()}
                                        placeholder="Date"
                                      ></DatePicker>
                                    </div>
                                  </div>
                              </div>
                             </div>
                             <div id="out-paybles">
                               <p id="p-tag">{langFullData.inventoryBalance}</p>
                             </div>
                             <div id="cbbk-tag">
                               {toggleState === "inventoryledger" &&
                                 getInventor.map((item) => {
                                   return (
                                     <p id="cbbsk-tag">
                                       {item.unit}:{item.qty.toFixed(1)}
                                       <span>&nbsp;/&nbsp;</span>
                                     </p>
                                   );
                                 })}
                             </div>
                             <div id="radios_in_modal">
                               {toggleInventory === "Given" ? (
                                 <p className="select-tag">
                                   Select Given Type
                                 </p>
                               ) : (
                                 <p className="select-tag">
                                   {langFullData.selectCollectedType}
                                 </p>
                               )}

                               <div className="form-check form-check-inline">
                                 <input
                                   className="form-check-input"
                                   type="radio"
                                   name="radio"
                                   id="inlineRadio1"
                                   value="CRATES"
                                   onChange={(e) => setUnit(e.target.value)}
                                   checked={unit === "CRATES"}
                                   required
                                 />
                                 <label
                                   className="form-check-label"
                                   for="inlineRadio1"
                                   id="crates"
                                 >
                                   {langFullData.crates}
                                 </label>
                               </div>
                               <div className="form-check form-check-inline">
                                 <input
                                   className="form-check-input"
                                   type="radio"
                                   name="radio"
                                   id="inlineRadio2"
                                   value="SACS"
                                   onChange={(e) => setUnit(e.target.value)}
                                   required
                                 />
                                 <label
                                   className="form-check-label"
                                   for="inlineRadio2"
                                   id="sacs"
                                 >
                                   {langFullData.sacs}
                                 </label>
                               </div>
                               <div className="form-check form-check-inline">
                                 <input
                                   className="form-check-input"
                                   type="radio"
                                   name="radio"
                                   id="inlineRadio3"
                                   value="BOXES"
                                   onChange={(e) => setUnit(e.target.value)}
                                   required
                                 />
                                 <label
                                   className="form-check-label"
                                   for="inlineRadio3"
                                   id="boxes"
                                 >
                                   {langFullData.boxes}
                                 </label>
                               </div>
                               <div className="form-check form-check-inline">
                                 <input
                                   className="form-check-input"
                                   type="radio"
                                   name="radio"
                                   id="inlineRadio4"
                                   value="BAGS"
                                   onChange={(e) => setUnit(e.target.value)}
                                   required
                                 />
                                 <label
                                   className="form-check-label"
                                   for="inlineRadio4"
                                   id="bags"
                                 >
                                   {langFullData.bags}
                                 </label>
                               </div>
                               <div className="form-gro">
                                 <label hmtlFor="amtRecieved" id="count-tag">
                                   {langFullData.numberOf} {unit}
                                 </label>
                                 <input
                                   className="form-cond"
                                   id="amtRecieved"
                                   required
                                   onChange={(e) => setQty(e.target.value)}
                                 />
                                 <p className="text-valid">
                                   {requiredCondition}
                                 </p>
                               </div>

                               <div className="mb-3">
                                 <label
                                   for="exampleFormControlTextarea1"
                                   className="form-label"
                                   id="comments-tag"
                                 >
                                   {langFullData.comment}
                                 </label>
                                 <textarea
                                   className="form-control"
                                   id="comments"
                                   rows="2"
                                   value={comments}
                                   onChange={(e) =>
                                     setComments(e.target.value)
                                   }
                                 ></textarea>
                               </div>
                             </div>
                           </form>
                         </div>
                       </div>
                       <div className="modal-footer" id="modal_footer">
                         <button
                           type="button"
                           id="submit_btn_in_modal"
                           className="primary_btn cont_btn w-100"
                           onClick={onSubmitRecordInventory}
                           // id="close_modal"
                           /*</div>data-dismiss="modal"*/
                         >
                           SUBMIT
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>
               )}
             </div>
           </div>
         </div>
       </div> : <NoDataAvailable />
       }
      </div>
    </Fragment>
  );
};
export default TransportoLedger;
