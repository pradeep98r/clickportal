import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
} from "../../../components/getCurrencyNumber";
import getPdfHeaderDataCommon from "../headerJsonCommon";
import getPdfThemeInfo from "../pdfThemeInfo";
import moment from "moment";
import { formatInvLedger } from "../../../components/getCropUnitValue";
export function getInvLedgerSummaryJson(data, transObj) {
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
          balance: (ledgerData.unit === "CRATES"
            ? ledgerData.cratesBalance.toFixed(1)
            : ledgerData.unit === "SACS"
            ? ledgerData.sacsBalance.toFixed(1)
            : ledgerData.unit === "BAGS"
            ? ledgerData.bagsBalance.toFixed(1)
            : ledgerData.unit === "BOXES"
            ? ledgerData.boxesBalance.toFixed(1)
            : "")+(
            ledgerData.unit === "BAGS"
              ? ledgerData.unit.charAt(0).toUpperCase() +
                  ledgerData.unit.slice(2, 3).toLowerCase()
              : ledgerData.unit === "BOXES"
              ? ledgerData.unit.charAt(0).toUpperCase() +
                ledgerData.unit.slice(2, 3).toLowerCase()
              : ledgerData.unit === "CRATES" || "SACS"
              ? ledgerData.unit.charAt(ledgerData).toUpperCase()
              : ""
          ),
          refId: ledgerData.refId,
          given:
            (ledgerData.given ? ledgerData.given.toFixed(1) : "") +
            (ledgerData.given
              ? ledgerData.unit === "BAGS"
                ? ledgerData.unit.charAt(0).toUpperCase() +
                  ledgerData.unit.slice(2, 3).toLowerCase()
                : ledgerData.unit === "BOXES"
                ? ledgerData.unit.charAt(0).toUpperCase() +
                  ledgerData.unit.slice(2, 3).toLowerCase()
                : ledgerData.unit === "CRATES" || "SACS"
                ? ledgerData.unit.charAt(ledgerData).toUpperCase()
                : ""
              : ""),
          collected:
            (ledgerData.collected ? ledgerData.collected.toFixed(1) : "") +
            (ledgerData.collected
              ? ledgerData.unit === "BAGS"
                ? ledgerData.unit.charAt(ledgerData).toUpperCase() +
                  ledgerData.unit.slice(2, 3).toLowerCase()
                : ledgerData.unit === "BOXES"
                ? ledgerData.unit.charAt(ledgerData).toUpperCase() +
                  ledgerData.unit.slice(2, 3).toLowerCase()
                : ledgerData.unit === "CRATES" || "SACS"
                ? ledgerData.unit.charAt(ledgerData).toUpperCase()
                : ""
              : ""),
        };
      }),
      totalGiven:
        data?.totalGiven.length > 0
          ? formatInvLedger(data?.totalGiven ? data.totalGiven : [])
          : 0,
      totalCollected:
        data?.totalCollected.length > 0
          ? formatInvLedger(data?.totalCollected ? data?.totalCollected : [])
          : 0,
      balance:
        data?.balance.length > 0
          ? formatInvLedger(data?.balance ? data?.balance : [])
          : 0,
    },
  };
}
