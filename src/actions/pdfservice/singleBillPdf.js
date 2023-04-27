import pdfService from "../../pdfApi";

export function getSingleBillPdf(singleBillBody) {
  return pdfService.post(`getSingleBillPdf`, singleBillBody, {
    responseType: "arraybuffer",
  });
}

export default {
  getSingleBillPdf,
};
