
import axiosCommon from "../axios";
export function getProfile(clickId) {
  return axiosCommon.get(`account/click/profiles/caId/${clickId}`);
}