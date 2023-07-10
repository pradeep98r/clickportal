import { useSelector } from "react-redux";
import {
  getCurrencyNumberWithOneDigit,
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
  getMaskedMobileNumber,
} from "../../components/getCurrencyNumber";
import single_bill from "../../assets/images/bills/single_bill.svg";
import { getText } from "../../components/getText";
import "../../modules/advances/advances.scss";
import NoDataAvailable from "../../components/noDataAvailable";
import moment from "moment";
import no_data_icon from "../../assets/images/NodataAvailable.svg";
import { qtyValues } from "../../components/qtyValues";
const ByCropSummary = (props) => {
  const tabClick = useSelector((state) => state.ledgerSummaryInfo);
  const allCustomTab = tabClick?.allCustomTabs;
  const reportsData = useSelector((state) => state.reportsInfo);
  const summary = reportsData?.byCropSummary;
  const summaryObj = reportsData?.byCropSummaryObj;
  const selectedParty = reportsData?.selectedCropIdObj;
  const partyType = props.type;
  return (
    <div>
      {summaryObj != null || selectedParty != null ? (
        <div>
          <div className="card details-tag">
            <div className="card-body advance_card_body" id="card-details">
              <div className="row">
                <div
                  className="col-lg-5 d-flex align-items-center pl-0"
                  id="verticalLines"
                >
                  <div className="pl-0 d-flex align-items-center">
                    {selectedParty.imageUrl != "" ? (
                      <img
                        id="singles-img"
                        src={selectedParty.imageUrl}
                        alt="buy-img"
                      />
                    ) : (
                      <img id="singles-img" src={single_bill} alt="img" />
                    )}
                    <p id="card-text">
                      <p className="namedtl-tag">{selectedParty.cropName}</p>
                      
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 d-flex align-items-center">
                  <p className="card-text paid">
                    Total Quantities
                    <p className="">
                      {summaryObj != null
                        ? summaryObj?.totalUnits != 0
                          ? getCurrencyNumberWithOutSymbol(
                              summaryObj?.totalUnits
                            ) +
                            " | " +
                            (summaryObj?.totalWeight != 0
                              ? getCurrencyNumberWithOutSymbol(
                                  summaryObj?.totalWeight
                                )
                              : 0)
                          : 0
                        : 0}
                    </p>
                  </p>
                </div>
                <div className="col-lg-3 d-flex align-items-center">
                  <p className="card-text paid">
                    Total Sales
                    <p className="">
                      {summaryObj != null
                        ? summaryObj?.totalItemsRate != 0
                          ? getCurrencyNumberWithSymbol(
                              summaryObj?.totalItemsRate
                            )
                          : 0
                        : 0}
                    </p>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={
              allCustomTab == "all"
                ? "ledgerSummary byseller_table"
                : "ledgerSummary byseller_table_custom"
            }
            id="scroll_style"
          >
            {summary.length > 0 ? (
              <div>
                <table className="table table-bordered advance_table_border">
                  <thead>
                    <tr className="theadr-tag p-0">
                      <th class="col-1"><p id="p-common-sno">#</p></th>
                      <th class="col-2">Name</th>
                      <th class="col-6">
                        Item<br></br> Unit | Kgs | Rate
                      </th>
                      <th class="col-3">Total(₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.map((item, index) => {
                      return (
                        <tr className="align-items-center">
                          <td className="col-1"><p id="p-common-sno">{index + 1}</p></td>
                          <td className="col-2">
                            <div>
                              <p className="date_ledger_val">
                                {item.partyName}
                              </p>
                              <p>
                                <span className="color_blue">
                                  {item.billId}
                                </span>
                                {" | " + moment(item.date).format("DD-MMM-YY")}
                              </p>
                            </div>
                          </td>
                          <td className="col-6">
                            <p>{item.cropName}</p>
                            <p className="d-flex">
                              <span>
                                {qtyValues(
                                  item.qty,
                                  item.qtyUnit,
                                  item.weight,
                                  item.wastage,
                                  item.rateType
                                )}
                              </span>
                              &nbsp;
                              <span>
                                {" | " +
                                  (item.rate != 0
                                    ? getCurrencyNumberWithOneDigit(item.rate)
                                    : 0)}
                              </span>
                            </p>
                          </td>
                          <td className="col-3" key={item.total}>
                            <p className="">
                              {item.total != 0
                                ? getCurrencyNumberWithOutSymbol(item.total)
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
              <div className="">
                <NoDataAvailable />
              </div>
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
    </div>
  );
};
export default ByCropSummary;
