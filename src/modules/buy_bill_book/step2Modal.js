import { Modal } from "react-bootstrap";
import "../../modules/buy_bill_book/step2.scss";
import other_crop from "../../assets/images/other_crop.svg";
import { useState, useEffect } from "react";
import { getPreferredCrops } from "../../actions/billCreationService";
import SelectCrop from "./selectCrop";
import delete_icon from "../../assets/images/delete.svg";
import copy_icon from "../../assets/images/copy.svg";
import Step3Modal from "./step3Model";
import toastr from "toastr";
import $, { merge } from "jquery";
import close from "../../assets/images/close.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import _ from "lodash";
import SelectBags from "./bags";
var array = [];
const Step2Modal = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const clientId = loginData.authKeys.clientId;
  const clientSecret = loginData.authKeys.clientSecret;
  let [preferedCropsData, setPreferedCropsData] = useState([]);
  let [cropData, cropResponseData] = useState(array);
  const [cropInfoModal, setCropInfoModal] = useState(false);
  const [cropInfoModalStatus, setCropInfoModalStatus] = useState(false);
  const [cropId, setCropId] = useState(0);
  const [cropClear, setCropClear] = useState(false);
  const [cropItemVal, setCropItemVal] = useState({});
  const cropOnclick = (crop, id, index2, preferedCrops) => {
    setCropItemVal(crop);
    setCropId(id);
    Object.assign(
      preferedCrops[index2],
      { wastage: 0 },
      { qty: 0 },
      { rateType: "kgs" },
      { weight: 0 },
      { rate: 0 },
      { total: 0 },
      { bags: [] }
      // { unitType:  preferedCrops[index2] }
    );
    cropResponseData([...cropData, preferedCrops[index2]]);
    if (crop.cropId === id) {
      crop.count = crop.count + 1;
      crop.cropActive = true;
    }
    // preferedCropsData[index2].units = "Crates";
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
          Object.assign(
            item,
            { count: 0 },
            { cropActive: false },
            { qtyUnit: "Crates" },
            { weight: 0 },
          { rate: 0 },
          { total: 0 }, { wastage: 0 },
          { qty: 0 },
          );
        });
        setPreferedCropsData([...preferedCropsData, ...response.data.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchData();
    console.log(props.billEditStatus,"billEditStatus");
    if (props.cropTableEditStatus) {
    if(props.billEditStatus){;
      cropResponseData([...props.cropEditObject]);
    }
    else{
      //console.log("try to do different");
      var lineIt=JSON.parse(localStorage.getItem("lineItemsEdit"));
      cropResponseData(lineIt);
      console.log(cropResponseData);
    }
      for (var i = 0; i < props.cropEditObject.length; i++) {
        preferedCropsData.push(props.cropEditObject[i]);
        if (props.cropEditObject[i].rateType == "RATE_PER_KG") {
          props.cropEditObject[i].rateType = "kgs";
        }
        Object.assign(
          props.cropEditObject[i],
          { count: 1 },
          { cropActive: true }
        );
      }
    }
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
          setPreferedCropsData([...list, ...arr]);
          cropData.push(list[index]);
          cropResponseData([...cropData]);
          Object.assign(
            list[index],
            { cropActive: true },
            { qtyUnit: "crates" },
            { addInv: false }
          );
        } else {
          Object.assign(
            i,
            { count: 1 },
            { cropActive: true },
            { cropSelect: "active" },
            { wastage: 0 },
            { qty: 0 },
            { rateType: "kgs" },
            { weight: 0 },
            { rate: 0 },
            { total: 0 },
            { qtyUnit: "crates" },
            { checked: false },
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

  const [updatedItemList, setUpdatedItemList] = useState([]);
  const [showStep3Modal, setShowStep3Modal] = useState(false);
  const [showStep3ModalStatus, setShowStep3ModalStatus] = useState(false);
  const addStep3Modal = () => {
    console.log(cropData)
    var h = [];
    if (cropData.length > 0) {
      h = cropData.map((item, index) => {
        if (
          cropData[index].qty == 0 &&
          !setQuantityBasedtable(cropData[index].qtyUnit)
        ) {
          toast.error("Please enter Quantity", {
            toastId: "error1",
          });
          return null;
        } else if (cropData[index].weight == 0) {
          toast.error("Please enter weight", {
            toastId: "error2",
          });
          return null;
        } else if (cropData[index].rate == 0) {
          toast.error("Please enter rate", {
            toastId: "error3",
          });
          return null;
        } else if (
          setQuantityBasedtable(cropData[index].qtyUnit) &&
          cropData[index].weight != 0 &&
          cropData[index].rate != 0
        ) {
          return cropData[index];
        } else if (
          cropData[index].qty != 0 &&
          cropData[index].weight != 0 &&
          cropData[index].rate != 0
        ) {
          console.log("hello")
          setShowStep3ModalStatus(true);
          setShowStep3Modal(true);
          setUpdatedItemList(updatedItemList);
          localStorage.setItem("lineItemsEdit",JSON.stringify(cropData));
          if(props.billEditStatus){
            props.slectedCropstableArray[0].lineItems = updatedItemList;
          } 
          if (updatedItemList[index].rateType == "kgs") {
            updatedItemList[index].total =
              (updatedItemList[index].weight - updatedItemList[index].wastage) *
              updatedItemList[index].rate;
          } else {
            updatedItemList[index].total =
              (updatedItemList[index].qty - updatedItemList[index].wastage) *
              updatedItemList[index].rate;
          }
          console.log(updatedItemList);
          return cropData[index];
        }
      });
      if (h.length > 0) {
        var h1 = h.map((item, index) => {
          if (h[index] != null) {
            if (h.length == cropData.length) {
              return item;
              // console.log(h,"true")
              // setShowStep3ModalStatus(true);
              //  setShowStep3Modal(true);
            }
          }
        });
      }
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
  const getQuantity = (cropData, index1, crop) => (e) => {
    cropData[index1].rateType = "kgs";
    var index = cropData.findIndex((obj) => obj.cropId == crop.cropId);
    let updatedItemList = cropData.map((item, i) => {
      if (i == index1) {
        arr1.push({ ...cropData[i], qtyUnit: e.target.value });
        return { ...cropData[i], qtyUnit: e.target.value };
      } else {
        cropResponseData([...cropData]);
        return { ...cropData[i] };
      }
    });
    cropResponseData([...updatedItemList]);
  };
  const getRateType = (cropData, index) => (e) => {
    cropData[index].rateType = e.target.value;
    cropResponseData([...cropData]);
  };
  const [quantityValue, setunitValue] = useState();
  const [wastagesValue, setwastageValue] = useState();
  const [rateDefaultValue, setrateValue] = useState();
  const [weightDefaultValue, setweightValue] = useState();

  var arr = [];

  const getQuantityValue = (id, index, cropitem) => (e) => {
    let updatedItem = cropitem.map((item, i) => {
      if (i == index) {
        return { ...cropitem[i], qty: e.target.value };
      } else {
        cropResponseData([...cropitem]);
        return { ...cropitem[i] };
      }
    });
    cropResponseData([...updatedItem]);
    setunitValue(e.target.value);
    setUpdatedItemList(updatedItem);
    setCropId(id);
  };
  const getWeightValue = (id, index, cropitem) => (e) => {
    let updatedItem1 = cropitem.map((item, i) => {
      if (i == index) {
        return { ...cropitem[i], weight: e.target.value };
      } else {
        cropResponseData([...cropitem]);
        return { ...cropitem[i] };
      }
    });
    cropResponseData([...updatedItem1]);
    setweightValue(e.target.value);
    setUpdatedItemList(updatedItem1);
    setCropId(id);
  };
  const getWastageValue = (id, index, cropitem) => (e) => {
    let updatedItem2 = cropitem.map((item, i) => {
      if (i == index) {
        return { ...cropitem[i], wastage: e.target.value };
      } else {
        cropResponseData([...cropitem]);
        return { ...cropitem[i] };
      }
    });
    cropResponseData([...updatedItem2]);
    setwastageValue(e.target.value);
    setUpdatedItemList(updatedItem2);
    setCropId(id);
  };
  const [selectedCropsData, setSelectedCropsData] = useState([]);
  const getRateValue = (id, index, cropitem) => (e) => {
    let updatedItem3 = cropitem.map((item, i) => {
      if (i == index) {
        return { ...cropitem[i], rate: e.target.value };
      } else {
        cropResponseData([...cropitem]);
        return { ...cropitem[i] };
      }
    });
    cropResponseData([...updatedItem3]);
    console.log(updatedItem3)
    setrateValue(e.target.value);
    setCropId(id);
    setSelectedCropsData(updatedItem3);
    setUpdatedItemList(updatedItem3);
    
    console.log(props.billEditStatus,"editStatus");
    if(props.billEditStatus){
      props.slectedCropstableArray[0].lineItems = updatedItem3;
    } 
  };
  const cloneCrop = (crop) => {
    var list = preferedCropsData;
    var index = list.findIndex((obj) => obj == crop);
    if (index != -1) {
      list[index].count += 1;
    }
    cropResponseData([...cropData, crop]);
  };

  const dummyList = preferedCropsData;
  const deleteCrop = (crop, cropArray) => {
    var index = cropArray.indexOf(crop);
    console.log(index,"index");
    var list = preferedCropsData;
    if (index != -1) {
      cropArray.splice(index, 1);
      var index1 = list.findIndex((obj) => obj == crop);
      if (index1 != -1) {
        list[index1].count -= 1;
        if(list[index1].count == 0){
          console.log(list,index1)
          list.splice(index1,index1);
          // list.splice(index1,index1);
        }
      }
    }
    cropResponseData([...cropArray]);
  };
  //const [checked, setChecked] = useState(false);
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
        return { ...crd[i], checked: true };
      } else {
        return { ...crd[i] };
      }
    });
    cropResponseData([...updatedItem]);
    setshowBagsModalStatus(true);
    setShowBagsModal(true);
    if(crd[ink].bags.length > 0){
      setEditBagsStatus(true);
    }
  };
  const callbackFunction = (childData, invArr) => {
    console.log(childData, invArr, "parent");
    let updatedItems = cropData.map((item, i) => {
      if (i == arIndex) {
        item = childData[0];
        return {
          ...cropData[i],
          qty: parseInt(item.qty),
          wastage: item.wastage,
          weight: item.weight,
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
  return (
    <Modal
      show={props.show}
      close={props.closeCropModal}
      className="cropmodal_poopup"
    >
      <div className="modal-header date_modal_header smartboard_modal_header">
        <h5 className="modal-title header2_text" id="staticBackdropLabel">
          Add Crop Information
        </h5>
        <img alt="image" onClick={props.closeCropModal} />
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
                  onClick={() =>
                    cropOnclick(crop, crop.cropId, index, preferedCropsData)
                  }
                >
                  <div
                    style={{
                      display:
                        preferedCropsData[index].cropActive === true
                          ? preferedCropsData[index].count == 0
                            ? "none"
                            : "block"
                          : "none",
                    }}
                    className="crp_count"
                  >
                    {preferedCropsData[index].count == 0
                      ? ""
                      : preferedCropsData[index].count}
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
            <p>Other Crop</p>
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
                      key={index}
                    >
                      <div className="d-flex crop_table_delete_div">
                        <div className="crop_table_view">
                          {cropData[index].qtyUnit +
                            index +
                            cropData[index].rateType}
                          {!setQuantityBasedtable(cropData[index].qtyUnit) ? (
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th>Crop</th>
                                  <th>Unit Type</th>
                                  <th>Rate Type</th>
                                  <th>
                                    No of Units({cropData[index].qtyUnit})
                                  </th>
                                  {cropData[index].qtyUnit.toLowerCase() !=
                                  cropData[index].rateType ? (
                                    <th>
                                      Total Weight(
                                      {cropData[index].qtyUnit.toLowerCase() !=
                                      cropData[index].rateType
                                        ? "kgs"
                                        : cropData[index].qtyUnit}
                                      )
                                    </th>
                                  ) : (
                                    ""
                                  )}
                                   {cropData[index].qtyUnit.toLowerCase() ===
                                    "bags" ||
                                  cropData[index].qtyUnit.toLowerCase() ===
                                    "sacs" ? (
                                    cropData[index].qtyUnit.toLowerCase() !=
                                    cropData[index].rateType ? (
                                      <th className="col-2">
                                        Invidual Weights
                                      </th>
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    ""
                                  )}
                                  <th>
                                    Wastage(
                                    {cropData[index].qtyUnit.toLowerCase() !=
                                    cropData[index].rateType
                                      ? "kgs"
                                      : cropData[index].qtyUnit}
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
                                      value={cropData[index].qtyUnit}
                                      onChange={getQuantity(
                                        cropData,
                                        index,
                                        crop
                                      )}
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
                                        ].qtyUnit.toLowerCase()}
                                      >
                                        {cropData[index].qtyUnit}{" "}
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
                                      value={cropData[index].qty}
                                      onChange={getQuantityValue(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    />
                                  </td>
                                  {cropData[index].qtyUnit.toLowerCase() !=
                                  cropData[index].rateType ? (
                                    <td className="col-2">
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="weight"
                                        value={cropData[index].weight}
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
                                  {cropData[index].qtyUnit.toLowerCase() ===
                                    "bags" ||
                                  cropData[index].qtyUnit.toLowerCase() ===
                                    "sacs" ? (
                                    cropData[index].qtyUnit.toLowerCase() !=
                                    cropData[index].rateType ? (
                                      <td className="col-2">
                                        <div className="d-flex">
                                          <p className="unit-type">
                                            {cropData[index].bags !==null && cropData[index].bags.length > 0 ? 'Edit' : 'Add'} {cropData[index].qtyUnit}
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
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    ""
                                  )}
                                  <td className="col-1">
                                    {" "}
                                    <input
                                      type="text"
                                      name="wastage"
                                      className="form-control wastage_val"
                                      value={cropData[index].wastage}
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
                                      value={cropData[index].rate}
                                      onChange={getRateValue(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    />
                                  </td>
                                  <td className="col-2">
                                    <p className="totals">
                                      {cropData[index].rateType == "kgs"
                                        ? (cropData[index].weight -
                                            cropData[index].wastage) *
                                          cropData[index].rate
                                        : (cropData[index].qty -
                                            cropData[index].wastage) *
                                          cropData[index].rate}
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          ) : (
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th>Crop</th>
                                  <th>Unit Type</th>
                                  <th>
                                    Total Weight({cropData[index].qtyUnit})
                                  </th>
                                  {cropData[index].qtyUnit == "loads" ? (
                                    ""
                                  ) : (
                                    <th>Wastage({cropData[index].qtyUnit})</th>
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
                                      value={cropData[index].qtyUnit}
                                      onChange={getQuantity(
                                        cropData,
                                        index,
                                        crop
                                      )}
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
                                      value={cropData[index].weight}
                                      onChange={getWeightValue(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    />
                                  </td>
                                  {cropData[index].qtyUnit == "loads" ? (
                                    ""
                                  ) : (
                                    <td className="col-2">
                                      {" "}
                                      <input
                                        type="text"
                                        name="wastage"
                                        className="form-control wastage_val"
                                        value={cropData[index].wastage}
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
                                      value={cropData[index].rate}
                                      onChange={getRateValue(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    />
                                  </td>
                                  <td className="col-2">
                                    <p className="totals">
                                      {cropData[index].qtyUnit == "loads"
                                        ? cropData[index].weight *
                                          cropData[index].rate
                                        : (cropData[index].weight -
                                            cropData[index].wastage) *
                                          cropData[index].rate}
                                    </p>
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
        <Step3Modal
          show={showStep3Modal}
          closeStep3Modal={() => setShowStep3Modal(false)}
          // slectedCropsArray={selectedCropsData}
          billEditStatus={props.billEditStatus ? true : false}
          slectedCropsArray={
            props.billEditStatus ? props.slectedCropstableArray : selectedCropsData
          }
          step2CropEditStatus={props.billEditStatus ? true : false}
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
export default Step2Modal;
