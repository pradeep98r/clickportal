import pdfService from "../../pdfApi";

export function getSingleBillPdf(singleBillBody) {
  console.log(singleBillBody, "req body");
  return pdfService.post(`getSingleBillPdf`, singleBillBody, {
    responseType: "arraybuffer",
  });
}
export function getSingleBillPdfHelth() {
  return pdfService.get(`health-check`);
}
export function postSingleBillPdfHelth(obj) {
  return pdfService.post(`postCheck`, obj);
}
export function getMultiBillPdf(singleBillBody) {
  console.log(singleBillBody, "req body multii");
  return pdfService.post(`getMultiBillPdf`, singleBillBody, {
    responseType: "arraybuffer",
  });
}
export function generateLedgerSummary(singleBillBody) {
  console.log(singleBillBody, "req body");
  return pdfService.post(`generateUserLedgerSummary`, singleBillBody, {
    responseType: "arraybuffer",
  });
}
export function generateDetailedLedgerSummary(singleBillBody) {
  console.log(singleBillBody, "req body");
  return pdfService.post(`generateUserDetailedLedgerSummary`, singleBillBody, {
    responseType: "arraybuffer",
  });
}
export function generateLedSummary(singleBillBody) {
  console.log(singleBillBody, "req body");
  return pdfService.post(`generateLedgerSummary`, singleBillBody, {
    responseType: "arraybuffer",
  });
}

export default {
  getSingleBillPdf,
  getSingleBillPdfHelth,
  postSingleBillPdfHelth,
  getMultiBillPdf,
};
