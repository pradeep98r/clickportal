export default function getLedgerSummaryPdfData() {
    var colorThemeInfo = getPdfThemeInfo(billData, true);
    var headerData = getPdfHeaderData(billData,true, {
      isBillView: true,
    });
    headerData["groupId"] = billData?.groupId;
  
    headerData["billId"] = {
      groupId: billData?.groupId,
      billNumber: 0,
    };
    headerData["billDate"] = moment(billData?.billInfo[0].billDate).format("DD-MMM-YYYY");
    var isFarmer = billData?.billInfo[0].partyType === "FARMER";
    var billType = isFarmer ? "BUYBILL" : "SELLBILL";
    return {
        headerData: headerData,
        ledgerType : "BUYER",
        outStandingBal: "1000",
      ledgerData: [
        {
          "partyName": "appu",
          "partyAddress": "string",
          "date": "string",
          "tobePaidRcvd": "1000"
        }
      ]
    };
    
  }