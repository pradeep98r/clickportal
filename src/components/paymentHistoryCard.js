import React from "react";
const PaymentHistoryCard = ({ title1, title2, title3, title1Data, title2Data, title3Data }) => (
    <div className="partyDetails">
    <div className="row justify-content-between align-items-center">
      <div className="col-lg-4 p-0">
        <h6>{title1}</h6>
        <h5>{title1Data}</h5>
      </div>
      <div className="col-lg-5 p-0">
        <h6>{title2}</h6>
        <h5>{title2Data}</h5>
      </div>
      <div className="col-lg-3 p-0">
        <h6>{title3}</h6>
        <h5>{title3Data}</h5>
      </div>
    </div>
  </div>
  );
  export default PaymentHistoryCard;