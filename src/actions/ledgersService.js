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
export default{
    getLedgers,
    getLedgerSummary,
    getBuyerDetailedLedger,
    getDetailedLedgerByDate,
    getSellerDetailedLedger,
    getSellerDetailedLedgerByDate
}