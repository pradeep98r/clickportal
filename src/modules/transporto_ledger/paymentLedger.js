import React, { useState } from "react";
import NoDataAvailable from "../../components/noDataAvailable";
import { getCurrencyNumberWithOutSymbol } from "../../components/getCurrencyNumber";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdvanceListById,
  getBuyBillId,
  getPaymentListById,
} from "../../actions/ledgersService";
import { paymentViewInfo } from "../../reducers/paymentViewSlice";
import { billViewInfo } from "../../reducers/billViewSlice";
import BillView from "../buy_bill_book/billView";
import PaymentHistoryView from "../ledgers/paymentHistory";
import { fromTransporter } from "../../reducers/transpoSlice";
const PaymentLedger = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const transpoData = useSelector((state) => state.transpoInfo);
  const paymentLedgerSummary = transpoData?.paymentSummaryInfo;
  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);
  var transporterId = transpoData?.transporterIdVal;
  const [showBillModalStatus, setShowBillModalStatus] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showPaymentModalStatus, setShowPaymentModalStatus] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const tabs = props.tabs;
  const dispatch = useDispatch();
  const billOnClickView = (billId, type, i, partyId) => {
    var bId = billId.replace("-", " ").replace("C", "").replace("U", "");
    if (bId?.includes("P") || bId?.includes("D")) {
      getPaymentListById(clickId, bId).then((res) => {
        if (res.data.status.type === "SUCCESS") {
          dispatch(paymentViewInfo(res.data.data));
          setShowPaymentModalStatus(true);
          setShowPaymentModal(true);
          dispatch(fromTransporter(true));
        }
      });
    } else if (bId?.includes("A")) {
      getAdvanceListById(clickId, bId, transporterId).then((res) => {
        if (res.data.status.type === "SUCCESS") {
          dispatch(paymentViewInfo(res.data.data));
          setShowPaymentModalStatus(true);
          setShowPaymentModal(true);
        }
      });
    } else {
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
      {tabs == "paymentledger" ? (
        <div id="transporter-summary">
          {paymentLedgerSummary.length > 0 ? (
            <table className="table table-bordered ledger-table">
              <thead className="thead-tag">
                <tr>
                  <th className="col-1" id="sno">
                    #
                  </th>
                  <th className="col-2">{langFullData.refId}</th>
                  <th className="col-3">{langFullData.paid}(&#8377;)</th>
                  <th className="col-3">{langFullData.toBePaid}(&#8377;)</th>
                  <th className="col-3">
                    {langFullData.ledgerBalance}(&#8377;)
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentLedgerSummary.map((item, index) => {
                  return (
                    <tr className="tr-tags" scope="row" kery={item.partyId}>
                      <td className="col-1">
                        <p id="p-common-sno">{index + 1}</p>
                      </td>
                      <td className="col-2">
                        <button
                          className="pl-0"
                          onClick={() =>
                            billOnClickView(item.refId, index, item.partyId)
                          }
                        >
                          <p style={{ color: "#0066FF" }}>
                            <div className="d-flex">
                              <span>{item.refId}</span>
                            </div>
                          </p>
                        </button>
                        <p>{moment(item.date).format("DD-MMM-YY")}</p>
                      </td>
                      <td className="col-3">
                        <p id="p-common">
                          {item.paid
                            ? getCurrencyNumberWithOutSymbol(item.paid)
                            : ""}
                        </p>
                      </td>
                      <td className="col-3">
                        <p id="p-common" className="paid-coloring">
                          {item.toBePaid
                            ? getCurrencyNumberWithOutSymbol(item.toBePaid)
                            : ""}
                        </p>
                      </td>
                      <td className="col-3">
                        <p className="coloring color_black" id="p-common">
                          {item.balance
                            ? getCurrencyNumberWithOutSymbol(item.balance)
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
      {showPaymentModalStatus ? (
        <PaymentHistoryView
          showPaymentViewModal={showPaymentModal}
          closePaymentViewModal={() => setShowPaymentModal(false)}
          partyType={"Transporter"}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default PaymentLedger;
