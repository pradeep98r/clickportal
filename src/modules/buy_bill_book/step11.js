import { useSelector, useDispatch } from "react-redux";
import { selectSteps } from "../../reducers/stepsSlice";
import SelectPartner from "./selectParty";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import BillDateSelection from "./billDateSelection";
import Step2Modal from "./step2Modal";

const Step11 = (props) => {
  const dispatch = useDispatch();
  const users  = useSelector(state => state.buyerInfo);
  const cancelStep = () => {
    console.log('billbook nnext');
};
const langData = localStorage.getItem("languageData");
const langFullData = JSON.parse(langData);
useEffect(() => {
  localStorage.setItem("selectPartytype", null);
  console.log(users.buyerInfo,"data partyinfo")
  setPartnerData(users.buyerInfo);
  setSelectedBuyerSellerData(users.buyerInfo)
  separtType(users.buyerInfo?.partyType.toLowerCase());
  if (users.buyerInfo?.itemtype != null) {
    setpartysType(users.buyerInfo?.itemtype.toLowerCase());
  }
  if (users.buyerInfo?.partyType.toLowerCase() != "transporter") {
    localStorage.removeItem("selectedTransporter");
  } else {
    localStorage.setItem("selectedTransporter", JSON.stringify(users.buyerInfo));
  }
}, [users.buyerInfo]);
const [partnerData, setPartnerData] = useState(null);
const [partType, separtType] = useState("");
const [partysType, setpartysType] = useState("");
const [selectedDate, setSelectedDate] = useState(new Date());
const [selectedBuyerSellerData, setSelectedBuyerSellerData] = useState({})
const callbackFunction = (childData, party, type) => {
 
};
const callbackFunctionDate = (date) => {
  setSelectedDate(date);
  
};
const addCropModal = () => {
  dispatch(selectSteps('step2'))
  props.billEditStatuscallback(false,selectedDate,false);
};
const [onClickPage, setonClickPage] = useState(false);
document.body.addEventListener("click", function (evt) {
  setonClickPage(true);
});
  return (
    <div>
       <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
          <div className="row">
            <div className="col-lg-4 p-0">
              <SelectPartner
                partyType="Seller"
                parentCallback={callbackFunction}
                onClickPage={onClickPage}
              />
            </div>
            <div className="col-lg-5 ">
              <BillDateSelection parentCallbackDate={callbackFunctionDate} />
            </div>
            <div className="col-lg-3 p-0">
              <SelectPartner
                partyType="Transporter"
                parentCallback={callbackFunction}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
          {/* { partysType + partType} */}
        {partnerData != null &&
        (partysType.toLowerCase() == "seller"
          ? partType.toLowerCase() == "transporter"
            ? true
            : true
          : true) ? (
          <div className="bottom_div">
            <div className="d-flex align-items-center justify-content-end">
            <button className="secondary_btn" onClick = {cancelStep}>cancel</button>
              <button className="primary_btn" onClick={addCropModal}>
                {langFullData.next}
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        {/* {showCropModalStatus ? (
          <Step2Modal
            showCrop={showCropModal}
            closeCropModal={() => setShowCropModal(false)}
            cropTableEditStatus={false}
            billEditStatus={false}
            selectedBilldate={selectedDate}
            selectedPartyType = 'seller'
            selectedBuyerSellerData={selectedBuyerSellerData}
          />
        ) : (
          ""
        )} */}
      </div>
    </div>
    </div>
  );
};
export default Step11;
