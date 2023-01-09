import { useSelector, useDispatch } from "react-redux";
import { selectSteps } from "../../reducers/stepsSlice";
import SelectPartner from "./selectParty";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import BillDateSelection from "./billDateSelection";
import Step2Modal from "./step2Modal";

const Step11 = () => {
  const dispatch = useDispatch();
  const users  = useSelector(state => state.buyerInfo);
  console.log('step11')
//   const nextStep = () => {
//       console.log('step11 nnext')
//     dispatch(selectSteps("step2"));
//   };
  const cancelStep = () => {
    console.log('billbook nnext');
};
const langData = localStorage.getItem("languageData");
const langFullData = JSON.parse(langData);
useEffect(() => {
  localStorage.setItem("selectPartytype", null);
}, []);
const [partnerData, setPartnerData] = useState(null);
const [partType, separtType] = useState("");
const [partysType, setpartysType] = useState("");
const [selectedDate, setSelectedDate] = useState(new Date());
const [selectedBuyerSellerData, setSelectedBuyerSellerData] = useState({})
const callbackFunction = (childData, party, type) => {
  console.log(users.buyerInfo,"data")
  setPartnerData(users.buyerInfo);
  setSelectedBuyerSellerData(childData)
  separtType(type.toLowerCase());
  if (party != null) {
    setpartysType(party.toLowerCase());
  }
  if (childData.partyType.toLowerCase() != "transporter") {
    localStorage.removeItem("selectedTransporter");
  } else {
    localStorage.setItem("selectedTransporter", JSON.stringify(childData));
  }
};
const callbackFunctionDate = (date) => {
  setSelectedDate(date);
};
const [showCropModal, setShowCropModal] = useState(false);
const [showCropModalStatus, setShowCropModalStatus] = useState(false);
const addCropModal = () => {
  setShowCropModalStatus(true);
  setShowCropModal(true);
  console.log('step11 nnext')
  dispatch(selectSteps("step2"));
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
        {partnerData != null &&
        (partysType.toLowerCase() == "seller"
          ? partType.toLowerCase() == "transporter"
            ? true
            : true
          : false) ? (
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
        {showCropModalStatus ? (
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
        )}
      </div>
    </div>
    </div>
  );
};
export default Step11;
