import axios from "axios";
import axiosCommon from "../axios";

export function uploadProfilePic(clickId,mobile,req){
    return axiosCommon.put(`/common/profile/caId/${clickId}/mobile/${mobile}`,req,{ headers: {
        "Content-Type": "multipart/form-data",
        "Accept": "application/json",
        "type": "formData"
      }});
}
export default{
    uploadProfilePic
}