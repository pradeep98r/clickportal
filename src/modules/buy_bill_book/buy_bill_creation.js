import React, { useState, useEffect, Component } from "react";
import "../buy_bill_book/buy_bill_book.scss";
import getPreferredCropsApi from "../../services/get_partner_api";
import other_crop from "../../assets/images/other_crop.svg";
import { useNavigate } from "react-router-dom";
import CommonCard from "../../components/card";
import CommissionCard from "../../components/commission_card";
import close from "../../assets/images/close.svg";
import delete_icon from "../../assets/images/delete.svg";
import copy_icon from "../../assets/images/copy.svg";

class BuyBillCreation extends Component {
  state = {
    getPreferredResponse: false,
    number: "",
    toDashboard: false,
    otpReqId: "",
    otp: "",
    latitude: "",
    longitude: "",
    otpError: "",
  };
  constructor() {
    super();
  }

  fetchData = () => {
    getPreferredCropsApi
      .getPreferredCrops()
      .then((response) => {
        console.log(response);
        this.setState({
          getPreferredResponse: response.data.data,
        });
        console.log(this.state.getPreferredResponse);
        // getPreferredResponse =response.data.data;
        console.log(response.data.data, "crops preferred");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  cropOnclick = (crop) => {
    console.log(crop);
    // cropResponseData([...cropData, crop]);
  };
  render() {
    return (
      <div onLoad={() => this.fetchData()}>
        <div className="main_div_padding">
          <div className="container-fluid px-0">
            <div className="row">
              <div className="col-lg-7 col_left">
                <h4 className="smartboard_main_header">
                  Select crop and creat bill
                </h4>
                <div className="d-flex">
                  {this.state.getPreferredResponse.length > 0 && (
                    <div className="d-flex total_crops_div">
                      {this.state.getPreferredResponse.map((crop) => (
                        <div
                          className="text-center crop_div"
                          key={crop.cropId}
                          onClick={() => this.cropOnclick(crop, crop.cropId)}
                        >
                          <img
                            src={crop.imageUrl}
                            className="flex_class mx-auto"
                          />
                          <p>{crop.cropName}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div
                    className="text-center crop_div other_Crop"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                    //   onClick={allCropData}
                  >
                    <img src={other_crop} />
                    <p>Other Crop</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*  */}
      </div>
    );
  }
}
export default BuyBillCreation;
