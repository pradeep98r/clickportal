import React from "react";
import { useSelector } from "react-redux";
import NoDataAvailable from "../../components/noDataAvailable";
import CommonSummary from "./common_summary";
import CoolieRentSummary from "./coolie_rent";
import PaidRcvdSummary from "./paid_rcvd";
import TransporterSummary from "./trans_summary";

const DailySummary = () => {
  const reportsData = useSelector((state) => state.reportsInfo);
  const dailySummaryInfo = reportsData?.dailySummaryData;
  console.log(dailySummaryInfo, "dailySummaryInfo");
  return (
    <div className="main_div_padding p-0">
      <div className="container-fluid px-0">
        {dailySummaryInfo != null ? (
          <div>
            <div className="row">
              <div className="col-lg-6">
                <p className="daily_sum_head">Sales Summary</p>
                <CommonSummary
                  summaryData={dailySummaryInfo?.salesSummary}
                  type="BUYER"
                />
              </div>
              <div className="col-lg-6">
                <p className="daily_sum_head">Purchase Summary</p>
                <CommonSummary
                  summaryData={dailySummaryInfo?.purchaseSummary}
                  type="SELLER"
                />
              </div>
            </div>
            <div className="row row_top_margin">
              <div className="col-lg-6">
                <p className="daily_sum_head">Total Received</p>
                <PaidRcvdSummary
                  summaryData={dailySummaryInfo?.salesPaymentSummary}
                  type="BUYER"
                />
              </div>
              <div className="col-lg-6">
                <p className="daily_sum_head">Total Paid</p>
                <PaidRcvdSummary
                  summaryData={dailySummaryInfo?.purchasePaymentSumary}
                  type="SELLER"
                />
              </div>
            </div>
            <div className="row row_top_margin">
              <div className="col-lg-12">
                <p className="daily_sum_head">Transportation</p>
                <TransporterSummary
                  summaryData={dailySummaryInfo?.transportoSummary}
                />
              </div>
            </div>
            <div className="row row_top_margin">
              <div className="col-lg-6">
                <p className="daily_sum_head">Total Coolie</p>
                <CoolieRentSummary
                  summaryData={dailySummaryInfo?.coolieSummary}
                  fromComm = {false}
                />
              </div>
              <div className="col-lg-6">
                <p className="daily_sum_head">Rent ( Creats )</p>
                <CoolieRentSummary
                  summaryData={dailySummaryInfo?.rentSummary}
                  fromComm = {false}
                />
              </div>
            </div>
            <div className="row row_top_margin">
              <div className="col-lg-6">
                <p className="daily_sum_head">Sales Commission Earned</p>
                <CoolieRentSummary
                  summaryData={dailySummaryInfo?.salesCommSummary}
                  fromComm = {true}
                  type="BUYER"
                />
              </div>
              <div className="col-lg-6">
                <p className="daily_sum_head">Purchase Commission Earned</p>
                <CoolieRentSummary
                  summaryData={dailySummaryInfo?.purchaseCommSummary}
                  fromComm = {true}
                  type="SELLER"
                />
              </div>
            </div>
          </div>
        ) : (
          <NoDataAvailable />
        )}
      </div>
    </div>
  );
};
export default DailySummary;
