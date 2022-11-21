import SelectPartner from "./selectParty";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import moment from "moment";
import Step2Modal from "./step2Modal";
const Step1 = () => {
  const [selectedDate, setStartDate] = useState(new Date());
  //   ($("#modal_checkbox").val());
  useEffect(() => {
    console.log("step1");
  }, []);
  const [partnerData, setPartnerData] = useState(null);
  const callbackFunction = (childData) => {
    console.log(childData, "child");
    setPartnerData(childData);
    if(childData.partyType != 'Transporter'){
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
  return (
    <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
          <div className="row">
            <div className="col-lg-4 p-0">
              <SelectPartner
                partyType="Seller"
                parentCallback={callbackFunction}
              />
            </div>
            <div className="col-lg-5 ">
              <div className="date_col d-flex align-items-center justify-content-between">
                <DatePicker
                  dateFormat="yyyy-MM-dd"
                  selected={selectedDate}
                  onChange={(date) => setStartDate(date)}
                  className="form-control"
                  placeholder="Date"
                  maxDate={new Date()}
                />
                <label className="custom-control custom-checkbox mb-0">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="modal_checkbox"
                    value="my-value"
                  />
                  <span className="custom-control-indicator"></span>
                  <span className="custom-control-description">
                    Set as a Default Date
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
        {partnerData == null ? (
          ""
        ) : (
          <div className="bottom_div main_div">
            <div className="d-flex align-items-center justify-content-end">
              <button className="primary_btn" onClick={addCropModal}>
                Next
              </button>
            </div>
          </div>
        )}
        {showCropModalStatus ? (
          <Step2Modal
            show={showCropModal}
            closeCropModal={() => setShowCropModal(false)}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
export default Step1;
