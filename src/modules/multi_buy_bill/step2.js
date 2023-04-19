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
const Step2 = (props) => {
  const dispatch = useDispatch();
  const selectedStep = useSelector((state) => state.multiStepsInfo);
  const multiSelectPartnersArray = selectedStep?.multiSelectPartners;
  const [selectedDate, setStartDate] = useState(new Date());
  console.log(multiSelectPartnersArray);
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
            {multiSelectPartnersArray.map((item, index) => {
              return (
                <tr>
                  <td className="col_2">
                    Select transporter Select transporter
                  </td>
                  <td className="col_2">asdf</td>
                  <td className="col_1">asdfasdf</td>
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
