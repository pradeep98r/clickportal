
import axiosCommon from "../axios";
export function getSmartboardData(clickId,type,fromDate,toDate) {
  return axiosCommon.get(`click/dashboard/caId/${clickId}/period/${type}?fromDate=${fromDate}&toDate=${toDate}`);
}
