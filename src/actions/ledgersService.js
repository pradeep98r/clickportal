import axios from "axios";
import axiosCommon from "../axios";

export function getLedgers(clickId, type) {
    return axiosCommon.get(
        `/click/ledgers/caId/${clickId}/type/${type}`
    );
}
export function getLedgerSummary(clickId, partyId) {
    return axiosCommon.get(
      `/reports/ledger/summary/caId/${clickId}/partyId/${partyId}`
    );
  }
export function getBuyerDetailedLedger(clickId,partyId) {
    return axiosCommon.get(
      `/reports/buyer-ledger/caId/${clickId}/partyId/${partyId}`
    );
}
export function getSellerDetailedLedger(
  clickId,
  partyId,
) {
  return axiosCommon.get(
    `/reports/seller-ledger/caId/${clickId}/partyId/${partyId}`
  );
}
export function getLedgerSummaryByDate(clickId,partyId,fromDate,toDate){
  return axiosCommon.get(
    `/reports/ledger/summary/caId/${clickId}/partyId/${partyId}?fromDate=${fromDate}&toDate=${toDate}`
  );
}
export function getDetailedLedgerByDate(clickId,partyId,fromDate,toDate){
  return axiosCommon.get(
    `/reports/buyer-ledger/caId/${clickId}/partyId/${partyId}?fromDate=${fromDate}&toDate=${toDate}`
  );
}
export function getSellerDetailedLedgerByDate(clickId,partyId,fromDate,toDate){
  return axiosCommon.get(
    `/reports/seller-ledger/caId/${clickId}/partyId/${partyId}?fromDate=${fromDate}&toDate=${toDate}`
  );
}
export function postRecordPayment(addRecordPaymentReq) {
  return axiosCommon.post(
    `/click/ledgers/payment/record`,
    addRecordPaymentReq
  );
}
export function getOutstandingBal(clickId,partyId,){
  return axiosCommon.get(
    `/click/ledgers/balance/caId/${clickId}/partyId/${partyId}`
  );
}
export function getBuyBillId(clickId,billId){
  return axiosCommon.get(
    `/click/bills/buy-bill/caId/${clickId}/billId/${billId}`
  );
}
export function getSellBillId(clickId,billId){
  return axiosCommon.get(
    `/click/bills/sales-bill/caId/${clickId}/billId/${billId}`
  );
}
export function getPaymentListById(clickId,billId){
  return axiosCommon.get(
    `/click/ledgers/caId/${clickId}/refId/${billId}`
  );
}
export default{
    getLedgers,
    getLedgerSummary,
    getBuyerDetailedLedger,
    getDetailedLedgerByDate,
    getSellerDetailedLedger,
    getSellerDetailedLedgerByDate,
    postRecordPayment,
    getOutstandingBal,
    getBuyBillId,
    getSellBillId,
    getPaymentListById
}