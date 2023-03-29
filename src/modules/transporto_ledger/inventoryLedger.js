import React from 'react'
import NoDataAvailable from "../../components/noDataAvailable";
import moment from "moment";
const InventoryLedger = (props) => {
    const invDetails = props.inventoryledgers;
    const tabs= props.tabs;
    const langData = localStorage.getItem("languageData");
    const langFullData = JSON.parse(langData);
    return (
        <div className="transporterDetailed" id="scroll_style">
            {tabs == 'inventoryledger'?
            <div
                id="detailed-inventory"
            // className={
            //     toggleState === "inventoryledger"
            //         ? "content  active-content"
            //         : "content"
            // }
            >
                {invDetails.length > 0 ? (
                    <table className="table table-bordered ledger-table">
                        <thead className="thead-tag">
                            <tr>
                                <th className="col-1" id="p-common-sno">
                                    #
                                </th>
                                <th className="col-2">{langFullData.refId}</th>
                                <th className="col-3">
                                    {langFullData.collected}
                                </th>
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
                                            <p>
                                                {moment(item.date).format("DD-MMM-YY")}
                                            </p>
                                        </td>
                                        <td className="col-3">
                                            <p id="p-common">
                                                {item.collected
                                                    ? item.collected.toFixed(1)
                                                    : ""}
                                                &nbsp;
                                                {item.collected
                                                    ? item.unit === "BAGS"
                                                        ? item.unit
                                                            .charAt(item)
                                                            .toUpperCase() +
                                                        item.unit.slice(2, 3).toLowerCase()
                                                        : item.unit === "BOXES"
                                                            ? item.unit
                                                                .charAt(item)
                                                                .toUpperCase() +
                                                            item.unit.slice(2, 3).toLowerCase()
                                                            : item.unit === "CRATES" || "SACS"
                                                                ? item.unit.charAt(item).toUpperCase()
                                                                : ""
                                                    : ""}
                                            </p>
                                        </td>
                                        <td className="col-3">
                                            <p id="p-common">
                                                {item.given ? item.given.toFixed(1) : ""}
                                                &nbsp;
                                                {item.given
                                                    ? item.unit === "BAGS"
                                                        ? item.unit.charAt(0).toUpperCase() +
                                                        item.unit.slice(2, 3).toLowerCase()
                                                        : item.unit === "BOXES"
                                                            ? item.unit.charAt(0).toUpperCase() +
                                                            item.unit.slice(2, 3).toLowerCase()
                                                            : item.unit === "CRATES" || "SACS"
                                                                ? item.unit.charAt(item).toUpperCase()
                                                                : ""
                                                    : ""}
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
                                                                : ""}
                                                &nbsp;
                                                {item.unit === "BAGS"
                                                    ? item.unit.charAt(0).toUpperCase() +
                                                    item.unit.slice(2, 3).toLowerCase()
                                                    : item.unit === "BOXES"
                                                        ? item.unit.charAt(0).toUpperCase() +
                                                        item.unit.slice(2, 3).toLowerCase()
                                                        : item.unit === "CRATES" || "SACS"
                                                            ? item.unit.charAt(item).toUpperCase()
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
            :''}
        </div>
    )
}

export default InventoryLedger