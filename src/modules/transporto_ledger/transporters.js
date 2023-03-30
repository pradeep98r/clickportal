import React, { Fragment, useEffect, useState } from "react";
import {
  getInventory,
  getInventoryLedgers,
  getInventorySummary,
  getParticularTransporter,
  getTransporters,
} from "../../actions/transporterService";
import SearchField from "../../components/searchField";
import single_bill from "../../assets/images/bills/single_bill.svg";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
  getMaskedMobileNumber,
} from "../../components/getCurrencyNumber";
import no_data_icon from "../../assets/images/NodataAvailable.svg";
import moment from "moment";
import PaymentLedger from "./paymentLedger";
import InventoryLedger from "./inventoryLedger";
import { getOutstandingBal } from "../../actions/ledgersService";
import AddRecordInventory from "./addRecordInventory";
import { useDispatch, useSelector } from "react-redux";
import addbill_icon from "../../assets/images/addbill.svg";
import {
  outstandingAmount,
  paymentSummaryInfo,
  paymentTotals,
  singleTransporterObject,
  transpoLedgersInfo,
  transporterIdVal,
  inventoryTotals,
  inventorySummaryInfo,
  outstandingBalForParty,
  inventoryUnitDetails,
  allPartnersInfo,
  singleTransporter,
  fromInv,
  outstandingAmountInv,
  transpoTabs,
  transporterMainTab,
  fromTransporter,
} from "../../reducers/transpoSlice";
import add from "../../assets/images/add.svg";
import AddRecordPayment from "./transportoRecord";
import { getCropUnit } from "../../components/getCropUnitValue";
import { getPartnerData } from "../../actions/billCreationService";
import TransportoRecord from "./transportoRecord";
const Transporters = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const dispatch = useDispatch();
  const clickId = loginData.caId;
  const transpoData = useSelector((state) => state.transpoInfo);
  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);
  const [allData, setallData] = useState(transpoData?.transpoLedgersInfo);
  var transporter = transpoData?.transpoLedgersInfo;
  var transporterId = transpoData?.transporterIdVal;
  var outStAmt = transpoData?.outstandingAmount;
  var transData = transpoData?.singleTransporterObject;
  var fromInventoryTab = transpoData?.fromInv;
  var outstandingAmountInvData = transpoData?.outstandingAmountInv;
  const transpotoTabValue=props.transPortoTabVal;
  const [tabs, setTabs] = useState(
    props.transPortoTabVal == "inventoryLedgerSummary"
      ? "inventoryledger"
      : "paymentledger"
  );
  var payLedger = transpoData?.paymentTotals;
  var invLedger = transpoData?.inventoryTotals;
  useEffect(() => {
    console.log("useeffectt");
    if (props.transPortoTabVal == "inventoryLedgerSummary") {
      console.log(props.transPortoTabVal, "inv");
      setTabs("inventoryledger");
      dispatch(transpoTabs("inventoryledger"))
      getInventoryData();
    } else {
      console.log(props.transPortoTabVal, "all");
      getTransportersData();
      setTabs("paymentledger")
      dispatch(transpoTabs("paymentledger"))
    }
    dispatch(transporterMainTab(props.transPortoTabVal));
  }, [props]);

  const getTransportersData = () => {
    getTransporters(clickId).then((response) => {
      dispatch(fromInv(false));
      dispatch(outstandingAmount(response.data.data));
      dispatch(transporterIdVal(response.data.data.ledgers[0].partyId));
      dispatch(singleTransporterObject(response.data.data.ledgers[0]));
      setallData(response.data.data.ledgers);
      dispatch(transpoLedgersInfo(response.data.data.ledgers));
      getOutstandingPaybles(clickId, response.data.data.ledgers[0].partyId);
      paymentLedger(clickId, response.data.data.ledgers[0].partyId);
      inventoryLedger(clickId, response.data.data.ledgers[0].partyId);
      getInventoryRecord(clickId, response.data.data.ledgers[0].partyId);
      getPartners(clickId);
    });
  };
  const getInventoryData = () => {
    getInventorySummary(clickId).then((response) => {
      console.log(response.data.data);
      dispatch(outstandingAmountInv(response.data.data.totalInventory));
      dispatch(
        transporterIdVal(response.data.data.summaryInfo[0].transporterId)
      );
      dispatch(singleTransporterObject(response.data.data.summaryInfo[0]));
      setallData(response.data.data.summaryInfo);
      console.log(response.data.data.summaryInfo, "inv");
      dispatch(transpoLedgersInfo(response.data.data.summaryInfo));
      getOutstandingPaybles(
        clickId,
        response.data.data.summaryInfo[0].transporterId
      );
      paymentLedger(clickId, response.data.data.summaryInfo[0].transporterId);
      inventoryLedger(clickId, response.data.data.summaryInfo[0].transporterId);
      getInventoryRecord(
        clickId,
        response.data.data.summaryInfo[0].transporterId
      );
      getPartners(clickId);
      dispatch(fromInv(true));
    });
  };
  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    console.log(allData,"data")
    result = allData.filter((data) => {
      if (data.mobile.includes(value)) {
        return data.mobile.search(value) != -1;
      } else if (data?.partyName?.toLowerCase().includes(value)
          || data?.transporterName?.toLowerCase().includes(value)) {
        return (data?.partyName?.toLowerCase().search(value) != -1 ||
         data?.transporterName?.toLowerCase().search(value) != -1);
      } else if (data?.partyId?.toString().includes(value) ||
        data?.transporterId?.toString().includes(value) ) {
        return (data?.partyId?.toString().search(value) != -1 ||
        data?.transporterId?.toString().search(value) != -1);
      } else if (data?.partyAddress?.toLowerCase().includes(value) ||
        data?.addressLine?.toLowerCase().includes(value)) {
        return (data?.partyAddress?.toLowerCase().search(value) != -1 ||
        data?.addressLine?.toLowerCase().search(value) != -1);
      } else if (data.shortName.toLowerCase().includes(value)) {
        return data.shortName.toLowerCase().search(value) != -1;
      }
    });
    dispatch(transpoLedgersInfo(result));
  };
  const links = [
    {
      id: 1,
      name: "Detailed Payment Ledger",
      to: "paymentledger",
    },
    {
      id: 2,
      name: "Detailed Inventory Ledger",
      to: "inventoryledger",
    },
  ];
  const particularTransporter = (transporterId, item) => {
    dispatch(transporterIdVal(transporterId));
    dispatch(singleTransporterObject(item));
    getOutstandingPaybles(clickId, transporterId);
    getInventoryRecord(clickId, transporterId);
    if(transpotoTabValue == 'inventoryLedgerSummary' && tabs =='inventoryledger'){
      inventoryLedger(clickId, transporterId);
    }
    var transTabs = "";
    if (tabs == "inventoryledger" && transpotoTabValue == 'transporterLedger') {
      setTabs("paymentledger");
      transTabs = "paymentledger";
    }
    if (tabs == "paymentledger" || transTabs == "paymentledger") {
      paymentLedger(clickId, transporterId);
    }
  };
  const tabEvent = (type) => {
    dispatch(transpoTabs(type));
    if (type == "inventoryledger") {
      inventoryLedger(clickId, transporterId);
    }
    if (type == "paymentledger") {
      paymentLedger(clickId, transporterId);
    }
    setTabs(type);
  };
  //get Payment Ledger
  const paymentLedger = (clickId, partyId) => {
    getParticularTransporter(clickId, partyId)
      .then((response) => {
        if (response.data.data != null) {
          dispatch(paymentTotals(response.data.data));
          dispatch(paymentSummaryInfo(response.data.data.details));
        } else {
          dispatch(paymentTotals([]));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // get Inventory Ledger
  const inventoryLedger = (clickId, transId) => {
    getInventoryLedgers(clickId, transId)
      .then((response) => {
        dispatch(inventoryTotals(response.data.data));
        dispatch(inventorySummaryInfo(response.data.data.details));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getPartners = (clickId) => {
    getPartnerData(clickId, "TRANSPORTER")
      .then((response) => {
        if (response.data.data != null) {
          dispatch(allPartnersInfo(response.data.data));
          dispatch(singleTransporter(response.data.data[0]));
        } else {
          dispatch(allPartnersInfo([]));
        }
      })
      .catch((error) => {});
  };
  //Get Outstanding balance
  const getOutstandingPaybles = (clickId, partyId) => {
    getOutstandingBal(clickId, partyId).then((response) => {
      dispatch(outstandingBalForParty(response.data.data));
    });
  };

  //get Inventory
  const getInventoryRecord = (clickId, transId) => {
    getInventory(clickId, transId)
      .then((response) => {
        dispatch(inventoryUnitDetails(response.data.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [recordInventoryModalStatus, setRecordInventoryModalStatus] =
    useState(false);
  const [recordInventoryModal, setRecordInventoryModal] = useState(false);
  const onClickInventoryRecord = () => {
    setRecordInventoryModalStatus(true);
    setRecordInventoryModal(true);
  };
  const [recordPayModalStatus, setRecordPayModalStatus] = useState(false);
  const [recordPayModal, setRecordPayModal] = useState(false);
  const onClickPaymentRecord = () => {
    dispatch(fromTransporter(false));
    setRecordPayModal(true);
    setRecordPayModalStatus(true);
  };
  return (
    <div className="">
      {allData.length > 0 ? (
        <div className="row">
          <div className="col-lg-5 pl-0">
            <div id="search-field">
              <SearchField
                placeholder="Search by Name / Short Code"
                onChange={(event) => {
                  handleSearch(event);
                }}
              />
            </div>
            {transporter.length > 0 ? (
              <div>
                <div
                  className="table-scroll ledger-table transporto_ledger_scroll ledger_table_col"
                  id="scroll_style"
                >
                  <div className="row theadr-tag p-0">
                    <th className="col-lg-1">#</th>
                    <th className="col-lg-2">Date</th>
                    <th class="col-lg-5">Transporter Name</th>
                    <th class="col-lg-4">To Be Paid(&#8377;)</th>
                  </div>
                  <div>
                    {transporter.map((item, index) => {
                      return (
                        <Fragment>
                          <button
                            onClick={() =>
                              particularTransporter(
                                fromInventoryTab
                                  ? item.transporterId
                                  : item.partyId,
                                item
                              )
                            }
                            className={
                              fromInventoryTab
                                ? transporterId == item.transporterId
                                  ? "tabRowSelected"
                                  : "tr-tags"
                                : transporterId == item.partyId
                                ? "tabRowSelected"
                                : "tr-tags"
                            }
                          >
                            <div className="row text-left align-items-center">
                              <td className="col-lg-1">{index + 1}</td>
                              <td className="col-lg-2" key={item.date}>
                                <p className="date_ledger_val">
                                  {" "}
                                  {moment(item.date).format("DD-MMM-YY")}
                                </p>
                              </td>
                              <td
                                className="col-lg-5 text-left"
                                key={item.partyName}
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
                                    <p className="namedtl-tag text-left">
                                      {fromInventoryTab
                                        ? item.transporterName
                                        : item.partyName}
                                    </p>
                                    <div className="d-flex align-items-center">
                                      <p className="mobilee-tag">
                                        {fromInventoryTab
                                          ? item.transporterId
                                          : item.partyId}
                                        &nbsp;
                                      </p>
                                      <p className="mobilee-tag desk_responsive">
                                        {" | " +
                                          getMaskedMobileNumber(item.mobile)}
                                      </p>
                                    </div>
                                    <p className="mobilee-tag mobile_responsive">
                                      {getMaskedMobileNumber(item.mobile)}
                                    </p>
                                    <p className="address-tag">
                                      {fromInventoryTab
                                        ? item.addressLine
                                        : item.partyAddress
                                        ? item.partyAddress
                                        : ""}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="col-lg-4" key={item.tobePaidRcvd}>
                                {fromInventoryTab ? (
                                  <p className="color_black coloring">
                                    {item.inventory?.length > 0 &&
                                      item.inventory?.map((itemVal, index) => {
                                        return itemVal.qty
                                          ? itemVal.qty.toFixed(1) +
                                              " " +
                                              getCropUnit(
                                                itemVal.unit,
                                                itemVal.qty
                                              )
                                          : "";
                                      })}
                                  </p>
                                ) : (
                                  <p className="color_red coloring">
                                    {item.tobePaidRcvd
                                      ? getCurrencyNumberWithOutSymbol(
                                          item.tobePaidRcvd
                                        )
                                      : 0}
                                  </p>
                                )}
                              </td>
                            </div>
                          </button>
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
                <div className="outstanding-pay ">
                  {fromInventoryTab ? (
                    <div className="d-flex align-items-center justify-content-between">
                      <p className="pat-tag"> Total Inventory Balance : </p>
                      <p className="color_black coloring">
                        {outstandingAmountInvData.length > 0 &&
                          outstandingAmountInvData.map((itemVal, index) => {
                            return itemVal.qty
                              ? itemVal.qty.toFixed(1) +
                                  " " +
                                  getCropUnit(itemVal.unit, itemVal.qty)
                              : "";
                          })}
                      </p>
                    </div>
                  ) : (
                    <p className="values-tag color_red">
                      <div className="d-flex align-items-center justify-content-between">
                        <p className="pat-tag">Outstanding Paybles:</p>
                        <p>
                          {outStAmt?.totalOutStgAmt
                            ? getCurrencyNumberWithSymbol(
                                outStAmt?.totalOutStgAmt
                              )
                            : 0}
                        </p>
                      </div>
                    </p>
                  )}
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
          <div className="col-lg-7 p-0">
            <div className="card details-tag">
              <div className="card-body" id="card-details">
                <div className="row">
                  <div className="col-lg-3" id="verticalLines">
                    <div className="profilers-details" key={transData.partyId}>
                      <div className="d-flex">
                        <div>
                          {transData.profilePic ? (
                            <img
                              id="singles-img"
                              src={transData.profilePic}
                              alt="buy-img"
                            />
                          ) : (
                            <img id="singles-img" src={single_bill} alt="img" />
                          )}
                        </div>
                        <div id="ptr-dtls">
                          <p className="namedtl-tag">
                            {" "}
                            {fromInventoryTab
                              ? transData.transporterName
                              : transData.partyName}
                          </p>
                          <p className="mobilee-tag">
                            {fromInventoryTab
                              ? transData.transporterId
                              : transData.partyId}
                            &nbsp;
                          </p>
                          <p className="mobilee-tag">
                            {getMaskedMobileNumber(transData?.mobile)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {tabs === "paymentledger" && (
                    <>
                      <div className="col-lg-3" id="verticalLines">
                        <p className="card-text paid">
                          {langFullData.totalBusiness}{" "}
                          <p className="coloring color_black">
                            {payLedger?.totalToBePaid
                              ? getCurrencyNumberWithSymbol(
                                  payLedger.totalToBePaid
                                )
                              : 0}
                          </p>
                        </p>
                      </div>
                      <div className="col-lg-3" id="verticalLines">
                        <p className="total-paid">
                          {langFullData.totalPaid}
                          <p className="coloring color_black">
                            {payLedger.totalPaid
                              ? getCurrencyNumberWithSymbol(payLedger.totalPaid)
                              : 0}
                          </p>{" "}
                        </p>
                      </div>
                      <div className="col-lg-3 d-flex align-items-center">
                        <p className="out-standing">
                          {langFullData.outstandingPayables}
                          <p className="coloring color_black">
                            {payLedger.totalOutStandingBalance
                              ? getCurrencyNumberWithSymbol(
                                  payLedger.totalOutStandingBalance
                                )
                              : 0}
                          </p>
                        </p>
                      </div>
                    </>
                  )}
                  {tabs === "inventoryledger" && (
                    <>
                      <div className="col-lg-3" id="verticalLines">
                        <p className="card-text paid">
                          Total Given{" "}
                          <p className="coloring color_black">
                            {invLedger.totalGiven
                              ? invLedger.totalGiven.map((item) => {
                                  return item.qty > 0
                                    ? item.qty.toFixed(1) +
                                        " " +
                                        getCropUnit(item.unit, item.qty)
                                    : "";
                                })
                              : 0}
                          </p>
                        </p>
                      </div>
                      <div className="col-lg-3" id="verticalLines">
                        <p className="total-paid">
                          Total Collected
                          <p className="coloring color_black">
                            {invLedger.totalCollected
                              ? invLedger.totalCollected.map((item) => {
                                  return item.qty > 0
                                    ? item.qty.toFixed(1) +
                                        " " +
                                        getCropUnit(item.unit, item.qty)
                                    : "";
                                })
                              : 0}
                          </p>{" "}
                        </p>
                      </div>
                      <div className="col-lg-3">
                        <p className="out-standing">
                          Total Balance
                          <p className="coloring color_black">
                            {invLedger.balance
                              ? invLedger.balance.map((item) => {
                                  return item.qty
                                    ? item.qty.toFixed(1) +
                                        " " +
                                        getCropUnit(item.unit, item.qty)
                                    : "";
                                })
                              : 0}
                          </p>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <span id="horizontal-line-card"></span>
              <div className="d-flex justify-content-between align-items-end">
                <ul
                  className="nav nav-tabs ledger_tabs"
                  id="myTab"
                  role="tablist"
                >
                  {links.map((link) => {
                    return (
                      <li key={link.id} className="nav-item ">
                        <a
                          className={
                            "nav-link" + (tabs == link.to ? " active" : "")
                          }
                          href={"#" + link.to}
                          role="tab"
                          aria-controls="home"
                          data-bs-toggle="tab"
                          onClick={() => tabEvent(link.to)}
                        >
                          {link.name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
                {tabs == "paymentledger" ? (
                  <button
                    className="primary_btn add_bills_btn"
                    onClick={() => {
                      onClickPaymentRecord();
                    }}
                  >
                    <img src={addbill_icon} alt="image" className="mr-2" />
                    Add Record
                  </button>
                ) : tabs == "inventoryledger" ? (
                  <button
                    className="primary_btn add_bills_btn"
                    onClick={() => {
                      onClickInventoryRecord();
                    }}
                  >
                    <img src={addbill_icon} alt="image" className="mr-2" />
                    Add Record
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
            {tabs == "paymentledger" ? (
              <PaymentLedger tabs={tabs} />
            ) : tabs == "inventoryledger" ? (
              <InventoryLedger tabs={tabs} />
            ) : (
              ""
            )}
          </div>
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
      {recordInventoryModalStatus ? (
        <AddRecordInventory
          showRecordInventoryModal={recordInventoryModal}
          closeRecordInventoryModal={() => setRecordInventoryModal(false)}
          tabs={tabs}
          transporterMaintab={transpotoTabValue}
          type={"TRANS"}
        />
      ) : (
        ""
      )}
      {recordPayModalStatus ? (
        <TransportoRecord
          showRecordPayModal={recordPayModal}
          closeRecordPayModal={() => setRecordPayModal(false)}
          tabs={tabs}
          type={"TRANS"}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Transporters;
