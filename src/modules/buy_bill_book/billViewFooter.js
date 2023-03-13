import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import { useSelector } from "react-redux";
const BillViewFooter = (props) => {
  var billViewData = useSelector((state) => state.billViewInfo);
  
  const [billData, setBillViewData] = useState(billViewData.billViewInfo);
  useEffect(() => {
    setBillViewData(JSON.parse(localStorage.getItem("billData")));
  }, [props]);
  return (
    <div className="row">
      <div className="col-lg-6">
        <p className="ono-footer">
          ONO-{moment(billData?.billDate).format("DDMMYYYY")}
          -CLICK-
          {billData?.partyType === "BUYER"
            ? billData?.actualReceivable.toFixed(2)
            : billData?.actualPaybles.toFixed(2)}
        </p>
      </div>
    </div>
  );
};
export default BillViewFooter;
