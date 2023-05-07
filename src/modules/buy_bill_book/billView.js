import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import edit from "../../assets/images/edit_round.svg";
import received_stamp from "../../assets/images/received_stamp.svg";
import paid_stamp from "../../assets/images/paid_stamp.svg";
import history_icon from "../../assets/images/history_icon.svg";
import pay_icon from "../../assets/images/pay_icon.svg";
import print from "../../assets/images/print_bill.svg";
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
import moment from "moment";
import Steps from "./steps";
import { Buffer } from "buffer";
import download_icon from "../../assets/images/dwnld.svg";
import share_icon from "../../assets/images/share_icon.svg";
import copy_icon from "../../assets/images/copy_link.svg";
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
import { colorAdjustBg, getText } from "../../components/getText";
import {
  getBillHistoryListById,
  getLedgers,
  getLedgerSummary,
  getOutstandingBal,
  getSellerDetailedLedger,
  getBuyerDetailedLedger,
  getDetailedLedgerByDate,
  getSellerDetailedLedgerByDate,
  getLedgerSummaryByDate,
} from "../../actions/ledgersService";
import { billHistoryView } from "../../reducers/paymentViewSlice";
import EditPaymentHistoryView from "../ledgers/editPaymentHistoryView";
import RecordPayment from "../ledgers/recordPayment";
import {
  allLedgers,
  businessValues,
  detaildLedgerInfo,
  fromRecordPayment,
  ledgerSummaryInfo,
  outStandingBal,
  totalRecivables,
} from "../../reducers/ledgerSummarySlice";
import getPdColors from "../../actions/pdfservice/pdfThemeInfo";
import getBillPdfJson from "../../actions/pdfservice/billpdf/getBillPdfJson";
import { getSingleBillPdf, getSingleBillPdfHelth } from "../../actions/pdfservice/singleBillPdf";
import loading from "../../assets/images/loading.gif";
import { colorAdjustBill } from "../../components/qtyValues";
const BillView = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const pdfThemeData = JSON.parse(localStorage.getItem("settingsData"));
  const colorThemeVal =
    pdfThemeData != null ? pdfThemeData?.colorTheme : "#16a12c";
  const clickId = loginData.caId;
  var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
  var billViewData = useSelector((state) => state.billViewInfo);
  // const [billData, setBillViewData] = useState(billViewData.billViewInfo);
  const billData = billViewData?.billViewInfo;
  const [fromBillViewPopup, setFromBillViewPopup] = useState(false);
  var billPaid = (billPaid =
    billViewData.billViewInfo != null
      ? billViewData.billViewInfo?.paid
      : false);
  const partyId =
    billData?.partyType.toUpperCase() === "BUYER"
      ? billData?.buyerId
      : billData?.farmerId;
  var allBillsArray = props.allBillsData;
  const navigate = useNavigate();
  const [displayCancel, setDisplayCancel] = useState(false);
  const [outBal, setoutBal] = useState("");
  const tabClick = useSelector((state) => state.ledgerSummaryInfo);
  const allCustomTab = tabClick?.allCustomTabs;
  const ledgerTabs = tabClick?.partnerTabs;
  const fromDate = moment(tabClick?.beginDate).format("YYYY-MM-DD");
  const toDate = moment(tabClick?.closeDate).format("YYYY-MM-DD");
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(billViewStatus(true));
    // setBillViewData(billViewData.billViewInfo);
    dispatch(billViewInfo(billViewData.billViewInfo));
    if (billViewData?.billViewInfo?.billStatus == "COMPLETED") {
      setDisplayCancel(false);
    } else {
      setDisplayCancel(true);
    }
    getOutstandingBal(clickId, partyId).then((response) => {
      if (response.data.data !== null) {
        setoutBal(response.data.data);
      }
    });
    // if (settingsDataArray != null) {
    //   var settingsData = settingsDataArray[0];
    //   var primaryColor =
    //     settingsData.colorTheme !== "" ? settingsData.colorTheme : "#16A12B";
    //   var lightColor = colorAdjustBill(primaryColor, 180);
    //   var darkerColor = colorAdjustBill(primaryColor, -30);
    //   setLightColorVal(lightColor);
    //   return {
    //     primaryColor: primaryColor !== "" ? primaryColor : "#16A12B",
    //     lightColor: lightColor !== "" ? lightColor : "#12B82E",
    //     darkerColor: darkerColor !== "" ? darkerColor : "#0C7A1E",
    //   };
    // }
  }, [props]);

  const dispatch = useDispatch();
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [showStepsModalStatus, setShowStepsModalStatus] = useState(false);

  const getCommRetCommPercentages = (data) => {
    var val = (data / billData?.grossTotal) * 100;
    return val;
  };
  const feePerUnit = () => {
    var totalQty = 0;
    billData.lineItems?.map((item) => {
      totalQty += item.qty;
      return totalQty;
    });
    return totalQty;
  };
  const getTransRentPercentage = (data) => {
    var val = data / feePerUnit();
    return val;
  };
  const editBill = (itemVal) => {
    var valArr = props.fromLedger ? billViewData.billViewInfo : itemVal;
    let clonedObject = { ...valArr };
    Object.assign(clonedObject, {
      commPercenttage: getCommRetCommPercentages(billData?.comm),
      retCommPercenttage: getCommRetCommPercentages(billData?.rtComm),
      mandiFeePercentage: getCommRetCommPercentages(billData?.mandiFee),
      transVal: getTransRentPercentage(billData?.transportation),
      labourChargesVal: getTransRentPercentage(billData?.labourCharges),
      rentUnitVal: getTransRentPercentage(billData?.rent),
    });
    var arr = [];
    arr.push(clonedObject);
    if (!props.fromLedger) {
      $(".billView_modal").hide();
      $(".modal-backdrop").remove();
    }
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
        billData?.partyType.toUpperCase() === "FARMER"
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
    writerId: writerId,
    source: "WEB",
  };

  const cancelbillApiCall = () => {
    editbuybillApi(editBillRequestObj).then(
      (response) => {
        if (response.data.status.type === "SUCCESS") {
          toast.success(response.data.status.message, {
            toastId: "success1",
          });
          localStorage.setItem("billViewStatus", false);
          setDisplayCancel(true);
          if (!props.fromLedger) {
            if (billData?.partyType.toUpperCase() === "FARMER") {
              window.setTimeout(function () {
                props.closeBillViewModal();
                navigate("/buy_bill_book");
                window.location.reload();
              }, 1000);
            } else {
              window.setTimeout(function () {
                props.closeBillViewModal();
                navigate("/sellbillbook");
                window.location.reload();
              }, 1000);
            }
          } else {
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
    if (!isPopupOpen) {
      // check if popup is already open
      isPopupOpen = true; // set flag to true
      $("#cancelBill").modal("show"); // show popup
      setTimeout(() => {
        // reset flag after a short delay
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
      // setBillViewData(allBillsArray[index1]);
      dispatch(billViewInfo(allBillsArray[index1]));
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
      // setBillViewData(allBillsArray[index1]);
      dispatch(billViewInfo(allBillsArray[index1]));
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
  const clearModal = () => {
    var partyId =
      billData?.partyType == "FARMER" ? billData?.farmerId : billData?.buyerId;
    var partyType =
      billData?.partyType == "FARMER" ? "SELLER" : billData?.partyType;
    if (props.fromLedger) {
      dispatch(fromRecordPayment(true));
      fetchLedgers();
      summaryData(clickId, partyId);
      if (allCustomTab == "all" && ledgerTabs == "detailedledger") {
        if (partyType == "SELLER") {
          sellerDetailed(clickId, partyId);
        } else {
          geyDetailedLedger(clickId, partyId);
        }
      }
      if (allCustomTab == "custom" && ledgerTabs == "ledgersummary") {
        ledgerSummaryByDate(clickId, partyId, fromDate, toDate);
      } else if (allCustomTab == "custom" && ledgerTabs == "detailedledger") {
        if (partyType == "SELLER") {
          sellerDetailedByDate(clickId, partyId, fromDate, toDate);
        } else {
          detailedLedgerByDate(clickId, partyId, fromDate, toDate);
        }
      }
    }
    if (props.fromLedger) {
      window.setTimeout(function () {
        props.closeBillViewModal();
        // navigate("/sellerledger");
        // window.location.reload();
      }, 1000);
    }
  };
  const [showBillHistoryModal, setShowBillHistoryModal] = useState(false);
  const [showBillHistoryModalStatus, setShowBillHistoryModalStatus] =
    useState(false);
  const [billHistoryArray, setBillHistoryArray] = useState([]);
  const [selectedRefId, setSelectedRefId] = useState("");
  const historyData = (id, type) => {
    var typeVal = "";
    if (type == "FARMER" || type == "SELLER") {
      typeVal = "BUY";
    } else {
      typeVal = "SELL";
    }
    setSelectedRefId(id);
    getBillHistoryListById(clickId, id, typeVal).then((res) => {
      if (res.data.status.type === "SUCCESS") {
        setShowBillHistoryModalStatus(true);
        setShowBillHistoryModal(true);
        setBillHistoryArray(res.data.data);
      }
    });
  };
  const [recordPaymentModalStatus, setRecordPaymentModalStatus] =
    useState(false);
  const [recordPaymentModal, setRecordPaymentModal] = useState(false);
  const recordPaymentOnClickEvent = (data) => {
    setRecordPaymentModalStatus(true);
    setRecordPaymentModal(true);
    setFromBillViewPopup(true);
    // setBillViewData(data);
    dispatch(billViewInfo(data));
    dispatch(fromRecordPayment(true));
  };

  const fetchLedgers = () => {
    var partyType =
      billData?.partyType == "FARMER" ? "SELLER" : billData?.partyType;
    getLedgers(clickId, partyType).then((res) => {
      if (res.data.status.type === "SUCCESS") {
        dispatch(allLedgers(res.data.data.ledgers));
        dispatch(outStandingBal(res.data.data));
      } else {
      }
    });
  };
  const summaryData = (clickId, partyId) => {
    getLedgerSummary(clickId, partyId)
      .then((res) => {
        if (res.data.status.type === "SUCCESS") {
          dispatch(businessValues(res.data.data));
          dispatch(ledgerSummaryInfo(res.data.data.ledgerSummary));
        }
      })
      .catch((error) => console.log(error));
  };
  const geyDetailedLedger = (clickId, partyId) => {
    getBuyerDetailedLedger(clickId, partyId)
      .then((res) => {
        if (res.data.status.type === "SUCCESS") {
          dispatch(totalRecivables(res.data.data));
          dispatch(detaildLedgerInfo(res.data.data.details));
        }
      })
      .catch((error) => console.log(error));
  };
  //Get Seller Detailed Ledger
  const sellerDetailed = (clickId, partyId) => {
    getSellerDetailedLedger(clickId, partyId)
      .then((res) => {
        if (res.data.status.type === "SUCCESS") {
          dispatch(totalRecivables(res.data.data));
          dispatch(detaildLedgerInfo(res.data.data.details));
        }
      })
      .catch((error) => console.log(error));
  };
  const ledgerSummaryByDate = (clickId, partyId, fromDate, toDate) => {
    getLedgerSummaryByDate(clickId, partyId, fromDate, toDate)
      .then((res) => {
        if (res.data.data !== null) {
          dispatch(businessValues(res.data.data));
          dispatch(ledgerSummaryInfo(res.data.data.ledgerSummary));
        }
      })
      .catch((error) => console.log(error));
  };
  //Buyer Detailed Ledger By Date
  const detailedLedgerByDate = (clickId, partyId, fromDate, toDate) => {
    getDetailedLedgerByDate(clickId, partyId, fromDate, toDate)
      .then((res) => {
        if (res.data.data !== null) {
          dispatch(totalRecivables(res.data.data));
          dispatch(detaildLedgerInfo(res.data.data.details));
        }
      })
      .catch((error) => console.log(error));
  };

  //Seller Detailed ledger By Date
  const sellerDetailedByDate = (clickId, partyId, fromDate, toDate) => {
    getSellerDetailedLedgerByDate(clickId, partyId, fromDate, toDate)
      .then((res) => {
        if (res.data.data !== null) {
          dispatch(totalRecivables(res.data.data));
          dispatch(detaildLedgerInfo(res.data.data.details));
        }
      })
      .catch((error) => console.log(error));
  };
  async function getPrintPdf() {
    setLoading(true);
    var billViewPdfJson = getBillPdfJson(billData, {});
    console.log(billViewPdfJson,'pdfres1');
    var hi = await getSingleBillPdfHelth();
    console.log(hi,'hi')
    var pdfResponse = await getSingleBillPdf(billViewPdfJson);
    console.log(pdfResponse,'pdfres2');
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
    var billViewPdfJson = getBillPdfJson(billData, {});
    var pdfResponse = await getSingleBillPdf(billViewPdfJson);
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
      // link.setAttribute("download",'bill.pdf');
      if (billData?.partyType == "BUYER") {
        link.setAttribute(
          "download",
          `SELL_${clickId}_${billData?.buyerId}_${billData?.caBSeq}.pdf`
        ); //or any other extension
      } else {
        link.setAttribute(
          "download",
          `BUY_${clickId}_${billData?.farmerId}_${billData?.caBSeq}.pdf`
        ); //or any other extension
      }
      document.body.appendChild(link);
      link.click();
      setLoading(false);
    }
  }
  const [shareUrl, setShareUrl] = useState("");
  async function getShareModal() {
    setLoading(true);
    var billViewPdfJson = getBillPdfJson(billData, {});
    var pdfResponse = await getSingleBillPdf(billViewPdfJson);
    if (pdfResponse.status !== 200) {
      toast.error("Something went wrong", {
        toastId: "errorr2",
      });
      setLoading(false);
      return;
    } else {
      setLoading(false);
      $("#shareBill").modal("show");

      var bufferData = Buffer.from(pdfResponse.data);
      var blob = new Blob([bufferData], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      setShareUrl(blobUrl);
      const pdf = new File([blobUrl], "hello.pdf", { type: "application/pdf" });
      const files = [pdf];
      // Share PDF file if supported.
      if (navigator.canShare({ files })) await navigator.share({ files });
    }
  }
  const closeSharePopup = () => {
    $("#shareBill").modal("hide");
  };
  function getsharePdf() {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = function () {
      var recoveredBlob = xhr.response;
      var reader = new FileReader();
      reader.onload = function () {
        var blobAsDataUrl = reader.result;
        navigator.clipboard.writeText(blobAsDataUrl).then(
          function () {
            toast.success("Pdf Link Copied SuccessFully", {
              toastId: "errorr2",
            });
            closeSharePopup();
          },
          function (err) {
            console.error("something went wrong ", err);
          }
        );
      };
      reader.readAsDataURL(recoveredBlob);
    };
    xhr.open("GET", shareUrl);
    xhr.send();
  }

  return (
    <div>
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
              {billData?.partyType.toUpperCase() === "FARMER" ||
              billData?.partyType.toUpperCase() === "SELLER"
                ? getText(billData.farmerName)
                : getText(billData?.buyerName)}
              -
            </p>
            <p className="b-name">{billData?.caBSeq}</p>
          </h5>
          <button
            onClick={(e) => {
              clearModal();
              props.closeBillViewModal();
            }}
          >
            <img alt="image" src={clo} className="cloose" />
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

                <div
                  className="bill_crop_details"
                  style={{ border: "2px solid" + colorThemeVal }}
                  id="scroll_style1"
                >
                  {prevNextStatus ? (
                    <CropDetails prevNextStatus1={prevNextStatus} />
                  ) : (
                    <CropDetails />
                  )}

                  <div className="stamp_img">
                    {billData?.billStatus?.toUpperCase() == "CANCELLED" ||
                    displayCancel ? (
                      <img src={cancel_bill_stamp} alt="stammp_img" />
                    ) : billPaid ? (
                      billData?.partyType.toUpperCase() === "FARMER" ||
                      billData?.partyType.toUpperCase() === "SELLER" ? (
                        <img src={paid_stamp} alt="stammp_img" />
                      ) : (
                        <img src={received_stamp} alt="stammp_img" />
                      )
                    ) : (
                      ""
                    )}
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
                {billData?.billStatus?.toUpperCase() == "CANCELLED" ||
                displayCancel ? (
                  ""
                ) : billPaid ? (
                  <div>
                    <p className="more-p-tag">Actions</p>
                    <div className="action_icons">
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
                      {/* <div className="items_div">
                        <button
                          onClick={() => {
                            getShareModal().then();
                          }}
                        >
                          <img src={share_icon} alt="img" />
                        </button>
                        <p>Share</p>
                      </div> */}
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
                        <button
                          onClick={() =>
                            historyData(billData?.billId, billData?.partyType)
                          }
                        >
                          <img src={history_icon} alt="img" />
                        </button>
                        <p>History</p>
                      </div>
                    </div>
                  </div>
                ) : props.fromTransporter ? (
                  ""
                ) : (
                  <div>
                    <p className="more-p-tag">Actions</p>
                    <div className="action_icons">
                      <div className="items_div">
                        <button
                          onClick={() =>
                            historyData(billData?.billId, billData?.partyType)
                          }
                        >
                          <img src={history_icon} alt="img" />
                        </button>
                        <p>History</p>
                      </div>
                      <div className="items_div">
                        <button
                          onClick={() => {
                            recordPaymentOnClickEvent(billData);
                          }}
                        >
                          <img src={pay_icon} alt="img" />
                        </button>
                        <p>Pay</p>
                      </div>
                      <div className="items_div">
                        <button onClick={() => editBill(billData)}>
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
                      {/* <div className="items_div">
                        <button
                          onClick={() => {
                            getShareModal().then();
                          }}
                        >
                          <img src={share_icon} alt="img" />
                        </button>
                        <p>Share</p>
                      </div> */}
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
                        <button onClick={() => handleCheckEvent()}>
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
        </div>
        {props.fromLedger ? (
          ""
        ) : (
          <div className="modal-footer bill_footer d-flex justify-content-center">
            <div className="row" style={{ width: "100%" }}>
              <div className="col-lg-10 p-0 ">
                <div className="d-flex justify-content-center align-items-center">
                  <button
                    onClick={() => {
                      previousBill(billData?.index + 1);
                    }}
                  >
                    <img
                      src={prev_icon}
                      className={
                        prevNextDisable ? "prev_disable" : "prev_next_icon"
                      }
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
                      className={
                        nextDisable ? "prev_disable" : "prev_next_icon"
                      }
                      alt="image"
                    />
                  </button>
                </div>
              </div>
              <div className="col-lg-2"></div>
            </div>
          </div>
        )}
        {showStepsModalStatus ? (
          <Steps
            showStepsModal={showStepsModal}
            closeStepsModal={() => setShowStepsModal(false)}
            fromLedger={props.fromLedger}
          />
        ) : (
          ""
        )}
        <ToastContainer />
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
        <div className="modal cancelModal shareModal fade" id="shareBill">
          <div className="modal-dialog cancelBill_modal_popup modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header date_modal_header smartboard_modal_header">
                <div className="d-flex">
                  <img src={copy_icon} alt="image" />
                  <h5
                    className="modal-title ml-2 header2_text"
                    id="staticBackdropLabel"
                  >
                    Get Link
                  </h5>
                </div>
                <img
                  src={close}
                  alt="image"
                  className="close_icon"
                  onClick={closeSharePopup}
                />
              </div>
              <div className="modal-body text-center">
                <div className="row terms_popup ">
                  <div className="col-lg-9 p-0">
                    <input
                      type="text"
                      value={shareUrl}
                      className="form-control mb-0"
                    />
                  </div>
                  <div className="col-lg-3 p-0">
                    <button
                      className="primary_btn"
                      onClick={() => {
                        getsharePdf();
                      }}
                    >
                      Copy Link
                    </button>
                  </div>
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
      {showBillHistoryModalStatus ? (
        <EditPaymentHistoryView
          showBillHistoryViewModal={showBillHistoryModal}
          closeBillHistoryViewModal={() => setShowBillHistoryModal(false)}
          billHistoryArray={billHistoryArray}
          selectedRefId={selectedRefId}
        />
      ) : (
        ""
      )}
      {recordPaymentModalStatus ? (
        <RecordPayment
          showRecordPaymentModal={recordPaymentModal}
          closeRecordPaymentModal={() => setRecordPaymentModal(false)}
          LedgerData={billData}
          ledgerId={
            billData?.partyType.toUpperCase() === "BUYER"
              ? billData?.buyerId
              : billData?.farmerId
          }
          partyType={billData?.partyType}
          fromBillViewPopup={fromBillViewPopup}
          outStbal={outBal}
          fromPaymentHistory={recordPaymentModalStatus}
          fromBillbookToRecordPayment={props.fromBillbookToRecordPayment}
        />
      ) : (
        ""
      )}
    </div>
  );
};
export default BillView;
