import { Modal } from "react-bootstrap";
import "../../modules/buy_bill_book/step2.scss";
import "../../modules/buy_bill_book/step3.scss";
import { useState, useEffect } from "react";
import single_bill from "../../assets/images/bills/single_bill.svg";
import d_arrow from "../../assets/images/d_arrow.png";
import "../../modules/buy_bill_book/step1.scss";
import { getPartnerData, getSystemSettings } from "../../actions/billCreationService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CommissionCard from "../../components/commissionCard";
import CommonCard from "../../components/card";
const Step3Modal = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const partnerSelectedData = JSON.parse(
    localStorage.getItem("selectedPartner")
  );
  const transpoSelectedData = JSON.parse(
    localStorage.getItem("selectedTransporter")
  );

  const [partyType, setPartnerType] = useState("Seller");
  const [includeComm, setIncludeComm] = useState("");
  const [includeRetComm, setIncludeRetComm] = useState("");
  const [addRetComm, setAddRetComm] = useState(false);
  useEffect(() => {
    fetchPertnerData(partyType);
    getSystemSettings(clickId).then((res) => {
      var response = res.data.data.billSetting;
      for (var i = 0; i < response.length; i++) {    
        if(
          response[i].billType==='BUY'){
            if(response[i].settingName === 'COMMISSION'){
              console.log(response[i].includeInLedger,"commiss");
              setIncludeComm(response[i].includeInLedger == 1 ? true : false);
             }
             else if(response[i].settingName === 'RETURN_COMMISSION'){
              console.log(response[i].includeInLedger, 
                response[i].addToGt,"return");
                setAddRetComm(response[i].addToGt == 1 ? true : false);
                setIncludeRetComm(response[i].includeInLedger == 1 ? true : false);
             }  
          }
         
    }
    });
  }, []);
  const [getPartyItem, setGetPartyItem] = useState(null);
  let [partnerData, setpartnerData] = useState([]);
  const [selectedDate, setStartDate] = useState(new Date());
  const fetchPertnerData = (type) => {
    var partnerType = "Seller";
    if (type == "Seller") {
      partnerType = "FARMER";
    } else if (type == "Transporter") {
      partnerType = "TRANSPORTER";
    }
    getPartnerData(clickId, partnerType)
      .then((response) => {
        setpartnerData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const partySelect = (item, type) => {
    console.log(item);
    setGetPartyItem(item);
    if (type == "Seller") {
      setPartnerDataStatus(false);
      localStorage.setItem("selectedPartner", JSON.stringify(item));
    } else if (type == "Transporter") {
      setTranspoDataStatus(false);
      localStorage.setItem("selectedTransporter", JSON.stringify(item));
    }
    setPartnerType(type);
  };
  const [searchPartyItem, setSearchPartyItem] = useState("");
  const [partnerDataStatus, setPartnerDataStatus] = useState(false);
  const [transpoDataStatus, setTranspoDataStatus] = useState(false);
  const partnerClick = (type) => {
    if (type == "Seller") {
      setPartnerDataStatus(true);
      setPartnerType(type);
      fetchPertnerData(type);
    } else if (type == "Transporter") {
      setTranspoDataStatus(true);
      setPartnerType(type);
      fetchPertnerData(type);
    }
  };
  var grossTotal = 11880;
  const [commValue, getCommInput] = useState("");
  const [retcommValue, getRetCommInput] = useState("");
  const [mandifeeValue, getMandiFeeInput] = useState("");
  const [transportationValue, getTransportationValue] = useState("");
  const [laborChargeValue, getLaborChargeValue] = useState("");
  const [rentValue, getRentValue] = useState("");
  const [levisValue, getlevisValue] = useState("");
  const getTotalValue = (value) => {
    return (value / 100) * 11880;
  };
  const getTotalUnits = (val) => {
    // (20 = "no of total units")
    return val * 20;
  };
  const getTotalBillAmount = () =>{
    let totalValue = (grossTotal -(getTotalValue(commValue) + 
    getTotalUnits(transportationValue) + getTotalUnits(laborChargeValue) + getTotalUnits(rentValue) + getTotalValue(mandifeeValue)));
    if(addRetComm){
      return (totalValue + getTotalValue(retcommValue)).toFixed(2);
    }
    else{
      return (totalValue - getTotalValue(retcommValue)).toFixed(2); 
    } 
  }
  return (
    <Modal
      show={props.show}
      close={props.closeStep3Modal}
      className="cropmodal_poopup"
    >
      <div className="modal-header date_modal_header smartboard_modal_header">
        <h5 className="modal-title header2_text" id="staticBackdropLabel">
          Additions/Deductions
        </h5>
        <img alt="image" onClick={props.closeStep3Modal} />
      </div>

      <div className="modal-body">
        <div className="row">
          <div className="col-lg-3 pr-0">
            <h5 className="head_modal">Bill Information </h5>

            <div className="party_div">
              <div
                className="selectparty_field d-flex align-items-center justify-content-between"
                onClick={() => partnerClick("Seller")}
              >
                <div className="partner_card">
                  <div className="d-flex align-items-center">
                    <img src={single_bill} className="icon_user" />
                    <div>
                      <h5>{partnerSelectedData.partyName}</h5>
                      <h6>
                        {partnerSelectedData.partyType} -{" "}
                        {partnerSelectedData.partyId} |{" "}
                        {partnerSelectedData.mobile}
                      </h6>
                      <p>{partnerSelectedData.address.addressLine}</p>
                    </div>
                  </div>
                </div>
                <img src={d_arrow} />
              </div>
              {partnerDataStatus ? (
                <div className="partners_div" id="scroll_style">
                  <div className="d-flex searchparty" role="search">
                    <input
                      className="form-control mb-0"
                      type="search"
                      placeholder="Search"
                      aria-label="Search"
                      onChange={(event) =>
                        setSearchPartyItem(event.target.value)
                      }
                    />
                  </div>

                  <div>
                    {partnerData.length > 0 ? (
                      <div>
                        <ul>
                          {partnerData
                            .filter((item) => {
                              if (searchPartyItem === "") {
                                return item;
                              } else if (
                                item.partyName
                                  .toLowerCase()
                                  .includes(searchPartyItem.toLowerCase())
                              ) {
                                return item;
                              } else if (
                                item.mobile
                                  .toLowerCase()
                                  .includes(searchPartyItem)
                              ) {
                                return item;
                              } else if (
                                item.partyId
                                  .toString()
                                  .toLowerCase()
                                  .includes(searchPartyItem)
                              ) {
                                return item;
                              }
                            })
                            .map((item) => {
                              return (
                                <li
                                  key={item.partyId}
                                  onClick={() => partySelect(item, "Seller")}
                                  className={
                                    "nav-item " +
                                    (item == getPartyItem ? "active_class" : "")
                                  }
                                >
                                  <div className="partner_card">
                                    <div className="d-flex align-items-center">
                                      <img
                                        src={single_bill}
                                        className="icon_user"
                                      />
                                      <div>
                                        <h5>{item.partyName}</h5>
                                        <h6>
                                          {item.trader
                                            ? "TRADER"
                                            : item.partyType}{" "}
                                          - {item.partyId} | {item.mobile}
                                        </h6>
                                        <p>{item.address.addressLine}</p>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    ) : (
                      <p></p>
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="date_sec">
              <div className="date_col d-flex align-items-center justify-content-between">
                <DatePicker
                  dateFormat="yyyy-MM-dd"
                  selected={selectedDate}
                  onChange={(date) => setStartDate(date)}
                  className="form-control"
                  placeholder="Date"
                  maxDate={new Date()}
                />
                <label className="custom-control custom-checkbox mb-0">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="modal_checkbox"
                    value="my-value"
                  />
                  <span className="custom-control-indicator"></span>
                  <span className="custom-control-description">
                    Set as a Default Date
                  </span>
                </label>
              </div>
            </div>
            {transpoSelectedData != null ? (
              <div className="transporter_div">
                <div
                  className="selectparty_field d-flex align-items-center justify-content-between"
                  onClick={() => partnerClick("Transporter")}
                >
                  <div className="partner_card">
                    <div className="d-flex align-items-center">
                      <img src={single_bill} className="icon_user" />
                      <div>
                        <h5>{transpoSelectedData.partyName}</h5>
                        <h6>
                          {transpoSelectedData.partyType} -{" "}
                          {transpoSelectedData.partyId} |{" "}
                          {transpoSelectedData.mobile}
                        </h6>
                        <p>{transpoSelectedData.address.addressLine}</p>
                      </div>
                    </div>
                  </div>
                  <img src={d_arrow} />
                </div>
                {transpoDataStatus ? (
                  <div className="partners_div" id="scroll_style">
                    <div className="d-flex searchparty" role="search">
                      <input
                        className="form-control mb-0"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        onChange={(event) =>
                          setSearchPartyItem(event.target.value)
                        }
                      />
                    </div>

                    <div>
                      {partnerData.length > 0 ? (
                        <div>
                          <ul>
                            {partnerData
                              .filter((item) => {
                                if (searchPartyItem === "") {
                                  return item;
                                } else if (
                                  item.partyName
                                    .toLowerCase()
                                    .includes(searchPartyItem.toLowerCase())
                                ) {
                                  return item;
                                } else if (
                                  item.mobile
                                    .toLowerCase()
                                    .includes(searchPartyItem)
                                ) {
                                  return item;
                                } else if (
                                  item.partyId
                                    .toString()
                                    .toLowerCase()
                                    .includes(searchPartyItem)
                                ) {
                                  return item;
                                }
                              })
                              .map((item) => {
                                return (
                                  <li
                                    key={item.partyId}
                                    onClick={() =>
                                      partySelect(item, "Transporter")
                                    }
                                    className={
                                      "nav-item " +
                                      (item == getPartyItem
                                        ? "active_class"
                                        : "")
                                    }
                                  >
                                    <div className="partner_card">
                                      <div className="d-flex align-items-center">
                                        <img
                                          src={single_bill}
                                          className="icon_user"
                                        />
                                        <div>
                                          <h5>{item.partyName}</h5>
                                          <h6>
                                            {item.trader
                                              ? "TRADER"
                                              : item.partyType}{" "}
                                            - {item.partyId} | {item.mobile}
                                          </h6>
                                          <p>{item.address.addressLine}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      ) : (
                        <p></p>
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
            <h5 className="date_sec head_modal">Crop Information </h5>
            <div className="cropinfo_div">{/* <p>edit</p>  */}</div>
          </div>
          <div className="col-lg-6">
            <h5 className="head_modal">Additions/Deductions</h5>
            <div
              className="card default_card comm_total_card"
              id="scroll_style"
            >
              <CommissionCard
                title="Commission"
                rateTitle="Default Percentage %"
                onChange={(event) =>
                  getCommInput(event.target.value.replace(/\D/g, ""))
                }
                inputText={getTotalValue(commValue)}
                inputValue={commValue}
                totalTitle="Total"
              />
              <CommissionCard
                title="Return Commission"
                rateTitle="Default Percentage %"
                onChange={(event) =>
                  getRetCommInput(event.target.value.replace(/\D/g, ""))
                }
                inputText={getTotalValue(retcommValue)}
                inputValue={retcommValue}
                totalTitle="Total"
              />
              <CommonCard
                title="Transportation"
                rateTitle="Per Bag/Sac/Box/Crate"
                onChange={(event) =>
                  getTransportationValue(event.target.value.replace(/\D/g, ""))
                }
                inputText={getTotalUnits(transportationValue)}
                inputValue={transportationValue}
                totalTitle="Total"
                unitsTitle="Number of Units"
              />
              <CommonCard
                title="Labour Charges"
                rateTitle="Per Bag/Sac/Box/Crate"
                onChange={(event) =>
                  getLaborChargeValue(event.target.value.replace(/\D/g, ""))
                }
                inputText={getTotalUnits(laborChargeValue)}
                inputValue={laborChargeValue}
                totalTitle="Total"
                unitsTitle="Number of Units"
              />
              <CommonCard
                title="Rent"
                rateTitle="Per Bag/Sac/Box/Crate"
                onChange={(event) =>
                  getRentValue(event.target.value.replace(/\D/g, ""))
                }
                inputText={getTotalUnits(rentValue)}
                inputValue={rentValue}
                totalTitle="Total"
                unitsTitle="Number of Units"
              />
              <CommissionCard
                title="Mandi Fee"
                rateTitle="Default Percentage %"
                onChange={(event) =>
                  getMandiFeeInput(event.target.value.replace(/\D/g, ""))
                }
                inputText={getTotalValue(mandifeeValue)}
                inputValue={mandifeeValue}
                totalTitle="Total"
              />
              <div className="comm_cards">
                <div className="card input_card">
                  <div className="row">
                    <div className="col-lg-3 title_bg">
                      <h5 className="comm_card_title mb-0">Govt. Levies</h5>
                    </div>
                    <div className="col-lg-9 col-sm-12 col_left_border">
                      <input
                        type="text"
                        placeholder=""
                        value={levisValue}
                        onChange={(event) =>
                          getlevisValue(event.target.value.replace(/\D/g, ""))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="comm_cards">
                <div className="card input_card">
                  <div className="row">
                    <div className="col-lg-3 title_bg">
                      <h5 className="comm_card_title mb-0">Other Fee</h5>
                    </div>
                    <div className="col-lg-9 col-sm-12 col_left_border">
                      <input type="text" placeholder="" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="comm_cards">
                <div className="card input_card">
                  <div className="row">
                    <div className="col-lg-3 title_bg">
                      <h5 className="comm_card_title mb-0">Cash Paid</h5>
                    </div>
                    <div className="col-lg-9 col-sm-12 col_left_border">
                      <input type="text" placeholder="" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="comm_cards">
                <div className="card input_card">
                  <div className="row">
                    <div className="col-lg-3 title_bg">
                      <h5 className="comm_card_title mb-0">Advances</h5>
                    </div>
                    <div className="col-lg-9 col-sm-12 col_left_border">
                      <input type="text" placeholder="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 pl-0">
            <h5 className="head_modal">Totals</h5>
            <div className="default_card comm_total_card total_bal">
              <div className="totals_value pt-0">
                <h5>Gross Total (₹)</h5>
                <h6 className="black_color">{grossTotal}</h6>
              </div>
              <div className="totals_value">
                <h5>Total Bill Amount (₹)</h5>
                <h6>{getTotalBillAmount()}</h6>
              </div>
              <div className="totals_value">
                <h5>Outstanding Balance (₹)</h5>
                <h6>0</h6>
              </div>
              <div className="totals_value">
                <h5>Final Ledger Balance (₹)</h5>
                <h6>{getTotalBillAmount() + 10}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default Step3Modal;
