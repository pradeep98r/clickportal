import React, { useEffect } from "react";
import { getMandiDetails } from "../../services/billCreationService";
function BillView() {
  const billId = localStorage.getItem("billId");
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const clientId = loginData.authKeys.clientId;
  const clientSecret = loginData.authKeys.clientSecret;
  useEffect(() => {
    getBusinessDetails();
  }, []);
  const getBusinessDetails = () => {
    getMandiDetails(clickId, clientId, clientSecret)
      .then((response) => {
        console.log(response.data, "business");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="main_div_padding">
      <div className="container-fluid px-0">
        <div className="row">
          <div className="col-lg-7 col_left">
            <div className="bill_view_card">hii</div>
          </div>
          <div className="col-lg-5"></div>
        </div>
      </div>
    </div>
  );
}
export default BillView;
