import axios from "axios";
const isLocalAuth = localStorage.getItem("isauth");
const loginData = JSON.parse(localStorage.getItem("loginResponse"));
const clientId = isLocalAuth == "true" ? loginData.authKeys.clientId : "";
const clientSecret =
  isLocalAuth == "true" ? loginData.authKeys.clientSecret : "";
const instance = axios.create({
  baseURL: "https://dev-api.onoark.com/v1/",
});
instance.defaults.headers.common["Content-Type"] = "application/json";
instance.defaults.headers.common["client-id"] = clientId;
instance.defaults.headers.common["client-secret"] = clientSecret;
export default instance;
