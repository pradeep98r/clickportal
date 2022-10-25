import { useEffect, useState } from "react";
import { getAllCrops } from "../../actions/billCreationService";
import Navigation from "../../components/navigation";
import "../registration/prfefered.scss";
import right_click from "../../assets/images/right_click.svg";
import toastr from "toastr";
import { saveCropPreference } from "../../actions/loginService";
import { useNavigate } from "react-router-dom";
const PreferredCrops = () => {
  useEffect(() => {
    getAllCrops().then((response) => {
      allCropResponseData(response.data.data);
    });
  }, []);
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const [cropItem, setSelectCrop] = useState("");
  const [allCropsData, allCropResponseData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedNumber, setSelectedNum] = useState(0);
  const navigate = useNavigate();
  const addCropOnclick = (crp_item) => {
    if (!selected.includes(crp_item) && selected.length < 15) {
      let newSelected = [...selected, crp_item];
      console.log(selected.length, "length", newSelected, crp_item);
      setSelected(newSelected);
      setSelectedNum(selected.length + 1);
    } else {
      let newSelected = selected.filter((t) => t !== crp_item);
      setSelected(newSelected);
      console.log(selected.length, "length", newSelected);
      setSelectedNum(selected.length - 1);
    }
  };
  var lineItemsArray = [];
  var len = selected.length;
  for (var i = 0; i < len; i++) {
    lineItemsArray.push({
      prefId: selected[i].cropId,
      status: 1,
    });
  }
  const obj = {
    prefType: "CROP",
    preferences: lineItemsArray,
  };
  const onPreferedCropsubmit = () => {
    saveCropPreference(obj, clickId).then(
      (response) => {
        if (response.data.status.type === "SUCCESS") {
          toastr.success(response.data.status.description);
          localStorage.setItem('status',response.data.status.type);
          navigate('/smartboard');
        }
      },
      (error) => {
        toastr.error(error.response.data.status.description);
      }
    );
  };
  return (
    <div>
      <div className="login_nav">
          <h1>Prefered Crops</h1>
          <p>Choose uo to 15 crops, {selectedNumber}/15 selected</p>
      </div>
      <div className="container">
        <div className="d-flex search_div" role="search">
          <input
            className="form-control search"
            type="search"
            placeholder="Search"
            aria-label="Search"
            onChange={(event) => setSelectCrop(event.target.value)}
          />
        </div>
        {allCropsData.length > 0 && (
          <div className="cropdiv" id="scroll_style">
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
                  <div className="cropItem_div" key={index}>
                    <div
                      className={`text-center crop_div crop ${
                        selected.includes(crop_item) ? "active" : ""
                      }`}
                      onClick={() => addCropOnclick(crop_item)}
                    >
                      {/* <img src={`${selected.includes(crop_item) ? right_click : ''}`} /> */}
                      <img
                        src={crop_item.imageUrl}
                        className="flex_class mx-auto crop_img"
                      />
                      <p>{crop_item.cropName}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
      <div className="bottom_div pref_bottom_div">
        <button
          className="primary_btn"
          type="submit"
          onClick={onPreferedCropsubmit}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};
export default PreferredCrops;
