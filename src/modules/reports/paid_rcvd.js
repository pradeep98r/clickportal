import React from "react";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
} from "../../components/getCurrencyNumber";
import NoDataAvailable from "../../components/noDataAvailable";

const PaidRcvdSummary = (props) => {
  const partyType = props.type;
  const dataObj = props.summaryData != null ? props.summaryData : [];
  return (
    <div>
      {dataObj != null ? (
        dataObj.paidRcvdSummary.length > 0 ? (
          <div className="daily_summary_table_main">
            <div className="daily_summary_table">
              <table className="table table-bordered mb-0" id="scroll_style">
                <thead className="thead-tag">
                  <tr>
                    <th className="col-1" id="sno">
                      #
                    </th>
                    {partyType == "BUYER" ? (
                      <th className="col-3">Buyer Name</th>
                    ) : (
                      <th className="col-3">Seller Name</th>
                    )}
                    {partyType == "BUYER" ? (
                      <th className="col-3">Received(₹)</th>
                    ) : (
                      <th className="col-3">Paid(₹)</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {dataObj.paidRcvdSummary.map((item, index) => {
                    return (
                      <tr className="tr-tags" scope="row" kery={item.partyId}>
                        <td className="col-1">
                          <p className="text-center">{index + 1}</p>
                        </td>
                        <td className="col-3">
                          <p>{item.partyName}</p>
                        </td>

                        <td className="col-3">
                          <p
                            className={
                              partyType == "BUYER" ? "color_green" : "color_red"
                            }
                          >
                            {getCurrencyNumberWithOutSymbol(item.paidRcvd)}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="totals">
              <div className="row">
                <div className="col-1"></div>
                <div className="col-6">
                  <p>
                    {" "}
                    {partyType == "BUYER" ? "Total Received" : "Total Paid"}
                  </p>
                </div>
                <div className="col-5">
                  <p
                    className={
                      partyType == "BUYER" ? "color_green" : "color_red"
                    }
                  >
                    {getCurrencyNumberWithSymbol(dataObj.totalPaidRcvd)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="daily_summary_table_nodata">
            <NoDataAvailable />
          </div>
        )
      ) : (
        "no data"
      )}
    </div>
  );
};
export default PaidRcvdSummary;
