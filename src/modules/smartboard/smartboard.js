import React, { Component } from "react";
import TopNavigation from "../../components/top_navigation/top_navigation";
import SideNavigation from "../../components/side_navigation/side_navigation";
import NoDataAvailable from "../../components/no_data_available";
import OutlineButton from "../../components/outline_button";
import { Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

class SmartBoard extends Component {
  render() {
    return (
      <div>
        <div className="d-flex">
          <div className="side_div">
            <SideNavigation />
          </div>
          <div className="main_div">
            <TopNavigation heading="Smartboard"/>
            <div className="main_div_padding">
              <div className="container-fluid px-0">
                <div className="row">
                  {/* left side */}
                  <div className="col-lg-9 col_left">
                    <div className="mandi_setup card margin_bottom">
                      <div className="flex_class justify-content-between">
                        <div>
                          <h3>Complete your Mandi Setup</h3>
                          <p>
                            Lorem ipsum is placeholder text commonly used in the
                            graphic
                          </p>
                        </div>
                        <button className="btn_white">Complete Now</button>
                      </div>
                    </div>
                    <div className="outstanding_balance margin_bottom">
                      <h4 className="smartboard_main_header">
                        Outstanding Balances
                      </h4>
                      <div className="row">
                        <div className="col-lg-6 col_left">
                          <div className="card pending_rec_card green_card">
                            hii
                          </div>
                        </div>
                        <div className="col-lg-6 col_right">
                          <div className="card pending_pay_card warning_card">
                            hloo
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
                    </div>
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
