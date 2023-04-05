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
export function customDetailedAvances(clickId, partyId, fromDate, toDate){
  return axiosCommon.get(
    `payments/advances/ledger/caId/${clickId}/partyId/${partyId}?fromDate=${fromDate}&toDate=${toDate}&writerId=${writerId}`
  )
}

export function addAdvanceRecord(advanceRecordReq){
  return axiosCommon.post(
    `payments/advances/record`,advanceRecordReq
  )
}
export default { getAdvances,getAdvancesSummaryById,customDetailedAvances };
