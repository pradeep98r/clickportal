import axios from "axios";
import axiosCommon from "../axios";
const loginData = JSON.parse(localStorage.getItem("loginResponse"));
var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
export function getAllPlans(){
    return axiosCommon.get(
        `/payments/subscription?writerId=${writerId}`
    )
}
export function getPromotions(clickId){
    return axiosCommon.get(
        `/payments/subscription/promotions/caId/${clickId}?writerId=${writerId}`
    )
}