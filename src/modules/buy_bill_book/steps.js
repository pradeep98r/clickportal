import { Modal } from "react-bootstrap";
import Step11 from "./step11";
import { useSelector } from "react-redux";
import Step22 from "./step222";
import clo from "../../assets/images/clo.png";
import Step33 from "./step33";
const Steps = (props) => {
  const selectedStep = useSelector((state) => state.stepsInfo);
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
      {(() => {
        switch (selectedStep.stepsInfo) {
          case "step1":
            return <Step11 />;
          case "step2":
            return <Step22 />;
          case "step3":
            return <Step33 />;
        }
      })()}
    </Modal>
  );
};
export default Steps;
