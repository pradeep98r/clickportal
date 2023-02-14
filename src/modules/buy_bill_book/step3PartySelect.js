import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import single_bill from "../../assets/images/bills/single_bill.svg";
import d_arrow from "../../assets/images/d_arrow.png";
import Step2Modal from "./step2Modal";
import { useDispatch, useSelector } from "react-redux";
import edit from "../../assets/images/edit_round.svg";
import {
  getPartnerData,
  getOutstandingBal,
} from "../../actions/billCreationService";
import BillDateSelection from "./billDateSelection";
import { selectSteps } from "../../reducers/stepsSlice";
import {
  selectBill,
  editStatus,
  billDate,
  tableEditStatus,
  billViewStatus,
  selectedParty,
  fromBillbook,
} from "../../reducers/billEditItemSlice";
import { selectBuyer } from "../../reducers/buyerSlice";
import SearchField from "../../components/searchField";
import { selectTrans } from "../../reducers/transSlice";
import { qtyValues } from "../../components/qtyValues";
import NoDataAvailable from "../../components/noDataAvailable";
const Step3PartySelect = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const billEditItemInfo = useSelector((state) => state.billEditItemInfo);
  const billDateSelected = billEditItemInfo?.selectedBillDate;
  const selectedPartyType = billEditItemInfo?.selectedPartyType;
  var step2CropEditStatus = billEditItemInfo?.step2CropEditStatus;
  const clickId = loginData.caId;
  const [partyType, setPartnerType] = useState(selectedPartyType);
  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);
  const partnerSelectedData =
    selectedPartyType.toLowerCase() === "buyer" ||
    selectedPartyType.toLowerCase() === "seller"
      ? props.selectedBuyerSellerData
      : props.selectedBuyerSellerData;
  const [partySelecteData, setPartySelectedData] =
    useState(partnerSelectedData);
  const [transpoSelectedData, setTranspoSelectedData] = useState(
    props.transpoSelectedData
  );

  const [getPartyItem, setGetPartyItem] = useState(null);
  const billeditStatus = billEditItemInfo?.billEditStatus;
  const billEditItem = props.billEditItemval;
  var billEditItemCrops = billeditStatus
    ? step2CropEditStatus
      ? props.selectedCrop
      : props.billEditItemval.lineItems
    : props.billEditItemval;
  var step2CropEditStatus = step2CropEditStatus;
  const [allData, setAllData] = useState([]);
  let [partnerData, setpartnerData] = useState(allData);
  const [selectedDate, setStartDate] = useState(billDateSelected);
  const partnerSelectDate = selectedDate;
  const [outBal, setOutsBal] = useState(0);
  const linkPath = localStorage.getItem("LinkPath");
  
  useEffect(() => {
    console.log(billEditItem, billEditItemCrops, "cropsitems");
    fetchPertnerData(partyType);
    if (billEditItem.transporterId != 0) {
      console.log("Came to here0")
      dispatch(selectTrans(props.transpoSelectedData));
      setTranspoSelectedData(props.transpoSelectedData)
    } else {
      setTranspoSelectedData(null);
    }
    if (partnerSelectedData != null) {
      getOutstandingBal(clickId, partnerSelectedData.partyId).then((res) => {
        setOutsBal(res.data.data == null ? 0 : res.data.data);
      });
    }
    props.parentSelectedParty(
      //   partnerSelectDate,
      partySelecteData,
      // partnerSelectedData,
      transpoSelectedData,
      //   true,
      cropEditvalArray,
      props.billEditItemval,
      props.selectedCrop,
      transpoStatus
    );
  }, []);
  const fetchPertnerData = (type) => {
    var partnerType = "Buyer";
    if (type == "Transporter") {
      partnerType = "TRANSPORTER";
    } else if (type == "Buyer") {
      partnerType = "BUYER";
    }
    if (type == "Seller") {
      partnerType = "FARMER";
    }
    getPartnerData(clickId, partnerType)
      .then((response) => {
        setAllData(response.data.data);
        setpartnerData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const callbackFunctionDate = (date) => {
    setStartDate(date);
  };
  const [partySelectStatus, setPartySelectStatus] = useState(false);
  const [transportoSelectStatus, setTransportoSelectStatus] = useState(false);
  const [transpoStatus, setTranspoStatus] = useState(false);
  const partySelect = (item, type) => {
    console.log(item, type, "type");
    setActiveInput(false);
    if (searchValue != "") {
      // setAllData([])
      fetchPertnerData();
    }
    setGetPartyItem(item);
    if (type == "Transporter") {
      setActiveTrans(false);
      setTranspoDataStatus(false);
      setTransportoSelectStatus(true);
      Object.assign(item,{transporterId:item.partyId})
      localStorage.setItem("selectedTransporter", JSON.stringify(item));
      var h = JSON.parse(localStorage.getItem("selectedTransporter"));
      setTranspoSelectedData(h);
      props.parentSelectedParty(
        partySelecteData,
        h,
        partnerSelectDate,
        // partnerSelectedData,

        outBal,
        transpoStatus
      );
      getOutstandingBal(clickId, item.partyId).then((res) => {
        setOutsBal(res.data.data);
      });
      setTranspoStatus(true)
    } else if (
      type == "Buyer" ||
      (type === "BUYER" && linkPath === "/sellbillbook")
    ) {
      setTranspoDataStatus(false);
      localStorage.setItem("selectedBuyer", JSON.stringify(item));
      var h = JSON.parse(localStorage.getItem("selectedBuyer"));
      setPartySelectedData(h);
      dispatch(selectBuyer(item));
      setPartnerDataStatus(false);
      setPartySelectStatus(true);
    } else if (
      type == "Seller" ||
      (type === "FARMER" && linkPath === "/buy_bill_book")
    ) {
      setPartySelectedData(item);
      dispatch(selectBuyer(item));
      // dispatch(selectBuyer(partySelecteData));
      setPartnerDataStatus(false);
      localStorage.setItem("selectedPartner", JSON.stringify(item));
      getOutstandingBal(clickId, item.partyId).then((res) => {
        setOutsBal(res.data.data);
      });
      setPartySelectStatus(true);
    }
    setPartnerType(type);
  };
  const [searchPartyItem, setSearchPartyItem] = useState("");
  const [partnerDataStatus, setPartnerDataStatus] = useState(false);
  const [transpoDataStatus, setTranspoDataStatus] = useState(false);
  const [count, setCount] = useState(0);

  const [activeInput, setActiveInput] = useState(false);
  const [activeTrans, setActiveTrans] = useState(false);
  const partnerClick = (type) => {
    console.log("came to here", type);
    setCount(count + 1);
    if (type == "Buyer" || type.toUpperCase() === "BUYER") {
      if(billeditStatus){
        setActiveInput(false);
      } else{
        setActiveInput(true);
        setActiveTrans(false);
        setPartnerDataStatus(true);
        setTranspoDataStatus(false);
        setPartnerType("Buyer");
        fetchPertnerData("Buyer");
      }
      
    } else if (type == "Transporter") {
      setActiveTrans(true);
      setActiveInput(false);
      setTranspoDataStatus(true);
      setPartnerDataStatus(false);
      setPartnerType(type);
      fetchPertnerData(type);
    } else if (type == "Seller" || type.toUpperCase() === "FARMER") {
      if(billeditStatus){
        setActiveInput(false);
      } else{
        setActiveInput(true);
        setActiveTrans(false);
        setPartnerDataStatus(true);
        setTranspoDataStatus(false);
        setPartnerType(type);
        fetchPertnerData("Seller");
      }  
    }
  };
  const [showCropModal, setShowCropModal] = useState(false);
  const [showCropModalStatus, setShowCropModalStatus] = useState(false);
  const [cropEditvalArray, setcropEditvalArray] = useState([]);
  const editCropTable = (cropEditArray) => {
    step2CropTableOnclick(cropEditArray);
  };
  const dispatch = useDispatch();
  const step2CropTableOnclick = (cropEditArray) => {
    step2CropEditStatus = true;
    dispatch(selectSteps("step2"));
    setShowCropModalStatus(true);
    setShowCropModal(true);
    setcropEditvalArray(cropEditArray);
    dispatch(editStatus(billeditStatus));
    dispatch(billDate(partnerSelectDate));
    dispatch(selectedParty(selectedPartyType));
    dispatch(tableEditStatus(true));
    dispatch(fromBillbook(false));
    dispatch(selectTrans(transpoSelectedData));
    props.parentSelectedParty(
      //   partnerSelectDate,
      partnerSelectedData,
      transpoSelectedData,
      //   true,
      cropEditArray,
      props.billEditItemval,
      props.selectedCrop,
      transpoStatus
      
    );
  };
  const [searchValue, setsearchValue] = useState("");
  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = allData.filter((data) => {
      if (data.mobile.includes(value)) {
        return data.mobile.search(value) != -1;
      } else if (data.partyName.toLowerCase().includes(value)) {
        return data.partyName.toLowerCase().search(value) != -1;
      } else if (data.partyId.toString().includes(value)) {
        return data.partyId.toString().search(value) != -1;
      }
    });
    if (value != "") {
      setpartnerData(result);
    } else if (value === "") {
      setpartnerData(allData);
    }
    else{
      setpartnerData([]);
    }
    setsearchValue(value);
  };
  const getQuantityType = (unit) => {
    var string = "";
    switch (unit.toUpperCase()) {
      case "CRATES":
        string = "C";
        break;
      case "BAGS":
        string = "Bg";
        break;
      case "BOXES":
        string = "BX";
        break;
      case "SACS":
        string = "S";
        break;
      case "LOADS":
        string = "LDS";
        break;
      case "KGS":
        string = "KGS";
        break;
      case "PIECES":
        string = "P";
        break;
      default:
        string = "";
    }
    return string;
  };
  return (
    <div className="">
      <h5 className="head_modal">Bill Information </h5>
      {partySelecteData !== null ? (
        <div className="party_div">
          <div
            className="selectparty_field d-flex align-items-center justify-content-between"
            onClick={() => partnerClick(partySelecteData.partyType)} //"Buyer")}
          >
            {activeInput ? (
              <div className="party_div">
                <div className="party_div search_control_div" role="search">
                  <input
                    type="text"
                    className="form-control search_control"
                    placeholder={
                      "Type " + partySelecteData.partyType + " Name Here"
                    }
                    onChange={(event) => {
                      handleSearch(event);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="partner_card">
                <div className="d-flex align-items-center">
                  <img src={single_bill} className="icon_user" />
                  <div>
                    <h5>
                      {billeditStatus
                        ? partySelectStatus
                          ? partySelecteData.partyName
                          : billEditItem.partyType == "FARMER"
                          ? billEditItem.farmerName
                          : billEditItem.buyerName
                        : partySelecteData.partyName}
                    </h5>
                    <h6>
                      {billeditStatus
                        ? partySelectStatus
                          ? partySelecteData.partyType
                          : billEditItem.partyType
                        : partySelecteData.partyType}{" "}
                      -{" "}
                      {billeditStatus
                        ? partySelectStatus
                          ? partySelecteData.partyId
                          : billEditItem.partyType == "FARMER"
                          ? billEditItem.farmerId
                          : billEditItem.buyerId
                        : partySelecteData.partyId}{" "}
                      |{" "}
                      {billeditStatus
                        ? partySelectStatus
                          ? partySelecteData.mobile
                          : billEditItem.partyType == "FARMER"
                          ? billEditItem.farmerMobile
                          : billEditItem.mobile
                        : partySelecteData.mobile}
                    </h6>
                    <p>{partnerData.buyerAddress}</p>
                  </div>
                </div>
              </div>
            )}
            {billeditStatus ? "" : <img src={d_arrow} />}
          </div>
        </div>
      ) : (
        ""
      )}
      {partnerDataStatus ? (
        <div className="partners_div step3_partners_div" id="scroll_style">
          <div className="d-flex searchparty" role="search">
          </div>
          <div>
            {partnerData.length > 0 ? (
              <div>
                <ul>
                  {partnerData.map((item) => {
                    return (
                      <li
                        key={item.partyId}
                        onClick={() =>
                          partySelect(item, partySelecteData.partyType)
                        }
                        className={
                          "nav-item " +
                          (item.partyId == getPartyItem?.partyId
                            ? "active_class"
                            : "")
                        }
                      >
                        <div className="partner_card">
                          <div className="d-flex align-items-center">
                            <img src={single_bill} className="icon_user" />
                            <div>
                              <h5>{item.partyName}</h5>
                              <h6>
                                {item.trader ? "TRADER" : item.partyType} -{" "}
                                {item.partyId} | {item.mobile}
                              </h6>
                              <p>{item.address.addressLine}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
            <NoDataAvailable/>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="date_sec date_step3">
        <BillDateSelection
          parentCallbackDate={callbackFunctionDate}
          billDate={selectedDate}
        />
      </div>
      {transpoSelectedData != null ? (
        <div className="transporter_div">
          <div
            className="selectparty_field d-flex align-items-center justify-content-between"
            onClick={() => partnerClick("Transporter")}
          >
            {activeTrans ? (
              <div className="party_div">
                <div className="party_div search_control_div" role="search">
                  <input
                    type="text"
                    className="form-control search_control"
                    placeholder={"Type " + "Transporter" + " Name Here"}
                    onChange={(event) => {
                      handleSearch(event);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="partner_card">
                <div className="d-flex align-items-center">
                  <img src={single_bill} className="icon_user" />
                  <div>
                    <h5>
                      {billeditStatus
                        ? transportoSelectStatus
                          ? transpoSelectedData.partyName
                          : billEditItem.transporterName
                        : transpoSelectedData.partyName}
                      {/* {transpoSelectedData.partyName} */}
                    </h5>
                    <h6>
                      {/* {transpoSelectedData.mobile } */}
                      {billeditStatus
                        ? transportoSelectStatus
                          ? transpoSelectedData.partyType +
                            "-" +
                            transpoSelectedData.partyId +
                            " | " +
                            transpoSelectedData.mobile
                          : "TRANSPORTER" + "-" + billEditItem.transporterId
                        : transpoSelectedData.partyType +
                          "-" +
                          transpoSelectedData.partyId +
                          " | " +
                          transpoSelectedData.mobile}
                    </h6>
                    <p>
                      {billeditStatus
                        ? transportoSelectStatus
                          ? transpoSelectedData?.address?.addressLine
                          : ""
                        : transpoSelectedData?.address?.addressLine}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <img src={d_arrow} />
          </div>
        </div>
      ) : activeTrans ? (
        <div className="party_div selectparty_field d-flex align-items-center justify-content-between">
          <div className="party_div search_control_div" role="search">
            <input
              type="text"
              className="form-control search_control"
              placeholder={"Type " + "Transporter" + " Name Here"}
              onChange={(event) => {
                handleSearch(event);
              }}
            />
          </div>
        </div>
      ) : (
        <p
          onClick={() => partnerClick("Transporter")}
          className="select_transporter"
        >
          Select Transporter
        </p>
      )}
      {transpoDataStatus ? (
        <div className="partners_div step3_partners_div" id="scroll_style">
          <div className="d-flex searchparty" role="search">
            {/* <SearchField
              placeholder={langFullData.search}
              onChange={(event) => {
                handleSearch(event);
              }}
            /> */}
          </div>

          <div>
            {partnerData.length > 0 ? (
              <div>
                <ul>
                  {partnerData.map((item) => {
                    return (
                      <li
                        key={item.partyId}
                        onClick={() => partySelect(item, "Transporter")}
                        className={
                          "nav-item " +
                          (item == getPartyItem ? "active_class" : "")
                        }
                      >
                        <div className="partner_card">
                          <div className="d-flex align-items-center">
                            <img src={single_bill} className="icon_user" />
                            <div>
                              <h5>{item.partyName}</h5>
                              <h6>
                                {item.partyType} -{" "}
                                {item.partyId} | {item.mobile}
                              </h6>
                              <p>{item.address.addressLine}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <NoDataAvailable/>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="d-flex align-items-center justify-content-between">
        <h5 className="date_sec head_modal p-0">Crop Information </h5>
        <img
          src={edit}
          alt="img"
          className="head_modal"
          onClick={() => editCropTable(billEditItem)}
        />
      </div>

      <div>
        {/* <p className="d-flex align-items-center"> */}

        <div className="cropstable" id="scroll_style">
          {billEditItemCrops.length > 0
            ? billEditItemCrops.map((item, i) => {
                return !billEditItemCrops[i].cropDelete ? (
                  <div className="crops_info">
                    <div
                      className="selectparty_field edit_crop_item_div"
                      id="scroll_style"
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex">
                          <div>
                            <img
                              src={item.imageUrl}
                              className="edit_crop_item"
                            />
                          </div>
                          <div>
                            <p className="crops-color">{item.cropName}</p>
                            <p className="crops-color">
                              {qtyValues(
                                parseInt(item.qty),
                                item.qtyUnit,
                                parseInt(item.weight),
                                parseInt(item.wastage),
                                item.rateType
                              )}
                              {/* {item.qty ? item.qty : ''}{" "}
                                {item.qty ?getQuantityType(item.qtyUnit) + " | ":''}
                                {item.weight ? item.weight + ' KGS ' : ''}
                                <span className='wastage-color'>{item.wastage ? ' - ' : ''}{item.wastage ? item.wastage + ' KGS ' : ''}</span> */}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="crops-color">Total</p>
                          <p className="crops-color">
                            {item.total ? item.total.toFixed(2) : 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                );
              })
            : ""}
        </div>

        {/* </p> */}

        {/* <p onClick={() => editCropTable(billEditItem)}>Edit</p> */}
      </div>

      {/* {showCropModalStatus ? (
        <Step2Modal
          showCrop={showCropModal}
          closeCropModal={() => setShowCropModal(false)}
          cropTableEditStatus={true}
          cropEditObject={cropEditvalArray}
          billEditStatus={editStatus ? true : false}
          slectedCropstableArray={props.billEditItemval}
          selectedPartyType={props.selectedPartyType}
          selectedBilldate={selectedDate}
          selectedBuyerSellerData={props.selectedBuyerSellerData}
        />
      ) : (
        ""
      )} */}
    </div>
  );
};
export default Step3PartySelect;
