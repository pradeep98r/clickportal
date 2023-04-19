import { useDispatch, useSelector } from "react-redux";
import {
  multiSelectPartners,
  multiStepsVal,
} from "../../reducers/multiBillSteps";
import BillDateSelection from "../buy_bill_book/billDateSelection";
import SelectPartner from "../buy_bill_book/selectParty";
import DatePicker from "react-datepicker";
import "../multi_buy_bill/step2.scss";
import "react-datepicker/dist/react-datepicker.css";
import date_icon from "../../assets/images/date_icon.svg";
import { useState } from "react";
import DateSelection from "./dateSelection";
import { getPartnerType, getText } from "../../components/getText";
import { getMaskedMobileNumber } from "../../components/getCurrencyNumber";
import single_bill from "../../assets/images/bills/single_bill.svg";
import "../multi_buy_bill/step1.scss";
import SelectSinglePartner from "./selectSinglePartner";
import down_arrow from "../../assets/images/down_arrow.svg"
const Step2 = (props) => {
  const dispatch = useDispatch();
  const selectedStep = useSelector((state) => state.multiStepsInfo);
  const multiSelectPartnersArray = selectedStep?.multiSelectPartners;
  const [selectedDate, setStartDate] = useState(new Date());
  const allTransporters = selectedStep?.selectedTransporter;
  const allDates = selectedStep?.selectedDates;
  console.log(allDates, "trans")
  const cancelStep = () => {
    dispatch(multiSelectPartners([]));
    props.closeModal();
  };
  const onClickStep2 = () => {
    dispatch(multiStepsVal("step2"));
  };
  const previousStep = () => {
    dispatch(multiStepsVal("step1"));
  };
  const onclickDate = (date) => {
    setStartDate(date);
  };

  const [active, setActive] = useState(false);
  const [activeTrans, setActiveTrans] = useState(false)
  const activateSelect = () => {
    setActive(true);
  }
  const activeTransporter = () => {
    setActiveTrans(true);
  }
  console.log(multiSelectPartnersArray, "array")
  return (
    <div>
      <div className="main_div_padding">
        {multiSelectPartnersArray.length > 0 && (
          <table className="table-bordered step2_table">
            <tr>
              <th className="col_2">Seller</th>
              <th className="col_2">Transporter</th>
              <th className="col_1">Date</th>
              <th className="col_2">Crop</th>
              <th className="col_1">Unit type</th>
              <th className="col_1">Rate type</th>
              <th className="col_1">Number of Units</th>
              <th className="col_1">Total Weight</th>
              <th className="col_1">individual weights</th>
              <th className="col_1">Wastage</th>
              <th className="col_1">Rate (₹)</th>
              <th className="col_3">Total (₹)</th>
            </tr>
            <div
              className="selectedPartner_scroll"
              id="scroll_style"
            >
              {multiSelectPartnersArray.map((item, index) => {
                return (
                  <tr>
                    <td className="col_2">
                      <div
                        id="scroll_style" onClick={activateSelect}>
                        {active ? <SelectSinglePartner indexVal={index} /> :

                          <div
                            style={{ display: "flex", alignItems: "center" }}
                            className="justify-content-between"
                          >
                            <div className="d-flex">
                              {item.profilePic !== "" ? (
                                <img
                                  src={item.profilePic}
                                  className="icon_user"
                                />
                              ) : (
                                <img src={single_bill} className="icon_user" />
                              )}
                              <div style={{ marginLeft: 5, alignItems: 'center' }}>
                                <div className="d-flex user_name">
                                  <h5 className="party_name">
                                    {getText(item.partyName)}
                                  </h5>
                                  <img src={down_arrow} alt="down_arrow" style={{ padding: "0px 10px" }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                    </td>
                    <td className="col_2">
                      {activeTrans ? <SelectSinglePartner indexVal={index} fromTrans={true} /> :
                        <div className="d-flex">
                          <p onClick={activeTransporter}>Select transporter</p>
                          <img src={down_arrow} alt="down_arrow" style={{ padding: "0px 10px" }} />
                        </div>
                      }
                    </td>
                    <td className="col_1"><DateSelection indexVal={index} /></td>
                    <td className="col_2">adfasdf</td>
                    <td className="col_1">asdf</td>
                    <td className="col_1">asdfasdf</td>
                    <td className="col_1">adfasdf</td>
                    <td className="col_1">asdf</td>
                    <td className="col_1">asdfasdf</td>
                    <td className="col_1">adfasdf</td>
                    <td className="col_1">asdf</td>
                    <td className="col_3">asdfasdf</td>
                  </tr>
                );
              })}
            </div>
          </table>
        )}
      </div>
      <div className="bottom_div">
        <div className="d-flex align-items-center justify-content-between">
          <button className="secondary_btn" onClick={cancelStep}>
            cancel
          </button>
          <div className="d-flex align-items-center">
            <button
              className="secondary_btn no_delete_btn"
              onClick={() => previousStep()}
            >
              Previous
            </button>
            <button className="primary_btn" onClick={() => onClickStep2()}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Step2;
