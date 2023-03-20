import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import clo from "../../assets/images/close.svg";
import { useSelector } from "react-redux";
import moment from "moment";
import cancel from "../../assets/images/cancel.svg";
import selected_icon from "../../assets/images/selected_icon.svg";
import "../ledgers/selectBillIds.scss";
import SearchField from "../../components/searchField";
import NoDataAvailable from "../../components/noDataAvailable";
import { getListOfBillIds } from "../../actions/ledgersService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import date_icon from "../../assets/images/date_icon.svg";
import CustomDateSelection from "./customDateSelection";
import cust_date from "../../assets/images/cust_date.svg";
import { getCurrencyNumberWithSymbol } from "../../components/getCurrencyNumber";
const SelectBillIds = (props) => {
  const partyId = props.partyId;
  const date = moment(props.selectedDateTo).format("DD-MMM-YY");
  var [dateValue, setDateValue] = useState(date + " to " + date);
  const selectDate = moment(props.selectedDate).format("YYYY-MM-DD");
  console.log(date,selectDate,"data")
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const [allBillIds, setAllBillIds] = useState([]);
  const [getBillids, setBillIds] = useState(allBillIds);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [billIds, setBillids] = useState([]);
  const [billObject, setBillIdsObject] = useState([]);
  const [showCustDate, seShowCustDate] = useState(false);
  const [fromCustomDate, setFromCustomDate] = useState(false);
  const [frDate, setFrDate] = useState(date);
  const [toDates, setToDate] = useState(date);
  const [fromCustomBillsData, setFromCustomBills] = useState([]);
  var someIds = [];
  var dummyIds = [];
  // var listOfBillids=localStorage.getItem("listOfBillIds");
  var index = selectedIndex;
  const getAllBillIds = () => {
    if (fromCustomDate) {
      var frDate = moment(frDate).format("YYYY-MM-DD");
      var toDate = moment(toDates).format("YYYY-MM-DD");
      getListOfBillIds(clickId, partyId, frDate, toDate).then((res) => {
        props.allBillIdsDate(res.data.data);
      });
    } else {
      getListOfBillIds(clickId, partyId, selectDate, selectDate).then((res) => {
        setAllBillIds(res.data.data);
        setBillIds(res.data.data);
        someIds = res.data.data;
      });
    }
  };
  useEffect(() => {
    getAllBillIds();
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [props.showBillIdsModal]);
  const allBills = (data) => {
    console.log(data, "cust data");
    someIds = data;
    setBillIds(data);
    setAllBillIds(data);
  };
  const handleKeyDown = (e) => {
    const key = e.keyCode;
    if (key === 38) {
      // Up arrow
      setSelectedIndex((prev) => (prev === 0 ? someIds.length - 1 : prev - 1));
      index--;
    } else if (key === 40) {
      // Down arrow
      setSelectedIndex((prev) => (prev === someIds.length - 1 ? 0 : prev + 1));
      index++;
      console.log(index, "index down");
    } else if (key === 13) {
      // Enter key
      var listOfIds = JSON.parse(localStorage.getItem("listOfBillIds"));
      const selectedBillId = someIds[index]
        ? someIds[index]?.caBSeq
        : listOfIds[index]?.caBSeq;
      console.log(listOfIds[index], index, selectedBillId, "idsgsa");
      if (dummyIds.includes(selectedBillId)) {
        setBillids(billIds.filter((id) => id !== selectedBillId));
        setBillIdsObject(
          billObject.filter((id) => id.caBSeq !== selectedBillId)
        );
      } else {
        const selectBill = someIds[index] ? someIds[index] : listOfIds[index];
        billObject.push(selectBill);
        billIds.push(selectedBillId);
        dummyIds.push(selectedBillId);
      }
    }
  };

  const handleSelectBillIds = (billId, object, index) => {
    if (billIds.includes(billId)) {
      // remove billId from selectedBillIds
      setBillids(billIds.filter((id) => id !== billId));
      setBillIdsObject(billObject.filter((id) => id.caBSeq !== billId));
    } else {
      // add billId to selectedBillIds
      setBillIdsObject([...billObject, object]);
      setBillids([...billIds, billId]);
    }
  };
  const sendBillIdsData = () => {
    props.setBillIdsData(billObject);
    setSelectedIndex(selectedIndex);
  };
  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = allBillIds.filter((data) => {
      if (data?.caBSeq.toString().includes(value)) {
        return data?.caBSeq.toString().search(value) != -1;
      } else if (data?.amount.toString().includes(value)) {
        return data?.amount.toString().search(value) != -1;
      } else if (data?.billDate.toString().includes(value)) {
        return data?.billDate.toString().search(value) != -1;
      }
    });
    setBillIds(result);
  };
  const openCustomDatePicker = () => {
    seShowCustDate(true);
  };
  const fromDate = (date) => {
    setFrDate(date);
  };
  const toDate = (date) => {
    setToDate(date);
  };
  const customDate = (date) => {
    setFromCustomDate(date);
  };
  return (
    <Modal
      show={props.showBillIdsModal}
      close={props.billIdsCloseModal}
      centered
      className="record_payment_modal select_billID_popup"
    >
      <div className="modal-body partner_model_body">
        <div className="d-flex align-items-center justify-content-between modal_common_header">
          <h5 className="modal-title header2_text" id="staticBackdropLabel">
            Select Bill
          </h5>
          <button
            onClick={(e) => {
              setFromCustomDate(false);
              setFrDate(date);
              setToDate(date);
              props.billIdsCloseModal();
            }}
          >
            <img alt="image" src={clo} className="cloose" />
          </button>
        </div>
        <div className="row">
          <div className="d-flex bills-search mt-2 col-lg-6" role="search">
            <SearchField
              placeholder="Search"
              // val={searchValue}
              onChange={(event) => {
                handleSearch(event);
              }}
            />
          </div>
          <div className="col-lg-6 mt-2 pl-3 pr-0">
            <div className="d-flex select-bill-box">
              <div className="date-icons">
                <img src={cust_date} className="custom-date-icon" />
              </div>
              <p className="date-range" onClick={openCustomDatePicker}>
                {fromCustomDate
                  ? moment(frDate).format("DD-MMM-YY") +
                    " to " +
                    moment(toDates).format("DD-MMM-YYYY")
                  : dateValue
                  ? dateValue
                  : "Slect Date range"}
              </p>
            </div>
          </div>
        </div>
        {getBillids.length > 0 ? (
          <div className="partner_model_scroll select_billID_popup_scroll" id="scroll_style">
            <div className="row bill_id_popup_row">
              <div className="col-lg-5">
                <p>Bill Id</p>
              </div>
              <div className="col-lg-6">
                <p>Total Amount</p>
              </div>
            </div>
            <div className="border-bott"></div>
            <div className="bill_id_data_row">
              {getBillids.map((item, index) => {
                const isSelected = billIds.includes(item.caBSeq);
                return (
                  <div
                    key={item.caBSeq}
                    className={
                      isSelected || selectedIndex == index
                        ? "d-flex row each-billId selected"
                        : "d-flex row each-billId"
                    }
                    onClick={() =>
                      handleSelectBillIds(item.caBSeq, item, index)
                    }
                  >
                    <div className="col-lg-5">
                      <p>{item.caBSeq ? item.caBSeq : ""}</p>
                      <p className="date_text">{item.billDate ? moment(item.billDate).format('DD-MMM-YY') : ""}</p>
                    </div>
                    <div className="d-flex col-lg-6">
                      <p>{item.amount ? getCurrencyNumberWithSymbol(item.amount) : ""}</p>
                     
                    </div>
                    <div className="col-lg-1">
                    <div className="selected-img">
                        {isSelected ? (
                          <img
                            src={selected_icon}
                            width={"20px"}
                            height={"20px"}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="d-flex mx-auto justify-content-center">
            <NoDataAvailable />
          </div>
        )}
      </div>
      <div className="modal-footer crop_footer">
        <button
          type="button"
          className="secondary_btn"
          onClick={() => {
            props.billIdsCloseModal();
            setSelectedIndex(0);
            setFromCustomDate(false);
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="primary_btn ml-3"
          onClick={(e) => {
            sendBillIdsData();
            props.billIdsCloseModal();
          }}
        >
          CONTINUE
        </button>
      </div>
      {showCustDate ? (
        <CustomDateSelection
          showCustDate={showCustDate}
          closeCustomDatePopUp={() => {
            seShowCustDate(false);
          }}
          beginDate ={frDate}
          closeDate={toDates}
          setFromDate={fromDate}
          setToDate={toDate}
          fromCustomDate={customDate}
          partyId={partyId}
          allBillIdsDate={allBills}
        />
      ) : (
        ""
      )}
      <a className="backdrop"></a>
    </Modal>
  );
};

export default SelectBillIds;
