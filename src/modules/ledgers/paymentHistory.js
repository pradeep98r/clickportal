import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import clo from "../../assets/images/close.svg";
import { useSelector } from "react-redux";
import "../ledgers/paymentHistory.scss";
import { getMaskedMobileNumber } from "../../components/getCurrencyNumber";
import PaymentHistoryCard from "../../components/paymentHistoryCard";
import cancel from "../../assets/images/cancel.svg";
import edit from "../../assets/images/edit_round.svg";
const PaymentHistoryView = (props) => {
  var paymentViewData = useSelector((state) => state.paymentViewInfo);
  const [paymentHistoryData, setPaymentHistoryData] = useState(
    paymentViewData.paymentViewInfo
  );

  var discountedAmount = 0;
  var discountPercentage = 0;
  var amount = paymentViewData?.paymentViewInfo?.amount;
  var discount = paymentViewData?.paymentViewInfo?.discount;
  discount = Math.abs(discount);
  if (discount > 0) {
    amount = amount + discount;
    discountedAmount = amount - discount;
    discountPercentage = ((discount / amount) * 100).toPrecision(2);
  }
  useEffect(() => {
    setPaymentHistoryData(paymentViewData.paymentViewInfo);
  }, [props.showPaymentViewModal]);
  return (
    <Modal
      show={props.showPaymentViewModal}
      close={props.closePaymentViewModal}
      className="cropmodal_poopup steps_modal billView_modal right"
    >
      <div className="modal-header date_modal_header smartboard_modal_header">
        <h5
          className="modal-title d-flex align-items-center header2_text"
          id="staticBackdropLabel"
        >
          Payment Ledger | {paymentHistoryData.refId}
        </h5>
        <button
          onClick={(e) => {
            props.closePaymentViewModal();
          }}
        >
          <img alt="image" src={clo} className="cloose" />
        </button>
      </div>
      <div className="modal-body py-0">
        <div className="row payment_view_row">
          <div className="col-lg-10 col_left bill_col bill_col_border">
            <div className="payment_view_card">
              <div className="partyDetails">
                <div className="row justify-content-between align-items-center">
                  <div className="col-lg-4 p-0">
                    <div className="d-flex align-items-center">
                      <img
                        src={paymentHistoryData.profilePic}
                        className="payment_profilepic"
                      />
                      <div>
                        <h6>{paymentHistoryData.partyName}</h6>
                        <p>
                          {getMaskedMobileNumber(paymentHistoryData.mobile)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 p-0"></div>
                  <div className="col-lg-3 p-0">
                    <h6>Date</h6>
                    <h5>{paymentHistoryData.date}</h5>
                  </div>
                </div>
              </div>
              {paymentHistoryData.billIds.length > 0 && (
                <div className="partyDetails">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6>Selected Bills</h6>
                      {paymentHistoryData.billIds.map((item, index) => {
                        return <h5>{item + ","}</h5>;
                      })}
                    </div>
                  </div>
                </div>
              )}
              <PaymentHistoryCard
                title1="Amount"
                title2="Payment Mode"
                title3="Status"
                title1Data={amount}
                title2Data={paymentHistoryData.paymentMode}
                title3Data="-"
              />
              {discount > 0 ? (
                <PaymentHistoryCard
                  title1="Discount(%)"
                  title2="Discount(Rs)"
                  title3="Received Amount"
                  title1Data={discountPercentage}
                  title2Data={discount}
                  title3Data={discountedAmount}
                />
              ) : (
                ""
              )}
              <div className="partyDetails comment_details">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6>Comment</h6>
                    <h5>{paymentHistoryData.comments}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-2 p-0 ">
            <div className="bill_col pr-0">
            {paymentHistoryData.comments == 'FROM BILL' ? '' : <div>
            <p className="more-p-tag">Actions</p>
              <div>
                <div className="action_icons">
                  {paymentHistoryData.billPaid ? (
                    ""
                  ) : (
                    <div className="items_div">
                      <button>
                        <img src={edit} alt="img" className="" />
                      </button>
                      <p>Edit</p>
                    </div>
                  )}
                  <div className="items_div">
                    <button>
                      <img src={cancel} alt="img" className="" />
                    </button>
                    <p>Delete</p>
                  </div>
                </div>
              </div>
            </div> }
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default PaymentHistoryView;
