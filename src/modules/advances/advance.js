import { useEffect, useState } from "react";
import loading from "../../assets/images/loading.gif";
import no_data_icon from "../../assets/images/NodataAvailable.svg";
import SearchField from "../../components/searchField";
const Advance = () => {
  const [isLoading, setLoading] = useState(true);
  const [allData, setAllData] = useState([]);
  useEffect(() => {
    getAllAdvances();
    setLoading(false);
    setAllData([]);
  }, []);
  const getAllAdvances = () =>{
      
  }
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
                    //   onChange={(event) => {
                    //     handleSearch(event);
                    //   }}
                    />
                  </div>
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
