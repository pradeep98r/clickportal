import React, { useState, useEffect } from "react";
import "../buy_bill_book/buy_bill_book.scss";
import SelectSearch from "./select_search";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { selectBuyer } from "../../features/buyerSlice";
import { getPartnerData } from "../../services/billCreationService";
import single_bill from "../../assets/images/bills/single_bill.svg";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import date_icon from "../../assets/images/date_icon.svg";
function BuyerSelection() {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const clientId = loginData.authKeys.clientId;
  const clientSecret = loginData.authKeys.clientSecret;
  const [selectedOption, setSelectedOption] = useState();
  const dispath = useDispatch();
  let [responseData, setResponseData] = useState([]);
  const navigate = useNavigate();
  const fetchData = () => {
    getPartnerData(clickId, clientId, clientSecret)
      .then((response) => {
        setResponseData(response.data.data);
        console.log(response.data, "buyer data");
      })
      .catch((error) => {
        console.log(error);
      });
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
    navigate("/bill_creation");
  };
  const [startDate, setStartDate] = useState(new Date());
  const partnerSelectDate=moment(startDate).format("YYYY-MM-DD");
  localStorage.setItem('partnerSelectDate',partnerSelectDate)
  localStorage.setItem('partnerData',JSON.stringify(selectedOption))
  return (
    <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
          <div className="row">
            <div className="col-lg-7 col_left">
              <h4 className="smartboard_main_header">Bill Information</h4>
              <div className="row margin_bottom">
                <div className="col-lg-8 col_left">
                  {responseData.length > 0 ? (
                    <Select
                      options={responseData}
                      placeholder="Select Farmer"
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
                  )
                :
                <Select  placeholder="Select Farmer" />

                }
                </div>
                <div className="col-lg-4 ">
                  <label className="d-flex align-items-baseline date_field">
                    <span className="date_icon">
                      <img src={date_icon} alt="icon" />
                    </span>
                    <DatePicker
                      dateFormat="yyyy-MM-dd"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      className="form-control"
                      placeholder="Date"
                      maxDate={new Date()}
                    />
                  </label>
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
