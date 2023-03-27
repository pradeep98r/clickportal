
import axiosCommon from "../axios";
const loginData = JSON.parse(localStorage.getItem("loginResponse"));
var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
export function getProfile(clickId) {
  return axiosCommon.get(`account/click/profiles/caId/${clickId}?writerId=${writerId}`);
}
export function getLanguagesData(id){
  return axiosCommon.get(`common/scripts/langId/${id}?writerId=${writerId}`);
}