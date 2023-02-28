import React from 'react'
import { useState } from 'react';
import close from "../../assets/images/close.svg";
import date_icon from "../../assets/images/date_icon.svg";
import DatePicker from "react-datepicker";
import single_bill from "../../assets/images/bills/single_bill.svg";
import add from "../../assets/images/add.svg";
import $ from "jquery";
import { getOutstandingBal, postRecordPayment } from '../../actions/ledgersService';
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMaskedMobileNumber } from '../../components/getCurrencyNumber';

const RecordPayment = (props) => {
    const ledgerData = props.LedgerData;
    const partyId = props.ledgerId;
    const loginData = JSON.parse(localStorage.getItem("loginResponse"));
    const clickId = loginData.caId;
    const [selectDate, setSelectDate] = useState(new Date());
    const paidRcvd = props.outStbal;
    const [paidsRcvd, setPaidsRcvd] = useState(0);
    const [comments, setComments] = useState(" ");
    const [paymentMode, setPaymentMode] = useState("CASH");
    const [requiredCondition, setRequiredCondition] = useState("");
    const [open, setIsOpen] = useState(false);
    console.log(ledgerData, "ledgerData");

    const getAmountVal = (e) => {
        setPaidsRcvd(
            e.target.value.replace(/[^\d]/g, "")
        );
        if (e.target.value.length > 0) {
            setRequiredCondition("");
        }
    }
    const resetInput = (e) => {
        if (e.target.value == 0) {
            e.target.value = "";
        }
    }
    const onSubmitRecordPayment = () => {
        if (paidsRcvd < 0) {
            setRequiredCondition("Amount Recieved Cannot be negative");
        } else if (parseInt(paidsRcvd) === 0) {
            setRequiredCondition("Amount Received cannot be empty");
        } else if (isNaN(paidsRcvd)) {
            setRequiredCondition("Invalid Amount");
        } else if (
            paidsRcvd.trim().length !== 0 &&
            paidsRcvd != 0 &&
            paidsRcvd < paidRcvd &&
            !(paidsRcvd < 0)
        ) {
            addRecordPayment();
        } else if (parseInt(paidsRcvd) > paidRcvd) {
            setRequiredCondition(
                "Entered Amount  cannot more than Outstanding Balance"
            );
        }
    };

    const addRecordPayment = () => {
        const addRecordData = {
            caId: clickId,
            partyId: partyId,
            date: moment(selectDate).format("YYYY-MM-DD"),
            comments: comments,
            paidRcvd: paidsRcvd,
            paymentMode: paymentMode,
        };
        postRecordPayment(addRecordData).then((response) => {
            closePopup();
            toast.success(response.data.status.message, {
                toastId: "errorr2",
            })
            window.setTimeout(function () {
                window.location.reload();
            }, 2000);;
        },
            (error) => {
                toast.error(error.response.data.status.message, {
                    toastId: "error3",
                });
            });

    };
    const closePopup = () => {
        setPaidsRcvd(0);
        setRequiredCondition('');
        setPaymentMode("CASH");
        setComments('');
        setSelectDate(new Date());
        $("#myModal").modal("hide");
    };
    return (
        <div>
            <div className="recordbtn-style">
                <button
                    className="add-record-btns"
                    onClick={() => {
                            setIsOpen(!open);
                    }}
                    data-toggle="modal"
                    data-target="#myModal"
                    >
                    Record payment
                </button>

                <div className="add-pays-btn">
                    <img src={add} id="addrecord-img" />
                </div>
            </div>
            <div className="modal fade" id="myModal">
                <div className="modal-dialog transporter_modal modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className="modal-title header2_text"
                                id="staticBackdropLabel"
                            >
                                Add Record Payment
                            </h5>
                            <img
                                src={close}
                                alt="image"
                                className="close_icon"
                                onClick={closePopup}
                            />
                        </div>
                        <div
                            className="modal-body transporter_model_body"
                            id="scroll_style"
                        >
                            <form>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="card">
                                            <div
                                                className="d-flex justify-content-between card-body"
                                                id="details-tag"
                                            >

                                                <div
                                                    className="profile-details"
                                                    key={ledgerData?.partyId}
                                                >
                                                    <div className="d-flex">
                                                        <div>
                                                            {ledgerData?.profilePic ? (
                                                                <img
                                                                    id="singles-img"
                                                                    src={ledgerData.profilePic}
                                                                    alt="buy-img"
                                                                />
                                                            ) : (
                                                                <img
                                                                    id="singles-img"
                                                                    src={single_bill}
                                                                    alt="img"
                                                                />
                                                            )}
                                                        </div>
                                                        <div id="trans-dtl">
                                                            <p className="namedtl-tag">
                                                                {ledgerData.partyName}
                                                            </p>
                                                            <p className="mobilee-tag">
                                                            {!ledgerData.trader
                                                                ? props.type == "BUYER"
                                                                    ? "Buyer":
                                                                    props.type =='TRANS'?
                                                                    'Transporter'
                                                                    : "Seller"
                                                                : "Trader"}{" "}
                                                                - {ledgerData.partyId}&nbsp;|&nbsp;
                                                                {getMaskedMobileNumber(ledgerData.mobile)}
                                                            </p>
                                                            <p className="addres-tag">
                                                                {ledgerData.partyAddress
                                                                    ? ledgerData.partyAddress
                                                                    : ""}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="d-flex justify-content-between card-text date_field"
                                                    id="date-tag"
                                                >

                                                    <img
                                                        className="date_icon_in_modal"
                                                        src={date_icon}
                                                    />
                                                    <DatePicker
                                                        //className="date_picker_in_modal"
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
                                        <div id="out-paybles">
                                            <p id="p-tag">Outstanding Recievables</p>
                                            <p id="recieve-tag">
                                                &#8377;
                                                {paidRcvd ? paidRcvd.toFixed(2) : 0}
                                            </p>
                                        </div>
                                        <div className="form-group" id="input_in_modal">
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
                                                    getAmountVal(e)
                                                }}
                                            />
                                            <p className="text-valid">{requiredCondition}</p>
                                        </div>
                                        <div id="radios_in_modal">
                                            <p className="payment-tag">Payment Mode</p>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input radioBtnVal mb-0"
                                                    type="radio"
                                                    name="radio"
                                                    id="inlineRadio1"
                                                    value="CASH"
                                                    onChange={(e) =>
                                                        setPaymentMode(e.target.value)
                                                    }
                                                    checked={paymentMode === "CASH"}
                                                    required
                                                />
                                                <label
                                                    className="form-check-label"
                                                    for="inlineRadio1"
                                                >
                                                    CASH
                                                </label>
                                            </div>
                                            <div
                                                className="form-check form-check-inline"
                                                id="radio-btn-in_modal"
                                            >
                                                <input
                                                    className="form-check-input radioBtnVal mb-0"
                                                    type="radio"
                                                    name="radio"
                                                    id="inlineRadio2"
                                                    value="UPI"
                                                    onChange={(e) =>
                                                        setPaymentMode(e.target.value)
                                                    }
                                                    checked={paymentMode === "UPI"}
                                                    required
                                                />
                                                <label
                                                    className="form-check-label"
                                                    for="inlineRadio2"
                                                >
                                                    UPI
                                                </label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input radioBtnVal mb-0"
                                                    type="radio"
                                                    name="radio"
                                                    id="inlineRadio3"
                                                    value="NEFT"
                                                    onChange={(e) =>
                                                        setPaymentMode(e.target.value)
                                                    }
                                                    checked={paymentMode === "NEFT"}
                                                    required
                                                />
                                                <label
                                                    className="form-check-label"
                                                    for="inlineRadio3"
                                                >
                                                    NEFT
                                                </label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input radioBtnVal mb-0"
                                                    type="radio"
                                                    name="radio"
                                                    id="inlineRadio4"
                                                    value="RTGS"
                                                    onChange={(e) =>
                                                        setPaymentMode(e.target.value)
                                                    }
                                                    checked={paymentMode === "RTGS"}
                                                    required
                                                />
                                                <label
                                                    className="form-check-label"
                                                    for="inlineRadio4"
                                                >
                                                    RTGS
                                                </label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input radioBtnVal mb-0"
                                                    type="radio"
                                                    name="radio"
                                                    id="inlineRadio5"
                                                    value="IMPS"
                                                    onChange={(e) =>
                                                        setPaymentMode(e.target.value)
                                                    }
                                                    checked={paymentMode === "IMPS"}
                                                    required
                                                />
                                                <label
                                                    className="form-check-label"
                                                    for="inlineRadio5"
                                                >
                                                    IMPS
                                                </label>
                                            </div>
                                        </div>
                                        <div id="comment_in_modal">
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
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer" id="modal_footer">
                            <button
                                type="button"
                                id="submit_btn_in_modal"
                                className="primary_btn cont_btn w-100"
                                onClick={onSubmitRecordPayment}
                                // id="close_modal"
                                data-bs-dismiss="modal"
                            >
                                SUBMIT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default RecordPayment