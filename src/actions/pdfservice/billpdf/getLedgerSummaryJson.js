import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
} from "../../../components/getCurrencyNumber";
import getPdfHeaderData from "../headerJsonData";
import getPdfThemeInfo from "../pdfThemeInfo";

export function getLedgerSummaryJson(
  ledgerSummary,
  userLedgerData,
  date,
  ledgerType,
  totalBusiness,
  outstandingAmount
) {
//   var headerData = getPdfHeaderData({
//     isBillView: false,
//   });
  var headerData = getPdfHeaderData(false, {
    isBillView: true,
  });
  var pdfThemeInfo = getPdfThemeInfo();
  return {
    primaryColor: pdfThemeInfo.primaryColor,
    lightColor: pdfThemeInfo.lightColor,
    darkerColor: pdfThemeInfo.darkerColor,
    headerData: headerData,
    ledgerType: ledgerType.toUpperCase(),
    totalReceived: userLedgerData.tobePaidRcvd
      ? getCurrencyNumberWithSymbol(userLedgerData.tobePaidRcvd)
      : 0,
    totalPaidReceived: totalBusiness,
    totalOutStAmount: outstandingAmount,
    name: `${userLedgerData.partyName} - ${userLedgerData.shortName}`.toUpperCase(),
    date: date,
    data: {
      items: ledgerSummary.map((ledgerData) => {
        return {
          date: ledgerData.date,
          refId: ledgerData.refId,
          paidRcvd: getCurrencyNumberWithOutSymbol(ledgerData.paidRcvd),
          tobePaidRcvd: getCurrencyNumberWithOutSymbol(ledgerData.tobePaidRcvd),
          balance: ledgerData.balance,
          billPaid: ledgerData.billPaid,
        };
      }),
    },
  };
}
