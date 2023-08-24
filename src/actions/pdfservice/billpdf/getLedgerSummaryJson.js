// import { getCurrencyNumberWithOutSymbol, getQuantityData, getWastage } from "../../../components/getCurrencyNumber";
import { getCurrencyNumberWithOutSymbol } from "../../../components/getCurrencyNumber";
import { getQuantityUnit } from "../../../components/getText";
import ledgersService from "../../ledgersService";
import getQuantityData from "../functions/functions";
import getPdfHeaderDataCommon from "../headerJsonCommon";
import getPdfThemeInfo from "../pdfThemeInfo";
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
  var pdfThemeInfo = getPdfThemeInfo(ledgerSummary, false);
  console.log(userLedgerData, "sumpdf");
  if(allLedgersStatus){
    return {
      primaryColor: pdfThemeInfo.primaryColor,
      lightColor: pdfThemeInfo.lightColor,
      darkerColor: pdfThemeInfo.darkerColor,
      headerData: headerData,
      ledgerType: ledgerType.toUpperCase(),
      outStandingBal:ledgersSummary.outStandingBal.totalOutStgAmt,
        ledgerData: ledgerSummary.map((ledgerData) => {
          return {
            date: ledgerData.date,
            tobePaidRcvd: getCurrencyNumberWithOutSymbol(
              ledgerData.paidRcvd
            ),
            partyAddress: ledgerData.partyAddress,
            partyName: ledgerData.partyName,
          };
        }),
    
    };
  }
  else{
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
          fromDate: beginDate,
          toDate: closeDate,
          showDate: date != "" ? true : false,
        },
        data: {
          items: ledgerSummary.map((ledgerData) => {
            return {
              date: ledgerData.date,
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
          fromDate: beginDate,
          toDate: closeDate,
          showDate: date != "" ? true : false,
        },
        data: {
          items: ledgerSummary.map((ledgerData) => {
            return {
              date: ledgerData.date,
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
              paid: "string",
              rate: getCurrencyNumberWithOutSymbol(ledgerData.rate),
              recieved: getCurrencyNumberWithOutSymbol(ledgerData.recieved),
              toBeRecieved: getCurrencyNumberWithOutSymbol(
                ledgerData.toBeRecieved
              ),
              toBePaid: "",
              cropLineItem: ledgerData.cropLineItem,
              comments: ledgerData.comments,
              // paidRcvd: getCurrencyNumberWithOutSymbol(ledgerData.paidRcvd),
              // tobePaidRcvd: getCurrencyNumberWithOutSymbol(ledgerData.tobePaidRcvd),
              balance: ledgerData.balance,
              // billPaid: ledgerData.billPaid,
            };
          }),
        },
      };
    }
  }
}
