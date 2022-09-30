import axios from 'axios';

export function doLogin(obj) {
    return axios.post('https://dev-api.onoark.com/v1/account/click/sign-in', obj);
}

export function validateOTP(obj) {
    return axios.post('https://dev-api.onoark.com/v1/account/click/sign-in/validate',obj);
}
export function langSelection() {
    return axios.get('https://dev-api.onoark.com/v1/account/common/langs');
}
export default {doLogin, validateOTP, langSelection}