import React, { Component } from "react";
import NoDataAvailable from "../../components/noDataAvailable";
import OutlineButton from "../../components/outlineButton";
import { Link } from "react-router-dom";

class SmartBoard extends Component {
  componentDidMount() {
    this.setState({ title: "Smartboard" });
  }

  render() {
    return (
      <div>
        <div className="main_div_padding">
          <div className="container-fluid px-0">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item active">
                <a
                  className="nav-link active"
                  href="#daily"
                  role="tab"
                  aria-controls="home"
                  data-bs-toggle="tab"
                >
                  Daily
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#weekly"
                  role="tab"
                  aria-controls="profile"
                  data-bs-toggle="tab"
                >
                  Weekly
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#messages"
                  role="tab"
                  aria-controls="messages"
                  data-bs-toggle="tab"
                >
                  Monthly
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#settings"
                  role="tab"
                  aria-controls="settings"
                  data-bs-toggle="tab"
                >
                  Yearly
                </a>
              </li>
            </ul>
            <div className="tab-content ps-0">
              <div
                className="tab-pane active"
                id="home"
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                <div className="row">
                  {/* left side */}
                  <div className="col-lg-9 ps-0">
                    <div className="outstanding_balance margin_bottom mt-4">
                      <h4 className="smartboard_main_header">
                        Outstanding Balances
                      </h4>
                      <div className="row">
                        <div className="col-lg-6 ps-0">
                          <div className="card pending_rec_card green_card">
                            hii
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="card pending_pay_card warning_card">
                            hloo
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="outstanding_balance margin_bottom">
                  <h4 className="smartboard_main_header">
                    Outstanding Balances
                  </h4>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="card pending_rec_card green_card">
                        hii
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="card pending_pay_card warning_card">
                        hloo
                      </div>
                    </div>
                  </div>
                </div> */}
                    {/* <div className="reports_cards margin_bottom">
                  <div className="row margin_bottom">
                    <div className="col-lg-6 col_left">
                      <h4 className="smartboard_main_header">Sales Reports</h4>
                      <div className="card default_card">hii</div>
                    </div>
                    <div className="col-lg-6 col_right">
                      <h4 className="smartboard_main_header">
                        Purchase Reports
                      </h4>
                      <div className="card default_card">hloo</div>
                    </div>
                  </div>
                  <div className="row margin_bottom">
                    <div className="col-lg-6 col_left">
                      <div className="card default_card">hii</div>
                    </div>
                    <div className="col-lg-6 col_right">
                      <div className="card default_card">hloo</div>
                    </div>
                  </div>
                  <div className="row margin_bottom">
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
                  </div>
                </div> */}
                    {/* <NoDataAvailable /> */}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default SmartBoard;
