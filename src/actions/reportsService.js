
import axiosCommon from "../axios";
const loginData = JSON.parse(localStorage.getItem("loginResponse"));
var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
export function getDailySummaryData(date,clickId) {
    console.log(date,'service')
  return axiosCommon.get(`reports/summary/caId/${clickId}?date=${date}&writerId=${writerId}`);
}
export function getGrossProfitData(date,clickId) {
    console.log(date,'service')
  return axiosCommon.get(`reports/detailed/${clickId}/caId?date=${date}&writerId=${writerId}`);
}