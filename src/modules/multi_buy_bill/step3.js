import { useDispatch, useSelector } from "react-redux";
import { getPartnerType, getText } from "../../components/getText";
import single_bill from "../../assets/images/bills/single_bill.svg";
import {
  getCurrencyNumberWithSymbol,
  getMaskedMobileNumber,
} from "../../components/getCurrencyNumber";
import "./step3.scss";
import { qtyValues } from "../../components/qtyValues";
import {
  arrayObj,
  fromPreviousStep3,
  multiSelectPartners,
  multiStepsVal,
} from "../../reducers/multiBillSteps";
import edit from "../../assets/images/edit_round.svg";
import DateSelection from "./dateSelection";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import {
  editMultiBuyBill,
  postMultiBuyBill,
} from "../../actions/multiBillService";
import moment from "moment";
import { useNavigate } from "react-router-dom";
const Step3 = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedStep = useSelector((state) => state.multiStepsInfo);
  var multiSelectPartnersArray = selectedStep?.fromMultiBillView
    ? selectedStep?.multiSelectPartners
    : selectedStep?.multiSelectPartners;
  const fromMultiBillViewStatus = selectedStep?.fromMultiBillView;
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
  var [arr1, setArr1] = useState([]);
  var [arr2, setArr2] = useState([]);
  const billEditedObject = selectedStep?.totalEditedObject;
  const partyType = selectedStep?.multiSelectPartyType;
  const fromPreviousStep3Status = selectedStep?.fromPreviousStep3;
  var multiSelectPartnersArray1 = [];
  const slectedBillDateVal = selectedStep?.slectedBillDate;
  console.log(slectedBillDateVal,'date')
  const cancelStep = () => {
    dispatch(multiSelectPartners([]));
    props.closeModal();
  };
  const previousStep = () => {
    dispatch(multiStepsVal("step2"));
    dispatch(fromPreviousStep3(true));
  };
  const editCropInfo = () => {
    dispatch(multiStepsVal("step2"));
    dispatch(fromPreviousStep3(true));
  };
  const commentText = (e) => {
    // var regEx = /^[a-z][a-z\s]*$/;
    var val = e.target.value;
    setCommentFieldText(val);
  };
  var totalGross = 0;
  var objArray1 = [];
  const [objArray2, setObjArrray2] = useState([]);
  const [grossTotal, setGrossTotal] = useState(0);
  const [commentext, setCommentFieldText] = useState(
    fromMultiBillViewStatus ? billEditedObject?.billInfo[0].comments : ""
  );
  useEffect(() => {
    $("#disable").attr("disabled", false);
    console.log(multiSelectPartnersArray, billEditedObject, "array step3");
    if (multiSelectPartnersArray.length > 0) {
      for (var i = 0; i < multiSelectPartnersArray.length; i++) {
        getGrossTotalValue(multiSelectPartnersArray, i);
      }
    }
    if (fromMultiBillViewStatus) {
      for (var i = 0; i < multiSelectPartnersArray1.length; i++) {
        var obj = {};
        Object.assign(obj, {
          action: "UPDATE",
          billAttributes: {
            CashCmnt: "",
            actualPayRecieevable:
              multiSelectPartnersArray1[i]?.partyType.toUpperCase() === "FARMER"
                ? multiSelectPartnersArray1[i]?.actualPayble
                : multiSelectPartnersArray1[i]?.actualReceivable,
            advance: multiSelectPartnersArray1[i]?.advance,
            billDate: slectedBillDateVal,
            cashPaid:
              multiSelectPartnersArray1[i]?.partyType.toUpperCase() === "FARMER"
                ? multiSelectPartnersArray1[i]?.cashPaid
                : 0,
            cashRcvd:
              multiSelectPartnersArray1[i]?.partyType.toUpperCase() === "BUYER"
                ? multiSelectPartnersArray1[i]?.cashRcvd
                : 0,
            customFields: [],
            comm: multiSelectPartnersArray1[i]?.comm,
            commIncluded: multiSelectPartnersArray1[i]?.commIncluded,
            comments: multiSelectPartnersArray1[i]?.comments,
            govtLevies: multiSelectPartnersArray1[i]?.govtLevies,
            grossTotal: multiSelectPartnersArray1[i].grossTotal,
            labourCharges: multiSelectPartnersArray1[i]?.labourCharges,
            less: multiSelectPartnersArray1[i]?.less,
            mandiFee: multiSelectPartnersArray1[i]?.mandiFee,
            misc:
              multiSelectPartnersArray1[i]?.partyType.toUpperCase() === "FARMER"
                ? multiSelectPartnersArray1[i]?.misc
                : multiSelectPartnersArray1[i]?.misc,
            otherFee:
              multiSelectPartnersArray1[i]?.partyType.toUpperCase() === "FARMER"
                ? multiSelectPartnersArray1[i]?.misc
                : multiSelectPartnersArray1[i]?.otherFee,

            outStBal: multiSelectPartnersArray1[i]?.outStBal,
            paidTo: 0,
            partyId:
              multiSelectPartnersArray1[i]?.partyType.toUpperCase() === "FARMER"
                ? multiSelectPartnersArray1[i]?.farmerId
                : multiSelectPartnersArray1[i]?.buyerId,
            rent: multiSelectPartnersArray1[i]?.rent,
            rtComm: multiSelectPartnersArray1[i]?.rtComm,
            rtCommIncluded: multiSelectPartnersArray1[i]?.rtCommIncluded,
            totalPayRecieevable:
              multiSelectPartnersArray1[i]?.partyType.toUpperCase() === "FARMER"
                ? multiSelectPartnersArray1[i]?.totalPayble
                : multiSelectPartnersArray1[i]?.totalReceivable,
            transportation: multiSelectPartnersArray1[i]?.transportation,
            transporterId: multiSelectPartnersArray1[i]?.transporterId,
          },
          billId: multiSelectPartnersArray1[i]?.billId,
          billType:
            multiSelectPartnersArray1[i]?.partyType.toUpperCase() === "FARMER"
              ? "BUY"
              : "SELL",
          caBSeq: multiSelectPartnersArray1[i]?.caBSeq,
          caId: clickId,
          lineItems: multiSelectPartnersArray1[i]?.lineItems,
          updatedBy: 0,
          updatedOn: "",
          writerId: writerId,
          source: "WEB",
        });
        objArray1 = [...objArray1, obj];
        console.log(objArray1, obj, "after");
        setObjArrray2([...objArray1]);
      }
    }
  }, []);
  var gTotal = 0;

  // const [lineitemsArray, SetlineitemsArray] = useState([]);
  const getGrossTotalValue = (items, mIndex) => {
    var total = 0;
    var clonedArray = [...items];
    var lineitemsArray = [];
    for (var i = 0; i < items[mIndex].lineItems.length; i++) {
      let obj = { ...items[mIndex].lineItems[i] };
      if (obj.status == 0) {
        obj.total = 0;
      }
      total += obj.total;
      gTotal = total;
      let cObj = { ...items[mIndex] };
      Object.assign(cObj, { grossTotal: total });
      let o = { ...items[mIndex].lineItems[i] };
      Object.assign(o, {
        cropSufx: "",
        mnLotId: 0,
        mnSubLotId: 0,
        cropDelete: false,
        status: fromMultiBillViewStatus
          ? fromPreviousStep3Status
            ? o.status
            : 2
          : 1,
      });
      if (o.rateType == "kgs" || o.rateType == "RATE_PER_KG") {
        o.rateType = "RATE_PER_KG";
        o.status = o.status;
      } else {
        o.rateType = "RATE_PER_UNIT";
        o.status = o.status;
      }
      let mergedObj = {
        ...cObj.lineItems[i],
        ...o,
      };
      // if (o.status != 0) {
      lineitemsArray = [...lineitemsArray, mergedObj];
      // }
      cObj.lineItems = lineitemsArray;
      clonedArray[mIndex] = cObj;
    }

    Object.assign(clonedArray[mIndex], {
      actualPayble: gTotal,
      advance: 0,
      billId: fromMultiBillViewStatus ? items[mIndex].billId : 0,
      billStatus: "COMPLETED",
      caId: clickId,
      cashPaid: 0,
      cashPaidCmnt: "",
      comm: 0,
      commIncluded: true,
      commShown: true,
      comments: commentext,
      createdBy: 0,
      customFields: [
        // {
        //   comments: "",
        //   fee: 0,
        //   field: "",
        //   fieldName: "",
        //   fieldType: "",
        //   less: true,
        // },
      ],
      farmerId: items[mIndex].partyId || items[mIndex].farmerId,
      govtLevies: 0,
      groupId: 0,
      labourCharges: 0,
      less: true,
      mandiFee: 0,
      misc: 0,
      outStBal: 0,
      paidTo: 0,
      rent: 0,
      rtComm: 0,
      rtCommIncluded: true,
      source: "WEB",
      timeStamp: "",
      totalPayble: gTotal,
      transportation: 0,
      updatedBy: 0,
      updatedOn: "",
      writerId: writerId,
    });
    totalGross += clonedArray[mIndex].grossTotal;
    setGrossTotal(totalGross);
    arr1 = [...arr1, clonedArray[mIndex]];
    dispatch(multiSelectPartners(arr1));
    multiSelectPartnersArray1 = arr1;
    console.log(arr1, "att");
  };

  const [transportationVal, setTransportationVal] = useState(
    fromMultiBillViewStatus
      ? billEditedObject?.expenses.transportation != null
        ? billEditedObject?.expenses.transportation
        : 0
      : 0
  );
  const [coolieVal, setCoolieVal] = useState(
    fromMultiBillViewStatus
      ? billEditedObject?.expenses.labourCharges != null
        ? billEditedObject?.expenses.labourCharges
        : 0
      : 0
  );
  const [rentVal, setRentVal] = useState(
    fromMultiBillViewStatus
      ? billEditedObject?.expenses.rent != null
        ? billEditedObject?.expenses.rent
        : 0
      : 0
  );
  const [otherFeeVal, setOtherFeeVal] = useState(
    fromMultiBillViewStatus
      ? billEditedObject?.expenses.others != null
        ? billEditedObject?.expenses.others
        : 0
      : 0
  );
  const advLevOnchangeEvent = (type) => (e) => {
    var val = e.target.value
      .replace(/[^\d.]/g, "") // Remove all characters except digits and dots
      .replace(/^(\d*)(\.\d{0,2})\d*$/, "$1$2") // Allow only one dot and up to two digits after the dot
      .replace(/(\.\d{0,2})\d*/, "$1")
      .replace(/(\.\d*)\./, "$1");
    getAdditionValues(type, val);
  };
  const getAdditionValues = (name, v) => {
    if (name.toLowerCase() == "transportation") {
      setTransportationVal(v);
    }
    if (name.toLowerCase() == "coolie") {
      setCoolieVal(v);
    }
    if (name.toLowerCase() == "rent") {
      setRentVal(v);
    }
    if (name.toLowerCase() == "other_fee") {
      setOtherFeeVal(v);
    }
  };
  const getTotalExpences = () => {
    var expenses =
      Number(transportationVal) +
      Number(coolieVal) +
      Number(rentVal) +
      Number(otherFeeVal);
    return expenses;
  };
  //   click on input to reset 0 to enter value
  const resetInput = (e) => {
    if (e.target.value == 0) {
      e.target.value = "";
    }
  };
  const billRequestObj = {
    buyBills: multiSelectPartnersArray,
    caId: clickId,
    expenses: {
      advance: 0,
      comm: 0,
      govtLevies: 0,
      labourCharges: parseFloat(coolieVal),
      mandiFee: 0,
      misc: 0,
      others: parseFloat(otherFeeVal),
      rent: parseFloat(rentVal),
      rtComm: 0,
      total: getTotalExpences(),
      transportation: parseFloat(transportationVal),
    },
    groupId: 0,
    reqId: 0,
    skipIndividualExpenses: true,
    writerId: writerId,
  };
  // update bill req obj
  const billObj = {
    action: "UPDATE",
    billType: "BUY",
    billsInfo: objArray2,
    caId: clickId,
    expenses: {
      advance:
        billEditedObject?.expenses?.advance == null ||
        billEditedObject?.expenses?.advance == 0
          ? 0
          : billEditedObject?.expenses?.advance,
      comm:
        billEditedObject?.expenses?.comm == null ||
        billEditedObject?.expenses?.comm == 0
          ? 0
          : billEditedObject?.expenses?.comm,
      govtLevies:
        billEditedObject?.expenses?.govtLevies == null ||
        billEditedObject?.expenses?.govtLevies == 0
          ? 0
          : billEditedObject?.expenses?.govtLevies,
      labourCharges: parseFloat(coolieVal),
      mandiFee:
        billEditedObject?.expenses?.mandiFee == null ||
        billEditedObject?.expenses?.mandiFee == 0
          ? 0
          : billEditedObject?.expenses?.mandiFee,
      misc:
        billEditedObject?.expenses?.misc == null ||
        billEditedObject?.expenses?.misc == 0
          ? 0
          : billEditedObject?.expenses?.misc,
      others: parseFloat(otherFeeVal),
      rent: parseFloat(rentVal),
      rtComm:
        billEditedObject?.expenses?.rtComm == null ||
        billEditedObject?.expenses?.rtComm == 0
          ? 0
          : billEditedObject?.expenses?.rtComm,
      total: getTotalExpences(),
      transportation: parseFloat(transportationVal),
    },
    groupId: billEditedObject?.groupId,
    writerId: writerId,
  };
  // post bill request api call

  const postbuybill = () => {
    var arrMain = [];
    if (fromMultiBillViewStatus) {
      billObj.billsInfo.map(function (entry) {
        const objCopy = { ...entry };
        objCopy.comments = commentext;
        objCopy.billDate = moment(slectedBillDateVal).format("YYYY-MM-DD");
        objCopy.billAttributes.billDate = moment(slectedBillDateVal).format("YYYY-MM-DD");
        arrMain.push(objCopy);
        return entry;
      });
      let clonedObject = { ...billObj };
      clonedObject = { ...clonedObject, billsInfo: arrMain };
      console.log(clonedObject, "payload");
      editMultiBuyBill(clonedObject).then(
        (response) => {
          if (response.data.status.type === "SUCCESS") {
            toast.success(response.data.status.message, {
              toastId: "success1",
            });
            console.log(response.data, "success");
            localStorage.setItem("LinkPath", "/buy_bill_book");

            window.setTimeout(function () {
              props.closeModal();
            }, 800);
            window.setTimeout(function () {
              navigate("/buy_bill_book");
              window.location.reload();
            }, 1000);
          }
        },
        (error) => {
          toast.error(error.response.data.status.description, {
            toastId: "error1",
          });
          $("#disable").attr("disabled", false);
        }
      );
    } else {
      billRequestObj.buyBills.map(function (entry) {
        const objCopy = { ...entry };
        objCopy.comments = commentext;
        objCopy.billDate = moment(slectedBillDateVal).format("YYYY-MM-DD");
        if(fromMultiBillViewStatus){
          objCopy.billAttributes.billDate = moment(slectedBillDateVal).format("YYYY-MM-DD");
        }
        arrMain.push(objCopy);
        return entry;
      });
      let clonedObject = { ...billRequestObj };
      clonedObject = { ...clonedObject, buyBills: arrMain };
      console.log(clonedObject)
      postMultiBuyBill(clonedObject).then(
        (response) => {
          if (response.data.status.type === "SUCCESS") {
            toast.success(response.data.status.message, {
              toastId: "success1",
            });
            localStorage.setItem("LinkPath", "/buy_bill_book");

            window.setTimeout(function () {
              props.closeModal();
            }, 800);
            window.setTimeout(function () {
              navigate("/buy_bill_book");
              window.location.reload();
            }, 1000);
          }
        },
        (error) => {
          toast.error(error.response.data.status.description, {
            toastId: "error1",
          });
          $("#disable").attr("disabled", false);
        }
      );
    }
  };
  $("#disable").on("click", function () {
    $("#disable").attr("disabled", true);
  });

  return (
    <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
          <div className="row">
            <div className="col-lg-8">
              <div className="d-flex justify-content-between">
                <h5 className="head_modal">Bill Information</h5>
                <button onClick={() => editCropInfo()}>
                  <img src={edit} alt="img" className="head_modal editIcon" />
                </button>
              </div>
              <div className="bill_step3_scroll" id="scroll_style">
                {multiSelectPartnersArray.map((item, index) => {
                  return (
                    <div className="card step3_card_party">
                      <div className="row party_row">
                        <div className="col-lg-4 partner_card">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                            className=""
                          >
                            {item.profilePic !== "" ? (
                              <img
                                src={item.profilePic}
                                className="icon_user"
                              />
                            ) : (
                              <img src={single_bill} className="icon_user" />
                            )}
                            <div style={{ marginLeft: 5 }}>
                              <div className="-">
                                <h5>
                                  {fromMultiBillViewStatus
                                    ? item.farmerName
                                    : getText(item.partyName) +
                                      " " +
                                      item.shortName}
                                </h5>
                                <h6>
                                  {getPartnerType(item.partyType, item.trader)}{" "}
                                  -{" "}
                                  {fromMultiBillViewStatus
                                    ? item.farmerId
                                    : item.partyId}{" "}
                                  |{" "}
                                  {fromMultiBillViewStatus
                                    ? getMaskedMobileNumber(item.farmerMobile)
                                    : getMaskedMobileNumber(item.mobile)}
                                </h6>
                                <p>
                                  {fromMultiBillViewStatus
                                    ? item.farmerAddress
                                    : item.address?.addressLine}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 partner_card">
                          {item.transporterId != "" ? (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                              className=""
                            >
                              <img src={single_bill} className="icon_user" />

                              <div style={{ marginLeft: 5 }}>
                                <div className="-">
                                  <h5>
                                    {item.transporterName != ""
                                      ? getText(item.transporterName)
                                      : ""}
                                  </h5>
                                  <h6>
                                    {getPartnerType("TRANSPORTER")} -{" "}
                                    {item.transporterId} |{" "}
                                    {getMaskedMobileNumber(
                                      item.transporterMobile
                                    )}
                                  </h6>
                                </div>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="col-lg-4">
                          <div className="partner_card">
                            <DateSelection
                              indexVal={index}
                              fromStep3BillDate={true}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="border_line"></div>
                      <div className="row align-items-center">
                        <div className="col-lg-7">
                          {multiSelectPartnersArray[index].lineItems.length >
                            0 &&
                            multiSelectPartnersArray[index].lineItems.map(
                              (crop, i) => {
                                return crop.status != 0 ? (
                                  <div className="">
                                    <div className="crops_info">
                                      <div
                                        className="edit_crop_item_div p-0"
                                        id="scroll_style"
                                      >
                                        <div className="d-flex align-items-center justify-content-between">
                                          <div className="d-flex">
                                            <div>
                                              <img
                                                src={crop.imageUrl}
                                                className="edit_crop_item"
                                              />
                                            </div>
                                            <div>
                                              <p className="crops-color">
                                                {crop.cropName}
                                              </p>
                                              <p className="crops-color d-flex">
                                                {qtyValues(
                                                  parseFloat(crop.qty),
                                                  crop.qtyUnit,
                                                  parseFloat(crop.weight),
                                                  crop.wastage,
                                                  crop.rateType
                                                )}
                                                &nbsp;|
                                                {" " +
                                                  getCurrencyNumberWithSymbol(
                                                    crop.rate
                                                  )}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                );
                              }
                            )}
                        </div>
                        <div className="col-lg-1"></div>
                        <div className="col-lg-4">
                          <div>
                            <p className="crops-color">Gross Total(₹)</p>
                            <p className="crops-color">{item.grossTotal}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="col-lg-4">
              <h5 className="head_modal">Over All Expenses</h5>
              <div className="card step3_card_party">
                <div className="comm_cards">
                  <div className="row">
                    <div className="col-lg-4 col-sm-12 ps-0">
                      <h5 className="comm_card_sub_title">Transportation</h5>
                    </div>
                    <div className="col-lg-4 col-sm-12">
                      <h5 className="comm_card_sub_title">Coolie</h5>
                    </div>
                    <div className="col-lg-4 col-sm-12">
                      <h5 className="comm_card_sub_title">Rent</h5>
                    </div>
                  </div>
                  <div className="card input_card">
                    <div className="row">
                      <div className="col-lg-4 col-sm-12">
                        <input
                          type="text"
                          placeholder=""
                          onChange={advLevOnchangeEvent("Transportation")}
                          onFocus={(e) => resetInput(e)}
                          value={transportationVal}
                        />
                      </div>
                      <div className="col-lg-4 col-sm-12 col_left_border">
                        <input
                          type="text"
                          placeholder=""
                          onChange={advLevOnchangeEvent("Coolie")}
                          onFocus={(e) => resetInput(e)}
                          value={coolieVal}
                        />
                      </div>
                      <div className="col-lg-4 col-sm-12 col_left_border">
                        <input
                          type="text"
                          placeholder=""
                          onChange={advLevOnchangeEvent("Rent")}
                          onFocus={(e) => resetInput(e)}
                          value={rentVal}
                        />
                        {/* <p className="text-center">{inputText ? inputText : 0.0}</p> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="comm_cards">
                  <div className="row">
                    <div className="col-sm-12 ps-0">
                      <h5 className="comm_card_sub_title">Other Fee</h5>
                    </div>
                  </div>
                  <div className="card input_card">
                    <div className="row">
                      <div className="col-sm-12">
                        <input
                          type="text"
                          placeholder=""
                          onChange={advLevOnchangeEvent("Other_fee")}
                          onFocus={(e) => resetInput(e)}
                          value={otherFeeVal}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="comm_cards">
                  <div className="row">
                    <div className="col-sm-12 ps-0">
                      <h5 className="comm_card_sub_title">Comment</h5>
                    </div>
                  </div>
                  <div className="card input_card">
                    <div className="row">
                      <div className="col-sm-12">
                        <input
                          type="text"
                          placeholder=""
                          onChange={(e) => commentText(e)}
                          value={commentext}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="total_expences_head">Total Expenses</h5>
                  <p className="total_expences_para">
                    Transportation | Coolie | Rent | Other
                  </p>
                  <div className="comm_cards">
                    <div className="card input_card">
                      <div className="row">
                        <div className="col-sm-12">
                          <input
                            type="text"
                            placeholder=""
                            value={
                              getTotalExpences() != 0
                                ? getCurrencyNumberWithSymbol(
                                    getTotalExpences()
                                  )
                                : 0
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row gross_exp_totals">
                <div className="col-lg-2"></div>
                <div className="col-lg-10 p-0">
                  <div className="row">
                    <div className="col-lg-6 pr-0">
                      <p>Total Expenses : </p>
                    </div>
                    <div className="col-lg-6 p-0">
                      <p>
                        {" "}
                        {getTotalExpences() != 0
                          ? getCurrencyNumberWithSymbol(getTotalExpences())
                          : "₹" + 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row gross_exp_totals">
                <div className="col-lg-2"></div>
                <div className="col-lg-10 p-0">
                  <div className="row">
                    <div className="col-lg-6 pr-0">
                      <p>Group Total : </p>
                    </div>
                    <div className="col-lg-6 p-0">
                      <p>{getCurrencyNumberWithSymbol(grossTotal)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
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
            <button
              className="primary_btn"
              id="disable"
              onClick={() => postbuybill()}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Step3;
