import React, { Component, useState } from "react";
import NoDataAvailable from "../../components/noDataAvailable";
import { getSmartboardData } from "../../actions/smartBoardService";
import OutlineButton from "../../components/outlineButton";
import { Link } from "react-router-dom";
import "../smartboard/smartboard.scss";
const SmartBoard = () => {
  const [tabType, setTabType] = useState("Daily");
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const [smartboardData, setSmartboardData] = useState({});
  const [outStandingBal, setOutStandingBal] = useState({});
  const [salesReprtData, setsalesReprtData] = useState({});
  const [purchaseReprtData, setpurchaseReprtData] = useState({});
  const [sellRecentTxs, setsellRecentTxs] = useState([]);
  const links = [
    {
      id: 1,
      name: "Daily",
      to: "Daily",
    },
    {
      id: 2,
      name: "Weekly",
      to: "Weekly",
    },
    {
      id: 3,
      name: "Monthly",
      to: "Monthly",
    },
    {
      id: 4,
      name: "Yearly",
      to: "Yearly",
    },
  ];
  const tabChange = (type) => {
    setTabType(type);
    getSmartboardData(clickId, type)
      .then((response) => {
        console.log(response.data, "smartboard data");
        const data = response.data.data;
        setSmartboardData(data);
        setOutStandingBal(data.outStandingBal);
        setsalesReprtData(data.salesReprtData);
        setpurchaseReprtData(data.purchaseReprtData);
        const arr = data.sellRecentTxs.slice(0, 2);
        setsellRecentTxs(arr);
        console.log(arr);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            {links.map((link) => {
              return (
                <li key={link.id} className="nav-item ">
                  <a
                    className={
                      "nav-link" + (tabType == link.to ? " active" : "")
                    }
                    href={"#" + tabType}
                    role="tab"
                    aria-controls="home"
                    data-bs-toggle="tab"
                    onClick={() => tabChange(link.to)}
                  >
                    {link.name}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="tab-content ps-0 pt-3">
            <div
              className="tab-pane active"
              id={tabType}
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              {smartboardData != null ? (
                // {tabType}
                <div className="row">
                  {/* left side */}
                  <div className="col-lg-9 smartboard_div p-0">
                    <div className="outstanding_balance margin_bottom">
                      <h4 className="smartboard_main_header">
                        Outstanding Balances
                      </h4>
                      <div className="row">
                        <div className="col-lg-6 p-0">
                          <div className="card pending_rec_card green_card">
                            <div className="row">
                              <div className="col-lg-6 col_left_border">
                                <h5 className="color_head_subtext">
                                  Pending Receivables{" "}
                                </h5>
                                <h6 className="color_head_subtext">
                                  {outStandingBal.pendingRecievables}
                                </h6>
                                <p>See Buyer Ledger</p>
                              </div>
                              <div className="col-lg-6 col2">
                                <h5 className="color_head_subtext">
                                  Sell Bills{" "}
                                </h5>
                                <h6 className="color_head_subtext">
                                  {outStandingBal.totalSellBills}
                                </h6>
                                <p>See All</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="card pending_rec_card pending_pay_card warning_card">
                            <div className="row">
                              <div className="col-lg-6 col_left_border">
                                <h5 className="">Pending Payables </h5>
                                <h6 className="color_red">
                                  {outStandingBal.pendingPaybles}
                                </h6>
                                <p className="color_blue">See Buyer Ledger</p>
                              </div>
                              <div className="col-lg-6 col2">
                                <h5 className="">Buy Bills </h5>
                                <h6 className="">
                                  {outStandingBal.totalBuyBills}
                                </h6>
                                <p className="color_blue">See All</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="reports_cards margin_bottom">
                      <div className="row margin_bottom">
                        <div className="col-lg-6 col_left">
                          <h4 className="smartboard_main_header">
                            Sales Reports
                          </h4>
                          <div className="card default_card">
                            <div className="row">
                              <div className="col-lg-6 col_left_border">
                                <h5 className="">Total Sales </h5>
                                <h6 className="">
                                  {salesReprtData.totalBusiness}
                                </h6>
                              </div>
                              <div className="col-lg-6 col2">
                                <h5 className="">Total Quantity </h5>
                                <h6 className="">
                                  {salesReprtData.totalUnits}
                                </h6>
                              </div>
                            </div>
                            <div className="row top_border">
                              <p className="color_blue text-center">See All</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col_right">
                          <h4 className="smartboard_main_header">
                            Purchase Reports
                          </h4>
                          <div className="card default_card">
                            <div className="row">
                              <div className="col-lg-6 col_left_border">
                                <h5 className="">Total Purchases </h5>
                                <h6 className="">
                                  {purchaseReprtData.totalBusiness}
                                </h6>
                              </div>
                              <div className="col-lg-6 col2">
                                <h5 className="">Total Quantity </h5>
                                <h6 className="">
                                  {purchaseReprtData.totalUnits}
                                </h6>
                              </div>
                            </div>
                            <div className="row top_border">
                              <p className="color_blue text-center">See All</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row margin_bottom">
                        <div className="col-lg-6 col_left">
                          <div className="card default_card">Sales by Crop</div>
                        </div>
                        <div className="col-lg-6 col_right">
                          <div className="card default_card">
                            Purchase by Crop
                          </div>
                        </div>
                      </div>
                      <div className="row margin_bottom">
                        <div className="col-lg-6 col_left">
                          <div className="card default_card">
                            Sales By Buyer
                          </div>
                        </div>
                        <div className="col-lg-6 col_right">
                          <div className="card default_card">
                            Purchase by Seller
                          </div>
                        </div>
                      </div>
                      {/* <div className="row margin_bottom">
                      <div className="col-lg-6 col_left">
                        <div className="card default_card">
                          <OwlCarousel
                            items={2}
                            className="owl-theme"
                            margin={20}
                            loop
                            dots
                          >
                            <div className="item">hlooo</div>
                            <div className="item">hii</div>
                            <div className="item">hey</div>
                            <div className="item">hey hi</div>
                          </OwlCarousel>
                        </div>
                      </div>
                      <div className="col-lg-6 col_right">
                        <div className="card default_card">hloo</div>
                      </div>
                    </div> */}
                    </div>
                    <div className="reports_cards margin_bottom">
                      <h4 className="smartboard_main_header">
                        Recent Transactions
                      </h4>
                      <div className="row margin_bottom">
                        <div className="col-lg-6 col_left">
                          <h4 className="trans_title">Buy Transactions</h4>
                          <div className="card default_card transaction_card p-0">
                            <div className="card_header">
                              <div className="row">
                                <div className="col-lg-4">
                                  <h5 className="table_haed">Name</h5>
                                </div>
                                <div className="col-lg-4">
                                  <h5 className="table_haed">Paid</h5>
                                </div>
                                <div className="col-lg-4">
                                  <h5 className="table_haed">To Be Paid</h5>
                                </div>
                              </div>
                            </div>
                            <div className="card_body">
                              {sellRecentTxs.map((item, index) => {
                                return (
                                  <div className="row card_row" key={index}>
                                    <div className="col-lg-4">
                                      <div className="d-flex">
                                        <div>
                                          <h4>{item.buyerName}</h4>
                                          <h4>Bill No {item.billId}</h4>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-4">
                                      <div>
                                        <h4>{item.pastBal}</h4>
                                        <h4>Past Balance</h4>
                                      </div>
                                    </div>
                                    <div className="col-lg-4">
                                      <div>
                                        <h4 className="color_green">{item.totalReceivable}</h4>
                                        <h4 className="color_green">{item.pastBal}</h4>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                              <div className="d-flex justify-content-between out_standing_div">
                                <p className="out_standing_text">Total Outstanding Payables: </p>
                                <p className="out_standing_text color_red"> ₹19,080.00</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col_right">
                          <h4 className="trans_title">Sell Transactions</h4>
                          <div className="card default_card"></div>
                        </div>
                      </div>
                    </div>
                   
                  </div>
                  {/* right side */}
                  <div className="col-lg-3">
                    <div className="smartboard_right_cards">
                      <div className="comission margin_bottom">
                        <h4 className="smartboard_main_header">
                          My Commissions
                        </h4>
                        <div className="card default_card">
                          <Link to="/buy_bill_book">
                            <OutlineButton text="Add Purchase Bill" />
                          </Link>
                        </div>
                      </div>
                      <div className="margin_bottom">
                        <h4 className="smartboard_main_header">
                          Quick Actions
                        </h4>
                        <div className="card default_card">hii</div>
                      </div>
                    </div>
                    <NoDataAvailable />
                  </div>
                </div>
              ) : (
                <NoDataAvailable />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartBoard;
