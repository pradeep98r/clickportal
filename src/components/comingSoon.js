import React, { Component } from "react";
import coming_soon from "../assets/images/coming_soon.png";
class ComingSoon extends Component {
  render() {
    return (
      <div className="no_data_div coming_soon">
        <div className="text-center">
          <img
            src={coming_soon}
            alt="icon"
            className="d-flex mx-auto justify-content-center"
          />
          <p>Coming soon</p>
        </div>
      </div>
    );
  }
}
export default ComingSoon;
