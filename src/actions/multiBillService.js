import axiosCommon from "../axios";
const loginData = JSON.parse(localStorage.getItem("loginResponse"));
var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;

export function postMultiBuyBill(obj) {
  return axiosCommon.post(
    `/click/bills/multi-buy-bill`,
    obj
  );
}
export function postMultiSellBill(obj) {
  return axiosCommon.post(
    `/click/bills/multi-sell-bill`,
    obj
  );
}
export function editMultiBuyBill(obj) {
  return axiosCommon.put(
    `/click/bills/multi-sell-buy-bill`,
    obj
  );
}
export default {postMultiBuyBill,editMultiBuyBill,postMultiSellBill};