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
  const callbackFunction = (childData, party, type) => {};
  return (
    <div>
      <div className="main_div_padding">
      {multiSelectPartnersArray.length > 0 && (
          <div className="crop_table_multi">
            <div class="row head_row flex-row flex-nowrap">
              <div class="col-lg-2">Seller</div>
              <div class="col-lg-2">Transporter</div>
              <div class="col-lg-1">Date</div>
              <div class="col-lg-2">Crop</div>
              <div class="col-lg-1">Unit type</div>
              <div class="col-lg-1">Rate type</div>
              <div class="col-lg-1">Number of Units</div>
              <div class="col-lg-1">Total Weight</div>
              <div class="col-lg-1">individual weights</div>
              <div class="col-lg-1">Wastage</div>
              <div class="col-lg-2">Rate (₹)</div>
              <div class="col-lg-2">Total (₹)</div>
            </div>
            <div className="crop_table_view">
              <table>
                {multiSelectPartnersArray.map((item, index) => {
                  return (
                    <div class="row table_row_body table_crop_div flex-row flex-nowrap">
                      <div class="col-lg-2">
                        <div className="flex_class mr-0">
                          <img
                            src={multiSelectPartnersArray[index].profilePic}
                            className="flex_class mr-2"
                          />
                          <p className="m-0">
                            {multiSelectPartnersArray[index].partyName}
                          </p>
                        </div>
                      </div>
                      <div class="col-lg-2">
                        <SelectPartner partyType="Transporter" parentCallback={callbackFunction} />
                      </div>
                      <div class="col-lg-1">
                        <div className="d-flex align-items-center dateSelection">
                          <span className="date_icon m-0">
                            <img
                              src={date_icon}
                              alt="icon"
                              className="dateIcon"
                            />
                          </span>
                          <DatePicker
                            dateFormat="dd-MMM-yyyy"
                            selected={selectedDate}
                            onChange={(date) => onclickDate(date)}
                            className="form-control"
                            placeholder="Date"
                            maxDate={new Date()}
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                          />
                        </div>
                      </div>
                      <div class="col-lg-2">tomoto</div>
                      <div class="col-lg-1">BAGS</div>
                      <div class="col-lg-1">Per BAG</div>
                      <div class="col-lg-1">
                        {" "}
                        <input
                          type="text"
                          className="form-control"
                          name="quantity"
                        />
                      </div>
                      <div class="col-lg-1">2000</div>
                      <div class="col-lg-1">individual</div>
                      <div class="col-lg-1">-4</div>
                      <div class="col-lg-2">250000000</div>
                      <div class="col-lg-2">30,0000.00 + Add Crop</div>
                    </div>
                  );
                })}
              </table>
            </div>
          </div>
        )}

        {/* <table className="table-bordered">
          <tr className="">
            <td className="col-2 empty_col">hheyy jkkkkkkkkkkkkkkkk</td>
            <td className="col-2">
              It has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged.
            </td>
            <td className="col-1">
              {" "}
              Lorem Ipsum is simply dummy text of the printing and
            </td>
            <td className="col-1">
              {" "}
              Lorem Ipsum is simply dummy text of the printing and
            </td>
            <td className="col-1">
              {" "}
              Lorem Ipsum is simply dummy text of the printing and
            </td>
            <td className="col-1">
              {" "}
              Lorem Ipsum is simply dummy text of the printing and
            </td>
            <td className="col-1">link</td>
            <td className="col-1">jk</td>
            <td className="col-5">
              <div className="delete_copy_div d-flex justify-content-end">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged.
              </div>
            </td>
            <td className="col-1">
              {" "}
              Lorem Ipsum is simply dummy text of the printing and
            </td>
            <td className="col-2">lkkkk</td>
            <td className="col-1">nmm</td>
            <td className="col-1">lkkkkk</td>
            <td className="col-5">
              <div className="delete_copy_div d-flex justify-content-end">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged.
              </div>
            </td>
          </tr>
        </table> */}
         {/* <table className="table-bordered" width="100%">
    <tr>
      <td width="40%">Select transporter</td>
      <td>asdf</td>
      <td>asdfasdf</td>
      <td>adfasdf</td>
      <td>asdf</td>
      <td>asdfasdf</td>
      <td>adfasdf</td>
      <td>asdf</td>
      <td>asdfasdf</td>
      <td>adfasdf</td>
      <td>asdf</td>
      <td>asdfasdf</td>
      <td>adfasdf</td>
      <td>asdf</td>
      <td>asdfasdf</td>
      <td>adfasdf</td>
      <td>asdf</td>
      <td>asdfasdf</td>
      <td>adfasdf</td>
      <td>asdf</td>
      <td>asdfasdf</td>
      <td>adfasdf</td>
      <td>asdf</td>
      <td>asdfasdf</td>
      <td>adfasdf</td>
      <td>asdf</td>
      <td>asdfasdf</td>
    </tr>
    <tr>
      <td width="40%">adfasdf</td>
      <td>asdf</td>
      <td>asdfasdf</td>
      <td>adfasdf</td>
      <td>asdf</td>
      <td>asdfasdf</td>
      <td>adfasdf</td>
      <td>asdf</td>
      <td>asdfasdf</td>
      <td>adfasdf</td>
      <td>asdf</td>
      <td>asdfasdf</td>
      <td>adfasdf</td>
      <td>asdf</td>
      <td>asdfasdf</td>
      <td>adfasdf</td>
      <td>asdf</td>
      <td>asdfasdf</td>
      <td>adfasdf</td>
      <td>asdf</td>
      <td>asdfasdf</td>
      <td>adfasdf</td>
      <td>asdf</td>
      <td>asdfasdf</td>
      <td>adfasdf</td>
      <td>asdf</td>
      <td>asdfasdf</td>
    </tr>
  </table> */}
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
