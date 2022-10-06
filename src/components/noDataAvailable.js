import React, { Component } from "react";
import no_data_icon from "../assets/images/no_data_available.png";
class NoDataAvailable extends Component {
  render() {
    return (
      <div className="no_data_div">
        <div className="text-center">
          <img
            src={no_data_icon}
            alt="icon"
            className="d-flex mx-auto justify-content-center"
          />
          <p>No Data Available</p>
        </div>
      </div>
    );
  }
}
export default NoDataAvailable;
