import React, { useState, useEffect } from "react";
import "../buy_bill_book/buy_bill_book.scss";
import SelectSearch from "./select_search";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { selectBuyer } from "../../features/buyerSlice";
import {getPartnerData} from "../../services/billCreationService";
import single_bill from "../../assets/images/bills/single_bill.svg";
import { useNavigate } from "react-router-dom";
function BuyerSelection() {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId=loginData.clickId;
  const clientId=loginData.authKeys.clientId;
  const clientSecret=loginData.authKeys.clientSecret;
  const [selectedOption, setSelectedOption] = useState();
  const dispath = useDispatch();
  let [responseData, setResponseData] = useState([]);
  const navigate = useNavigate();
  const fetchData = () => {
    getPartnerData(clickId,clientId,clientSecret
    ).then((response) => {
      setResponseData(response.data.data);
      console.log(response.data,"buyer data")
    }) .catch((error) => {
      console.log(error);
    });
    // getPartnerData()
    //   .then((response) => {
    //     setResponseData(response.data.data);
    //     console.log(response.data,"buyer data")
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // handle onChange event of the dropdown
  const handleChange = (e) => {
    setSelectedOption(e);
  };
  const handleSUbmit = (e) => {
    e.preventDefault();
    dispath(
      selectBuyer({
        buyerInfo: selectedOption,
      })
    );
    navigate('/bill_creation')
  };
  return (
    <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
          <div className="row">
            <div className="col-lg-7 col_left">
              <h4 className="smartboard_main_header">Bill Information</h4>
              <div className="row margin_bottom">
                <div className="col-lg-8 col_left">
                  {responseData.length > 0 && (
                    <Select
                      options={responseData}
                      placeholder="Select Buyer"
                      value={selectedOption}
                      onChange={handleChange}
                      isSearchable={true}
                      getOptionValue={(e) => e.partyId}
                      getOptionLabel={(e) => (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img src={single_bill} className="icon_user" />
                          <span style={{ marginLeft: 5 }}>{e.partyName}</span>
                        </div>
                      )}
                    />
                  )}
                </div>
                <div className="col-lg-4 ">
                  <input
                    className="form-control date me-2"
                    type="date"
                    placeholder=""
                    aria-label="date"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-8 col_left">
                  <SelectSearch />
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom_div main_div">
        <div className="d-flex align-items-center justify-content-end">
          <button className="secondary_btn">Cancel</button>
          <button className="primary_btn" onClick={(e) => handleSUbmit(e)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
  // }
}
export default BuyerSelection;
