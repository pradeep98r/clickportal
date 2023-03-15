import { useEffect, useState } from "react";
import { getAllCrops } from "../../actions/billCreationService";
import Navigation from "../../components/navigation";
import "../registration/prfefered.scss";
import right_click from "../../assets/images/right_click.svg";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { saveCropPreference } from "../../actions/loginService";
import { useNavigate } from "react-router-dom";
const PreferredCrops = () => {
  useEffect(() => {
    getAllCrops().then((response) => {
      allCropResponseData(response.data.data);
    });
  }, []);
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
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
          toast.success(response.data.status.description,{toastId:'success1'});
          localStorage.setItem('status',response.data.status.type);
          navigate('/plans');
          //window.location.reload();
        }
      },
      (error) => {
        toast.error(error.response.data.status.description,{toastId:'errorr1'});
      }
    );
  };
  
  const [active, setIsActive] =useState(false);
  const [cropsData, setFilteredCrops] =useState([]);
  const searchCrop =(search)=>{
    setSelectCrop(search);
    if(cropItem!==""){
      const filteredCropName=allCropsData.filter(item=>{
        if(item.cropName.toLowerCase().includes(cropItem.toLowerCase())){
        return(
          item.cropName.toLowerCase().includes(cropItem.toLowerCase())
        )}
        else if(search==""){
          return setIsActive(false);
        }
        else if(search !== item.cropName.toLowerCase()){
          console.log("actice",search,item.cropName.toLowerCase())
          return setIsActive(true);
        } 
      })
      setFilteredCrops(filteredCropName);
    }
    else{
      //console.log(false);
      setIsActive(false);
      setFilteredCrops(allCropsData);
    }
  }
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
            onChange={(event) => searchCrop(event.target.value)}
          />
        </div>
        <div  id="search-no-data" style={{display:active && cropItem.length>0?"block":"none"}}><p>Crop Not Found</p></div>
        {cropItem.length > 1 ? (
          <div className="cropdiv" id="scroll_style">
            <div className="d-flex flex_width">
              {cropsData
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
                      <p>{crop_item.cropName + 'hi'}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ):(<div className="cropdiv" id="scroll_style">
        <div className="d-flex flex_width">
          {allCropsData
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
        <ToastContainer />
      </div>
    </div>
  );
};
export default PreferredCrops;
