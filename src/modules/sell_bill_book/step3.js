import { Modal } from "react-bootstrap";
import "../../modules/buy_bill_book/step2.scss";
import "../sell_bill_book/step3.scss";
import { useState, useEffect } from "react";
import single_bill from "../../assets/images/bills/single_bill.svg";
import d_arrow from "../../assets/images/d_arrow.png";
import "../../modules/buy_bill_book/step1.scss";
import {
  getPartnerData,
  getSystemSettings,
  getOutstandingBal,
} from "../../actions/billCreationService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CommissionCard from "../../components/commissionCard";
import CommonCard from "../../components/card";
import { postsellbillApi } from "../../actions/billCreationService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
const SellbillStep3Modal = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const navigate = useNavigate();
  const partnerSelectedData = JSON.parse(localStorage.getItem("selectedBuyer"));
  const transpoSelectedData = JSON.parse(
    localStorage.getItem("selectedTransporter")
  );
  const [partyType, setPartnerType] = useState("Buyer");
  const [includeComm, setIncludeComm] = useState("");
  const [includeRetComm, setIncludeRetComm] = useState("");
  const [addRetComm, setAddRetComm] = useState(false);
  const [formStatusvalue, setFormStatus] = useState(false);
  const [rtcommformStatusvalue, setRetComFormStatus] = useState(false);
  const [transpoformStatusvalue, setTranspoFormStatus] = useState(false);
  const [labourformStatusvalue, setLabourFormStatus] = useState(false);
  const [rentformStatusvalue, setRentFormStatus] = useState(false);
  const [mandifeeformStatusvalue, setMandiFormStatus] = useState(false);
  const [levisformStatusvalue, setLevisFormStatus] = useState(false);
  const [otherformStatusvalue, setOtherFormStatus] = useState(false);
  const [cashformStatusvalue, setCashFormStatus] = useState(false);
  const [advanceformStatusvalue, setAdvanceFormStatus] = useState(false);
  const [outBal, setOutsBal] = useState(0);
  useEffect(() => {
    fetchPertnerData(partyType);
    if (partnerSelectedData != null) {
      getOutstandingBal(clickId, partnerSelectedData.partyId).then((res) => {
        setOutsBal(res.data.data == null ? 0 : res.data.data);
      });
    }
    getGrossTotalValue(props.slectedSellCropsArray);
    getSystemSettings(clickId).then((res) => {
      var response = res.data.data.billSetting;
      for (var i = 0; i < response.length; i++) {
        if (response[i].billType === "SELL") {
          if (response[i].formStatus === 1) {
            if (response[i].settingName === "COMMISSION") {
              setFormStatus(true);
            } else if (response[i].settingName === "RETURN_COMMISSION") {
              setRetComFormStatus(true);
            } else if (response[i].settingName === "TRANSPORTATION")
              setTranspoFormStatus(true);
            else if (response[i].settingName === "LABOUR_CHARGES")
              setLabourFormStatus(true);
            else if (response[i].settingName === "RENT")
              setRentFormStatus(true);
            else if (response[i].settingName === "MANDI_FEE")
              setMandiFormStatus(true);
            else if (response[i].settingName === "GOVT_LEVIES")
              setLevisFormStatus(true);
            else if (response[i].settingName === "OTHER_FEE")
              setOtherFormStatus(true);
            else if (response[i].settingName === "CASH_RECEIVED")
              setCashFormStatus(true);
            else if (response[i].settingName === "ADVANCE")
              setAdvanceFormStatus(true);
          }

          if (response[i].settingName === "COMMISSION") {
            setIncludeComm(response[i].includeInLedger == 1 ? true : false);
          } else if (response[i].settingName === "RETURN_COMMISSION") {
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
  const partnerSelectDate = moment(selectedDate).format("YYYY-MM-DD");
  const fetchPertnerData = (type) => {
    var partnerType = "Buyer";
    if (type == "Transporter") {
      partnerType = "TRANSPORTER";
    } else if (type == "Buyer") {
      partnerType = "BUYER";
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
    setGetPartyItem(item);
    if (type == "Transporter") {
      setTranspoDataStatus(false);
      localStorage.setItem("selectedTransporter", JSON.stringify(item));
      getOutstandingBal(clickId, item.partyId).then((res) => {
        setOutsBal(res.data.data);
      });
    } else if (type == "Buyer") {
      setTranspoDataStatus(false);
      localStorage.setItem("selectedBuyer", JSON.stringify(item));
    }
    setPartnerType(type);
  };
  const [searchPartyItem, setSearchPartyItem] = useState("");
  const [partnerDataStatus, setPartnerDataStatus] = useState(false);
  const [transpoDataStatus, setTranspoDataStatus] = useState(false);
  const partnerClick = (type) => {
    if (type == "Buyer") {
      setPartnerDataStatus(true);
      setPartnerType(type);
      fetchPertnerData(type);
    } else if (type == "Transporter") {
      setTranspoDataStatus(true);
      setPartnerType(type);
      fetchPertnerData(type);
    }
  };

  const [grossTotal, setGrossTotal] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);
  const getGrossTotalValue = (items) => {
    var total = 0;
    var totalunitvalue = 0;
    for (var i = 0; i < items.length; i++) {
      total += items[i].totalValue;
      totalunitvalue += parseInt(items[i].unitValue);
      setGrossTotal(total);
      setTotalUnits(totalunitvalue);
    }
  };

  const [commValue, getCommInput] = useState(0);
  const [retcommValue, getRetCommInput] = useState(0);
  const [mandifeeValue, getMandiFeeInput] = useState(0);
  const [transportationValue, getTransportationValue] = useState(0);
  const [laborChargeValue, getLaborChargeValue] = useState(0);
  const [rentValue, getRentValue] = useState(0);
  const [levisValue, getlevisValue] = useState(0);
  const [otherfeeValue, getOtherfeeValue] = useState(0);
  const [cashRcvdValue, getCashRcvdValue] = useState(0);
  const [advancesValue, getAdvancesValue] = useState(0);
  const getTotalValue = (value) => {
    return (value / 100) * grossTotal;
  };
  const getTotalUnits = (val) => {
    return val * totalUnits;
  };
  const getTotalBillAmount = () => {
    var t = parseInt(
      getTotalValue(commValue) +
        getTotalUnits(transportationValue) +
        getTotalUnits(laborChargeValue) +
        getTotalUnits(rentValue) +
        getTotalValue(mandifeeValue) +
        parseInt(levisValue) +
        parseInt(otherfeeValue) +
        parseInt(advancesValue)
    );
    let totalValue = grossTotal + t;
    if (addRetComm) {
      return (totalValue + getTotalValue(retcommValue)).toFixed(2);
    } else {
      return (totalValue - getTotalValue(retcommValue)).toFixed(2);
    }
  };
  const getFinalLedgerbalance = () => {
    var t = parseInt(
      getTotalUnits(transportationValue) +
        getTotalUnits(laborChargeValue) +
        getTotalUnits(rentValue) +
        getTotalValue(mandifeeValue) +
        parseInt(levisValue) +
        parseInt(otherfeeValue) +
        parseInt(advancesValue)
    );
    var finalValue = grossTotal + t;
    console.log(finalValue)
    var finalVal = 0;
    if (includeComm) {
      finalVal = finalValue + getTotalValue(commValue);
      console.log(finalVal)
    }
    if (addRetComm) {
      if (includeRetComm) {
        finalVal = (finalVal + getTotalValue(retcommValue));
        console.log(finalVal)
      }
    } else {
      if (includeRetComm) {
        finalVal = (finalVal - getTotalValue(retcommValue));
        console.log(finalVal)
      }
    }
    console.log((parseInt(finalVal) + outBal).toFixed(2) - parseInt(cashRcvdValue),outBal)
    return ((parseInt(finalVal) + outBal) - parseInt(cashRcvdValue)).toFixed(2);
  };
  var lineItemsArray = [];
  var cropArray = props.slectedSellCropsArray;
  var len = cropArray.length;
  for (var i = 0; i < len; i++) {
    lineItemsArray.push({
      cropId: cropArray[i].cropId,
      qty: cropArray[i].unitValue,
      qtyUnit: cropArray[i].unitType,
      rate: cropArray[i].rateValue,
      total: cropArray[i].totalValue,
      wastage: cropArray[i].wastageValue,
      weight: cropArray[i].weightValue,
      rateType:
        cropArray[i].rateType == "kgs" ? "RATE_PER_KG" : "RATE_PER_UNIT",
    });
  }
  const getActualRcvd = () => {
    var actualRcvd = getTotalBillAmount() - parseInt(cashRcvdValue);
    if (!includeComm) {
      actualRcvd = actualRcvd - getTotalValue(commValue);
    }
    if (!includeRetComm) {
      if (addRetComm) {
        actualRcvd = (actualRcvd - getTotalValue(retcommValue)).toFixed(2);
      } else {
        actualRcvd=(actualRcvd + getTotalValue(retcommValue)).toFixed(2);
      }
    }
    return actualRcvd;
  };
  const sellBillRequestObj = {
    actualReceivable: getActualRcvd(),
    advance: advancesValue,
    billDate: partnerSelectDate,
    billStatus: "",
    caId: clickId,
    cashRcvd: cashRcvdValue,
    comm: getTotalValue(commValue),
    commIncluded: includeComm,
    commShown: true,
    comments: "hi",
    createdBy: 0,
    buyerId: partnerSelectedData.partyId,
    govtLevies: levisValue,
    grossTotal: grossTotal,
    labourCharges: getTotalUnits(laborChargeValue),
    less: addRetComm,
    lineItems: lineItemsArray,
    mandiFee: mandifeeValue,
    misc: otherfeeValue,
    outStBal: outBal,
    paidTo: 100,
    rent: getTotalUnits(rentValue),
    rtComm: getTotalValue(retcommValue),
    rtCommIncluded: includeRetComm,
    totalPayble: getTotalBillAmount() - parseInt(cashRcvdValue),
    transportation: getTotalUnits(transportationValue),
    transporterId:
      transpoSelectedData != null ? transpoSelectedData.partyId : "",
    updatedOn: "",
    writerId: 0,
    timeStamp: "",
  };
  // post bill request api call
  const postsellbill = () => {
    console.log(sellBillRequestObj);
    postsellbillApi(sellBillRequestObj).then(
      (response) => {
        if (response.data.status.message === "SUCCESS") {
          toast.success(response.data.status.description, {
            toastId: "success1",
          });
          props.closeStep3Modal();
          navigate("/sellbillbook");
        }
      },
      (error) => {
        toast.error(error.response.data.status.description, {
          toastId: "error1",
        });
      }
    );
  };
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
                onClick={() => partnerClick("Buyer")}
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
                                  onClick={() => partySelect(item, "Buyer")}
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
            <div className="date_sec date_step3">
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
              {formStatusvalue == true ? (
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
              ) : (
                ""
              )}
              {rtcommformStatusvalue == true ? (
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
              ) : (
                ""
              )}

              {transpoformStatusvalue ? (
                <CommonCard
                  title="Transportation"
                  rateTitle="Per Bag/Sac/Box/Crate"
                  onChange={(event) =>
                    getTransportationValue(
                      event.target.value.replace(/\D/g, "")
                    )
                  }
                  inputText={getTotalUnits(transportationValue)}
                  inputValue={transportationValue}
                  totalTitle="Total"
                  unitsTitle="Number of Units"
                  units={totalUnits}
                />
              ) : (
                ""
              )}
              {labourformStatusvalue ? (
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
                  units={totalUnits}
                />
              ) : (
                ""
              )}
              {rentformStatusvalue ? (
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
                  units={totalUnits}
                />
              ) : (
                ""
              )}
              {mandifeeformStatusvalue ? (
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
              ) : (
                ""
              )}
              {levisformStatusvalue ? (
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
              ) : (
                ""
              )}
              {otherformStatusvalue ? (
                <div className="comm_cards">
                  <div className="card input_card">
                    <div className="row">
                      <div className="col-lg-3 title_bg">
                        <h5 className="comm_card_title mb-0">Other Fee</h5>
                      </div>
                      <div className="col-lg-9 col-sm-12 col_left_border">
                        <input
                          type="text"
                          placeholder=""
                          value={otherfeeValue}
                          onChange={(event) =>
                            getOtherfeeValue(
                              event.target.value.replace(/\D/g, "")
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {cashformStatusvalue ? (
                <div className="comm_cards">
                  <div className="card input_card">
                    <div className="row">
                      <div className="col-lg-3 title_bg">
                        <h5 className="comm_card_title mb-0">Cash Received</h5>
                      </div>
                      <div className="col-lg-9 col-sm-12 col_left_border">
                        <input
                          type="text"
                          placeholder=""
                          value={cashRcvdValue}
                          onChange={(event) =>
                            getCashRcvdValue(
                              event.target.value.replace(/\D/g, "")
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {advanceformStatusvalue ? (
                <div className="comm_cards">
                  <div className="card input_card">
                    <div className="row">
                      <div className="col-lg-3 title_bg">
                        <h5 className="comm_card_title mb-0">Advances</h5>
                      </div>
                      <div className="col-lg-9 col-sm-12 col_left_border">
                        <input
                          type="text"
                          placeholder=""
                          value={advancesValue}
                          onChange={(event) =>
                            getAdvancesValue(
                              event.target.value.replace(/\D/g, "")
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="col-lg-3 pl-0">
            <h5 className="head_modal">Totals</h5>
            <div className="default_card comm_total_card total_bal">
              <div className="totals_value pt-0">
                <h5>Gross Total (₹)</h5>
                <h6 className="black_color">{grossTotal.toFixed(2)}</h6>
              </div>
              <div className="totals_value">
                <h5>Total Bill Amount (₹)</h5>
                <h6 className="color_green">{getTotalBillAmount()}</h6>
              </div>
              <div className="totals_value">
                <h5>Outstanding Balance (₹)</h5>
                <h6 className="color_green">{outBal.toFixed(2)}</h6>
              </div>
              {cashRcvdValue != 0 ? (
                <div className="totals_value">
                  <h5>Cash Received</h5>
                  <h6 className="black_color">-{cashRcvdValue}</h6>
                </div>
              ) : (
                ""
              )}
              <div className="totals_value">
                <h5>Final Ledger Balance (₹)</h5>
                <h6 className="color_green">{getFinalLedgerbalance()}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom_div main_div popup_bottom_div step3_bottom">
        <div className="d-flex align-items-center justify-content-end">
          <button className="primary_btn" onClick={postsellbill}>
            Next
          </button>
        </div>
      </div>
      <ToastContainer />
    </Modal>
  );
};
export default SellbillStep3Modal;
