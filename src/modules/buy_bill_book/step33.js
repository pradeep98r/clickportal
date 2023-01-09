import { useSelector,useDispatch } from "react-redux";
import { selectSteps } from "../../reducers/stepsSlice";
const Step33 = () =>{
    const dispatch = useDispatch();
    const nextStep = () =>{
        // dispatch(selectSteps('step3'))
    }
    const previousStep = () =>{
        dispatch(selectSteps('step2'))
    }
    return(
        <div>
        <p>step33</p>
        <div className="bottom_div">
            <div className="d-flex align-items-center justify-content-end">
            <button className="secondary_btn" onClick = {()=>previousStep()}>Previous</button>
              <button className="primary_btn" onClick={()=>nextStep()}>
                Next
              </button>
            </div>
          </div>
      </div>
    )
    }
    export default Step33