import { Modal } from "react-bootstrap";
import { getAllCrops } from "../../actions/billCreationService";
import { useEffect, useState } from "react";
import close from "../../assets/images/close.svg";
import "../../modules/buy_bill_book/step2.scss";
const SelectCrop = (props) => {
  let [allCropsData, allCropResponseData] = useState([]);
  const [cropItem, setSelectCrop] = useState("");
  const [selected, setSelected] = useState([]);
  useEffect(() => {
    fetchCropData();
  }, []);
  const fetchCropData = () => {
    getAllCrops().then((response) => {
      allCropResponseData(response.data.data);
    });
  };
  const addCropOnclick = (crop_item) => {
    console.log(crop_item);
    if (!selected.includes(crop_item)) {
      let newSelected = [...selected, crop_item];
      setSelected(newSelected);
      props.cropCallback(crop_item);
    } else {
      let newSelected = selected.filter((t) => t !== crop_item);
      setSelected(newSelected);
    }
  };

  return (
    <Modal
      show={props.show}
      close={props.close}
      className="modal_popup allCrops_modal"
    >
      <div className="modal-header date_modal_header smartboard_modal_header">
        <h5 className="modal-title header2_text" id="staticBackdropLabel">
          Select Crop
        </h5>
        <img
          src={close}
          alt="image"
          className="close_icon"
          onClick={props.close}
        />
        <div className="d-flex crop_search" role="search">
          <input
            className="form-control search"
            type="search"
            placeholder="Search"
            aria-label="Search"
            onChange={(event) => setSelectCrop(event.target.value)}
          />
        </div>
      </div>
      <div className="modal-body crop_modal_body" id="scroll_style">
        {allCropsData.length > 0 && (
          <div className="d-flex flex_width">
            {allCropsData
              .filter((crop_item) => {
                if (cropItem === "") {
                  return crop_item;
                } else if (
                  crop_item.cropName
                    .toLowerCase()
                    .includes(cropItem.toLowerCase())
                ) {
                  return crop_item;
                }
              })
              .map((crop_item, index) => (
                <div className="col-lg-2">
                  <div
                    className={`text-center crop_div mr-0 crop ${
                      selected.includes(crop_item) ? "active" : ""
                    }`}
                    key={index}
                    onClick={() => addCropOnclick(crop_item)}
                  >
                    <img
                      src={crop_item.imageUrl}
                      className="flex_class mx-auto"
                    />
                    <p className="p-0">{crop_item.cropName}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      <div className="modal-footer">
        <button type="button" className="secondary_btn" onClick={props.close}>
          Cancel
        </button>
        <button
          type="button"
          className="primary_btn ml-3"
          onClick={props.close}
        >
          Next
        </button>
      </div>
      <a className="backdrop"></a>
    </Modal>
  );
};
export default SelectCrop;
