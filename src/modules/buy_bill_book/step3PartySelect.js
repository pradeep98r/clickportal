import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import single_bill from "../../assets/images/bills/single_bill.svg";
import d_arrow from "../../assets/images/d_arrow.png";
import Step2Modal from "./step2Modal";
import { useDispatch, useSelector } from "react-redux";
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
} from "../../reducers/billEditItemSlice";
import { selectBuyer } from "../../reducers/buyerSlice";
import SearchField from "../../components/searchField";
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
  console.log(selectedPartyType,"party type");
  const partnerSelectedData =
    selectedPartyType.toLowerCase() === "buyer" || selectedPartyType.toLowerCase() === 'seller'
      ? props.selectedBuyerSellerData
      : props.selectedBuyerSellerData;
      
  const [partySelecteData, setPartySelectedData] = useState(partnerSelectedData);
  const [transpoSelectedData, setTranspoSelectedData] = useState(
    props.transpoSelectedData
  );
  console.log(props.transpoSelectedData,"transpoSelectedData");
  const [getPartyItem, setGetPartyItem] = useState(null);
  const billeditStatus = billEditItemInfo?.billEditStatus;

  console.log(billeditStatus,props.selectedBuyerSellerData,"status");
  const billEditItem = props.billEditItemval;
  var step2CropEditStatus = step2CropEditStatus;
  const [allData, setAllData] = useState([]);
  let [partnerData, setpartnerData] = useState(allData);
  const [selectedDate, setStartDate] = useState(billDateSelected);
  const partnerSelectDate = selectedDate;
  const [outBal, setOutsBal] = useState(0);
  const linkPath = localStorage.getItem('LinkPath');
  useEffect(() => {
    fetchPertnerData(partyType);
    if (billEditItem.transporterId != 0) {
      setTranspoSelectedData(props.transpoSelectedData);
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
      props.billEditItemval
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
  const users = useSelector((state) => state.buyerInfo);
  const partySelect = (item, type) => {
    if (searchValue != "") {
      // setAllData([])
      fetchPertnerData();
    }
    setGetPartyItem(item);
    if (type == "Transporter") {
      setTranspoDataStatus(false);
      setTransportoSelectStatus(true);
      localStorage.setItem("selectedTransporter", JSON.stringify(item));
      var h = JSON.parse(localStorage.getItem("selectedTransporter"));
      setTranspoSelectedData(h);
      props.parentSelectedParty(
        partySelecteData,
        h,
        partnerSelectDate,
        // partnerSelectedData,
  
        outBal
      );
      getOutstandingBal(clickId, item.partyId).then((res) => {
        setOutsBal(res.data.data);
      });
    } else if (type == "Buyer" || type === "BUYER" && linkPath === '/sellbillbook') {
      setTranspoDataStatus(false);
      localStorage.setItem("selectedBuyer", JSON.stringify(item));
      var h = JSON.parse(localStorage.getItem("selectedBuyer"));
      setPartySelectedData(h);
      dispatch(selectBuyer(item));
      console.log(users.buyerInfo,"step3 buyerInfo");
      setPartnerDataStatus(false);
      setPartySelectStatus(true);
      
    } else if (type == "Seller" || type === "FARMER" && linkPath === '/buy_bill_book') {
      setPartySelectedData(item);
      dispatch(selectBuyer(partySelecteData));
      setPartnerDataStatus(false);
      localStorage.setItem("selectedPartner", JSON.stringify(item));
      getOutstandingBal(clickId, item.partyId).then((res) => {
        setOutsBal(res.data.data);
      });
      setPartySelectStatus(true);
    }
    setPartnerType(type);
  };
  console.log(users.buyerInfo,"step3 buyerInfo1");
  const [searchPartyItem, setSearchPartyItem] = useState("");
  const [partnerDataStatus, setPartnerDataStatus] = useState(false);
  const [transpoDataStatus, setTranspoDataStatus] = useState(false);
  const [count, setCount] = useState(0);

  const partnerClick = (type) => {
    console.log(type,"clickType")
    setCount(count + 1);
    if (type == "Buyer" || type.toUpperCase() === 'BUYER') {
      if (count % 2 == 0) {
        setPartnerDataStatus(true);
      } else {
        setPartnerDataStatus(false);
      }
      //setPartnerDataStatus(true);
      setPartnerType("Buyer");
      fetchPertnerData("Buyer");
    } else if (type == "Transporter") {
      if (count % 2 == 0) {
        setTranspoDataStatus(true);
      } else {
        setTranspoDataStatus(false);
      }
      //setTranspoDataStatus(true);
      setPartnerType(type);
      fetchPertnerData(type);
    } else if (type == "Seller" || type.toUpperCase() === 'FARMER') {
      if (count % 2 == 0) {
        setPartnerDataStatus(true);
      } else {
        setPartnerDataStatus(false);
      }
      //setPartnerDataStatus(true);
      setPartnerType(type);
      fetchPertnerData("Seller");
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
      console.log(cropEditArray,props.billEditItemval)
    step2CropEditStatus = true;
    dispatch(selectSteps("step2"));
    setShowCropModalStatus(true);
    setShowCropModal(true);
    setcropEditvalArray(cropEditArray);
    dispatch(editStatus(billeditStatus));
    dispatch(billDate(partnerSelectDate));
    dispatch(selectedParty(selectedPartyType));
    dispatch(tableEditStatus(true));
    props.parentSelectedParty(
      //   partnerSelectDate,
      partnerSelectedData,
      transpoSelectedData,
      //   true,
      cropEditArray,
      props.billEditItemval
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
    } else if(value === ""){
      setpartnerData(allData);
    }
    setsearchValue(value);
  };

  return (
    <div className="">
      <h5 className="head_modal">Bill Information </h5>
      {partySelecteData !== null?(
      <div className="party_div">
        <div
          className="selectparty_field d-flex align-items-center justify-content-between"
          onClick={() => partnerClick(partySelecteData.partyType)}//"Buyer")}
        >
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
                      : billEditItem.buyerMobile
                    : partySelecteData.mobile}
                </h6>
                <p>{partnerData.buyerAddress}</p>
              </div>
            </div>
          </div>
          <img src={d_arrow} />
        </div>
      </div>
      ):('')}
      {partnerDataStatus?(
      <div className="partners_div" id="scroll_style">
        <div className="d-flex searchparty" role="search">
            <SearchField
                placeholder={langFullData.search}
                onChange={(event) => {
                  handleSearch(event);
                }}
              />
          {/* <input
            className="form-control mb-0"
            type="search"
            placeholder="Search"
            aria-label="Search"
            onChange={(event) => setSearchPartyItem(event.target.value)}
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
                      onClick={() => partySelect(item, partySelecteData.partyType)}
                      className={
                        "nav-item " +
                        (item.partyId == getPartyItem?.partyId ? "active_class" : "")
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
            <p></p>
          )}
        </div>
      </div>
      ):('')}
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
            <img src={d_arrow} />
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
        <div className="partners_div" id="scroll_style">
          <div className="d-flex searchparty" role="search">
            <SearchField
                placeholder={langFullData.search}
                onChange={(event) => {
                  handleSearch(event);
                }}
              />
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
              <p></p>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      <h5 className="date_sec head_modal">Crop Information </h5>
      <div className="selectparty_field edit_crop_item_div">
        <div className="d-flex align-items-center justify-content-between">
          <p className="d-flex align-items-center">
            {billeditStatus ? (
              <div className="d-flex">
                <img
                  src={billEditItem.lineItems[0]?.imageUrl}
                  className="edit_crop_item"
                />
                <p className="edit_crop_item_len d-flex align-items-center">
                  <p>{billEditItem.lineItems[0]?.length}</p>
                  <span className="ml-3">Crops</span>
                </p>
              </div>
            ) : (
              <div className="d-flex">
                <img
                  src={billEditItem[0].imageUrl}
                  className="edit_crop_item"
                />
                <p className="edit_crop_item_len d-flex align-items-center">
                  <p>{props.billEditItemval.length}</p>
                  <span className="ml-3">Crops</span>
                </p>
              </div>
            )}
          </p>
          <p onClick={() => editCropTable(billEditItem)}>Edit</p>
        </div>
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
