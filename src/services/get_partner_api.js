import axios from "axios";

export default {
  getPartnerData: () =>
    axios({
      method: "GET",
      url: "https://dev-api.onoark.com/v1/account/partners/caId/369/partyType/BUYER",
      headers: {
        "Content-Type": "application/json",
        "client-id": "DvrChblAdRtHPGE",
        "client-secret": "KgXvYkzDuOnaLTPO9bY56EYkH",
      },
    }),
    getPreferredCrops: ()=>
     axios({
      method: "GET",
      url: "https://dev-api.onoark.com/v1/account/preferences/caId/369/prefType/CROP",
      headers: {
        "Content-Type": "application/json",
        "client-id": "DvrChblAdRtHPGE",
        "client-secret": "KgXvYkzDuOnaLTPO9bY56EYkH",
      },
    }),
    getAllCrops:()=>axios({
      method:"GET",
      url:"https://dev-api.onoark.com/v1/account/common/crops",
      headers: {
        "Content-Type": "application/json",
        "client-id": "DvrChblAdRtHPGE",
        "client-secret": "KgXvYkzDuOnaLTPO9bY56EYkH",
      },
    }),
    getSystemSettings:()=>axios({
      method:"GET",
      url:"https://dev-api.onoark.com/v1/click/bcp-settings/caId/369",
      headers: {
        "Content-Type": "application/json",
        "client-id": "DvrChblAdRtHPGE",
        "client-secret": "KgXvYkzDuOnaLTPO9bY56EYkH",
      },
    })
};
