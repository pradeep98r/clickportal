import axios from "axios";
import axiosCommon from "../axios";

export function getTransporters(clickId, clientId, clientSecret) {
    return axiosCommon.get(`/click/ledgers/caId/${clickId}/type/TRANS`);
}
//get Particular Transporter
export function getParticularTransporter(clickId, partyId, clientId, clientSecret){
    return axiosCommon.get(`/account/reports/ledger/summary/caId/${clickId}/partyId/${partyId}`);
}
//get Inventory Ledger
export function getInventoryLedgers(clickId,transId, clientId, clientSecret){
    return axiosCommon.get(`/account/transporter/detailed/caId/${clickId}/transId/${transId}?period=YEARLY`);
}
//add record payment
export function postRecordPayment(request, clientId, clientSecre){
    return axiosCommon.post(`/click/ledgers/payment/record`,request);
}
//add record inventory
export function addRecordInventory(inventoryRequest, clientId, clientSecret){
    return axiosCommon.post(`/account/transporter/record/inventory`, inventoryRequest);
}
// get Inventory
export function getInventory(clickId, transId, clientId,clientSecret){
    return axiosCommon.get(`/account/transporter/caId/${clickId}/transId/${transId}`);
}
export default {
    getTransporters,
    getParticularTransporter,
    getInventoryLedgers,
    postRecordPayment,
    addRecordInventory,
    getInventory
}