import { useSelector, useDispatch } from "react-redux";
import { selectSteps } from "../../reducers/stepsSlice";
import SelectPartner from "./selectParty";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import BillDateSelection from "./billDateSelection";
import {
  selectBill,
  editStatus,
  billDate,
  tableEditStatus,
  selectedParty,
} from "../../reducers/billEditItemSlice";
import { selectTrans } from "../../reducers/transSlice";
import { selectBuyer } from "../../reducers/buyerSlice";
import SellBillDateSelection from "./sellBillDateSelection";
const Step11 = (props) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.buyerInfo);
  const billEditItemInfo = useSelector((state) => state.billEditItemInfo);
  const billDateSelected = billEditItemInfo?.selectedBillDate;
  console.log(
    billEditItemInfo?.selectedBillDate,
    billEditItemInfo,
    billDateSelected
  );
  const cancelStep = () => {
    dispatch(selectTrans(null));
    dispatch(selectBuyer(null));
    props.closem();
  };
  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);
  useEffect(() => {
    localStorage.setItem("selectPartytype", null);
    setPartnerData(users.buyerInfo);
    separtType(users.buyerInfo?.partyType.toLowerCase());
    if (users.buyerInfo?.itemtype != null) {
      setpartysType(users.buyerInfo?.itemtype.toLowerCase());
    }
    if (users.buyerInfo?.partyType.toLowerCase() !== "transporter") {
      localStorage.removeItem("selectedTransporter");
    } else {
      localStorage.setItem(
        "selectedTransporter",
        JSON.stringify(users.buyerInfo)
      );
    }
  }, [users.buyerInfo]);
  const [partnerData, setPartnerData] = useState(null);
  const [partType, separtType] = useState("");
  const [partysType, setpartysType] = useState("");

  const callbackFunction = (childData, party, type) => {};
  const callbackFunctionDate = (date) => {};
  const linkPath = localStorage.getItem("LinkPath");
  const addCropModal = () => {
    dispatch(selectSteps("step2"));
    dispatch(selectBill({}));
    dispatch(editStatus(false));
    dispatch(billDate(billDateSelected));
    dispatch(
      tableEditStatus(billEditItemInfo?.cropTableEditStatus ? true : false)
    );
    if (linkPath === "/sellbillbook") {
      dispatch(selectedParty("buyer"));
    } else {
      dispatch(selectedParty("seller"));
    }
    if (!billEditItemInfo?.fromBillBook) {
      var h = JSON.parse(localStorage.getItem("lineItemsEdit"));
      props.billEditStatuscallback(h);
    }
  };
  const [onClickPage, setonClickPage] = useState(false);
  document.body.addEventListener("click", function (evt) {
    setonClickPage(true);
  });
  return (
    <div>
      <div>
        <div className="main_div_padding">
          <h5 className="head_modal">Bill Information </h5>
          <div className="container-fluid px-0">
            <div className="row">
              <div className="col-lg-4 p-0">
                <SelectPartner
                  partyType={linkPath === "/sellbillbook" ? "Buyer" : "Seller"}
                  parentCallback={callbackFunction}
                  onClickPage={onClickPage}
                />
              </div>
              <div className="col-lg-4 ">
                {linkPath === "/sellbillbook" ? (
                  <SellBillDateSelection
                    parentCallbackDate={callbackFunctionDate}
                    billDate={null} //{null}
                  />
                ) : (
                  <BillDateSelection
                    parentCallbackDate={callbackFunctionDate}
                    billDate={null} //{null}
                  />
                )}
              </div>
              <div className="col-lg-4 p-0">
                <SelectPartner
                  partyType="Transporter"
                  parentCallback={callbackFunction}
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          {partnerData != null &&
          (partysType.toLowerCase() === "seller" ||
          partysType.toLowerCase() === "buyer"
            ? partType.toLowerCase() === "transporter"
              ? true
              : true
            : true) ? (
            <div className="bottom_div">
              <div className="d-flex align-items-center justify-content-between">
                <button className="secondary_btn" onClick={cancelStep}>
                  cancel
                </button>
                <button className="primary_btn" onClick={addCropModal}>
                  {langFullData.next}
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};
export default Step11;
