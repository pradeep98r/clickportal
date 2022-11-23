import { Modal } from "react-bootstrap";
import "../../modules/buy_bill_book/step2.scss";
import other_crop from "../../assets/images/other_crop.svg";
import { useState, useEffect } from "react";
import { getPreferredCrops } from "../../actions/billCreationService";
import delete_icon from "../../assets/images/delete.svg";
import copy_icon from "../../assets/images/copy.svg";
import toastr from "toastr";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import SelectCrop from "../buy_bill_book/selectCrop";
  import SellbillStep3Modal from "./step3";
var array = [];
const SellbillStep2Modal = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const clientId = loginData.authKeys.clientId;
  const clientSecret = loginData.authKeys.clientSecret;

  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);
  console.log(langFullData);

  let [preferedCropsData, setPreferedCropsData] = useState([]);
  let [cropData, cropResponseData] = useState(array);
  const [cropInfoModal, setCropInfoModal] = useState(false);
  const [cropInfoModalStatus, setCropInfoModalStatus] = useState(false);
  const [cropId, setCropId] = useState(0);
  const [cropClear, setCropClear] = useState(false);
  const cropOnclick = (crop, id, index) => {
    setCropId(id);
    console.log(crop);
    Object.assign(
      crop,
      { wastageValue: 0 },
      { unitValue: 0 },
      { rateType: "kgs" },
      { weightValue: 0 },
      { rateValue: 0 },
      { totalValue: 0 }
    );
    if (crop.cropId === id) {
      crop.count = crop.count + 1;
      crop.cropActive = true;
      console.log(crop.count, "after click");
    }
    cropResponseData([...cropData, crop]);
    console.log(crop.units);
    preferedCropsData[index].units = "Crates";
  };
  const allCropData = () => {
    setCropInfoModalStatus(true);
    setCropInfoModal(true);
    setCropClear(true);
  };
  const fetchData = () => {
    getPreferredCrops(clickId, clientId, clientSecret)
      .then((response) => {
        response.data.data.map((item) => {
          Object.assign(item, { count: 0 }, { cropActive: false });
        });
        setPreferedCropsData(response.data.data);
        console.log(response.data.data, "crops preferred");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  var arr = [];
  const cropDataFunction = (childData, status) => {
    if (status === true) {
      var list = preferedCropsData;
      childData.map((i, ind) => {
        var index = list.findIndex((obj) => obj.cropId == i.cropId);
        if (index != -1) {
          var existedItem = list[index];
          existedItem.count += 1;
          list[index] = existedItem;
          console.log(list[index], "if");
          setPreferedCropsData([...list, ...arr]);
          cropResponseData([...cropData, ...arr]);
          Object.assign(list[index], { cropActive: true });
        } else {
          console.log(i, "else");
          Object.assign(
            i,
            { count: 1 },
            { cropActive: true },
            { cropSelect: "active" },
            { wastageValue: 0 },
            { unitValue: 0 },
            { rateType: "kgs" },
            { weightValue: 0 },
            { rateValue: 0 },
            { totalValue: 0 }
          );
          arr.push(i);
          setPreferedCropsData([...preferedCropsData, ...arr]);
          cropResponseData([...cropData, ...arr]);
          console.log(arr, "pushed arr");
        }
      });
    } else {
      let deSelectedCrop = preferedCropsData.filter(
        (item) => item.cropId !== childData.cropId
      );
      setPreferedCropsData(deSelectedCrop);
    }
  };
  const [selectedOption, setSelectedOption] = useState("Crates");

  const [state, setState] = useState({
    quantity: "",
    rate: "",
    totalWeight: "",
    wastage: "",
    total: "",
    activeLink: "",
    activeLinkRatettype: "",
  });

  const [quantityValue, setunitValue] = useState();
  const [wastagesValue, setwastageValue] = useState();
  const [rateDefaultValue, setrateValue] = useState();
  const [weightDefaultValue, setweightValue] = useState();
  const getWastageValue = (id, index, cropitem) => (e) => {
    console.log(id, index, cropitem, e.target.value);
    if (cropitem[index].cropId == id) {
      setwastageValue(e.target.value);
      cropitem[index].wastageValue = e.target.value;
      console.log(cropitem[index].wastageValue);
    }
    setCropId(id);
  };
  const getQuantityValue = (id, index, cropitem) => (e) => {
    console.log(id, index, cropitem, e.target.value);
    if (cropitem[index].cropId == id) {
      setunitValue(e.target.value);
      cropitem[index].unitValue = e.target.value;
    }
    setCropId(id);
  };
  const getWeightValue = (id, index, cropitem) => (e) => {
    console.log(id, index, cropitem);
    if (cropitem[index].cropId == id) {
      setweightValue(e.target.value);
      cropitem[index].weightValue = e.target.value;
    }
    setCropId(id);
  };
  const [selectedSellbillCropsData, setSelectedSellbillCropsData] = useState([]);
  const getRateValue = (id, index, cropitem) => (e) => {
    if (cropitem[index].cropId == id) {
      setrateValue(e.target.value);
      cropitem[index].rateValue = e.target.value;
      if (cropitem[index].rateType == "kgs") {
        cropitem[index].totalValue =
          (cropitem[index].weightValue - cropitem[index].wastageValue) *
          cropitem[index].rateValue;
      } else {
        cropitem[index].totalValue =
          (cropitem[index].unitValue - cropitem[index].wastageValue) *
          cropitem[index].rateValue;
        console.log(cropitem[index].totalValue);
      }
    }
    setCropId(id);
    console.log(cropitem);
    setSelectedSellbillCropsData(cropitem);
  };
  const [selectedOptionNnew1, setSelectedOptionNew1] = useState("Crates");
  const getQuantity = (id, index, cropitem) => (e) => {
    setState({ activeLink: id });
    console.log(id, index, cropitem);
    if (cropitem[index].cropId == id) {
      if (e.target.value == "kgs") {
        setSelectedOption("kgs");
        setSelectedOptionNew1("kgs");
        cropitem[index].units = "kgs";
        console.log("kgsssss", cropitem[index].units, e.target.value);
      } else {
        setSelectedOption(e.target.value);
        console.log("other");
        setSelectedOptionNew1(e.target.value);
      }
      cropitem[index].units = e.target.value;
    }
    setCropId(id);
  };
  const [selectedratetype, setSelectedratetype] = useState("kgs");
  const getRatetypeQuantity = (id, index, cropitem) => (e) => {
    setState({ activeLink: id, activeLinkRatettype: id });
    if (cropitem[index].cropId == id) {
      setSelectedratetype(e.target.value);
      cropitem[index].rateType = e.target.value;
      cropitem[index].units = e.target.value;
      console.log(cropitem[index].rateType, e.target.value, selectedOption);
    }
    setCropId(id);
  };
  const [showStep3Modal, setShowStep3Modal] = useState(false);
  const [showStep3ModalStatus, setShowStep3ModalStatus] = useState(false);
  const addStep3Modal = () => {
    cropData.map((item, index) => {
      console.log(cropData[index].unitValue)
      if(cropData[index].unitValue == 0){
        toast.error('Please enter Quantity', {
          toastId: "error1" ,
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      else if(cropData[index].weightValue == 0){
        toast.error('Please enter weight', {
          toastId: "error2" ,
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      else if(cropData[index].rateValue == 0){
        toast.error('Please enter rate', {
          toastId: "error3" ,
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      else if(cropData[index].unitValue != 0 && cropData[index].weightValue != 0 &&cropData[index].rateValue != 0){
        setShowStep3ModalStatus(true);
        setShowStep3Modal(true);
      }
    })
  
  };
  const cloneCrop = (crop) => {
    var list = preferedCropsData;
      var index = list.findIndex((obj) => obj == crop);
      if (index != -1) {
        list[index].count += 1;
      console.log(list[index].count,list[index],"count")
      }
      cropResponseData([...cropData, crop]);
  };
  const deleteCrop = (crop, cropArray) => {
    var index = cropArray.indexOf(crop);
    var list = preferedCropsData;
    if (index != -1) {
      console.log(index, crop);
      cropArray.splice(index, 1);
      var index1 = list.findIndex((obj) => obj == crop);
      if (index1 != -1) {
        list[index1].count -= 1;
      console.log(list[index1].count,list[index1],"count")
      }
    }
    cropResponseData([...cropArray]);
  };
  return (
    <Modal
      show={props.show}
      close={props.closeStep2CropModal}
      className="cropmodal_poopup"
    >
      <div className="modal-header date_modal_header smartboard_modal_header">
        <h5 className="modal-title header2_text" id="staticBackdropLabel">
          {langFullData.addCrop}
        </h5>
        <img alt="image" onClick={props.closeStep2CropModal} />
      </div>

      <div className="modal-body">
        <h4 className="smartboard_main_header">Select crop and creat bill</h4>
        <div className="d-flex">
          {preferedCropsData.length > 0 && (
            <div className="d-flex total_crops_div">
              {preferedCropsData.map((crop, index) => (
                <div
                  className="text-center crop_div crop_div_ui"
                  key={crop.cropId}
                  onClick={() => cropOnclick(crop, crop.cropId, index)}
                >
                  <div
                    style={{
                      display:
                        preferedCropsData[index].cropActive === true
                          ? preferedCropsData[index].count == 0 ? 'none': "block"
                          : "none",
                    }} className="crp_count"
                  >
                    {preferedCropsData[index].count == 0 ? '': preferedCropsData[index].count}
                  </div>
                  <img src={crop.imageUrl} className="flex_class mx-auto " />
                  <p>{crop.cropName}</p>
                </div>
              ))}
            </div>
          )}
          <div
            className="text-center crop_div other_Crop"
            onClick={allCropData}
          >
            <img src={other_crop} />
            <p>{langFullData.otherCrop}</p>
          </div>
        </div>
        <div className="crop_table" id="scroll_style">
          <div className="row p-0">
            {cropData.length > 0 && (
              <div className="p-0 w-100">
                <h4 className="smartboard_main_header">Crop Information</h4>
                <div className="table_row" id="scroll_style">
                  {cropData.map((crop, index) => (
                    <div
                      className="crop_div crop_table_div table_crop_div"
                      id={cropData[index].cropId}
                      key={index}
                    >
                      {/* table */}
                      <div className="d-flex crop_table_delete_div">
                        <div className="crop_table_view">
                          {(
                            (selectedOption === "kgs" ||
                              selectedOption === "loads") &&
                            (selectedOptionNnew1 === "kgs" ||
                              selectedOptionNnew1 === "loads")
                              ? (cropData[index].units == "kgs" ||
                                  cropData[index].units == "loads") &&
                                cropData[index].cropId == state.activeLink
                              : cropData[index].units == "kgsl"
                          ) ? (
                            cropData[index].cropId === state.activeLink &&
                            cropData[index].units === selectedOptionNnew1 ? (
                              <table
                                className="table table-bordered mb-0"
                                key={cropData[index].cropId}
                              >
                                <thead>
                                  <tr>
                                    <th>
                                      {langFullData.crops}{" "}
                                      {selectedOptionNnew1 + selectedOption}
                                    </th>
                                    <th>Unit Type</th>

                                    <th>
                                      {langFullData.totalWeight} (
                                      {cropData[index].cropId ==
                                      state.activeLink
                                        ? selectedOption
                                        : cropData[index].units}
                                      )
                                    </th>

                                    {cropData[index].units == "loads" ? (
                                      ""
                                    ) : (
                                      <th>
                                        {langFullData.wastage}(
                                        {cropData[index].cropId ==
                                        state.activeLink
                                          ? selectedOption
                                          : cropData[index].units}
                                        )
                                      </th>
                                    )}
                                    <th>{langFullData.rate}</th>
                                    <th>{langFullData.total}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="col-2">
                                      <div className="flex_class mr-0">
                                        <img
                                          src={cropData[index].imageUrl}
                                          className="flex_class mr-2"
                                        />
                                        <p className="m-0">
                                          {cropData[index].cropName}
                                        </p>
                                      </div>
                                    </td>
                                    <td className="col-1">
                                      <select
                                        className="form-control qty_dropdown dropdown"
                                        value={
                                          cropData[index].cropId ==
                                          state.activeLink
                                            ? selectedOption
                                            : cropData[index].units
                                        }
                                        onChange={getQuantity(
                                          cropData[index].cropId,
                                          index,
                                          cropData
                                        )}
                                      >
                                        <option value="Crates">Crates</option>
                                        <option value="Bags">Bags</option>
                                        <option value="Sacs">Sacs </option>
                                        <option value="Boxes">Boxes </option>
                                        <option value="kgs">Kgs </option>
                                        <option value="loads">Loads </option>
                                      </select>
                                    </td>

                                    <td className="col-2">
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="weight"
                                        value={cropData[index].weightValue}
                                        onChange={getWeightValue(
                                          cropData[index].cropId,
                                          index,
                                          cropData
                                        )}
                                      />
                                    </td>
                                    {cropData[index].units == "loads" ? (
                                      ""
                                    ) : (
                                      <td className="col-2">
                                        <input
                                          type="text"
                                          name="wastage"
                                          className="form-control wastage_val"
                                          value={cropData[index].wastageValue}
                                          onChange={getWastageValue(
                                            cropData[index].cropId,
                                            index,
                                            cropData
                                          )}
                                        />
                                      </td>
                                    )}
                                    <td className="col-2">
                                      <input
                                        type="text"
                                        name="rate"
                                        value={cropData[index].rateValue}
                                        onChange={getRateValue(
                                          cropData[index].cropId,
                                          index,
                                          cropData
                                        )}
                                      />
                                    </td>
                                    <td className="col-2">
                                      {(cropData[index].weightValue -
                                        cropData[index].wastageValue) *
                                        cropData[index].rateValue}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            ) : (
                              "lll"
                            )
                          ) : (cropData[index].cropId === state.activeLink &&
                              cropData[index].units === selectedOptionNnew1) ||
                            (cropData[index].cropId === cropId &&
                              cropData[index].units ===
                                cropData[index].rateType) ? (
                            <table
                              className="table table-bordered mb-0"
                              key={cropData[index].cropId}
                            >
                              <thead>
                                <tr>
                                  <th>Crop onclick + {index}</th>
                                  <th>Unit Type</th>

                                  <th>Rate Type</th>

                                  <th className="">
                                    Number of{" "}
                                    {crop.cropId == state.activeLink
                                      ? selectedOption + "l"
                                      : cropData[index].units == "Per Kg"
                                      ? "Crates"
                                      : cropData[index].units}
                                  </th>
                                  {cropData[index].cropId === cropId &&
                                  cropData[index].units ==
                                    cropData[index].rateType &&
                                  cropData[index].units == selectedOption ? (
                                    ""
                                  ) : (
                                    <th>
                                      Total Weight (
                                      {cropData[index].cropId ==
                                      state.activeLink
                                        ? "Kgs" +
                                          cropData[index].units +
                                          selectedOption +
                                          cropData[index].rateType
                                        : "kgs" +
                                          cropData[index].units +
                                          selectedOptionNnew1 +
                                          cropData[index].rateType}
                                      )
                                    </th>
                                  )}
                                  <th>
                                    Wastage(
                                    {crop.cropId == state.activeLink
                                      ? "Kgs"
                                      : "Kgs"}
                                    )
                                  </th>
                                  <th>Rate</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="col-2">
                                    <div className="flex_class mr-0">
                                      <img
                                        src={cropData[index].imageUrl}
                                        className="flex_class mr-2"
                                      />
                                      <p className="m-0">
                                        {cropData[index].cropName}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="col-1">
                                    <select
                                      className="form-control qty_dropdown dropdown"
                                      value={
                                        cropData[index].cropId ==
                                        state.activeLink
                                          ? selectedOption
                                          : cropData[index].units
                                      }
                                      onChange={getQuantity(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    >
                                      <option value="Crates">Crates</option>
                                      <option value="Bags">Bags</option>
                                      <option value="Sacs">Sacs </option>
                                      <option value="Boxes">Boxes </option>
                                      <option value="kgs">Kgs </option>
                                      <option value="loads">Loads</option>
                                    </select>
                                  </td>

                                  <td className="col-1 onclick">
                                    <select
                                      className="form-control qty_dropdown dropdown"
                                      value={cropData[index].rateType}
                                      onChange={getRatetypeQuantity(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    >
                                      <option value="kgs">kgs</option>
                                      <option
                                        value={
                                          cropData[index].cropId ==
                                          state.activeLink
                                            ? selectedOption
                                            : cropData[index].rateType
                                        }
                                      >
                                        {cropData[index].cropId ==
                                        state.activeLink
                                          ? selectedOption + "l"
                                          : cropData[index].rateType + "o"}
                                      </option>
                                    </select>
                                  </td>

                                  <td className="col-2">
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="quantity"
                                      value={cropData[index].unitValue}
                                      onChange={getQuantityValue(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    />
                                  </td>
                                  {cropData[index].cropId === cropId &&
                                  cropData[index].units ==
                                    cropData[index].rateType ? (
                                    ""
                                  ) : (
                                    <td className="col-2">
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="weight"
                                        value={cropData[index].weightValue}
                                        onChange={getWeightValue(
                                          cropData[index].cropId,
                                          index,
                                          cropData
                                        )}
                                      />
                                    </td>
                                  )}
                                  <td className="col-1">
                                    <input
                                      type="text"
                                      name="wastage"
                                      className="form-control wastage_val"
                                      value={cropData[index].wastageValue}
                                      onChange={getWastageValue(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    />
                                  </td>
                                  <td className="col-2">
                                    <input
                                      type="text"
                                      name="rate"
                                      className="form-control"
                                      value={cropData[index].rateValue}
                                      onChange={getRateValue(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    />
                                  </td>
                                  <td className="col-2">
                                    {cropData[index].rateType == "kgs"
                                      ? 
                                        (cropData[index].weightValue -
                                          cropData[index].wastageValue) *
                                          cropData[index].rateValue
                                      : 
                                        (cropData[index].unitValue -
                                          cropData[index].wastageValue) *
                                          cropData[index].rateValue}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          ) : cropData[index].units == "kgs" ? (
                            <table
                              className="table table-bordered mb-0"
                              key={cropData[index].cropId}
                            >
                              <thead>
                                <tr>
                                  <th>
                                    Crop{" "}
                                    {cropData[index].units +
                                      "fiii" +
                                      cropData[index].rateType}
                                  </th>
                                  <th>Unit Type</th>

                                  <th>
                                    Total Weight (
                                    {cropData[index].cropId == state.activeLink
                                      ? selectedOption
                                      : cropData[index].units}
                                    )
                                  </th>

                                  {cropData[index].units == "loads" ? (
                                    ""
                                  ) : (
                                    <th>
                                      Wastage(
                                      {cropData[index].cropId ==
                                      state.activeLink
                                        ? selectedOption
                                        : cropData[index].units}
                                      )
                                    </th>
                                  )}
                                  <th>Rate</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="col-2">
                                    <div className="flex_class mr-0">
                                      <img
                                        src={cropData[index].imageUrl}
                                        className="flex_class mr-2"
                                      />
                                      <p className="m-0">
                                        {cropData[index].cropName}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="col-1">
                                    <select
                                      className="form-control qty_dropdown dropdown"
                                      value={
                                        cropData[index].cropId ==
                                        state.activeLink
                                          ? selectedOption
                                          : cropData[index].units
                                      }
                                      onChange={getQuantity(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    >
                                      <option value="Crates">Crates</option>
                                      <option value="Bags">Bags</option>
                                      <option value="Sacs">Sacs </option>
                                      <option value="Boxes">Boxes </option>
                                      <option value="kgs">Kgs </option>
                                      <option value="loads">Loads </option>
                                    </select>
                                  </td>

                                  <td className="col-2">
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="weight"
                                      value={cropData[index].weightValue}
                                      onChange={getWeightValue(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    />
                                  </td>
                                  {cropData[index].units == "loads" ? (
                                    ""
                                  ) : (
                                    <td className="col-2">
                                      <input
                                        type="text"
                                        name="wastage"
                                        className="form-control wastage_val"
                                        value={cropData[index].wastageValue}
                                        onChange={getWastageValue(
                                          cropData[index].cropId,
                                          index,
                                          cropData
                                        )}
                                      />
                                    </td>
                                  )}
                                  <td className="col-2">
                                    <input
                                      type="text"
                                      name="rate"
                                      value={cropData[index].rateValue}
                                      onChange={getRateValue(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    />
                                  </td>
                                  <td className="col-2">
                                    {(cropData[index].weightValue -
                                      cropData[index].wastageValue) *
                                      cropData[index].rateValue}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          ) : (
                            <table
                              className="table table-bordered mb-0"
                              key={cropData[index].cropId}
                            >
                              <thead>
                                <tr>
                                  <th>
                                    Crop otherr
                                    {selectedOption +
                                      cropData[index].units +
                                      cropData[index].rateType}
                                  </th>
                                  <th>Unit Type</th>

                                  <th>Rate Type</th>

                                  <th className="">
                                    Number of{" "}
                                    {crop.cropId == state.activeLink
                                      ? selectedOption
                                      : cropData[index].units == "Per Kg"
                                      ? "Crates"
                                      : cropData[index].units}
                                  </th>
                                  {cropData[index].rateType == "kgs" ? (
                                    <th>
                                      Total Weight (
                                      {cropData[index].cropId ==
                                      state.activeLink
                                        ? "Kgs"
                                        : "Kgs"}
                                      )
                                    </th>
                                  ) : (
                                    ""
                                  )}
                                  <th>
                                    Wastage(
                                    {crop.cropId == state.activeLink
                                      ? "Kgs"
                                      : "Kgs"}
                                    )
                                  </th>
                                  <th>Rate</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="col-2">
                                    <div className="flex_class mr-0">
                                      <img
                                        src={cropData[index].imageUrl}
                                        className="flex_class mr-2"
                                      />
                                      <p className="m-0">
                                        {cropData[index].cropName}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="col-1">
                                    <select
                                      className="form-control qty_dropdown dropdown"
                                      value={
                                        cropData[index].cropId ==
                                        state.activeLink
                                          ? selectedOption
                                          : cropData[index].units
                                      }
                                      onChange={getQuantity(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    >
                                      <option value="Crates">Crates</option>
                                      <option value="Bags">Bags</option>
                                      <option value="Sacs">Sacs </option>
                                      <option value="Boxes">Boxes </option>
                                      <option value="kgs">Kgs </option>
                                      <option value="loads">Loads </option>
                                    </select>
                                  </td>

                                  <td className="col-1">
                                    {cropData[index].cropId === cropId ? (
                                      <select
                                        className="form-control qty_dropdown dropdown"
                                        value={cropData[index].rateType}
                                        onChange={getRatetypeQuantity(
                                          cropData[index].cropId,
                                          index,
                                          cropData
                                        )}
                                      >
                                        <option value="kgs">kgs</option>
                                        <option
                                          value={
                                            cropData[index].rateType == "kgs"
                                              ? selectedOption
                                              : cropData[index].rateType
                                          }
                                        >
                                          {cropData[index].rateType == "kgs"
                                            ? selectedOption +
                                              "l" +
                                              cropData[index].rateType
                                            : cropData[index].rateType + "pk"}
                                        </option>
                                      </select>
                                    ) : (
                                      <select
                                        className="form-control qty_dropdown dropdown"
                                        value={cropData[index].rateType}
                                        onChange={getRatetypeQuantity(
                                          cropData[index].cropId,
                                          index,
                                          cropData
                                        )}
                                      >
                                        <option value="kgs">kgs</option>
                                        <option
                                          value={
                                            cropData[index].rateType == "kgs"
                                              ? cropData[index].units ==
                                                "Per Kg"
                                                ? "Crates"
                                                : cropData[index].units
                                              : cropData[index].rateType
                                          }
                                        >
                                          {cropData[index].rateType == "kgs"
                                            ? cropData[index].units == "Per Kg"
                                              ? "Crates"
                                              : cropData[index].units
                                            : cropData[index].units + "pppp"}
                                        </option>
                                      </select>
                                    )}
                                  </td>

                                  <td className="col-2">
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="quantity"
                                      value={cropData[index].unitValue}
                                      onChange={getQuantityValue(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    />
                                  </td>
                                  {cropData[index].units ==
                                  cropData[index].rateType ? (
                                    ""
                                  ) : (
                                    <td className="col-2">
                                      <input
                                        type="text"
                                        name="weight"
                                        value={cropData[index].weightValue}
                                        onChange={getWeightValue(
                                          cropData[index].cropId,
                                          index,
                                          cropData
                                        )}
                                      />
                                    </td>
                                  )}
                                  <td className="col-1">
                                    <input
                                      type="text"
                                      name="wastage"
                                      className="form-control wastage_val"
                                      value={cropData[index].wastageValue}
                                      onChange={getWastageValue(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    />
                                  </td>
                                  <td className="col-2">
                                    <input
                                      type="text"
                                      name="rate"
                                      className="form-control"
                                      value={cropData[index].rateValue}
                                      onChange={getRateValue(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    />
                                  </td>
                                  <td className="col-2">
                                    {cropData[index].rateType == "kgs"
                                      ? (cropData[index].totalValue =
                                          (cropData[index].weightValue -
                                            cropData[index].wastageValue) *
                                          cropData[index].rateValue)
                                      : (cropData[index].totalValue =
                                          (cropData[index].unitValue -
                                            cropData[index].wastageValue) *
                                          cropData[index].rateValue)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          )}
                        </div>
                        <div className="delete_copy_div d-flex">
                        <div
                          className="flex_class mr-0 sub_icons_div"
                          onClick={cloneCrop.bind(this, crop)}
                        >
                          <img
                            src={copy_icon}
                            className="sub_icons"
                            alt="image"
                          />
                        </div>
                        <div
                          className="flex_class mr-0 sub_icons_div"
                          onClick={deleteCrop.bind(this, crop, cropData)}
                        >
                          <img
                            src={delete_icon}
                            className="sub_icons"
                            alt="image"
                          />
                        </div>
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {cropInfoModalStatus ? (
        <SelectCrop
          show={cropInfoModal}
          close={() => setCropInfoModal(false)}
          cropCallback={cropDataFunction}
        />
      ) : (
        ""
      )}
      {cropData.length > 0 && (
        <div className="bottom_div main_div popup_bottom_div">
          <div className="d-flex align-items-center justify-content-end">
            <button className="primary_btn" onClick={addStep3Modal}>
              Next
            </button>
          </div>
        </div>
      )}
      {showStep3ModalStatus ? (
        <SellbillStep3Modal
          show={showStep3Modal}
          closeStep3Modal={() => setShowStep3Modal(false)}
          slectedSellCropsArray={selectedSellbillCropsData}
        />
      ) : (
        ""
      )}
      <ToastContainer />
    </Modal>
  );
};
export default SellbillStep2Modal;
