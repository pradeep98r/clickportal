import React, { Fragment, useState } from 'react'
import { useEffect } from 'react';
import {
    getBuyerDetailedLedger,
    getLedgers, getLedgerSummary,
    getLedgerSummaryByDate,
    getOutstandingBal,
    getSellerDetailedLedger,
    getSellerDetailedLedgerByDate
} from '../../actions/ledgersService';
import SearchField from '../../components/searchField';
import no_data_icon from "../../assets/images/NodataAvailable.svg";
import "../../modules/ledgers/buyerLedger.scss";
import moment from "moment";
import single_bill from "../../assets/images/bills/single_bill.svg";
import {
    getCurrencyNumberWithOutSymbol,
    getCurrencyNumberWithSymbol,
    getCurrencyNumberWithOneDigit,
} from "../../components/getCurrencyNumber";
import { getDetailedLedgerByDate } from '../../actions/billCreationService';
import DatePickerModel from "../smartboard/datePicker";
import LedgerSummary from './ledgerSummary';
import DetailedLedger from './detailedLedger';
import date_icon from "../../assets/images/date_icon.svg";
import loading from "../../assets/images/loading.gif";
import NoInternetConnection from "../../components/noInternetConnection";
import RecordPayment from './recordPayment';
import { useDispatch } from 'react-redux';
import {dateCustomStatus} from "../../reducers/billEditItemSlice"
const Ledgers = (props) => {
    const loginData = JSON.parse(localStorage.getItem("loginResponse"));
    const dispatch = useDispatch();
    const clickId = loginData.caId;
    const [allData, setAllData] = useState([]);
    const [ledgers, setLedgers] = useState(allData);
    const [outStAmt, setOutStAmt] = useState([]);
    const [partyId, setPartyId] = useState(0);
    const [summary, setSummary] = useState([]);
    const ledgerType = props.type;
    const [ledgerSummary, setLedgerSummary] = useState([]);
    const [detailedLedger, setdetailedLedger] = useState([]);
    const [allCustom, setAllCustom] = useState('all')
    const [ledgerTabs, setLedgerTabs] = useState('ledgersummary')
    const [summaryByDate, setSummaryByDate] = useState([]);
    const [detailedByDate, setdetailedLedgerByDate] = useState([]);
    const [showDatepickerModal, setShowDatepickerModal] = useState(false);
    const [showDatepickerModal1, setShowDatepickerModal1] = useState(false);
    const [cardDetails, setcardDetails] = useState([]);
    const [cardDetailed, setcardDetailed] = useState([]);
    const [ledgerData, setLedgerData] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [isOnline, setOnline] = useState(false);
    const [detailedTotal, setTotalDetailed] = useState([]);
    var date = moment(new Date()).format("YYYY-MM-DD");
    const [startDate, setStartDate] = useState(date);
    const [endDate,setEndDate] = useState(date);
    var defaultDate = moment(new Date()).format("DD-MMM-YYYY")
    const [dateDisplay, setDateDisplay] = useState(false);
    var [dateValue, setDateValue] = useState(defaultDate + ' to ' + defaultDate);
    const [handleDate, sethandleDate] = useState(false);
    const [paidRcvd, setPaidRcvd] = useState(0);
    const tabs = [
        {
            id: 1,
            name: "All",
            to: "all",
        },
        {
            id: 2,
            name: "Custom",
            to: "custom",
        },
    ]

    const links = [
        {
            id: 1,
            name: "Ledger Summary",
            to: "ledgersummary",
        },
        {
            id: 2,
            name: "Detailed Ledger",
            to: "detailedledger",
        },
    ]

    const onclickDate = () => {
        setShowDatepickerModal1(true);
        setShowDatepickerModal(true);
    };
    const handleSearch = (event) => {
        let value = event.target.value.toLowerCase();
        let result = [];
        result = allData.filter((data) => {
            if (data.mobile.includes(value)) {
                return data.mobile.search(value) != -1;
            } else if (data.partyName.toLowerCase().includes(value)) {
                return data.partyName.toLowerCase().search(value) != -1;
            } else if (data.partyId.toString().includes(value)) {
                return data.partyId.toString().search(value) != -1;
            }
        });
        setLedgers(result);
        console.log(ledgers, allData, partyId, "search")
    };

    useEffect(() => {
        fetchLedgers();
        allCustomEvent('all');
        // moment(new Date()).format("DD-MMM-YYYY")//
        setDateValue(defaultDate + ' to ' + defaultDate);
    }, [])

    //Fetch ledgers using clickId and type
    const fetchLedgers = () => {
        getLedgers(clickId, ledgerType).then((res) => {
            if (res.data.status.type === "SUCCESS") {
                setLedgers(res.data.data.ledgers);
                setAllData(res.data.data.ledgers);
                setOutStAmt(res.data.data);
                setPartyId(res.data.data.ledgers[0].partyId);
                summaryData(clickId, res.data.data.ledgers[0].partyId)
                getOutstandingPaybles(clickId, res.data.data.ledgers[0].partyId)
                setLedgerData(res.data.data.ledgers[0]);
                if (ledgerType == 'BUYER') {
                    geyDetailedLedger(clickId, res.data.data.ledgers[0].partyId);
                } else {
                    sellerDetailed(clickId, res.data.data.ledgers[0].partyId)
                }
            } else {
                setLedgers([]);

            }
            setLoading(false);
        }).catch(error => {
            console.log(error);
            setOnline(true);
        })
    }

    //Get Outstanding balance
    const getOutstandingPaybles = (clickId, partyId) => {
        getOutstandingBal(clickId, partyId).then((response) => {
          setPaidRcvd(response.data.data);
        });
      };
    //Get Particular ledger data
    const particularLedgerData = (ledgerId, item) => {
        setPartyId(ledgerId);
        setLedgerData(item);
        getOutstandingPaybles(clickId,ledgerId);
        if(allCustom =='custom'){
            setDateDisplay(false);
        }
        console.log(item, item,ledgerTabs,allCustom);
        var tabs = '';
        if (ledgerTabs == 'detailedledger' || ledgerTabs == 'ledgersummary' && allCustom =='custom') {
            setLedgerTabs('ledgersummary');
            setAllCustom('all')
            tabs = 'ledgersummary';
        }
        if (allCustom == 'all' || allCustom == 'custom' && ledgerTabs == 'ledgersummary') {
            summaryData(clickId, ledgerId);
        }
        if (allCustom == 'custom' && tabs == 'ledgersummary' || ledgerTabs == 'ledgersummary') {
            ledgerSummaryByDate(clickId, ledgerId, date, date);
        }
        setDateValue(defaultDate + ' to ' + defaultDate);
    }

    //Get Outstanding balances, Total Business
    const summaryData = (clickId, partyId) => {
        getLedgerSummary(clickId, partyId).then((res) => {
            if (res.data.status.type === "SUCCESS") {
                setSummary(res.data.data);
                setLedgerSummary(res.data.data.ledgerSummary);
            }
            else {
                setSummary([]);
            }
        }).catch(error => console.log(error));
    }

    //Get Detailed Ledger
    const geyDetailedLedger = (clickId, partyId) => {
        getBuyerDetailedLedger(clickId, partyId)
            .then(res => {
                if (res.data.status.type === "SUCCESS") {
                    setdetailedLedger(res.data.data.details);
                    setTotalDetailed(res.data.data);
                } else {
                    setdetailedLedger([])
                }
            }).catch(error => console.log(error));
    }

    //Get Seller Detailed Ledger
    const sellerDetailed = (clickId, partyId) => {
        getSellerDetailedLedger(clickId, partyId).then(res => {
            if (res.data.status.type === "SUCCESS") {
                setdetailedLedger(res.data.data.details);
                setTotalDetailed(res.data.data);
            } else {
                setdetailedLedger([])
            }
        }).catch(error => console.log(error));
    }

    //All and Custom Tabs
    const allCustomEvent = (type) => {
        console.log(startDate,endDate,"Dates")
        if (type == 'custom') {
            setDateDisplay(true);
        } else {
            setDateDisplay(false);
        }
        if(handleDate){
            setDateValue(defaultDate + ' to ' + defaultDate);
            setStartDate(date);
            setEndDate(date);
        }
        if (type == 'custom' && ledgerTabs == 'detailedledger') {
            setLedgerTabs('ledgersummary');
        } else if (type == 'all' && ledgerTabs == 'detailedledger') {
            setLedgerTabs('ledgersummary');
        }
        if (type == 'custom' && ledgerTabs == 'ledgersummary') {
            console.log(startDate,endDate);
            ledgerSummaryByDate(clickId, partyId, startDate, endDate);
        }
        setAllCustom(type);
    }
    const [dateCustom, setdateCustom] = useState(false);
    //ledger and detailed ledger tabs
    const ledgerTabEvent = (ledgerTabType) => {
        if (allCustom == 'all' && ledgerTabType == 'detailedledger') {
            if (ledgerType == 'BUYER') {
                geyDetailedLedger(clickId, partyId);
            } else {
                sellerDetailed(clickId, partyId)
            }

        }
        if (allCustom == 'custom' && ledgerTabType == 'ledgersummary') {
            setDateValue(defaultDate + ' to ' + defaultDate);
            ledgerSummaryByDate(clickId, partyId, date, date);
            sethandleDate(true);
            dispatch(dateCustomStatus(true));
        }
        if (allCustom == 'custom' && ledgerTabType == 'detailedledger') {
            if (ledgerType == 'BUYER') {
                setDateValue(defaultDate + ' to ' + defaultDate);
                sethandleDate(true);
                detailedLedgerByDate(clickId, partyId, date, date);
                dispatch(dateCustomStatus(true));
                setdateCustom(true);
            } else {
                setDateValue(defaultDate + ' to ' + defaultDate);
                sellerDetailedByDate(clickId, partyId, date, date);
                setdateCustom(true);
                dispatch(dateCustomStatus(true));
            }

        }
        setLedgerTabs(ledgerTabType);
    }

    //ledger summary by date
    const ledgerSummaryByDate = (clickId, partyId, fromDate, toDate) => {
        getLedgerSummaryByDate(clickId, partyId, fromDate, toDate)
            .then((res) => {
                if (res.data.data !== null) {
                    setSummaryByDate(res.data.data.ledgerSummary);
                    setcardDetails(res.data.data);
                } else {
                    setSummaryByDate([]);
                    setcardDetails([])
                }

            }).catch(error => console.log(error));
    }

    //Buyer Detailed Ledger By Date
    const detailedLedgerByDate = (clickId, partyId, fromDate, toDate) => {
        getDetailedLedgerByDate(clickId, partyId, fromDate, toDate)
            .then((res) => {
                if (res.data.data !== null) {
                    setdetailedLedgerByDate(res.data.data.details);
                    setcardDetailed(res.data.data);
                } else {
                    setdetailedLedgerByDate([]);
                    setcardDetailed([]);
                }

            }).catch(error => console.log(error));
    }

    //Seller Detailed ledger By Date
    const sellerDetailedByDate = (clickId, partyId, fromDate, toDate) => {
        getSellerDetailedLedgerByDate(clickId, partyId, fromDate, toDate).then((res) => {
            if (res.data.data !== null) {
                setdetailedLedgerByDate(res.data.data.details);
                setcardDetailed(res.data.data);
            } else {
                setdetailedLedgerByDate([]);
                setcardDetailed([]);
            }

        }).catch(error => console.log(error));
    }
    //Date Selection
    const callbackFunction = (startDate, endDate, dateTab) => {
        var fromDate = moment(startDate).format("YYYY-MM-DD");
        var toDate = moment(endDate).format("YYYY-MM-DD");
        dateValue = fromDate;
        if (dateTab === "Daily") {
            setDateValue(moment(fromDate).format("DD-MMM-YYYY"));
        } else if (dateTab === "Weekly") {
            setDateValue(
                moment(fromDate).format("DD-MMM-YYYY") +
                " to " +
                moment(toDate).format("DD-MMM-YYYY")
            );
        } else if (dateTab === "Monthly") {
            setDateValue(moment(fromDate).format("MMM-YYYY"));
        } else if (dateTab === "Yearly") {
            setDateValue(moment(fromDate).format("YYYY"));
        } else {
            setDateValue(
                moment(fromDate).format("DD-MMM-YYYY") +
                " to " +
                moment(toDate).format("DD-MMM-YYYY")
            );
        }
        if (allCustom == 'custom' && ledgerTabs == 'ledgersummary') {
            var fromDate = moment(startDate).format("YYYY-MM-DD");
            var toDate = moment(endDate).format("YYYY-MM-DD");
            date=fromDate
            setStartDate(fromDate);
            setEndDate(toDate)
            ledgerSummaryByDate(clickId, partyId, fromDate, toDate);
        } else {
            var fromDate = moment(startDate).format("YYYY-MM-DD");
            var toDate = moment(endDate).format("YYYY-MM-DD");
            if (ledgerType == 'BUYER') {
                setStartDate(date);
                setEndDate(date)
                sethandleDate(true);
                detailedLedgerByDate(clickId, partyId, fromDate, toDate);
            } else {
                setStartDate(date);
                setEndDate(date)
                sethandleDate(true);
                sellerDetailedByDate(clickId, partyId, fromDate, toDate)
 

            }

        }
    };
    return (

        <div className="main_div_padding">

            {isOnline ? <NoInternetConnection /> :
                <div>
                    {isLoading ? (
                        <div className="">
                            <img src={loading} alt="my-gif" className="gif_img" />
                        </div>
                    ) : (
                        <div>
                            {allData.length > 0 ? (
                                <div className="row">
                                    <div className="col-lg-4 p-0">
                                        <div id="search-field">
                                            <SearchField
                                                placeholder="Search by Name / Short Code"
                                                onChange={(event) => {
                                                    handleSearch(event);
                                                }}
                                            />
                                        </div>
                                        {ledgers.length > 0 ? (
                                            <div>
                                                <div
                                                    className="table-scroll ledger-table"
                                                    id="scroll_style"
                                                >
                                                    <table className="table table-fixed">
                                                        <thead className="theadr-tag">
                                                            <tr>
                                                                <th scope="col">#</th>
                                                                <th scope="col">Date</th>
                                                                {ledgerType == "BUYER" ? <th scope="col">Buyer Name</th> :
                                                                    <th scope="col">Seller Name</th>
                                                                }
                                                                {ledgerType == "BUYER" ? <th scope="col">To Be Recieved(&#8377;)</th> :
                                                                    <th scope="col">To Be Paid(&#8377;)</th>
                                                                }
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {ledgers.map((item, index) => {
                                                                return (
                                                                    <Fragment>
                                                                        <tr onClick={() => particularLedgerData(item.partyId, item)}
                                                                            className={
                                                                                partyId == item.partyId
                                                                                    ? "tabRowSelected"
                                                                                    : "tr-tags"
                                                                            }>
                                                                            <td scope="row">{index + 1}</td>
                                                                            <td key={item.date}>
                                                                                {moment(item.date).format("DD-MMM-YY")}
                                                                            </td>
                                                                            <td key={item.partyName}>
                                                                                <div className="d-flex">
                                                                                    <div className="c-img">
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
                                                                                            {!item.trader ? ledgerType == "BUYER" ? "Buyer" : 'Seller'
                                                                                                : "Trader"} -{" "}
                                                                                            {item.partyId}&nbsp;
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
                                                                            </td>
                                                                            <td key={item.tobePaidRcvd}>
                                                                                <p className={ledgerType == "BUYER" ? "coloring" : 'paid-coloring'}>
                                                                                    {item.tobePaidRcvd
                                                                                        ? getCurrencyNumberWithOutSymbol(
                                                                                            item.tobePaidRcvd
                                                                                        )
                                                                                        : 0}
                                                                                </p>
                                                                            </td>
                                                                        </tr>
                                                                    </Fragment>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="outstanding-pay d-flex align-items-center justify-content-between">
                                                    {ledgerType == "BUYER" ?
                                                        <p className="pat-tag">Outstanding Recievables:</p>
                                                        : <p className="pat-tag">Outstanding Paybles:</p>
                                                    }
                                                    <p className={ledgerType == "BUYER" ? "values-tag" : 'paid-coloring'}>
                                                        {outStAmt?.totalOutStgAmt
                                                            ? getCurrencyNumberWithSymbol(outStAmt?.totalOutStgAmt)
                                                            : 0}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="table-scroll nodata_scroll">
                                                <div className="row partner_no_data_widget_rows">
                                                    <div className="col-lg-5">
                                                        <div className="partner_no_data_widget">
                                                            <div className="text-center">
                                                                <img
                                                                    src={no_data_icon}
                                                                    alt="icon"
                                                                    className="d-flex mx-auto justify-content-center"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-lg-8">
                                    {/* <RecordPayment 
                                    LedgerData={ledgerData}
                                    ledgerId ={partyId}
                                    outStbal = {paidRcvd} /> */}
                                        <div className='d-flex'>
                                            <ul className="nav nav-tabs partner_tabs ledger_all_custom mb-0" id="myTab" role="tablist">
                                                {tabs.map((tab) => {
                                                    return (
                                                        <li key={tab.id} className="nav-item ">
                                                            <a
                                                                className={
                                                                    "nav-link" + (allCustom == tab.to ? " active" : "")
                                                                }
                                                                href={"#" + tab.name}
                                                                role="tab"
                                                                aria-controls="home"
                                                                data-bs-toggle="tab"
                                                                onClick={() => allCustomEvent(tab.to)}
                                                            >
                                                                {tab.name}
                                                            </a>
                                                        </li>
                                                    );
                                                })}
                                            </ul>

                                        </div>
                                        <p className={dateDisplay ? '' : 'padding_all'}></p>
                                        <div className='my-2'>
                                            <div
                                                style={{ display: dateDisplay ? "flex" : "none" }}
                                                className="dateRangePicker justify-content-center"
                                            >
                                                <div onClick={onclickDate} className="color_blue">
                                                    <div className="date_icon m-0">
                                                        <img
                                                            src={date_icon}
                                                            alt="icon"
                                                            className="mr-2 date_icon_in_custom"
                                                        />
                                                        {dateValue}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card details-tag">
                                            <div className="card-body" id="card-details">
                                                <div className="row">
                                                    <div className="col-lg-3" id="verticalLines">
                                                        <div
                                                            className="profilers-details"
                                                            key={ledgerData.partyId}
                                                        >
                                                            <div className="d-flex">
                                                                <div>
                                                                    {ledgerData.profilePic ? (
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
                                                                <div id="ptr-dtls">
                                                                    <p className="namedtl-tag">
                                                                        {ledgerData.partyName}
                                                                    </p>
                                                                    <p className="mobilee-tag">
                                                                        {!ledgerData.trader ? props.type == "BUYER" ? "Buyer" : 'Sellre' : "Trader"}{" "}
                                                                        - {ledgerData.partyId}&nbsp;
                                                                    </p>
                                                                    <p className="mobilee-tag">
                                                                        {ledgerData.mobile}
                                                                    </p>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3 d-flex align-items-center" id="verticalLines">
                                                        <p className="card-text paid">
                                                            Total Business
                                                            <p className="coloring">
                                                                {allCustom == 'custom' && ledgerTabs == 'ledgersummary' ? cardDetails.totalTobePaidRcvd ?
                                                                    cardDetails.totalTobePaidRcvd ? getCurrencyNumberWithSymbol(
                                                                        cardDetails.totalTobePaidRcvd
                                                                    )
                                                                        : 0 : 0 :
                                                                allCustom == 'custom' && ledgerType == 'BUYER' && ledgerTabs == 'detailedledger' ?
                                                                cardDetailed.totalToBeRecived ?
                                                                    cardDetailed.totalToBeRecived ? getCurrencyNumberWithSymbol(
                                                                        cardDetailed.totalToBeRecived
                                                                )
                                                                : 0 : 0 :
                                                                allCustom == 'custom' && ledgerType == 'SELLER' &&
                                                                ledgerTabs == 'detailedledger' ?
                                                                cardDetailed.totalToBePaid ?
                                                                    cardDetailed.totalToBePaid ? getCurrencyNumberWithSymbol(
                                                                cardDetailed.totalToBePaid
                                                                )
                                                                : 0 : 0 :
                                                                allCustom == 'all' && ledgerType == 'BUYER' && ledgerTabs =='detailedledger'?
                                                                detailedTotal.totalToBeRecived ?
                                                                detailedTotal.totalToBeRecived ? getCurrencyNumberWithSymbol(
                                                                    detailedTotal.totalToBeRecived
                                                                )
                                                                : 0 : 0 :
                                                                allCustom == 'all' && ledgerType == 'SELLER' && ledgerTabs =='detailedledger'?
                                                                detailedTotal.totalToBePaid ?
                                                                detailedTotal.totalToBePaid ? getCurrencyNumberWithSymbol(
                                                                    detailedTotal.totalToBePaid
                                                                )
                                                                : 0 : 0 :
                                                                summary.totalTobePaidRcvd
                                                                    ? getCurrencyNumberWithSymbol(
                                                                        summary.totalTobePaidRcvd
                                                                )
                                                                : 0

                                                                }
                                                            </p>

                                                        </p>
                                                    </div>
                                                    <div className="col-lg-3 d-flex align-items-center" id="verticalLines">
                                                       <div>
                                                       {ledgerType == 'BUYER'?<p className="total-paid">
                                                            Total Recieved</p> :
                                                            <p className="total-paid">
                                                            Total Paid</p>
                                                            }
                                                            <p className="coloring">
                                                                {allCustom == 'custom' && ledgerTabs == 'ledgersummary' ? cardDetails.totalRcvdPaid ?
                                                                    cardDetails.totalRcvdPaid ? getCurrencyNumberWithSymbol(
                                                                        cardDetails.totalRcvdPaid
                                                                    )
                                                                        : 0 : 0 :
                                                                allCustom == 'custom' && ledgerType == 'BUYER' && ledgerTabs == 'detailedledger' ?
                                                                cardDetailed.totalRecieved ? cardDetailed.totalRecieved ?
                                                                    getCurrencyNumberWithSymbol(
                                                                                cardDetailed.totalRecieved
                                                                )
                                                                : 0 : 0 :
                                                                allCustom == 'custom' && ledgerType == 'SELLER' && ledgerTabs == 'detailedledger' ?
                                                                cardDetailed.totalPaid ? cardDetailed.totalPaid ?
                                                                getCurrencyNumberWithSymbol(
                                                                   cardDetailed.totalPaid
                                                                )
                                                                : 0 : 0 :
                                                                allCustom == 'all' && ledgerType == 'BUYER' && ledgerTabs =='detailedledger'?
                                                                detailedTotal.totalRecieved?detailedTotal.totalRecieved?
                                                                getCurrencyNumberWithSymbol(
                                                                    detailedTotal.totalRecieved
                                                                 )
                                                                 : 0 : 0 :
                                                                 allCustom == 'all' && ledgerType == 'SELLER' && ledgerTabs =='detailedledger'?
                                                                detailedTotal.totalPaid?detailedTotal.totalPaid?
                                                                getCurrencyNumberWithSymbol(
                                                                    detailedTotal.totalPaid
                                                                 )
                                                                 : 0 : 0 :
                                                                summary.totalRcvdPaid
                                                                    ? getCurrencyNumberWithSymbol(
                                                                            summary.totalRcvdPaid
                                                                    )
                                                                : 0}
                                                            </p>
                                                        
                                                           </div>
                                                    </div>
                                                    <div className="col-lg-3 d-flex align-items-center">
                                                       <div>
                                                       {ledgerType == 'BUYER'?
                                                            <p className="out-standing">
                                                            Outstanding Recievables</p>
                                                            :<p className="out-standing">Outstanding Payables</p>
                                                            }
                                                            <p className="coloring">
                                                                {allCustom == 'custom' && ledgerTabs == 'ledgersummary' ? cardDetails.outStdRcvPayble ?
                                                                    cardDetails?.outStdRcvPayble ? getCurrencyNumberWithSymbol(
                                                                        cardDetails.outStdRcvPayble
                                                                    )
                                                                        : 0 : 0 :
                                                                    allCustom == 'custom' && ledgerTabs == 'detailedledger' ?
                                                                        cardDetailed.totalOutStandingBalance ? cardDetailed?.totalOutStandingBalance
                                                                            ? getCurrencyNumberWithSymbol(
                                                                                cardDetailed.totalOutStandingBalance
                                                                            )
                                                                            : 0 : 0:
                                                                    allCustom == 'all' && ledgerTabs == 'detailedledger' ?
                                                                    detailedTotal.totalOutStandingBalance ? detailedTotal?.totalOutStandingBalance
                                                                        ? getCurrencyNumberWithSymbol(
                                                                            detailedTotal.totalOutStandingBalance
                                                                        )
                                                                    : 0 : 0
                                                                : summary.outStdRcvPayble
                                                                    ? getCurrencyNumberWithSymbol(
                                                                    summary.outStdRcvPayble
                                                                    )
                                                                : 0
                                                                }
                                                            </p>
                                                           </div>

                                                        {/* </p> */}
                                                    </div>
                                                </div>
                                                <span id="horizontal-line"></span>
                                                <ul className="nav nav-tabs ledger_tabs" id="myTab" role="tablist">
                                                    {links.map((link) => {
                                                        return (
                                                            <li key={link.id} className="nav-item ">
                                                                <a
                                                                    className={
                                                                        "nav-link" + (ledgerTabs == link.to ? " active" : "")
                                                                    }
                                                                    href={"#" + link.to}
                                                                    role="tab"
                                                                    aria-controls="home"
                                                                    data-bs-toggle="tab"
                                                                    onClick={() => ledgerTabEvent(link.to)}
                                                                >
                                                                    {link.name}
                                                                </a>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                        <div>
                                            {(allCustom == 'all' && ledgerTabs == 'ledgersummary') ?
                                                <LedgerSummary
                                                    ledgerTab={ledgerTabs}
                                                    allCustomTab={allCustom}
                                                    LedgerSummary={ledgerSummary}
                                                    partyType={props.type}
                                                    dateDisplay={dateDisplay}
                                                />
                                                : ''
                                            }
                                            {(allCustom == 'all' && ledgerTabs == 'detailedledger') ?
                                                <DetailedLedger
                                                    detailedLedger={detailedLedger}
                                                    ledgerTab={ledgerTabs}
                                                    allCustomTab={allCustom}
                                                    partyType={props.type}
                                                    dateDisplay={dateDisplay}
                                                />
                                                : ''
                                            }
                                            {allCustom == 'custom' && ledgerTabs == 'ledgersummary' ?
                                                <LedgerSummary
                                                    LedgerSummaryByDate={summaryByDate}
                                                    ledgerTab={ledgerTabs}
                                                    allCustomTab={allCustom}
                                                    partyType={props.type}
                                                />
                                                : ''
                                            }
                                            {(allCustom == 'custom' && ledgerTabs == 'detailedledger') ?
                                                <DetailedLedger
                                                    DetailedLedgerByDate={detailedByDate}
                                                    ledgerTab={ledgerTabs}
                                                    allCustomTab={allCustom}
                                                    partyType={props.type}
                                                />
                                                : ''
                                            }
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="row partner_no_data_widget_rows">
                                    <div className="col-lg-5">
                                        <div className="partner_no_data_widget">
                                            <div className="text-center">
                                                <img
                                                    src={no_data_icon}
                                                    alt="icon"
                                                    className="d-flex mx-auto justify-content-center"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>)}
                    {showDatepickerModal1 ? (
                        <DatePickerModel
                            show={showDatepickerModal}
                            close={() => setShowDatepickerModal(false)}
                            parentCallback={callbackFunction}
                            ledgerTabs = {ledgerTabs}
                            dateCustom={dateCustom}
                        />
                    ) : (
                        <p></p>
                    )}
                </div>
            }
        </div>
    )
}

export default Ledgers