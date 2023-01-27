import axios from "axios";
import axiosCommon from "../axios";
export function addPartner(obj, clickId) {
  return axiosCommon.post(`/account/partners/caId/${clickId}`, obj);
}
export function deletePartnerId(partyId, clickId) {
  return axiosCommon.put(
    `/common/reset/caId/${clickId}/partyId/${partyId}?clearPartner=true`
  );
}
export function getBuyBills(clickId, fromDate, toDate) {
  return axiosCommon.get(
    `/click/bills/buy-bills/caId/${clickId}?fromDate=${fromDate}&toDate=${toDate}`
  );
}
export function getSellBills(clickId, fromDate, toDate) {
  return axiosCommon.get(
    `/click/bills/sell-bills/caId/${clickId}?fromDate=${fromDate}&toDate=${toDate}`
  );
}
export function editPartnerItem(obj) {
  return axiosCommon.put(`/account/partners`, obj);
}
export function getPartnerData(clickId, type) {
  return axiosCommon.get(`/account/partners/caId/${clickId}/partyType/${type}`);
}
export function getBuyerLedgers(clickId) {
  return axiosCommon.get(`/click/ledgers/caId/${clickId}/type/BUYER`);
}


export function getLedgerSummary(clickId, partyId, clientId, clientSecret) {
  return axiosCommon.get(
    `/reports/ledger/summary/caId/${clickId}/partyId/${partyId}`
  );
}

export function getLedgerSummaryByDate(clickId,partyId,fromDate,toDate,clientId,clientSecret){
  return axiosCommon.get(
    `/reports/ledger/summary/caId/${clickId}/partyId/${partyId}?fromDate=${fromDate}&toDate=${toDate}`
  );
}
export function getDetailedLedgerByDate(clickId,partyId,fromDate,toDate,clientId,clientSecret){
  return axiosCommon.get(
    `/reports/buyer-ledger/caId/${clickId}/partyId/${partyId}?fromDate=${fromDate}&toDate=${toDate}`
  );
}

export function getSellerDetailedLedgerByDate(clickId,partyId,fromDate,toDate,clientId,clientSecret){
  return axiosCommon.get(
    `/reports/seller-ledger/caId/${clickId}/partyId/${partyId}?fromDate=${fromDate}&toDate=${toDate}`
  );
}

export function getBuyerDetailedLedger(
  clickId,
  partyId,
) {
  return axiosCommon.get(
    `/reports/buyer-ledger/caId/${clickId}/partyId/${partyId}`
  );
}
export function getOutstandingBal(clickId,partyId,){
  return axiosCommon.get(
    `/click/ledgers/balance/caId/${clickId}/partyId/${partyId}`
  );
}
export function getSelleLedgers(clickId){
  return axiosCommon.get(
    `/click/ledgers/caId/${clickId}/type/SELLER`
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
export function getPreferredCrops(clickId) {
  return axiosCommon.get(
    `/account/preferences/caId/${clickId}/prefType/CROP`,
   
  );
}
export function getAllCrops() {
  return axiosCommon.get("https://dev-api.onoark.com/v1/account/common/crops", {

  });
}
export function getSystemSettings(clickId) {
  return axiosCommon.get(
    `/click/bcp-settings/caId/${clickId}`
  );
}

export function getDefaultSystemSettings(){
  return axiosCommon.get(
    `/click/bcp-settings`
  )
}

export function getMandiDetails(clickId) {
  return axiosCommon.get(
    `/account/click/profiles/caId/${clickId}`
  );
}
export function postRecordPayment(addRecordPaymentReq) {
  return axiosCommon.post(
    `/click/ledgers/payment/record`,
    addRecordPaymentReq
  );
}
export function postbuybillApi(billRequestObj) {
  console.log(billRequestObj,"object");
  return axiosCommon.post(
    "/click/bills/buy-bill",
    billRequestObj,  
  );
}
export function editbuybillApi(billRequestObj) {
  return axiosCommon.put(
    "/click/bills/sell-buy-bill",
    billRequestObj,  
  );
}
export function postsellbillApi(billRequestObj) {
  return axiosCommon.post(
    "/click/bills/sales-bill",
    billRequestObj,  
  );
}
export default {
  getPartnerData,
  getPreferredCrops,
  getAllCrops,
  getSystemSettings,
  getBuyBills,
  getMandiDetails,
  getBuyerLedgers,
  getLedgerSummary,
  getBuyerDetailedLedger,
  getSelleLedgers,
  getSellerDetailedLedger,
  postRecordPayment,
  getLedgerSummaryByDate,
  getDetailedLedgerByDate,
  getSellerDetailedLedgerByDate,
  postbuybillApi,
  getOutstandingBal
};
