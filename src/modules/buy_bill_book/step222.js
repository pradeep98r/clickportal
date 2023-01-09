import { useSelector,useDispatch } from "react-redux";
import { selectBuyer } from "../../reducers/buyerSlice";
import { selectSteps } from "../../reducers/stepsSlice";
const Step22 = () =>{
    const users  = useSelector(state => state.buyerInfo);
    const dispatch = useDispatch();
    const selectedStep  = useSelector(state => state.stepsInfo);
    console.log(selectedStep,"selectedone")
    const nextStep = () =>{
        dispatch(selectSteps('step3'))
    }
    const previousStep = () =>{
        dispatch(selectBuyer(users.buyerInfo))
        dispatch(selectSteps('step1'))
    }
    return(
        <div>
        <p>step22</p>
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
    export default Step22