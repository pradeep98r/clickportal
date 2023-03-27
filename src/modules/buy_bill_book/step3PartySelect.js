import { useState, useEffect } from "react";
import single_bill from "../../assets/images/bills/single_bill.svg";
import d_arrow from "../../assets/images/d_arrow.png";
import { useDispatch, useSelector } from "react-redux";
import edit from "../../assets/images/edit_round.svg";
import { getPartnerType, getText } from "../../components/getText";
import Select from "react-select";
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
import { getMaskedMobileNumber } from "../../components/getCurrencyNumber";
const colourStyles = {
  menuList: (styles) => ({
    ...styles,
    background: "white",
    padding: "0px 10px",
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    background: isFocused ? "#D7F3DD" : isSelected ? "#D7F3DD" : undefined,
    zIndex: 1,
    border: isFocused
      ? "1px solid #16A12C"
      : isSelected
      ? "1px solid #16A12C"
      : undefined,
    borderRadius: isFocused ? "10px" : isSelected ? "10px" : undefined,
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";

    return { ...provided, opacity, transition };
  },
  menu: (base) => ({
    ...base,
    zIndex: 100,
    padding: "10px 0px",
  }),
};
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
  const filterOption = (option, inputValue) => {
    const { partyName, mobile, shortName, partyId } = option.data;
    const addressLine = option.data.address?.addressLine;
    const searchValue = inputValue.toLowerCase();

    return (
      partyName.toLowerCase().includes(searchValue) ||
      mobile.toLowerCase().includes(searchValue) ||
      shortName.toLowerCase().includes(searchValue) ||
      partyId.toString().includes(searchValue) ||
      addressLine?.toLowerCase().includes(searchValue)
    );
  };
  useEffect(() => {
    fetchPertnerData(partyType);
    if (billEditItem.transporterId != 0) {
      dispatch(selectTrans(props.transpoSelectedData));
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
    setActiveInput(false);
    fetchPertnerData();
    setGetPartyItem(item);
    if (item.partyType.toLowerCase() == "transporter") {
      setActiveTrans(false);
      setTranspoDataStatus(false);
      setTransportoSelectStatus(true);
      Object.assign(item, { transporterId: item.partyId });
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
      setTranspoStatus(true);
    } else if (
      item.partyType.toLowerCase() == "buyer" ||
      (item.partyType.toUpperCase() === "BUYER" && linkPath === "/sellbillbook")
    ) {
      setTranspoDataStatus(false);
      localStorage.setItem("selectedBuyer", JSON.stringify(item));
      var h = JSON.parse(localStorage.getItem("selectedBuyer"));
      setPartySelectedData(h);
      dispatch(selectBuyer(item));
      setPartnerDataStatus(false);
      setPartySelectStatus(true);
    } else if (
      item.partyType.toLowerCase() == "seller" ||
      (item.partyType.toUpperCase() === "FARMER" &&
        linkPath === "/buy_bill_book")
    ) {
      setPartySelectedData(item);
      dispatch(selectBuyer(item));
      // dispatch(selectBuyer(partySelecteData));
      setPartnerDataStatus(false);
      localStorage.setItem("selectedPartner", JSON.stringify(item));
      dispatch(selectBuyer(item));
      getOutstandingBal(clickId, item.partyId).then((res) => {
        setOutsBal(res.data.data);
      });
      setPartySelectStatus(true);
    }
    setPartnerType(item.partyType);
  };
  const [searchPartyItem, setSearchPartyItem] = useState("");
  const [partnerDataStatus, setPartnerDataStatus] = useState(false);
  const [transpoDataStatus, setTranspoDataStatus] = useState(false);
  const [count, setCount] = useState(0);

  const [activeInput, setActiveInput] = useState(false);
  const [activeTrans, setActiveTrans] = useState(false);
  const partnerClick = (type) => {
    setCount(count + 1);
    if (type == "Buyer" || type.toUpperCase() === "BUYER") {
      if (billeditStatus) {
        setActiveInput(false);
      } else {
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
      if (billeditStatus) {
        setActiveInput(false);
      } else {
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
      } else if (data.shortName.toString().includes(value)) {
        return data.shortName.toString().search(value) != -1;
      } else if (data.address?.addressLine.toLowerCase().includes(value)) {
        return data.address?.addressLine.toLowerCase().search(value) != -1;
      }
    });
    if (value != "") {
      setpartnerData(result);
    } else if (value === "") {
      setpartnerData(allData);
    } else {
      setpartnerData([]);
    }
    setsearchValue(value);
  };
  return (
    <div className="">
      <h5 className="head_modal">Bill Information </h5>
      <div className="" id="scroll_style">
        {partySelecteData !== null ? (
          <div className="">
            {activeInput ? (
              <Select
                defaultMenuIsOpen
                isSearchable={true}
                className="basic-single step3_partners_div"
                classNamePrefix="select"
                styles={colourStyles}
                name="partner"
                hideSelectedOptions={false}
                options={partnerData}
                placeholder={
                  "Select " +
                  (props.partyType == "Seller" ? "Farmer" : props.partyType)
                }
                value={partySelecteData}
                onChange={partySelect}
                filterOption={filterOption}
                isClearable={false}
                noOptionsMessage={() => "No Data Available"}
                getOptionValue={(e) => e.partyId}
                getOptionLabel={(e) => (
                  <div
                    style={{ display: "flex", alignItems: "center" }}
                    className=""
                  >
                    {e.profilePic !== "" ? (
                      <img src={e.profilePic} className="icon_user" />
                    ) : (
                      <img src={single_bill} className="icon_user" />
                    )}
                    <div style={{ marginLeft: 5 }}>
                      <div className="partner_card">
                        <h5>{getText(e.partyName) + " " + e.shortName}</h5>
                        <h6>
                          {getPartnerType(e.partyType, e.trader)} - {e.partyId}{" "}
                          | {getMaskedMobileNumber(e.mobile)}
                        </h6>
                        <p>{e.address?.addressLine}</p>
                      </div>
                    </div>
                  </div>
                )}
              />
            ) : (
              <button
                className="selectparty_field d-flex align-items-center justify-content-between"
                onClick={() => partnerClick(partySelecteData.partyType)} //"Buyer")}
              >
                <div className="partner_card">
                  <div className="d-flex align-items-center">
                    {billeditStatus ? (
                      partySelectStatus ? (
                        partySelecteData.profilePic !== "" ? (
                          <img
                            src={partySelecteData.profilePic}
                            className="icon_user"
                          />
                        ) : (
                          <img src={single_bill} className="icon_user" />
                        )
                      ) : billEditItem.profilePic !== "" ? (
                        <img
                          src={billEditItem.profilePic}
                          className="icon_user"
                        />
                      ) : (
                        <img src={single_bill} className="icon_user" />
                      )
                    ) : partySelecteData.profilePic !== "" ? (
                      <img
                        src={partySelecteData.profilePic}
                        className="icon_user"
                      />
                    ) : (
                      <img src={single_bill} className="icon_user" />
                    )}

                    <div className="text-left">
                      <h5>
                        {billeditStatus
                          ? partySelectStatus
                            ? getText(partySelecteData.partyName) +
                              " " +
                              partySelecteData.shortName
                            : billEditItem.partyType == "FARMER"
                            ? billEditItem.farmerName
                            : billEditItem.buyerName
                          : getText(partySelecteData.partyName) +
                            " " +
                            partySelecteData.shortName}
                      </h5>
                      <h6>
                        {billeditStatus
                          ? partySelectStatus
                            ? getPartnerType(
                                partySelecteData.partyType,
                                partySelecteData.trader
                              )
                            : getPartnerType(
                                billEditItem.partyType,
                                billEditItem.trader
                              )
                          : getPartnerType(
                              partySelecteData.partyType,
                              partySelecteData.trader
                            )}{" "}
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
                            ? getMaskedMobileNumber(partySelecteData.mobile)
                            : billEditItem.partyType == "FARMER"
                            ? getMaskedMobileNumber(billEditItem.farmerMobile)
                            : getMaskedMobileNumber(billEditItem.mobile)
                          : getMaskedMobileNumber(partySelecteData.mobile)}
                      </h6>
                      <p>
                        {billeditStatus
                          ? partySelectStatus
                            ? partySelecteData?.address?.addressLine
                            : billEditItem.partyType == "FARMER"
                            ? billEditItem?.farmerAddress
                            : billEditItem?.buyerAddress
                          : partySelecteData?.address?.addressLine}
                      </p>
                    </div>
                  </div>
                </div>
                {billeditStatus ? "" : <img src={d_arrow} />}
              </button>
            )}
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
            {activeTrans ? (
              <Select
                defaultMenuIsOpen
                isSearchable={true}
                className="basic-single step3_partners_div"
                classNamePrefix="select"
                styles={colourStyles}
                name="partner"
                hideSelectedOptions={false}
                options={partnerData}
                placeholder={"Select " + "Transporter"}
                value={transpoSelectedData}
                onChange={partySelect}
                filterOption={filterOption}
                isClearable={false}
                noOptionsMessage={() => "No Data Available"}
                getOptionValue={(e) => e.partyId}
                getOptionLabel={(e) => (
                  <div
                    style={{ display: "flex", alignItems: "center" }}
                    className=""
                  >
                    {e.profilePic !== "" ? (
                      <img src={e.profilePic} className="icon_user" />
                    ) : (
                      <img src={single_bill} className="icon_user" />
                    )}
                    <div style={{ marginLeft: 5 }}>
                      <div className="partner_card">
                        <h5>
                          {transportoSelectStatus
                            ? getText(e.partyName)
                            : e.transporterName
                            ? e.transporterName
                            : getText(e.partyName)}
                        </h5>
                        <h6>
                          {getPartnerType("Transporter", e.trader)} -{" "}
                          {transportoSelectStatus
                            ? e.partyId
                            : e.transporterId
                            ? e.transporterId
                            : e.partyId}
                          |{" "}
                          {transportoSelectStatus
                            ? getMaskedMobileNumber(e.mobile)
                            : e.transporterMobile
                            ? getMaskedMobileNumber(e.transporterMobile)
                            : getMaskedMobileNumber(e.mobile)}
                        </h6>
                        <p>{e.address?.addressLine}</p>
                      </div>
                    </div>
                  </div>
                )}
              />
            ) : (
              <button
                className="selectparty_field d-flex align-items-center justify-content-between"
                onClick={() => partnerClick("Transporter")}
              >
                <div className="partner_card">
                  <div className="d-flex align-items-center">
                    <img src={single_bill} className="icon_user" />
                    <div className="text-left">
                      <h5>
                        {billeditStatus
                          ? transportoSelectStatus
                            ? getText(transpoSelectedData.partyName)
                            : billEditItem.transporterName
                          : getText(transpoSelectedData.partyName)}
                        {/* {transpoSelectedData.partyName} */}
                      </h5>
                      <h6>
                        {/* {transpoSelectedData.mobile } */}
                        {billeditStatus
                          ? transportoSelectStatus
                            ? getText(transpoSelectedData.partyType) +
                              "-" +
                              transpoSelectedData.partyId +
                              " | " +
                              getMaskedMobileNumber(transpoSelectedData.mobile)
                            : getText("TRANSPORTER") + "-" + billEditItem.transporterId
                          : getText(transpoSelectedData.partyType) +
                            "-" +
                            transpoSelectedData.partyId +
                            " | " +
                            getMaskedMobileNumber(transpoSelectedData.mobile)}
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
              </button>
            )}
          </div>
        ) : activeTrans ? (
          <Select
            defaultMenuIsOpen
            isSearchable={true}
            className="basic-single step3_partners_div"
            classNamePrefix="select"
            styles={colourStyles}
            name="partner"
            hideSelectedOptions={false}
            options={partnerData}
            placeholder={"Select " + "Transporter"}
            value={transpoSelectedData}
            onChange={partySelect}
            filterOption={filterOption}
            isClearable={false}
            noOptionsMessage={() => "No Data Available"}
            getOptionValue={(e) => e.partyId}
            getOptionLabel={(e) => (
              <div
                style={{ display: "flex", alignItems: "center" }}
                className=""
              >
                {e.profilePic !== "" ? (
                  <img src={e.profilePic} className="icon_user" />
                ) : (
                  <img src={single_bill} className="icon_user" />
                )}
                <div style={{ marginLeft: 5 }}>
                  <div className="partner_card">
                    <h5>{getText(e.partyName) + " " + e.shortName}</h5>
                    <h6>
                      {getPartnerType(e.partyType, e.trader)} - {e.partyId} |{" "}
                      {getMaskedMobileNumber(e.mobile)}
                    </h6>
                    <p>{e.address?.addressLine}</p>
                  </div>
                </div>
              </div>
            )}
          />
        ) : (
          <p
            onClick={() => partnerClick("Transporter")}
            className="select_transporter"
          >
            Select Transporter
          </p>
        )}
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="date_sec head_modal p-0">Crop Information </h5>
          <button onClick={() => editCropTable(billEditItem)}>
          <img
            src={edit}
            alt="img"
            className="head_modal editIcon"
           
          />
          </button>
        </div>
        <div>
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
                                  parseFloat(item.qty),
                                  item.qtyUnit,
                                  parseFloat(item.weight),
                                  (item.wastage),
                                  item.rateType
                                )}
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
        </div>
      </div>
    </div>
  );
};
export default Step3PartySelect;
