import pdfService from "../../pdfApi";

export function getSingleBillPdf(singleBillBody) {
  console.log(singleBillBody,'req body')
  return pdfService.post(`getSingleBillPdf`, singleBillBody, {
    responseType: "arraybuffer",
  });
}

export default {
  getSingleBillPdf,
};
