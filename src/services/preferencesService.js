// import axios from "axios";
// function postPreferenceApi(cropObj) {
//   return axios.post(
//     "https://dev-api.onoark.com/v1/account/preferences/caId/369",
//     cropObj,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         "client-id": "DvrChblAdRtHPGE",
//         "client-secret": "KgXvYkzDuOnaLTPO9bY56EYkH",
//       },
//     }
//   );
// }

import axios from "axios";

function postbuybillApi(billRequestObj,clientId,clientSecret) {
  console.log(billRequestObj,"object");
  return axios.post(
    "https://dev-api.onoark.com/v1/click/bills/buy-bill ",
    billRequestObj,
    {
      headers: {
        "Content-Type": "application/json",
        "client-id": clientId,
        "client-secret": clientSecret,
      },
    }
  );
}

export default postbuybillApi;

