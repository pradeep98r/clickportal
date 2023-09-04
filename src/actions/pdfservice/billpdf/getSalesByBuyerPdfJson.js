// import { getCurrencyNumberWithOutSymbol, getQuantityData, getWastage } from "../../../components/getCurrencyNumber";
import {
    getCurrencyNumberWithOneDigit, getCurrencyNumberWithOutSymbol, getCurrencyNumberWithSymbol,
  } from "../../../components/getCurrencyNumber";
  import getPdfHeaderDataCommon from "../headerJsonCommon";
  import getPdfThemeInfo from "../pdfThemeInfo";
  import moment from "moment";
  import getQuantityData from "../functions/functions";
import { qtyValues } from "../../../components/qtyValues";
  export function getSalesByBuyerSummaryJson(data, fromDate, toDate, customVal,type,cropBuyerStatus) {
    var headerData = getPdfHeaderDataCommon({});
    var pdfThemeInfo = getPdfThemeInfo(data, false, true, type);
    var result = cropBuyerStatus ? data.byCropSummaryObj : data.bySellerBuyerSummaryObj; 
    console.log(data);
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
      type: type,
      partyName: cropBuyerStatus? data.selectedCropIdObj?.cropName : data.selectedReportSeller?.partyName + ' - ' + data.selectedReportSeller?.shortName,
      data: {
        totalItemsRate: getCurrencyNumberWithOutSymbol(result?.totalItemsRate),
        items: result?.items?.map((item) => {
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
  
        quantityDetails: getCurrencyNumberWithOutSymbol(result?.totalUnits) + ' | ' + getCurrencyNumberWithOutSymbol(result?.totalWeight),
      },
    };
  }
  