import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdvances,
  getAdvancesSummaryById,
  customDetailedAvances,
} from "../../actions/advancesService";
import loading from "../../assets/images/loading.gif";
import no_data_icon from "../../assets/images/NodataAvailable.svg";
import moment from "moment";
import single_bill from "../../assets/images/bills/single_bill.svg";
import addIcon from "../../assets/images/addIcon.svg";
import addbill_icon from "../../assets/images/addbill.svg";
import date_icon from "../../assets/images/date_icon.svg";
import DatePickerModel from "../smartboard/datePicker";
import {
  advanceDataInfo,
  advanceSummaryById,
  allAdvancesData,
  dateFormat,
  fromAdvanceFeature,
  fromAdvanceSummary,
  fromParentSelect,
  partyOutstandingBal,
  selectedAdvanceId,
  selectedPartyByAdvanceId,
  totalAdvancesVal,
  totalAdvancesValById,
} from "../../reducers/advanceSlice";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
  getMaskedMobileNumber,
} from "../../components/getCurrencyNumber";
import { getText } from "../../components/getText";
import SelectOptions from "./selectOptions";
import "../../modules/advances/selectedOptions.scss";
import AdvanceSummary from "./advanceSummary";
import {
  allCustomTabs,
  beginDate,
  closeDate,
} from "../../reducers/ledgerSummarySlice";
import { dateCustomStatus } from "../../reducers/billEditItemSlice";
import TransportoRecord from "../transporto_ledger/transportoRecord";

const Advance = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const advancesData = useSelector((state) => state.advanceInfo);
  const billEditItemInfo = useSelector((state) => state.billEditItemInfo);
  const advancesArray = advancesData?.advanceDataInfo;
  const allData = advancesData.allAdvancesData;
  const totalAdvances = advancesData?.totalAdvancesVal;
  const selectedPartyId = advancesData?.selectedAdvanceId;
  const fromAdvSummary = advancesData?.fromAdvanceSummary;
  const tabs = [
    {
      id: 1,
      name: "All",
      to: "all",
    },
    {
      id: 2,
      name: "Custom",
      to: "custom",
    },
  ];
  const ledgersSummary = useSelector((state) => state.ledgerSummaryInfo);
  const allCustom = ledgersSummary?.allCustomTabs;
  const [dateDisplay, setDateDisplay] = useState(false);
  var newDate =moment(new Date()).format("YYYY-MM-DD")
  var date = moment(new Date()).format("YYYY-MM-DD");
  var defaultDate = moment(new Date()).format("DD-MMM-YYYY");
  const startDate = ledgersSummary?.beginDate
  const endDate =ledgersSummary?.closeDate;
  var dateValue = advancesData?.dateFormat;
  var [datesValue, setDateValue] = useState(date + " to " + date);
  const [showDatepickerModal, setShowDatepickerModal] = useState(false);
  const [showDatepickerModal1, setShowDatepickerModal1] = useState(false);
  const [recordPayModalStatus, setRecordPayModalStatus] = useState(false);
  const [recordPayModal, setRecordPayModal] = useState(false);
  useEffect(() => {
    getAllAdvances();
    dispatch(allCustomTabs("all"));
    dispatch(beginDate(date));
    dispatch(closeDate(date));
    callbackFunction(date, date,'Custom');
    console.log(allData,'useeffect all data')
  }, [props]);
  const getAllAdvances = () => {
    getAdvances(clickId)
      .then((res) => {
        if (res.data.status.type === "SUCCESS") {
          if (res.data.data != null) {
            dispatch(allAdvancesData(res.data.data.advances));
            dispatch(advanceDataInfo(res.data.data.advances));
            if (res.data.data.advances.length > 0) {
              dispatch(selectedAdvanceId(res.data.data.advances[0].partyId));
              getAdvanceSummary(res.data.data.advances[0].partyId);
              dispatch(selectedPartyByAdvanceId(res.data.data.advances[0]));
              dispatch(partyOutstandingBal(res.data.data.outStandingPaybles))
            }
            else{
                dispatch(partyOutstandingBal(0))
            }
            if (res.data.data.totalAdvances != 0) {
              dispatch(totalAdvancesVal(res.data.data.totalAdvances));
            }
            
          } else {
            dispatch(allAdvancesData([]));
          }
        }
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };
  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = allData.filter((data) => {
      if (data.mobile.includes(value)) {
        return data.mobile.search(value) != -1;
      } else if (data.partyName.toLowerCase().includes(value)) {
        return data.partyName.toLowerCase().search(value) != -1;
      } else if (data.partyId.toString().includes(value)) {
        return data.partyId.toString().search(value) != -1;
      } else if (data?.addressLine?.toLowerCase().includes(value)) {
        return data?.addressLine?.toLowerCase().search(value) != -1;
      }
    });
    dispatch(advanceDataInfo(result));
  };
  const particularLedgerData = (id, item) => {
    if (allCustom == "custom") {
      dispatch(allCustomTabs("all"));
      setDateDisplay(false);
      callbackFunction(date,date, 'Custom')
    }
    dispatch(dateCustomStatus(true));
    dispatch(selectedAdvanceId(id));
    getAdvanceSummary(id);
    dispatch(selectedPartyByAdvanceId(item));
  };
  const getAdvanceSummary = (id) => {
    getAdvancesSummaryById(clickId, id)
      .then((res) => {
        if (res.data.status.type === "SUCCESS") {
          if (res.data.data != null) {
            dispatch(advanceSummaryById(res.data.data.advances));
            dispatch(totalAdvancesValById(res.data.data.totalAdvances));
          } else {
            dispatch(advanceSummaryById([]));
          }
        }
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };
  const getCustomDetailedAdvances = (partyId, fromDate, toDate) => {
    customDetailedAvances(clickId, partyId, fromDate, toDate)
      .then((res) => {
        if (res.data.status.type == "SUCCESS") {
          if (res.data.data != null) {
            dispatch(advanceSummaryById(res.data.data.advances));
            dispatch(totalAdvancesValById(res.data.data.totalAdvances));
          } else {
            dispatch(advanceSummaryById([]));
          }
          setLoading(false);
        }
      })
      .catch((error) => console.log(error));
  };
  const allCustomEvent = (type) => {
    if (type == "custom") {
      setDateDisplay(true);
      if(billEditItemInfo?.dateCustom){
        callbackFunction(newDate, newDate, 'Custom');
      }
      else{
        getCustomDetailedAdvances(selectedPartyId, startDate, endDate);
      }  
    } else {
      getAdvanceSummary(selectedPartyId);
      setDateDisplay(false);
    }
    dispatch(allCustomTabs(type));
  };
  const onclickDate = () => {
    setShowDatepickerModal1(true);
    setShowDatepickerModal(true);
  };
  const callbackFunction = (startDate, endDate, dateTab) => {
    var fromDate = moment(startDate).format("YYYY-MM-DD");
    var toDate = moment(endDate).format("YYYY-MM-DD");
    dateValue = fromDate;
    if (dateTab === "Daily") {
      dispatch(dateFormat(moment(fromDate).format("DD-MMM-YYYY")));
    } else if (dateTab === "Weekly") {
      dispatch(dateFormat(moment(fromDate).format("DD-MMM-YYYY") +
      " to " +
      moment(toDate).format("DD-MMM-YYYY")));
    } else if (dateTab === "Monthly") {
      dispatch(dateFormat(moment(fromDate).format("MMM-yyy")));
    } else if (dateTab === "Yearly") {
      dispatch(dateFormat(moment(fromDate).format("YYYY")));
    } else {
      dispatch(dateFormat(moment(fromDate).format("DD-MMM-YYYY") +
      " to " +
      moment(toDate).format("DD-MMM-YYYY")));
    }
    dispatch(beginDate(fromDate));
    dispatch(closeDate(toDate));
    getCustomDetailedAdvances(selectedPartyId, fromDate, toDate);
  };

  const recordPaymentOnClickEvent = () => {
    dispatch(fromAdvanceFeature(true));
    setRecordPayModalStatus(true);
    setRecordPayModal(true);
    dispatch(fromAdvanceSummary(false));
  };

  const getAdvancesOutStbal =()=>{
    getAdvances(clickId)
    .then((res) => {
      if (res.data.status.type === "SUCCESS") {
        if (res.data.data != null) {
          if (res.data.data.advances.length > 0) {
            dispatch(partyOutstandingBal(res.data.data.outStandingPaybles))
          }
        else{
            dispatch(partyOutstandingBal(0))
        }
        }
      }
    })
    .catch((error) => console.log(error));
  }
  const recordPaymentSummaryOnClickEvent = () => {
    dispatch(fromAdvanceFeature(true));
    setRecordPayModalStatus(true);
    setRecordPayModal(true);
    dispatch(fromAdvanceSummary(true));
    dispatch(fromParentSelect(true))
    getAdvancesOutStbal();
  };
  return (
    <div className="main_div_padding advance_empty_div">
      <div>
        {isLoading ? (
          <div className="">
            <img src={loading} alt="my-gif" className="gif_img" />
          </div>
        ) : (
          <div>
            {allData.length > 0 ? (
              <div className="row">
                <div className="col-lg-5 pl-0">
                  <div className="row">
                    <div className="col-lg-3 p-0">
                      <SelectOptions />
                    </div>
                    <div className="col-lg-9 p-0" id="search-field">
                      <div className="form-group has-search mb-0 bills_search advance_search">
                        <input
                          className="form-control"
                          id="searchbar"
                          placeholder="Search by Name"
                          onChange={(event) => {
                            handleSearch(event);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {advancesArray.length > 0 ? (
                    <div>
                      <div
                        className="table-scroll ledger-table"
                        id="scroll_style"
                      >
                        <div className="ledgers ledger_table_col">
                          <div className="row theadr-tag p-0">
                            <th class="col-lg-1">#</th>
                            <th class="col-lg-2">Date</th>
                            <th class="col-lg-6">Name</th>
                            <th class="col-lg-3">Given(₹)</th>
                          </div>
                          <div>
                            {advancesArray.map((item, index) => {
                              return (
                                <button
                                  className={
                                    selectedPartyId == item.partyId
                                      ? "tabRowSelected p-0"
                                      : "tr-tags p-0"
                                  }
                                  onClick={() =>
                                    particularLedgerData(item.partyId, item)
                                  }
                                >
                                  <div className="row align-items-center">
                                    <td className="col-lg-1">{index + 1}</td>
                                    <td key={item.date} className="col-lg-2">
                                      <p className="date_ledger_val">
                                        {" "}
                                        {moment(item.date).format("DD-MMM-YY")}
                                      </p>
                                    </td>
                                    <td
                                      key={item.partyName}
                                      className="col-lg-6"
                                    >
                                      <div className="d-flex">
                                        <div className="c-img">
                                          {item.profilePic ? (
                                            <img
                                              className="profile-img"
                                              src={item.profilePic}
                                              alt="pref-img"
                                            />
                                          ) : (
                                            <img
                                              className="profile-img"
                                              src={single_bill}
                                              alt="img"
                                            />
                                          )}
                                        </div>
                                        <div>
                                          <p className="namedtl-tag">
                                            {item.partyName}
                                          </p>
                                          <div className="d-flex align-items-center">
                                            <p className="mobilee-tag">
                                              {!item.trader
                                                ? item.partyType == "FARMER"
                                                  ? "Farmer"
                                                  : getText(item.partyType)
                                                : "Trader"}{" "}
                                              - {item.partyId}&nbsp;
                                            </p>
                                            <p className="mobilee-tag desk_responsive">
                                              {" | " +
                                                getMaskedMobileNumber(
                                                  item.mobile
                                                )}
                                            </p>
                                          </div>
                                          <p className="mobilee-tag mobile_responsive">
                                            {getMaskedMobileNumber(item.mobile)}
                                          </p>
                                          <p className="address-tag">
                                            {item.partyAddress
                                              ? item.partyAddress
                                              : ""}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="col-lg-3" key={item.amount}>
                                      <p className="paid-coloring">
                                        {item.amount != 0
                                          ? getCurrencyNumberWithOutSymbol(
                                              item.amount
                                            )
                                          : 0}
                                      </p>
                                    </td>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="outstanding-pay d-flex align-items-center justify-content-between">
                        <p className="pat-tag"> Total Advances : </p>
                        <p className="paid-coloring">
                          {totalAdvances != 0
                            ? getCurrencyNumberWithSymbol(totalAdvances)
                            : 0}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="table-scroll nodata_scroll">
                      <div className="row partner_no_data_widget_rows">
                        <div className="col-lg-5">
                          <div className="partner_no_data_widget">
                            <div className="text-center">
                              <img
                                src={no_data_icon}
                                alt="icon"
                                className="d-flex mx-auto justify-content-center"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {advancesArray.length > 0 ? (
                <div className="col-lg-7 p-0">
                  <div className="d-flex partner_tabs mb-0 ledger_all_custom justify-content-between align-items-end">
                    <ul className="nav nav-tabs mb-0" id="myTab" role="tablist">
                      {tabs.map((tab) => {
                        return (
                          <li key={tab.id} className="nav-item ">
                            <a
                              className={
                                "nav-link" +
                                (allCustom == tab.to ? " active" : "")
                              }
                              href={"#" + tab.name}
                              role="tab"
                              aria-controls="home"
                              data-bs-toggle="tab"
                              onClick={() => allCustomEvent(tab.to)}
                            >
                              {tab.name}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                    <button
                      className="primary_btn add_bills_btn"
                      onClick={recordPaymentOnClickEvent}
                    >
                      <img src={addbill_icon} alt="image" className="mr-2" />
                      Record Advance
                    </button>
                  </div>
                  <p
                    className={
                      dateDisplay && allCustom == "custom" ? "" : "padding_all"
                    }
                  ></p>

                  <div className="my-2">
                    <div
                      style={{
                        display:
                          dateDisplay && allCustom == "custom"
                            ? "flex"
                            : "none",
                      }}
                      className="dateRangePicker justify-content-center"
                    >
                      <button onClick={onclickDate} className="color_blue">
                        <div className="date_icon m-0">
                          <img
                            src={date_icon}
                            alt="icon"
                            className="mr-2 date_icon_in_custom"
                          />
                          {dateValue}
                        </div>
                      </button>
                    </div>
                  </div>
                  <AdvanceSummary />
                </div>
                ) :
                <div className="col-lg-7">
                  <div className="partner_no_data_widget d-flex align-items-center justify-content-center" style={{'height':'100%'}}>
                    <div className="text-center">
                      <img
                        src={no_data_icon}
                        alt="icon"
                        className="d-flex mx-auto justify-content-center"
                      />
                    </div>
                  </div>
                </div>
               }
              </div>
            ) : (
              <div className="row partner_no_data_widget_rows">
                <div className="col-lg-5">
                  <div className="partner_no_data_widget">
                    <div className="text-center">
                      <img
                        src={no_data_icon}
                        alt="icon"
                        className="d-flex mx-auto justify-content-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {showDatepickerModal1 ? (
          <DatePickerModel
            show={showDatepickerModal}
            close={() => setShowDatepickerModal(false)}
            parentCallback={callbackFunction}
            // datePickerCall={datePickerCall}
          />
        ) : (
          <p></p>
        )}
        {recordPayModalStatus ? (
          <TransportoRecord
            showRecordPayModal={recordPayModal}
            closeRecordPayModal={() => setRecordPayModal(false)}
            // tabs={tabs}
            // type={"TRANS"}
          />
        ) : (
          ""
        )}
      </div>
      <div className="addIcon_div">
        <button
          className="primary_btn add_bills_btn advance_add_btn"
          onClick={recordPaymentSummaryOnClickEvent}
        >
          <img src={addIcon} alt="image" />
        </button>
      </div>
    </div>
  );
};
export default Advance;