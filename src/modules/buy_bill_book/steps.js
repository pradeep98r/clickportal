import { Modal } from "react-bootstrap";
import Step11 from "./step11";
import { useDispatch, useSelector } from "react-redux";
import Step22 from "./step222";
import Step33 from "./step33";
import { useState } from "react";
import SellBillStep3 from "../sell_bill_book/sellBillStep3";
import { selectTrans } from "../../reducers/transSlice";
import clo from "../../assets/images/close.svg";
const Steps = (props) => {
  const selectedStep = useSelector((state) => state.stepsInfo);
  const [selctedCrops, setSelctedCrops] = useState([]);
  const [billStatus, setBillstatus] = useState(false);
  const [selectedDate, setselectedDate] = useState(false);
  const [cropEditObject, setcropEditObject] = useState([]);
  const [slectedCropstableArray, setslectedCropstableArray] = useState([]);
  const [slectedCrops, setslectedCrops] = useState([]);
  const callbackfunction = (chaild, editStatus) => {
    setSelctedCrops(chaild);
  };

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
  const dispatch = useDispatch();
  const clearData = (e) => {
    localStorage.removeItem("defaultDate");
    localStorage.removeItem("setDate");
    dispatch(selectTrans(null));
    setcropEditObject([]);
    setslectedCropstableArray([]);
  };

  return (
    <Modal
      show={props.showStepsModal}
      close={props.closeStepsModal}
      className="cropmodal_poopup steps_modal"
    >
      <div className="modal-header date_modal_header smartboard_modal_header">
        <h5 className="modal-title header2_text" id="staticBackdropLabel">
          {(() => {
            switch (selectedStep.stepsInfo) {
              case "step1":
                return "Bill Information";
              case "step2":
                return "Add Crop Information";
              case "step3":
                return "Additions/Deductions";
            }
          })()}
        </h5>
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
          <button className={selectedStep.stepsInfo == 'step1' ? 'steps_btn steps_btn_active' : selectedStep.stepsInfo == 'step2' ? 'steps_btn steps_btn_active' : (selectedStep.stepsInfo == 'step3' ? 'steps_btn steps_btn_active' : 'steps_btn')}>
             Step1
          </button>
          <div className="steps_btn_border"></div>
          <button className={selectedStep.stepsInfo == 'step2' ? 'steps_btn steps_btn_active' : (selectedStep.stepsInfo == 'step3' ? 'steps_btn steps_btn_active' : 'steps_btn')} >
             Step2
          </button>
          <div className="steps_btn_border"></div>
          <button className={selectedStep.stepsInfo == 'step3' ? 'steps_btn steps_btn_active' : 
          'steps_btn'}>
             Step3
          </button>
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
                />
              );
          }
        })()}
      </div>
    </Modal>
  );
};
export default Steps;
