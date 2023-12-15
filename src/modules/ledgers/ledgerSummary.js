import { useState, React } from "react";
import "../../modules/ledgers/buyerLedger.scss";
import moment from "moment";
import { getCurrencyNumberWithOutSymbol } from "../../components/getCurrencyNumber";
import NoDataAvailable from "../../components/noDataAvailable";
import {
  getBuyBillId,
  getSellBillId,
  getPaymentListById,
  getAdvanceListById,
} from "../../actions/ledgersService";
import { useDispatch, useSelector } from "react-redux";
import { billViewInfo } from "../../reducers/billViewSlice";
import BillView from "../buy_bill_book/billView";
import PaymentHistoryView from "./paymentHistory";
import { paymentViewInfo } from "../../reducers/paymentViewSlice";
import tick from "../../assets/images/tick.svg";
import {
  fromAdvanceBillId,
  fromAdvanceFeature,
} from "../../reducers/advanceSlice";
const LedgerSummary = (props) => {
  const ledgersSummary = useSelector((state) => state.ledgerSummaryInfo);
  var partnerSummary = ledgersSummary?.ledgerSummaryInfo;
  const partyId = props.partyId;
  const ledgerSummary = partnerSummary;
  const ledgerSummaryByDate = partnerSummary;
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
    var bId = billId.replace("-", "").replace("C", "").replace("U", "");
    if (bId?.includes("P") || bId?.includes("D")) {
      getPaymentListById(clickId, bId).then((res) => {
        if (res.data.status.type === "SUCCESS") {
          dispatch(paymentViewInfo(res.data.data));
          setShowPaymentModalStatus(true);
          setShowPaymentModal(true);
        }
      });
    } else if (bId?.includes("A")) {
      getAdvanceListById(clickId, bId, partyId).then((res) => {
        if (res.data.status.type === "SUCCESS") {
          dispatch(fromAdvanceBillId(true));
          dispatch(paymentViewInfo(res.data.data));
          setShowPaymentModalStatus(true);
          setShowPaymentModal(true);
          dispatch(fromAdvanceFeature(false));
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
        <div className="ledger-table">
          {ledgerSummary.length > 0 ? (
            <div className="row thead-tag head_tag">
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
            </div>
          ) : (
            ""
          )}

          {ledgerSummary.length > 0 ? (
            <div
              className={
                props.dateDisplay ? "ledgerSummary" : "all_ledgerSummary"
              }
              id="scroll_style"
            >
              <table className="table table-bordered ledger-table">
                <tbody>
                  {ledgerSummary.map((item, index) => {
                    return (
                      <tr className="tr-tags" scope="row" kery={item.partyId}>
                        <td className="col-1">
                          <p id="p-common-sno">{index + 1}</p>
                        </td>
                        <td className="col-2">
                          <button
                            className="pl-0"
                            onClick={() =>
                              billOnClickView(
                                item.refId,
                                ledgerType,
                                index,
                                partyId
                              )
                            }
                          >
                            <p style={{ color: "#0066FF" }}>
                              <div className="d-flex">
                                <span>{item.refId}</span>
                                {item?.billPaid ? (
                                  <img
                                    src={tick}
                                    alt="image"
                                    className="ml-2"
                                  />
                                ) : (
                                  ""
                                )}
                              </div>
                            </p>
                          </button>
                          <p>{moment(item.date).format("DD-MMM-YY")}</p>
                        </td>

                        <td className="col-3">
                          <p id="p-common">
                            {item.paidRcvd ? item.paidRcvd.toFixed(2) : ""}
                          </p>
                          <p>{item.comments}</p>
                        </td>
                        <td className="col-3">
                          <p id="p-common">
                            {item.tobePaidRcvd
                              ? getCurrencyNumberWithOutSymbol(
                                  item.tobePaidRcvd
                                )
                              : ""}
                          </p>
                        </td>
                        <td className="col-3">
                          <p
                            className={
                              ledgerType == "BUYER"
                                ? "coloring"
                                : "paid-coloring"
                            }
                            id="p-common"
                          >
                            {item.balance
                              ? getCurrencyNumberWithOutSymbol(item.balance)
                              : 0}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              className={
                props.dateDisplay
                  ? "ledgerSummary all_ledgerSummary_no_dat"
                  : "all_ledgerSummary all_ledgerSummary_no_dat"
              }
              id=""
            >
              <NoDataAvailable />
            </div>
          )}
        </div>
      ) : (
        <div className="ledger-table">
          {ledgerSummaryByDate.length > 0 ? (
            <div>
              <div className="row thead-tag head_tag">
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
              </div>
              <div
                className={
                  props.dateDisplay ? "ledgerSummary" : "all_ledgerSummaryd"
                }
                id="scroll_style"
              >
                <table className="table table-bordered ledger-table">
                  {/*ledger-table*/}

                  <tbody>
                    {ledgerSummaryByDate.map((item, index) => {
                      return (
                        <tr className="tr-tags" scope="row" kery={item.partyId}>
                          <td className="col-1">
                            <p id="p-common-sno">{index + 1}</p>
                          </td>
                          <td className="col-2">
                            <button
                              className="pl-0"
                              onClick={() =>
                                billOnClickView(
                                  item.refId,
                                  ledgerType,
                                  index,
                                  partyId
                                )
                              }
                            >
                              <p style={{ color: "#0066FF" }}>
                                <div className="d-flex">
                                  <span>{item.refId}</span>
                                  {item?.billPaid ? (
                                    <img
                                      src={tick}
                                      alt="image"
                                      className="ml-2"
                                    />
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </p>
                            </button>
                            <p>{moment(item.date).format("DD-MMM-YY")}</p>
                          </td>

                          <td className={"col-3"}>
                            <p id="p-common">
                              {item.paidRcvd ? item.paidRcvd.toFixed(2) : ""}
                            </p>
                            <p>
                              {item.advance != 0
                                ? ""
                                : item.comments
                                ? item.comments
                                : ""}
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
                                ledgerType == "BUYER"
                                  ? "coloring"
                                  : "paid-coloring"
                              }
                              id="p-common"
                            >
                              {item.balance ? item.balance.toFixed(2) : 0}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div
              className={
                props.dateDisplay
                  ? "ledgerSummary nodata_height"
                  : "all_ledgerSummaryd nodata_height"
              }
              id=""
            >
              <NoDataAvailable />
            </div>
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
          partyType={ledgerType}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default LedgerSummary;
