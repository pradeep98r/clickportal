// import { getCurrencyNumberWithOutSymbol, getQuantityData, getWastage } from "../../../components/getCurrencyNumber";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
} from "../../../components/getCurrencyNumber";
import { getQuantityUnit } from "../../../components/getText";
import ledgersService from "../../ledgersService";
import getQuantityData from "../functions/functions";
import getPdfHeaderDataCommon from "../headerJsonCommon";
import getPdfThemeInfo from "../pdfThemeInfo";
import moment from "moment";
export function getLedgerSummaryJson(
  ledgerSummary,
  userLedgerData,
  date,
  ledgerType,
  totalPaid,
  totalBusiness,
  outstandingAmount,
  ledgerTabs,
  beginDate,
  closeDate,
  allLedgersStatus,
  ledgersSummary
) {
  var headerData = getPdfHeaderDataCommon({});
  var pdfThemeInfo = getPdfThemeInfo(ledgerSummary, false, true, ledgerType);
  console.log(userLedgerData, "sumpdf");
  if (allLedgersStatus) {
    return {
      primaryColor: pdfThemeInfo.primaryColor,
      lightColor: pdfThemeInfo.lightColor,
      darkerColor: pdfThemeInfo.darkerColor,
      headerData: headerData,
      ledgerType: ledgerType.toUpperCase(),
      outStandingBal:
        ledgersSummary.outStandingBal != null
          ? getCurrencyNumberWithSymbol(
              ledgersSummary.outStandingBal.totalOutStgAmt
            )
          : "",
      ledgerData: ledgerSummary.map((ledgerData) => {
        return {
          date: moment(ledgerData.date).format("DD-MMM-YY"),
          tobePaidRcvd: getCurrencyNumberWithOutSymbol(ledgerData.tobePaidRcvd),
          partyAddress: ledgerData.partyAddress,
          partyName: ledgerData.partyName + " - " + ledgerData.shortName,
        };
      }),
    };
  } else {
    if (ledgerTabs == "ledgersummary") {
      return {
        primaryColor: pdfThemeInfo.primaryColor,
        lightColor: pdfThemeInfo.lightColor,
        darkerColor: pdfThemeInfo.darkerColor,
        headerData: headerData,
        ledgerType: ledgerType.toUpperCase(),
        totalReceived: totalPaid,
        totalPaidReceived: totalBusiness,
        totalOutStAmount: outstandingAmount,
        name: `${userLedgerData.partyName} - ${userLedgerData.shortName}`.toUpperCase(),
        date: {
          fromDate: moment(beginDate).format("DD-MMM-YY"),
          toDate: moment(closeDate).format("DD-MMM-YY"),
          showDate: date != "" ? true : false,
        },
        data: {
          items: ledgerSummary.map((ledgerData) => {
            return {
              date: moment(ledgerData.date).format("DD-MMM-YY"),
              refId: ledgerData.refId,
              paidRcvd: getCurrencyNumberWithOutSymbol(ledgerData.paidRcvd),
              tobePaidRcvd: getCurrencyNumberWithOutSymbol(
                ledgerData.tobePaidRcvd
              ),
              balance: ledgerData.balance,
              billPaid: ledgerData.billPaid,
            };
          }),
        },
      };
    } else {
      return {
        primaryColor: pdfThemeInfo.primaryColor,
        lightColor: pdfThemeInfo.lightColor,
        darkerColor: pdfThemeInfo.darkerColor,
        headerData: headerData,
        ledgerType: ledgerType.toUpperCase(),
        totalRecieved: totalPaid,
        totalToBeRecived: totalBusiness,
        totalOutStandingBalance: outstandingAmount,
        openingBalance: "",
        showOpeningBal: true,
        name: `${userLedgerData.partyName} - ${userLedgerData.shortName}`.toUpperCase(),
        date: {
          fromDate: moment(beginDate).format("DD-MMM-YY"),
          toDate: moment(closeDate).format("DD-MMM-YY"),
          showDate: date != "" ? true : false,
        },
        data: {
          items: ledgerSummary.map((ledgerData) => {
            return {
              date: moment(ledgerData.date).format("DD-MMM-YY"),
              refId: ledgerData.refId,
              itemName: ledgerData.itemName,
              partyName: ledgerData.partyName,
              qty: getQuantityData(
                ledgerData.qty,
                ledgerData.unit,
                ledgerData.kg
              ),
              // wastage: getWastage(
              //   ledgerData.wastage,
              //   ledgerData.unit,
              //   ledgerData.rateType
              // ),
              wastage: "",
              paid: getCurrencyNumberWithOutSymbol(ledgerData.paid),
              rate: getCurrencyNumberWithOutSymbol(ledgerData.rate),
              recieved: getCurrencyNumberWithOutSymbol(ledgerData.recieved),
              toBeRecieved: getCurrencyNumberWithOutSymbol(
                ledgerData.toBeRecieved
              ),
              toBePaid: getCurrencyNumberWithOutSymbol(ledgerData.toBePaid),
              cropLineItem: ledgerData.cropLineItem,
              comments: ledgerData.comments,
              balance: ledgerData.balance,
            };
          }),
        },
      };
    }
  }
}
