import axios from "axios";
import axiosCommon from "../axios";
const loginData = JSON.parse(localStorage.getItem("loginResponse"));
var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;

export function addPartner(obj, clickId) {
  return axiosCommon.post(`/account/partners/caId/${clickId}`, obj);
}
export function deletePartnerId(partyId, clickId) {
  return axiosCommon.put(
    `/common/reset/caId/${clickId}/partyId/${partyId}?clearPartner=true&writerId=${writerId}`
  );
}
export function getBuyBills(clickId, fromDate, toDate) {
  return axiosCommon.get(
    `/click/bills/buy-bills/caId/${clickId}?fromDate=${fromDate}&toDate=${toDate}&writerId=${writerId}`
  );
}
export function getSellBills(clickId, fromDate, toDate) {
  return axiosCommon.get(
    `/click/bills/sell-bills/caId/${clickId}?fromDate=${fromDate}&toDate=${toDate}&writerId=${writerId}`
  );
}
export function editPartnerItem(obj) {
  return axiosCommon.put(`/account/partners`, obj);
}
export function getPartnerData(clickId, type) {
  return axiosCommon.get(
    `/account/partners/caId/${clickId}/partyType/${type}?writerId=${writerId}`
  );
}
export function getBuyerLedgers(clickId) {
  return axiosCommon.get(
    `/click/ledgers/caId/${clickId}/type/BUYER?writerId=${writerId}`
  );
}

export function getLedgerSummary(clickId, partyId, clientId, clientSecret) {
  return axiosCommon.get(
    `/reports/ledger/summary/caId/${clickId}/partyId/${partyId}?writerId=${writerId}`
  );
}

export function getLedgerSummaryByDate(clickId, partyId, fromDate, toDate) {
  return axiosCommon.get(
    `/reports/ledger/summary/caId/${clickId}/partyId/${partyId}?fromDate=${fromDate}&toDate=${toDate}?writerId=${writerId}`
  );
}
export function getDetailedLedgerByDate(clickId, partyId, fromDate, toDate) {
  return axiosCommon.get(
    `/reports/buyer-ledger/caId/${clickId}/partyId/${partyId}?fromDate=${fromDate}&toDate=${toDate}&writerId=${writerId}`
  );
}

export function getSellerDetailedLedgerByDate(
  clickId,
  partyId,
  fromDate,
  toDate
) {
  return axiosCommon.get(
    `/reports/seller-ledger/caId/${clickId}/partyId/${partyId}?fromDate=${fromDate}&toDate=${toDate}&writerId=${writerId}`
  );
}

export function getBuyerDetailedLedger(clickId, partyId) {
  return axiosCommon.get(
    `/reports/buyer-ledger/caId/${clickId}/partyId/${partyId}?writerId=${writerId}`
  );
}
export function getOutstandingBal(clickId, partyId) {
  return axiosCommon.get(
    `/click/ledgers/balance/caId/${clickId}/partyId/${partyId}?writerId=${writerId}`
  );
}
export function getSelleLedgers(clickId) {
  return axiosCommon.get(
    `/click/ledgers/caId/${clickId}/type/SELLER?writerId=${writerId}`
  );
}

export function getSellerDetailedLedger(clickId, partyId) {
  return axiosCommon.get(
    `/reports/seller-ledger/caId/${clickId}/partyId/${partyId}?writerId=${writerId}`
  );
}
export function getPreferredCrops(clickId) {
  return axiosCommon.get(
    `/account/preferences/caId/${clickId}/prefType/CROP?writerId=${writerId}`
  );
}
export function getAllCrops() {
  return axiosCommon.get(`/account/common/crops?writerId=${writerId}`, {});
}
export function getSystemSettings(clickId) {
  return axiosCommon.get(
    `/click/bcp-settings/caId/${clickId}?writerId=${writerId}`
  );
}

export function getDefaultSystemSettings() {
  return axiosCommon.get(`/click/bcp-settings`);
}

export function getMandiDetails(clickId) {
  return axiosCommon.get(
    `/account/click/profiles/caId/${clickId}?writerId=${writerId}`
  );
}

export function getMandiLogoDetails(clickId) {
  return axiosCommon.get(
    `/click/bcp-settings/pdf/setting/caId/${clickId}?writerId=${writerId}`
  );
}

export function postbuybillApi(billRequestObj) {
  return axiosCommon.post("/click/bills/buy-bill", billRequestObj);
}
export function editbuybillApi(billRequestObj) {
  console.log("/click/sell");
  return axiosCommon.put("/click/bills/sell-buy-bill", billRequestObj);
}
export function postsellbillApi(billRequestObj) {
  return axiosCommon.post("/click/bills/sales-bill", billRequestObj);
}
export function getGeneratedBillId(obj) {
  return axiosCommon.post("/click/bills/generate", obj);
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
  getLedgerSummaryByDate,
  getDetailedLedgerByDate,
  getSellerDetailedLedgerByDate,
  postbuybillApi,
  getOutstandingBal,
  getGeneratedBillId,
};
