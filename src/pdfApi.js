import axios from "axios";
const instance = axios.create({
  baseURL: "http://54.86.67.9:9000/v1/pdfgen/",
});
instance.defaults.headers.common["Content-Type"] =
  "application/json;charset=UTF-8";
instance.defaults.headers.common["Charset"] = "utf-8";
instance.defaults.headers.common["Accept"] = "application/pdf";
export default instance;
