import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import edit from "../../assets/images/edit_round.svg";
import { useNavigate } from "react-router-dom";
import { editbuybillApi } from "../../actions/billCreationService";
import { ToastContainer, toast } from "react-toastify";
import cancel from "../../assets/images/cancel.svg";
import close from "../../assets/images/close.svg";
import $ from "jquery";
import cancel_bill_stamp from "../../assets/images/cancel_stamp.svg";
import prev_icon from "../../assets/images/prev_icon.svg";
import next_icon from "../../assets/images/next_icon.svg";
import BusinessDetails from "./business_details";
import CropDetails from "./crop_details";
import BillViewFooter from "./billViewFooter";
import GroupTotals from "./groupTotals";
import { useSelector } from "react-redux";
import clo from "../../assets/images/close.svg";
import { selectSteps } from "../../reducers/stepsSlice";
import { useDispatch } from "react-redux";
import Steps from "./steps";
import {
  selectBill,
  editStatus,
  billDate,
  tableEditStatus,
  billViewStatus,
  selectedParty,
  cropEditStatus,
} from "../../reducers/billEditItemSlice";
import { billViewInfo } from "../../reducers/billViewSlice";
import { getText } from "../../components/getText";
const BillView = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  var billViewData = useSelector((state) => state.billViewInfo);
  const [billData, setBillViewData] = useState(billViewData.billViewInfo);
  var allBillsArray = props.allBillsData;
  const navigate = useNavigate();
  const [displayCancel,setDisplayCancel] = useState(false);
  useEffect(() => {
    dispatch(billViewStatus(true));
    setBillViewData(billViewData.billViewInfo);
    console.log(billViewData.billViewInfo)
    if(billData?.billStatus == 'COMPLETED'){
      setDisplayCancel(false);
    }
    else{
      setDisplayCancel(true);
    }
  }, [props.showBillViewModal]);

  const dispatch = useDispatch();
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [showStepsModalStatus, setShowStepsModalStatus] = useState(false);

  const editBill = (itemVal) => {
    var arr = [];
    arr.push(itemVal);
    $(".billView_modal").hide();
    $(".modal-backdrop").remove();
    dispatch(selectSteps("step3"));
    setShowStepsModalStatus(true);
    setShowStepsModal(true);
    dispatch(selectBill(arr[0]));
    dispatch(editStatus(true));
    dispatch(tableEditStatus(false));
    dispatch(billDate(new Date(billData.billDate)));
    dispatch(
      selectedParty(
        billData?.partyType == "FARMER" ? "SELLER" : billData?.partyType
      )
    );

    dispatch(cropEditStatus(false));
  };
  const cancelBill = (itemVal) => {
    $("#cancelBill").modal("hide");
    cancelbillApiCall();
  };
  const editBillRequestObj = {
    action: "CANCEL",
    billAttributes: {
      actualPayRecieevable:
        billData?.partyType.toUpperCase() === "FARMER"
          ? billData?.actualPaybles
          : billData?.actualReceivable,
      advance: billData?.advance,
      billDate: billData?.billDate,
      cashPaid:
        billData?.partyType.toUpperCase() === "FARMER" ? billData?.cashPaid : 0,
      cashRcvd:
        billData?.partyType.toUpperCase() === "BUYER" ? billData?.cashRcvd : 0,
      comm: billData?.comm,
      commIncluded: billData?.commIncluded,
      comments: billData?.comments,
      govtLevies: billData?.govtLevies,
      grossTotal: billData?.grossTotal,
      labourCharges: billData?.labourCharges,
      less: billData?.less,
      mandiFee: billData?.mandiData,
      misc:
        billData?.partyType.toUpperCase() === "FARMER"
          ? billData?.otherFee
          : billData?.misc,
      otherFee:
        billData?.partyType.toUpperCase() === "FARMER"
          ? billData?.misc
          : billData?.otherFee,

      outStBal: billData?.outStBal,
      paidTo: 0,
      partyId:
        billData?.partyType.toUpperCase() === "FARMMER"
          ? billData?.buyerId
          : billData?.farmerId,
      rent: billData?.rent,
      rtComm: billData?.rtComm,
      rtCommIncluded: billData?.rtCommIncluded,
      totalPayRecieevable: billData?.totalPayables,
      transportation: billData?.transportation,
      transporterId: billData?.transporterId,
    },
    billId: billData?.billId,
    billType: billData?.partyType.toUpperCase() === "FARMER" ? "BUY" : "SELL",
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
          if (billData?.partyType.toUpperCase() === "FARMER") {
            setDisplayCancel(true)
            window.setTimeout(function () {
              // props.closeBillViewModal();
              navigate("/buy_bill_book");
              window.location.reload();
            }, 2000);
          } else {
            window.setTimeout(function () {
              props.closeBillViewModal();
              navigate("/sellbillbook");
              window.location.reload();
            }, 2000);
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
  let isPopupOpen = false;
  const handleCheckEvent = () => {
    if (!isPopupOpen) { // check if popup is already open
      isPopupOpen = true; // set flag to true
      $("#cancelBill").modal("show"); // show popup
      setTimeout(() => { // reset flag after a short delay
        isPopupOpen = false;
      }, 1000); // adjust delay time as needed 
    }
    // $("#cancelBill").modal("show");
  };
  const closePopup = () => {
    $("#cancelBill").modal("hide");
  };
  const [prevNextStatus, setPrevNextStatus] = useState(false);
  const [prevNextDisable, setPrevNextDisable] = useState(false);
  const previousBill = (id) => {
    var index1 = allBillsArray.findIndex((obj) => obj.index == id);
    if (index1 != -1) {
      dispatch(billViewInfo(allBillsArray[index1]));
      localStorage.setItem("billData", JSON.stringify(allBillsArray[index1]));
      setBillViewData(allBillsArray[index1]);
      setPrevNextStatus(true);
      setPrevNextDisable(false);
      setNextDisable(false);
      if (allBillsArray[index1].billStatus === "CANCELLED") {
        setDisplayCancel(true);
      } else {
        setDisplayCancel(false);
      }
    } else {
      setPrevNextDisable(true);
    }
  };
  const [nextDisable, setNextDisable] = useState(false);
  const nextBill = (id) => {
    var index1 = allBillsArray.findIndex((obj) => obj.index == id);
    if (index1 != -1) {
      dispatch(billViewInfo(allBillsArray[index1]));
      localStorage.setItem("billData", JSON.stringify(allBillsArray[index1]));
      setBillViewData(allBillsArray[index1]);
      setPrevNextStatus(true);
      setNextDisable(false);
      setPrevNextDisable(false);
      if (allBillsArray[index1].billStatus === "CANCELLED") {
        setDisplayCancel(true);
      } else {
        setDisplayCancel(false);
      }
    } else {
      setNextDisable(true);
    }
  };
  return (
    <Modal
      show={props.showBillViewModal}
      close={props.closeBillViewModal}
      className="cropmodal_poopup steps_modal billView_modal right"
    >
      <div className="modal-header date_modal_header smartboard_modal_header">
        <h5
          className="modal-title d-flex align-items-center header2_text"
          id="staticBackdropLabel"
        >
          <p className="b-name">
            {billData?.partyType.toUpperCase() === "FARMER"
              ? getText(billData.farmerName)
              : getText(billData?.buyerName)}
            -
          </p>
          <p className="b-name">{billData?.caBSeq}</p>
        </h5>
       <button onClick={(e) => {
            props.closeBillViewModal();
          }}>
       <img
          alt="image"
          src={clo}
          className="cloose"
          
        />
       </button>
      </div>
      <div className="modal-body py-0">
        <div className="row">
          <div className="col-lg-10 col_left bill_col bill_col_border">
            <div className="bill_view_card buy_bills_view" id="scroll_style">
              {prevNextStatus ? (
                <BusinessDetails prevNextStatus1={prevNextStatus} />
              ) : (
                <BusinessDetails />
              )}

              <div className="bill_crop_details" id="scroll_style">
                {prevNextStatus ? (
                  <CropDetails prevNextStatus1={prevNextStatus} />
                ) : (
                  <CropDetails />
                )}

                <div className="stamp_img">
                  {(billData?.billStatus?.toUpperCase() == "CANCELLED" || displayCancel) ? (
                    <img src={cancel_bill_stamp} alt="stammp_img" />
                  ) : ''}
                </div>

                {prevNextStatus ? (
                  <GroupTotals prevNextStatus1={prevNextStatus} />
                ) : (
                  <GroupTotals />
                )}
                {prevNextStatus ? (
                  <BillViewFooter prevNextStatus1={prevNextStatus} />
                ) : (
                  <BillViewFooter />
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-2 p-0 ">
            <div className="bill_col pr-0">
              {billData?.billStatus?.toUpperCase() == "CANCELLED" || displayCancel ? (
                ""
              ) : (
                <div>
                  <p className="more-p-tag">Actions</p>
                  <div className="action_icons">
                    <div className="items_div">
                     <button onClick={() => handleCheckEvent()}>
                     <img
                        src={cancel}
                        alt="img"
                        className=""
                        
                      />
                     </button>
                      <p>Cancel</p>
                    </div>
                    <div className="items_div">
                      <button onClick={() => editBill(billData)}>
                      <img
                        src={edit}
                        alt="img"
                       
                      />
                      </button>
                      <p>Edit</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer bill_footer d-flex justify-content-center">
        <button
          onClick={() => {
            previousBill(billData?.index + 1);
          }}
        >
          <img
            src={prev_icon}
            className={prevNextDisable ? "prev_disable" : "prev_next_icon"}
            alt="image"
          />
        </button>
        <p className="b-name">{billData?.caBSeq}</p>
        <button
          onClick={() => {
            nextBill(billData?.index - 1);
          }}
        >
          <img
            src={next_icon}
            className={nextDisable ? "prev_disable" : "prev_next_icon"}
            alt="image"
          />
        </button>
      </div>
      {showStepsModalStatus ? (
        <Steps
          showStepsModal={showStepsModal}
          closeStepsModal={() => setShowStepsModal(false)}
        />
      ) : (
        ""
      )}
      <ToastContainer />
      <div className="modal cancelModal fade" id="cancelBill">
        <div className="modal-dialog cancelBill_modal_popup modal-dialog-centered">
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
            <div className="modal-body text-center">
              <div className="row terms_popup ">
                <div className="col-lg-12">
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
                <div className="col-lg-12">
                  <p className="desc-tag">
                    Please note that cancellation of bill result in ledger
                    adjustments (rol back) and you will see an adjustment record
                    in ledger for the same bill
                  </p>
                </div>
                <div className="col-lg-1"></div>
              </div>
            </div>
            <div className="modal-footer p-3">
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
    </Modal>
  );
};
export default BillView;
