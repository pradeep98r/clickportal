import React from "react";
import { useSelector } from "react-redux";
import getIndividualTotalUnits from "../../actions/pdfservice/functions/getIndividualUnits";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
} from "../../components/getCurrencyNumber";
import getIndividualTotalUnitsValgross from "./common_functions";
import getIndividualTotalUnitsVal from "./functions";
const GrossProfitTable = (props) => {
  const reportsData = useSelector((state) => state.reportsInfo);
  const grossSummaryInfo = reportsData?.grossProfitSummaryData;
  const partyType = props.type;
  const dataObj =
    props.type == "BUYER"
      ? grossSummaryInfo?.buyersInfo
      : grossSummaryInfo?.sellersInfo;
  const totalQtyInfo =
    props.type == "BUYER"
      ? grossSummaryInfo?.totalBuyerQtyInfo
      : grossSummaryInfo?.totalSellerQtyInfo;
  const totalExp =
    props.type == "BUYER"
      ? grossSummaryInfo?.buyerExpenses
      : grossSummaryInfo?.sellerExpenses;
  return (
    <div className="daily_summary_table_main">
      <div className="daily_summary_table daily_summary_table_g">
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
              <th className="col-3">Qty</th>

              <th className="col-3">Bill Amount(₹)</th>
            </tr>
          </thead>
          <tbody>
            {dataObj.map((item, index) => {
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
                      {item.items.map((crop, i) => {
                        return (
                          <div className="mb-1">
                            <p>{crop.cropName}</p>
                            <p>
                              {getIndividualTotalUnitsValgross(
                                crop.quantityDetails,
                                true
                              )}
                            </p>
                          </div>
                        );
                      })}
                    </p>
                  </td>
                  <td className="col-3">
                    <p
                      className={
                        partyType == "BUYER" ? "color_green" : "color_red"
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
      <div className="totals totals_main_g">
        <div className="row">
          <div className="col-1"></div>
          <div className="col-3"></div>
          <div className="col-5">
            <p>Total:{getIndividualTotalUnitsValgross(totalQtyInfo, true)}</p>
          </div>
          <div className="col-1"></div>
        </div>
        <div className="row totals_g">
          <div className="col-1"></div>
          <div className="col-3"></div>
          <div className="col-3">
            <p>Transportation</p>
          </div>
          <div className="col-3">
            <p>
              {totalExp?.transportation != 0
                ? getCurrencyNumberWithSymbol(totalExp?.transportation)
                : 0}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-1"></div>
          <div className="col-3"></div>
          <div className="col-3">
            <p>Rent(Box/Crate/Bag/Sac)</p>
          </div>
          <div className="col-3">
            <p>
              {totalExp?.rent != 0
                ? getCurrencyNumberWithSymbol(totalExp?.rent)
                : 0}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-1"></div>
          <div className="col-3"></div>
          <div className="col-3">
            <p>Cooli</p>
          </div>
          <div className="col-3">
            <p>
              {totalExp?.labourCharges != 0
                ? getCurrencyNumberWithSymbol(totalExp?.labourCharges)
                : 0}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-1"></div>
          <div className="col-3"></div>
          <div className="col-3">
            <p>Others</p>
          </div>
          <div className="col-3">
            <p>
              {totalExp?.others != 0
                ? getCurrencyNumberWithSymbol(totalExp?.others)
                : 0}
            </p>
          </div>
        </div>
        <div className="row totals_g">
          <div className="col-1"></div>
          <div className="col-3"></div>
          <div className="col-3">
            <p>{partyType == "BUYER" ? "Total Revenue" : "Total COGS"}</p>
          </div>
          <div className="col-3">
            <p className={partyType == "BUYER" ? "color_green" : "color_red"}>
              {partyType == "BUYER"
                ? grossSummaryInfo?.totalRevenue != 0
                  ? getCurrencyNumberWithSymbol(grossSummaryInfo?.totalRevenue)
                  : 0
                : grossSummaryInfo?.totalCOGS != 0
                ? getCurrencyNumberWithSymbol(grossSummaryInfo?.totalCOGS)
                : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GrossProfitTable;
