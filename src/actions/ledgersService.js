import axios from "axios";
import axiosCommon from "../axios";
const loginData = JSON.parse(localStorage.getItem("loginResponse"));
var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
export function getLedgers(clickId, type, fromDate, toDate) {
    return axiosCommon.get(
        `/click/ledgers/caId/${clickId}/type/${type}?fromDate=${fromDate}&toDate=${toDate}&writerId=${writerId}`
    );
}
export function getLedgerSummary(clickId, partyId) {
    return axiosCommon.get(
      `/reports/ledger/summary/caId/${clickId}/partyId/${partyId}?writerId=${writerId}`
    );
  }
export function getBuyerDetailedLedger(clickId,partyId) {
    return axiosCommon.get(
      `/reports/buyer-ledger/caId/${clickId}/partyId/${partyId}?writerId=${writerId}`
    );
}
export function getSellerDetailedLedger(
  clickId,
  partyId,
) {
  return axiosCommon.get(
    `/reports/seller-ledger/caId/${clickId}/partyId/${partyId}?writerId=${writerId}`
  );
}
export function getLedgerSummaryByDate(clickId,partyId,fromDate,toDate){
  return axiosCommon.get(
    `/reports/ledger/summary/caId/${clickId}/partyId/${partyId}?fromDate=${fromDate}&toDate=${toDate}&writerId=${writerId}`
  );
}
export function getDetailedLedgerByDate(clickId,partyId,fromDate,toDate){
  return axiosCommon.get(
    `/reports/buyer-ledger/caId/${clickId}/partyId/${partyId}?fromDate=${fromDate}&toDate=${toDate}&writerId=${writerId}`
  );
}
export function getSellerDetailedLedgerByDate(clickId,partyId,fromDate,toDate){
  return axiosCommon.get(
    `/reports/seller-ledger/caId/${clickId}/partyId/${partyId}?fromDate=${fromDate}&toDate=${toDate}&writerId=${writerId}`
  );
}

export function getOutstandingBal(clickId,partyId,){
  return axiosCommon.get(
    `/click/ledgers/balance/caId/${clickId}/partyId/${partyId}?writerId=${writerId}`
  );
}
export function getBuyBillId(clickId,billId){
  return axiosCommon.get(
    `/click/bills/buy-bill/caId/${clickId}/billId/${billId}?writerId=${writerId}`
  );
}
export function getSellBillId(clickId,billId){
  return axiosCommon.get(
    `/click/bills/sales-bill/caId/${clickId}/billId/${billId}?writerId=${writerId}`
  );
}
export function getPaymentListById(clickId,billId){
  return axiosCommon.get(
    `/click/ledgers/caId/${clickId}/refId/${billId}?writerId=${writerId}`
  );
}

export function getAdvanceListById(clickId,billId,partyId){
  return axiosCommon.get(
    `/payments/advances/ledger/caId/${clickId}/partyId/${partyId}/refId/${billId}?writerId=${writerId}`
  );
}

export function getBillHistoryListById(clickId,billId,type){
  return axiosCommon.get(
    `/click/bills/history/caId/${clickId}/refId/${billId}/type/${type}?writerId=${writerId}`
  );
}

export function getListOfBillIds(clickId, partyId,fromDate, toDate){
  return axiosCommon.get(
    `/common/bills/caId/${clickId}/partyId/${partyId}?fromDate=${fromDate}&toDate=${toDate}&writerId=${writerId}`
  )
}

export function postRecordPayment(addRecordPaymentReq) {
  return axiosCommon.post(
    `/click/ledgers/payment/record`,
    addRecordPaymentReq
  );
}

export function updateRecordPayment(updateRecordPaymentReq){
  return axiosCommon.put(
    `/click/ledgers/payment/record`,
    updateRecordPaymentReq
  );
}
export function deleteAdvancePayment(advanceDeleteObject){
  return axiosCommon.put(
    `/payments/advances/cancel`,
    advanceDeleteObject
  );
}
export default{
    getLedgers,
    getLedgerSummary,
    getBuyerDetailedLedger,
    getDetailedLedgerByDate,
    getSellerDetailedLedger,
    getSellerDetailedLedgerByDate,
    getOutstandingBal,
    getBuyBillId,
    getSellBillId,
    getPaymentListById,
    getBillHistoryListById,
    getAdvanceListById,
    getListOfBillIds,
    postRecordPayment,
    updateRecordPayment,
    deleteAdvancePayment
}