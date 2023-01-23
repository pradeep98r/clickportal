

import { useState, useEffect } from "react";
import SelectPartner from "../buy_bill_book/selectParty";
import BillDateSelection from "../buy_bill_book/billDateSelection";
import Step2Modal from "../buy_bill_book/step2Modal";
const SellebillStep1 = () => {
  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);

  useEffect(() => {
    localStorage.setItem('selectBuyertype',null);
  }, []);
  const [partnerData, setPartnerData] = useState(null);
  const [partType, separtType]= useState('');
  const [partysType, setpartysType]= useState('');
  const [selectedBuyerSellerData, setSelectedBuyerSellerData] = useState({})
  const callbackFunction = (childData,party,type) => {
    setPartnerData(childData);
    console.log(childData,party,type,"data")
    separtType(type.toLowerCase());
    setSelectedBuyerSellerData(childData)
    if(party != null){
      setpartysType(party.toLowerCase())
    }
    if(childData.partyType.toLowerCase() != 'transporter'){
        localStorage.removeItem("selectedTransporter");
      }
      else{
        console.log('transsell',childData)
        localStorage.setItem("selectedTransporter", JSON.stringify(childData));
      }
  };
  const [showCropModal, setShowCropModal] = useState(false);
  const [showCropModalStatus, setShowCropModalStatus] = useState(false);
  const addCropModal = () => {
    setShowCropModalStatus(true);
    setShowCropModal(true);
  };
 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const callbackFunctionDate = (date) => {
    setSelectedDate(date);
  };
  return (
    <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
          <div className="row">
            <div className="col-lg-4 p-0">
              <SelectPartner
                partyType="Buyer"
                parentCallback={callbackFunction}
              />
            </div>
            <div className="col-lg-5 ">
              <BillDateSelection parentCallbackDate={callbackFunctionDate} />
            </div>
            <div className="col-lg-3 p-0">
              <SelectPartner partyType="Transporter"  
              parentCallback={callbackFunction}/>
            </div>
          </div>
        </div>
      </div>
      <div>
      {partnerData != null &&
         ((partysType.toLowerCase() == 'buyer')?(partType.toLowerCase() == 'transporter' ? true : true) : false) ? (
           <div className="bottom_div main_div">
           <div className="d-flex align-items-center justify-content-end">
             <button className="primary_btn" onClick={addCropModal}>
               {langFullData.next}
             </button>
           </div>
         </div>
        ) : (
        ''
        )}
        {showCropModalStatus ? (
          <Step2Modal
            showCrop={showCropModal}
            closeCropModal={() => setShowCropModal(false)}
            cropTableEditStatus={false}
            billEditStatus={false}
            selectedBilldate={selectedDate}
            selectedPartyType = 'buyer'
            selectedBuyerSellerData={selectedBuyerSellerData}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
export default SellebillStep1;
