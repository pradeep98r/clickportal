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
export function getBuyBills(clickId) {
  return axiosCommon.get(
    `/click/bills/buy-bill/caId/${clickId}?fromDate=2022-01-01&toDate=2022-12-30`
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
  clientId,
  clientSecre
) {
  return axiosCommon.get(
    `/account/reports/buyer-ledger/caId/${clickId}/partyId/${partyId}`
  );
}

export function getSelleLedgers(clickId, clientId, clientSecre){
  return axiosCommon.get(
    `/click/ledgers/caId/${clickId}/type/SELLER`
  );
}

export function getSellerDetailedLedger(
  clickId,
  partyId,
  clientId,
  clientSecret
) {
  return axiosCommon.get(
    `/account/reports/seller-ledger/caId/${clickId}/partyId/${partyId}`
  );
}
export function getPreferredCrops(clickId, clientId, clientSecret) {
  return axios.get(
    `https://dev-api.onoark.com/v1/account/preferences/caId/${clickId}/prefType/CROP`,
    {
      headers: {
        "Content-Type": "application/json",
        "client-id": clientId,
        "client-secret": clientSecret,
      },
    }
  );
}
export function getAllCrops() {
  return axiosCommon.get("https://dev-api.onoark.com/v1/account/common/crops", {

  });
}
export function getSystemSettings(clickId) {
  return axiosCommon.get(
    `https://dev-api.onoark.com/v1/click/bcp-settings/caId/${clickId}`,
  );
}

export function getMandiDetails(clickId, clientId, clientSecret) {
  let config = {
    headers: {
      "Content-Type": "application/json",
      "client-id": clientId,
      "client-secret": clientSecret,
    },
  };
  return axios.get(
    `https://dev-api.onoark.com/v1/account/click/profiles/caId/${clickId}`,
    config
  );
}
export function postRecordPayment(addRecordPaymentReq, clientId, clientSecret) {
  return axiosCommon.post(
    `https://dev-api.onoark.com/v1/click/ledgers/payment/record`,
    addRecordPaymentReq
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
  getSellerDetailedLedgerByDate
};

// export function getBuyBills(clickId, clientId, clientSecret) {
//   let config = {
//     headers: {
//       "Content-Type": "application/json",
//       "client-id": clientId,
//       "client-secret": clientSecret,
//     },
//     params: { fromDate: "2022-06-27", toDate: "2022-06-27" },
//   }
//   return axios.get(
//     `https://dev-api.onoark.com/v1/click/bills/buy-bill/caId/${clickId}`,config
//   );
// }
