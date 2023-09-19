import pdfService from "../../pdfApi";

export function getDailySummaryPdf(singleBillBody) {
  console.log(singleBillBody, "req body");
  return pdfService.post(`generateDailySummary`, singleBillBody, {
    responseType: "arraybuffer",
  });
}
export function getSalesSummaryPdf(singleBillBody) {
    console.log(singleBillBody, "req body");
    return pdfService.post(`generateReportsSummary`, singleBillBody, {
      responseType: "arraybuffer",
    });
  }
  export function getGrossProfitSummaryPdf(singleBillBody) {
    console.log(singleBillBody, "req body");
    return pdfService.post(`generateGrossProfit`, singleBillBody, {
      responseType: "arraybuffer",
    });
  }
  export function getAdvancesSummaryPdf(singleBillBody) {
    console.log(singleBillBody, "req body");
    return pdfService.post(`generateAdvances`, singleBillBody, {
      responseType: "arraybuffer",
    });
  }
  export function getTransportoLedgersPdf(singleBillBody) {
    console.log(singleBillBody, "req body");
    return pdfService.post(`generateTransportoLedgerSummary`, singleBillBody, {
      responseType: "arraybuffer",
    });
  }
  export function getPaymentLedgersPdf(singleBillBody) {
    console.log(singleBillBody, "req body");
    return pdfService.post(`generatePaymentReports`, singleBillBody, {
      responseType: "arraybuffer",
    });
  }
  export function getInvLedgersPdf(singleBillBody) {
    console.log(singleBillBody, "req body");
    return pdfService.post(`generateInventoryReports`, singleBillBody, {
      responseType: "arraybuffer",
    });
  }
  export function getInvAllLedgersPdf(singleBillBody) {
    console.log(singleBillBody, "req body");
    return pdfService.post(`generateInventoryLedgerSummary`, singleBillBody, {
      responseType: "arraybuffer",
    });
  }
export default {
    getDailySummaryPdf,
    getSalesSummaryPdf,
    getGrossProfitSummaryPdf,
    getAdvancesSummaryPdf,
    getTransportoLedgersPdf,
    getPaymentLedgersPdf,
    getInvLedgersPdf,
    getInvAllLedgersPdf
  };