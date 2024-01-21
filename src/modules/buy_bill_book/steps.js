import { Modal } from "react-bootstrap";
import Step11 from "./step11";
import { useDispatch, useSelector } from "react-redux";
import Step22 from "./step222";
import Step33 from "./step33";
import { useState } from "react";
import SellBillStep3 from "../sell_bill_book/sellBillStep3";
import { selectTrans } from "../../reducers/transSlice";
import clo from "../../assets/images/close.svg";
import { billDate } from "../../reducers/billEditItemSlice";
const Steps = (props) => {
  const selectedStep = useSelector((state) => state.stepsInfo);
  const [selctedCrops, setSelctedCrops] = useState([]);
  const [billStatus, setBillstatus] = useState(false);
  const [selectedDate, setselectedDate] = useState(false);
  const [cropEditObject, setcropEditObject] = useState([]);
  const [slectedCropstableArray, setslectedCropstableArray] = useState([]);
  const [slectedCrops, setslectedCrops] = useState([]);
  const [maintainCrops, setMaintainCrops] = useState(false);

  const callbackfunction = (chaild, editStatus) => {
    setSelctedCrops(chaild);
  };
  const linkPath = localStorage.getItem("LinkPath");

  const partyType = useSelector(
    (state) => state.billEditItemInfo?.selectedPartyType
  );

  const billeditCallback = (crops) => {
    setcropEditObject(crops);
  };
  const step3ChildCallback = (
    cropEditObject,
    slectedCropstableArray,
    selectedCrops
  ) => {
    setslectedCrops(selectedCrops);
    setcropEditObject(cropEditObject);
    setslectedCropstableArray(slectedCropstableArray);
  };
  const billEditItemInfo = useSelector((state) => state.billEditItemInfo);
  const billViewEditStatus = billEditItemInfo?.billEditStatus;
  const billDateSelected = billEditItemInfo?.selectedBillDate;
  const link = localStorage.getItem("LinkPath");
  const dispatch = useDispatch();
  const clearData = (e) => {
    setMaintainCrops(true);
    localStorage.setItem("maintainCrops", true);
    dispatch(
      billDate(
        billDateSelected != null ? new Date(billDateSelected) : new Date()
      )
    );
    // localStorage.removeItem("defaultDate");
    // localStorage.removeItem("setDate");
    dispatch(selectTrans(null));
    setcropEditObject([]);
    setslectedCropstableArray([]);
    if (billViewEditStatus) {
      if (!props.fromLedger) {
        window.location.reload();
      }
    }
  };
  return (
    <Modal
      show={props.showStepsModal}
      close={props.closeStepsModal}
      className="cropmodal_poopup steps_modal"
    >
      <div className="modal-header date_modal_header smartboard_modal_header">
        {linkPath == "/buy_bill_book" ? (
          <h5 className="modal-title header2_text" id="staticBackdropLabel">
            Add Purchase Bill
            {/* {(() => {
            switch (selectedStep.stepsInfo) {
              case "step1":
                return "Bill Information";
              case "step2":
                return "Add Crop Information";
              case "step3":
                return "Additions/Deductions";
            }
          })()} */}
          </h5>
        ) : (
          <h5 className="modal-title header2_text" id="staticBackdropLabel">
            Add Sales Bill
          </h5>
        )}
        <img
          alt="image"
          src={clo}
          className="cloose"
          onClick={(e) => {
            clearData(e);
            props.closeStepsModal();
          }}
        />
      </div>
      <div className="modal-body p-0">
        <div className="d-flex steps_flex align-items-center justify-content-center">
          <div
            className={
              selectedStep.stepsInfo == "step1"
                ? "steps_btn steps_btn_active"
                : selectedStep.stepsInfo == "step2"
                ? "steps_btn steps_btn_active"
                : selectedStep.stepsInfo == "step3"
                ? "steps_btn steps_btn_active"
                : "steps_btn"
            }
          >
            Step1
          </div>
          <div className="steps_btn_border"></div>
          <div
            className={
              selectedStep.stepsInfo == "step2"
                ? "steps_btn steps_btn_active"
                : selectedStep.stepsInfo == "step3"
                ? "steps_btn steps_btn_active"
                : "steps_btn"
            }
          >
            Step2
          </div>
          <div className="steps_btn_border"></div>
          <div
            className={
              selectedStep.stepsInfo == "step3"
                ? "steps_btn steps_btn_active"
                : "steps_btn"
            }
          >
            Step3
          </div>
        </div>
        {(() => {
          switch (selectedStep.stepsInfo) {
            case "step1":
              return (
                <Step11
                  billEditStatuscallback={billeditCallback}
                  closem={props.closeStepsModal}
                />
              );
            case "step2":
              return (
                <Step22
                  parentcall={callbackfunction}
                  maintainCrops={maintainCrops}
                  cropEditObject={cropEditObject}
                  slectedCropstableArray={slectedCropstableArray}
                  closem={props.closeStepsModal}
                  slectedCrops={slectedCrops}
                />
              );
            case partyType.toUpperCase() === "SELLER" && "step3":
              return (
                <Step33
                  slectedCropsArray={selctedCrops}
                  step3ParentCallback={step3ChildCallback}
                  billEditStatus={billStatus}
                  selectdDate={selectedDate}
                  closem={props.closeStepsModal}
                  fromLedger={props.fromLedger}
                />
              );
            case partyType.toUpperCase() === "BUYER" && "step3":
              return (
                <SellBillStep3
                  slectedSellCropsArray={selctedCrops}
                  step3ParentCallback={step3ChildCallback}
                  billEditStatus={billStatus}
                  selectdDate={selectedDate}
                  closem={props.closeStepsModal}
                  fromLedger={props.fromLedger}
                />
              );
          }
        })()}
      </div>
    </Modal>
  );
};
export default Steps;
