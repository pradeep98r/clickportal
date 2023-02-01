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
const LedgerSummary = (props) => {

  // const partyId = props.ledgerId;
  const ledgerSummary = props.LedgerSummary;
  const ledgerSummaryByDate = props.LedgerSummaryByDate;
  const allCustom = props.allCustomTab;
  const ledgerTabs = props.ledgerTab;
  const ledgerType = props.partyType;
  return (
    <div>
      {allCustom == 'all' ? (
        <div className={props.dateDisplay ? 'ledgerSummary' : 'all_ledgerSummary' } id="scroll_style">
          {ledgerSummary.length > 0 ? (
            <table className="table table-bordered ledger-table">
              <thead className="thead-tag">
                <tr>
                  <th className="col-1" id="sno">
                    #
                  </th>
                  <th className="col-2">Ref ID | Date</th>
                  {ledgerType == 'BUYER'?<th className="col-3">Received(&#8377;)</th>:
                  <th className="col-3">Paid(&#8377;)</th>}
                  {ledgerType == 'BUYER'?<th className="col-3">To Be Received(&#8377;)</th>:
                  <th className="col-3">To Be Paid(&#8377;)</th>}
                  <th className="col-3">Ledger Balance(&#8377;)</th>
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
                        <p>
                          {moment(item.date).format("DD-MMM-YY")}
                        </p>
                      </td>
                      <td className="col-3">
                        <p id="p-common">
                          {item.paidRcvd
                            ? getCurrencyNumberWithOutSymbol(
                              item.paidRcvd
                            )
                            : ""}
                        </p>
                      </td>
                      <td className="col-3">
                        <p id="p-common">
                          {item.tobePaidRcvd
                            ? getCurrencyNumberWithOutSymbol(
                              item.tobePaidRcvd
                            )
                            : ""}
                        </p>
                      </td>
                      <td className="col-3">
                        <p className={ledgerType == 'BUYER'?"coloring":'paid-coloring'} id="p-common">
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
      ) :
        <div className="ledgerSummary" id="scroll_style">
            {ledgerSummaryByDate.length > 0 ? (
              <table className="table table-bordered ledger-table">
                {/*ledger-table*/}
                <thead className="thead-tag">
                  <tr>
                    <th className="col-1" id="sno">
                      #
                    </th>
                    <th className="col-2">Ref ID | Date</th>
                    {ledgerType == 'BUYER'?<th className="col-3">Received(&#8377;)</th>:
                    <th className="col-3">Paid(&#8377;)</th>}
                    {ledgerType == 'BUYER'?<th className="col-3">To Be Received(&#8377;)</th>:
                    <th className="col-3">To Be Paid(&#8377;)</th>}
                    <th className="col-3">
                      Ledger Balance(&#8377;)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerSummaryByDate.map((item, index) => {
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
                          <p>
                            {moment(item.date).format("DD-MMM-YY")}
                          </p>
                        </td>
                        <td className="col-3">
                          <p id="p-common">
                            {item.paidRcvd
                              ? item.paidRcvd.toFixed(2)
                              : ""}
                          </p>
                        </td>
                        <td className="col-3">
                          <p id="p-common">
                            {item.tobePaidRcvd
                              ? item.tobePaidRcvd.toFixed(2)
                              : ""}
                          </p>
                        </td>
                        <td className="col-3">
                          <p className={ledgerType == 'BUYER'?"coloring":'paid-coloring'} id="p-common">
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
      }
    </div>
  )
}

export default LedgerSummary