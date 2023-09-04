import {
  getCurrencyNumberWithOutSymbol,
} from "../../../components/getCurrencyNumber";
import getPdfHeaderDataCommon from "../headerJsonCommon";
import getPdfThemeInfo from "../pdfThemeInfo";
import moment from "moment";
import getIndividualTotalUnitsVal from "../../../modules/reports/functions";
export function getDailySummaryJson(data, date) {
  var headerData = getPdfHeaderDataCommon({});
  var pdfThemeInfo = getPdfThemeInfo(data,
    false,
    true,
    'SELLER');
  return {
    primaryColor: pdfThemeInfo.primaryColor,
    lightColor: pdfThemeInfo.lightColor,
    darkerColor: pdfThemeInfo.darkerColor,
    headerData: headerData,
    date: moment(date).format("DD-MMM-YY"),
    data: {
      salesSummary: {
        summary: data.salesSummary?.summary.map((item) => {
          return {
            billAmount: getCurrencyNumberWithOutSymbol(item.billAmount),
            qtyInfo: getIndividualTotalUnitsVal(item.qtyInfo, false),
            partyName: item.partyName,
          };
        }),

        totalAmount: data.salesSummary?.totalAmount,
        totalQty: getIndividualTotalUnitsVal(
          data.salesSummary?.totalQty,
          false
        ),
      },
      purchaseSummary: {
        summary: data.purchaseSummary?.summary.map((item) => {
          return {
            billAmount: getCurrencyNumberWithOutSymbol(item.billAmount),
            qtyInfo: getIndividualTotalUnitsVal(item.qtyInfo, false),
            partyName: item.partyName,
          };
        }),

        totalAmount: data.purchaseSummary?.totalAmount,
        totalQty: getIndividualTotalUnitsVal(
          data.purchaseSummary?.totalQty,
          false
        ),
      },
      salesPaymentSummary: {
        paidRcvdSummary: data.salesPaymentSummary?.paidRcvdSummary.map(
          (item) => {
            return {
              paidRcvd: getCurrencyNumberWithOutSymbol(item.paidRcvd),
              partyName: item.partyName,
            };
          }
        ),
        totalPaidRcvd: data.salesPaymentSummary?.totalPaidRcvd,
      },
      purchasePaymentSumary: {
        paidRcvdSummary: data.purchasePaymentSumary?.paidRcvdSummary.map(
          (item) => {
            return {
              paidRcvd: getCurrencyNumberWithOutSymbol(item.paidRcvd),
              partyName: item.partyName,
            };
          }
        ),
        totalPaidRcvd: data.purchasePaymentSumary?.totalPaidRcvd,
      },
      transportoSummary: {
        transportationSummary:
          data.transportoSummary?.transportationSummary.map((item) => {
            return {
              paid: getCurrencyNumberWithOutSymbol(item.paidRcvd),
              transporterName: item.transporterName,
              collected: getIndividualTotalUnitsVal(item.collected, false),
            };
          }),
        totalCollected: getIndividualTotalUnitsVal(
          data.transportoSummary?.totalCollected,
          false
        ),
        totalPaidRcvd: data.transportoSummary?.totalPaidRcvd,
      },
      coolieSummary: {
        charges: data.coolieSummary?.charges.map((item) => {
          return {
            refId: item.refId,
            amount: item.amount,
          };
        }),

        totalAmount: data.coolieSummary?.totalAmount,
      },
      rentSummary: {
        charges: data.rentSummary?.charges.map((item) => {
          return {
            refId: item.refId,
            amount: item.amount,
          };
        }),

        totalAmount: data.rentSummary?.totalAmount,
      },
      salesCommSummary: {
        charges: data.salesCommSummary?.charges.map((item) => {
          return {
            refId: item.refId,
            amount: item.amount,
          };
        }),
        totalAmount: data.salesCommSummary?.totalAmount,
      },
      purchaseCommSummary: {
        charges: data.purchaseCommSummary?.charges.map((item) => {
          return {
            refId: item.refId,
            amount: item.amount,
          };
        }),
        totalAmount: data.purchaseCommSummary?.totalAmount,
      },
    },
  };
}
