
import axiosCommon from "../axios";
export function getSmartboardData(clickId,type) {
  return axiosCommon.get(`click/dashboard/caId/${clickId}/period/${type}`);
}