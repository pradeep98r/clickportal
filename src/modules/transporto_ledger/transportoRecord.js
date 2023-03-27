import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import single_bill from "../../assets/images/bills/single_bill.svg";
import $ from "jquery";
import { useState } from "react";
import close from "../../assets/images/close.svg";
import date_icon from "../../assets/images/date_icon.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMaskedMobileNumber } from "../../components/getCurrencyNumber";
import { getOutstandingBal } from "../../actions/ledgersService";
import { postRecordPayment } from "../../actions/billCreationService";
import moment from "moment";
import {
  getParticularTransporter,
  getTransporters,
} from "../../actions/transporterService";
import {
  outstandingAmount,
  paymentSummaryInfo,
  paymentTotals,
  transpoLedgersInfo,
} from "../../reducers/transpoSlice";
const AddRecordPayment = (props) => {
  const dispatch = useDispatch();
  const transpoData = useSelector((state) => state.transpoInfo);
  const ledgerData = transpoData?.singleTransporterObject;
  const transId = transpoData?.transporterIdVal;
  const [selectDate, setSelectDate] = useState(new Date());
  const [outStandingBal, setOutStandingBal] = useState("");
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  useEffect(() => {
    getOutstandingPaybles(clickId, transId);
  }, [props.showRecordPayModal]);
  const getOutstandingPaybles = (clickId, transId) => {
    getOutstandingBal(clickId, transId).then((response) => {
      console.log(response);
      if (response.data.data != null) {
        setOutStandingBal(response.data.data);
      }
    });
  };
  const [requiredCondition, setRequiredCondition] = useState("");
  let [paidsRcvd, setPaidsRcvd] = useState(0);
  const [comments, setComments] = useState(" ");
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
    if (paidsRcvd < 0) {
      setRequiredCondition("Amount Recieved Cannot be negative");
    } else if (parseInt(paidsRcvd) === 0) {
      setRequiredCondition("Amount Received cannot be empty");
    } else if (isNaN(paidsRcvd)) {
      setRequiredCondition("Invalid Amount");
    } else if (
      paidsRcvd.toString().trim().length !== 0 &&
      paidsRcvd != 0 &&
      paidsRcvd <= outStandingBal &&
      !(paidsRcvd < 0)
    ) {
      addRecordPayment();
    } else if (parseInt(paidsRcvd) > outStandingBal) {
      setRequiredCondition(
        "Entered Amount  cannot more than Outstanding Balance"
      );
    }
  };
  const [paymentMode, setPaymentMode] = useState("CASH");
  const addRecordPayment = async () => {
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
    };
    const updateRecordRequest = {
      action: "UPDATE",
      caId: clickId,
      partyId: transId,
      date: moment(selectDate).format("YYYY-MM-DD"),
      comments: comments,
      paidRcvd: paidsRcvd,
      //   paymentMode: paymentMode,
      billIds: [],
      type: "TRANSPORTER",
      discount: "",
      refId: ledgerData?.refId,
      toBePaidRcvd: 0,
      mobile: ledgerData?.mobile,
    };
    // if () {
    //   await updateRecordPayment(updateRecordRequest).then(
    //     (res) => {
    //       toast.success(res.data.status.message, {
    //         toastId: "errorr2",
    //       });
    //       dispatch(paymentViewInfo(updateRecordRequest));
    //       dispatch(fromRecordPayment(true));
    //       window.setTimeout(function () {
    //         props.closeRecordPaymentModal();
    //       }, 1000);
    //     },
    //     (error) => {
    //       console.log(error.message);
    //       toast.error(error.res.data.status.message, {
    //         toastId: "error3",
    //       });
    //     }
    //   );
    // } else {
    await postRecordPayment(addRecordData).then(
      (response) => {
        // closePopup();
        toast.success(response.data.status.message, {
          toastId: "errorr2",
        });
        window.setTimeout(function () {
          props.closeRecordPayModal();
        }, 1000);
        // dispatch(fromRecordPayment(true));
      },
      (error) => {
        toast.error(error.response.data.status.message, {
          toastId: "error3",
        });
      }
    );
    console.log(props.tabs);
    if (props.tabs == "paymentledger") {
      getTransportersData();
      getOutstandingPaybles(clickId, transId);
      paymentLedger(clickId, transId);
    }
  };
  const getTransportersData = () => {
    getTransporters(clickId).then((response) => {
        console.log(response.data.data)
      dispatch(outstandingAmount(response.data.data));
      dispatch(transpoLedgersInfo(response.data.data.ledgers));
    });
  };
  //get Payment Ledger
  const paymentLedger = (clickId, partyId) => {
    getParticularTransporter(clickId, partyId)
      .then((response) => {
        console.log(response.data.data,'pay')
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
  return (
    <Modal
      show={props.showRecordPayModal}
      close={props.closeRecordPayModal}
      className="record_payment_modal"
    >
      <div className="modal-body partner_model_body" id="scroll_style">
        <div>
          <form>
            <div className="d-flex align-items-center justify-content-between modal_common_header partner_model_body_row">
              <h5 className="modal-title header2_text" id="staticBackdropLabel">
                Add Record Payment
              </h5>

              <img
                src={close}
                alt="image"
                className="close_icon"
                onClick={() => {
                  //   closePopup();
                  props.closeRecordPayModal();
                }}
              />
            </div>
            <div className="d-flex justify-content-between card">
              <div
                className="d-flex justify-content-between card-body"
                id="details-tag"
              >
                <div className="profile-details" key={ledgerData?.partyId}>
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
                      <p className="namedtl-tag">{ledgerData?.partyName}</p>
                      <p className="mobilee-tag">
                        {props.type == "TRANS" ? "Transporter" : "Seller"} -{" "}
                        {ledgerData?.partyId}&nbsp;|&nbsp;
                        {getMaskedMobileNumber(ledgerData?.mobile)}
                      </p>
                      <p className="addres-tag">
                        {ledgerData?.partyAddress
                          ? ledgerData?.partyAddress
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="d-flex card-text" id="date-tag">
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
                    ></DatePicker>
                  </div>
                </div>
              </div>
            </div>
            <div className="row align-items-center record_modal_row">
              <div className="" align="left">
                <div className="out-paybles p-0">
                  <p id="p-tag">Outstanding Paybles</p>
                  <p id="recieve-tag">
                    &#8377;
                    {outStandingBal ? outStandingBal.toFixed(2) : 0}
                  </p>
                </div>
              </div>
            </div>
            <div
              className="form-group record_modal_row mb-0"
              id="input_in_modal"
            >
              <label hmtlFor="amtRecieved" id="amt-tag">
                Amount Recieved
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
            <div id="comment_in_modal record_modal_row">
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
           
          </form>
        </div>
      </div>
      <div className="modal-footer" id="modal_footer">
        <button
          type="button"
          id="submit_btn_in_modal"
          className="primary_btn cont_btn w-100"
          onClick={() => {
            onSubmitRecordPayment();
          }}
          data-bs-dismiss="modal"
        >
          SUBMIT
        </button>
      </div>
    </Modal>
  );
};
export default AddRecordPayment;
