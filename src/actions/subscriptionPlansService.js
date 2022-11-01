import axios from "axios";
import axiosCommon from "../axios";

export function getAllPlans(){
    return axiosCommon.get(
        `/payments/subscription`
    )
}
export function getPromotions(clickId, clientId, clientSecret){
    return axiosCommon.get(
        `/payments/subscription/promotions/caId/${clickId}`
    )
}