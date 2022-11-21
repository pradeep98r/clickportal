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
export function getBuyBills(clickId,date) {
  return axiosCommon.get(
    `/click/bills/buy-bills/caId/${clickId}?fromDate=2022-11-16&toDate=2022-11-16`
  );
}
export function getSellBills(clickId) {
  return axiosCommon.get(
    `/click/bills/sell-bills/caId/${clickId}?fromDate=2022-08-19&toDate=2022-08-19`
  );
}
export function editPartnerItem(obj) {
  return axiosCommon.put(`/account/partners`, obj);
}
export function getPartnerData(clickId, type) {
  return axiosCommon.get(`/account/partners/caId/${clickId}/partyType/${type}`);
}
export function getBuyerLedgers(clickId, clientId, clientSecret) {
  return axiosCommon.get(`/click/ledgers/caId/${clickId}/type/BUYER`);
}

export function getLedgerSummary(clickId, partyId, clientId, clientSecret) {
  return axiosCommon.get(
    `/account/reports/ledger/summary/caId/${clickId}/partyId/${partyId}`
  );
}

export function getLedgerSummaryByDate(clickId,partyId,fromDate,toDate,clientId,clientSecret){
  return axiosCommon.get(
    `/account/reports/ledger/summary/caId/${clickId}/partyId/${partyId}?fromDate=${fromDate}&toDate=${toDate}`
  );
}
export function getDetailedLedgerByDate(clickId,partyId,fromDate,toDate,clientId,clientSecret){
  return axiosCommon.get(
    `/account/reports/buyer-ledger/caId/${clickId}/partyId/${partyId}?fromDate=${fromDate}&toDate=${toDate}`
  );
}

export function getSellerDetailedLedgerByDate(clickId,partyId,fromDate,toDate,clientId,clientSecret){
  return axiosCommon.get(
    `/account/reports/seller-ledger/caId/${clickId}/partyId/${partyId}?fromDate=${fromDate}&toDate=${toDate}`
  );
}

export function getBuyerDetailedLedger(
  clickId,
  partyId,
) {
  return axiosCommon.get(
    `/account/reports/buyer-ledger/caId/${clickId}/partyId/${partyId}`
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
    `/account/reports/seller-ledger/caId/${clickId}/partyId/${partyId}`
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
export function postsellbillApi(billRequestObj) {
  console.log(billRequestObj,"object");
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
  postbuybillApi
};
