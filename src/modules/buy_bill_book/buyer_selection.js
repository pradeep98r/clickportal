import React, { useState } from "react";
import "../buy_bill_book/buy_bill_book.scss";
import SelectSearch from "./select_search";
import Select from "react-select";
import click_logo from "../../assets/images/click_logo_green.svg";
function BuyerSelection() {
  const data = [
    {
      value: "aparna",
      label: "aparna",
      icon: click_logo,
    },
    {
      value: "janu",
      label: "janu ",
      icon: click_logo,
    },
    {
      value: "komal",
      label: "komal",
      icon: click_logo,
    },
    {
      value: "rakhi",
      label: "rakhi",
      icon: click_logo,
    },
  ];

  const [selectedOption, setSelectedOption] = useState();

  // handle onChange event of the dropdown
  const handleChange = (e) => {
    setSelectedOption(e);
    console.log(e,"select")
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
                    options={data}
                    placeholder="Select Buyer"
                    value={selectedOption}
                    onChange={handleChange}
                    isSearchable={true}
                    getOptionLabel={(e) => (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img src={e.icon} className="icon_user" />
                        <span style={{ marginLeft: 5 }}>{e.value}</span>
                      </div>
                    )}
                  />

                  {/* {selectedOption && (
                    <div>
                      <b>Selected Option:</b> {selectedOption.value}
                    </div>
                  )} */}
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
                  {/* <select>
                        <option value="DEFAULT" disabled>
                          Add Transporter
                        </option>
                        <option>swa</option>
                        <option>ashu</option>
                        <option>kiran</option>
                        <option>komal</option>
                        <option>taru</option>
                        <option>meenu</option>
                      </select> */}
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
