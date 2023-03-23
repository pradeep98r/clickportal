
import axiosCommon from "../axios";
const loginData = JSON.parse(localStorage.getItem("loginResponse"));
var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
export function getTransporters(clickId) {
    return axiosCommon.get(`/click/ledgers/caId/${clickId}/type/TRANS?writerId=${writerId}`);
}
//get Particular Transporter
export function getParticularTransporter(clickId, partyId){
    return axiosCommon.get(`/reports/transporter-ledger/caId/${clickId}/partyId/${partyId}?writerId=${writerId}`);
}
//get Inventory Ledger
export function getInventoryLedgers(clickId,transId){
    return axiosCommon.get(`/account/transporter/detailed/caId/${clickId}/transId/${transId}?period=YEARLY?writerId=${writerId}`);
}
//add record payment
export function postRecordPayment(request){
    return axiosCommon.post(`/click/ledgers/payment/record`,request);
}
//add record inventory
export function addRecordInventory(inventoryRequest){
    return axiosCommon.post(`/account/transporter/record/inventory`, inventoryRequest);
}
// get Inventory
export function getInventory(clickId, transId){
    return axiosCommon.get(`/account/transporter/caId/${clickId}/transId/${transId}?writerId=${writerId}`);
}
export default {
    getTransporters,
    getParticularTransporter,
    getInventoryLedgers,
    postRecordPayment,
    addRecordInventory,
    getInventory
}