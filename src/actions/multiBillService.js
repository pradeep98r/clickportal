import axiosCommon from "../axios";
const loginData = JSON.parse(localStorage.getItem("loginResponse"));
var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;

export function postMultiBuyBill(obj) {
  return axiosCommon.post(
    `/click/bills/multi-buy-bill`,
    obj
  );
}
export default {postMultiBuyBill};