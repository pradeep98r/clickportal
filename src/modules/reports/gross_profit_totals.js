import React, { useState } from "react";
import { useSelector } from "react-redux";
import getIndividualTotalUnitsValgross from "./common_functions";
const GrossProfitTotals = (props) => {
  const reportsData = useSelector((state) => state.reportsInfo);
  const grossSummaryInfo = reportsData?.grossProfitSummaryData;
  const partyType = props.type;
  const totalQtyInfo =
    props.type == "BUYER"
      ? grossSummaryInfo?.totalBuyerQtyInfo
      : grossSummaryInfo?.totalSellerQtyInfo;
  const totalExpInfo =
    props.type == "BUYER"
      ? grossSummaryInfo?.buyerExpenses
      : grossSummaryInfo?.sellerExpenses;
  return (
    <div className="daily_summary_table_main">
      <div className="">
        <table className="table table-bordered mb-0" id="scroll_style">
          <thead className="thead-tag">
            <tr>
              <th className="col-4">Total Quantities</th>

              <th className="col-4">Total Expenses(₹)</th>

              <th className="col-4">{partyType == "BUYER" ? "Total Revenue" : "Total COGS"}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="tr-tags" scope="row">
              <td className="col-1">
                <p className="">
                  {totalQtyInfo.length > 0 ? getIndividualTotalUnitsValgross
                  (totalQtyInfo, true) : 0}
                </p>
              </td>

              <td className="col-3">
                <p>{totalExpInfo?.total}</p>
              </td>
              <td className="col-3">
                <p
                  className={partyType == "BUYER" ? "color_green" : "color_red"}
                >
                  {partyType == "BUYER"
                    ? grossSummaryInfo?.totalRevenue
                    : grossSummaryInfo?.totalCOGS}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default GrossProfitTotals;
