import {
  getCurrencyNumberWithOutSymbol, getCurrencyNumberWithSymbol,
} from "../../../components/getCurrencyNumber";
import getPdfHeaderDataCommon from "../headerJsonCommon";
import getPdfThemeInfo from "../pdfThemeInfo";
import moment from "moment";
export function getPaymentLedgerSummaryJson(
  data,
  transObj
) {
  var headerData = getPdfHeaderDataCommon({});
  var pdfThemeInfo = getPdfThemeInfo(data, false, true, "SELLER");
  return {
    primaryColor: pdfThemeInfo.primaryColor,
    lightColor: pdfThemeInfo.lightColor,
    darkerColor: pdfThemeInfo.darkerColor,
    headerData: headerData,
    userName: transObj?.partyName,
    data: {
      details: data?.details?.map((ledgerData) => {
        return {
          date: moment(ledgerData.date).format("DD-MMM-YY"),
          balance: getCurrencyNumberWithOutSymbol(ledgerData.balance),
          refId: ledgerData.refId,
          rate: getCurrencyNumberWithOutSymbol(ledgerData?.paid),
          toBePaid: getCurrencyNumberWithOutSymbol(ledgerData?.toBePaid),
        };
      }),
      openingBalance: getCurrencyNumberWithSymbol(data?.openingBalance),
      totalPaid: getCurrencyNumberWithSymbol(data?.totalPaid),
      totalToBePaid: getCurrencyNumberWithSymbol(data?.totalToBePaid),
      totalOutStandingBalance: getCurrencyNumberWithSymbol(data?.totalOutStandingBalance),
    },
  };
}
