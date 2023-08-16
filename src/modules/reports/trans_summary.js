import React from "react";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
} from "../../components/getCurrencyNumber";
import NoDataAvailable from "../../components/noDataAvailable";
import getIndividualTotalUnitsVal from "./functions";
const TransporterSummary = (props) => {
  const dataObj = props.summaryData != null ? props.summaryData : [];
  return (
    <div>
      {dataObj != null ? (
        dataObj.transportationSummary.length > 0 ? (
          <div className="daily_summary_table_main">
            <div className="">
              <div className="row thead-tag">
             
                  <th className="col-1" id="sno">
                    #
                  </th>
                  <th className="col-4">Name</th>

                  <th className="col-4">Inventory Collection </th>

                  <th className="col-3">Paid(₹)</th>
               
              </div>
              <div className="daily_summary_table">
                <table className="table table-bordered mb-0" id="scroll_style">
                  <tbody>
                    {dataObj.transportationSummary.map((item, index) => {
                      return (
                        <tr className="tr-tags" scope="row" kery={index}>
                          <td className="col-1">
                            <p className="text-center">{index + 1}</p>
                          </td>
                          <td className="col-3">
                            <p>{item.transporterName}</p>
                          </td>
                          <td className="col-3">
                            <p>
                              {item.collected.length > 0
                                ? getIndividualTotalUnitsVal(
                                    item.collected,
                                    false
                                  )
                                : 0}
                            </p>
                          </td>
                          <td className="col-3">
                            <p className="color_red">
                              {item.paid != 0
                                ? getCurrencyNumberWithOutSymbol(item.paid)
                                : 0}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>{" "}
              </div>
            </div>
            <div className="totals">
              <div className="row">
                <div className="col-1"></div>
                <div className="col-4">
                  <p>Total</p>
                </div>
                <div className="col-3">
                  <p>
                    {dataObj.totalCollected.length > 0
                      ? getIndividualTotalUnitsVal(
                          dataObj.totalCollected,
                          false
                        )
                      : 0}
                  </p>
                </div>
                <div className="col-4">
                  <p className="color_red">
                    {dataObj.totalPaidRcvd != 0
                      ? getCurrencyNumberWithSymbol(dataObj.totalPaidRcvd)
                      : 0}
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
export default TransporterSummary;
