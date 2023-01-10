import { Modal } from "react-bootstrap";
import Step11 from "./step11";
import { useSelector } from "react-redux";
import Step22 from "./step222";
import clo from "../../assets/images/clo.png";
import Step33 from "./step33";
import { useState } from "react";
const Steps = (props) => {
  const selectedStep = useSelector((state) => state.stepsInfo);
  const [selctedCrops, setSelctedCrops] = useState([]);
  const callbackfunction = (chaild, editStatus) => {
    console.log(chaild, editStatus, "crops");
    setSelctedCrops(chaild);
  };
  const [billStatus, setBillstatus] = useState(false);
  const [selectedDate, setselectedDate] = useState(false);
  const [cropEditObject, setcropEditObject] = useState([]);
  const [slectedCropstableArray, setslectedCropstableArray] = useState([]);
  const [selectedPartyType, setselectedPartyType] = useState("");
  const [cropTableEditStatus, setcropTableEditStatus] = useState(false);
  const billeditCallback = (
    billEditStatus,
    selectedBilldate,
    cropTableEditStatus
  ) => {
    setBillstatus(billEditStatus);
    setselectedDate(selectedBilldate);
    console.log(billEditStatus);
    setcropTableEditStatus(cropTableEditStatus);
  };
  const step3ChildCallback = (
    cropTableEditStatus,
    cropEditObject,
    billEditStatus,
    slectedCropstableArray,
    selectedPartyType,
    selectedBilldate,
    selectedBuyerSellerData
  ) => {
    setcropEditObject(cropEditObject);
    setslectedCropstableArray(slectedCropstableArray);
    setselectedPartyType(selectedPartyType);
    setcropTableEditStatus(cropTableEditStatus);
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
                return "Add Information";
              case "step2":
                return "Add Crop Information";
              case "step3":
                return "Additions/Deductions";
            }
          })()}
        </h5>
        <img alt="image" src={clo} onClick={props.closeStepsModal} />
      </div>
      <div className="modal-body p-0">
        {(() => {
          switch (selectedStep.stepsInfo) {
            case "step1":
              return <Step11 billEditStatuscallback={billeditCallback}  closem={props.closeStepsModal}/>;
            case "step2":
              return (
                <Step22
                  parentcall={callbackfunction}
                  billEditStatus={billStatus}
                  selectdDate={selectedDate}
                  cropTableEditStatus={cropTableEditStatus}
                  cropEditObject={cropEditObject}
                  slectedCropstableArray={slectedCropstableArray}
                  selectedPartyType={selectedPartyType}
                  selectedBilldate={selectedDate}
                />
              );
            case "step3":
              return (
                <Step33
                  slectedCropsArray={selctedCrops}
                  step3ParentCallback={step3ChildCallback}
                  billEditStatus={billStatus}
                  selectdDate={selectedDate}
                  closem={props.closeStepsModal}
                  // selectedBuyerSellerData={props.selectedBuyerSellerData}
                />
              );
          }
        })()}
      </div>
    </Modal>
  );
};
export default Steps;
