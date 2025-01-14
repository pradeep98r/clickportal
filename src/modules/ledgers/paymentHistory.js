import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import clo from "../../assets/images/close.svg";
import { useDispatch, useSelector } from "react-redux";
import "../ledgers/paymentHistory.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getMaskedMobileNumber,
  isEditBill,
} from "../../components/getCurrencyNumber";
import PaymentHistoryCard from "../../components/paymentHistoryCard";
import cancel from "../../assets/images/cancel.svg";
import edit from "../../assets/images/edit_round.svg";
import RecordPayment from "./recordPayment";
import moment from "moment";
import single_bill from "../../assets/images/bills/single_bill.svg";
import {
  updateRecordPayment,
  getBillHistoryListById,
  getLedgers,
  getLedgerSummary,
  getOutstandingBal,
  getSellerDetailedLedger,
  getBuyerDetailedLedger,
  getDetailedLedgerByDate,
  getSellerDetailedLedgerByDate,
  getLedgerSummaryByDate,
  deleteAdvancePayment,
} from "../../actions/ledgersService";
import {
  allLedgers,
  businessValues,
  detaildLedgerInfo,
  fromRecordPayment,
  ledgerSummaryInfo,
  outStandingBal,
  totalRecivables,
  trhoughRecordPayment,
} from "../../reducers/ledgerSummarySlice";
import Ledgers from "./ledgers";
import TransportoRecord from "../transporto_ledger/transportoRecord";
import {
  fromTransporter,
  outstandingAmount,
  outstandingAmountInv,
  paymentSummaryInfo,
  paymentTotals,
  transpoLedgersInfo,
} from "../../reducers/transpoSlice";
import {
  getInventorySummary,
  getParticularTransporter,
  getTransporters,
  getTransportersAll,
} from "../../actions/transporterService";
import { paymentViewInfo } from "../../reducers/paymentViewSlice";
import {
  customDetailedAvances,
  getAdvances,
  getAdvancesSummaryById,
} from "../../actions/advancesService";
import {
  advanceDataInfo,
  advanceSummaryById,
  allAdvancesData,
  totalAdvancesVal,
  totalAdvancesValById,
  totalCollectedById,
  totalGivenById,
} from "../../reducers/advanceSlice";
const PaymentHistoryView = (props) => {
  var paymentViewData = useSelector((state) => state.paymentViewInfo);
  const advancesData = useSelector((state) => state.advanceInfo);
  const fromAdvanceFeatureVal = advancesData?.fromAdvanceFeature;
  const transpoData = useSelector((state) => state.transpoInfo);
  const fromTranspo = transpoData?.fromTransporter;
  const transporterTabs = transpoData?.transpoTabs;
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
  const tabClick = useSelector((state) => state.ledgerSummaryInfo);
  const allCustomTab = tabClick?.allCustomTabs;
  const ledgerTabs = tabClick?.partnerTabs;
  const fromDate = moment(tabClick?.beginDate).format("YYYY-MM-DD");
  const toDate = moment(tabClick?.closeDate).format("YYYY-MM-DD");
  const partyTypeVal = props.partyType;
  const dispatch = useDispatch();
  const paymentHistoryData = paymentViewData?.paymentViewInfo;
  var billViewData = useSelector((state) => state.billViewInfo);
  const disableDaysStatus = billViewData?.disableFromLastDays;
  const numberOfDaysValue = billViewData?.numberOfDays;
  var discountedAmount = 0;
  var discountPercentage = 0;
  var amount = paymentViewData?.paymentViewInfo?.amount
    ? paymentViewData?.paymentViewInfo?.amount
    : paymentViewData?.paymentViewInfo?.paidRcvd;
  var discount = paymentViewData?.paymentViewInfo?.discount;
  discount = Math.abs(discount);
  if (discount > 0) {
    // var amt=amount+discount
    // amount = amount + discount;
    discountedAmount = amount - discount;
    discountPercentage = ((discount / amount) * 100).toPrecision(2);
  }
  // var fromAdvances = false;
  const [fromAdvances, setfromAdvances] = useState(
    fromAdvanceFeatureVal
      ? true
      : advancesData?.fromAdvanceBillId
      ? true
      : false
  );
  // console.log(fromAdvances, fromAdvanceFeatureVal, "fromAdvanceFeatureVal");
  // const [outStAdv, setOutStAdv] = useState(0);
  // const [outStBal, setOutStBal] = useState(0);
  useEffect(() => {
    if (paymentViewData?.paymentViewInfo?.refId?.includes("A")) {
      setfromAdvances(true);
    } else {
      setfromAdvances(false);
    }

    dispatch(paymentViewInfo(paymentViewData.paymentViewInfo));
    // const getOutstandingPaybles = (clickId, transId) => {
    // getOutstandingBal(clickId, partyDetails?.partyId).then((response) => {
    //   if (response.data.data != null) {
    //     setOutStBal(response.data.data.tobePaidRcvd);
    //     setOutStAdv(response.data.data.advance);
    //   }
    // });
    // };
  }, [props.showPaymentViewModal, fromAdvanceFeatureVal]);

  const [recordPaymentActive, setRecordPaymentActive] = useState(false);
  const [recordPaymentModal, setRecordPaymentModal] = useState(false);
  const [recordPayModalStatus, setRecordPayModalStatus] = useState(false);
  const [recordPayModal, setRecordPayModal] = useState(false);
  const [editRecordPaymentStat, setRecordPaymentStat] = useState(false);
  const editRecordPayment = () => {
    dispatch(trhoughRecordPayment(false));
    if (fromTranspo) {
      setRecordPaymentStat(true);
      setRecordPaymentActive(true);
      setRecordPaymentModal(true);
    } else {
      setRecordPayModalStatus(true);
      setRecordPayModal(true);
      setRecordPaymentActive(true);
      setRecordPaymentModal(true);
    }
  };
  var partyDetails = paymentViewData.paymentViewInfo;
  const deleteRecordPayment = {
    action: "DELETE",
    caId: clickId,
    partyId: partyDetails?.partyId,
    date: moment(partyDetails?.date).format("YYYY-MM-DD"),
    comments: partyDetails?.comments,
    paidRcvd: partyDetails?.amount,
    paymentMode: partyDetails?.paymentMode,
    billIds: partyDetails?.billIds,
    type: partyDetails?.type,
    discount: partyDetails?.balance,
    refId: partyDetails?.refId,
    toBePaidRcvd: 0,
    writerId: writerId,
  };
  const onTapDeletePayment = (date) => {
    var value = isEditBill(date, numberOfDaysValue);
    if (!value) {
      toast.error(
        `Payment Records that are more than ${numberOfDaysValue} days old can’t be deleted/edited.`,
        {
          toastId: "error6",
        }
      );
    } else {
      removeRecordPayment();
    }
  };
  const removeRecordPayment = () => {
    updateRecordPayment(deleteRecordPayment).then((res) => {
      toast.success(res.data.status.message, {
        toastId: "errorr2",
      });
      window.setTimeout(function () {
        props.closePaymentViewModal();
      }, 1000);
      if (fromTranspo) {
        updateTransportersData();
      } else {
        commonUpdateLedgers();
      }
    });
  };
  const advanceDeleteObject = {
    action: "DELETE",
    caId: clickId,
    paidRcvd: partyDetails?.amount,
    partyId: partyDetails?.partyId,
    refId: partyDetails?.refId,
    writerId: writerId,
  };
  const label = advancesData.selectPartnerOption;
  const onTapDeleteAdvance = (date) => {
    var value = isEditBill(date, numberOfDaysValue);
    if (!value) {
      toast.error(
        `Advance Records that are more than ${numberOfDaysValue} days old can’t be deleted/edited.`,
        {
          toastId: "error6",
        }
      );
    } else {
      advanceDelete();
    }
  };
  const advanceDelete = () => {
    deleteAdvancePayment(advanceDeleteObject).then((res) => {
      toast.success(res.data.status.message, {
        toastId: "errorr3",
      });
      window.setTimeout(function () {
        props.closePaymentViewModal();
      }, 1000);
      if (fromTranspo) {
        updateTransportersData();
      } else if (fromAdvanceFeatureVal) {
        updateAdvances();
      } else {
        commonUpdateLedgers();
      }
    });
  };
  const updateTransportersData = () => {
    if (transpoData?.transporterMainTab == "inventoryLedgerSummary") {
      getInventoryData();
      paymentLedger(clickId, paymentHistoryData?.partyId);
    } else {
      getTransportersData();
      paymentLedger(clickId, paymentHistoryData?.partyId);
    }
  };

  const getInventoryData = () => {
    getInventorySummary(clickId).then((response) => {
      dispatch(outstandingAmountInv(response.data.data.totalInventory));
      dispatch(transpoLedgersInfo(response.data.data.summaryInfo));
    });
  };
  const commonUpdateLedgers = () => {
    var partyId = paymentHistoryData?.partyId;
    var partyType = partyTypeVal == "FARMER" ? "SELLER" : partyTypeVal;

    dispatch(fromRecordPayment(true));
    fetchLedgers();
    summaryData(clickId, partyId);
    if (allCustomTab == "all" && ledgerTabs == "detailedledger") {
      if (partyType == "SELLER") {
        sellerDetailed(clickId, partyId);
      } else {
        geyDetailedLedger(clickId, partyId);
      }
    }
    if (allCustomTab == "custom" && ledgerTabs == "ledgersummary") {
      ledgerSummaryByDate(clickId, partyId, fromDate, toDate);
    } else if (allCustomTab == "custom" && ledgerTabs == "detailedledger") {
      if (partyType == "SELLER") {
        sellerDetailedByDate(clickId, partyId, fromDate, toDate);
      } else {
        detailedLedgerByDate(clickId, partyId, fromDate, toDate);
      }
    }
  };
  const getTransportersData = () => {
    getTransportersAll(clickId).then((response) => {
      dispatch(outstandingAmount(response.data.data));
      dispatch(transpoLedgersInfo(response.data.data.ledgers));
    });
  };
  const paymentLedger = (clickId, partyId) => {
    getParticularTransporter(clickId, partyId)
      .then((response) => {
        dispatch(paymentSummaryInfo(response.data.data.details));
        dispatch(paymentTotals(response.data.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getALlLedgers = (data) => {
    dispatch(allLedgers(data));
  };
  const fetchLedgers = () => {
    var partyType = partyTypeVal == "FARMER" ? "SELLER" : partyTypeVal;
    getLedgers(clickId, partyType, "", "").then((res) => {
      if (res.data.status.type === "SUCCESS") {
        dispatch(allLedgers(res.data.data.ledgers));
        dispatch(outStandingBal(res.data.data));
      } else {
      }
    });
  };
  const summaryData = (clickId, partyId) => {
    getLedgerSummary(clickId, partyId)
      .then((res) => {
        if (res.data.status.type === "SUCCESS") {
          console.log("summary", res.data.data);
          if (res.data.data != null) {
            dispatch(businessValues(res.data.data));
            dispatch(ledgerSummaryInfo(res.data.data.ledgerSummary));
          } else {
            dispatch(businessValues([]));
            dispatch(ledgerSummaryInfo([]));
          }
        }
      })
      .catch((error) => console.log(error));
  };
  const geyDetailedLedger = (clickId, partyId) => {
    getBuyerDetailedLedger(clickId, partyId)
      .then((res) => {
        if (res.data.status.type === "SUCCESS") {
          dispatch(totalRecivables(res.data.data));
          dispatch(detaildLedgerInfo(res.data.data.details));
        }
      })
      .catch((error) => console.log(error));
  };
  //Get Seller Detailed Ledger
  const sellerDetailed = (clickId, partyId) => {
    getSellerDetailedLedger(clickId, partyId)
      .then((res) => {
        if (res.data.status.type === "SUCCESS") {
          dispatch(totalRecivables(res.data.data));
          dispatch(detaildLedgerInfo(res.data.data.details));
        }
      })
      .catch((error) => console.log(error));
  };
  const ledgerSummaryByDate = (clickId, partyId, fromDate, toDate) => {
    getLedgerSummaryByDate(clickId, partyId, fromDate, toDate)
      .then((res) => {
        if (res.data.data !== null) {
          dispatch(businessValues(res.data.data));
          dispatch(ledgerSummaryInfo(res.data.data.ledgerSummary));
        }
      })
      .catch((error) => console.log(error));
  };
  //Buyer Detailed Ledger By Date
  const detailedLedgerByDate = (clickId, partyId, fromDate, toDate) => {
    getDetailedLedgerByDate(clickId, partyId, fromDate, toDate)
      .then((res) => {
        if (res.data.data !== null) {
          dispatch(totalRecivables(res.data.data));
          dispatch(detaildLedgerInfo(res.data.data.details));
        }
      })
      .catch((error) => console.log(error));
  };

  //Seller Detailed ledger By Date
  const sellerDetailedByDate = (clickId, partyId, fromDate, toDate) => {
    getSellerDetailedLedgerByDate(clickId, partyId, fromDate, toDate)
      .then((res) => {
        if (res.data.data !== null) {
          dispatch(totalRecivables(res.data.data));
          dispatch(detaildLedgerInfo(res.data.data.details));
        }
      })
      .catch((error) => console.log(error));
  };
  const updateAdvances = () => {
    getAllAdvances();
    if (allCustomTab == "all") {
      getAdvanceSummary();
    } else {
      getCustomDetailedAdvances(
        advancesData?.selectedAdvanceId,
        fromDate,
        toDate
      );
    }
  };
  const getAllAdvances = () => {
    var partyType = partyTypeVal == "SELLER" ? "FARMER" : partyTypeVal;
    getAdvances(clickId)
      .then((res) => {
        if (res.data.status.type === "SUCCESS") {
          if (res.data.data != null) {
            if (label == "Sellers") {
              const filterArray = res.data.data.advances.filter(
                (item) => item?.partyType?.toUpperCase() == "FARMER"
              );
              dispatch(allAdvancesData(filterArray));
              dispatch(advanceDataInfo(filterArray));
            } else if (label == "Transporters") {
              const filterArray = res.data.data.advances.filter(
                (item) => item?.partyType?.toUpperCase() == "TRANSPORTER"
              );
              dispatch(allAdvancesData(filterArray));
              dispatch(advanceDataInfo(filterArray));
            } else {
              dispatch(allAdvancesData(res.data.data.advances));
              dispatch(advanceDataInfo(res.data.data.advances));
            }
            if (res.data.data.totalAdvances != 0) {
              dispatch(totalAdvancesVal(res.data.data.totalAdvBal));
            }
          } else {
            dispatch(allAdvancesData([]));
          }
        }
      })
      .catch((error) => console.log(error));
  };
  const getAdvanceSummary = () => {
    getAdvancesSummaryById(clickId, advancesData?.selectedAdvanceId)
      .then((res) => {
        if (res.data.status.type === "SUCCESS") {
          if (res.data.data != null) {
            dispatch(advanceSummaryById(res.data.data.advances));
            dispatch(totalAdvancesValById(res.data.data.totalAdvBal));
            dispatch(totalCollectedById(res.data.data.totalCollectedAdv));
            dispatch(totalGivenById(res.data.data.totalGivenAdv));
          } else {
            dispatch(advanceSummaryById([]));
          }
        }
      })
      .catch((error) => console.log(error));
  };
  const getCustomDetailedAdvances = (id, fromDate, toDate) => {
    customDetailedAvances(clickId, id, fromDate, toDate)
      .then((res) => {
        if (res.data.status.type == "SUCCESS") {
          if (res.data.data != null) {
            dispatch(advanceSummaryById(res.data.data.advances));
            dispatch(totalAdvancesValById(res.data.data.totalAdvBal));
            dispatch(totalCollectedById(res.data.data.totalCollectedAdv));
            dispatch(totalGivenById(res.data.data.totalGivenAdv));
          } else {
            dispatch(advanceSummaryById([]));
          }
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <Modal
      show={props.showPaymentViewModal}
      close={props.closePaymentViewModal}
      className="cropmodal_poopup steps_modal billView_modal right"
    >
      <div className="modal-header date_modal_header smartboard_modal_header">
        <h5
          className="modal-title d-flex align-items-center header2_text"
          id="staticBackdropLabel"
        >
          {fromAdvances ? "Advance" : "Payment Ledger"} |{" "}
          {paymentHistoryData.refId}
        </h5>
        <button
          onClick={(e) => {
            props.closePaymentViewModal();
          }}
        >
          <img alt="image" src={clo} className="cloose" />
        </button>
      </div>
      <div className="modal-body py-0">
        <div className="row payment_view_row">
          <div className="col-lg-10 col_left bill_col bill_col_border">
            <div className="payment_view_card">
              <div className="partyDetails">
                <div className="row justify-content-between align-items-center">
                  <div className="col-lg-4 p-0">
                    <div className="d-flex align-items-center">
                      {paymentHistoryData?.profilePic ? (
                        <img
                          src={paymentHistoryData?.profilePic}
                          className="payment_profilepic"
                        />
                      ) : (
                        <img src={single_bill} className="payment_profilepic" />
                      )}
                      <div>
                        <h6>{paymentHistoryData?.partyName}</h6>
                        {paymentHistoryData?.billId > 0 ? (
                          <p className="color_blue">
                            Bill Id : {paymentHistoryData?.billId}
                          </p>
                        ) : (
                          ""
                        )}

                        <p>
                          {getMaskedMobileNumber(paymentHistoryData?.mobile)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 p-0"></div>
                  <div className="col-lg-3 p-0">
                    <h6>Date</h6>
                    <h5>
                      {moment(paymentHistoryData?.date).format("DD-MMM-YY")}
                    </h5>
                  </div>
                </div>
              </div>
              {!fromAdvances
                ? paymentHistoryData.billIds.length > 0 && (
                    <div className="partyDetails">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6>Selected Bills</h6>
                          <div className="d-flex">
                            <h5>
                              {"Bill IDs: " +
                                paymentHistoryData.billIds.join(" , ")}
                            </h5>
                            {/* {.map((item, index) => {
                        return <h5>{item?.join(" , ")}</h5>
                      })} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                : ""}

              <PaymentHistoryCard
                title1="Amount"
                title2="Payment Mode"
                title3={!fromAdvances ? "Status" : "Advance"}
                title1Data={
                  !fromAdvances
                    ? amount
                    : paymentHistoryData?.collected
                    ? paymentHistoryData?.collected
                    : paymentHistoryData?.given
                }
                title2Data={paymentHistoryData?.paymentMode}
                title3Data={
                  !fromAdvances
                    ? ""
                    : paymentHistoryData?.collected
                    ? "COLLECTED"
                    : "GIVEN"
                }
              />
              {discount > 0 ? (
                <PaymentHistoryCard
                  title1="Discount(%)"
                  title2="Discount(Rs)"
                  title3="Received Amount"
                  title1Data={discountPercentage}
                  title2Data={discount}
                  title3Data={discountedAmount?.toFixed(2)}
                />
              ) : (
                ""
              )}
              <div className="partyDetails comment_details">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6>Comment</h6>
                    <h5>
                      {paymentHistoryData?.comments
                        ? paymentHistoryData?.comments
                        : "-"}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-2 p-0 ">
            <div className="bill_col pr-0">
              {paymentHistoryData.comments == "FROM BILL" ? (
                ""
              ) : (
                <div>
                  <p className="more-p-tag">
                    {fromAdvances && paymentHistoryData?.paymentMode == "BILL"
                      ? ""
                      : "Actions"}
                  </p>
                  {fromAdvances ? (
                    paymentHistoryData?.paymentMode != "BILL" ? (
                      <div className="action_icons">
                        <div className="items_div">
                          <button
                            onClick={() =>
                              onTapDeleteAdvance(paymentHistoryData?.date)
                            }
                          >
                            <img src={cancel} alt="img" className="" />
                          </button>
                          <p>Cancel</p>
                        </div>
                      </div>
                    ) : (
                      ""
                    )
                  ) : (
                    // <div className="action_icons">
                    //   <div className="items_div">
                    //     <button onClick={() => advanceDelete()}>
                    //       <img src={cancel} alt="img" className="" />
                    //     </button>
                    //     <p>Delete</p>
                    //   </div>
                    // </div>
                    <div>
                      <div className="action_icons">
                        {paymentHistoryData.billPaid ? (
                          ""
                        ) : (
                          <div className="items_div">
                            <button
                              onClick={() => {
                                editRecordPayment();
                              }}
                            >
                              <img src={edit} alt="img" className="" />
                            </button>
                            <p>Edit</p>
                          </div>
                        )}
                        <div className="items_div">
                          <button
                            onClick={() => {
                              onTapDeletePayment(paymentHistoryData?.date);
                            }}
                          >
                            <img src={cancel} alt="img" className="" />
                          </button>
                          <p>Delete</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {recordPaymentActive && !fromTranspo ? (
          <RecordPayment
            LedgerData={paymentViewData?.paymentViewInfo}
            ledgerId={paymentViewData?.paymentViewInfo?.partyId}
            showRecordPaymentModal={recordPaymentModal}
            closeRecordPaymentModal={() => setRecordPaymentModal(false)}
            fromPaymentHistory={recordPaymentActive}
            ledgers={getALlLedgers}
          />
        ) : fromTranspo && recordPaymentActive ? (
          <TransportoRecord
            showRecordPayModal={recordPaymentModal}
            closeRecordPayModal={() => setRecordPaymentModal(false)}
            editRecordStatus={editRecordPaymentStat}
          />
        ) : (
          ""
        )}
      </div>
      <ToastContainer />
    </Modal>
  );
};
export default PaymentHistoryView;
