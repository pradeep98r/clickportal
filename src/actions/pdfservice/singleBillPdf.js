import pdfService from "../../pdfApi";

export function getSingleBillPdf(singleBillBody) {
  console.log(singleBillBody,'req body')
  return pdfService.post(`getSingleBillPdf`, singleBillBody, {
    responseType: "arraybuffer",
  });
}
export function getSingleBillPdfHelth() {
  return pdfService.get(`health-check`);
}
export default {
  getSingleBillPdf,
};
