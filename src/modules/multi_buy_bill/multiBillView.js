import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import BillViewFooter from "../buy_bill_book/billViewFooter";
import clo from "../../assets/images/close.svg";
import { useDispatch, useSelector } from "react-redux";
import BusinessDetails from "../buy_bill_book/business_details";
import PaartyCropDetails from "./partyCropsTable";
import edit from "../../assets/images/edit_round.svg";
import cancel from "../../assets/images/cancel.svg";
import close from "../../assets/images/close.svg";
import $ from "jquery";
import cancel_bill_stamp from "../../assets/images/cancel_stamp.svg";
import { editMultiBuyBill } from "../../actions/multiBillService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  colorthemeValue,
  disableFromLastDays,
} from "../../reducers/billViewSlice";
import print from "../../assets/images/print_bill.svg";
import { Buffer } from "buffer";
import loading from "../../assets/images/loading.gif";
import {
  fromMultiBillView,
  multiSelectPartners,
  multiSelectPartyType,
  multiStepsVal,
  slectedBillDate,
  totalEditedObject,
} from "../../reducers/multiBillSteps";
import MultiBillSteps from "./steps";
import { getMultiBillPdf } from "../../actions/pdfservice/singleBillPdf";
import getMultibillPdfData from "../../actions/pdfservice/billpdf/getMultiBillPdfJson";
import download_icon from "../../assets/images/dwnld.svg";
import { isEditBill } from "../../components/getCurrencyNumber";
const MultiBillView = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const selectedStep = useSelector((state) => state.multiStepsInfo);
  const partyType = selectedStep?.multiSelectPartyType;
  const selectedBillData = selectedStep?.selectedMultBillArray;
  const clickId = loginData.caId;
  var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
  const pdfThemeDataArray = JSON.parse(localStorage.getItem("settingsData"));
  const pdfThemeData = pdfThemeDataArray != null ? pdfThemeDataArray : null;
  const [colorThemeVal, setColorThemeVal] = useState("");
  let isPopupOpen = false;
  const [objArray, setObjArrray] = useState([]);
  const [isLoading, setLoading] = useState(false);
  var billViewData = useSelector((state) => state.billViewInfo);
  const numberOfDaysValue = billViewData?.numberOfDays;
  const numberOfDaysSell = billViewData?.numberOfDaysSell;
  useEffect(() => {
    if (pdfThemeData != null) {
      for (var i = 0; i < pdfThemeData.length; i++) {
        if (pdfThemeData[i].type == "BUY_BILL" && partyType == "FARMER") {
          setColorThemeVal(
            pdfThemeData[i] != null
              ? pdfThemeData[i]?.colorTheme != ""
                ? pdfThemeData[i]?.colorTheme
                : "#16a12c"
              : "#16a12c"
          );
          dispatch(
            colorthemeValue(
              pdfThemeData[i] != null
                ? pdfThemeData[i]?.colorTheme != ""
                  ? pdfThemeData[i]?.colorTheme
                  : "#16a12c"
                : "#16a12c"
            )
          );
          localStorage.setItem("pdftheme", pdfThemeData[i]);
        } else if (
          pdfThemeData[i].type == "SELL_BILL" &&
          partyType == "BUYER"
        ) {
          setColorThemeVal(
            pdfThemeData[i] != null
              ? pdfThemeData[i]?.colorTheme != ""
                ? pdfThemeData[i]?.colorTheme
                : "#16a12c"
              : "#16a12c"
          );
          dispatch(
            colorthemeValue(
              pdfThemeData[i] != null
                ? pdfThemeData[i]?.colorTheme != ""
                  ? pdfThemeData[i]?.colorTheme
                  : "#16a12c"
                : "#16a12c"
            )
          );
          localStorage.setItem("pdftheme", pdfThemeData[i]);
        }
      }
    } else {
      setColorThemeVal("#16a12c");
      dispatch(colorthemeValue("#16a12c"));
      localStorage.setItem("pdftheme", null);
    }
  }, []);
  const handleCheckEvent = () => {
    if (!isPopupOpen) {
      isPopupOpen = true; // set flag to true
      $("#cancelBill").modal("show"); // show popup
      setTimeout(() => {
        // reset flag after a short delay
        isPopupOpen = false;
      }, 1000); // adjust delay time as needed
    }
    var obj = {};
    for (var i = 0; i < selectedBillData?.billInfo.length; i++) {
      Object.assign(obj, {
        action: "CANCEL",
        billAttributes: {
          actualPayRecieevable:
            selectedBillData?.billInfo[i]?.partyType.toUpperCase() === "FARMER"
              ? selectedBillData?.billInfo[i]?.actualPaybles
              : selectedBillData?.billInfo[i]?.actualReceivable,
          advance: selectedBillData?.billInfo[i]?.advance,
          billDate: selectedBillData?.billInfo[i]?.billDate,
          cashPaid:
            selectedBillData?.billInfo[i]?.partyType.toUpperCase() === "FARMER"
              ? selectedBillData?.billInfo[i]?.cashPaid
              : 0,
          cashRcvd:
            selectedBillData?.billInfo[i]?.partyType.toUpperCase() === "BUYER"
              ? selectedBillData?.billInfo[i]?.cashRcvd
              : 0,
          comm: selectedBillData?.billInfo[i]?.comm,
          commIncluded: selectedBillData?.billInfo[i]?.commIncluded,
          comments: selectedBillData?.billInfo[i]?.comments,
          govtLevies: selectedBillData?.billInfo[i]?.govtLevies,
          grossTotal: selectedBillData?.billInfo[i]?.grossTotal,
          labourCharges: selectedBillData?.billInfo[i]?.labourCharges,
          less: selectedBillData?.billInfo[i]?.less,
          mandiFee: selectedBillData?.billInfo[i]?.mandiData,
          misc:
            selectedBillData?.billInfo[i]?.partyType.toUpperCase() === "FARMER"
              ? selectedBillData?.billInfo[i]?.otherFee
              : selectedBillData?.billInfo[i]?.misc,
          otherFee:
            selectedBillData?.billInfo[i]?.partyType.toUpperCase() === "FARMER"
              ? selectedBillData?.billInfo[i]?.misc
              : selectedBillData?.billInfo[i]?.otherFee,

          outStBal: selectedBillData?.billInfo[i]?.outStBal,
          paidTo: 0,
          partyId:
            selectedBillData?.billInfo[i]?.partyType.toUpperCase() === "FARMER"
              ? selectedBillData?.billInfo[i]?.buyerId
              : selectedBillData?.billInfo[i]?.farmerId,
          rent: selectedBillData?.billInfo[i]?.rent,
          rtComm: selectedBillData?.billInfo[i]?.rtComm,
          rtCommIncluded: selectedBillData?.billInfo[i]?.rtCommIncluded,
          totalPayRecieevable: selectedBillData?.billInfo[i]?.totalPayables,
          transportation: selectedBillData?.billInfo[i]?.transportation,
          transporterId: selectedBillData?.billInfo[i]?.transporterId,
        },
        billId: selectedBillData?.billInfo[i]?.billId,
        billType:
          selectedBillData?.billInfo[i]?.partyType.toUpperCase() === "FARMER"
            ? "BUY"
            : "SELL",
        caBSeq: selectedBillData?.billInfo[i]?.caBSeq,
        caId: clickId,
        lineItems: selectedBillData?.billInfo[i]?.lineItems,
        updatedBy: 0,
        updatedOn: "",
        writerId: writerId,
        source: "WEB",
      });
      // array.push(obj);
      setObjArrray([...objArray, obj]);
    }
  };
  const closePopup = () => {
    $("#cancelBill").modal("hide");
  };
  const billObj = {
    action: "CANCEL",
    billType: partyType == "FARMER" ? "BUY" : "SELL",
    billsInfo: objArray,
    caId: clickId,
    expenses: {
      advance:
        selectedBillData?.expenses?.advance == null ||
        selectedBillData?.expenses?.advance == 0
          ? 0
          : selectedBillData?.expenses?.advance,
      comm:
        selectedBillData?.expenses?.comm == null ||
        selectedBillData?.expenses?.comm == 0
          ? 0
          : selectedBillData?.expenses?.comm,
      govtLevies:
        selectedBillData?.expenses?.govtLevies == null ||
        selectedBillData?.expenses?.govtLevies == 0
          ? 0
          : selectedBillData?.expenses?.govtLevies,
      labourCharges:
        selectedBillData?.expenses?.labourCharges == null ||
        selectedBillData?.expenses?.labourCharges == 0
          ? 0
          : selectedBillData?.expenses?.labourCharges,
      mandiFee:
        selectedBillData?.expenses?.mandiFee == null ||
        selectedBillData?.expenses?.mandiFee == 0
          ? 0
          : selectedBillData?.expenses?.mandiFee,
      misc:
        selectedBillData?.expenses?.misc == null ||
        selectedBillData?.expenses?.misc == 0
          ? 0
          : selectedBillData?.expenses?.misc,
      others:
        selectedBillData?.expenses?.others == null ||
        selectedBillData?.expenses?.others == 0
          ? 0
          : selectedBillData?.expenses?.others,
      rent:
        selectedBillData?.expenses?.rent == null ||
        selectedBillData?.expenses?.rent == 0
          ? 0
          : selectedBillData?.expenses?.rent,
      rtComm:
        selectedBillData?.expenses?.rtComm == null ||
        selectedBillData?.expenses?.rtComm == 0
          ? 0
          : selectedBillData?.expenses?.rtComm,
      total:
        selectedBillData?.expenses?.total == null ||
        selectedBillData?.expenses?.total == 0
          ? 0
          : selectedBillData?.expenses?.total,
      transportation:
        selectedBillData?.expenses?.transportation == null ||
        selectedBillData?.expenses?.transportation == 0
          ? 0
          : selectedBillData?.expenses?.transportation,
    },
    groupId: selectedBillData?.groupId,
    writerId: writerId,
  };
  const cancelBill = () => {
    $("#cancelBill").modal("hide");
    cancelbillApiCall();
  };
  const [cancelDisplay, setDisplayCancel] = useState(false);
  const cancelbillApiCall = () => {
    editMultiBuyBill(billObj).then(
      (response) => {
        if (response.data.status.type === "SUCCESS") {
          toast.success(response.data.status.message, {
            toastId: "success1",
          });
          localStorage.setItem("billViewStatus", false);
          setDisplayCancel(true);
          // if (!props.fromLedger) {
          if (partyType.toUpperCase() === "FARMER") {
            window.setTimeout(function () {
              props.closeMultiBillViewModal();
              navigate("/buy_bill_book");
              window.location.reload();
            }, 1000);
          } else {
            window.setTimeout(function () {
              props.closeMultiBillViewModal();
              navigate("/sellbillbook");
              window.location.reload();
            }, 1000);
          }
          // } else {
          // }
        }
      },
      (error) => {
        toast.error(error.response.data.status.description, {
          toastId: "error1",
        });
      }
    );
  };
  const [showMultiStepsModalStatus, setShowMultiStepsModalStatus] =
    useState(false);
  const [showMultiStepsModal, setShowMultiStepsModal] = useState(false);
  const onTapEditBill = () => {
    var days = partyType == "FARMER" ? numberOfDaysValue : numberOfDaysSell;
    var value = isEditBill(selectedBillData?.billInfo[0].billDate, days);
    if (!value) {
      dispatch(disableFromLastDays(true));
      toast.error(
        `Bills that are more than ${days} days old can’t be edited. `,
        {
          toastId: "error6",
        }
      );
    } else {
      editBill();
    }
  };
  const onTapCancelBill = () => {
    var days = partyType == "FARMER" ? numberOfDaysValue : numberOfDaysSell;
    var value = isEditBill(selectedBillData?.billInfo[0].billDate, days);
    if (!value) {
      dispatch(disableFromLastDays(true));
      toast.error(
        `Bills that are more than ${days} days old can’t be cancelled. `,
        {
          toastId: "error6",
        }
      );
    } else {
      handleCheckEvent();
    }
  };
  const editBill = () => {
    setShowMultiStepsModalStatus(true);
    setShowMultiStepsModal(true);
    dispatch(multiStepsVal("step3"));
    dispatch(
      multiSelectPartyType(partyType == "FARMER" ? "Seller" : partyType)
    );
    console.log(selectedBillData, partyType, "selected billl array");
    dispatch(multiSelectPartners(selectedBillData?.billInfo));
    dispatch(fromMultiBillView(true));
    dispatch(totalEditedObject(selectedBillData));
    dispatch(slectedBillDate(new Date(selectedBillData?.billInfo[0].billDate)));
  };
  async function getPrintPdf() {
    console.log("pdf coming", selectedBillData);
    setLoading(true);
    var billViewPdfJson = getMultibillPdfData(selectedBillData, {});
    var pdfResponse = await getMultiBillPdf(billViewPdfJson);
    console.log(pdfResponse, "pdfres2");
    if (pdfResponse.status !== 200) {
      toast.error("Something went wrong", {
        toastId: "errorr2",
      });
      setLoading(false);
      return;
    } else {
      toast.success("Pdf generated SuccessFully", {
        toastId: "errorr2",
      });
      var bufferData = Buffer.from(pdfResponse.data);
      var blob = new Blob([bufferData], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      setLoading(false);
      window.open(blobUrl, "_blank");
    }
  }
  async function getDownloadPdf() {
    setLoading(true);
    var billViewPdfJson = getMultibillPdfData(selectedBillData, {});
    var pdfResponse = await getMultiBillPdf(billViewPdfJson);
    if (pdfResponse.status !== 200) {
      toast.error("Something went wrong", {
        toastId: "errorr2",
      });
      setLoading(false);
      return;
    } else {
      toast.success("Pdf Downloaded SuccessFully", {
        toastId: "errorr2",
      });
      var bufferData = Buffer.from(pdfResponse.data);
      var blob = new Blob([bufferData], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      if (selectedBillData?.partyType == "BUYER") {
        link.setAttribute(
          "download",
          `SELL_${clickId}_${selectedBillData?.groupId}.pdf`
        ); //or any other extension
      } else {
        link.setAttribute(
          "download",
          `BUY_${clickId}_${selectedBillData?.groupId}.pdf`
        ); //or any other extension
      }
      document.body.appendChild(link);
      link.click();
      setLoading(false);
    }
  }
  return (
    <div>
      <Modal
        show={props.showMultiBillViewModal}
        close={props.closeMultiBillViewModal}
        className="cropmodal_poopup steps_modal billView_modal right"
      >
        <div className="modal-header date_modal_header smartboard_modal_header">
          <h5
            className="modal-title d-flex align-items-center header2_text"
            id="staticBackdropLabel"
          >
            <p className="b-name">
              {"Group Id - " + selectedBillData?.groupId}
            </p>
          </h5>
          <button
            onClick={() => {
              props.closeMultiBillViewModal();
            }}
          >
            <img alt="image" src={clo} className="cloose" />
          </button>
        </div>
        <div className="modal-body py-0">
          <div className="row">
            <div className="col-lg-10 col_left bill_col bill_col_border">
              <div className="bill_view_card buy_bills_view" id="scroll_style">
                <BusinessDetails />
                <div
                  className="bill_crop_details"
                  style={{ border: "2px solid" + colorThemeVal }}
                  id="scroll_style1"
                >
                  <PaartyCropDetails />
                  <div className="stamp_img">
                    {selectedBillData?.billInfo[0]?.billStatus?.toUpperCase() ==
                      "CANCELLED" || cancelDisplay ? (
                      <img src={cancel_bill_stamp} alt="stammp_img" />
                    ) : (
                      ""
                    )}
                  </div>
                  {/* <MultiBillViewFooter /> */}
                </div>
              </div>
            </div>
            <div className="col-lg-2 p-0 ">
              {selectedBillData?.billInfo[0]?.billStatus?.toUpperCase() ==
                "CANCELLED" || cancelDisplay ? (
                ""
              ) : (
                <div>
                  <p className="more-p-tag">Actions</p>
                  <div className="action_icons">
                    <div className="items_div">
                      <button onClick={() => onTapEditBill()}>
                        <img src={edit} alt="img" />
                      </button>
                      <p>Edit</p>
                    </div>
                    <div className="items_div">
                      <button
                        onClick={() => {
                          getPrintPdf().then();
                        }}
                      >
                        <img src={print} alt="img" />
                      </button>
                      <p>Print</p>
                    </div>
                    <div className="items_div">
                      <button
                        onClick={() => {
                          getDownloadPdf().then();
                        }}
                      >
                        <img src={download_icon} alt="img" />
                      </button>
                      <p>Download</p>
                    </div>
                    <div className="items_div">
                      <button onClick={() => onTapCancelBill()}>
                        <img src={cancel} alt="img" className="" />
                      </button>
                      <p>Cancel</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="modal cancelModal fade" id="cancelBill">
          <div className="modal-dialog cancelBill_modal_popup modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header date_modal_header smartboard_modal_header">
                <h5
                  className="modal-title header2_text"
                  id="staticBackdropLabel"
                >
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
                      adjustments (roll back) and you will see an adjustment
                      record in ledger for the same bill
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
                    onClick={() => cancelBill()}
                    data-bs-dismiss="modal"
                  >
                    YES
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="loading_styles">
            <img src={loading} alt="my-gif" className="gif_img" />
          </div>
        ) : (
          ""
        )}
      </Modal>
      <ToastContainer />
      {showMultiStepsModalStatus ? (
        <MultiBillSteps
          showMultiStepsModal={showMultiStepsModal}
          closeMultiStepsModal={() => setShowMultiStepsModal(false)}
        />
      ) : (
        ""
      )}
    </div>
  );
};
export default MultiBillView;
