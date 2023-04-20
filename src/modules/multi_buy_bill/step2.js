import { useDispatch } from "react-redux";
import { multiSelectPartners, multiStepsVal } from "../../reducers/multiBillSteps";

const Step2 = (props) => {
    const dispatch = useDispatch()
    const cancelStep = () => {
        dispatch(multiSelectPartners([]));
        props.closeModal();
      };
      const onClickStep2 = () =>{
          dispatch(multiStepsVal('step2'));
      }
      const previousStep = () =>{
        dispatch(multiStepsVal('step1'));  
      }
  return (
    <div>
      <div>
        <div className="main_div_padding">
            Step2
        </div>
        <div className="bottom_div">
        <div className="d-flex align-items-center justify-content-between">
          <button className="secondary_btn" onClick={cancelStep}>
            cancel
          </button>
          <div className="d-flex align-items-center">
            
              <button
                className="secondary_btn no_delete_btn"
                onClick={() => previousStep()}
              >
                Previous
              </button>
           
            <button className="primary_btn" onClick={() => onClickStep2()}>
              Next
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
export default Step2;
