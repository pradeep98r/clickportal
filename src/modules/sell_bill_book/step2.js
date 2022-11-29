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
  import $, { merge } from "jquery";
import close from "../../assets/images/close.svg";
import SelectBags from "../buy_bill_book/bags";
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
  const cropOnclick = (crop, id, index,preferedCrops) => {
    setCropId(id);
    console.log(crop);
    Object.assign(
      preferedCrops[index],
      { wastageValue: 0 },
      { unitValue: 0 },
      { rateType: "kgs" },
      { weightValue: 0 },
      { rateValue: 0 },
      { totalValue: 0 },
      { bags: [] }
      // { unitType:  preferedCrops[index2] }
    );

    cropResponseData([...cropData, preferedCrops[index]]);
    if (crop.cropId === id) {
      crop.count = crop.count + 1;
      crop.cropActive = true;
      console.log(crop.count, "after click");
    }
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
          Object.assign(item, { count: 0 }, { cropActive: false }, { unitType: "crates" },{ bags: [] });
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
          cropData.push(list[index]);
          cropResponseData([...cropData]);
          Object.assign(list[index], { cropActive: true }, { unitType: "crates" });
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
            { totalValue: 0 },
            { unitType: "crates" },
            { bags: [] }
          );
          arr.push(i);
          setPreferedCropsData([...preferedCropsData, ...arr]);
          cropData.push(i);
          cropResponseData([...cropData]);
        }
      });
    } else {
      let deSelectedCrop = preferedCropsData.filter(
        (item) => item.cropId !== childData.cropId
      );
      setPreferedCropsData(deSelectedCrop);
    }
  };
 
  const setQuantityBasedtable = (unitType) => {
    var t = false;
    if (unitType == "kgs" || unitType == "loads" || unitType == "pieces") {
      t = true;
    }
    return t;
  };
  var arr1 = [];
  const getQuantity = (cropData, index1,crop) => (e) => {
    cropData[index1].rateType = "kgs";
    var index = cropData.findIndex((obj) => obj.cropId == crop.cropId);
    console.log(index)
    let updatedItemList = cropData.map((item,i) => {
      if (i == index1) {
        console.log(cropData[i],"if");
        arr1.push({ ...cropData[i], unitType: e.target.value })   
         return { ...cropData[i], unitType: e.target.value };
      }
      else{
        console.log("else",cropData)
        cropResponseData([...cropData]);
        return {...cropData[i]}
      }
   });
   console.log(updatedItemList);
   cropResponseData([...updatedItemList]);
  };
  const getRateType = (cropData, index) => (e) => {
    cropData[index].rateType = e.target.value;
    console.log(cropData[index].rateType, cropData);
    cropResponseData([...cropData]);
  };
  const [quantityValue, setunitValue] = useState();
  const [wastagesValue, setwastageValue] = useState();
  const [rateDefaultValue, setrateValue] = useState();
  const [weightDefaultValue, setweightValue] = useState();
  const getQuantityValue = (id, index, cropitem) => (e) => {
    console.log(id, index, cropitem, e.target.value);
    let updatedItems1 = cropitem.map((item,i) => {
      if (i == index) {
         return { ...cropitem[i], unitValue: e.target.value };
      }
      else{
        cropResponseData([...cropitem]);
        return {...cropitem[i]}
      }
   });
   cropResponseData([...updatedItems1]);
    setunitValue(e.target.value);
    setCropId(id);
  };
  const getWeightValue = (id, index, cropitem) => (e) => {
    console.log(id, index, cropitem);
    let updatedItems2 = cropitem.map((item,i) => {
      if (i == index) {
         return { ...cropitem[i], weightValue: e.target.value };
      }
      else{
        cropResponseData([...cropitem]);
        return {...cropitem[i]}
      }
   });
   cropResponseData([...updatedItems2]);
    setweightValue(e.target.value);
    setCropId(id);
  };
  const getWastageValue = (id, index, cropitem) => (e) => {
    let updatedItems3 = cropitem.map((item,i) => {
      if (i == index) {
         return { ...cropitem[i], wastageValue: e.target.value };
      }
      else{
        cropResponseData([...cropitem]);
        return {...cropitem[i]}
      }
   });
   cropResponseData([...updatedItems3]);
      setwastageValue(e.target.value);
    setCropId(id);
  };
  const [selectedSellbillCropsData, setSelectedCropsData] = useState([]);
  const getRateValue = (id, index, cropitem) => (e) => {
   
      setrateValue(e.target.value);
      let updatedItems4 = cropitem.map((item,i) => {
        if (i == index) {
           return { ...cropitem[i], rateValue: e.target.value };
        }
        else{
          cropResponseData([...cropitem]);
          return {...cropitem[i]}
        }
     });
     cropResponseData([...updatedItems4]);
      if (updatedItems4[index].rateType == "kgs") {
        updatedItems4[index].totalValue =
          (updatedItems4[index].weightValue - updatedItems4[index].wastageValue) *
          updatedItems4[index].rateValue;
      } else {
        updatedItems4[index].totalValue =
          (updatedItems4[index].unitValue - updatedItems4[index].wastageValue) *
          updatedItems4[index].rateValue;
        console.log(updatedItems4[index].totalValue);
      }

    setCropId(id);
    setSelectedCropsData(updatedItems4);
  };
  const [showStep3Modal, setShowStep3Modal] = useState(false);
  const [showStep3ModalStatus, setShowStep3ModalStatus] = useState(false);
  const addStep3Modal = () => {
    cropData.map((item, index) => {
      console.log(cropData[index].unitValue)
      if(cropData[index].unitValue == 0){
        toast.error('Please enter Quantity', {
          toastId: "error1" 
        });
      }
      else if(cropData[index].weightValue == 0){
        toast.error('Please enter weight', {
          toastId: "error2" 
        });
      }
      else if(cropData[index].rateValue == 0){
        toast.error('Please enter rate', {
          toastId: "error3" 
        });
      }
      else if(cropData[index].unitValue != 0 && cropData[index].weightValue != 0 &&cropData[index].rateValue != 0){
        setShowStep3ModalStatus(true);
        setShowStep3Modal(true);
      }
    })
  
  };
  
  const [showBagsModalStatus, setshowBagsModalStatus] = useState(false);
  const [showBagsModal, setShowBagsModal] = useState(false);
  const arrobject = [];
  const [ar, setArray] = useState([]);
  const [arIndex, setarIndex] = useState(0);
  const [editBagsStatus, setEditBagsStatus] = useState(false);
  const handleCheckEvent = (crd, ink, cr) => {
    let updatedItem = crd.map((item, i) => {
      if (i == ink) {
        setarIndex(ink);
        arrobject.push(crd[i]);
        setArray([...arrobject]);
        console.log(ink);
        return { ...crd[i], checked: true };
      } else {
        return { ...crd[i] };
      }
    });
    cropResponseData([...updatedItem]);
    console.log(arrobject, ar, "UpdatedItem");
    setshowBagsModalStatus(true);
    setShowBagsModal(true);
    if(crd[ink].bags.length > 0){
      setEditBagsStatus(true);
    }
  }
  const callbackFunction = (childData, invArr) => {
    console.log(childData, invArr, "parent");
    let updatedItems = cropData.map((item, i) => {
      if (i == arIndex) {
        item = childData[0];
        console.log(item);
        return {
          ...cropData[i],
          unitValue: parseInt(item.unitValue),
          wastageValue: item.wastageValue,
          weightValue: item.weightValue,
          bags: invArr,
        };
      } else {
        cropResponseData([...cropData]);
        return { ...cropData[i] };
      }
    });
    cropResponseData([...updatedItems]);
    console.log(updatedItems);
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
                  onClick={() => cropOnclick(crop, crop.cropId, index,preferedCropsData)}
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
                    <div className="d-flex crop_table_delete_div">
                      <div className="crop_table_view">
                        {cropData[index].unitType +
                          index +
                          cropData[index].rateType}
                        {!setQuantityBasedtable(cropData[index].unitType) ? (
                          <table class="table table-bordered">
                            <thead>
                              <tr>
                                <th>Crop</th>
                                <th>Unit Type</th>
                                <th>Rate Type</th>
                                <th>No of Units({cropData[index].unitType})</th>
                                {cropData[index].unitType.toLowerCase() !=
                                cropData[index].rateType ? (
                                  <th>
                                    Total Weight(
                                    {cropData[index].unitType.toLowerCase() !=
                                    cropData[index].rateType
                                      ? "kgs"
                                      : cropData[index].unitType}
                                    )
                                  </th>
                                ) : (
                                  ""
                                )}
                                {
                                    cropData[index].unitType.toLowerCase() === 'bags' ||
                                      cropData[index].unitType.toLowerCase() === 'sacs' ? (
                                      <th className="col-2">
                                        Invidual Weights
                                      </th>) : ("")
                                  }
                                <th>
                                  Wastage(
                                  {cropData[index].unitType.toLowerCase() !=
                                  cropData[index].rateType
                                    ? "kgs"
                                    : cropData[index].unitType}
                                  )
                                </th>

                                <th>Rate</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="col-2">
                                  {" "}
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
                                    value={cropData[index].unitType}
                                    onChange={getQuantity(cropData, index,crop)}
                                  >
                                    <option value="Crates">Crates</option>
                                    <option value="Bags">Bags</option>
                                    <option value="Sacs">Sacs </option>
                                    <option value="Boxes">Boxes </option>
                                    <option value="kgs">Kgs </option>
                                    <option value="loads">Loads </option>
                                    <option value="pieces">Pieces </option>
                                  </select>
                                </td>
                                <td className="col-1">
                                  <select
                                    className="form-control qty_dropdown dropdown"
                                    value={cropData[index].rateType}
                                    onChange={getRateType(cropData, index)}
                                  >
                                    <option
                                      value={cropData[
                                        index
                                      ].unitType.toLowerCase()}
                                    >
                                      {cropData[index].unitType}{" "}
                                    </option>
                                    <option value="kgs">Kgs </option>
                                  </select>
                                </td>
                                <td className="col-2">
                                  {" "}
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
                                {cropData[index].unitType.toLowerCase() !=
                                cropData[index].rateType ? (
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
                                ) : (
                                  ""
                                )}
                                {
                                    cropData[index].unitType.toLowerCase() === "bags" ||
                                      cropData[index].unitType.toLowerCase() === "sacs" ? (
                                        <td className="col-2">
                                        <div className="d-flex">
                                          <p className="unit-type">
                                            {cropData[index].bags.length > 0 ? 'Edit' : 'Add'} {cropData[index].unitType}
                                          </p>
                                          <input
                                            type="checkbox"
                                            checked={cropData[index].checked}
                                            id="modal_checkbox"
                                            value="my-value"
                                            className="checkbox_t"
                                            onChange={() => {
                                              handleCheckEvent(
                                                cropData,
                                                index,
                                                crop
                                              );
                                            }}
                                          />
                                        </div>
                                      </td>
                                    ) : ("")
                                  }
                                <td className="col-1">
                                  {" "}
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
                                  {" "}
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
                                  <p className="totals">{cropData[index].rateType == "kgs"
                                    ? (cropData[index].weightValue -
                                        cropData[index].wastageValue) *
                                      cropData[index].rateValue
                                    : (cropData[index].unitValue -
                                        cropData[index].wastageValue) *
                                      cropData[index].rateValue}</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        ) : (
                          <table class="table table-bordered">
                            <thead>
                              <tr>
                                <th>Crop</th>
                                <th>Unit Type</th>
                                <th>
                                  Total Weight({cropData[index].unitType})
                                </th>
                                {cropData[index].unitType == "loads" ? (
                                  ""
                                ) : (
                                  <th>Wastage({cropData[index].unitType})</th>
                                )}

                                <th>Rate</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="col-2">
                                  {" "}
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
                                <td>
                                  <select
                                    className="form-control qty_dropdown dropdown"
                                    value={cropData[index].unitType}
                                    onChange={getQuantity(cropData, index,crop)}
                                  >
                                    <option value="Crates">Crates</option>
                                    <option value="Bags">Bags</option>
                                    <option value="Sacs">Sacs </option>
                                    <option value="Boxes">Boxes </option>
                                    <option value="kgs">Kgs </option>
                                    <option value="loads">Loads </option>
                                    <option value="pieces">Pieces </option>
                                  </select>
                                </td>
                                <td className="col-2">
                                  {" "}
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
                                {cropData[index].unitType == "loads" ? (
                                  ""
                                ) : (
                                  <td className="col-2">
                                    {" "}
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
                                  {" "}
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
                                <p className="totals">{
                                  cropData[index].unitType == 'loads' ? (cropData[index].weightValue *
                                  cropData[index].rateValue) : 
                                  (cropData[index].weightValue -
                                    cropData[index].wastageValue) *
                                  cropData[index].rateValue
                                }</p></td>
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
      {showBagsModalStatus ? (
        <SelectBags
          show={showBagsModal}
          closeBagsModal={() => setShowBagsModal(false)}
          cropsArray={ar}
          parentCallback={callbackFunction}
          cropIndex={arIndex}
          editBagsStatus={editBagsStatus}
        />
      ) : (
        ""
      )}
    </Modal>
  );
};
export default SellbillStep2Modal;
