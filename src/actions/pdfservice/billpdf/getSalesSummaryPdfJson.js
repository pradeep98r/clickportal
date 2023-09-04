// import { getCurrencyNumberWithOutSymbol, getQuantityData, getWastage } from "../../../components/getCurrencyNumber";
import {
  getCurrencyNumberWithOneDigit,
} from "../../../components/getCurrencyNumber";
import getPdfHeaderDataCommon from "../headerJsonCommon";
import getPdfThemeInfo from "../pdfThemeInfo";
import moment from "moment";
import getQuantityData from "../functions/functions";
export function getSalesSummaryJson(data, fromDate, toDate, customVal,type) {
  var headerData = getPdfHeaderDataCommon({});
  var pdfThemeInfo = getPdfThemeInfo(data, false, true, type);
  console.log(customVal);
  return {
    primaryColor: pdfThemeInfo.primaryColor,
    lightColor: pdfThemeInfo.lightColor,
    darkerColor: pdfThemeInfo.darkerColor,
    headerData: headerData,
    date: {
      fromDate: moment(fromDate).format("DD-MMM-YY"),
      toDate: moment(toDate).format("DD-MMM-YY"),
      showDate: customVal == "custom" ? true : false,
    },
    type: type == 'BUYER' ? 'SELL' : 'BUY',
    partyName: "",
    data: {
      totalItemsRate: data.summaryObj?.totalItemsRate,
      items: data.salseSummaryData?.map((item) => {
        return {
          billId: item.billId,
          cropName: item.cropName,
          partyName: item.partyName,
          date: moment(item.date).format("DD-MMM-YY"),
          rate: getCurrencyNumberWithOneDigit(item.rate),
          qty: getQuantityData(item.qty, item.qtyUnit, item.weight),
          total: item.total,
        };
      }),

      quantityDetails: "string",
    },
  };
}
