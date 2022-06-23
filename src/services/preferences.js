import axios from "axios";
function postPreferenceApi(cropObj) {
  console.log(cropObj,"object");
  return axios.post(
    "https://dev-api.onoark.com/v1/account/preferences/caId/369",
    cropObj,
    {
      headers: {
        "Content-Type": "application/json",
        "client-id": "DvrChblAdRtHPGE",
        "client-secret": "KgXvYkzDuOnaLTPO9bY56EYkH",
      },
    }
  );
}

export default postPreferenceApi;
