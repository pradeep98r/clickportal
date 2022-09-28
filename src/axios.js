import axios from "axios";
// import { useSelector } from 'react-redux';
const loginData = JSON.parse(localStorage.getItem("loginResponse"));
const clientId = loginData.authKeys.clientId;
const clientSecret = loginData.authKeys.clientSecret;
const instance = axios.create({
  baseURL: "https://dev-api.onoark.com/v1/account/",
});
// const loginUserDetails = useSelector(state => state.userInfo.isUserDetails);
//   console.log(loginUserDetails);
instance.defaults.headers.common["Content-Type"] = "application/json";
instance.defaults.headers.common["client-id"] = clientId;
instance.defaults.headers.common["client-secret"] = clientSecret;
export default instance;
