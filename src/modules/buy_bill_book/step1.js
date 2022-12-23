import SelectPartner from "./selectParty";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import moment from "moment";
import Step2Modal from "./step2Modal";
const Step1 = () => {
  const [selectedDate, setStartDate] = useState(new Date());
  //   ($("#modal_checkbox").val());

  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);

  useEffect(() => {
    localStorage.setItem('selectPartytype',null);
  }, []);
  const [partnerData, setPartnerData] = useState(null);
  const [partType, separtType]= useState('');
  const [partysType, setpartysType]= useState('');
  const callbackFunction = (childData,party,type) => {
    setPartnerData(childData);
    separtType(type.toLowerCase());
    if(party != null){
      setpartysType(party.toLowerCase())
    }
    if(childData.partyType.toLowerCase() != 'transporter'){
      localStorage.removeItem("selectedTransporter");
    }
    else{
      localStorage.setItem("selectedTransporter", JSON.stringify(childData));
    }
  };
  const [showCropModal, setShowCropModal] = useState(false);
  const [showCropModalStatus, setShowCropModalStatus] = useState(false);
  const addCropModal = () => {
    setShowCropModalStatus(true);
    setShowCropModal(true);
  };
  const [checked, setChecked] = useState(localStorage.getItem("defaultDate"));
  const handleCheckEvent = () =>{
    if(!checked){
      setChecked(!checked)
      localStorage.setItem("defaultDate",true);
      setStartDate(selectedDate);
    } else{
      setChecked(!checked);
      localStorage.removeItem("defaultDate");
      setStartDate(new Date());
    }
  }
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
              <div className="date_col d-flex align-items-center justify-content-between">
                <DatePicker
                  dateFormat="dd-MMM-yyyy"
                  selected={selectedDate}
                  onChange={(date) => setStartDate(date)}
                  className="form-control"
                  placeholder="Date"
                  maxDate={new Date()}
                />
                <label className="custom-control custom-checkbox mb-0">
                  <input
                    type="checkbox"
                    checked={checked && localStorage.getItem("defaultDate")}
                    className="custom-control-input"
                    id="modal_checkbox"
                    value="my-value"
                    onChange={handleCheckEvent}
                  />
                  <span className="custom-control-indicator"></span>
                  <span className="custom-control-description">
                    {langFullData.setAsADefault}{langFullData.date}
                  </span>
                </label>
              </div>
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
         ((partysType.toLowerCase() == 'seller')?(partType.toLowerCase() == 'transporter' ? true : true) : false) ? (
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
            cropTableEditStatus = {false}
            billEditStatus={false}
            selectedBilldate = {selectedDate}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
export default Step1;
