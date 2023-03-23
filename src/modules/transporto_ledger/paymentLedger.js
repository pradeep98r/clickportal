import React from "react";
import NoDataAvailable from "../../components/noDataAvailable";
import { getCurrencyNumberWithOutSymbol } from "../../components/getCurrencyNumber";
import moment from "moment";
import { useSelector } from "react-redux";
const PaymentLedger = (props) => {
  const transpoData = useSelector((state) => state.transpoInfo);
  const paymentLedgerSummary = transpoData?.paymentSummaryInfo;
  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);
  const tabs = props.tabs;
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
                        <p style={{ color: "#0066FF" }}>{item.refId}</p>
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
    </div>
  );
};

export default PaymentLedger;
