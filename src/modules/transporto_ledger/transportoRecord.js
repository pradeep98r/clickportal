import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import single_bill from "../../assets/images/bills/single_bill.svg";
import { useState } from "react";
import close from "../../assets/images/close.svg";
import date_icon from "../../assets/images/date_icon.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMaskedMobileNumber } from "../../components/getCurrencyNumber";
import loading from "../../assets/images/loading.gif";
import {
  getOutstandingBal,
  postRecordPayment,
  updateRecordPayment,
} from "../../actions/ledgersService";
import moment from "moment";
import {
  getInventorySummary,
  getParticularTransporter,
  getTransporters,
} from "../../actions/transporterService";
import {
  outstandingAmount,
  outstandingAmountInv,
  paymentSummaryInfo,
  paymentTotals,
  transpoLedgersInfo,
} from "../../reducers/transpoSlice";
import { paymentViewInfo } from "../../reducers/paymentViewSlice";
import {
  addAdvanceRecord,
  customDetailedAvances,
  getAdvances,
  getAdvancesSummaryById,
} from "../../actions/advancesService";
import {
  advanceDataInfo,
  advanceSummaryById,
  allAdvancesData,
  fromParentSelect,
  partyOutstandingBal,
  totalAdvancesVal,
  totalAdvancesValById,
  totalCollectedById,
  totalGivenById,
} from "../../reducers/advanceSlice";
import SelectedPartner from "../advances/selectedPartner";
const TransportoRecord = (props) => {
  const dispatch = useDispatch();
  const transpoData = useSelector((state) => state.transpoInfo);
  var paymentViewData = useSelector((state) => state.paymentViewInfo);
  const tabClick = useSelector((state) => state.ledgerSummaryInfo);
  const fromDate = moment(tabClick?.beginDate).format("YYYY-MM-DD");
  const toDate = moment(tabClick?.closeDate).format("YYYY-MM-DD");
  const allCustomTab = tabClick?.allCustomTabs;
  const editRecordStatus = props.editRecordStatus;
  const viewInfo = paymentViewData?.paymentViewInfo;
  const advancesData = useSelector((state) => state.advanceInfo);
  const fromAdvances = advancesData?.fromAdvanceFeature;
  const fromAdvSummary = advancesData?.fromAdvanceSummary;
  const selectedPartnerFromAdv = advancesData?.selectedPartyByAdvanceId;
  const ledgerData = fromAdvances
    ? selectedPartnerFromAdv
    : editRecordStatus
    ? viewInfo
    : transpoData?.singleTransporterObject;
  const transId = fromAdvances
    ? fromAdvSummary
      ? selectedPartnerFromAdv?.partyId
      : selectedPartnerFromAdv?.partyId
    : transpoData?.transporterIdVal;
  const [selectDate, setSelectDate] = useState(
    editRecordStatus ? new Date(viewInfo?.date) : new Date()
  );
  const outStandingBal = advancesData?.partyOutstandingBal;
  // const [outStandingBal, setOutStandingBal] = useState("");
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  var paymentViewData = useSelector((state) => state.paymentViewInfo);
  var fromInventoryTab = transpoData?.fromInv;
  const [isLoading, setLoading] = useState(false);
  var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
  const [outBalAdvance, setOutBalAdvance] = useState(0);
  useEffect(() => {
    if (!fromAdvSummary) {
      getOutstandingPaybles(clickId, transId);
    }
    setReturnAdvanceStatus(false);
    setLoading(false);
  }, [props.showRecordPayModal]);
  const getOutstandingPaybles = (clickId, transId) => {
    getOutstandingBal(clickId, transId).then((response) => {
      if (response.data.data != null) {
        console.log(response.data.data);
        dispatch(partyOutstandingBal(response.data.data.tobePaidRcvd));
        setOutBalAdvance(response.data.data.advance);
      }
    });
  };
  const [requiredCondition, setRequiredCondition] = useState("");
  let [paidsRcvd, setPaidsRcvd] = useState(
    editRecordStatus ? viewInfo?.amount : 0
  );
  const [comments, setComments] = useState(
    editRecordStatus ? viewInfo?.comments : ""
  );
  const getAmountVal = (e) => {
    setPaidsRcvd(
      e.target.value
        .replace(/[^\d.]/g, "")
        .replace(/^(\d*)(\.\d{0,2})\d*$/, "$1$2")
        .replace(/(\.\d{0,2})\d*/, "$1")
        .replace(/(\.\d*)\./, "$1")
    );
    if (e.target.value.length > 0) {
      setRequiredCondition("");
    }
  };
  const resetInput = (e) => {
    if (e.target.value == 0) {
      e.target.value = "";
    }
  };
  const onSubmitRecordPayment = () => {
    console.log(fromAdvances, returnAdvanceStatus, outBalAdvance, paidsRcvd,!fromAdvSummary,!advancesData?.fromParentSelect,'all values');
    if (paidsRcvd < 0) {
      setRequiredCondition("Amount Recieved Cannot be negative");
    } else if (parseInt(paidsRcvd) === 0) {
      setRequiredCondition("Amount Received cannot be empty");
    } else if (isNaN(paidsRcvd)) {
      setRequiredCondition("Invalid Amount");
    } else if (fromAdvances) {
      if (!fromAdvSummary || !advancesData?.fromParentSelect) {
        if (parseInt(paidsRcvd) > outBalAdvance && returnAdvanceStatus) {
          setRequiredCondition(
            "Entered Amount cannot be more than Outstanding Advance"
          );
        } else {
          addRecordPayment();
        }
      } else {
        toast.error("Please Select Partner", {
          toastId: "error16",
        });
      }
    } else if (
      paidsRcvd.toString().trim().length !== 0 &&
      paidsRcvd != 0 &&
      paidsRcvd <= outStandingBal &&
      !(paidsRcvd < 0)
    ) {
      
      if (fromAdvances) {
        if (returnAdvanceStatus) {
          if (parseInt(paidsRcvd) > outBalAdvance) {
            setRequiredCondition(
              "Entered Amount cannot be more than Outstanding Advance"
            );
          } else {
            addRecordPayment();
          }
        } else {
          addRecordPayment();
        }
      } else {
        addRecordPayment();
      }
    } else if (parseInt(paidsRcvd) > outStandingBal) {
      setRequiredCondition(
        "Entered Amount cannot more than Outstanding Balance"
      );
    }
  };
  const [paymentMode, setPaymentMode] = useState(
    editRecordStatus ? viewInfo?.paymentMode : "CASH"
  );
  const addRecordPayment = async () => {
    setLoading(true);
    const addRecordData = {
      caId: clickId,
      partyId: transId,
      date: moment(selectDate).format("YYYY-MM-DD"),
      comments: comments,
      paidRcvd: paidsRcvd,
      paymentMode: paymentMode,
      billIds: [],
      type: "TRANSPORTER",
      discount: "",
      writerId: writerId,
    };
    const updateRecordRequest = {
      action: "UPDATE",
      caId: clickId,
      partyId: transId,
      date: moment(selectDate).format("YYYY-MM-DD"),
      comments: comments,
      paidRcvd: paidsRcvd,
      paymentMode: paymentMode,
      billIds: [],
      type: "TRANSPORTER",
      discount: "",
      refId: ledgerData?.refId,
      toBePaidRcvd: 0,
      mobile: ledgerData?.mobile,
      partyName: fromInventoryTab
        ? ledgerData?.transporterName
        : ledgerData?.partyName,
      amount: paidsRcvd,
      writerId: writerId,
    };

    const addAdvanceReq = {
      caId: clickId,
      amount: paidsRcvd,
      paymentMode: paymentMode,
      partyId: transId,
      advDate: moment(selectDate).format("YYYY-MM-DD"),
      comments: comments,
      writerId: writerId,
      advType: returnAdvanceStatus ? "C" : "G",
    };
    if (fromAdvances) {
      await addAdvanceRecord(addAdvanceReq).then(
        (res) => {
          toast.success(res.data.status.message, {
            toastId: "errorr12",
          });
          updateAdvances();
          window.setTimeout(function () {
            props.closeRecordPayModal();
            closePopup();
          }, 800);
        },
        (error) => {
          toast.error(error.response.data.status.message, {
            toastId: "error15",
          });
        }
      );
    } else if (transpoData?.fromTransporter) {
      await updateRecordPayment(updateRecordRequest).then(
        (res) => {
          toast.success(res.data.status.message, {
            toastId: "errorr1",
          });
          dispatch(paymentViewInfo(updateRecordRequest));
          // dispatch(fromRecordPayment(true));
          window.setTimeout(function () {
            props.closeRecordPayModal();
          }, 800);
        },
        (error) => {
          toast.error(error.response.data.status.message, {
            toastId: "error15",
          });
        }
      );
    } else {
      await postRecordPayment(addRecordData).then(
        (response) => {
          toast.success(response.data.status.message, {
            toastId: "errorr10",
          });
          window.setTimeout(function () {
            props.closeRecordPayModal();
            closePopup();
          }, 800);
          // dispatch(fromRecordPayment(true));
        },
        (error) => {
          toast.error(error.response.data.status.message, {
            toastId: "error4",
          });
        }
      );
    }
    if (transpoData?.transporterMainTab == "inventoryLedgerSummary") {
      getInventoryData();
      getOutstandingPaybles(clickId, transId);
      paymentLedger(clickId, transId);
    } else if (
      props.tabs == "paymentledger" ||
      transpoData?.transpoTabs == "paymentledger"
    ) {
      getTransportersData();
      getOutstandingPaybles(clickId, transId);
      paymentLedger(clickId, transId);
    }
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
  const label = advancesData.selectPartnerOption;
  const getAllAdvances = () => {
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
            if (res.data.data.advances.length > 0) {
              dispatch(partyOutstandingBal(res.data.data.outStandingPaybles));
            } else {
              dispatch(partyOutstandingBal(0));
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
  const getInventoryData = () => {
    getInventorySummary(clickId).then((response) => {
      dispatch(outstandingAmountInv(response.data.data.totalInventory));
      dispatch(transpoLedgersInfo(response.data.data.summaryInfo));
    });
  };
  const getTransportersData = () => {
    getTransporters(clickId).then((response) => {
      dispatch(outstandingAmount(response.data.data));
      dispatch(transpoLedgersInfo(response.data.data.ledgers));
    });
  };
  //get Payment Ledger
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
  const paymentMethods = [
    {
      id: 1,
      name: "CASH",
    },
    {
      id: 2,
      name: "UPI",
    },
    {
      id: 3,
      name: "NEFT",
    },
    {
      id: 4,
      name: "RTGS",
    },
    {
      id: 5,
      name: "IMPS",
    },
  ];
  const closePopup = () => {
    if (editRecordStatus) {
      setPaidsRcvd(viewInfo?.amount);
      setRequiredCondition("");
      setPaymentMode(viewInfo?.paymentMode);
      setComments(viewInfo?.comments);
      setSelectDate(new Date(viewInfo?.date));
    } else {
      setPaidsRcvd(0);
      setRequiredCondition("");
      setPaymentMode("CASH");
      setComments("");
      setSelectDate(new Date());
    }
    if (advancesData?.fromParentSelect) {
      getOutstandingPaybles(clickId, transId);
    } else {
      getAllAdvances();
    }
  };
  const [returnAdvanceStatus, setReturnAdvanceStatus] = useState(false);
  const toggleStatus = (status) => {
    setReturnAdvanceStatus(!status);
    if (!status) {
      getOutstandingPaybles(clickId, transId);
    }
  };
  return (
    <Modal
      show={props.showRecordPayModal}
      close={props.closeRecordPayModal}
      className="record_payment_modal"
    >
      {isLoading ? (
        <div className="loading_styles">
          <img src={loading} alt="my-gif" className="gif_img" />
        </div>
      ) : (
        ""
      )}
      <div className="modal-body partner_model_body" id="scroll_style">
        <div>
          <form>
            <div className="d-flex align-items-center justify-content-between modal_common_header partner_model_body_row">
              <h5 className="modal-title header2_text" id="staticBackdropLabel">
                {fromAdvances
                  ? "Record Advance"
                  : editRecordStatus
                  ? "Update Record Payment"
                  : "Record Payment"}
              </h5>

              <a
                onClick={(e) => {
                  closePopup();
                  props.closeRecordPayModal();
                  e.preventDefault();
                }}
                href=""
              >
                <img src={close} alt="image" className="close_icon" />
              </a>
            </div>
            <div className="d-flex justify-content-between card record_modal_row">
              <div
                className="d-flex justify-content-between align-items-center card-body mb-0"
                id="details-tag"
              >
                <div className="profile-details" key={transId}>
                  {fromAdvSummary ? (
                    <SelectedPartner />
                  ) : (
                    <div className="d-flex">
                      <div>
                        {ledgerData?.profilePic ? (
                          <img
                            id="singles-img"
                            src={ledgerData.profilePic}
                            alt="buy-img"
                          />
                        ) : (
                          <img id="singles-img" src={single_bill} alt="img" />
                        )}
                      </div>
                      <div id="trans-dtl">
                        <p className="namedtl-tag">
                          {fromInventoryTab
                            ? ledgerData?.transporterName
                            : ledgerData?.partyName}
                        </p>
                        <p className="mobilee-tag">
                          {transId}&nbsp;|&nbsp;
                          {getMaskedMobileNumber(ledgerData?.mobile)}
                        </p>
                        <p className="addres-tag">
                          {ledgerData?.partyAddress
                            ? ledgerData?.partyAddress
                            : ""}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className="d-flex card-text date_field record_payment_datepicker"
                  id="date-tag"
                >
                  <img className="date_icon_in_modal" src={date_icon} />
                  <div className="d-flex date_popper">
                    <DatePicker
                      selected={selectDate}
                      onChange={(date) => {
                        setSelectDate(date);
                      }}
                      dateFormat="dd-MMM-yy"
                      maxDate={new Date()}
                      placeholder="Date"
                      required
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    ></DatePicker>
                  </div>
                </div>
              </div>
            </div>
            {!fromAdvances ? (
              <div className="row align-items-center record_modal_row">
                <div className="" align="left">
                  {!editRecordStatus ? (
                    <div className="out-paybles p-0">
                      <p id="p-tag">Outstanding Paybles</p>
                      <p id="recieve-tag">
                        &#8377;
                        {outStandingBal ? outStandingBal.toFixed(2) : 0}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : returnAdvanceStatus ? (
              <div className="row align-items-center record_modal_row">
                <div className="" align="left">
                  {!editRecordStatus ? (
                    <div className="out-paybles p-0">
                      <p id="p-tag">Outstanding Advances</p>
                      <p id="recieve-tag">
                        &#8377;
                        {outBalAdvance ? outBalAdvance.toFixed(2) : 0}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : (
              ""
            )}

            <div
              className="form-group record_modal_row mb-0"
              id="input_in_modal"
            >
              <label hmtlFor="amtRecieved" id="amt-tag">
                Amount
              </label>
              <input
                className="form-cont"
                id="amtRecieved"
                onFocus={(e) => resetInput(e)}
                value={paidsRcvd}
                required
                onChange={(e) => {
                  getAmountVal(e);
                }}
              />

              <p className="text-valid">{requiredCondition}</p>
            </div>
            <div id="radios_in_modal" className="record_modal_row">
              <p className="payment-tag">Payment Mode</p>
              {paymentMethods.map((link) => {
                return (
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input radioBtnVal mb-0"
                      type="radio"
                      name="radio"
                      id="inlineRadio1"
                      value={link.name}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      checked={paymentMode === link.name}
                      required
                    />
                    <label className="form-check-label" for="inlineRadio1">
                      {link.name}
                    </label>
                  </div>
                );
              })}
            </div>
            <div id="comment_in_modal" className="record_modal_row">
              <div className="mb-3">
                <label
                  for="exampleFormControlTextarea1"
                  className="form-label"
                  id="comment-tag"
                >
                  Comment
                </label>
                <textarea
                  className="form-control"
                  id="comments"
                  rows="2"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                ></textarea>
              </div>
            </div>
            {fromAdvances ? (
              <div className="d-flex justify-content-between">
                <p id="p-tag">Return Advance</p>
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id={"customSwitches"}
                    checked={returnAdvanceStatus}
                    onChange={() => toggleStatus(returnAdvanceStatus)}
                  />
                  <label
                    className={`custom-control-label ${
                      returnAdvanceStatus ? "bg-success" : "bg-secondary"
                    }`}
                    htmlFor={"customSwitches"}
                  ></label>
                </div>
              </div>
            ) : (
              ""
            )}
          </form>
        </div>
      </div>
      <div className="modal-footer modal_common_footer">
        <div className="row">
          <div className="col-lg-6 pl-0"></div>
          <div className="col-lg-6">
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="secondary_btn mr-2"
                // id="close_modal"
                onClick={(e) => {
                  props.closeRecordPayModal();
                  closePopup();
                  e.preventDefault();
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary_btn w-100"
                onClick={() => {
                  onSubmitRecordPayment();
                }}
                // id="close_modal"
                data-bs-dismiss="modal"
              >
                {editRecordStatus ? "UPDATE" : "SUBMIT"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </Modal>
  );
};
export default TransportoRecord;
