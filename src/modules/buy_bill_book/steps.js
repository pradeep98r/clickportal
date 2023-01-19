import { Modal } from "react-bootstrap";
import Step11 from "./step11";
import { useDispatch, useSelector } from "react-redux";
import Step22 from "./step222";
import clo from "../../assets/images/clo.png";
import Step33 from "./step33";
import { useState } from "react";
import SellBillStep3 from "../sell_bill_book/sellBillStep3";
import { selectTrans } from "../../reducers/transSlice";
import { selectBuyer } from "../../reducers/buyerSlice";
const Steps = (props) => {
  const selectedStep = useSelector((state) => state.stepsInfo);
  const [selctedCrops, setSelctedCrops] = useState([]);
  const [billStatus, setBillstatus] = useState(false);
  const [selectedDate, setselectedDate] = useState(false);
  const [cropEditObject, setcropEditObject] = useState([]);
  const [slectedCropstableArray, setslectedCropstableArray] = useState([]);
  const callbackfunction = (chaild, editStatus) => {
    console.log(chaild, editStatus, "crops");
    setSelctedCrops(chaild);
  };
  console.log(selctedCrops,"selected crops")
  

  const partyType = useSelector((state)=> state.billEditItemInfo?.selectedPartyType);

  const billeditCallback = (
      crops
    // billEditStatus,
    // selectedBilldate,
    // cropTableEditStatus
  ) => {
    setcropEditObject(crops);
    // setBillstatus(billEditStatus);
    // setselectedDate(selectedBilldate);
  };
  console.log(slectedCropstableArray,"array");
  const step3ChildCallback = (
    // cropTableEditStatus,
    cropEditObject,
    // billEditStatus,
    slectedCropstableArray,
    // selectedPartyType,
    // selectedBilldate,
    // selectedBuyerSellerData
  ) => {
     console.log(cropEditObject,slectedCropstableArray)
    setcropEditObject(cropEditObject);
    setslectedCropstableArray(slectedCropstableArray);
  };
  const dispatch = useDispatch();
  const clearData=(e)=>{
    dispatch(selectTrans(null)); 
  }
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
        <img alt="image" src={clo} className="cloose" onClick={e=>{clearData(e);props.closeStepsModal();}} />
      </div>
      <div className="modal-body p-0">
        {(() => {
          switch (selectedStep.stepsInfo) {
            case "step1":
              return <Step11 
              billEditStatuscallback={billeditCallback}
              closem={props.closeStepsModal} />;
            case "step2":
              return (
                <Step22
                  parentcall={callbackfunction}
                //   billEditStatus={billStatus}
                //   selectdDate={selectedDate}
                //   cropTableEditStatus={cropTableEditStatus}
                  cropEditObject={cropEditObject}
                  slectedCropstableArray={slectedCropstableArray}
                  closem={props.closeStepsModal}
                //   selectedPartyType={selectedPartyType}
                //   selectedBilldate={selectedDate}
                />
              );
            case partyType.toUpperCase() ==='SELLER' && "step3" :
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
            case partyType.toUpperCase() ==='BUYER' && "step3":
              return(
                <SellBillStep3 
                  slectedSellCropsArray={selctedCrops}
                  step3ParentCallback={step3ChildCallback}
                  billEditStatus={billStatus}
                  selectdDate={selectedDate}
                  closem={props.closeStepsModal}
                />
              )
          }
        })()}
      </div>
    </Modal>
  );
};
export default Steps;
