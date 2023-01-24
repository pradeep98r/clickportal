import React, { useEffect, useState } from "react";

import ono_connect_click from "../../assets/images/ono-click-connect.svg";
import single_bill from "../../assets/images/bills/single_bill.svg";
import moment from "moment/moment";
import edit from "../../assets/images/edit_round.svg";
import { useNavigate } from "react-router-dom";
import Step3Modal from "./step3Model";
import { editbuybillApi } from "../../actions/billCreationService";
import { ToastContainer, toast } from "react-toastify";
import cancel from "../../assets/images/cancel.svg";
import close from "../../assets/images/close.svg";
import $ from "jquery";
import cancel_bill_stamp from "../../assets/images/cancel_stamp.svg";

import BusinessDetails from "./business_details";
import CropDetails from "./crop_details";
import BillViewFooter from "./billViewFooter";
import GroupTotals from "./groupTotals";
import { useSelector } from "react-redux";
import SellbillStep3Modal from "../sell_bill_book/step3";
import { qtyValues } from "../../components/qtyValues";
import {
  getCurrencyNumberWithOneDigit,
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
} from "../../components/getCurrencyNumber";
import { selectSteps } from "../../reducers/stepsSlice";
import { useDispatch } from "react-redux";
import Steps from "./steps";
import { selectBill,editStatus, billDate, tableEditStatus,billViewStatus,selectedParty,cropEditStatus } from "../../reducers/billEditItemSlice";

const BillView = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  var  billViewData = useSelector((state)=> state.billViewInfo);
  const [billData, setBillViewData] = useState(billViewData.billViewInfo); 
  //var billViews = billData;
  const [displayCancel, setDisplayCancel] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    cancelBillStatus();
    dispatch(billViewStatus(true))
  }, [clickId]);

  useEffect(()=>{
    setBillViewData(JSON.parse(localStorage.getItem("billData")));
  },[])

  const cancelBillStatus = () => {
    if (billData?.billStatus === "CANCELLED") {
      setDisplayCancel(true);
    } else {
      setDisplayCancel(displayCancel);
    }
  };
 

  const [showStep3Modal, setShowStep3Modal] = useState(false);
  const [showStep3ModalStatus, setShowStep3ModalStatus] = useState(false);
  const [slectedCropArray, setSlectedCropArray] = useState([]);
  const [editCancelStatus, setEditCancelStatus] = useState(false);
  const dispatch = useDispatch();
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [showStepsModalStatus, setShowStepsModalStatus] = useState(false);

  const editBill = (itemVal) => {
    var arr = [];
    arr.push(itemVal);
    setSlectedCropArray(arr);
    dispatch(selectSteps("step3"));
    setShowStepsModalStatus(true);
    setShowStepsModal(true);
    dispatch(selectBill(arr[0]))
    dispatch(editStatus(true))
    dispatch(tableEditStatus(false))
    dispatch(billDate(new Date(billData.billDate)));
    dispatch(selectedParty(billData?.partyType == 'FARMER' ? 'SELLER' : billData?.partyType));
    dispatch(cropEditStatus(false));
    setEditCancelStatus(true);
  };
  const cancelBill = (itemVal) => {
    $("#cancelBill").modal("hide");
    setDisplayCancel(!displayCancel);
    cancelbillApiCall();
  };
  const editBillRequestObj = {
    action: "CANCEL",
    billAttributes: {
      actualPayRecieevable:billData?.partyType.toUpperCase()==='FARMER'?
       billData?.actualPaybles:billData?.actualReceivable,
      advance: billData?.advance,
      billDate: billData?.billDate,
      cashPaid: billData?.partyType.toUpperCase()==='FARMER'?
                billData?.cashPaid:0,
      cashRcvd:billData?.partyType.toUpperCase()==='BUYER'?billData?.cashRcvd:0,
      comm: billData?.comm,
      commIncluded: billData?.commIncluded,
      comments: billData?.comments,
      govtLevies: billData?.govtLevies,
      grossTotal: billData?.grossTotal,
      labourCharges: billData?.labourCharges,
      less: billData?.less,
      mandiFee: billData?.mandiData,
      misc:billData?.partyType.toUpperCase()==='FARMER'? billData?.otherFee:
          billData?.misc,
      otherFee:billData?.partyType.toUpperCase()==='FARMER'?
         billData?.misc:billData?.otherFee,

      outStBal:billData?.outStBal,
      paidTo: 0,
      partyId:billData?.partyType.toUpperCase()==='FARMMER'?
            billData?.buyerId:billData?.farmerId,
      rent: billData?.rent,
      rtComm: billData?.rtComm,
      rtCommIncluded: billData?.rtCommIncluded,
      totalPayRecieevable: billData?.totalPayables,
      transportation: billData?.transportation,
      transporterId: billData?.transporterId,
    },
    billId: billData?.billId,
    billType:billData?.partyType.toUpperCase()==='FARMER'? "BUY":'SELL',
    caBSeq: billData?.caBSeq,
    caId: clickId,
    lineItems: billData?.lineItems,
    updatedBy: 0,
    updatedOn: "",
    writerId: 0,
  };

  const cancelbillApiCall = () => {
    editbuybillApi(editBillRequestObj).then(
      (response) => {
        if (response.data.status.type === "SUCCESS") {
          toast.success(response.data.status.message, {
            toastId: "success1",
          });
          localStorage.setItem("billViewStatus", false);
          if(billData?.partyType.toUpperCase() ==='FARMER'){
            navigate("/buy_bill_book");
          }else{
            navigate("/sellbillbook");
          }
        }
      },
      (error) => {
        toast.error(error.response.data.status.description, {
          toastId: "error1",
        });
      }
    );
  };

  const handleCheckEvent = () => {
    $("#cancelBill").modal("show");
  };
  const closePopup = () => {
    $("#cancelBill").modal("hide");
  };
  return (
    <div className="main_div_padding">
      <div className="container-fluid px-0">
        <div className="row">
          <div className="col-lg-7 col_left">
            <div className="bill_view_card buy_bills_view" id="scroll_style">
              <BusinessDetails />
              <div className="bill_crop_details">
                <CropDetails />
                <div className="row">
                  <div className="col-lg-8"></div>
                  <div className="col-lg-4 stamp_img">
                    {displayCancel && (
                      <img src={cancel_bill_stamp} alt="stammp_img" />
                    )}
                  </div>
                </div>
                <GroupTotals />
                <BillViewFooter />

              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="row more-inf-tag">
              <div className="more-info">
                <p class-className="more-p-tag">More Info</p>
              </div>
              <div className="hr-line"></div>
              <div className="d-flex buy-dtl">
                <div className="col-lg-6">
                  <div className="d-flex">
                    <div className="buyer-image">
                      {billData?.farmerProfilePic ? (
                        <img
                          src={billData?.farmerProfilePic}
                          alt="buyerimage"
                          className="buyer_img"
                        />
                      ) : (
                        <img
                          src={single_bill}
                          alt="buyerimage"
                          className="buyer_img"
                        />
                      )}
                    </div>
                    <div className="buy-details">
                      <p className="b-cr-by">Bill Created By</p>
                      <p className="b-name">{billData?.partyType.toUpperCase() ==='FARMER'?
                      billData.farmerName:billData?.buyerName}</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  {/* <div className="date-and-time"> */}
                  <p className="d-a-time">Date And Time</p>
                  <p className="d-a-value">
                    {moment(billData?.timeStamp).format(
                      "DD-MMM-YY | hh:mm:ss:A"
                    )}
                  </p>
                  {/* </div> */}
                </div>
              </div>
              <div className="hr-line"></div>
              <div className="more-info">
                <p class-className="more-p-tag">Actions</p>
              </div>
              <div className="hr-line"></div>
              {billData?.billStatus == "CANCELLED" ? (
                ""
              ) : (
                <div>
                  <div className="d-flex more-info action_icons">
                    <div className="items_div">
                      <img
                        src={cancel}
                        alt="img"
                        className=""
                        onClick={()=>handleCheckEvent}
                      />
                      <p>Cancel</p>
                    </div>
                    <div className="items_div">
                      <img
                        src={edit}
                        alt="img"
                        onClick={() => editBill(billData)}
                      />
                      <p>Edit</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {billData?.partyType.toUpperCase() ==='FARMER'?
          showStep3ModalStatus ? (
          <Step3Modal
            showstep3={showStep3Modal}
            closeStep3Modal={() => setShowStep3Modal(false)}
            slectedCropsArray={slectedCropArray}
            billEditStatus={true}
            step2CropEditStatus={false}
            editCancelStatus={editCancelStatus}
            dateSelected={new Date(billData.billDate)}
          />
        ) : (
          ""
        ):
        showStep3ModalStatus ? (
          <SellbillStep3Modal
          show={showStep3Modal}
          closeStep3Modal={() => setShowStep3Modal(false)}
          slectedSellCropsArray={slectedCropArray}
          billEditStatus={true}
          step2CropEditStatus={false}
          sellBilldateSelected = {new Date(billData.billDate)}
          selectedBillData={slectedCropArray}
        />
          ):('')}
      </div>
      {showStepsModalStatus ? (
        <Steps showStepsModal={showStepsModal} closeStepsModal={() => setShowStepsModal(false)} />
      ) : (
        ""
      )}
      <div className="modal fade" id="cancelBill">
        <div className="modal-dialog cancelBill_modal_popup">
          <div className="modal-content">
            <div className="modal-header date_modal_header smartboard_modal_header">
              <h5 className="modal-title header2_text" id="staticBackdropLabel">
                Cancel Bill
              </h5>
              <img
                src={close}
                alt="image"
                className="close_icon"
                onClick={closePopup}
              />
            </div>
            <div className="modal-body">
              <div className=" row terms_popup ">
                <div className="col-lg-3"></div>
                <div className="col-lg-7">
                  <div className="cancel_img">
                    <img src={cancel} alt="img" className="" />
                  </div>
                  <div className="cancel_bill">
                    <p className="cancel_billp">
                      Are you sure you want to cancel the bill
                    </p>
                  </div>
                  <div className="col-lg-2"></div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-1"></div>
                <div className="col-lg-10">
                  <p className="desc-tag">
                    Please note that cancellation of bill result in ledger
                    adjustments (rol back) and you will see an adjustment record
                    in ledger for the same bill
                  </p>
                </div>
                <div className="col-lg-1"></div>
              </div>
            </div>
            <div className="modal-footer p-2">
              <div className="d-flex">
                <button
                  type="button"
                  className="secondary_btn mr-2"
                  onClick={closePopup}
                  data-bs-dismiss="modal"
                >
                  NO
                </button>
                <button
                  type="button"
                  className="primary_btn"
                  onClick={() => cancelBill(billData)}
                  data-bs-dismiss="modal"
                >
                  YES
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BillView;