import React, { Component } from "react";
import TopNavigation from "../../components/top_navigation/top_navigation";
import SideNavigation from "../../components/side_navigation/side_navigation";
class BuyBillBook extends Component {
  render() {
    return (
      <div>
        <div className="d-flex">
          <div className="side_div">
            <SideNavigation />
          </div>
          <div className="main_div">
            <TopNavigation heading="Buy Bill Book"/>
            <div className="main_div_padding">
              <div className="container-fluid px-0">hey billss</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default BuyBillBook;
