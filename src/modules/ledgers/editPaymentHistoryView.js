import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import clo from "../../assets/images/close.svg";
import { useSelector } from "react-redux";
import "../ledgers/paymentHistory.scss";
import { getText } from "../../components/getText";
import moment from "moment";
const EditPaymentHistoryView = (props) => {
  var billHistoryViewData = props.billHistoryArray;
  console.log(billHistoryViewData);
  useEffect(() => {}, [props.showBillHistoryViewModal]);
  return (
    <Modal
      show={props.showBillHistoryViewModal}
      close={props.closeBillHistoryViewModal}
      className="modal-dialog-centered billHistoryViewData_modal"
      style={{'height' : '100%'}}
    >
      <div className="modal-header date_modal_header smartboard_modal_header">
        <h5
          className="modal-title d-flex align-items-center header2_text"
          id="staticBackdropLabel"
        >
       {props.selectedRefId} | Edit History
        </h5>
        <button
          onClick={(e) => {
            props.closeBillHistoryViewModal();
          }}
        >
          <img alt="image" src={clo} className="cloose" />
        </button>
      </div>
      <div className="modal-body billHistory_view">
        <div className="row my-2">
          <div className="col-lg-3">
            <h6>Attribute</h6>
          </div>
          <div className="col-lg-3">
            <h6>Old</h6>{" "}
          </div>
          <div className="col-lg-3">
            <h6>New</h6>
          </div>
          <div className="col-lg-3">
            <h6>Updated by</h6>
          </div>
        </div>
        <div className="billHistory_view_main_div" id="scroll_style">
        {billHistoryViewData.map((item, index) => {
          return (
            <div className="row billHistory_view_row" >
              <div className="col-lg-3">
                <p>{item.attribute}</p>
              </div>
              <div className="col-lg-3">
                <p>{item.oldValue}</p>{" "}
              </div>
              <div className="col-lg-3">
                <p>{item.newValue}</p>
                <p className="date_text">
                  {moment(new Date(Date.parse(item.updatedOn))).format(
                    "DD-MMM-YY"
                  ) +
                    moment(new Date(Date.parse(item.updatedOn))).format(
                      " | hh:mm:A"
                    )}
                </p>
              </div>
              <div className="col-lg-3">
                <p>{getText(item.updatedBy)}</p>
                <p>{item.userType}</p>
              </div>
            </div>
          );
        })}
        </div>
       
      </div>
    </Modal>
  );
};
export default EditPaymentHistoryView;
