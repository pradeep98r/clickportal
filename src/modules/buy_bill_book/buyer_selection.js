import React, { Component, useState } from "react";
// import TopNavigation from "../../components/top_navigation/top_navigation";
// import SideNavigation from "../../components/side_navigation/side_navigation";
import "../buy_bill_book/buy_bill_book.scss";
import Select, { components } from "react-select";
function BuyerSelection() {
  const data = [
    {
      value: 1,
      text: "Up Arrow",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-arrow-up-circle"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"
          />
        </svg>
      ),
    },
    {
      value: 2,
      text: "Down Arrow",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-arrow-down-circle"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"
          />
        </svg>
      ),
    },
    {
      value: 3,
      text: "Left Arrow",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-arrow-left-circle"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
          />
        </svg>
      ),
    },
    {
      value: 4,
      text: "Right Arrow",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-arrow-right-circle"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
          />
        </svg>
      ),
    },
  ];

  const [selectedOption, setSelectedOption] = useState(null);

  // handle onChange event of the dropdown
  const handleChange = (e) => {
    setSelectedOption(e);
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
                      <Select
                        placeholder="Select Option"
                        value={selectedOption}
                        options={data}
                        onChange={handleChange}
                        getOptionLabel={(e) => (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {e.icon}
                            <span style={{ marginLeft: 5 }}>{e.text}</span>
                          </div>
                        )}
                      />

                      {selectedOption && (
                        <div>
                          <b>Selected Option:</b> {selectedOption.value}
                        </div>
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
                      <select>
                        <option value="DEFAULT" disabled>
                          Add Transporter
                        </option>
                        <option>swa</option>
                        <option>ashu</option>
                        <option>kiran</option>
                        <option>komal</option>
                        <option>taru</option>
                        <option>meenu</option>
                      </select>
                    </div>
                    <div></div>
                  </div>
                </div>
                <div className="col-lg-5"></div>
              </div>
            </div>
          </div>
    </div>
  );
  // }
}
export default BuyerSelection;
