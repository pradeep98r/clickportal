import axios from "axios";
function postPreferenceApi(cropObj) {
  console.log(cropObj,"object");
  return axios.post(
    "https://dev-api.onoark.com/v1/account/preferences/caId/330",
    cropObj,
    {
      headers: {
        "Content-Type": "application/json",
        "client-id": "PeqmzQI0jUYreMz",
        "client-secret": "gkkr4DUWw21jv9674qTgAcbP1",
      },
    }
  );
}

export default postPreferenceApi;
