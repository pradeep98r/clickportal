import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
} from "../../components/getCurrencyNumber";
import single_bill from "../../assets/images/bills/single_bill.svg";
import { qtyValues } from "../../components/qtyValues";
import { colorAdjustBg, getText } from "../../components/getText";
const PaartyCropDetails = (props) => {
  const selectedStep = useSelector((state) => state.multiStepsInfo);
  const selectedBillData = selectedStep?.selectedMultBillArray;
  const billViewData = useSelector((state) => state.billViewInfo);
  const partyType = selectedStep?.multiSelectPartyType;
  const theme = localStorage.getItem("pdftheme");
  const pdfThemeData = theme != null ? theme : null;
  const colorThemeVal = billViewData?.colorthemeValue;
  useEffect(() => {}, [props]);
  const totalBagsValue = (bags) => {
    var totalValue = 0;
    bags.map((item) => {
      totalValue += item.weight - item.wastage;
    });
    return totalValue;
  };

  return (
    <div>
      <div>
        <table className="table table-bordered bill_view mb-0">
          <thead>
            <tr>
              <th
                className="col-1 text-center"
                style={{
                  backgroundColor:
                    pdfThemeData != null
                      ? colorAdjustBg(colorThemeVal, 180) === "#ffffff"
                        ? colorThemeVal
                        : colorAdjustBg(colorThemeVal, 180)
                      : "#D7F3DD",
                }}
              >
                #
              </th>
              <th
                className="col-2"
                style={{
                  backgroundColor:
                    pdfThemeData != null
                      ? colorAdjustBg(colorThemeVal, 180) === "#ffffff"
                        ? colorThemeVal
                        : colorAdjustBg(colorThemeVal, 180)
                      : "#D7F3DD",
                }}
              >
                {partyType == "FARMER" ? "Seller" : "Buyer"}
              </th>
              <th className="col-9 remove_border p-0">
                <th
                  className="col-4"
                  style={{
                    backgroundColor:
                      pdfThemeData != null
                        ? colorAdjustBg(colorThemeVal, 180) === "#ffffff"
                          ? colorThemeVal
                          : colorAdjustBg(colorThemeVal, 180)
                        : "#D7F3DD",
                  }}
                >
                  Particulars
                </th>
                <th
                  className="col-3 qty_col"
                  style={{
                    backgroundColor:
                      pdfThemeData != null
                        ? colorAdjustBg(colorThemeVal, 180) === "#ffffff"
                          ? colorThemeVal
                          : colorAdjustBg(colorThemeVal, 180)
                        : "#D7F3DD",
                  }}
                >
                  Qty.{" "}
                </th>
                <th
                  className="col-3"
                  style={{
                    backgroundColor:
                      pdfThemeData != null
                        ? colorAdjustBg(colorThemeVal, 180) === "#ffffff"
                          ? colorThemeVal
                          : colorAdjustBg(colorThemeVal, 180)
                        : "#D7F3DD",
                  }}
                >
                  Rate (₹)
                </th>
                <th
                  className="col-2"
                  style={{
                    backgroundColor:
                      pdfThemeData != null
                        ? colorAdjustBg(colorThemeVal, 180) === "#ffffff"
                          ? colorThemeVal
                          : colorAdjustBg(colorThemeVal, 180)
                        : "#D7F3DD",
                  }}
                >
                  Total (₹)
                </th>
              </th>
            </tr>
          </thead>
          <tbody className="crop-tbl">
            {selectedBillData.billInfo.map((party, key) => {
              return (
                <tr key={party}>
                  <td className="col-1 text-center">{key + 1}</td>
                  <td className="col-2">
                    {partyType == "FARMER" ? party.farmerName : party.buyerName}
                  </td>
                  <td className="col-9 p-0 remove_border">
                    {party.lineItems.map((item, key) => {
                      return (
                        <div>
                          <td className="col-4">
                            <div className="flex_class mr-0 crop_name">
                              <img
                                src={item.imageUrl}
                                className="crop_image_bill"
                              />
                              <p className="crop-name">
                                {item.cropSufx != null
                                  ? item.cropSufx != ""
                                    ? item.cropName + " " + `(${item.cropSufx})`
                                    : item.cropName
                                  : item.cropName}
                              </p>
                            </div>
                          </td>
                          <td className="col-3 qty_col">
                            <div>
                              {" "}
                              {qtyValues(
                                item.qty,
                                item.qtyUnit,
                                item.weight,
                                item.wastage,
                                item.rateType
                              )}
                            </div>
                            <div>
                              {item.bags !== null ? (
                                <div className="flex_class">
                                  <span>
                                    <span>
                                      {item.bags.map((i) => {
                                        return (
                                          <span>
                                            <span>
                                              {i.weight ? i.weight + " " : ""}
                                            </span>
                                            <span>
                                              {i.wastage ? " - " : ""}
                                            </span>
                                            <span>
                                              {i.wastage ? i.wastage : ""}
                                            </span>
                                            <span>, </span>
                                          </span>
                                        );
                                      })}
                                      <span>
                                        = {totalBagsValue(item.bags) + "KGS"}
                                      </span>
                                    </span>
                                  </span>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </td>
                          <td className="col-3">
                            {getCurrencyNumberWithOutSymbol(item.rate)}
                          </td>
                          <td
                            className={
                              partyType === "FARMER"
                                ? "col-2 color_red"
                                : "col-2 color_green"
                            }
                          >
                            {getCurrencyNumberWithOutSymbol(item.total)}
                            {/* color_green */}
                          </td>
                        </div>
                      );
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div
          className="row gross_profit"
          style={{
            backgroundColor:
              pdfThemeData != null
                ? colorAdjustBg(colorThemeVal, 180) === "#ffffff"
                  ? colorThemeVal
                  : colorAdjustBg(colorThemeVal, 180)
                : "#D7F3DD",
          }}
        >
          <div className="col-lg-2"></div>
          <div className="col-lg-4"></div>
          <div className="col-lg-6 p-0 ">
            <div className="row justify-content-around multi_totals">
              <div className="col-lg-6 pr-0">
              <p className="total_value">Gross Total : </p>
              
              </div>
              <div className="col-lg-6">
              <p className="total_value number_overflow">
                &nbsp;&nbsp;
                {getCurrencyNumberWithSymbol(selectedBillData?.grossTotal)}
              </p>
              </div>
            </div>
            <div className="row justify-content-around multi_totals">
            <div className="col-lg-6 pr-0">
              <p className="total_value">Total Expenses : </p>
              </div>
              <div className="col-lg-6">
              <p className="total_value number_overflow">
                &nbsp;&nbsp;
                {selectedBillData?.totalExpenses != 0
                  ? getCurrencyNumberWithSymbol(selectedBillData?.totalExpenses)
                  : 0}
              </p>
              </div>
            </div>
            <div className="row justify-content-around multi_totals">
            <div className="col-lg-6 pr-0">
              <p className="total_value">COGS : </p>
              </div>
              <div className="col-lg-6">
              <p className="total_value number_overflow">
                &nbsp;&nbsp;
                {partyType == "FARMER"
                  ? getCurrencyNumberWithSymbol(selectedBillData?.totalRevenue)
                  : getCurrencyNumberWithSymbol(selectedBillData?.totalCOGS)}
              </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PaartyCropDetails;
