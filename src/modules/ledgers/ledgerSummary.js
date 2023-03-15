import { useState, React } from "react";
import "../../modules/ledgers/buyerLedger.scss";
import moment from "moment";
import {
  getCurrencyNumberWithOutSymbol,
} from "../../components/getCurrencyNumber";
import NoDataAvailable from "../../components/noDataAvailable";
import {
  getBuyBillId,
  getSellBillId,
  getPaymentListById,
  getAdvanceListById,
} from "../../actions/ledgersService";
import { useDispatch } from "react-redux";
import { billViewInfo } from "../../reducers/billViewSlice";
import BillView from "../buy_bill_book/billView";
import PaymentHistoryView from "./paymentHistory";
import { paymentViewInfo } from "../../reducers/paymentViewSlice";
import tick from "../../assets/images/tick.svg";
const LedgerSummary = (props) => {
  const partyId = props.partyId;
  const ledgerSummary = props.LedgerSummary;
  const ledgerSummaryByDate = props.LedgerSummaryByDate;
  const allCustom = props.allCustomTab;
  const ledgerTabs = props.ledgerTab;
  const ledgerType = props.partyType;
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const dispatch = useDispatch();
  const clickId = loginData.caId;
  const [showBillModalStatus, setShowBillModalStatus] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showPaymentModalStatus, setShowPaymentModalStatus] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const billOnClickView = (billId, type, i, partyId) => {
    console.log(billId, type,partyId);
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
    } 
   else if (bId?.includes("A")) {
      getAdvanceListById(clickId, bId, partyId).then((res) => {
        if (res.data.status.type === "SUCCESS") {
          console.log(res.data.data);
          dispatch(paymentViewInfo(res.data.data));
          setShowPaymentModalStatus(true);
          setShowPaymentModal(true);
        }
      });
    } 
    else {
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
      {allCustom == "all" ? (
        <div
          className={props.dateDisplay ? "ledgerSummary" : "all_ledgerSummary"}
          id="scroll_style"
        >
          {ledgerSummary.length > 0 ? (
            <table className="table table-bordered ledger-table">
              <thead className="thead-tag">
                <tr>
                  <th className="col-1" id="sno">
                    #
                  </th>
                  <th className="col-2">Ref ID | Date</th>
                  {ledgerType == "BUYER" ? (
                    <th className="col-3">Received(&#8377;)</th>
                  ) : (
                    <th className="col-3">Paid(&#8377;)</th>
                  )}
                  {ledgerType == "BUYER" ? (
                    <th className="col-3">To Be Received(&#8377;)</th>
                  ) : (
                    <th className="col-3">To Be Paid(&#8377;)</th>
                  )}
                  <th className="col-3">Ledger Balance(&#8377;)</th>
                </tr>
              </thead>
              <tbody>
                {ledgerSummary.map((item, index) => {
                  return (
                    <tr className="tr-tags" scope="row" kery={item.partyId}>
                      <td className="col-1">
                        <p id="p-common-sno">{index + 1}</p>
                      </td>
                      <td className="col-2">
                        <button onClick={() =>
                            billOnClickView(item.refId, ledgerType, index, partyId)
                          }>
                        <p
                          style={{ color: "#0066FF" }}
                          
                        > 
                        
                          <div className="d-flex">
                            <span>{item.refId}</span>
                            {item?.billPaid ? (<img src={tick} alt="image" className="ml-2" />) : '' }

                          </div>
                        </p>
                        </button>
                        <p>{moment(item.date).format("DD-MMM-YY")}</p>
                      </td>
                      <td className="col-3">
                        <p id="p-common">
                          {item.paidRcvd
                            ? getCurrencyNumberWithOutSymbol(item.paidRcvd)
                            : ""}
                        </p>
                      </td>
                      <td className="col-3">
                        <p id="p-common">
                          {item.tobePaidRcvd
                            ? getCurrencyNumberWithOutSymbol(item.tobePaidRcvd)
                            : ""}
                        </p>
                      </td>
                      <td className="col-3">
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
        <div className="ledgerSummary" id="scroll_style">
          {ledgerSummaryByDate.length > 0 ? (
            <table className="table table-bordered ledger-table">
              {/*ledger-table*/}
              <thead className="thead-tag">
                <tr>
                  <th className="col-1" id="sno">
                    #
                  </th>
                  <th className="col-2">Ref ID | Date</th>
                  {ledgerType == "BUYER" ? (
                    <th className="col-3">Received(&#8377;)</th>
                  ) : (
                    <th className="col-3">Paid(&#8377;)</th>
                  )}
                  {ledgerType == "BUYER" ? (
                    <th className="col-3">To Be Received(&#8377;)</th>
                  ) : (
                    <th className="col-3">To Be Paid(&#8377;)</th>
                  )}
                  <th className="col-3">Ledger Balance(&#8377;)</th>
                </tr>
              </thead>
              <tbody>
                {ledgerSummaryByDate.map((item, index) => {
                  return (
                    <tr className="tr-tags" scope="row" kery={item.partyId}>
                      <td className="col-1">
                        <p id="p-common-sno">{index + 1}</p>
                      </td>
                      <td className="col-2">
                        <p
                          style={{ color: "#0066FF" }}
                          onClick={() =>
                            billOnClickView(item.refId, ledgerType, index, partyId)
                          }
                        > 
                        
                          <div className="d-flex">
                            <span>{item.refId}</span>
                            {item?.billPaid ? (<img src={tick} alt="image" className="ml-2" />) : '' }

                          </div>
                        </p>
                        <p>{moment(item.date).format("DD-MMM-YY")}</p>
                      </td>
                      <td className="col-3">
                        <p id="p-common">
                          {item.paidRcvd ? item.paidRcvd.toFixed(2) : ""}
                        </p>
                      </td>
                      <td className="col-3">
                        <p id="p-common">
                          {item.tobePaidRcvd
                            ? item.tobePaidRcvd.toFixed(2)
                            : ""}
                        </p>
                      </td>
                      <td className="col-3">
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

export default LedgerSummary;
