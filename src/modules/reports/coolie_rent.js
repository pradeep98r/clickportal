import React from "react";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
} from "../../components/getCurrencyNumber";
import NoDataAvailable from "../../components/noDataAvailable";

const CoolieRentSummary = (props) => {
  const dataObj = props.summaryData != null ? props.summaryData : [];
  return (
    <div>
      {dataObj != null ? (
        dataObj.charges.length > 0 ? (
          <div className="daily_summary_table_main">
            <div className="">
            <div className="row thead-tag">
               
                    <th className="col-2" id="sno">
                      #
                    </th>
                    <th className="col-5">Ref ID</th>

                    <th className="col-3">Amount(₹)</th>
                 
                </div>
                <div className="daily_summary_table">
              <table className="table table-bordered mb-0" id="scroll_style">
               
                <tbody>
                  {dataObj.charges.map((item, index) => {
                    return (
                      <tr className="tr-tags" scope="row" kery={item.partyId}>
                        <td className="col-1">
                          <p className="text-center">{index + 1}</p>
                        </td>
                        <td className="col-3">
                          <p className="color_blue">{item.refId}</p>
                        </td>

                        <td className="col-3">
                          <p className={ props.partyType == "BUYER" ? "color_green" : "color_red"}>
                            {getCurrencyNumberWithOutSymbol(item.amount)}
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
                <div className="col-6">
                  <p>Total</p>
                </div>
                <div className="col-5">
                <p className={props.fromComm ? 'color_green' : 'color_red'}>
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
export default CoolieRentSummary;
