import React from 'react'
import "../../modules/ledgers/buyerLedger.scss";
import moment from "moment";
import single_bill from "../../assets/images/bills/single_bill.svg";
import {
    getCurrencyNumberWithOutSymbol,
    getCurrencyNumberWithSymbol,
    getCurrencyNumberWithOneDigit,
} from "../../components/getCurrencyNumber"
import NoDataAvailable from '../../components/noDataAvailable';
const DetailedLedger = (props) => {
    const details = props.detailedLedger;
    const detailsByDate = props.DetailedLedgerByDate;
    const allCustom = props.allCustomTab;
    const ledgerTabs = props.ledgerTab;
    console.log(details, detailsByDate, "details");
    const ledgerType = props.partyType;
    return (
        <div>
            {allCustom == 'all' && ledgerTabs == 'detailedledger' ? (
                <div className="detailedLedger" id="scroll_style">
                    {details.length > 0 ? (
                        <table
                            className="table table-bordered"
                            id="ledger-sum"
                        >
                            <thead className="thead-tag">
                                <tr>
                                    <th className="col-1" id="sno">
                                        #
                                    </th>
                                    <th className="col-2">Ref ID | Date</th>
                                    <th className="col-3">
                                        <p>Item</p>
                                        <p> Unit | Kgs | Rate</p>
                                    </th>
                                    {ledgerType == 'BUYER'?<th className="col-3">Received(&#8377;)</th>:
                                    <th className="col-3">Paid(&#8377;)</th>}
                                    {ledgerType == 'BUYER'?<th className="col-3">To Be Received(&#8377;)</th>:
                                    <th className="col-3">To Be Paid(&#8377;)</th>}
                                    <th className="col-2">Ledger Balance(&#8377;)</th>
                                </tr>
                            </thead>
                            <tbody>

                                {details.map((item, index) => {
                                    return (
                                        <tr className="tr-tags" key={item.partyId}>
                                            <td className="col-1" id="p-common-sno">
                                                {index + 1}
                                            </td>
                                            <td className="col-2">
                                                <p style={{ color: "#0066FF" }}>
                                                    {item.refId}
                                                </p>
                                                <p>
                                                    {moment(item.date).format("DD-MMM-YY")}
                                                </p>
                                            </td>
                                            <td className="col-3">
                                                <p style={{ fontSize: "12px" }}>
                                                    {item.itemName}
                                                </p>
                                                <span style={{ fontSize: "13px" }}>
                                                    {item.qty
                                                        ? getCurrencyNumberWithOneDigit(
                                                            item.qty
                                                        )
                                                        : ""}{" "}
                                                    {item.unit !== null
                                                        ? item.unit
                                                            .charAt(item)
                                                            .toUpperCase() + " | "
                                                        : ""}{" "}
                                                    {item.kg
                                                        ? getCurrencyNumberWithOneDigit(
                                                            item.kg
                                                        ) + " | "
                                                        : ""}{" "}
                                                    {item.rate
                                                        ? getCurrencyNumberWithOutSymbol(
                                                            item.rate
                                                        )
                                                        : ""}
                                                </span>
                                            </td>
                                            <td className="col-2">
                                                <p id="p-common">
                                                    {ledgerType == 'BUYER'?item.recieved
                                                        ? item.recieved.toFixed(2):''
                                                        : item.paid?item.paid:''
                                                    }
                                                </p>
                                            </td>
                                            <td className="col-2">
                                                <p id="p-common">
                                                    {ledgerType == 'BUYER'?item.toBeRecieved
                                                        ? item.toBeRecieved.toFixed(2):''
                                                        : item.toBePaid?item.toBePaid:''
                                                    }
                                                </p>
                                            </td>
                                            <td className="col-2">
                                                <p className="coloring" id="p-common">
                                                    {item.balance
                                                        ? getCurrencyNumberWithOutSymbol(
                                                            item.balance
                                                        )
                                                        : ""}
                                                </p>
                                            </td>
                                        </tr>
                                    );
                                })
                                }
                            </tbody>
                        </table>
                    ) : (
                        <NoDataAvailable />
                    )}
                </div>
            ) : (
                <div className="detailedLedger" id="scroll_style">
                    {detailsByDate.length > 0 ? (
                        <table className="table table-bordered">
                            <thead className="thead-tag">
                                <tr>
                                    <th className="col-1" id="sno">
                                        #
                                    </th>
                                    <th className="col-2">Ref ID | Date</th>
                                    <th className="col-3">
                                        <p>Item</p>
                                        <p> Unit | Kgs | Rate</p>
                                    </th>
                                    {ledgerType == 'BUYER'?<th className="col-3">Received(&#8377;)</th>:
                                    <th className="col-3">Paid(&#8377;)</th>}
                                    {ledgerType == 'BUYER'?<th className="col-3">To Be Received(&#8377;)</th>:
                                    <th className="col-3">To Be Paid(&#8377;)</th>}
                                    <th className="col-2">
                                        Ledger Balance(&#8377;)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailsByDate.map((item, index) => {
                                    return (
                                        <tr className="tr-tags" key={item.partyId}>
                                            <td className="col-1" id="p-common-sno">
                                                {index + 1}
                                            </td>
                                            <td className="col-2">
                                                <p style={{ color: "#0066FF" }}>
                                                    {item.refId ? item.refId : ""}
                                                </p>{" "}
                                                {moment(item.date).format("DD-MMM-YY")}
                                            </td>
                                            <td className="col-3">
                                                <p style={{ fontSize: "12px" }}>
                                                    {item.itemName}
                                                </p>
                                                <span style={{ fontSize: "13px" }}>
                                                    {item.qty ? item.qty.toFixed(1) : ""}{" "}
                                                    {item.unit
                                                        ? item.unit
                                                            .charAt(item)
                                                            .toUpperCase() + " | "
                                                        : ""}
                                                    {item.kg ? item.kg + " | " : ""}
                                                    {item.rate ? item.rate : ""}
                                                </span>
                                            </td>
                                            <td className="col-3">
                                                <p id="p-common">
                                                    {ledgerType == 'BUYER'?item.recieved
                                                        ? item.recieved.toFixed(2):''
                                                        : item.paid?item.paid:''}
                                                </p>
                                            </td>
                                            <td className="col-3">
                                                <p id="p-common">
                                                    {ledgerType == 'BUYER'?item.toBeRecieved
                                                        ? item.toBeRecieved.toFixed(2):''
                                                        : item.toBePaid?item.toBePaid:''}
                                                </p>
                                            </td>
                                            <td className="col-3">
                                                <p className="coloring" id="p-common">
                                                    {item.balance
                                                        ? item.balance.toFixed(2)
                                                        : ""}
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
            )}
        </div>
    )
}

export default DetailedLedger