import React from "react";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
} from "../../components/getCurrencyNumber";
import NoDataAvailable from "../../components/noDataAvailable";
import getIndividualTotalUnitsVal from "./functions";

const CommonSummary = (props) => {
  const partyType = props.type;
  const dataObj = props.summaryData != null ? props.summaryData : [];
  return (
    <div>
      {dataObj != null ? (
        dataObj.summary.length > 0 ? (
          <div className="daily_summary_table_main">
            <div className="">
              <div className="row thead-tag">
                <th className="col-1" id="sno">
                  #
                </th>
                {partyType == "BUYER" ? (
                  <th className="col-4">Buyer Name</th>
                ) : (
                  <th className="col-4">Seller Name</th>
                )}
                <th className="col-4">Qty</th>

                <th className="col-3">Bill Amount(₹)</th>
              </div>
              <div className="daily_summary_table">
                <table className="table table-bordered mb-0" id="scroll_style">
                  <tbody>
                    {dataObj.summary.map((item, index) => {
                      return (
                        <tr className="tr-tags" scope="row" kery={item.partyId}>
                          <td className="col-1">
                            <p className="text-center">{index + 1}</p>
                          </td>
                          <td className="col-3">
                            <p>{item.partyName}</p>
                          </td>
                          <td className="col-3">
                            <p>
                              {getIndividualTotalUnitsVal(item.qtyInfo, false)}
                            </p>
                          </td>
                          <td className="col-3">
                            <p
                              className={
                                partyType == "BUYER"
                                  ? "color_green"
                                  : "color_red"
                              }
                            >
                              {getCurrencyNumberWithOutSymbol(item.billAmount)}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="totals">
              <div className="row">
                <div className="col-1"></div>
                <div className="col-1"></div>
                <div className="col-6">
                  <p>{getIndividualTotalUnitsVal(dataObj.totalQty, false)}</p>
                </div>
                <div className="col-4">
                  <p
                    className={
                      partyType == "BUYER" ? "color_green" : "color_red"
                    }
                  >
                    {getCurrencyNumberWithSymbol(dataObj.totalAmount)}
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
export default CommonSummary;
