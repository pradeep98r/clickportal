import { Modal } from "react-bootstrap";
import { getAllCrops } from "../../actions/billCreationService";
import { useEffect, useState } from "react";
import close from "../../assets/images/close.svg";
import "../../modules/buy_bill_book/step2.scss";
import SearchField from "../../components/searchField";
import NoDataAvailable from "../../components/noDataAvailable";
import tickMark from "../../assets/images/tick_mark.svg";
const SelectCrop = (props) => {
  const [allData, setAllData] = useState([]);
  let [allCropsData, allCropResponseData] = useState(allData);
  const [selected, setSelected] = useState([]);
  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);

  useEffect(() => {
    fetchCropData();
  }, [props.show]);
  const fetchCropData = () => {
    getAllCrops().then((response) => {
      response.data.data.map((item) => {
        Object.assign(item, { cropSelect: "" });
      });
      setAllData(response.data.data);
      allCropResponseData(response.data.data);
    });
  };

  const [stat, setStat] = useState(false);
  const addCropOnclick = (crop_item) => {
    if (!selected.includes(crop_item)) {
      let newSelected = [...selected, crop_item];
      newSelected.map((item) => {
        item.cropSelect = "active";
      });
      setSelected(newSelected);
      setStat(true);
    } else {
      setStat(false);
      let newSelected = selected.filter((t) => t.cropId !== crop_item.cropId);
      setSelected(newSelected);
    }
  };

  const addCropClickNext = (event) => {
    if (stat === true) {
      props.cropCallback(selected, true);
      while (selected.length > 0) {
        selected.pop();
      }
    } else {
      props.cropCallback(selected, true);
      selected.map((item) => {
        item.cropSelect = "";
      });
      setSelected([]);
    }
    setSearchValue("");
  };

  const [searchValue, setSearchValue] = useState("");
  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = allData.filter((data) => {
      if (data.cropName.toLowerCase().includes(value)) {
        return data.cropName.toLowerCase().search(value) != -1;
      }
    });
    allCropResponseData(result);
    setSearchValue(value);
  };
  const closeCropModalPopup = () => {
    props.close();
    setSearchValue("");
    setSelected([]);
  };
  return (
    <Modal
      show={props.show}
      close={props.close}
      className="modal_popup allCrops_modal"
    >
      <div className="modal-header d-block date_modal_header crop_modal_head pb-0">
       <div className="d-flex align-items-center justify-content-between">
       <h5 className="modal-title header2_text" id="staticBackdropLabel">
          {langFullData.selectCrop}
        </h5>
        <img
          src={close}
          alt="image"
          className="close_icon"
          onClick={() => {
            closeCropModalPopup();
          }}
        />
       </div>
        <div className="d-flex crop_search mt-2" role="search">
          <SearchField
            placeholder="Search"
            val={searchValue}
            onChange={(event) => {
              handleSearch(event);
            }}
          />
        </div>
      </div>
      <div className="modal-body crop_modal_body" id="scroll_style">
        <div className="d-flex flex_width">
          {allCropsData.length > 0 ? (
            allCropsData.map((crop_item, index) => {
              return (
                <div className="col-lg-2 p-0">
                  <div
                    className={`text-center crop_div mr-0 crop ${
                      selected.includes(crop_item) &&
                      crop_item.cropSelect === "active"
                        ? "active"
                        : ""
                    }`}
                    key={index}
                    onClick={() => addCropOnclick(crop_item)}
                  >
                    {selected.includes(crop_item) &&
                    crop_item.cropSelect === "active" ? (
                      <img src={tickMark} alt="image" className="crop_tick" />
                    ) : (
                      ""
                    )}
                    <img
                      src={crop_item.imageUrl}
                      className="flex_class mx-auto cropImg"
                    />
                    <p className="p-0">{crop_item.cropName}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="d-flex mx-auto">
              <NoDataAvailable />
            </div>
          )}
        </div>
      </div>
      <div className="modal-footer crop_footer">
        <button type="button" className="secondary_btn" onClick={() => {
            closeCropModalPopup();
          }}>
          Cancel
        </button>
        <button
          type="button"
          className="primary_btn ml-3"
          onClick={(e) => {
            addCropClickNext(e);
            props.close();
          }}
        >
          CONTINUE
        </button>
      </div>
      <a className="backdrop"></a>
    </Modal>
  );
};
export default SelectCrop;
