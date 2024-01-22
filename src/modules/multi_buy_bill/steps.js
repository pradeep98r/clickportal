import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import clo from "../../assets/images/close.svg";
import {
  multiSelectPartners,
  selectedTransporter,
  slectedBillDate,
} from "../../reducers/multiBillSteps";
import SellMultiBillStep3 from "./sellBillStep3";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
const MultiBillSteps = (props) => {
  const selectedStep = useSelector((state) => state.multiStepsInfo);
  const listOfDates = useSelector((state) => state.multiStepsInfo);
  const partyType = selectedStep?.multiSelectPartyType;
  const dispatch = useDispatch();
  const selectedStepVal = selectedStep?.multiStepsVal;
  const linkPath = localStorage.getItem("LinkPath");
  const slectedBillDateVal =
    listOfDates?.slectedBillDate != ""
      ? listOfDates?.slectedBillDate
      : new Date();
  const clearData = () => {
    dispatch(multiSelectPartners([]));
    console.log("cleardata");
    dispatch(selectedTransporter([]));
    console.log(selectedStep, "close");
    dispatch(
      slectedBillDate(
        slectedBillDateVal != null ? new Date(slectedBillDateVal) : new Date()
      )
    );
  };
  return (
    <Modal
      show={props.showMultiStepsModal}
      close={props.closeMultiStepsModal}
      className="cropmodal_poopup steps_modal"
    >
      <div className="modal-header date_modal_header smartboard_modal_header">
        {linkPath == "/buy_bill_book" ? (
          <h5 className="modal-title header2_text" id="staticBackdropLabel">
            Add Purchase Bill
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
            props.closeMultiStepsModal();
          }}
        />
      </div>
      <div className="modal-body p-0">
        <div className="d-flex steps_flex align-items-center justify-content-center">
          <div
            className={
              selectedStepVal == "step1"
                ? "steps_btn steps_btn_active"
                : selectedStepVal == "step2"
                ? "steps_btn steps_btn_active"
                : selectedStepVal == "step3"
                ? "steps_btn steps_btn_active"
                : "steps_btn"
            }
          >
            Step1
          </div>
          <div className="steps_btn_border"></div>
          <div
            className={
              selectedStepVal == "step2"
                ? "steps_btn steps_btn_active"
                : selectedStepVal == "step3"
                ? "steps_btn steps_btn_active"
                : "steps_btn"
            }
          >
            Step2
          </div>
          <div className="steps_btn_border"></div>
          <div
            className={
              selectedStepVal == "step3"
                ? "steps_btn steps_btn_active"
                : "steps_btn"
            }
          >
            Step3
          </div>
        </div>
        {(() => {
          switch (selectedStepVal) {
            case "step1":
              return <Step1 closeModal={props.closeMultiStepsModal} />;
            case "step2":
              return <Step2 closeModal={props.closeMultiStepsModal} />;
            case partyType.toUpperCase() === "SELLER" && "step3":
              return <Step3 closeModal={props.closeMultiStepsModal} />;
            case partyType.toUpperCase() === "BUYER" && "step3":
              return (
                <SellMultiBillStep3 closeModal={props.closeMultiStepsModal} />
              );
          }
        })()}
      </div>
    </Modal>
  );
};
export default MultiBillSteps;
