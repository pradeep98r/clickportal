import axios from "axios";

export function getPartnerData(clickId, clientId, clientSecret) {
  return axios.get(
    `https://dev-api.onoark.com/v1/account/partners/caId/${clickId}/partyType/BUYER`,
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
    `https://dev-api.onoark.com/v1/click/bcp-settings/caId/${clickId}`,
    {
      headers: {
        "Content-Type": "application/json",
        "client-id": clientId,
        "client-secret": clientSecret,
      },
    }
  );
}
export default {
  getPartnerData,
  getPreferredCrops,
  getAllCrops,
  getSystemSettings,
};
