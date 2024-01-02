import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
} from "../../../components/getCurrencyNumber";
import getPdfHeaderDataCommon from "../headerJsonCommon";
import getPdfThemeInfo from "../pdfThemeInfo";
import moment from "moment";
import { formatInvLedger } from "../../../components/getCropUnitValue";
export function getAllAdvancesJson(data, fromInventoryTab) {
  var headerData = getPdfHeaderDataCommon({});
  var pdfThemeInfo = getPdfThemeInfo(data, false, true, "SELLER");
  return {
    primaryColor: pdfThemeInfo.primaryColor,
    lightColor: pdfThemeInfo.lightColor,
    darkerColor: pdfThemeInfo.darkerColor,
    headerData: headerData,
    totalOutStgAmt: !fromInventoryTab ? (
      data?.outstandingAmount?.totalOutStgAmt
    ) : formatInvLedger(
      data?.outstandingAmountInv
        ? data?.outstandingAmountInv
        : []
    ),
    ledgers: data?.transpoLedgersInfo?.map((ledgerData) => {
      return {
        date: moment(ledgerData.date).format("DD-MMM-YY"),
        tobePaidRcvd:
          !fromInventoryTab
            ? ledgerData.tobePaidRcvd != 0
              ? getCurrencyNumberWithOutSymbol(ledgerData.tobePaidRcvd)
              : "0"
            : formatInvLedger(
                ledgerData?.inventory ? ledgerData.inventory : []
              ),
        partyAddress: ledgerData.addressLine,
        partyName: fromInventoryTab ? ledgerData.transporterName : ledgerData?.partyName,
      };
    }),
  };
}
