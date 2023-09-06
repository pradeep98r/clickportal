import {
 getCurrencyNumberWithOutSymbol, getCurrencyNumberWithSymbol,
  } from "../../../components/getCurrencyNumber";
  import getPdfHeaderDataCommon from "../headerJsonCommon";
  import getPdfThemeInfo from "../pdfThemeInfo";
  import moment from "moment";
  export function getAllAdvancesJson(data) {
    var headerData = getPdfHeaderDataCommon({});
    var pdfThemeInfo = getPdfThemeInfo(data, false, true, 'SELLER');
    return {
        primaryColor: pdfThemeInfo.primaryColor,
        lightColor: pdfThemeInfo.lightColor,
        darkerColor: pdfThemeInfo.darkerColor,
        headerData: headerData,
        ledgerType: 'ADVANCES',
        outStandingBal:getCurrencyNumberWithSymbol(
                data?.totalAdvancesVal
              ),
        ledgerData: data?.allAdvancesData?.map((ledgerData) => {
          return {
            date: moment(ledgerData.date).format("DD-MMM-YY"),
            tobePaidRcvd: getCurrencyNumberWithOutSymbol(ledgerData.amount),
            partyAddress: ledgerData.addressLine,
            partyName: ledgerData.partyName,
          };
        }),
    }
  }
