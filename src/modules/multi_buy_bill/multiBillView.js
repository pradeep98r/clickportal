import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import BillViewFooter from "../buy_bill_book/billViewFooter";
import clo from "../../assets/images/close.svg";
import { useSelector } from "react-redux";
import BusinessDetails from "../buy_bill_book/business_details";
import PaartyCropDetails from "./partyCropsTable";
const MultiBillView = (props) => {
  const selectedStep = useSelector((state) => state.multiStepsInfo);
  const selectedBillData = selectedStep?.selectedMultBillArray;
  const pdfThemeDataArray = JSON.parse(localStorage.getItem("settingsData"));
  const pdfThemeData = pdfThemeDataArray != null ? pdfThemeDataArray[0] : null;
  const colorThemeVal =
    pdfThemeData != null
      ? pdfThemeData?.colorTheme != ""
        ? pdfThemeData?.colorTheme
        : "#16a12c"
      : "#16a12c";
  console.log(selectedBillData, "selected bill");
  return (
    <div>
      <Modal
        show={props.showMultiBillViewModal}
        close={props.closeMultiBillViewModal}
        className="cropmodal_poopup steps_modal billView_modal right"
      >
        <div className="modal-header date_modal_header smartboard_modal_header">
          <h5
            className="modal-title d-flex align-items-center header2_text"
            id="staticBackdropLabel"
          >
            <p className="b-name">
              {"Group Id - " + selectedBillData?.groupId}
            </p>
          </h5>
          <button
            onClick={() => {
              props.closeMultiBillViewModal();
            }}
          >
            <img alt="image" src={clo} className="cloose" />
          </button>
        </div>
        <div className="modal-body py-0">
          <div className="row">
            <div className="col-lg-10 col_left bill_col bill_col_border">
              <div className="bill_view_card buy_bills_view" id="scroll_style">
                <BusinessDetails />
                <div
                  className="bill_crop_details"
                  style={{ border: "2px solid" + colorThemeVal }}
                  id="scroll_style1"
                >
                  <PaartyCropDetails />

                  <BillViewFooter />
                </div>
              </div>
            </div>
            <div className="col-lg-2 p-0 "></div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default MultiBillView;
