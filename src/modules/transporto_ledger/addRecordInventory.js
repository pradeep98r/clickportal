import React from "react";
import { getText } from "../../components/getText";
import DatePicker from "react-datepicker";
import single_bill from "../../assets/images/bills/single_bill.svg";
import $ from "jquery";
import { useState } from "react";
import close from "../../assets/images/close.svg";
import date_icon from "../../assets/images/date_icon.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMaskedMobileNumber } from "../../components/getCurrencyNumber";
import {
  addRecordInventory,
  getInventory,
  getInventoryLedgers,
  getInventorySummary,
  getTransporters,
  updateRecordInventory,
} from "../../actions/transporterService";
import { useDispatch, useSelector } from "react-redux";
import {
  inventoryTotals,
  inventorySummaryInfo,
  outstandingAmount,
  transpoLedgersInfo,
  inventoryUnitDetails,
  outstandingAmountInv,
} from "../../reducers/transpoSlice";
import { Modal } from "react-bootstrap";
import { paymentViewInfo } from "../../reducers/paymentViewSlice";
import { formatInvLedger } from "../../components/getCropUnitValue";
const AddRecordInventory = (props) => {
  const dispatch = useDispatch();
  var paymentViewData = useSelector((state) => state.paymentViewInfo);
  const transpoData = useSelector((state) => state.transpoInfo);
  const fromInvEditStatus = props.fromInventoryHist;
  const viewInfo = paymentViewData?.paymentViewInfo;
  const ledgerData = fromInvEditStatus ? viewInfo : transpoData?.singleTransporterObject;
  const transId = transpoData?.transporterIdVal;
  const getInventor = transpoData?.inventoryUnitDetails;
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);
  const [selectDate, setSelectDate] = useState(fromInvEditStatus ? (new Date(viewInfo?.date)) : new Date());
  const [comments, setComments] = useState(fromInvEditStatus ? viewInfo?.comments : " ");
  const [unit, setUnit] = useState(fromInvEditStatus ? viewInfo?.details?.unit : "CRATES");
  const [qty, setQty] = useState(fromInvEditStatus ? viewInfo?.details?.qty : 0);
  const [tabs, setTabs] = useState(fromInvEditStatus ? viewInfo?.type == 'GIVEN' ? 'Given' : 'Collected' : "Given");
  var fromInventoryTab = transpoData?.fromInv;
  const [requiredCondition, setRequiredCondition] = useState("");

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
  ];
  const tabEvent = (type) => {
    setTabs(type);
  };
  const closePopup = () => {
    if (fromInvEditStatus) {
      setComments(viewInfo?.comments);
      setUnit(viewInfo?.details?.unit);
      setQty(viewInfo?.details?.qty);
      setTabs(viewInfo?.type == 'GIVEN' ? 'Given' : 'Collected');
      setRequiredCondition("");
      setSelectDate(new Date(viewInfo?.date))
    } else {
      setQty(0);
      setUnit('CRATES');
      setTabs('Given');
      setRequiredCondition("");
      setComments("");
      setSelectDate(new Date());
      $("#myModal").modal("hide");
    }

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
    } else if (qty.toString().trim().length !== 0 && !(qty < 0)) {
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
      details: [
        {
          qty: parseInt(qty),
          unit: unit,
        },
      ],
      writerId: writerId
    };
    const updateInventoryReq = {
      action: 'UPDATE',
      caId: clickId,
      transId: transId,
      comments: comments,
      date: convert(selectDate),
      type: tabs.toUpperCase(),
      refId: viewInfo?.refId,
      inventory:
      {
        qty: parseInt(qty),
        unit: unit,
      },
      writerId: writerId,
      mobile: viewInfo?.mobile,
      partyName: viewInfo?.partyName,
      details: {
        qty: parseInt(qty),
        unit: unit,
      }
    }
    if (fromInvEditStatus) {
      updateRecordInventory(updateInventoryReq).then(res => {
        toast.success(res.data.status.message, {
          toastId: "errorr2",
        });
        dispatch(paymentViewInfo(updateInventoryReq));
        window.setTimeout(function () {
          props.closeRecordInventoryModal();
        }, 800)
        if (transpoData?.transporterMainTab == 'transporterLedger') {
          getTransportersData();
          inventoryLedger(clickId, transId);
          getInventoryRecord()
        }
        else if (transpoData?.transpoTabs == 'inventoryledger') {
          getInventoryData();
          inventoryLedger(clickId, transId);
          getInventoryRecord()
        }
      })
        .catch((error) => {
          toast.error(error.response.data.status.message, {
            toastId: "error3",
          });
          console.log(error.message);
        });
    } else {
      addRecordInventory(inventoryRequest)
        .then((response) => {
          toast.success(response.data.status.message, {
            toastId: "errorr2",
          });
          window.setTimeout(function () {
            props.closeRecordInventoryModal();
            closePopup();
          }, 800)
          if (props.transporterMaintab == 'transporterLedger') {
            getTransportersData();
            inventoryLedger(clickId, transId);
            getInventoryRecord()
          }
          else if (props.tabs === "inventoryledger" || transpoData?.transpoTabs == 'inventoryledger') {
            getInventoryData();
            inventoryLedger(clickId, transId);
            getInventoryRecord()
          }
        })
        .catch((error) => {
          toast.error(error.response.data.status.message, {
            toastId: "error3",
          });
          console.log(error.message);
        });
    }

  };
  const resetInput = (e) => {
    if (e.target.value == 0) {
      e.target.value = "";
    }
  };
  const getTransportersData = () => {
    getTransporters(clickId).then((response) => {
      if (response.data.data != null) {
        dispatch(outstandingAmount(response.data.data));
        dispatch(transpoLedgersInfo(response.data.data.ledgers));
      }
    });
  };
  const getInventoryData = () => {
    getInventorySummary(clickId).then((response) => {
      if (response.data.data != null) {
        dispatch(outstandingAmountInv(response.data.data.totalInventory));
        dispatch(transpoLedgersInfo(response.data.data.summaryInfo));
      }
    });
  };
  const getInventoryRecord = () => {
    getInventory(clickId, transId)
      .then((response) => {
        if (response.data.data != null) {
          dispatch(inventoryUnitDetails(response.data.data));
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
        if (response.data.data != null) {
          dispatch(inventorySummaryInfo(response.data.data.details));
          dispatch(inventoryTotals(response.data.data));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Modal
      show={props.showRecordInventoryModal}
      close={props.closeRecordInventoryModal}
      className="record_payment_modal"
    >
      <div className="modal-body partner_model_body" id="scroll_style">
        <div>
          <form>
            <div className="d-flex align-items-center justify-content-between modal_common_header partner_model_body_row">
              <h5 className="modal-title header2_text" id="staticBackdropLabel">
                {fromInvEditStatus ? 'Update Record Inventory' : 'Record Inventory'}
              </h5>
             <button onClick={(e) => {
                  closePopup();
                  props.closeRecordInventoryModal();
                  e.preventDefault();
                }}>
             <img
                src={close}
                alt="image"
                className="close_icon"
                
              />
             </button>
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
                          "nav-link" + (
                            tabs == link.to ? " active" : "")
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
            <div className="d-flex justify-content-between card record_modal_row">
              <div
                className="d-flex justify-content-between align-items-center card-body mb-0"
                id="details-tag"
              >
                <div className="profile-details" key={transId}>
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
                      <p className="namedtl-tag">{fromInventoryTab && !fromInvEditStatus ? ledgerData?.transporterName : ledgerData?.partyName}</p>
                      <p className="mobilee-tag">
                        {
                          transId}&nbsp;|&nbsp;
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
                <div className="d-flex card-text date_field record_payment_datepicker" id="date-tag">
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
            {getInventor.length > 0 ?
              <div id="out-paybles">
                <div id="cbbk-tag">
                  <p id="p-tag">{langFullData.inventoryBalance}</p>
                  {props.tabs == "inventoryledger" || fromInvEditStatus ?
                    <p id="cbbsk-tag">
                      {formatInvLedger(getInventor ? getInventor : [])}
                    </p>
                    : ''}
                  {/* {props.tabs === "inventoryledger" &&
                getInventor.map((item) => {
                  return (
                    <p id="cbbsk-tag">
                      {item.unit}:{item.qty.toFixed(1)}
                      <span>&nbsp;|&nbsp;</span>
                    </p>
                  );
                })} */}
                </div>
              </div>
              : ''}
            <div id="radios_in_modal">
              <div className="radios">
                {tabs === "Given" ? (
                  <p className="select-tag">Select Given Type</p>
                ) : (
                  <p className="select-tag">{langFullData.selectCollectedType}</p>
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
                    CRATES
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
                    checked={unit === "SACS"}
                    required
                  />
                  <label
                    className="form-check-label"
                    for="inlineRadio2"
                    id="sacs"
                  >
                    SACS
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
                    checked={unit === "BOXES"}
                    required
                  />
                  <label
                    className="form-check-label"
                    for="inlineRadio3"
                    id="boxes"
                  >
                    BOXES
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
                    checked={unit === "BAGS"}
                    required
                  />
                  <label
                    className="form-check-label"
                    for="inlineRadio4"
                    id="bags"
                  >
                    BAGS
                  </label>
                </div>
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
                  value={qty}
                  onChange={(e) => setQty(e.target.value
                    .replace(/[^\d.]/g, "")
                    .replace(/^(\d*)(\.\d{0,2})\d*$/, "$1$2")
                    .replace(/(\.\d{0,2})\d*/, "$1")
                    .replace(/(\.\d*)\./, "$1"))}
                />
                <p className="text-valid">{requiredCondition}</p>
              </div>

              <div className="mb-3 comments-tag">
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
                  onChange={(e) => setComments(e.target.value)}
                ></textarea>
              </div>
            </div>
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
                  props.closeRecordInventoryModal();
                  closePopup();
                  e.preventDefault();
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary_btn w-100"
                onClick={onSubmitRecordInventory}
                // id="close_modal"
                data-bs-dismiss="modal"
              >
               {fromInvEditStatus ? 'UPDATE' : 'SUBMIT'} 
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="modal-footer" id="modal_footer">
        <button
          type="button"
          id="submit_btn_in_modal"
          className="primary_btn cont_btn w-100"
          onClick={onSubmitRecordInventory}
        >
          SUBMIT
        </button>
      </div> */}
      <ToastContainer />
    </Modal>
  );
};

export default AddRecordInventory;
