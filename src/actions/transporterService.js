
import axiosCommon from "../axios";
const loginData = JSON.parse(localStorage.getItem("loginResponse"));
var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
export function getTransporters(clickId) {
    return axiosCommon.get(`/click/ledgers/caId/${clickId}/type/TRANS?writerId=${writerId}`);
}
export function getInventorySummary(clickId) {
    return axiosCommon.get(`/account/transporter/caId/${clickId}?writerId=${writerId}`);
}
//get Particular Transporter
export function getParticularTransporter(clickId, partyId){
    return axiosCommon.get(`/reports/transporter-ledger/caId/${clickId}/partyId/${partyId}?writerId=${writerId}`);
}
//get Inventory Ledger
export function getInventoryLedgers(clickId,transId){
    return axiosCommon.get(`/account/transporter/detailed/caId/${clickId}/transId/${transId}?period=YEARLY&writerId=${writerId}`);
}

//add record inventory
export function addRecordInventory(inventoryRequest){
    return axiosCommon.post(`/account/transporter/record/inventory`, inventoryRequest);
}
// get Inventory
export function getInventory(clickId, transId){
    return axiosCommon.get(`/account/transporter/caId/${clickId}/transId/${transId}?writerId=${writerId}`);
}
export function getInventoryListById(clickId,transId,billId){
    return axiosCommon.get(
      `/account/transporter/caId/${clickId}/transId/${transId}/refId/${billId}?writerId=${writerId}`
    );
  }
//Update Record Inventory
export function updateRecordInventory(updateInventoryReq){
    return axiosCommon.put(`/account/transporter/record/inventory`, updateInventoryReq);
}
//   https://dev-api.onoark.com/v1/account/transporter/caId/{caId}/transId/{transId}/refId/{refId}
export default {
    getTransporters,
    getParticularTransporter,
    getInventoryLedgers,
    addRecordInventory,
    getInventory,
    getInventoryListById,
    updateRecordInventory
}