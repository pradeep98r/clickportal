import React from "react";

const CommonCard = ({
  title,
  rateTitle,
  inputText,
  onChange,
  totalTitle,
  unitsTitle,
}) => (
  <div>
    {title == "Transportation" || "Labor Charges" || "Rent" ? (
      <div className="comm_cards">
        <h5 className="comm_card_title">{title}</h5>
        <div className="row">
          <div className="col-lg-4 ps-0">
            <h5 className="comm_card_sub_title">{rateTitle}</h5>
          </div>
          <div className="col-lg-4">
            <h5 className="comm_card_sub_title">{unitsTitle}</h5>
          </div>
          <div className="col-lg-4">
            <h5 className="comm_card_sub_title">{totalTitle}</h5>
          </div>
        </div>
        <div className="card input_card">
          <div className="row">
            <div className="col-lg-4">
              <input type="text" placeholder="" onChange={onChange} />
            </div>
            <div className="col-lg-4 col_left_border">
              <input type="text" placeholder="" onChange={onChange} />
            </div>
            <div className="col-lg-4 col_left_border">
              <p className="text-center">{inputText ? inputText : 0.0}</p>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="comm_cards">
        <h5 className="comm_card_title">{title}</h5>
        <div className="row">
          <div className="col-lg-6 ps-0">
            <h5 className="comm_card_sub_title">{rateTitle}</h5>
          </div>
          <div className="col-lg-6">
            <h5 className="comm_card_sub_title">{totalTitle}</h5>
          </div>
        </div>
        <div className="card input_card">
          <div className="row">
            <div className="col-lg-6">
              <input type="text" placeholder="" onChange={onChange} />
            </div>
            <div className="col-lg-6 col_left_border">
              <p className="text-center">{inputText ? inputText : 0.0}</p>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default CommonCard;
