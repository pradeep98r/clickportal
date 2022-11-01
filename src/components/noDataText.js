import React, { Component } from "react";
import no_data_icon from "../assets/images/no_data_available.png";
class NoDataText extends Component {
  render() {
    return (
      <div className="">
        <div className="text-center">
          <p className="no_data_text">No Data Available</p>
        </div>
      </div>
    );
  }
}
export default NoDataText;
