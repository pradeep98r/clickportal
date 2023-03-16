import React from 'react'
import { useState } from 'react';
import close from "../../assets/images/close.svg";
import date_icon from "../../assets/images/date_icon.svg";
import DatePicker from "react-datepicker";
import single_bill from "../../assets/images/bills/single_bill.svg";
import add from "../../assets/images/add.svg";
import $ from "jquery";
import { getDetailedLedgerByDate,
    getLedgers, getLedgerSummaryByDate,
    getOutstandingBal, getSellerDetailedLedger,
    getSellerDetailedLedgerByDate, postRecordPayment,
    updateRecordPayment } from '../../actions/ledgersService';
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMaskedMobileNumber } from '../../components/getCurrencyNumber';
import { getBuyerDetailedLedger, getLedgerSummary } from '../../actions/billCreationService';
import { useEffect } from 'react';
import { getParticularTransporter, getTransporters } from '../../actions/transporterService';
import SelectBillIds from './selectBillIds';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { paymentViewInfo } from "../../reducers/paymentViewSlice";
import { allLedgers, detaildLedgerInfo, fromRecordPayment, ledgerSummaryInfo } from '../../reducers/ledgerSummarySlice';
const RecordPayment = (props) => {
    const ledgerData = props.LedgerData;
    const dispatch = useDispatch();
    const partyId = props.ledgerId;
    const loginData = JSON.parse(localStorage.getItem("loginResponse"));
    const clickId = loginData.caId;
    const [selectDate, setSelectDate] = useState(props.fromPaymentHistory ?
        new Date(ledgerData?.date) : new Date());
    const paidRcvd =props.fromPaymentHistory ? ledgerData.balance: props.outStbal;
    let [paidsRcvd, setPaidsRcvd] = useState(props.fromPaymentHistory ? ledgerData?.amount : 0);
    const [comments, setComments] = useState(
        props.fromPaymentHistory ? ledgerData?.comments : " ");
    const [paymentMode, setPaymentMode] = useState(
        props.fromPaymentHistory ? ledgerData?.paymentMode : "CASH");
    const [requiredCondition, setRequiredCondition] = useState("");

    const [ledgerSummary, setLedgerSummary] = useState([]);
    const [detailedLedger, setdetailedLedger] = useState([]);
    const [outStAmt, setOutStAmt] = useState([]);
    const [ledgers, setLedgers] = useState([]);
    const [summary, setSummary] = useState([]);

    const [showLisOfBillIdsPopUp, setShowLisOfBillIdsPopUp] = useState(false);
    const [showBillIdsModal, setShowBillIdsModal] = useState(false);

    const [discountRs, setDiscountRs] = useState(0);
    const [discountPerc, setDiscountPerc] = useState(0);
    const [billAmount, setBillAmount] = useState(0);

    const [billIds, setBillIds] = useState(props.fromPaymentHistory ? ledgerData?.billIds : []);
    const [totalRecieved, setTotalRecieved] = useState(0);
    const tabClick = useSelector(state => state.ledgerSummaryInfo);
    var ledgerTab = tabClick.partnerTabs;
    var allCustomTab=tabClick.allCustomTabs;
    var startDate=tabClick.beginDate;
    var endDate=tabClick.closeDate;
    console.log(tabClick,"clicks")
    useEffect(() => {

    }, [props.showRecordPaymentModal])
    const getAmountVal = (e) => {
        setPaidsRcvd(
            e.target.value.replace(/[^\d]/g, "")
        );
        if (e.target.value.length > 0) {
            setRequiredCondition("");
        }
    }
    const resetInput = (e) => {
        if (e.target.value == 0) {
            e.target.value = "";
        }
    }
    const onSubmitRecordPayment = () => {
        if (billIds.length > 0) {
            paidsRcvd = totalRecieved;
        }
        if (paidsRcvd < 0) {
            setRequiredCondition("Amount Recieved Cannot be negative");
        } else if (parseInt(paidsRcvd) === 0) {
            setRequiredCondition("Amount Received cannot be empty");
        } else if (isNaN(paidsRcvd)) {
            setRequiredCondition("Invalid Amount");
        } else if (
            paidsRcvd.toString().trim().length !== 0 &&
            paidsRcvd != 0 &&
            paidsRcvd < paidRcvd &&
            !(paidsRcvd < 0)
        ) {
            addRecordPayment();
        } else if (parseInt(paidsRcvd) > paidRcvd) {
            setRequiredCondition(
                "Entered Amount  cannot more than Outstanding Balance"
            );
        }
    };

    const addRecordPayment = async () => {
        const addRecordData = {
            caId: clickId,
            partyId: partyId,
            date: moment(selectDate).format("YYYY-MM-DD"),
            comments: comments,
            paidRcvd: paidsRcvd,
            paymentMode: paymentMode,
            billIds: billIds,
            type: props.partyType,
            discount: discountRs
        };
        const updateRecordRequest ={
            action:'UPDATE',
            caId: clickId,
            partyId: partyId,
            date: moment(selectDate).format("YYYY-MM-DD"),
            comments: comments,
            paidRcvd: paidsRcvd,
            paymentMode: paymentMode,
            billIds: billIds,
            type: ledgerData?.type,
            discount: discountRs,
            refId:ledgerData?.refId,
            toBePaidRcvd:0
        }
        if(props.fromPaymentHistory){
            await updateRecordPayment(updateRecordRequest).then((res)=>{
                toast.success(res.data.status.message, {
                    toastId: "errorr2",
                })
                dispatch(paymentViewInfo(updateRecordRequest));
                dispatch(fromRecordPayment(true));
                window.setTimeout(function(){
                    props.closeRecordPaymentModal();
                },1000)
                },(error)=>{
                console.log(error.message)
                toast.error(error.res.data.status.message, {
                    toastId: "error3",
                });
            })   
            
        } else{
            await postRecordPayment(addRecordData).then((response) => {
                closePopup();
                toast.success(response.data.status.message, {
                    toastId: "errorr2",
                })
                window.setTimeout(function(){
                    props.closeRecordPaymentModal();
                },1000)
                
                },
                (error) => {
                    toast.error(error.response.data.status.message, {
                        toastId: "error3",
                    });
            });
        }
        
        if (props.tabs == 'paymentledger') {
            getTransportersData()
            getOutstandingPaybles(clickId, partyId)
            paymentLedger(clickId, partyId)
        } else {
            fetchLedgers();
            if (allCustomTab == 'all' && ledgerTab == 'ledgersummary') {
                summaryData(clickId, partyId);
            }
            else if (allCustomTab == 'all' && ledgerTab == 'detailedledger') {
                console.log("here")
                if (props.partyType == 'BUYER' || ledgerData?.type=='BUYER') {
                    console.log("here")
                    geyDetailedLedger(clickId, partyId)
                } else {
                    sellerDetailed(clickId, partyId)
                }
            } else if (allCustomTab == 'custom' && ledgerTab == 'ledgersummary') {
                console.log("here to custom",startDate)
                var fromDate = moment(startDate).format("YYYY-MM-DD");
                var toDate = moment(endDate).format("YYYY-MM-DD");
                ledgerSummaryByDate(clickId, partyId, fromDate, toDate);
            } else if(allCustomTab == 'custom' && ledgerTab == 'detailedledger') {
                var fromDate = moment(startDate).format("YYYY-MM-DD");
                var toDate = moment(endDate).format("YYYY-MM-DD");
                if (props.partyType == 'BUYER' || ledgerData?.type=='BUYER') {
                    detailedLedgerByDate(clickId, partyId, fromDate, toDate)
                } else {
                    sellerDetailedByDate(clickId, partyId, fromDate, toDate)
                }
            }
            getOutstandingPaybles(clickId, partyId)
            // window.setTimeout(function () {
            //     window.location.reload();
            // }, 2000);;
        }


    };

    const getTransportersData = () => {
        getTransporters(clickId).then((response) => {
            props.outStAmt(response.data.data);
            props.transData(response.data.data.ledgers);
            // setOutStAmt(response.data.data)
            // setTransData(response.data.data.ledgers)
        });
    };
    //get Payment Ledger
    const paymentLedger = (clickId, partyId) => {
        getParticularTransporter(clickId, partyId)
            .then((response) => {
                props.payledger(response.data.data);
                props.payledgersummary(response.data.data.details)
            })
            .catch((error) => {
                console.log(error)
            });
    };
    const summaryData = (clickId, partyId) => {
        getLedgerSummary(clickId, partyId)
            .then((res) => {
                if (res.data.status.type === "SUCCESS") {
                    // setSummary(res.data.data)
                    // setLedgerSummary(res.data.data.ledgerSummary);
                    
                    if(props.fromPaymentHistory){
                        dispatch(ledgerSummaryInfo(res.data.data.ledgerSummary))
                    } else{
                        props.setSummary(res.data.data)
                        props.ledgerSummaryData(res.data.data.ledgerSummary)
                    }
                } else {
                    setLedgerSummary([]);
                }
            })
            .catch((error) => console.log(error));
    };
    const geyDetailedLedger = (clickId, partyId) => {
        getBuyerDetailedLedger(clickId, partyId)
            .then((res) => {
                if (res.data.status.type === "SUCCESS") {
                    if(props.fromPaymentHistory){
                        dispatch(detaildLedgerInfo(res.data.data.details))
                    }
                    else{
                        props.setSummary(res.data.data)
                    // setdetailedLedger(res.data.data.details);
                        props.ledgerSummaryData(res.data.data.details)
                    }
                    
                } else {
                    setdetailedLedger([]);
                }
            })
            .catch((error) => console.log(error));
    };
    //Get Seller Detailed Ledger
    const sellerDetailed = (clickId, partyId) => {
        getSellerDetailedLedger(clickId, partyId)
            .then((res) => {
                if (res.data.status.type === "SUCCESS") {
                    if(props.fromPaymentHistory){
                        dispatch(detaildLedgerInfo(res.data.data.details))
                    }
                    else{
                        props.setSummary(res.data.data)
                    // setdetailedLedger(res.data.data.details);
                        props.ledgerSummaryData(res.data.data.details)
                    }
                } else {
                    setdetailedLedger([]);
                }
            })
            .catch((error) => console.log(error));
    };
    const fetchLedgers = () => {
        getLedgers(clickId, props.partyType?props.partyType:ledgerData?.type).then(res => {
            if (res.data.status.type === "SUCCESS") {
                // setLedgers(res.data.data.ledgers);
                // setOutStAmt(res.data.data);
                if (props.allCustomTab == 'all' && props.ledgerTab == 'ledgersummary') {

                }
                if(props.fromPaymentHistory){
                    dispatch(allLedgers(res.data.data.ledgers));
                } else{
                    props.ledgers(res.data.data.ledgers);
                    props.outStAmt(res.data.data);
                }
            } else {
                console.log("some")
            }
            setOutStAmt(res.data.data);
        })
    }
    //ledger summary by date
    const ledgerSummaryByDate = (clickId, partyId, fromDate, toDate) => {
        getLedgerSummaryByDate(clickId, partyId, fromDate, toDate)
            .then((res) => {
                if (res.data.data !== null) {
                    if(props.fromPaymentHistory){
                        dispatch(ledgerSummaryInfo(res.data.data.ledgerSummary))
                    } else{
                        props.setSummary(res.data.data)
                        props.ledgerSummaryData(res.data.data.ledgerSummary)
                    };
                } else {
                    //   setSummaryByDate([]);
                    //   setcardDetails([]);
                }
            })
            .catch((error) => console.log(error));
    };
    //Buyer Detailed Ledger By Date
    const detailedLedgerByDate = (clickId, partyId, fromDate, toDate) => {
        getDetailedLedgerByDate(clickId, partyId, fromDate, toDate)
            .then((res) => {
                if (res.data.data !== null) {
                    if(props.fromPaymentHistory){
                        dispatch(detaildLedgerInfo(res.data.data.details))
                    }
                    else{
                        props.setSummary(res.data.data)
                    // setdetailedLedger(res.data.data.details);
                        props.ledgerSummaryData(res.data.data.details)
                    }
                } else {
                    // setdetailedLedgerByDate([]);
                    // setcardDetailed([]);
                }
            })
            .catch((error) => console.log(error));
    };

    //Seller Detailed ledger By Date
    const sellerDetailedByDate = (clickId, partyId, fromDate, toDate) => {
        getSellerDetailedLedgerByDate(clickId, partyId, fromDate, toDate)
            .then((res) => {
                if (res.data.data !== null) {
                    if(props.fromPaymentHistory){
                        dispatch(detaildLedgerInfo(res.data.data.details))
                    }
                    else{
                        props.setSummary(res.data.data)
                    // setdetailedLedger(res.data.data.details);
                        props.ledgerSummaryData(res.data.data.details)
                    }
                } else {
                    // setdetailedLedgerByDate([]);
                    // setcardDetailed([]);
                }
            })
            .catch((error) => console.log(error));
    };
    //Get Outstanding balance
    const getOutstandingPaybles = (clickId, partyId) => {
        getOutstandingBal(clickId, partyId).then((response) => {
            props.setPaidRcvd(response.data.data)
        });
    };
    const showListOfBillIds = (id) => {
        setShowLisOfBillIdsPopUp(true);
        setShowBillIdsModal(true);
    }

    const billidsData = (data) => {
        var values = data.map(item => item.billId);
        var recieved = 0
        data.map(item => {
            recieved += item.amount;
        })
        setBillIds(values);
        setTotalRecieved(recieved);
    }

    const closePopup = () => {
        setPaidsRcvd(0);
        setRequiredCondition('');
        setPaymentMode("CASH");
        setComments('');
        setSelectDate(new Date());
        setBillIds([]);
        setDiscountRs(0);
        setBillAmount(0);
        setDiscountPerc(0);
        setTotalRecieved(0);
        $("#myModal").modal("hide");
    };
    const getDiscountPercentageValue = (e) => {
        var val = e.target.value
            .replace(/[^\d.]/g, '')
            .replace(/^(\d*)(\.\d{0,2})\d*$/, '$1$2')
            .replace(/(\.\d{0,2})\d*/, '$1')
            .replace(/(\.\d*)\./, '$1');
        setDiscountPerc(val);
        if (totalRecieved !== 0) {
            var discountRupees = (val / 100) * totalRecieved;
            setBillAmount((totalRecieved - discountRupees).toFixed(2));
            setDiscountRs(discountRupees.toFixed(2));
        }
    }
    const getDiscountRsValue = (e) => {
        var val = e.target.value
            .replace(/[^\d.]/g, '')
            .replace(/^(\d*)(\.\d{0,2})\d*$/, '$1$2')
            .replace(/(\.\d{0,2})\d*/, '$1')
            .replace(/(\.\d*)\./, '$1');
        setDiscountRs(val);
        if (totalRecieved !== 0) {
            var perc = (val / totalRecieved) * 100;
            setDiscountPerc(perc.toFixed(2));
            setBillAmount((totalRecieved - val).toFixed(2));
        }
    }
    return (
        <Modal
            show={props.showRecordPaymentModal}
            close={props.closeRecordPaymentModal}
        >

            <div className="modal-header">
                <h5
                    className="modal-title header2_text"
                    id="staticBackdropLabel"
                >
                    {props.fromPaymentHistory ? 'Update Record Payment' : 'Add Record Payment'}
                </h5>
                <img
                    src={close}
                    alt="image"
                    className="close_icon"
                    onClick={() => { props.closeRecordPaymentModal() }}
                />
            </div>
            <div
                className="modal-body transporter_model_body"
                id="scroll_style"
            >
                <form>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div
                                    className="d-flex justify-content-between card-body"
                                    id="details-tag"
                                >

                                    <div
                                        className="profile-details"
                                        key={ledgerData?.partyId}
                                    >
                                        <div className="d-flex">
                                            <div>
                                                {ledgerData?.profilePic ? (
                                                    <img
                                                        id="singles-img"
                                                        src={ledgerData.profilePic}
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
                                                    {ledgerData.partyName}
                                                </p>
                                                <p className="mobilee-tag">
                                                    {!ledgerData.trader
                                                        ? props.partyType
                                                            || ledgerData.type == "BUYER"
                                                            ? "Buyer" :
                                                            props.type == 'TRANS' ?
                                                                'Transporter'
                                                                : "Seller"
                                                        : "Trader"}{" "}
                                                    - {ledgerData.partyId}&nbsp;|&nbsp;
                                                    {(ledgerData?.mobile)}
                                                    {/* {getMaskedMobileNumber(ledgerData?.mobile)} */}
                                                </p>
                                                <p className="addres-tag">
                                                    {ledgerData.partyAddress
                                                        ? ledgerData.partyAddress
                                                        : ""}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="d-flex justify-content-between card-text date_field"
                                        id="date-tag"
                                    >

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
                                            onKeyDown={(e) => {
                                                e.preventDefault();
                                            }}
                                        ></DatePicker>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-lg-6 select-bills'>
                                    <label hmtlFor="amtRecieved" id="amt-tag">
                                        Select Bills{billIds.length > 0 ? '(' + (billIds.length) + ')' : ''}
                                    </label>
                                    {billIds.length > 0 ?
                                        <input
                                            className="form-cont pselect-bill"
                                            id="amtRecieved"
                                            onFocus={(e) => resetInput(e)}
                                            value={billIds.join(" , ")}
                                            required
                                            onClick={() => { showListOfBillIds(partyId) }}
                                        />
                                        : <input
                                            readOnly
                                            className="form-cont pselect-bill"
                                            id="amtRecieved"
                                            onFocus={(e) => resetInput(e)}
                                            placeholder="Select Bill"
                                            required

                                            onClick={() => { showListOfBillIds(partyId) }}
                                        />

                                    }
                                </div>
                                <div className='col-lg-2'></div>
                                <div className="col-lg-4" align="left">
                                    <div className='out-paybles'>
                                        <p id="p-tag">Outstanding Recievables</p>
                                        <p id="recieve-tag">
                                            &#8377;
                                            {props.fromPaymentHistory ?
                                                ledgerData?.balance : paidRcvd ? paidRcvd.toFixed(2) : 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group" id="input_in_modal">
                                <label hmtlFor="amtRecieved" id="amt-tag">
                                    Amount Recieved
                                </label>
                                <input
                                    className="form-cont"
                                    id="amtRecieved"
                                    onFocus={(e) => resetInput(e)}
                                    value={totalRecieved > 0 ? totalRecieved : paidsRcvd}
                                    required
                                    onChange={(e) => {
                                        getAmountVal(e)
                                    }}
                                />
                                <p className="text-valid">{requiredCondition}</p>
                            </div>
                            {billIds.length > 0 ?
                                <p hmtlFor="amtRecieved" className='discount-label'>
                                    Discount
                                </p> : ''}
                            {billIds.length > 0 ?
                                <div className='row'>
                                    <div className='col-lg-6 discount-prec'>
                                        <label hmtlFor="amtRecieved" className='disc-per'>
                                            Discount(%)
                                        </label>
                                        <input
                                            className="form-cont"
                                            id="amtRecieved"
                                            onFocus={(e) => resetInput(e)}
                                            required
                                            value={discountPerc}
                                            onChange={(e) => {
                                                getDiscountPercentageValue(e)
                                            }}
                                        />
                                    </div>
                                    <div className='col-lg-6'>
                                        <label hmtlFor="amtRecieved" className='disc-per'>
                                            Discount(Rs)
                                        </label>
                                        <input
                                            className="form-cont"
                                            id="amtRecieved"
                                            onFocus={(e) => resetInput(e)}
                                            value={discountRs}
                                            required
                                            onChange={(e) => {
                                                getDiscountRsValue(e)
                                            }}
                                        />
                                    </div>
                                    {billAmount > 0 ?
                                        <div className='amount'>
                                            <p className='amt-after-dic'>Amount After Discount</p>
                                            <p className='bill-amt'>&#8377;{billAmount}</p>
                                        </div>
                                        : ''}
                                </div>
                                : ''}
                            <div id="radios_in_modal">
                                <p className="payment-tag">Payment Mode</p>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input radioBtnVal mb-0"
                                        type="radio"
                                        name="radio"
                                        id="inlineRadio1"
                                        value="CASH"
                                        onChange={(e) =>
                                            setPaymentMode(e.target.value)
                                        }
                                        checked={paymentMode === "CASH"}
                                        required
                                    />
                                    <label
                                        className="form-check-label"
                                        for="inlineRadio1"
                                    >
                                        CASH
                                    </label>
                                </div>
                                <div
                                    className="form-check form-check-inline"
                                    id="radio-btn-in_modal"
                                >
                                    <input
                                        className="form-check-input radioBtnVal mb-0"
                                        type="radio"
                                        name="radio"
                                        id="inlineRadio2"
                                        value="UPI"
                                        onChange={(e) =>
                                            setPaymentMode(e.target.value)
                                        }
                                        checked={paymentMode === "UPI"}
                                        required
                                    />
                                    <label
                                        className="form-check-label"
                                        for="inlineRadio2"
                                    >
                                        UPI
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input radioBtnVal mb-0"
                                        type="radio"
                                        name="radio"
                                        id="inlineRadio3"
                                        value="NEFT"
                                        onChange={(e) =>
                                            setPaymentMode(e.target.value)
                                        }
                                        checked={paymentMode === "NEFT"}
                                        required
                                    />
                                    <label
                                        className="form-check-label"
                                        for="inlineRadio3"
                                    >
                                        NEFT
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input radioBtnVal mb-0"
                                        type="radio"
                                        name="radio"
                                        id="inlineRadio4"
                                        value="RTGS"
                                        onChange={(e) =>
                                            setPaymentMode(e.target.value)
                                        }
                                        checked={paymentMode === "RTGS"}
                                        required
                                    />
                                    <label
                                        className="form-check-label"
                                        for="inlineRadio4"
                                    >
                                        RTGS
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input radioBtnVal mb-0"
                                        type="radio"
                                        name="radio"
                                        id="inlineRadio5"
                                        value="IMPS"
                                        onChange={(e) =>
                                            setPaymentMode(e.target.value)
                                        }
                                        checked={paymentMode === "IMPS"}
                                        required
                                    />
                                    <label
                                        className="form-check-label"
                                        for="inlineRadio5"
                                    >
                                        IMPS
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
                                        Comment
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
                        </div>
                    </div>
                </form>
            </div>
            <div className="modal-footer" id="modal_footer">
                <button
                    type="button"
                    id="submit_btn_in_modal"
                    className="primary_btn cont_btn w-100"
                    onClick={() => { onSubmitRecordPayment() }}
                    // id="close_modal"
                    data-bs-dismiss="modal"
                >
                    SUBMIT
                </button>
            </div>
            {showLisOfBillIdsPopUp ?
                <SelectBillIds
                    showBillIdsModal={showBillIdsModal}
                    partyId={partyId}
                    selectedDate={selectDate}
                    billIdsCloseModal={() => setShowBillIdsModal(false)}
                    setBillIdsData={billidsData}
                    selectedDateTo={selectDate}
                />
                : ''}
            <ToastContainer />
        </Modal>
    )
}

export default RecordPayment