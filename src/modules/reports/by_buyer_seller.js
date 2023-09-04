import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import loading from "../../assets/images/loading.gif";
import no_data_icon from "../../assets/images/NodataAvailable.svg";
import moment from "moment";
import single_bill from "../../assets/images/bills/single_bill.svg";
import date_icon from "../../assets/images/date_icon.svg";
import DatePickerModel from "../smartboard/datePicker";
import { dateFormat } from "../../reducers/advanceSlice";
import { getMaskedMobileNumber } from "../../components/getCurrencyNumber";
import { getText } from "../../components/getText";
import "../../modules/advances/selectedOptions.scss";
import {
  allCustomTabs,
  allLedgers,
  beginDate,
  closeDate,
} from "../../reducers/ledgerSummarySlice";
import { dateCustomStatus } from "../../reducers/billEditItemSlice";
import { getLedgers } from "../../actions/ledgersService";
import {
  getCustomSalesAndPurchasesByBuyer,
  getSalesAndPurchasesByBuyer,
} from "../../actions/reportsService";
import {
  bySellerBuyerSummary,
  bySellerBuyerSummaryObj,
  selectedReportId,
  selectedReportSeller,
} from "../../reducers/reportsSlice";
import ByBuyerSellerSummary from "./by_buyer_seller_summary";
import print from "../../assets/images/print_bill.svg";
import download_icon from "../../assets/images/dwnld.svg";
import { ToastContainer, toast } from "react-toastify";
import { Buffer } from "buffer";
import { getSalesSummaryJson } from "../../actions/pdfservice/billpdf/getSalesSummaryPdfJson";
import { getSalesSummaryPdf } from "../../actions/pdfservice/reportsPdf";
import { getSalesByBuyerSummaryJson } from "../../actions/pdfservice/billpdf/getSalesByBuyerPdfJson";
const ByBuyerSeller = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const advancesData = useSelector((state) => state.advanceInfo);
  const billEditItemInfo = useSelector((state) => state.billEditItemInfo);

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
  const ledgers = ledgersSummary?.allLedgers;
  const allCustom = ledgersSummary?.allCustomTabs;
  const [dateDisplay, setDateDisplay] = useState(false);
  var newDate = moment(new Date()).format("YYYY-MM-DD");
  var date = moment(new Date()).format("YYYY-MM-DD");
  var defaultDate = moment(new Date()).format("DD-MMM-YYYY");
  const startDate = ledgersSummary?.beginDate;
  const endDate = ledgersSummary?.closeDate;
  var dateValue = advancesData?.dateFormat;
  var [datesValue, setDateValue] = useState(date + " to " + date);
  const [showDatepickerModal, setShowDatepickerModal] = useState(false);
  const [showDatepickerModal1, setShowDatepickerModal1] = useState(false);
  const [allData, setAllData] = useState(ledgersSummary?.allLedgers);
  const [partyId, setPartyId] = useState(0);
  const [ledgerData, setLedgerData] = useState({});
  const ledgerType = props.Ptype;
  const reportsData = useSelector((state) => state.reportsInfo);
  const selectedPartyId = reportsData?.selectedReportId;
  useEffect(() => {
    fetchLedgers();
    dispatch(allCustomTabs("all"));
    dispatch(beginDate(date));
    dispatch(closeDate(date));
    callbackFunction(date, date, "Custom");
    console.log(props.Ptype)
  }, [props.Ptype]);
  const fetchLedgers = () => {
    var type = ledgerType == "FARMER" ? "SELLER" : ledgerType;
    getLedgers(clickId, type)
      .then((res) => {
        if (res.data.status.type === "SUCCESS") {
          setLoading(false);
          if (res.data.data !== null) {
            console.log(res.data.data, "salesandpurchase");
            setAllData(res.data.data.ledgers);
            dispatch(allLedgers(res.data.data.ledgers));
            setPartyId(res.data.data.ledgers[0].partyId);
            setLedgerData(res.data.data.ledgers[0]);

            if (res.data.data.ledgers.length > 0) {
              setPartyId(res.data.data.ledgers[0].partyId);
              dispatch(selectedReportId(res.data.data.ledgers[0].partyId));
              getSalesByBuyerSummary(res.data.data.ledgers[0].partyId);
              dispatch(selectedReportSeller(res.data.data.ledgers[0]));
              console.log(res.data.data.ledgers[0], "led1");
            }
          } else {
            dispatch(allLedgers([]));
            dispatch(setLedgerData(null));
          }
        }
      })
      .catch((error) => {});
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
      }else if (data.partyAddress.toLowerCase().includes(value)) {
        return data.partyAddress.toLowerCase().search(value) != -1;
      }
    });
    dispatch(allLedgers(result));
  };
  const particularLedgerData = (id, item) => {
    if (allCustom == "custom") {
      dispatch(allCustomTabs("all"));
      setDateDisplay(false);
      callbackFunction(date, date, "Custom");
    }
    dispatch(dateCustomStatus(true));
    dispatch(selectedReportId(id));
    getSalesByBuyerSummary(id);
    dispatch(selectedReportSeller(item));
    setPartyId(id);
  };
  const getSalesByBuyerSummary = (id) => {
    getSalesAndPurchasesByBuyer(clickId, ledgerType, id)
      .then((res) => {
        if (res.data.status.type === "SUCCESS") {
          if (res.data.data != null) {
            console.log(res.data.data, "res.data.data");
            dispatch(bySellerBuyerSummary(res.data.data.items));
            dispatch(bySellerBuyerSummaryObj(res.data.data));
          } else {
            dispatch(bySellerBuyerSummary([]));
            dispatch(bySellerBuyerSummaryObj(null));
          }
        }
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };
  const getCustomDetailedSalesByBuyer = (partyId, fromDate, toDate) => {
    getCustomSalesAndPurchasesByBuyer(
      clickId,
      ledgerType,
      partyId,
      fromDate,
      toDate
    )
      .then((res) => {
        if (res.data.status.type == "SUCCESS") {
          if (res.data.data != null) {
            dispatch(bySellerBuyerSummary(res.data.data.items));
            dispatch(bySellerBuyerSummaryObj(res.data.data));
          } else {
            dispatch(bySellerBuyerSummary([]));
            dispatch(bySellerBuyerSummaryObj(null));
          }
          setLoading(false);
        }
      })
      .catch((error) => console.log(error));
  };
  const allCustomEvent = (type) => {
    if (type == "custom") {
      setDateDisplay(true);
      if (billEditItemInfo?.dateCustom) {
        callbackFunction(newDate, newDate, "Custom");
      } else {
        getCustomDetailedSalesByBuyer(selectedPartyId, startDate, endDate);
      }
    } else {
      getSalesByBuyerSummary(selectedPartyId);
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
    getCustomDetailedSalesByBuyer(selectedPartyId, fromDate, toDate);
  };
  const [isLoadingNew, setIsLoadingNew] = useState(false);
  async function handleLedgerSummaryJson() {
    setIsLoadingNew(true);
    var reportsJsonBody = getSalesByBuyerSummaryJson(
      reportsData,
      ledgersSummary?.beginDate,
      ledgersSummary?.closeDate,
      ledgersSummary?.allCustomTabs,
      ledgerType,
      false
    );
    var pdfResponse = await getSalesSummaryPdf(reportsJsonBody);
    console.log(pdfResponse, "pdfResponse");
    if (pdfResponse.status !== 200) {
      toast.error("Something went wrong", {
        toastId: "errorr2",
      });
      setIsLoadingNew(false);
      return;
    } else {
      toast.success("Pdf generated SuccessFully", {
        toastId: "errorr2",
      });
      var bufferData = Buffer.from(pdfResponse.data);
      var blob = new Blob([bufferData], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      setIsLoadingNew(false);
      window.open(blobUrl, "_blank");
    }
  }
  async function getDownloadPdf() {
    setIsLoadingNew(true);
    var reportsJsonBody = getSalesSummaryJson(
      reportsData,
      ledgersSummary?.beginDate,
      ledgersSummary?.closeDate,
      ledgersSummary?.allCustomTabs,
      ledgerType,false
    );
    var pdfResponse = await getSalesSummaryPdf(reportsJsonBody);
    console.log(pdfResponse, "pdfResponse");
    if (pdfResponse.status !== 200) {
      console.log(pdfResponse.status, "fasl");
      toast.error("Something went wrong", {
        toastId: "errorr2",
      });
      setIsLoadingNew(false);
      return;
    } else {
      console.log(pdfResponse.status, "true");
      toast.success("Pdf Downloaded SuccessFully", {
        toastId: "errorr2",
      });
      var bufferData = Buffer.from(pdfResponse.data);
      var blob = new Blob([bufferData], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      if (ledgerType == "BUYER") {
        link.setAttribute("download", `BY_BUYER_SUMMARY.pdf`); //or any other extension
      } else {
        link.setAttribute("download", `BY_SELLER_SUMMARY.pdf`); //or any other extension
      }
      document.body.appendChild(link);
      setIsLoadingNew(false);
      link.click();
      // setLoading(false);
    }
  }
  return (
    <div className="main_div_padding advance_empty_div p-0">
      <div>
        {isLoading ? (
          <div className="">
            <img src={loading} alt="my-gif" className="gif_img" />
          </div>
        ) : (
          <div>
            {allData.length > 0 ? (
              <div className="row">
                <div className="col-lg-4 pl-0">
                  <div className="row">
                    <div className="col-lg-12 p-0" id="search-field">
                      <div className="form-group mb-0 bills_search">
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
                  {ledgers.length > 0 ? (
                    <div>
                       <div className="row theadr-tag p-0">
                            <th class="col-lg-2"><p id="p-common-sno">#</p></th>
                            <th class="col-lg-10">Name</th>
                          </div>
                      <div
                        className="table-scroll ledger-table by_seller_buyer_table"
                        id="scroll_style"
                      >
                        <div className="ledgers ledger_table_col">
                         
                          <div>
                            {ledgers.map((item, index) => {
                              return (
                                <button
                                  className={
                                    partyId == item.partyId
                                      ? "tabRowSelected p-0"
                                      : "tr-tags p-0"
                                  }
                                  onClick={() =>
                                    particularLedgerData(item.partyId, item)
                                  }
                                >
                                  <div className="row align-items-center">
                                    <td className="col-lg-2"><p id="p-common-sno">{index + 1}</p></td>

                                    <td
                                      key={item.partyName}
                                      className="col-lg-10"
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
                                        <div className="text-left">
                                          <p className="namedtl-tag">
                                            {item.partyName +
                                              (item.shortName != ""
                                                ? "- " + item.shortName
                                                : "")}
                                          </p>
                                          <div className="d-flex align-items-center">
                                            <p className="mobilee-tag">
                                              {!item.trader
                                                ? item.partyType == "FARMER"
                                                  ? "Farmer"
                                                  : getText(ledgerType)
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
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="table-scroll nodata_scroll by_seller_buyer_table">
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
                {ledgers.length > 0 ? (
                  <div className="col-lg-8 p-0">
                    <div className="d-flex justify-content-between">
                    <div className="d-flex partner_tabs mb-0 ledger_all_custom justify-content-between align-items-end">
                      <ul
                        className="nav nav-tabs mb-0"
                        id="myTab"
                        role="tablist"
                      >
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
                    <div className="print_dwnld_icons d-flex">
                    <button
                    onClick={() => {
                      getDownloadPdf().then();
                    }}
                    >
                      <img src={download_icon} alt="img" />
                    </button>
                    <button
                      onClick={() => {
                        handleLedgerSummaryJson().then();
                      }}
                    >
                      <img src={print} alt="img" />
                    </button>
                  </div>
                    </div>
                    <p
                      className={
                        dateDisplay && allCustom == "custom"
                          ? ""
                          : "padding_all"
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
                    {
                        reportsData?.selectedReportSeller != null ? <ByBuyerSellerSummary type={ledgerType}  /> : ''
                    }
                  </div>
                ) : (
                  <div className="col-lg-7">
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
          />
        ) : (
          <p></p>
        )}
      </div>
      <ToastContainer />
      {isLoadingNew ? (
          <div className="loading_styles loading_styles_led">
            <img src={loading} alt="my-gif" className="gif_img" />
          </div>
        ) : (
          ""
        )}
    </div>
  );
};
export default ByBuyerSeller;
