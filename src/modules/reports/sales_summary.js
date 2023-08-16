import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import loading from "../../assets/images/loading.gif";
import no_data_icon from "../../assets/images/NodataAvailable.svg";
import moment from "moment";
import date_icon from "../../assets/images/date_icon.svg";
import DatePickerModel from "../smartboard/datePicker";
import { dateFormat } from "../../reducers/advanceSlice";
import {
  getCurrencyNumberWithOneDigit,
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
} from "../../components/getCurrencyNumber";
import {
  allCustomTabs,
  beginDate,
  closeDate,
} from "../../reducers/ledgerSummarySlice";
import {
  customSalesSummary,
  getSalesSummary,
} from "../../actions/reportsService";
import { salseSummaryData, summaryObj } from "../../reducers/reportsSlice";
import "../reports/summary_reports.scss";
import { qtyValues } from "../../components/qtyValues";
const SalesSummary = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const reportsData = useSelector((state) => state.reportsInfo);
  const advancesData = useSelector((state) => state.advanceInfo);
  const billEditItemInfo = useSelector((state) => state.billEditItemInfo);
  const summaryArray = reportsData?.salseSummaryData;
  const totalSummaryData = reportsData?.summaryObj;
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
  var newDate = moment(new Date()).format("YYYY-MM-DD");
  var date = moment(new Date()).format("YYYY-MM-DD");
  var defaultDate = moment(new Date()).format("DD-MMM-YYYY");
  const startDate = ledgersSummary?.beginDate;
  const endDate = ledgersSummary?.closeDate;
  var dateValue = advancesData?.dateFormat;
  console.log(dateValue, "date1");
  var [datesValue, setDateValue] = useState(date + " to " + date);
  const [showDatepickerModal, setShowDatepickerModal] = useState(false);
  const [showDatepickerModal1, setShowDatepickerModal1] = useState(false);
  const partyType = props.type;
  useEffect(() => {
    getAllSalesSummary();
    dispatch(allCustomTabs("all"));
    dispatch(beginDate(date));
    dispatch(closeDate(date));
    // callbackFunction(date, date, "Custom");
    console.log(summaryArray, partyType, dateValue, "useeffect all data");
  }, [props.type]);
  const getAllSalesSummary = () => {
    getSalesSummary(clickId, partyType)
      .then((res) => {
        if (res.data.status.type === "SUCCESS") {
          if (res.data.data != null) {
            dispatch(salseSummaryData(res.data.data.items));
            console.log(res.data.data, "rres");
            dispatch(salseSummaryData(res.data.data.items));
            dispatch(summaryObj(res.data.data));
          } else {
            dispatch(salseSummaryData([]));
          }
        }
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const getCustomDetailedSummary = (fromDate, toDate) => {
    customSalesSummary(clickId, partyType, fromDate, toDate)
      .then((res) => {
        if (res.data.status.type == "SUCCESS") {
          if (res.data.data != null) {
            dispatch(salseSummaryData(res.data.data.items));
            dispatch(summaryObj(res.data.data));
          } else {
            dispatch(salseSummaryData([]));
            dispatch(summaryObj(null));
          }
          setLoading(false);
        }
      })
      .catch((error) => console.log(error));
  };
  const allCustomEvent = (type) => {
    if (type == "custom") {
      setDateDisplay(true);
      console.log(billEditItemInfo);
      if (billEditItemInfo?.dateCustom) {
        callbackFunction(newDate, newDate, "Custom");
      } else {
        getCustomDetailedSummary(startDate, endDate);
      }
    } else {
      getAllSalesSummary();
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
      dispatch(
        dateFormat(
          moment(fromDate).format("DD-MMM-YYYY") +
            " to " +
            moment(toDate).format("DD-MMM-YYYY")
        )
      );
    } else if (dateTab === "Monthly") {
      dispatch(dateFormat(moment(fromDate).format("MMM-yyy")));
    } else if (dateTab === "Yearly") {
      dispatch(dateFormat(moment(fromDate).format("YYYY")));
    } else {
      dispatch(
        dateFormat(
          moment(fromDate).format("DD-MMM-YYYY") +
            " to " +
            moment(toDate).format("DD-MMM-YYYY")
        )
      );
    }
    dispatch(beginDate(fromDate));
    dispatch(closeDate(toDate));
    console.log(fromDate, toDate, "fdate");
    getCustomDetailedSummary(fromDate, toDate);
  };

  return (
    <div className="main_div_padding advance_empty_div py-0">
      <div>
        {isLoading ? (
          <div className="">
            <img src={loading} alt="my-gif" className="gif_img" />
          </div>
        ) : (
          <div>
            {/* {allData.length > 0 ? ( */}
            <div className="row">
              <div className="col-lg-12 p-0">
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
                        dateDisplay && allCustom == "custom" ? "flex" : "none",
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
                {totalSummaryData != null ? (
                  <div>
                    <div className="card details-tag">
                      <div
                        className="card-body advance_card_body"
                        id="card-details"
                      >
                        <div className="row">
                          <div id="verticalLines" className="col-lg-6 d-block">
                            <p className="card-text paid">Total Quantities</p>
                            <p className="">
                              {(totalSummaryData?.totalUnits != 0
                                ? getCurrencyNumberWithOneDigit(
                                    totalSummaryData?.totalUnits
                                  )
                                : 0) +
                                " | " +
                                (totalSummaryData?.totalWeight != 0
                                  ? getCurrencyNumberWithOneDigit(
                                      totalSummaryData?.totalWeight
                                    )
                                  : 0)}
                            </p>
                          </div>
                          <div className="col-lg-3">
                            <p className="card-text paid">
                              {partyType == "BUYER"
                                ? "Total Sales"
                                : "Total Purchases"}
                            </p>
                            <p className="">
                              {totalSummaryData?.totalItemsRate != 0
                                ? getCurrencyNumberWithSymbol(
                                    totalSummaryData?.totalItemsRate
                                  )
                                : 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {summaryArray.length > 0 ? (
                      <div
                        className="ledger-table"
                      >
                          <div className="row thead-tag head_tag p-0">
                              <th class="col-1">
                                <p id="p-common-sno">#</p>
                              </th>
                              <th class="col-2">Name</th>
                              <th class="col-6">
                                Item<br></br> Unit | Kgs | Rate
                              </th>
                              <th class="col-3">Total(₹)</th>
                           
                          </div>
                       <div className="table-scroll ledger-table sales_summary_table"
                        id="scroll_style">
                       <table className="table table-bordered advance_table_border ledger-table">
                        
                        <tbody>
                          {summaryArray.map((item, index) => {
                            return (
                              <tr className="align-items-center">
                                <td className="col-1">
                                  <p id="p-common-sno">{index + 1}</p>
                                </td>
                                <td className="col-2">
                                  <div>
                                    <p className="date_ledger_val">
                                      {item.partyName}
                                    </p>
                                    <p>
                                      <span className="color_blue">
                                        {item.billId}
                                      </span>
                                      {" | " +
                                        moment(item.date).format("DD-MMM-YY")}
                                    </p>
                                  </div>
                                </td>
                                <td className="col-6">
                                  <p>{item.cropName}</p>
                                  <p className="d-flex">
                                    <span>
                                      {qtyValues(
                                        item.qty,
                                        item.qtyUnit,
                                        item.weight,
                                        item.wastage,
                                        item.rateType
                                      )}
                                    </span>
                                    &nbsp;
                                    <span>
                                      {" | " +
                                        (item.rate != 0
                                          ? getCurrencyNumberWithOneDigit(
                                              item.rate
                                            )
                                          : 0)}
                                    </span>
                                  </p>
                                </td>
                                <td className="col-3" key={item.total}>
                                  <p className="">
                                    {item.total != 0
                                      ? getCurrencyNumberWithOutSymbol(
                                          item.total
                                        )
                                      : 0}
                                  </p>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
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
                ) : (
                  <div className="col-lg-12">
                    <div
                      className="partner_no_data_widget d-flex align-items-center justify-content-center"
                      style={{ height: "100%" }}
                    >
                      <div className="text-center">
                        <img
                          src={no_data_icon}
                          alt="icon"
                          className="d-flex mx-auto justify-content-center"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* )  */}
            {/* // : (
            //   <div className="row partner_no_data_widget_rows">
            //     <div className="col-lg-5">
            //       <div className="partner_no_data_widget">
            //         <div className="text-center">
            //           <img
            //             src={no_data_icon}
            //             alt="icon"
            //             className="d-flex mx-auto justify-content-center"
            //           />
            //         </div>
            //       </div>
            //     </div>
            //   </div>
            // )} */}
          </div>
        )}
        {showDatepickerModal1 ? (
          <DatePickerModel
            show={showDatepickerModal}
            close={() => setShowDatepickerModal(false)}
            parentCallback={callbackFunction}
          />
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};
export default SalesSummary;
