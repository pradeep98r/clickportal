import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCurrencyNumberWithOutSymbol,getCurrencyNumberWithSymbol } from "../../components/getCurrencyNumber";
import single_bill from "../../assets/images/bills/single_bill.svg";
import { qtyValues } from "../../components/qtyValues";
import { colorAdjustBg, getText } from "../../components/getText";
const PaartyCropDetails = (props) => {
  const selectedStep = useSelector((state) => state.multiStepsInfo);
  const selectedBillData = selectedStep?.selectedMultBillArray;
  const pdfThemeDataArray = JSON.parse(localStorage.getItem("settingsData"));
  const pdfThemeData = pdfThemeDataArray != null ? pdfThemeDataArray[0] : null;
  const colorThemeVal =pdfThemeData != null ? (pdfThemeData?.colorTheme != '' ? pdfThemeData?.colorTheme :'#16a12c') : "#16a12c";
  useEffect(() => {
    // setBillViewData(JSON.parse(localStorage.getItem("billData")));
  }, [props]);
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
                Seller
              </th>
              <th className="col-10 remove_border p-0">
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
                      {party.farmerName}
                  </td>
                 <td className="col-9 p-0 remove_border">
                  {party.lineItems.map((item,key)=>{
                      return (
                        <div>
                        <td className="col-4">
                          <div className="flex_class crop_name">
                            <img src={item.imageUrl} className="crop_image_bill" />
                            <p className="crop-name">
                            {(item.cropSufx != null) ? ( item.cropSufx != '' ? (item.cropName + ' ' + `(${(item.cropSufx)})`) : item.cropName) : item.cropName}
                            </p>
                          </div>
                        </td>
                        <td className="col-3">
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
                                          <span>{i.wastage ? " - " : ""}</span>
                                          <span>{i.wastage ? i.wastage : ""}</span>
                                          <span>, </span>
                                        </span>
                                      );
                                    })}
                                    <span>= {totalBagsValue(item.bags) + "KGS"}</span>
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
                            // billData?.partyType === "FARMER"
                               "col-2 color_red"
                            //   : "col-2 color_green"
                          }
                        >
                          {getCurrencyNumberWithOutSymbol(item.total)}
                          {/* color_green */}
                        </td>
                        </div>
                      )
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
            <div className="row justify-content-around">
              <p className="total_value">Gross Total : </p>
              <p className="total_value text-left number_overflow">
                &nbsp;&nbsp;
                {getCurrencyNumberWithSymbol(selectedBillData?.grossTotal)}
              </p>
            </div>
            <div className="row justify-content-around">
              <p className="total_value">Total Expenses : </p>
              <p className="total_value text-left number_overflow">
                &nbsp;&nbsp;
                {getCurrencyNumberWithSymbol(selectedBillData?.totalExpenses)}
              </p>
            </div>
            <div className="row justify-content-around">
              <p className="total_value">COGS : </p>
              <p className="total_value text-left number_overflow">
                &nbsp;&nbsp;
                {getCurrencyNumberWithSymbol(selectedBillData?.totalRevenue)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PaartyCropDetails;
