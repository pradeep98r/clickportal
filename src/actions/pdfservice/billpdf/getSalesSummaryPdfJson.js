// import { getCurrencyNumberWithOutSymbol, getQuantityData, getWastage } from "../../../components/getCurrencyNumber";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
} from "../../../components/getCurrencyNumber";
import getPdfHeaderDataCommon from "../headerJsonCommon";
import getPdfThemeInfo from "../pdfThemeInfo";
import moment from "moment";
import getIndividualTotalUnitsVal from "../../../modules/reports/functions";
import getQuantityData from "../functions/functions";
export function getSalesSummaryJson(data, date) {
  var headerData = getPdfHeaderDataCommon({});
  var pdfThemeInfo = getPdfThemeInfo(data, false, true, "SELLER");
  console.log(data)
  return {
    primaryColor: pdfThemeInfo.primaryColor,
    lightColor: pdfThemeInfo.lightColor,
    darkerColor: pdfThemeInfo.darkerColor,
    headerData: headerData,
    date: moment(date).format("DD-MMM-YY"),
    //   "date": {
    //     "fromDate": "string",
    //     "toDate": "string",
    //     "showDate": true
    //   },
    type: "SELL",
    partyName: "",
    data: {
      totalItemsRate: data.summaryObj?.totalItemsRate,
      items: data.salseSummaryData?.map((item) => {
        return {
          billId: item.billId,
          cropName: item.cropName,
          partyName: item.partyName,
          date: item.date,
          rate: item.rate,
          qty: getQuantityData(item.qty, item.qtyUnit, item.weight),
          total: item.total,
        };
      }),

      quantityDetails: "string",
    },
  };
}
