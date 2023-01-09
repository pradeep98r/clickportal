import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import single_bill from "../../assets/images/bills/single_bill.svg";
import d_arrow from "../../assets/images/d_arrow.png";
import Step2Modal from "./step2Modal";
import {
  getPartnerData,
  getOutstandingBal,
} from "../../actions/billCreationService";
import BillDateSelection from "./billDateSelection";
const Step3PartySelect = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const [partyType, setPartnerType] = useState(props.selectedPartyType);
  const partnerSelectedData =
    props.selectedPartyType.toLowerCase() == "buyer"
      ? props.selectedBuyerSellerData
      : props.selectedBuyerSellerData;
      console.log(props.selectedBuyerSellerData)
  const [transpoSelectedData, setTranspoSelectedData] = useState({});
  const [getPartyItem, setGetPartyItem] = useState(null);
  const editStatus = props.editStatus;
  const billEditItem = props.billEditItemval[0];
  var step2CropEditStatus = props.step2CropEditStatus;
  let [partnerData, setpartnerData] = useState([]);
  const [selectedDate, setStartDate] = useState(props.selectdDate);
  const partnerSelectDate = moment(selectedDate).format("YYYY-MM-DD");
  const [outBal, setOutsBal] = useState(0);
  console.log(props.billEditItemval);
  useEffect(() => {
    fetchPertnerData(partyType);
    setTranspoSelectedData(
      JSON.parse(localStorage.getItem("selectedTransporter"))
    );
    if (partnerSelectedData != null) {
      getOutstandingBal(clickId, partnerSelectedData.partyId).then((res) => {
        setOutsBal(res.data.data == null ? 0 : res.data.data);
      });
    }
    console.log(transpoSelectedData, partnerSelectedData);
    props.parentSelectedParty(
      partnerSelectDate,
      partnerSelectedData,
      transpoSelectedData
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
  const partySelect = (item, type) => {
    setGetPartyItem(item);
    if (type == "Transporter") {
      setTranspoDataStatus(false);
      setTransportoSelectStatus(true);
      localStorage.setItem("selectedTransporter", JSON.stringify(item));
      var h = JSON.parse(localStorage.getItem("selectedTransporter"));
      setTranspoSelectedData(h);
      console.log(h, "trans");
      props.parentSelectedParty(
        partnerSelectDate,
        partnerSelectedData,
        h,
        outBal
      );
      getOutstandingBal(clickId, item.partyId).then((res) => {
        setOutsBal(res.data.data);
      });
    } else if (type == "Buyer") {
      setTranspoDataStatus(false);
      localStorage.setItem("selectedBuyer", JSON.stringify(item));
      setPartySelectStatus(true);
    } else if (type == "Seller") {
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
  const partnerClick = (type) => {
    if (type == "Buyer") {
      setPartnerDataStatus(true);
      setPartnerType(type);
      fetchPertnerData(type);
    } else if (type == "Transporter") {
      setTranspoDataStatus(true);
      setPartnerType(type);
      fetchPertnerData(type);
    } else if (type == "Seller") {
      setPartnerDataStatus(true);
      setPartnerType(type);
      fetchPertnerData(type);
    }
  };
  const [showCropModal, setShowCropModal] = useState(false);
  const [showCropModalStatus, setShowCropModalStatus] = useState(false);
  const [cropEditvalArray, setcropEditvalArray] = useState([]);
  const editCropTable = (cropEditArray) => {
    step2CropTableOnclick(cropEditArray);
  };

  const step2CropTableOnclick = (cropEditArray) => {
    step2CropEditStatus = true;
    setShowCropModalStatus(true);
    setShowCropModal(true);
    setcropEditvalArray(cropEditArray);
  };
  return (
    <div className="">
      <h5 className="head_modal">Bill Information </h5>

      <div className="party_div">
        <div
          className="selectparty_field d-flex align-items-center justify-content-between"
          onClick={() => partnerClick("Buyer")}
        >
          <div className="partner_card">
            <div className="d-flex align-items-center">
              <img src={single_bill} className="icon_user" />
              <div>
                <h5>
                  {editStatus
                    ? partySelectStatus
                      ? partnerSelectedData.partyName
                      : billEditItem.buyerName
                    : partnerSelectedData.partyName}
                </h5>
                <h6>
                  {editStatus
                    ? partySelectStatus
                      ? partnerSelectedData.partyType
                      : billEditItem.partyType
                    : partnerSelectedData.partyType}{" "}
                  -{" "}
                  {editStatus
                    ? partySelectStatus
                      ? partnerSelectedData.partyId
                      : billEditItem.buyerId
                    : partnerSelectedData.partyId}{" "}
                  |{" "}
                  {editStatus
                    ? partySelectStatus
                      ? partnerSelectedData.mobile
                      : billEditItem.mobile
                    : partnerSelectedData.mobile}
                </h6>
                <p>{partnerData.buyerAddress}</p>
              </div>
            </div>
          </div>
          <img src={d_arrow} />
        </div>
      </div>
      <div className="date_sec date_step3">
        <BillDateSelection parentCallbackDate={callbackFunctionDate} />
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
                  {transportoSelectStatus}
                  <h5>
                    {editStatus
                      ? transportoSelectStatus
                        ? transpoSelectedData.partyName
                        : billEditItem.transporterName
                      : transpoSelectedData.partyName}
                    {/* {transpoSelectedData.partyName} */}
                  </h5>
                  <h6>
                    {/* {transpoSelectedData.mobile } */}
                    {editStatus
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
                    {editStatus
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
            <input
              className="form-control mb-0"
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange={(event) => setSearchPartyItem(event.target.value)}
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
            {editStatus ? (
              <div className="d-flex">
                <img
                  src={billEditItem.lineItems[0]?.imageUrl}
                  className="edit_crop_item"
                />
                <p className="edit_crop_item_len d-flex align-items-center">
                  <p>{billEditItem.lineItems.length}</p>
                  <span className="ml-3">Crops</span>
                </p>
              </div>
            ) : (
              <div className="d-flex">
                <img src={billEditItem.imageUrl} className="edit_crop_item" />
                <p className="edit_crop_item_len d-flex align-items-center">
                  <p>{props.billEditItemval.length}</p>
                  <span className="ml-3">Crops</span>
                </p>
              </div>
            )}
          </p>
          <p onClick={() => editCropTable(billEditItem.lineItems)}>Edit</p>
        </div>
      </div>
      {showCropModalStatus ? (
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
      )}
    </div>
  );
};
export default Step3PartySelect;
