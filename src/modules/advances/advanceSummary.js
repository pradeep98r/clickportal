import { useDispatch, useSelector } from "react-redux";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
  getMaskedMobileNumber,
} from "../../components/getCurrencyNumber";
import single_bill from "../../assets/images/bills/single_bill.svg";
import { getText } from "../../components/getText";
import "../../modules/advances/advances.scss";
import NoDataAvailable from "../../components/noDataAvailable";
import moment from "moment";
import { getAdvanceListById } from "../../actions/ledgersService";
import { paymentViewInfo } from "../../reducers/paymentViewSlice";
import PaymentHistoryView from "../ledgers/paymentHistory";
import { useState } from "react";
import { fromAdvanceFeature } from "../../reducers/advanceSlice";
import no_data_icon from "../../assets/images/NodataAvailable.svg";
const AdvanceSummary = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const advancesData = useSelector((state) => state.advanceInfo);
  const advancesSummary = advancesData?.fromTransportoRecord
    ? advancesData?.advanceSummaryById
    : props.advancesSum;
  const selectedParty = advancesData?.selectedPartyByAdvanceId;
  const totalAdvancesValByPartyId = advancesData?.totalAdvancesValById;
  const totalCollectedValByPartyId = advancesData?.totalCollectedById;
  const totalGivenValByPartyId = advancesData?.totalGivenById;
  const dispatch = useDispatch();
  const tabClick = useSelector((state) => state.ledgerSummaryInfo);
  const allCustomTab = tabClick?.allCustomTabs;
  const partyType = props.partyType;
  const [showPaymentModalStatus, setShowPaymentModalStatus] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const ledgerTabs = props.ledgerTabs;
  console.log(advancesSummary, props.advancesSum, "props.advancesSum");
  const billOnClickView = (billId, partyId) => {
    var bId = billId.replace("-", "").replace("C", "").replace("U", "");
    if (bId?.includes("A")) {
      getAdvanceListById(clickId, bId, partyId).then((res) => {
        if (res.data.status.type === "SUCCESS") {
          dispatch(fromAdvanceFeature(true));
          dispatch(paymentViewInfo(res.data.data));
          setShowPaymentModalStatus(true);
          setShowPaymentModal(true);
        }
      });
    }
  };
  return (
    <div>
      {advancesSummary.length > 0 ? (
        <div>
          {ledgerTabs == "detailedadvances" ? (
            ""
          ) : (
            <div className="card details-tag">
              <div className="card-body advance_card_body" id="card-details">
                <div className="row">
                  <div
                    className="col-lg-3 d-flex align-items-center pl-0"
                    id="verticalLines"
                  >
                    <div className="pl-0 d-flex" key={selectedParty.partyId}>
                      {selectedParty.profilePic ? (
                        <img
                          id="singles-img"
                          src={selectedParty.profilePic}
                          alt="buy-img"
                        />
                      ) : (
                        <img id="singles-img" src={single_bill} alt="img" />
                      )}
                      <p id="card-text">
                        <p className="namedtl-tag">{selectedParty.partyName}</p>
                        <div className="d-flex align-items-center">
                          <p className="mobilee-tag">
                            {/* {!selectedParty.trader */}
                            {/* // ? partyType == "FARMER"
                              //   ? "Farmer"
                              //   : getText(partyType)
                              // : "Trader"}{" "} */}
                            Farmer - {selectedParty.partyId}
                          </p>
                        </div>
                        <p className="mobilee-tag">
                          {getMaskedMobileNumber(selectedParty?.mobile)}
                        </p>
                      </p>
                    </div>
                  </div>
                  <div
                    className="col-lg-3 d-flex align-items-center"
                    id="verticalLines"
                  >
                    <p className="card-text paid">
                      Total Given
                      <p className="paid-coloring">
                        {totalGivenValByPartyId != 0
                          ? getCurrencyNumberWithSymbol(totalGivenValByPartyId)
                          : 0}
                      </p>
                    </p>
                  </div>
                  <div
                    className="col-lg-3 d-flex align-items-center"
                    id="verticalLines"
                  >
                    <p className="card-text paid">
                      Total Collected
                      <p className="paid-coloring">
                        {totalCollectedValByPartyId != 0
                          ? getCurrencyNumberWithSymbol(
                              totalCollectedValByPartyId
                            )
                          : 0}
                      </p>
                    </p>
                  </div>

                  <div className="col-lg-3 d-flex align-items-center" id="">
                    <p className="card-text paid">
                      Total Advances
                      <p className="paid-coloring">
                        {totalAdvancesValByPartyId != 0
                          ? getCurrencyNumberWithSymbol(
                              totalAdvancesValByPartyId
                            )
                          : 0}
                      </p>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div>
            {advancesSummary.length > 0 ? (
              <div>
                <div className="row thead-tag">
                  <th className="col-1" id="sno">
                    #
                  </th>
                  <th className="col-2">Ref ID | Date</th>
                  <th className="col-3">Given(₹) </th>
                  <th className="col-3">Collected(₹) </th>
                  <th className="col-3">Balance(₹) </th>
                </div>
                <div
                  className={
                    allCustomTab == "all"
                      ? "ledgerSummary advance_ledgerSummary " +
                        (ledgerTabs == "detailedadvances"
                          ? ""
                          : "advance_ledgerSummary_tab")
                      : "ledgerSummary advance_ledgerSummary_custom " +
                        (ledgerTabs == "detailedadvances"
                          ? ""
                          : "advance_ledgerSummary_tab_custom")
                  }
                  id="scroll_style"
                >
                  <table className="table table-bordered advance_table_border ledger-table">
                    <tbody>
                      {advancesSummary.map((item, index) => {
                        return (
                          <tr
                            className="tr-tags"
                            scope="row"
                            kery={item.partyId}
                          >
                            <td className="col-1">
                              <p id="p-common-sno">{index + 1}</p>
                            </td>
                            <td className="col-2">
                              <button
                                className="pl-0"
                                onClick={() =>
                                  billOnClickView(
                                    item.refId,
                                    item.partyId != 0
                                      ? item.partyId
                                      : selectedParty?.partyId
                                  )
                                }
                              >
                                <p style={{ color: "#0066FF" }}>
                                  <div className="d-flex">
                                    <span>{item.refId}</span>
                                  </div>
                                </p>
                              </button>
                              <p>{moment(item.advDate).format("DD-MMM-YY")}</p>
                            </td>
                            <td className="col-3">
                              <p id="p-common" className="paid-coloring">
                                {item.givenAdv
                                  ? getCurrencyNumberWithOutSymbol(
                                      item.givenAdv
                                    )
                                  : 0}
                              </p>
                            </td>
                            <td className="col-3">
                              {" "}
                              <p id="p-common" className="paid-coloring">
                                {item.collectedAdv
                                  ? getCurrencyNumberWithOutSymbol(
                                      item.collectedAdv
                                    )
                                  : 0}
                              </p>
                            </td>

                            <td className="col-3">
                              <p id="p-common" className="paid-coloring">
                                {item.advBal
                                  ? getCurrencyNumberWithOutSymbol(item.advBal)
                                  : 0}
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
              <NoDataAvailable />
            )}
          </div>
        </div>
      ) : (
        <div className="row partner_no_data_widget_rows">
          <div className="col-lg-5">
            <div className="partner_no_data_widget">
              <div className="text-center">
                <img
                  src={no_data_icon}
                  alt="icon"
                  className="d-flex mx-auto justify-content-center"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {showPaymentModalStatus ? (
        <PaymentHistoryView
          showPaymentViewModal={showPaymentModal}
          closePaymentViewModal={() => setShowPaymentModal(false)}
          partyType="FARMER"
        />
      ) : (
        ""
      )}
    </div>
  );
};
export default AdvanceSummary;
