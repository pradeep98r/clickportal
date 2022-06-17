import axios from "axios";

export default {
  getPartnerData: () =>
    axios({
      method: "GET",
      url: "https://dev-api.onoark.com/v1/account/partners/caId/330/partyType/BUYER",
      headers: {
        "Content-Type": "application/json",
        "client-id": "PeqmzQI0jUYreMz",
        "client-secret": "gkkr4DUWw21jv9674qTgAcbP1",
      },
    }),
    getPreferredCrops: ()=>
     axios({
      method: "GET",
      url: "https://dev-api.onoark.com/v1/account/preferences/caId/330/prefType/CROP",
      headers: {
        "Content-Type": "application/json",
        "client-id": "PeqmzQI0jUYreMz",
        "client-secret": "gkkr4DUWw21jv9674qTgAcbP1",
      },
    }),
    getAllCrops:()=>axios({
      method:"GET",
      url:"https://dev-api.onoark.com/v1/account/common/crops",
      headers: {
        "Content-Type": "application/json",
        "client-id": "PeqmzQI0jUYreMz",
        "client-secret": "gkkr4DUWw21jv9674qTgAcbP1",
      },
    })
};
