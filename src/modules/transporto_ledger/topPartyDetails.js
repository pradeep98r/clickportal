import React, { useState } from "react";
import { getMaskedMobileNumber } from "../../components/getCurrencyNumber";
import DatePicker from "react-datepicker";
import single_bill from "../../assets/images/bills/single_bill.svg";
import date_icon from "../../assets/images/date_icon.svg";
import { useSelector } from "react-redux";
const TopPartyDetails = (props) => {
  const transpoData = useSelector((state) => state.transpoInfo);
  const ledgerData = transpoData?.singleTransporterObject;
  const [selectDate, setSelectDate] = useState(new Date());
  return (
    <div>
      <div className="d-flex justify-content-between card">
        <div
          className="d-flex justify-content-between card-body"
          id="details-tag"
        >
          <div className="profile-details" key={ledgerData?.partyId}>
            <div className="d-flex">
              <div>
                {ledgerData?.profilePic ? (
                  <img
                    id="singles-img"
                    src={ledgerData.profilePic}
                    alt="buy-img"
                  />
                ) : (
                  <img id="singles-img" src={single_bill} alt="img" />
                )}
              </div>
              <div id="trans-dtl">
                <p className="namedtl-tag">{ledgerData?.partyName}</p>
                <p className="mobilee-tag">
                  {!ledgerData?.trader
                    ? props.partyType == "BUYER"
                      ? "Buyer"
                      : props.type == "TRANS"
                      ? "Transporter"
                      : "Seller"
                    : "Trader"}{" "}
                  - {ledgerData?.partyId}&nbsp;|&nbsp;
                  {getMaskedMobileNumber(ledgerData?.mobile)}
                </p>
                <p className="addres-tag">
                  {ledgerData?.partyAddress ? ledgerData?.partyAddress : ""}
                </p>
              </div>
            </div>
          </div>
          <div className="d-flex card-text" id="date-tag">
            <img className="date_icon_in_modal" src={date_icon} />
            <div className="d-flex date_popper">
              <DatePicker
                selected={selectDate}
                onChange={(date) => {
                  setSelectDate(date);
                }}
                dateFormat="dd-MMM-yy"
                maxDate={new Date()}
                placeholder="Date"
              ></DatePicker>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TopPartyDetails;
