import axiosCommon from "../axios";
const loginData = JSON.parse(localStorage.getItem("loginResponse"));
var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
export function getAdvances(clickId) {
  return axiosCommon.get(
    `payments/advances/ledger/caId/${clickId}?writerId=${writerId}`
  );
}
export function getAdvancesSummaryById(clickId,id) {
    return axiosCommon.get(
      `payments/advances/ledger/caId/${clickId}/partyId/${id}?writerId=${writerId}`
    );
  }
export default { getAdvances,getAdvancesSummaryById };
