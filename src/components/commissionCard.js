import React from "react";
const resetInput = (e) => {
  if(e.target.value == 0){
    e.target.value = "";
  }
}
const CommissionCard = ({
  title,
  rateTitle,
  inputText,
  onChange,
  totalTitle,
  inputValue,
  totalOnChange,
}) => (
  <div>
    <div className="comm_cards">
      <div className="row">
        <div className="col-lg-3 col-sm-12 ps-0"></div>
        <div className="col-lg-5 col-sm-12 ps-0">
          <h5 className="comm_card_sub_title">{rateTitle}</h5>
        </div>
        <div className="col-lg-4 col-sm-12">
          <h5 className="comm_card_sub_title">{totalTitle}</h5>
        </div>
      </div>
      <div className="card input_card">
        <div className="row">
          <div className="col-lg-3 col-sm-12 d-flex align-items-center title_bg">
            <h5 className="comm_card_title mb-0">{title}</h5>
          </div>
          <div className="col-lg-5 col-sm-12 col_left_border">
            <input
              type="text"
              placeholder=""
              onChange={onChange}
              onFocus={(e) => resetInput(e)}
              value={inputValue}
            />
          </div>
          <div className="col-lg-4 col-sm-12 col_left_border">
            <input
              type="text"
              placeholder=""
              onChange={totalOnChange}
              onFocus={(e) => resetInput(e)}
              value={inputText}
            />
            {/* <p className="text-center">{inputText ? inputText : 0.0}</p> */}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CommissionCard;
