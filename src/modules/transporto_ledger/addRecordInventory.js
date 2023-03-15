import React from 'react'
import { getText } from '../../components/getText';
import DatePicker from "react-datepicker";
import single_bill from "../../assets/images/bills/single_bill.svg";
import add from "../../assets/images/add.svg";
import $ from "jquery";
import { useState } from 'react';
import close from "../../assets/images/close.svg";
import date_icon from "../../assets/images/date_icon.svg";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMaskedMobileNumber } from '../../components/getCurrencyNumber';
import { addRecordInventory, getInventoryLedgers } from '../../actions/transporterService';
const AddRecordInventory = (props) => {
    const ledgerData = props.LedgerData;
    const transId = props.ledgerId;
    const loginData = JSON.parse(localStorage.getItem("loginResponse"));
    const clickId = loginData.caId;
    const langData = localStorage.getItem("languageData");
    const langFullData = JSON.parse(langData);
    const [selectDate, setSelectDate] = useState(new Date());
    const [comments, setComments] = useState(" ");
    const [unit, setUnit] = useState("CRATES");
    const [qty, setQty] = useState(0);
    const [tabs, setTabs] = useState("Given");
    const [requiredCondition, setRequiredCondition] = useState("");
    const [open, setIsOpen] = useState(false);
    const links = [
        {
            id: 1,
            name: "Given",
            to: "Given",
        },
        {
            id: 2,
            name: "Collected",
            to: "Collected",
        },
    ]
    const tabEvent = (type) => {
        setTabs(type);
    }
    const closePopup = () => {
        setQty(0);
        setRequiredCondition("");
        setComments("");
        setSelectDate(new Date());
        $("#myModal").modal("hide");
    };
    // Convert standard date time to normal date
    function convert(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }
    const onSubmitRecordInventory = () => {
        if (qty < 0) {
            setRequiredCondition("Quantity Recieved Cannot be negative");
        } else if (parseInt(qty) === 0) {
            setRequiredCondition("Quantity Received cannot be empty");
        } else if (isNaN(qty)) {
            setRequiredCondition("Invalid Quantity");
        } else if (qty.trim().length !== 0 && !(qty < 0)) {
            postRecordInventory();
        }
    };
    //Add Record Inventory
    const postRecordInventory = () => {
        const inventoryRequest = {
            caId: clickId,
            transId: transId,
            comments: comments,
            date: convert(selectDate),
            type: tabs.toUpperCase(),
            // toggleInventory.toUpperCase(),
            details: [
                {
                    qty: parseInt(qty),
                    unit: unit,
                },
            ],
        };
        addRecordInventory(inventoryRequest)
            .then((response) => {
                toast.success(response.data.status.message, {
                    toastId: "errorr2",
                });
                closePopup();
                if (props.tabs === "inventoryledger") {
                    inventoryLedger(clickId, transId);
                }

            })
            .catch((error) => {
                toast.error(error.response.data.status.message, {
                    toastId: "error3",
                });
                console.log(error.message);
            });
    };
    const resetInput = (e) => {
        if (e.target.value == 0) {
            e.target.value = "";
        }
    };
    // get Inventory Ledger
    const inventoryLedger = (clickId, transId) => {
        getInventoryLedgers(clickId, transId)
            .then((response) => {
                props.invLedger(response.data.data.details)
                props.invLedgerData(response.data.data)
            })
            .catch((error) => {
                console.log(error)
            });
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
                <div className="modal-dialog transporter_inventory_modal modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header transporter_inventory_modal_header">
                            <h5
                                className="modal-title header2_text"
                                id="staticBackdropLabel"
                            >
                                Add Record Inventory
                            </h5>

                            <img
                                src={close}
                                alt="image"
                                className="close_icon"
                                onClick={closePopup}
                            />
                        </div>
                        <div className="bloc-tab">
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
                                                    "nav-link" +
                                                    (tabs == link.to ? " active" : "")
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
                        </div>
                        <div
                            className="modal-body p-0 transporter_inventory_model_body"
                            id="scroll_style"
                        >

                            <div>
                                <form>
                                    <div className="d-flex justify-content-between card">
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
                                                            {ledgerData?.partyName}
                                                        </p>
                                                        <p className="mobilee-tag">
                                                            {!ledgerData?.trader
                                                                ? props.partyType == "BUYER"
                                                                    ? "Buyer" :
                                                                    props.type == 'TRANS' ?
                                                                        'Transporter'
                                                                        : "Seller"
                                                                : "Trader"}{" "}
                                                            - {ledgerData?.partyId}&nbsp;|&nbsp;
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
                                            <div
                                                className="d-flex card-text"
                                                id="date-tag"
                                            >
                                                <img
                                                    className="date_icon_in_modal"
                                                    src={date_icon}
                                                />
                                                <div className="d-flex date_popper">
                                                    <DatePicker
                                                        //className="date_picker_in_modal"
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
                                    <div id="out-paybles">
                                        <p id="p-tag">
                                            {langFullData.inventoryBalance}
                                        </p>
                                    </div>
                                    <div id="cbbk-tag">
                                        {props.tabs === "inventoryledger" &&
                                            props.getInventor.map((item) => {
                                                return (
                                                    <p id="cbbsk-tag">
                                                        {item.unit}:{item.qty.toFixed(1)}
                                                        <span>&nbsp;|&nbsp;</span>
                                                    </p>
                                                );
                                            })}
                                    </div>
                                    <div id="radios_in_modal">
                                        {tabs === "Given" ? (
                                            <p className="select-tag">
                                                Select Given Type
                                            </p>
                                        ) : (
                                            <p className="select-tag">
                                                {langFullData.selectCollectedType}
                                            </p>
                                        )}

                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input radioBtnValues"
                                                type="radio"
                                                name="radio"
                                                id="inlineRadio1"
                                                value="CRATES"
                                                onChange={(e) => setUnit(e.target.value)}
                                                checked={unit === "CRATES"}
                                                required
                                            />
                                            <label
                                                className="form-check-label"
                                                for="inlineRadio1"
                                                id="crates"
                                            >
                                                {langFullData.crates.toUpperCase()}
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input radioBtnValues"
                                                type="radio"
                                                name="radio"
                                                id="inlineRadio2"
                                                value="SACS"
                                                onChange={(e) => setUnit(e.target.value)}
                                                required
                                            />
                                            <label
                                                className="form-check-label"
                                                for="inlineRadio2"
                                                id="sacs"
                                            >
                                                {langFullData.sacs}
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input radioBtnValues"
                                                type="radio"
                                                name="radio"
                                                id="inlineRadio3"
                                                value="BOXES"
                                                onChange={(e) => setUnit(e.target.value)}
                                                required
                                            />
                                            <label
                                                className="form-check-label"
                                                for="inlineRadio3"
                                                id="boxes"
                                            >
                                                {langFullData.boxes}
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline radioBtnValues">
                                            <input
                                                className="form-check-input radioBtnValues"
                                                type="radio"
                                                name="radio"
                                                id="inlineRadio4"
                                                value="BAGS"
                                                onChange={(e) => setUnit(e.target.value)}
                                                required
                                            />
                                            <label
                                                className="form-check-label"
                                                for="inlineRadio4"
                                                id="bags"
                                            >
                                                {langFullData.bags}
                                            </label>
                                        </div>
                                        <div className="form-gro">
                                            <label hmtlFor="amtRecieved" id="count-tag">
                                                {langFullData.numberOf} {getText(unit)}
                                            </label>
                                            <input
                                                className="form-cond"
                                                id="amtRecieved"
                                                onFocus={(e) => resetInput(e)}
                                                required
                                                onChange={(e) => setQty(e.target.value)}
                                            />
                                            <p className="text-valid">
                                                {requiredCondition}
                                            </p>
                                        </div>

                                        <div className="mb-3">
                                            <label
                                                for="exampleFormControlTextarea1"
                                                className="form-label"
                                                id="comments-tag"
                                            >
                                                {langFullData.comment}
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="comments"
                                                rows="2"
                                                value={comments}
                                                onChange={(e) =>
                                                    setComments(e.target.value)
                                                }
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
                                onClick={onSubmitRecordInventory} >
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

export default AddRecordInventory