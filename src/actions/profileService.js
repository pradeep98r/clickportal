
import axiosCommon from "../axios";
export function getProfile(clickId) {
  return axiosCommon.get(`account/click/profiles/caId/${clickId}`);
}
export function getLanguagesData(id){
  return axiosCommon.get(`common/scripts/langId/${id}`);
}