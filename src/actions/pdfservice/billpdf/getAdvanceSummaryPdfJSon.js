import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
} from "../../../components/getCurrencyNumber";
import getPdfHeaderDataCommon from "../headerJsonCommon";
import getPdfThemeInfo from "../pdfThemeInfo";
import moment from "moment";
export function getAdvancesSummaryJson(data, startDate, endDate, customVal) {
  var headerData = getPdfHeaderDataCommon({});
  var pdfThemeInfo = getPdfThemeInfo(data, false, true, "SELLER");
  return {
    primaryColor: pdfThemeInfo.primaryColor,
    lightColor: pdfThemeInfo.lightColor,
    darkerColor: pdfThemeInfo.darkerColor,
    headerData: headerData,
    date: {
      fromDate: startDate,
      toDate: endDate,
      showDate: customVal == "custom" ? true : false,
    },
    userName: data?.selectedPartyByAdvanceId?.partyName,
    data: {
      advances: data?.advanceSummaryById?.map((ledgerData) => {
        return {
          date: moment(ledgerData.date).format("DD-MMM-YY"),
          amount: getCurrencyNumberWithOutSymbol(ledgerData.amount),
          refId: ledgerData.refId,
        };
      }),
      totalAdvances: data?.totalAdvancesValById,
    },
  };
}
