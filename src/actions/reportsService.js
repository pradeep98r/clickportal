
import axiosCommon from "../axios";
const loginData = JSON.parse(localStorage.getItem("loginResponse"));
const clickId = loginData.caId;
var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
export function getDailySummaryData(date) {
  return axiosCommon.get(`account/summary/caId/${clickId}?date=${date}&writerId=${writerId}`);
}