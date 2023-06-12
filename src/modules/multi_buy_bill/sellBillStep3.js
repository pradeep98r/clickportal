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
import { editMultiBuyBill, postMultiBuyBill, postMultiSellBill } from "../../actions/multiBillService";
import { useNavigate } from "react-router-dom";
const SellMultiBillStep3 = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedStep = useSelector((state) => state.multiStepsInfo);
  const multiSelectPartnersArray = selectedStep?.fromMultiBillView
  ? selectedStep?.multiSelectPartners
  : selectedStep?.multiSelectPartners;
const fromMultiBillViewStatus = selectedStep?.fromMultiBillView;
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
  var [arr1, setArr1] = useState([]);
  const billEditedObject = selectedStep?.totalEditedObject;
  const cancelStep = () => {
    dispatch(multiSelectPartners([]));
    props.closeModal();
  };
  const previousStep = () => {
    dispatch(multiStepsVal("step2"));
    dispatch(fromPreviousStep3(true))
  };
  const editCropInfo = () => {
    dispatch(multiStepsVal("step2"));
  };
  var totalGross = 0;
  const [grossTotal, setGrossTotal] = useState(0);
  const[objArray1, setObjArrray1] = useState([]);
  var obj = {};
  useEffect(() => {
    console.log(multiSelectPartnersArray, "array step3");
    if (multiSelectPartnersArray.length > 0) {
      for (var i = 0; i < multiSelectPartnersArray.length; i++) {
        getGrossTotalValue(multiSelectPartnersArray, i);
      }
    }
    for(var i = 0; i<multiSelectPartnersArray.length; i++){
      Object.assign(obj, {
        action: "UPDATE",
        billAttributes: {
          actualPayRecieevable:gTotal,
          advance: multiSelectPartnersArray[i]?.advance,
          billDate: multiSelectPartnersArray[i]?.billDate,
          cashPaid:
          multiSelectPartnersArray[i]?.partyType.toUpperCase() === "FARMER" ? multiSelectPartnersArray[i]?.cashPaid : 0,
          cashRcvd:
          multiSelectPartnersArray[i]?.partyType.toUpperCase() === "BUYER" ? multiSelectPartnersArray[i]?.cashRcvd : 0,
          comm: multiSelectPartnersArray[i]?.comm,
          commIncluded: multiSelectPartnersArray[i]?.commIncluded,
          comments: multiSelectPartnersArray[i]?.comments,
          govtLevies: multiSelectPartnersArray[i]?.govtLevies,
          grossTotal: gTotal,
          labourCharges: multiSelectPartnersArray[i]?.labourCharges,
          less: multiSelectPartnersArray[i]?.less,
          mandiFee: multiSelectPartnersArray[i]?.mandiData,
          misc:
          multiSelectPartnersArray[i]?.partyType.toUpperCase() === "FARMER"
              ? multiSelectPartnersArray[i]?.otherFee
              : multiSelectPartnersArray[i]?.misc,
          otherFee:
          multiSelectPartnersArray[i]?.partyType.toUpperCase() === "FARMER"
              ? multiSelectPartnersArray[i]?.misc
              :multiSelectPartnersArray[i]?.otherFee,
    
          outStBal: multiSelectPartnersArray[i]?.outStBal,
          paidTo: 0,
          partyId:
          multiSelectPartnersArray[i]?.partyType.toUpperCase() === "FARMER"
              ? multiSelectPartnersArray[i]?.buyerId
              : multiSelectPartnersArray[i]?.farmerId,
          rent: multiSelectPartnersArray[i]?.rent,
          rtComm: multiSelectPartnersArray[i]?.rtComm,
          rtCommIncluded: multiSelectPartnersArray[i]?.rtCommIncluded,
          totalPayRecieevable: gTotal,
          transportation: multiSelectPartnersArray[i]?.transportation,
          transporterId: multiSelectPartnersArray[i]?.transporterId,
        },
        billId: multiSelectPartnersArray[i]?.billId,
        billType: multiSelectPartnersArray[i]?.partyType.toUpperCase() === "FARMER" ? "BUY" : "SELL",
        caBSeq: multiSelectPartnersArray[i]?.caBSeq,
        caId: clickId,
        lineItems: multiSelectPartnersArray[i]?.lineItems,
        updatedBy: 0,
        updatedOn: "",
        writerId: writerId,
        source: "WEB",
      })
      setObjArrray1([...objArray1, obj])
    }
  }, []);
  var gTotal = 0;

  const getGrossTotalValue = (items, mIndex) => {
    var total = 0;
    var clonedArray = [...items];
    var lineitemsArray = [];
    for (var i = 0; i < items[mIndex].lineItems.length; i++) {
      let obj = { ...items[mIndex].lineItems[i] };
      total += obj.total;
      gTotal = total;
      let cObj = { ...items[mIndex] };
      Object.assign(cObj, { grossTotal: total });
      let o = { ...items[mIndex].lineItems[i] };
      Object.assign(o, {
        buyerId: 0,
        cropSufx: "",
        id: 0,
        mnLotId: 0,
        mnSubLotId: 0,
      });
      if(o.rateType == 'kgs'){
        o.rateType = 'RATE_PER_KG';
      }
      else{
        o.rateType = 'RATE_PER_UNIT';
      }
      let mergedObj = {
        ...cObj.lineItems[i],
        ...o
    };
    lineitemsArray = [...lineitemsArray, mergedObj];
     cObj.lineItems = lineitemsArray;
      clonedArray[mIndex] = cObj;
      console.log(mergedObj,cObj)
    }
    Object.assign(clonedArray[mIndex], {
      actualReceivable: gTotal,
      advance: 0,
      billId: 0,
      billStatus: "COMPLETED",
      caId: clickId,
      cashRcvd: 0,
      cashRcvdCmnt: "",
      comm: 0,
      commIncluded: true,
      commShown: true,
      comments: "",
      createdBy: 0,
      customFields: [
      ],
      buyerId: items[mIndex].partyId,
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
      totalReceivable: gTotal,
      transportation: 0,
      updatedBy: 0,
      updatedOn: "",
      writerId: writerId,
    });
    totalGross += clonedArray[mIndex].grossTotal;
    setGrossTotal(totalGross);
    arr1 = [...arr1, clonedArray[mIndex]];
    dispatch(multiSelectPartners(arr1));
  };

  const [transportationVal, setTransportationVal] = useState(fromMultiBillViewStatus ? (billEditedObject?.expenses.transportation != null ? billEditedObject?.expenses.transportation : 0) : 0);
  const [coolieVal, setCoolieVal] = useState(fromMultiBillViewStatus ? (billEditedObject?.expenses.labourCharges != null ? billEditedObject?.expenses.labourCharges : 0) : 0);
  const [rentVal, setRentVal] = useState(fromMultiBillViewStatus ? (billEditedObject?.expenses.rent != null ? billEditedObject?.expenses.rent : 0) : 0);
  const [otherFeeVal, setOtherFeeVal] = useState(fromMultiBillViewStatus ? (billEditedObject?.expenses.others != null ? billEditedObject?.expenses.others : 0) : 0 );
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
    sellBills: multiSelectPartnersArray,
    caId: clickId,
    expenses: {
      advance: 0,
      comm: 0,
      govtLevies: 0,
      labourCharges: parseFloat(coolieVal),
      mandiFee: parseFloat(otherFeeVal),
      misc: 0,
      others: 0,
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
    billType:"SELL" ,
    billsInfo: objArray1,
    caId: clickId,
    expenses: {
      advance: (billEditedObject?.expenses?.advance == null || billEditedObject?.expenses?.advance ==0) ? 0 : billEditedObject?.expenses?.advance,
      comm: (billEditedObject?.expenses?.comm == null || billEditedObject?.expenses?.comm ==0) ? 0 :billEditedObject?.expenses?.comm,
      govtLevies: (billEditedObject?.expenses?.govtLevies == null || billEditedObject?.expenses?.govtLevies ==0) ? 0 :billEditedObject?.expenses?.govtLevies,
      labourCharges:coolieVal,
      mandiFee: (billEditedObject?.expenses?.mandiFee == null || billEditedObject?.expenses?.mandiFee ==0) ? 0 :billEditedObject?.expenses?.mandiFee,
      misc: (billEditedObject?.expenses?.misc == null || billEditedObject?.expenses?.misc ==0) ? 0 :billEditedObject?.expenses?.misc,
      others: otherFeeVal,
      rent: rentVal,
      rtComm:(billEditedObject?.expenses?.rtComm == null || billEditedObject?.expenses?.rtComm ==0) ? 0 : billEditedObject?.expenses?.rtComm,
      total:getTotalExpences(),
      transportation:transportationVal
    },
    groupId: billEditedObject?.groupId,
    writerId: writerId
  }
  // post bill request api call
  const postbuybill = () => {
    console.log(billRequestObj, "payload");
    if(fromMultiBillViewStatus){
      editMultiBuyBill(billObj).then(
        (response) => {
          if (response.data.status.type === "SUCCESS") {
            toast.success(response.data.status.message, {
              toastId: "success1",
            });
            console.log(response.data, "success");
            localStorage.setItem("LinkPath", "/sellbillbook");
  
            window.setTimeout(function () {
              props.closeModal();
            }, 800);
            // window.setTimeout(function () {
            //   navigate("/sellbillbook");
            //   window.location.reload();
            // }, 1000);
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
    else{
      postMultiSellBill(billRequestObj).then(
        (response) => {
          if (response.data.status.type === "SUCCESS") {
            toast.success(response.data.status.message, {
              toastId: "success1",
            });
            console.log(response.data, "success");
            localStorage.setItem("LinkPath", "/sellbillbook");
  
            window.setTimeout(function () {
              props.closeModal();
            }, 800);
            window.setTimeout(function () {
              navigate("/sellbillbook");
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
                                    ? item.buyerName
                                    : getText(item.partyName) +
                                      " " +
                                      item.shortName}
                                </h5>
                                <h6>
                                  {getPartnerType(item.partyType, item.trader)}{" "}
                                  - {(fromMultiBillViewStatus ? item.buyerId : item.partyId)} |{" "}
                                  {getMaskedMobileNumber(item.mobile)}
                                </h6>
                                <p>{item.address?.addressLine}</p>
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
                                return (
                                    <div className="crops_info">
                                      <div
                                        className="edit_crop_item_div p-0"
                                        id="scroll_style"
                                      >
                                        <div className="d-flex align-items-center">
                                          
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
                                                ) }
                                                  &nbsp;|
                                                  { ' ' + getCurrencyNumberWithSymbol(
                                                    crop.rate
                                                  )}
                                              </p>
                                            </div>
                                        </div>
                                      </div>
                                    </div>
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
                        <input type="text" placeholder="" />
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
                      <p> { getTotalExpences() != 0 ? getCurrencyNumberWithSymbol(getTotalExpences()) : ('₹' + 0)}</p>
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
export default SellMultiBillStep3;
