import axiosCommon from "../axios";
const loginData = JSON.parse(localStorage.getItem("loginResponse"));
var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
export function getDailySummaryData(date, clickId) {
  console.log(date, "service");
  return axiosCommon.get(
    `reports/summary/caId/${clickId}?date=${date}&writerId=${writerId}`
  );
}
export function getGrossProfitData(date, clickId) {
  console.log(date, "service");
  return axiosCommon.get(
    `reports/detailed/${clickId}/caId?date=${date}&writerId=${writerId}`
  );
}
export function getSalesSummary(clickId, type) {
  return axiosCommon.get(
    `reports/report/caId/${clickId}/type/${type}?page=0&size=0&writerId=${writerId}`
  );
}
export function customSalesSummary(clickId, type, fromDate, toDate){
  return axiosCommon.get(
    `reports/report/caId/${clickId}/type/${type}?fromDate=${fromDate}&toDate=${toDate}&writerId=${writerId}`
  )
}
