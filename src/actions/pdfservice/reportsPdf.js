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
export default {
    getDailySummaryPdf,
    getSalesSummaryPdf
  };