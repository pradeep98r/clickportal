import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdvances } from "../../actions/advancesService";
import loading from "../../assets/images/loading.gif";
import no_data_icon from "../../assets/images/NodataAvailable.svg";
import SearchField from "../../components/searchField";
import {
  advanceDataInfo,
  allAdvancesData,
  totalAdvancesVal,
} from "../../reducers/advanceSlice";
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
                  <div id="search-field">
                    <SearchField
                      placeholder="Search by Name / Short Code"
                        onChange={(event) => {
                          handleSearch(event);
                        }}
                    />
                  </div>
                  {advancesArray.length > 0 ? (
                    "hey"
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
