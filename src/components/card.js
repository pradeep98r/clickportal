import React from "react";
import {getText} from "./getText";
const resetInput = (e) => {
  if(e.target.value == 0){
    e.target.value = "";
  }
}
const CommonCard = ({
  title,
  rateTitle,
  inputText,
  onChange,
  totalTitle,
  unitsTitle,
  inputValue,
  units,
  onChangeTotals
}) => (
  <div>
    {title == "Transportation" || "Labor Charges" || "Rent" ? (
      <div className="comm_cards">
        <div className="row">
          <div className="col-lg-3 col-sm-12 ps-0"></div>
          <div className="col-lg-3 col-sm-12 ps-0">
            <h5 className="comm_card_sub_title">{rateTitle}</h5>
          </div>
          <div className="col-lg-3 col-sm-12">
            <h5 className="comm_card_sub_title">{unitsTitle}</h5>
          </div>
          <div className="col-lg-3 col-sm-12">
            <h5 className="comm_card_sub_title">{totalTitle}</h5>
          </div>
        </div>
        <div className="card input_card">
          <div className="row">
            <div className="col-lg-3 col-sm-12 title_bg">
              <h5 className="comm_card_title mb-0">{getText(title)}</h5>
            </div>

            <div className="col-lg-3 col-sm-12 col_left_border">
              <input
                type="text"
                placeholder=""
                onChange={onChange}
                value={inputValue}
                onFocus={(e) => resetInput(e)}
              />
            </div>
            <div className="col-lg-3 col-sm-12 col_left_border">
              <input type="text" placeholder="" onChange={onChange} value={units}/>
            </div>
            <div className="col-lg-3 col-sm-12 col_left_border">
            <input
                type="text"
                placeholder=""
                onChange={onChangeTotals}
                value={inputText}
                onFocus={(e) => resetInput(e)}
              />
              {/* <p className="text-center">{inputText ? inputText : 0.0}</p> */}
            </div>
          </div>
        </div>
      </div>
    ) : (
      ""
      // <div className="comm_cards">
      //   <h5 className="comm_card_title">{title}</h5>
      //   <div className="row">
      //     <div className="col-lg-6 ps-0">
      //       <h5 className="comm_card_sub_title">{rateTitle}</h5>
      //     </div>
      //     <div className="col-lg-6">
      //       <h5 className="comm_card_sub_title">{totalTitle}</h5>
      //     </div>
      //   </div>
      //   <div className="card input_card">
      //     <div className="row">
      //       <div className="col-lg-6">
      //         <input type="text" placeholder="" onChange={onChange} />
      //       </div>
      //       <div className="col-lg-6 col_left_border">
      //         <p className="text-center">{inputText ? inputText : 0.0}</p>
      //       </div>
      //     </div>
      //   </div>
      // </div>
    )}
  </div>
);

export default CommonCard;
