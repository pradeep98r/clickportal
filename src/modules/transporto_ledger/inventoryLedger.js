import React, { useState } from "react";
import NoDataAvailable from "../../components/noDataAvailable";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getBuyBillId } from "../../actions/ledgersService";
import { paymentViewInfo } from "../../reducers/paymentViewSlice";
import { fromTransporter } from "../../reducers/transpoSlice";
import { billViewInfo } from "../../reducers/billViewSlice";
import BillView from "../buy_bill_book/billView";
import InventoryHistoryView from "./inventoryHistory";
import { getInventoryListById } from "../../actions/transporterService";
const InventoryLedger = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const transpoData = useSelector((state) => state.transpoInfo);
  const inventoryLedgerSummary = transpoData?.inventorySummaryInfo;
  const tabs = props.tabs;
  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);
  var transporterId = transpoData?.transporterIdVal;

  const dispatch = useDispatch();
  const [showBillModalStatus, setShowBillModalStatus] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showInvtModalStatus, setShowInvModalStatus] = useState(false);
  const [showInvModal, setShowInvModal] = useState(false);
 
  const billOnClickView = (billId, type, i, partyId) => {
    var bId = billId.replace("-", "").replace("C", "").replace("U", "");
    if (bId?.includes("T")) {
      getInventoryListById(clickId,transporterId, bId).then((res) => {
        if (res.data.status.type === "SUCCESS") {
          if(res.data.data != null){
            dispatch(paymentViewInfo(res.data.data));
            setShowInvModalStatus(true);
            setShowInvModal(true);
            dispatch(fromTransporter(true))
          }
          else{
            dispatch(paymentViewInfo([]));
          }
        }
      });
    } 
    else {
      getBuyBillId(clickId, bId).then((res) => {
        if (res.data.status.type === "SUCCESS") {
          Object.assign(res.data.data, { index: i, partyType: "FARMER" });
          dispatch(billViewInfo(res.data.data));
          localStorage.setItem("billData", JSON.stringify(res.data.data));
          setShowBillModalStatus(true);
          setShowBillModal(true);
        }
      });
    }
  };
  return (
    <div className="transporterSummary" id="scroll_style">
      {tabs == "inventoryledger" ? (
        <div id="detailed-inventory">
          {inventoryLedgerSummary.length > 0 ? (
            <table className="table table-bordered ledger-table">
              <thead className="thead-tag">
                <tr>
                  <th className="col-1" id="p-common-sno">
                    #
                  </th>
                  <th className="col-2">Ref ID</th>
                  <th className="col-3">{langFullData.collected}</th>
                  <th className="col-3">{langFullData.given}</th>
                  <th className="col-3">{langFullData.balance}</th>
                </tr>
              </thead>
              <tbody>
                {inventoryLedgerSummary.map((item, index) => {
                  return (
                    <tr className="tr-tags" key={item.partyId}>
                      <td className="col-1" id="p-common-sno">
                        {index + 1}
                      </td>
                      <td className="col-2">
                      <button className="pl-0" onClick={() =>
                            billOnClickView(item.refId, index, item.partyId)
                          }>
                        <p
                          style={{
                            color: "#0066FF",
                            cursor: "pointer",
                          }}
                        >
                          {item.refId}
                        </p>
                        </button>
                        <p>{moment(item.date).format("DD-MMM-YY")}</p>
                      </td>
                      <td className="col-3">
                        <p id="p-common">
                          {item.collected ? item.collected.toFixed(1) : ""}
                          &nbsp;
                          {item.collected
                            ? item.unit === "BAGS"
                              ? item.unit.charAt(item).toUpperCase() +
                                item.unit.slice(2, 3).toLowerCase()
                              : item.unit === "BOXES"
                              ? item.unit.charAt(item).toUpperCase() +
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
      ) : (
        ""
      )}
         {showBillModalStatus ? (
        <BillView
          showBillViewModal={showBillModal}
          closeBillViewModal={() => setShowBillModal(false)}
          fromLedger={true}
          fromTransporter={true}
        />
      ) : (
        ""
      )}
      {showInvtModalStatus ? (
        <InventoryHistoryView
          showInvViewModal={showInvModal}
          closeInvViewModal={() => setShowInvModal(false)}
          partyType = {'Transporter'}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default InventoryLedger;
