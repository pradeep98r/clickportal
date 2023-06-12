import axios from "axios";
const instance = axios.create({
  // 9000 for dev
  // 9001 - prod
  baseURL: "https://dev-pdfgen.onoark.com/v1/pdfgen",
  // https://dev-pdfgen.onoark.com/v1/pdfgen/getSingleBillPdf
  // baseURL:"http://54.86.67.9:9000/v1/pdfgen/"
});
instance.defaults.headers.common["Content-Type"] =
  "application/json;charset=UTF-8";
instance.defaults.headers.common["Charset"] = "utf-8";
instance.defaults.headers.common["Accept"] = "application/pdf";
instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*"
export default instance;