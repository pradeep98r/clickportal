import axios from 'axios';

function doLogin(obj){
    return axios.post('https://dev-api.onoark.com/v1/account/click/sign-in',obj);
}

export default doLogin;