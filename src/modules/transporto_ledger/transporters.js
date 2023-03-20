import React, { Fragment, useEffect, useState } from 'react'
import { getInventory, getInventoryLedgers, getParticularTransporter, getTransporters } from '../../actions/transporterService';
import SearchField from '../../components/searchField';
import single_bill from "../../assets/images/bills/single_bill.svg";
import {
    getCurrencyNumberWithOutSymbol,
    getCurrencyNumberWithSymbol,
    getMaskedMobileNumber,
} from "../../components/getCurrencyNumber";
import no_data_icon from "../../assets/images/NodataAvailable.svg";
import moment from "moment";
import PaymentLedger from './paymentLedger';
import InventoryLedger from './inventoryLedger';
import RecordPayment from '../ledgers/recordPayment';
import { getOutstandingBal } from '../../actions/ledgersService';
import AddRecordInventory from './addRecordInventory';
const Transporters = () => {
    const loginData = JSON.parse(localStorage.getItem("loginResponse"));
    const clickId = loginData.caId;
    const langData = localStorage.getItem("languageData");
    const langFullData = JSON.parse(langData);
    const [allData, setallData] = useState([]);
    const [transporter, setTransporter] = useState(allData);
    const [transporterId, setTransporterId] = useState(0);
    const [outStAmt, setOutStAmt] = useState();
    const [transData, setTransData] = useState({});
    const [tabs, setTabs] = useState("paymentledger");
    const [ledgerSummary, setLedgerSummary] = useState([]);
    const [payLedger, setPayLedger] = useState({});
    const [invLedger, setInvLedger] = useState({});
    const [invDetails, setInvDetails] = useState([]);
    const [paidRcvd, setPaidRcvd] = useState(0);
    const [getInventor, setGetInventory] = useState([]);
    useEffect(() => {
        getTransportersData();
    }, []);

    const getTransportersData = () => {
        getTransporters(clickId).then((response) => {
            setOutStAmt(response.data.data)
            setTransporterId(response.data.data.ledgers[0].partyId)
            setTransData(response.data.data.ledgers[0])
            setallData(response.data.data.ledgers);
            setTransporter(response.data.data.ledgers);
            getOutstandingPaybles(clickId, response.data.data.ledgers[0].partyId);
            paymentLedger(clickId, response.data.data.ledgers[0].partyId);
            inventoryLedger(clickId, response.data.data.ledgers[0].partyId);
            getInventoryRecord(clickId, response.data.data.ledgers[0].partyId)
        });
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
            } else if (data.partyAddress.toLowerCase().includes(value)) {
                return data.partyAddress.toLowerCase().search(value) != -1;
            } else if (data.shortName.toLowerCase().includes(value)) {
                return data.shortName.toLowerCase().search(value) != -1;
            }
        });
        setTransporter(result);
    };
    const links = [
        {
            id: 1,
            name: "Payment Ledger",
            to: "paymentledger",
        },
        {
            id: 2,
            name: "Inventory Ledger",
            to: "inventoryledger",
        },
    ];
    const particularTransporter = (transporterId, item) => {
        setTransporterId(transporterId);
        setTransData(item);
        getOutstandingPaybles(clickId, transporterId);
        getInventoryRecord(clickId, transporterId)
        console.log(tabs);
        var transTabs = ""
        if (tabs == 'inventoryledger') {
            setTabs('paymentledger');
            transTabs = "paymentledger"
        }
        if (tabs == 'paymentledger' || transTabs == "paymentledger") {
            paymentLedger(clickId, transporterId);
        }

    }
    const tabEvent = (type) => {
        if (type == 'inventoryledger') {
            inventoryLedger(clickId, transporterId);
        }
        if (type == 'paymentledger') {
            paymentLedger(clickId, transporterId);
        }
        setTabs(type);
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
                console.log(error)
            });
    };
    // get Inventory Ledger
    const inventoryLedger = (clickId, transId) => {
        getInventoryLedgers(clickId, transId)
            .then((response) => {
                setInvLedger(response.data.data);
                setInvDetails(response.data.data.details);
                console.log(invLedger, "Inv Ledger");
            })
            .catch((error) => {
                console.log(error)
            });
    };
    //Get Outstanding balance
    const getOutstandingPaybles = (clickId, partyId) => {
        getOutstandingBal(clickId, partyId).then((response) => {
            setPaidRcvd(response.data.data);
        });
    };

    //get Inventory
    const getInventoryRecord = (clickId, transId) => {
        getInventory(clickId, transId)
            .then((response) => {
                console.log(response.data.data);
                setGetInventory(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getCropUnit = (unit, qty) => {
        var unitType = "";
        console.log(unit);
        switch (unit.toUpperCase()) {
            case "CRATES":
                unitType = "C";
                break;
            case "BOXES":
                unitType = "BX";
                break;
            case "BAGS":
                unitType = "Bg";
                break;
            case "SACS":
                unitType = "S";
                break;
            case "LOADS":
                unitType = "L";
                break;
            case "PIECES":
                unitType = "P";
                break;
        }
        console.log(unitType);
        return qty?unitType + " | ":'';
    };

    const getPaidRcvd = (rcvd) => {
        setPaidRcvd(rcvd)
    }
    const getOutstAmt = (data) => {
        setOutStAmt(data);
    }

    const getTransData = (data) => {
        setTransporter(data);
    }
    const getPayledgerSummary = (data) => {
        setLedgerSummary(data);
    }
    const payLedgerData = (data) => {
        setPayLedger(data);
    }

    const getInvLedgerData = (data) => {
        setInvLedger(data);
    }

    const getInvLedger = (data) => {
        setInvDetails(data);
    }
    return (
        <div className="main_div_padding">
            {allData.length > 0 ? (
                <div className="row">
                    <div className="col-lg-5 pl-0">
                        <div id="search-field">
                            <SearchField
                                placeholder="Search by Name / Short Code"
                                onChange={(event) => {
                                    handleSearch(event);
                                }}
                            />
                        </div>
                        {transporter.length > 0 ? (
                            <div>
                                <div
                                    className="table-scroll ledger-table"
                                    id="scroll_style"
                                >
                                    <table className="table table-fixed">
                                        <thead className="theadr-tag">
                                            <tr>
                                                <th scope="col-4">#</th>
                                                <th scope="col">Date</th>
                                                <th scope="col">Transporter Name</th>
                                                <th scope="col">To Be Paid(&#8377;)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transporter.map((item, index) => {
                                                return (
                                                    <Fragment>
                                                        <tr
                                                            onClick={() =>
                                                                particularTransporter(item.partyId, item)
                                                            }
                                                            className={
                                                                transporterId == item.partyId
                                                                    ? "tabRowSelected"
                                                                    : "tr-tags"
                                                            }

                                                        >
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
                                                                            {item.partyName} -{" "}
                                                                            {item.shortName}
                                                                        </p>
                                                                        <div className="d-flex align-items-center">
                                                                            <p className="mobilee-tag">
                                                                                {
                                                                                    'Transporter'
                                                                                }{" "}
                                                                                - {item.partyId}&nbsp;
                                                                            </p>
                                                                            <p className="mobilee-tag desk_responsive">
                                                                                {' | ' + getMaskedMobileNumber(
                                                                                    item.mobile
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                        <p className="mobilee-tag mobile_responsive">
                                                                            {getMaskedMobileNumber(
                                                                                item.mobile
                                                                            )}
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
                                                                <p className="coloring">
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

                                    <p className="pat-tag">Outstanding Paybles:</p>
                                    <p className="values-tag">
                                        {outStAmt?.totalOutStgAmt
                                            ? getCurrencyNumberWithSymbol(
                                                outStAmt?.totalOutStgAmt
                                            )
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
                    <div className="col-lg-7 p-0">
                        <div className="card details-tag">
                            <div className="card-body" id="card-details">
                                <div className="row">
                                    <div className="col-lg-3" id="verticalLines">
                                        <div className="profilers-details"
                                            key={transData.partyId}>
                                            <div className="d-flex">
                                                <div>
                                                    {transData.profilePic ? (
                                                        <img
                                                            id="singles-img"
                                                            src={transData.profilePic}
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
                                                        {transData.partyName}
                                                    </p>
                                                    <p className="mobilee-tag">
                                                        {"Transporter"}{" "}
                                                        - {transData.partyId}&nbsp;
                                                    </p>
                                                    <p className="mobilee-tag">
                                                        {getMaskedMobileNumber(transData?.mobile)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {tabs === "paymentledger" && (
                                        <>
                                            <div className="col-lg-3" id="verticalLines">
                                                <p className="card-text paid">
                                                    {langFullData.totalBusiness}{" "}
                                                    <p className="coloring color_black">
                                                        {payLedger.totalToBePaid
                                                            ? getCurrencyNumberWithSymbol(
                                                                payLedger.totalToBePaid
                                                            )
                                                            : 0}
                                                    </p>
                                                </p>
                                            </div>
                                            <div className="col-lg-3" id="verticalLines">
                                                <p className="total-paid">
                                                    {langFullData.totalPaid}
                                                    <p className="coloring color_black">
                                                        {payLedger.totalPaid
                                                            ? getCurrencyNumberWithSymbol(
                                                                payLedger.totalPaid
                                                            )
                                                            : 0}
                                                    </p>{" "}
                                                </p>
                                            </div>
                                            <div className="col-lg-3 d-flex align-items-center">
                                                <p className="out-standing">
                                                    {langFullData.outstandingPayables}
                                                    <p className="coloring color_black">
                                                        {payLedger.totalOutStandingBalance
                                                            ? getCurrencyNumberWithSymbol(
                                                                payLedger.totalOutStandingBalance
                                                            )
                                                            : 0}
                                                    </p>
                                                </p>
                                            </div>
                                        </>
                                    )}
                                    {tabs === "inventoryledger" && (
                                        <>
                                            <div className="col-lg-3" id="verticalLines">
                                                <p className="card-text paid">
                                                    Total Given{" "}
                                                    <p className="coloring color_black">
                                                        {invLedger.totalGiven
                                                            ? invLedger.totalGiven.map((item) => {
                                                                return (
                                                                    item.qty > 0 ? item.qty.toFixed(1) + " " + getCropUnit(item.unit, item.qty)
                                                                        : '');
                                                            })
                                                            : 0}
                                                    </p>
                                                </p>
                                            </div>
                                            <div className="col-lg-3" id="verticalLines">
                                                <p className="total-paid">
                                                    Total Collected
                                                    <p className="coloring color_black">
                                                        {invLedger.totalCollected
                                                            ? invLedger.totalCollected.map((item) => {
                                                                return (
                                                                    item.qty > 0 ? item.qty.toFixed(1) + " " + getCropUnit(item.unit, item.qty)
                                                                        : '');
                                                            })
                                                            : 0}
                                                    </p>{" "}
                                                </p>
                                            </div>
                                            <div className="col-lg-3">
                                                <p className="out-standing">
                                                    Total Balance
                                                    <p className="coloring color_black">
                                                        {invLedger.balance
                                                            ? invLedger.balance.map((item) => {
                                                                return (
                                                                    item.qty ? item.qty.toFixed(1) + " " + getCropUnit(item.unit, item.qty)
                                                                        : '');
                                                            })
                                                            : 0}

                                                    </p>
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <span id="horizontal-line-card"></span>
                            <div className='d-flex justify-content-between'>
                                <ul
                                    className="nav nav-tabs ledger_tabs"
                                    id="myTab"
                                    role="tablist"
                                >
                                    {links.map((link) => {
                                        return (
                                            <li key={link.id} className="nav-item ">
                                                <a
                                                    className={
                                                        "nav-link" +
                                                        (tabs == link.to ? " active" : "")
                                                    }
                                                    href={"#" + link.to}
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
                                {tabs == 'paymentledger' ?
                                    <RecordPayment
                                        tabs={tabs}
                                        LedgerData={transData}
                                        ledgerId={transporterId}
                                        type={'TRANS'}
                                        outStbal={paidRcvd}
                                        setPaidRcvd={getPaidRcvd}
                                        outStAmt={getOutstAmt}
                                        transData={getTransData}
                                        payledger={payLedgerData}
                                        payledgersummary={getPayledgerSummary}
                                    />
                                    : tabs == 'inventoryledger' ?
                                        <AddRecordInventory
                                            tabs={tabs}
                                            LedgerData={transData}
                                            ledgerId={transporterId}
                                            type={'TRANS'}
                                            getInventor={getInventor}
                                            invLedger={getInvLedger}
                                            invLedgerData={getInvLedgerData}
                                        />
                                        : ''}
                            </div>

                        </div>
                        {tabs == 'paymentledger' ?
                            <PaymentLedger
                                paymentledgers={ledgerSummary}
                                tabs={tabs}
                            /> : tabs == 'inventoryledger' ?
                                <InventoryLedger
                                    inventoryledgers={invDetails}
                                    tabs={tabs}
                                /> : ''
                        }


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

        </div>
    )
}

export default Transporters