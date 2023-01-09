import SelectPartner from "./selectParty";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import BillDateSelection from "./billDateSelection";
import Step2Modal from "./step2Modal";
import { useSelector } from "react-redux";
const Step1 = () => {
  const users  = useSelector(state => state.buyerInfo);
  console.log(users,"allusers")
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
    setPartnerData(users.buyerInfo);
    setSelectedBuyerSellerData(users.buyerInfo)
    separtType(type.toLowerCase());
    if (users.buyerInfo.itemType != null) {
      setpartysType(users.buyerInfo.itemType.toLowerCase());
    }
    if (users.buyerInfo.partyType.toLowerCase() != "transporter") {
      localStorage.removeItem("selectedTransporter");
    } else {
      localStorage.setItem("selectedTransporter", JSON.stringify(users.buyerInfo));
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
  };
  const [onClickPage, setonClickPage] = useState(false);
  document.body.addEventListener("click", function (evt) {
    setonClickPage(true);
  });

  return (
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
          <div className="bottom_div main_div">
            <div className="d-flex align-items-center justify-content-end">
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
  );
};
export default Step1;
