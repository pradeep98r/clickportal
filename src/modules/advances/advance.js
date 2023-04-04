import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdvances } from "../../actions/advancesService";
import loading from "../../assets/images/loading.gif";
import no_data_icon from "../../assets/images/NodataAvailable.svg";
import SearchField from "../../components/searchField";
import moment from "moment";
import single_bill from "../../assets/images/bills/single_bill.svg";
import {
  advanceDataInfo,
  allAdvancesData,
  totalAdvancesVal,
} from "../../reducers/advanceSlice";
import { getMaskedMobileNumber } from "../../components/getCurrencyNumber";
import SelectOptions from "./selectOptions";
import "../../modules/advances/selectedOptions.scss";
const Advance = () => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const advancesData = useSelector((state) => state.advanceInfo);
  const advancesArray = advancesData?.advanceDataInfo;
  const allData = advancesData.allAdvancesData;
  const totalAdvances = advancesData?.totalAdvancesVal;
  useEffect(() => {
    getAllAdvances();
  }, []);
  const getAllAdvances = () => {
    getAdvances(clickId)
      .then((res) => {
        console.log(res.data);
        if (res.data.status.type === "SUCCESS") {
          if (res.data.data != null) {
            dispatch(allAdvancesData(res.data.data.advances));
            dispatch(advanceDataInfo(res.data.data.advances));
            if (res.data.data.totalAdvances != 0) {
              dispatch(totalAdvancesVal(res.data.data.totalAdvances));
            }
          } else {
            dispatch(allAdvancesData([]));
          }
        }
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };
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
      } else if (data.partyAddress.toLowerCase().includes(value)) {
        return data.partyAddress.toLowerCase().search(value) != -1;
      } else if (data.shortName.toLowerCase().includes(value)) {
        return data.shortName.toLowerCase().search(value) != -1;
      }
    });
    dispatch(advanceDataInfo(result));
  };
  return (
    <div className="main_div_padding">
      <div>
        {isLoading ? (
          <div className="">
            <img src={loading} alt="my-gif" className="gif_img" />
          </div>
        ) : (
          <div>
            {allData.length > 0 ? (
              <div className="row">
                <div className="col-lg-5 pl-0">
                 <div className="row">
                    <div className="col-lg-8 pl-0" id="search-field">
                        <SearchField
                          placeholder="Search by Name / Short Code"
                            onChange={(event) => {
                              handleSearch(event);
                            }}
                        />
                    </div>
                    <div className="col-lg-4 pl-0">
                      <SelectOptions />
                    </div>
                 </div>
                  {advancesArray.length > 0 ? (
                  <div>
                  <div
                    className="table-scroll ledger-table"
                    id="scroll_style"
                  >
                    <div className="ledgers ledger_table_col">
                      <div className="row theadr-tag p-0">
                        <th class="col-lg-1">#</th>
                        <th class="col-lg-2">Date</th>
                        <th class="col-lg-6">Buyer Name</th>
                        <th class="col-lg-3">
                            To Be Recieved(&#8377;)
                          </th>
                      </div>
                      <div>
                        {advancesArray.map((item, index) => {
                          return (
                            
                              <button
                                // className={
                                //   partyId == item.partyId
                                //     ? "tabRowSelected p-0"
                                //     : "tr-tags p-0"
                                // }
                                // onClick={() =>
                                //   particularLedgerData(item.partyId, item)
                                // }
                              >
                                <div className="row align-items-center">
                                  <td className="col-lg-1">
                                    {index + 1}
                                  </td>
                                  <td
                                    key={item.date}
                                    className="col-lg-2"
                                  >
                                    <p className="date_ledger_val">
                                      {" "}
                                      {moment(item.date).format(
                                        "DD-MMM-YY"
                                      )}
                                    </p>
                                  </td>
                                  <td
                                    key={item.partyName}
                                    className="col-lg-6"
                                  >
                                    <div className="d-flex">
                                      <div className="c-img">
                                        {item.profilePic ? (
                                          <img
                                            className="profile-img"
                                            src={item.profilePic}
                                            alt="pref-img"
                                          />
                                        ) : (
                                          <img
                                            className="profile-img"
                                            src={single_bill}
                                            alt="img"
                                          />
                                        )}
                                      </div>
                                      <div>
                                        <p className="namedtl-tag">
                                          {item.partyName} -{" "}
                                          {item.shortName}
                                        </p>
                                        <div className="d-flex align-items-center">
                                          <p className="mobilee-tag">
                                            {!item.trader
                                              ? 'Farmmer'
                                              : "Trader"}{" "}
                                            - {item.partyId}&nbsp;
                                          </p>
                                          <p className="mobilee-tag desk_responsive">
                                            {" | " +
                                              getMaskedMobileNumber(
                                                item.mobile
                                              )}
                                          </p>
                                        </div>
                                        <p className="mobilee-tag mobile_responsive">
                                          {getMaskedMobileNumber(
                                            item.mobile
                                          )}
                                        </p>
                                        <p className="address-tag">
                                          {item.partyAddress
                                            ? item.partyAddress
                                            : ""}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td
                                    className="col-lg-3"
                                    key={item.tobePaidRcvd}
                                  >
                                    <p
                                      className='paid-coloring'
                                    >
                                      789
                                    </p>
                                  </td>
                                </div>
                              </button>
                           
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="outstanding-pay d-flex align-items-center justify-content-between">
                  <p className="pat-tag">Outstanding Recievables:</p>
                    <p
                      className='values-tag'
                    >
                      
                    </p>
                  </div>
                </div>

                  ) : (
                    <div className="table-scroll nodata_scroll">
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
        )}
      </div>
    </div>
  );
};
export default Advance;
