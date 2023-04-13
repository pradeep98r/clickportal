import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import clo from "../../assets/images/close.svg";
import Step1 from "./step1";
const MultiBillSteps = (props) => {
  const selectedStep = useSelector((state) => state.multiStepsInfo);
  const selectedStepVal = selectedStep?.multiStepsVal;
  console.log(selectedStepVal, "stepss");
  const linkPath = localStorage.getItem("LinkPath");

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
            // clearData(e);
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
              return <Step1 />;
            case "step2":
              return "step2";
            // case partyType.toUpperCase() === "SELLER" && "step3":
            //   return "buy bill step3";
            case "step3":
              return "sell bill step3";
          }
        })()}
      </div>
    </Modal>
  );
};
export default MultiBillSteps;
