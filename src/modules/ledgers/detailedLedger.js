import { useState, React } from "react";
import "../../modules/ledgers/buyerLedger.scss";
import moment from "moment";
import single_bill from "../../assets/images/bills/single_bill.svg";
import tick from "../../assets/images/tick.svg";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
  getCurrencyNumberWithOneDigit,
} from "../../components/getCurrencyNumber";
import NoDataAvailable from "../../components/noDataAvailable";
import {
  getAdvanceListById,
  getBuyBillId,
  getPaymentListById,
  getSellBillId,
} from "../../actions/ledgersService";
import { useDispatch, useSelector } from "react-redux";
import { billViewInfo } from "../../reducers/billViewSlice";
import BillView from "../buy_bill_book/billView";
import PaymentHistoryView from "./paymentHistory";
import { paymentViewInfo } from "../../reducers/paymentViewSlice";
import { detaildLedgerInfo } from "../../reducers/ledgerSummarySlice";
const DetailedLedger = (props) => {
  var detailedLedgerSummary = useSelector(state => state.ledgerSummaryInfo);
  var partnerDetailedLedger = detailedLedgerSummary?.detaildLedgerInfo;
  const details = detailedLedgerSummary?.fromRecordPayment?partnerDetailedLedger: props.detailedLedger;
  const detailsByDate =detailedLedgerSummary?.fromRecordPayment?partnerDetailedLedger:props.DetailedLedgerByDate;
  const allCustom = props.allCustomTab;
  const ledgerTabs = props.ledgerTab;
  const ledgerType = props.partyType;
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const partyId = props.partyId;
  const dispatch = useDispatch();
  const [showBillModalStatus, setShowBillModalStatus] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showPaymentModalStatus, setShowPaymentModalStatus] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const billOnClickView = (billId, type, i, partyId) => {
    console.log(billId, type, partyId);
    var bId = billId.replace("-", " ").replace("C", "").replace("U", "");
    if (bId?.includes("P") || bId?.includes("D")) {
      getPaymentListById(clickId, bId).then((res) => {
        if (res.data.status.type === "SUCCESS") {
          console.log(res.data.data);
          dispatch(paymentViewInfo(res.data.data));
          setShowPaymentModalStatus(true);
          setShowPaymentModal(true);
        }
      });
    } else if (bId?.includes("A")) {
      getAdvanceListById(clickId, bId, partyId).then((res) => {
        if (res.data.status.type === "SUCCESS") {
          console.log(res.data.data);
          dispatch(paymentViewInfo(res.data.data));
          setShowPaymentModalStatus(true);
          setShowPaymentModal(true);
        }
      });
    } else {
      if (type?.toLowerCase() == "seller" || type?.toLowerCase() == "farmer") {
        getBuyBillId(clickId, bId).then((res) => {
          if (res.data.status.type === "SUCCESS") {
            Object.assign(res.data.data, { index: i, partyType: "FARMER" });
            dispatch(billViewInfo(res.data.data));
            localStorage.setItem("billData", JSON.stringify(res.data.data));
            setShowBillModalStatus(true);
            setShowBillModal(true);
          }
        });
      } else {
        getSellBillId(clickId, bId).then((res) => {
          if (res.data.status.type === "SUCCESS") {
            console.log(res.data.data);
            Object.assign(res.data.data, { index: i, partyType: type });
            dispatch(billViewInfo(res.data.data));
            localStorage.setItem("billData", JSON.stringify(res.data.data));
            setShowBillModalStatus(true);
            setShowBillModal(true);
          }
        });
      }
    }
  };
  return (
    <div>
      {allCustom == "all" && ledgerTabs == "detailedledger" ? (
        <div
          className={props.dateDisplay ? "detailedLedger" : "all_ledgerSummary"}
          id="scroll_style"
        >
          {details.length > 0 ? (
            <table className="table table-bordered" id="ledger-sum">
              <thead className="thead-tag">
                <tr className="">
                  <th className="col-1" id="sno">
                    #
                  </th>
                  <th className="col-2">Ref ID | Date</th>
                  <th className="col-3">
                    <p>Item</p>
                    <p> Unit | Kgs | Rate</p>
                  </th>
                  {ledgerType == "BUYER" ? (
                    <th className="col-2">Received(&#8377;)</th>
                  ) : (
                    <th className="col-2">Paid(&#8377;)</th>
                  )}
                  {ledgerType == "BUYER" ? (
                    <th className="col-2">To Be Received(&#8377;)</th>
                  ) : (
                    <th className="col-2">To Be Paid(&#8377;)</th>
                  )}
                  <th className="col-2">Ledger Balance(&#8377;)</th>
                </tr>
              </thead>
              <tbody>
                {details.map((item, index) => {
                  return (
                    <tr className="tr-tags" key={item.partyId}>
                      <td className="col-1" id="p-common-sno">
                        {index + 1}
                      </td>
                      <td className="col-2">
                        <p
                          style={{ color: "#0066FF" }}
                          onClick={() =>
                            billOnClickView(
                              item.refId,
                              ledgerType,
                              index,
                              partyId
                            )
                          }
                        >
                          <div className="d-flex">
                            <span>{item.refId}</span>
                            {item?.billPaid ? (
                              <img src={tick} alt="image" className="ml-2" />
                            ) : (
                              ""
                            )}
                          </div>
                        </p>
                        <p>{moment(item.date).format("DD-MMM-YY")}</p>
                      </td>
                      <td className="col-3">
                        <p style={{ fontSize: "12px" }}>{item.itemName}</p>
                        <span style={{ fontSize: "13px" }}>
                          {item.qty
                            ? getCurrencyNumberWithOneDigit(item.qty)
                            : ""}{" "}
                          {item.unit !== null
                            ? item.unit.charAt(item).toUpperCase() + " | "
                            : ""}{" "}
                          {item.kg
                            ? getCurrencyNumberWithOneDigit(item.kg) + " KG | "
                            : ""}{" "}
                          {item.rate
                            ? getCurrencyNumberWithOutSymbol(item.rate)
                            : ""}
                        </span>
                      </td>
                      <td className="col-2">
                        <p id="p-common">
                          {ledgerType == "BUYER"
                            ? item.recieved
                              ? item.recieved.toFixed(2)
                              : ""
                            : item.paid
                            ? item.paid
                            : ""}
                        </p>
                      </td>
                      <td className="col-2">
                        <p id="p-common">
                          {ledgerType == "BUYER"
                            ? item.toBeRecieved
                              ? item.toBeRecieved.toFixed(2)
                              : ""
                            : item.toBePaid
                            ? item.toBePaid
                            : ""}
                        </p>
                      </td>
                      <td className="col-2">
                        <p
                          className={
                            ledgerType == "BUYER" ? "coloring" : "paid-coloring"
                          }
                          id="p-common"
                        >
                          {item.balance
                            ? getCurrencyNumberWithOutSymbol(item.balance)
                            : ""}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <NoDataAvailable />
          )}
        </div>
      ) : (
        <div className="detailedLedger" id="scroll_style">
          {detailsByDate.length > 0 ? (
            <table className="table table-bordered">
              <thead className="thead-tag">
                <tr>
                  <th className="col-1" id="sno">
                    #
                  </th>
                  <th className="col-2">Ref ID | Date</th>
                  <th className="col-3">
                    <p>Item</p>
                    <p> Unit | Kgs | Rate</p>
                  </th>
                  {ledgerType == "BUYER" ? (
                    <th className="col-2">Received(&#8377;)</th>
                  ) : (
                    <th className="col-2">Paid(&#8377;)</th>
                  )}
                  {ledgerType == "BUYER" ? (
                    <th className="col-2">To Be Received(&#8377;)</th>
                  ) : (
                    <th className="col-2">To Be Paid(&#8377;)</th>
                  )}
                  <th className="col-2">Ledger Balance(&#8377;)</th>
                </tr>
              </thead>
              <tbody>
                {detailsByDate.map((item, index) => {
                  return (
                    <tr className="tr-tags" key={item.partyId}>
                      <td className="col-1" id="p-common-sno">
                        {index + 1}
                      </td>
                      <td className="col-2">
                        <p
                          style={{ color: "#0066FF" }}
                          onClick={() =>
                            billOnClickView(
                              item.refId,
                              ledgerType,
                              index,
                              partyId
                            )
                          }
                        >
                          <div className="d-flex">
                            <span> {item.refId ? item.refId : ""}</span>
                            {item?.billPaid ? (
                              <img src={tick} alt="image" className="ml-2" />
                            ) : (
                              ""
                            )}
                          </div>
                        </p>

                        {moment(item.date).format("DD-MMM-YY")}
                      </td>
                      <td className="col-2">
                        <p style={{ fontSize: "12px" }}>{item.itemName}</p>
                        <span style={{ fontSize: "13px" }}>
                          {item.qty ? item.qty.toFixed(1) : ""}{" "}
                          {item.unit
                            ? item.unit.charAt(item).toUpperCase() + " | "
                            : ""}
                          {item.kg ? item.kg + " KG | " : ""}
                          {item.rate ? item.rate : ""}
                        </span>
                      </td>
                      <td className="col-2">
                        <p id="p-common">
                          {ledgerType == "BUYER"
                            ? item.recieved
                              ? item.recieved.toFixed(2)
                              : ""
                            : item.paid
                            ? item.paid
                            : ""}
                        </p>
                      </td>
                      <td className="col-2">
                        <p id="p-common">
                          {ledgerType == "BUYER"
                            ? item.toBeRecieved
                              ? item.toBeRecieved.toFixed(2)
                              : ""
                            : item.toBePaid
                            ? item.toBePaid
                            : ""}
                        </p>
                      </td>
                      <td className="col-2">
                        <p
                          className={
                            ledgerType == "BUYER" ? "coloring" : "paid-coloring"
                          }
                          id="p-common"
                        >
                          {item.balance ? item.balance.toFixed(2) : ""}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <NoDataAvailable />
          )}
        </div>
      )}
      {showBillModalStatus ? (
        <BillView
          showBillViewModal={showBillModal}
          closeBillViewModal={() => setShowBillModal(false)}
          // allBillsData={buyBillData}
          fromLedger={true}
        />
      ) : (
        ""
      )}
      {showPaymentModalStatus ? (
        <PaymentHistoryView
          showPaymentViewModal={showPaymentModal}
          closePaymentViewModal={() => setShowPaymentModal(false)}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default DetailedLedger;
