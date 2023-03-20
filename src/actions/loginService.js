import axios from 'axios';
import axiosCommon from "../axios";
export function doLogin(obj) {
    return axiosCommon.post('/account/click/sign-in', obj);
}
export function validateOTP(obj) {
    return axiosCommon.post('/account/click/sign-in/validate',obj);
}
export function langSelection() {
    return axiosCommon.get('/account/common/langs');
}
export function createProfile(obj) {
    return axiosCommon.post('/account/click/profile', obj);
}
export function saveCropPreference(obj,clickId) {
    return axiosCommon.post(`/account/preferences/caId/${clickId}`, obj);
}
export function completeMandiSetup(obj, clickId){
    return axiosCommon.post(`/account/business/onboard/clickId/${clickId}`, obj);
}
export function editMandiSetup(obj, clickId){
    return axiosCommon.put(`/account/business/onboard/clickId/${clickId}`, obj);
}
export function getAllMarkets(){
    return axiosCommon.get('/common/markets');
}
export default {doLogin, validateOTP, langSelection, createProfile}