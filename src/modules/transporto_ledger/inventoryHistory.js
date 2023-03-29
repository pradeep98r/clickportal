import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import clo from "../../assets/images/close.svg";
import { useDispatch, useSelector } from "react-redux";
import "../ledgers/paymentHistory.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cancel from "../../assets/images/cancel.svg";
import edit from "../../assets/images/edit_round.svg";
import moment from "moment";
import { getMaskedMobileNumber } from "../../components/getCurrencyNumber";


const InventoryHistoryView = (props) => {
  var paymentViewData = useSelector((state) => state.paymentViewInfo);
  const transpoData = useSelector((state) => state.transpoInfo);
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const dispatch = useDispatch();
  const paymentHistoryData = paymentViewData?.paymentViewInfo;
 
  console.log(paymentHistoryData, paymentViewData?.paymentViewInfo);

  return (
    <Modal
      show={props.showInvViewModal}
      close={props.closeInvViewModal}
      className="cropmodal_poopup steps_modal billView_modal right"
    >
      <div className="modal-header date_modal_header smartboard_modal_header">
        <h5
          className="modal-title d-flex align-items-center header2_text"
          id="staticBackdropLabel"
        >
          Inventory Ledger | {paymentHistoryData.refId}
        </h5>
        <button
          onClick={(e) => {
            props.closeInvViewModal();
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
                      <img
                        src={paymentHistoryData?.profilePic}
                        className="payment_profilepic"
                      />
                      <div>
                        <h6>{paymentHistoryData?.partyName}</h6>
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
              <div className="partyDetails">
                <div className="row justify-content-between align-items-center">
                  <div className="col-lg-4 p-0">
                    {paymentHistoryData.details != null && (
                      <div>
                        <h6>Types</h6>
                        <div className="d-flex">
                          <h5>
                            {paymentHistoryData?.details.unit +
                              ":" +
                              paymentHistoryData?.details.qty}
                          </h5>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-lg-5 p-0"></div>
                  <div className="col-lg-3 p-0">
                    <h6>Status</h6>
                    <h5>{paymentHistoryData?.type}</h5>
                  </div>
                </div>
              </div>

              <div className="partyDetails comment_details">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6>Comment</h6>
                    <h5>{paymentHistoryData?.comments}</h5>
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
                  <div>
                    <div className="action_icons">
                      {paymentHistoryData.billPaid ? (
                        ""
                      ) : (
                        <div className="items_div">
                          <button>
                            <img src={edit} alt="img" className="" />
                          </button>
                          <p>Edit</p>
                        </div>
                      )}
                      <div className="items_div">
                        <button>
                          <img src={cancel} alt="img" className="" />
                        </button>
                        <p>Delete</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </Modal>
  );
};
export default InventoryHistoryView;
