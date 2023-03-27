
import axiosCommon from "../axios";
const loginData = JSON.parse(localStorage.getItem("loginResponse"));
var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
export function getSmartboardData(clickId,type,fromDate,toDate) {
  return axiosCommon.get(`click/dashboard/caId/${clickId}/period/${type}?fromDate=${fromDate}&toDate=${toDate}&writerId=${writerId}`);
}
