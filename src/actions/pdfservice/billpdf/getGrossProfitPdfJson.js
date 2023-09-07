
  import getPdfHeaderDataCommon from "../headerJsonCommon";
  import getPdfThemeInfo from "../pdfThemeInfo";
  import moment from "moment";
  import getIndividualTotalUnitsVal from "../../../modules/reports/functions";
import { getCurrencyNumberWithOutSymbol, getCurrencyNumberWithSymbol } from "../../../components/getCurrencyNumber";
  export function getGrossProfitSummaryJson(data, date) {
    var headerData = getPdfHeaderDataCommon({});
    var pdfThemeInfo = getPdfThemeInfo(data,
      false,
      true,
      'SELLER');
      var result = data?.grossProfitSummaryData;
      console.log(date)
    return {
      primaryColor: pdfThemeInfo.primaryColor,
      lightColor: pdfThemeInfo.lightColor,
      darkerColor: pdfThemeInfo.darkerColor,
      headerData: headerData,
      date: moment(date).format("DD-MMM-YY"),
      data: {
        date: date,
        buyersInfo: result?.buyersInfo.map((item) => {
            return {
                partyName: item.partyName,
                billAmount: getCurrencyNumberWithOutSymbol(item.billAmount),
                items: item.items.map((item1) => {
                    return {
                        cropName: item1.cropName,
                        quantityDetails: getIndividualTotalUnitsVal(item1.quantityDetails, true),
                    };
                  }),
            };
          }),
          sellersInfo: result?.sellersInfo.map((item) => {
            return {
                partyName: item.partyName,
                billAmount: getCurrencyNumberWithOutSymbol(item.billAmount),
                items: item.items.map((item1) => {
                    return {
                        cropName: item1.cropName,
                        quantityDetails: getIndividualTotalUnitsVal(item1.quantityDetails, true),
                    };
                  }),
            };
          }),

      
        totalBuyerQtyInfo: getIndividualTotalUnitsVal(result?.totalBuyerQtyInfo,true),
        totalSellerQtyInfo: getIndividualTotalUnitsVal(result?.totalSellerQtyInfo,true),
        buyerExpenses: {
          labourCharges: getCurrencyNumberWithSymbol(result?.buyerExpenses?.labourCharges),
          transportation: getCurrencyNumberWithSymbol(result?.buyerExpenses?.transportation),
          rent: getCurrencyNumberWithSymbol(result?.buyerExpenses?.rent),
          others: getCurrencyNumberWithSymbol(result?.buyerExpenses?.others)
        },
        sellerExpenses: {
            labourCharges: getCurrencyNumberWithSymbol(result?.sellerExpenses?.labourCharges),
            transportation: getCurrencyNumberWithSymbol(result?.sellerExpenses?.transportation),
            rent: getCurrencyNumberWithSymbol(result?.sellerExpenses?.rent),
            others: getCurrencyNumberWithSymbol(result?.sellerExpenses?.others)
        },
        totalRevenue: getCurrencyNumberWithSymbol(result?.totalRevenue),
        totalCOGS: getCurrencyNumberWithSymbol(result?.totalCOGS),
        grossProfit: getCurrencyNumberWithSymbol(result?.grossProfit)
      },
     
    };
  }
  


