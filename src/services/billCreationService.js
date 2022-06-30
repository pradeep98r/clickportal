import axios from "axios";

export function getPartnerData(clickId, clientId, clientSecret) {
  return axios.get(
    `https://dev-api.onoark.com/v1/account/partners/caId/${clickId}/partyType/FARMER`,
    {
      headers: {
        "Content-Type": "application/json",
        "client-id": clientId,
        "client-secret": clientSecret,
      },
    }
  );
}
export function getPreferredCrops(clickId, clientId, clientSecret) {
  return axios.get(
    `https://dev-api.onoark.com/v1/account/preferences/caId/${clickId}/prefType/CROP`,
    {
      headers: {
        "Content-Type": "application/json",
        "client-id": clientId,
        "client-secret": clientSecret,
      },
    }
  );
}
export function getAllCrops(clientId, clientSecret) {
  return axios.get("https://dev-api.onoark.com/v1/account/common/crops", {
    headers: {
      "Content-Type": "application/json",
      "client-id": clientId,
      "client-secret": clientSecret,
    },
  });
}
export function getSystemSettings(clickId, clientId, clientSecret) {
  return axios.get(
    `https://dev-api.onoark.com/v1/click/bcp-settings/caId/371`,
    {
      headers: {
        "Content-Type": "application/json",
        "client-id": 'klT68w3ey9apljo',
        "client-secret": 'cqFHj2glsqVLHq0bA80zmNqzu',
      },
    }
  );
}
export function getBuyBills(clickId, clientId, clientSecret) {
  let config = {
    headers: {
      "Content-Type": "application/json",
      "client-id": 'klT68w3ey9apljo',
      "client-secret": 'cqFHj2glsqVLHq0bA80zmNqzu',
    },
    // params: { fromDate: "2022-06-27", toDate: "2022-06-27" },
  }
  return axios.get(
    ' https://dev-api.onoark.com/v1/click/bills/buy-bill/caId/371?fromDate=2022-06-28&toDate=2022-06-28',
    config
  );
}
export function getMandiDetails(clickId, clientId, clientSecret){
  let config = {
    headers: {
      "Content-Type": "application/json",
      "client-id": clientId,
      "client-secret": clientSecret,
    },
  }
  return axios.get(
    `https://dev-api.onoark.com/v1/account/click/profiles/caId/${clickId}`, config
  );
}
export default {
  getPartnerData,
  getPreferredCrops,
  getAllCrops,
  getSystemSettings,
  getBuyBills,
  getMandiDetails
};

// export function getBuyBills(clickId, clientId, clientSecret) {
//   let config = {
//     headers: {
//       "Content-Type": "application/json",
//       "client-id": clientId,
//       "client-secret": clientSecret,
//     },
//     params: { fromDate: "2022-06-27", toDate: "2022-06-27" },
//   }
//   return axios.get(
//     `https://dev-api.onoark.com/v1/click/bills/buy-bill/caId/${clickId}`,config
//   );
// }