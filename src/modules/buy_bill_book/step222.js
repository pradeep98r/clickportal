import { useSelector, useDispatch } from "react-redux";
import { selectBuyer } from "../../reducers/buyerSlice";
import { selectSteps } from "../../reducers/stepsSlice";
import "../../modules/buy_bill_book/step2.scss";
import other_crop from "../../assets/images/other_crop.svg";
import { useState, useEffect } from "react";
import {
  getAllCrops,
  getPreferredCrops,
} from "../../actions/billCreationService";
import SelectCrop from "./selectCrop";
import delete_icon from "../../assets/images/delete.svg";
import copy_icon from "../../assets/images/copy.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SelectBags from "./bags";
import {
  billDate,
  billViewStatus,
  cropEditStatus,
  tableEditStatus,
  fromBillbook,
} from "../../reducers/billEditItemSlice";
import { selectTrans } from "../../reducers/transSlice";
import $ from "jquery";
import Select from "react-select";
import { getQuantityUnit, getUnitVal } from "../../components/getText";
var array = [];
const colourStyles = {
  menuList: (styles) => ({
    ...styles,
    background: "white",
    padding: "0px 10px",
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    background: isFocused ? "#D7F3DD" : isSelected ? "#D7F3DD" : undefined,
    zIndex: 1,
    border: isFocused
      ? "1px solid #16A12C"
      : isSelected
      ? "1px solid #16A12C"
      : undefined,
    borderRadius: isFocused ? "10px" : isSelected ? "10px" : undefined,
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";

    return { ...provided, opacity, transition };
  },
  menu: (base) => ({
    ...base,
    zIndex: 100,
    padding: "10px 0px",
  }),
};
const Step22 = (props) => {
  const users = useSelector((state) => state.buyerInfo);
  const dispatch = useDispatch();
  const settingsData = JSON.parse(localStorage.getItem("systemSettingsData"));
  console.log(settingsData)
  const transusers = useSelector((state) => state.transInfo);
  const billEditItemInfo = useSelector((state) => state.billEditItemInfo);
  const billEditStatus = billEditItemInfo?.billEditStatus;
  const cropTableEditStatus = billEditItemInfo?.cropTableEditStatus;

  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const clientId = loginData.authKeys.clientId;
  const clientSecret = loginData.authKeys.clientSecret;
  let [preferedCropsData, setPreferedCropsData] = useState([]);
  const [selectedCropItem, setSelectedCropItem] = useState(null);
  const maintainCrop = localStorage.getItem("maintainCrops");
  let [cropData, cropResponseData] = useState(maintainCrop ? [] : array);
  // props.maintainCrops?

  const [cropInfoModal, setCropInfoModal] = useState(false);
  const [cropInfoModalStatus, setCropInfoModalStatus] = useState(false);
  const [cropId, setCropId] = useState(0);
  const [updatedItemList, setUpdatedItemList] = useState([]);
  const [showStep3Modal, setShowStep3Modal] = useState(false);

  const [quantityValue, setunitValue] = useState();
  const [wastagesValue, setwastageValue] = useState();
  const [rateDefaultValue, setrateValue] = useState();
  const [weightDefaultValue, setweightValue] = useState();

  const [addCropStatus, setAddCropStatus] = useState(false);
  const [allData, setAllData] = useState([]);
  const [cropsData, setCropsData] = useState(allData);
  const [activeSearch, setActiveSearch] = useState(false);

  const [addCropsIndex, setAddCropsIndex] = useState(0);
  const [onFocusCrop, setOnFocusCrop] = useState(null);
  const [defaultUnitTypeVal, setDefaultUnitTypeVal] = useState("");
  const activeSearchCrop = (c, i) => {
    setSelectedCropItem(null);
    setAddCropStatus(true);
    setAddCropsIndex(i);
    let updatedItem3 = c.map((item, j) => {
      if (j == i) {
        console.log(c[j]);
        return {
          ...c[j],
          cropActive: false,
          displayStat: false,
          activeSearch: true,
          cropName: "",
          cropSufx: "",
        };
      } else {
        cropResponseData([...c]);
        return { ...c[j] };
      }
    });
    cropResponseData([...updatedItem3]);
    console.log(c[i]);
    Object.assign(c[i], { status: 0, cropDelete: true });
    setOnFocusCrop(c[i]);
  };
  const fetchCropData = () => {
    getAllCrops().then((response) => {
      response.data.data.map((item) => {
        var cIndex;
        var qSetting = settingsData.qtySetting;
        if (qSetting.length > 0) {
          cIndex = qSetting.findIndex((obj) => obj.cropId == item.cropId);
        } else {
          cIndex = -1;
        }
        console.log(cIndex, defaultUnitTypeVal, "fetchcrop");
        Object.assign(item, {
          cropSelect: "",
          cropSufx: "",
          qtyUnit: cIndex != -1 ? getUnitVal(qSetting, cIndex) : "crates",
          rateType:
            defaultUnitTypeVal == "unit_kg"
              ? "kgs"
              : cIndex != -1
              ? getUnitVal(qSetting, cIndex)
              : "kgs",
        });
      });
      setCropsData(response.data.data);
      setAllData(response.data.data);
    });
  };
  const [displayStat, setDisplayStat] = useState(false);

  const date =
    billEditItemInfo.selectedBillDate !== null
      ? billEditItemInfo.selectedBillDate
      : new Date();

  var cropObjectArr = [];
  // close popup
  const cancelStep = () => {
    dispatch(selectTrans(null));
    dispatch(selectBuyer(null));
    props.closem();
    if (billEditStatus) {
      window.location.reload();
    }
  };
  // navigate to previous step
  var prevArray = [];
  const previousStep = () => {
    dispatch(selectBuyer(users.buyerInfo));
    dispatch(selectSteps("step1"));
    dispatch(billDate(date));
    console.log(updatedItemList);
    for (var i = 0; i < updatedItemList.length; i++) {
      if (updatedItemList[i] != null) {
        if (Object.keys(updatedItemList[i]).length != 0) {
          prevArray.push(updatedItemList[i]);
        }
      }
    }
    dispatch(fromBillbook(false));
    localStorage.setItem("lineItemsEdit", JSON.stringify(prevArray));
    dispatch(tableEditStatus(true));
  };
  //   click on particular crop function
  var newArray = [];
  const cropOnclick = (crop, id, index2, preferedCrops) => {
    console.log(cropSufixStatus,'status')
    var cIndex = 0;
    var qSetting = settingsData.qtySetting;
    console.log(qSetting, settingsData);
    if (qSetting.length > 0) {
      cIndex = qSetting.findIndex((obj) => obj.cropId == crop.cropId);
    } else {
      cIndex = -1;
    }
    if (billEditStatus) {
      Object.assign(
        crop,
        { id: 0 },
        { wastage: 0 },
        { qty: 0 },
        {
          rateType:
            defaultUnitTypeVal == "unit_kg"
              ? "kgs"
              : cIndex != -1
              ? getQuantityUnit(qSetting, cIndex)
              : "kgs",
          // getUnitVal(qSetting, cIndex)
          // : "Crates",
        },
        { weight: 0 },
        { rate: 0 },
        { total: 0 },
        { bags: [] },
        { status: 1 },
        { qtyUnit: cIndex != -1 ? getUnitVal(qSetting, cIndex) : "Crates" },
        { activeSearch: false },
        { displayStat: false },
        { cropDelete: false },
        { cropSufx: "" }
      );
      cropResponseData([...cropData, preferedCrops[index2]]);
      setUpdatedItemList([...updatedItemList, ...newArray]);
    } else {
      Object.assign(
        crop,
        { wastage: 0 },
        { qty: 0 },
        { weight: 0 },
        { rate: 0 },
        { total: 0 },
        { bags: [] },
        { status: 1 },
        { qtyUnit: cIndex != -1 ? getUnitVal(qSetting, cIndex) : "Crates" },
        { activeSearch: false },
        { displayStat: false },
        { cropDelete: false },
        { cropSufx: "" },
        {
          rateType:
            defaultUnitTypeVal == "unit_kg"
              ? "kgs"
              : cIndex != -1
              ? getQuantityUnit(qSetting, cIndex)
              : crop.qtyUnit,

          // getUnitVal(qSetting, cIndex)
          // : "Crates",
        }
      );
    }
    console.log(crop, defaultUnitTypeVal, cIndex);
    cropResponseData([...cropData, preferedCrops[index2]]);
    newArray.push(preferedCrops[index2]);
    setUpdatedItemList([...updatedItemList, ...newArray]);
    if (crop.cropId === id) {
      crop.count = crop.count + 1;
      crop.cropActive = true;
    }
  };

  //   getting all crops popup when click on other crop
  const allCropData = () => {
    setCropInfoModalStatus(true);
    setCropInfoModal(true);
  };

  const fetchData = () => {
    getPreferredCrops(clickId, clientId, clientSecret)
      .then((response) => {
        var res = response.data.data;
        var list = preferedCropsData;
        console.log(res);
        var arr = [];
        res.map((i, ind) => {
          var index = list.findIndex((obj) => obj.cropId == i.cropId);
          if (index != -1) {
            Object.assign(
              i,
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
              { bags: [] },
              { status: 1 },
              { cropDelete: false },
              { cropSufx: "" }
            );
            setPreferedCropsData([...list, ...arr]);
          } else {
            Object.assign(
              i,
              { count: 0 },
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
              { bags: [] },
              { status: 1 },
              { id: 0 },
              { cropDelete: false },
              { cropSufx: "" }
            );
            arr.push(i);
            setPreferedCropsData([...preferedCropsData, ...arr]);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //   to get crop data oon refresh
  const [cropSufixStatus, setCropSufixStatus] = useState(false);
  useEffect(() => {
    fetchCropData();
    var party = billEditStatus
      ? billEditItemInfo.selectedPartyType
      : users.buyerInfo.partyType;
    console.log(settingsData, "set");
    for (var i = 0; i < settingsData.billSetting.length; i++) {
      if (party.toLowerCase() == "buyer") {
        if (
          settingsData.billSetting[i].billType == "SELL" &&
          settingsData.billSetting[i].settingName === "DEFAULT_RATE_TYPE"
        ) {

          if (settingsData.billSetting[i].value == 0) {
            setDefaultUnitTypeVal("unit_kg");
            console.log("if");
          } else {
            setDefaultUnitTypeVal("unit_other");
            console.log("else");
          }
        
        }
        if( settingsData.billSetting[i].billType == "SELL" && settingsData.billSetting[i].settingName=="CROP_SUFFIX" && settingsData.billSetting[i].formStatus==1 ){
         
          setCropSufixStatus(true)
        }
      } else {
        if (
          settingsData.billSetting[i].billType == "BUY" &&
          settingsData.billSetting[i].settingName === "DEFAULT_RATE_TYPE"
        ) {
          if (settingsData.billSetting[i].value == 0) {
            setDefaultUnitTypeVal("unit_kg");
          } else {
            setDefaultUnitTypeVal("unit_other");
          }
         
        }
        if( settingsData.billSetting[i].billType == "BUY" && settingsData.billSetting[i].settingName=="CROP_SUFFIX" && settingsData.billSetting[i].formStatus==1 ){
          setCropSufixStatus(true)
        }
      }
    }
    if (settingsData.qtySetting.length == 0) {
      setDefaultUnitTypeVal("unit_kg");
    }
    dispatch(cropEditStatus(billEditStatus ? true : false));

    cropObjectArr = billEditStatus
      ? billEditItemInfo?.step2CropEditStatus
        ? props.slectedCrops
        : props.cropEditObject.lineItems
      : props.cropEditObject;
    console.log(cropObjectArr, "arry");

    for (let i = cropObjectArr.length - 1; i >= 0; i--) {
      if (cropObjectArr[i].status === 0) {
        allDeletedCrops.push(cropObjectArr[i]);
        setAllDeletedCrops(allDeletedCrops);
        cropObjectArr.splice(i, 1);
      }
    }
    dispatch(billViewStatus(billEditStatus));
    fetchData();
    var lineIt = [];
    var a = [];
    if (cropTableEditStatus) {
      if (billEditStatus) {
        for (var d = 0; d < cropObjectArr.length; d++) {
          let object = { ...cropObjectArr[d] };

          if (
            cropObjectArr[d].rateType === "RATE_PER_KG" ||
            cropObjectArr[d].rateType === "kgs"
          ) {
            object = { ...object, rateType: "kgs" };
            a.push(object);
          } else {
            object = { ...object, qtyUnit: cropObjectArr[d].qtyUnit };
            a.push(object);
          }
        }
        cropResponseData([...a]);
      } else {
        if (!billEditItemInfo?.fromBillBook) {
          lineIt = JSON.parse(localStorage.getItem("lineItemsEdit"));
        }
        if (lineIt != null) {
          cropResponseData([...lineIt]);
          setUpdatedItemList(lineIt);
          setPreferedCropsData([...lineIt]);
        }
      }
      var cropArr = billEditStatus ? cropObjectArr : lineIt;
      cropArr?.map((item, index) => {
        var k = preferedCropsData.findIndex(
          (obj) => obj.cropId === item.cropId
        );
        if (k != -1) {
          preferedCropsData[k].count++;
        } else {
          let clonedObject = { ...cropArr[index] };
          if (cropArr[index].rateType === "RATE_PER_KG") {
            clonedObject = { ...clonedObject, rateType: "kgs" };
          }
          Object.assign(clonedObject, { count: 1 }, { cropActive: true });
          preferedCropsData.push(clonedObject);
        }
      });
    } else {
      for (var i = 0; i < props.slectedCropstableArray.length; i++) {
        if (props.slectedCropstableArray[i] !== null) {
          cropResponseData([...props.slectedCropstableArray]);
          setUpdatedItemList(props.slectedCropstableArray);
          setPreferedCropsData([...props.slectedCropstableArray]);
        }
      }
    }
  }, []);

  var arr = [];
  //   getting selected crops from crops popup
  const cropDataFunction = (childData, status) => {
    if (status === true) {
      var list = preferedCropsData;
      childData.map((i, ind) => {
        var cIndex;
        var qSetting = settingsData.qtySetting;
        if (qSetting.length > 0) {
          cIndex = qSetting.findIndex((obj) => obj.cropId == i.cropId);
        } else {
          cIndex = -1;
        }
        var index = list.findIndex((obj) => obj.cropId == i.cropId);
        if (index != -1) {
          Object.assign(
            i,
            { cropActive: true },
            { cropSelect: "active" },
            { wastage: 0 },
            { qty: 0 },
            {
              rateType:
                defaultUnitTypeVal == "unit_kg"
                  ? "kgs"
                  : cIndex != -1
                  ? getUnitVal(qSetting, cIndex)
                  : "kgs",
            },
            { weight: 0 },
            { rate: 0 },
            { total: 0 },
            { qtyUnit: cIndex != -1 ? getUnitVal(qSetting, cIndex) : "crates" },
            { checked: false },
            { bags: [] },
            { status: 1 },
            { cropDelete: false },
            { cropSufx: "" }
          );
          var existedItem = list[index];
          existedItem.count += 1;
          list[index] = existedItem;
          setPreferedCropsData([...list, ...arr]);
          cropData.push(i);
          cropResponseData([...cropData]);
          Object.assign(
            list[index],
            { cropActive: true },
            { qtyUnit: cIndex != -1 ? getUnitVal(qSetting, cIndex) : "Crates" },
            { addInv: false },
            { status: 1 },
            { cropDelete: false }
            // {id:0}
          );
        } else {
          Object.assign(
            i,
            { count: 1 },
            { cropActive: true },
            { cropSelect: "active" },
            { wastage: 0 },
            { qty: 0 },
            {
              rateType:
                defaultUnitTypeVal == "unit_kg"
                  ? "kgs"
                  : cIndex != -1
                  ? getUnitVal(qSetting, cIndex)
                  : "crates",
            },
            { weight: 0 },
            { rate: 0 },
            { total: 0 },
            { qtyUnit: cIndex != -1 ? getUnitVal(qSetting, cIndex) : "Crates" },
            { checked: false },
            { bags: [] },
            { status: 1 },
            { id: 0 },
            { cropDelete: false },
            { cropSufx: "" }
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

  // function to nevigate to step3 page
  var dArray = [];
  const [allDeletedCrops, setAllDeletedCrops] = useState([]);
  const addStep3Modal = () => {
    var cropInfo = billEditStatus ? cropData.concat(allDeletedCrops) : cropData;
    console.log(cropInfo, allDeletedCrops, "all crops with deleted edit");
    for (var k = 0; k < cropInfo.length; k++) {
      if (Object.keys(cropInfo[k]).length != 0) {
        if (
          cropInfo[k].rateType?.toLowerCase() == "kgs" ||
          cropInfo[k].rateType?.toLowerCase() == "loads" ||
          cropInfo[k].rateType?.toLowerCase() == "pieces"
        ) {
          cropInfo[k].total =
            (cropInfo[k].weight - cropInfo[k].wastage) * cropInfo[k].rate;
        } else {
          cropInfo[k].total =
            (cropInfo[k].qty - cropInfo[k].wastage) * cropInfo[k].rate;
        }
      }
    }
    var h = [];
    // if (cropData.length > 0) {
    cropInfo.map((item, index) => {
      if (cropInfo[index].rate != 0) {
        localStorage.setItem("lineItemsEdit", JSON.stringify(cropInfo));
        if (billEditStatus) {
          var lineitem = billEditStatus
            ? props.cropEditObject.lineItems
            : JSON.parse(localStorage.getItem("lineItemsEdit"));
          var index1 = lineitem.findIndex(
            (obj) => obj.cropId == cropInfo[index].cropId
          );
          if (index1 == index) {
            if (cropInfo[index1]?.cropDelete) {
              cropInfo[index].status = 0;
            } else if (cropInfo[index].id == 0) {
              cropInfo[index].status = 1;
            }
            // else if (lineitem[index1].id == 0) {
            //   cropInfo[index].status = 1;
            // }
            else {
              console.log("not deleted status 2");
              cropInfo[index].status = 2;
            }
            var arr = [];
            if (cropInfo[index1]?.bags != null) {
              if (cropInfo[index1]?.bags.length > 0) {
                cropInfo[index1].bags.map((item, i) => {
                  let clonedObject = { ...cropInfo[index].bags[i] };
                  Object.assign(clonedObject, { status: 2 });
                  arr.push(clonedObject);
                });
                cropInfo[index].bags = [...arr];
              }
            }
          } else {
            if (index1 != -1) {
              if (!cropInfo[index].cropDelete) {
                if (cropInfo[index].id == 0) {
                  cropInfo[index].status = 1;
                }
                // if (lineitem[index1].id == 0) {
                //   cropInfo[index].status = 1;
                // }
                else {
                  console.log("status2");
                  cropInfo[index].status = 2;
                }
              } else {
                cropInfo[index].status = 0;
              }
              // return null;
            } else {
              if (!cropInfo[index].cropDelete) {
                cropInfo[index].status = 1;
              } else {
                cropInfo[index].status = 0;
              }
            }
          }
        } else {
          for (var l = 0; l < cropInfo.length; l++) {
            if (cropInfo[l].status == 0 || cropInfo[l].cropDelete) {
              cropInfo.splice(l, 1);
            }
          }
        }
      }
    });
    if (billEditStatus) {
      dArray =
        updatedItemList.length != 0
          ? updatedItemList.concat(allDeletedCrops)
          : cropInfo;
      // if (dArray?.length > 0) {
      //   for (let i = 0; i < dArray.length; i++) {
      //     const bags = dArray[i].bags;
      //     console.log(bags);
      //     let normBags = bags.map((item, index) => {
      //       let clonedObject = { ...bags[i] };
      //       console.log(clonedObject, "item");
      //       Object.assign(clonedObject, { status: 2 });
      //     });
      //     console.log(normBags);
      //     dArray[i].bags = normBags;
      //   }
      // }
    }
    console.log(dArray, cropInfo, updatedItemList);

    if (h.length > 0) {
      var h1 = h.map((item, index) => {
        if (h[index] != null) {
          if (h.length == cropInfo.length) {
            return item;
          }
        }
      });
    }
  };
  // function to nevigate to step3 page
  var arrays = [];
  const step2Next = () => {
    if (cropData.length > 0) {
      for (var index = 0; index < cropData.length; index++) {
        const data = cropData[index];
        if (Object.keys(data).length != 0) {
          if (data.cropDelete) continue;
          const qtyUnit = data.qtyUnit?.toLowerCase();
          const rateType = data.rateType?.toLowerCase();
          if (["loads", "pieces"].includes(qtyUnit)) {
            if (data.weight == 0) {
              toast.error("Please enter weight", {
                toastId: "error1",
              });
              return null;
            } else if (data.rate == 0) {
              toast.error("Please enter rate", {
                toastId: "error2",
              });
              return null;
            } else if (Object.is(data.weight, data.wastage)) {
              toast.error("wastage is always less than weight", {
                toastId: "error3",
              });
              return null;
            } else if (parseInt(data.weight) <= parseInt(data.wastage)) {
              toast.error("wastage is always less than weight", {
                toastId: "error3",
              });
              return null;
            }
          } else if (qtyUnit === "kgs") {
            if (data.weight == 0) {
              toast.error("Please enter weight", {
                toastId: "error1",
              });
              return null;
            } else if (data.rate == 0) {
              toast.error("Please enter rate", {
                toastId: "error2",
              });
              return null;
            } else if (parseInt(data.weight) <= parseInt(data.wastage)) {
              toast.error("wastage is always less than weight", {
                toastId: "error3",
              });
              return null;
            }
          } else if (qtyUnit === rateType) {
            if (data.qty == 0) {
              toast.error("Please enter Quantity", {
                toastId: "error1",
              });
              return null;
            } else if (data.rate == 0) {
              toast.error("Please enter rate", {
                toastId: "error2",
              });
              return null;
            } else if (parseInt(data.wastage) >= parseInt(data.qty)) {
              toast.error("wastage is always less than quantity", {
                toastId: "error4",
              });
              return null;
            }
          } else if (
            !setQuantityBasedtable(qtyUnit) &&
            data.rateType?.toUpperCase() !== "RATE_PER_UNIT"
          ) {
            if (data.qty == 0) {
              toast.error("Please enter Quantity", {
                toastId: "error1",
              });
              return null;
            } else if (data.weight == 0 && !billEditStatus) {
              toast.error("Please enter weight", {
                toastId: "error2",
              });
              return null;
            } else if (data.rate == 0) {
              toast.error("Please enter rate", {
                toastId: "error3",
              });
              return null;
            } else if (parseInt(data.weight) <= parseInt(data.wastage)) {
              toast.error("wastage is always less than weight", {
                toastId: "error4",
              });
              return null;
            }
          } else if (
            setQuantityBasedtable(data.qtyUnit) &&
            data.weight != 0 &&
            data.rate != 0
          ) {
            return data;
          }
        }
        // end if
      }

      for (var k = 0; k < cropData.length; k++) {
        console.log(cropData);
        if (Object.keys(cropData[k]).length != 0) {
          if (cropData[k].cropName != "") {
            arrays.push(cropData[k]);
          }
          if (cropData[k].wastage == "") {
            cropData[k].wastage = 0;
          }
        }
      }
      if (arrays.length === cropData.length) {
        console.log(allDeletedCrops, dArray, cropData, "after length");
        addStep3Modal();
        dispatch(selectSteps("step3"));

        props.parentcall(
          dArray.length != 0 ? dArray : cropData,
          billEditStatus
        );
        console.log(dArray);
      } else {
        for (var j = 0; j < cropData.length; j++) {
          if (
            Object.keys(cropData[j]).length == 0 ||
            cropData[j].cropName == ""
          ) {
            toast.error("Please add crop", {
              toastId: "error6",
            });
          }
        }
      }
    }
  };
  //   getting quantity type to change tables(kgs or crates..)
  const setQuantityBasedtable = (unitType) => {
    var t = false;
    if (
      unitType?.toLowerCase() == "kgs" ||
      unitType?.toLowerCase() == "loads" ||
      unitType == "pieces"
    ) {
      t = true;
    }
    return t;
  };

  //   getting quantiy and rate values from dropdowns
  var arr1 = [];
  const getQuantity = (cropData, index1, crop) => (e) => {
    // cropData[index1].rateType = "kgs";
    var cIndex = 0;
    var qSetting = settingsData.qtySetting;
    if (qSetting.length > 0) {
      cIndex = qSetting.findIndex((obj) => obj.cropId == crop.cropId);
      console.log(cIndex);
      if (cIndex != -1) {
        qSetting[cIndex].qtyUnit = e.target.value;
      }
    } else {
      cIndex = -1;
    }
    let updatedItemList = cropData.map((item, i) => {
      if (i == index1) {
        arr1.push({ ...cropData[i], qtyUnit: e.target.value });
        return {
          ...cropData[i],
          qtyUnit: e.target.value,
          rateType:
            defaultUnitTypeVal == "unit_kg"
              ? "kgs"
              : cIndex != -1
              ? getQuantityUnit(qSetting, cIndex)
              : e.target.value,
        };
      } else {
        cropResponseData([...cropData]);
        return { ...cropData[i] };
      }
    });
    console.log(updatedItemList, cIndex, qSetting[cIndex]);
    cropResponseData([...updatedItemList]);
    setUpdatedItemList([...updatedItemList]);
  };
  const getRateType = (cropData, index) => (e) => {
    // cropData[index].rateType = e.target.value;
    let updatedItemListRateType = cropData.map((item, i) => {
      if (i == index) {
        arr1.push({ ...cropData[i], rateType: e.target.value });
        return { ...cropData[i], rateType: e.target.value, weight: 0 };
      } else {
        cropResponseData([...cropData]);
        return { ...cropData[i] };
      }
    });
    console.log(updatedItemListRateType);
    cropResponseData([...updatedItemListRateType]);
    setUpdatedItemList([...updatedItemListRateType]);
  };
  //   getting input values(quantity,weight,wastage,rate) from input fields
  var arr = [];
  const getQuantityValue = (id, index, cropitem) => (e) => {
    var val = e.target.value
      .replace(/[^\d.]/g, "")
      .replace(/^(\d*)(\.\d{0,2})\d*$/, "$1$2")
      .replace(/(\.\d{0,2})\d*/, "$1")
      .replace(/(\.\d*)\./, "$1");
    let updatedItem = cropitem.map((item, i) => {
      if (i == index) {
        return { ...cropitem[i], qty: val };
      } else {
        cropResponseData([...cropitem]);
        return { ...cropitem[i] };
      }
    });

    cropResponseData([...updatedItem]);
    setunitValue(val);
    if (updatedItemList.length > 0) {
      for (var j = 0; j < updatedItemList.length; j++) {
        if (updatedItemList[j].status == 0) {
          updatedItem.push(updatedItemList[j]);
        }
      }
    }
    setUpdatedItemList([...updatedItem]);
    setCropId(id);
  };
  const getWeightValue = (id, index, cropitem) => (e) => {
    var val = e.target.value
      .replace(/[^\d.]/g, "")
      .replace(/^(\d*)(\.\d{0,2})\d*$/, "$1$2")
      .replace(/(\.\d{0,2})\d*/, "$1")
      .replace(/(\.\d*)\./, "$1");
    // .replace(/\D/g, "");
    let updatedItem1 = cropitem.map((item, i) => {
      if (i == index) {
        return { ...cropitem[i], weight: val };
      } else {
        cropResponseData([...cropitem]);
        return { ...cropitem[i] };
      }
    });
    cropResponseData([...updatedItem1]);
    setweightValue(val);
    setUpdatedItemList([...updatedItem1]);
    setCropId(id);
  };
  const getCropSuffix = (id, index, cropitem) => (e) => {
    var val = e.target.value;
    if (e.target.value.length > 30) {
      toast.error("Suffix should be max 30 characters", {
        toastId: "error10",
      })
    } 
    // .replace(/\D/g, "");
    let updatedItem1 = cropitem.map((item, i) => {
      if (i == index) {
        return { ...cropitem[i], cropSufx: val };
      } else {
        cropResponseData([...cropitem]);
        return { ...cropitem[i] };
      }
    });
    cropResponseData([...updatedItem1]);
    setUpdatedItemList([...updatedItem1]);
  };
  const getWastageValue = (id, index, cropitem) => (e) => {
    if (
      cropitem[index].rateType.toUpperCase().toUpperCase() ==
      cropitem[index].qtyUnit.toUpperCase()
    ) {
      var val = e.target.value
        .replace(/[^\d.]/g, "")
        .replace(/^(\d*)(\.\d{0,2})\d*$/, "$1$2")
        .replace(/(\.\d{0,2})\d*/, "$1")
        .replace(/(\.\d*)\./, "$1");
    } else {
      var val = e.target.value.replace(/\D/g, "");
    }
    // var val = e.target.value.replace(/[^0-9.]/g, "");

    let updatedItem2 = cropitem.map((item, i) => {
      if (i == index) {
        return { ...cropitem[i], wastage: val };
      } else {
        cropResponseData([...cropitem]);
        return { ...cropitem[i] };
      }
    });
    console.log(updatedItem2);
    cropResponseData([...updatedItem2]);
    setwastageValue(val);
    setUpdatedItemList([...updatedItem2]);
    setCropId(id);
  };
  const getRateValue = (id, index, cropitem) => (e) => {
    var val = e.target.value
      .replace(/[^\d.]/g, "")
      .replace(/^(\d*)(\.\d{0,2})\d*$/, "$1$2")
      .replace(/(\.\d{0,2})\d*/, "$1")
      .replace(/(\.\d*)\./, "$1");
    // .replace(/\D/g, "");
    let updatedItem3 = cropitem.map((item, i) => {
      if (i == index) {
        return { ...cropitem[i], rate: val };
      } else {
        cropResponseData([...cropitem]);
        return { ...cropitem[i] };
      }
    });
    cropResponseData([...updatedItem3]);
    setrateValue(val);
    setCropId(id);
    setUpdatedItemList([...updatedItem3]);
    console.log(allDeletedCrops, updatedItem3);
    if (billEditStatus) {
      // props.slectedCropstableArray.lineItems = updatedItem3;
    }
  };

  //   clone crop (copy crop) function
  const cloneCrop = (crop, cropsData, k) => {
    console.log(k, "k index");
    if (billEditStatus) {
      var list = preferedCropsData;
      var index = list.findIndex((obj) => obj.cropId == crop.cropId);
      if (index != -1) {
        list[index].count += 1;
      }
      const clonedCrop = Object.assign({}, crop, {
        cropDelete: false,
        status: 1,
        id: 0,
      });
      // cropsData.push(clonedCrop);
      // cropResponseData([...cropsData,clonedCrop]);
      // const updatedCropsData = [...cropsData, clonedCrop];
      const updatedCropsData = [
        ...cropsData.slice(0, k + 1),
        clonedCrop,
        ...cropsData.slice(k + 1),
      ];
      cropResponseData(updatedCropsData);
      setUpdatedItemList(updatedCropsData);
    } else {
      var list = preferedCropsData;
      var index = list.findIndex((obj) => obj.cropId == crop.cropId);
      if (index != -1) {
        list[index].count += 1;
      }
      const updatedCropsData = [
        ...cropsData.slice(0, k + 1),
        crop,
        ...cropsData.slice(k + 1),
      ];
      cropResponseData(updatedCropsData);
      // cropResponseData([...cropData, crop]);
    }
  };

  // delete crop funnction
  var dummyList = [];
  var arrylist = [];
  // var cropDeletedList = [];
  const [cropDeletedList, setcropDeletedList] = useState([]);
  const deleteCrop = (crop, cropArray, indexVal) => {
    console.log(indexVal, "val");
    var index = cropArray.indexOf(crop);
    var list = preferedCropsData;
    // var index = cropArray.findIndex((obj,i) => cropArray[i].cropId == cropArray[indexVal].cropId);
    // console.log(index,indexVal)
    // for (var i = 0; i < cropArray.length; i++) {
    if (index != -1) {
      let data = cropArray.map((item, i) => {
        if (Object.keys(cropArray[i]).length != 0) {
          console.log("if", cropArray[i]);
          if (i == indexVal) {
            if (billEditStatus) {
              return Object.assign(cropArray[i], {
                cropDelete: true,
                status: 0,
                index: i,
              });
            } else {
              return {
                ...cropArray[i],
                cropDelete: true,
                status: 0,
                index: i,
              };
            }
          } else {
            cropResponseData([...cropArray]);
            return { ...cropArray[i] };
          }
        }
      });
      // Object.assign(cropArray[index], { status: 0, index:  index});
      // cropArray[index].total = 0;
      // cropArray[index].qty = 0;
      // cropArray[index].qtyUnit = "";
      // cropArray[index].cropDelete = true;
      if (cropArray[index]?.weight != 0 && cropArray[index]?.rate != 0) {
        if (Object.keys(cropArray[index]).length != 0) {
          console.log("hey", cropArray[index]);
          setcropDeletedList([...cropDeletedList, cropArray[index]]);
          cropDeletedList.push(cropArray[index]);
        }
      }
      cropArray.splice(index, 1);
      var index1 = list.findIndex((obj) => obj.cropId == crop.cropId);
      if (index1 != -1) {
        list[index1].count -= 1;
        if (list[index1].count == 0) {
          if (billEditStatus) {
            console.log("yes if1", list[index1]);
            // list.splice(index1, 1);
          } else {
            getPreferredCrops(clickId, clientId, clientSecret)
              .then((response) => {
                dummyList = response.data.data;
                let updatedarr = dummyList.map((item, i) => {
                  if (item.cropId == list[index1].cropId) {
                    return { ...dummyList[i] };
                  } else if (item.cropId != list[index1].cropId) {
                    return null;
                  }
                });
                for (var k = 0; k < updatedarr.length; k++) {
                  if (updatedarr[k] != null) {
                    arrylist.push(updatedarr[k]);
                  }
                }
                for (var k = 0; k < list.length; k++) {
                  for (var t = 0; t < arrylist.length; t++) {
                    if (list[k].cropId == arrylist[t].cropId) {
                      console.log("here raa babu", list, arrylist);
                      list.splice(index1, t);
                    } else {
                      console.log("samecrop ");
                      // return list;
                    }
                  }
                }
                if (arrylist.length == 0) {
                  list.splice(index1, 1);
                }
                setShowStep3Modal(false);
                setPreferedCropsData([...list]);
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      }
    }
    // }

    console.log(cropDeletedList, cropArray, "list");
    setUpdatedItemList([...cropArray, ...cropDeletedList]);
    cropResponseData([...cropArray]);
    // cropResponseData([...cropArray]);
    if (cropDeletedList?.length > 0) {
      setAllDeletedCrops(cropDeletedList);
    }
  };
  //   getting individual bags popup function
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
        setArray(arrobject);
        // setArray([...arrobject]);
        return { ...crd[i], checked: true };
      } else {
        return { ...crd[i] };
      }
    });
    cropResponseData([...updatedItem]);
    setshowBagsModalStatus(true);
    setShowBagsModal(true);
    if (crd[ink].bags.length > 0) {
      setEditBagsStatus(true);
    }
  };

  //   gettinng inndividual bags data
  const callbackFunction = (childData, invArr) => {
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
  };
  //   click on input to reset 0 to enter value
  const resetInput = (e) => {
    if (e.target.value == 0) {
      e.target.value = "";
    }
  };
  var cropArraynew = [];
  const [getCropItem, setCropItem] = useState(false);
  const addCropRow = () => {
    setSelectedCropItem(null);
    setAddCropsIndex(cropData.length);
    setDisplayStat(false);
    setActiveSearch(true);
    var crpObject = {};
    cropArraynew.push(crpObject);
    console.log(cropArraynew, cropData);
    cropResponseData([...cropData, ...cropArraynew]);
  };

  const filterOption = (option, inputValue) => {
    const { cropName } = option.data;
    const searchValue1 = inputValue.toLowerCase();

    return cropName.toLowerCase().includes(searchValue1);
  };

  const addCropToEmptyRow = (crop, i) => {
    var c = cropData;
    let updatedItem3 = c.map((item, j) => {
      if (j == i) {
        setSelectedCropItem(crop);
        setcropDeletedList([...cropDeletedList, onFocusCrop]);
        cropDeletedList.push(onFocusCrop);
        var cIndex;
        var qSetting = settingsData.qtySetting;
        if (qSetting.length > 0) {
          cIndex = qSetting.findIndex((obj) => obj.cropId == crop.cropId);
        } else {
          cIndex = -1;
        }
        return {
          ...c[j],
          cropName: crop.cropName,
          imageUrl: crop.imageUrl,
          cropId: crop.cropId,
          displayStat: true,
          cropSelect: "active",
          wastage: 0,
          qty: 0,
          weight: 0,
          rateType:
            defaultUnitTypeVal == "unit_kg"
              ? "kgs"
              : cIndex != -1
              ? getUnitVal(qSetting, cIndex)
              : "crates",
          rate: 0,
          total: 0,
          qtyUnit: cIndex != -1 ? getUnitVal(qSetting, cIndex) : "crates",
          checked: false,
          bags: [],
          count: 1,
          status: 1,
          activeSearch: true,
          cropSufx: "",
        };
      } else {
        cropResponseData([...c]);
        return { ...c[j] };
      }
    });
    var index1 = updatedItem3.findIndex((obj) => obj.cropId == crop.cropId);
    if (index1 != -1) {
    } else {
      Object.assign(crop, { count: 1 });
      const new_obj = { ...crop, cropActive: true };
      updatedItem4.push(new_obj);
    }
    let updatedItem4 = preferedCropsData.map((item, j) => {
      if (item.cropId == crop.cropId) {
        var countadded;
        if (onFocusCrop != null) {
          if (onFocusCrop.cropId == preferedCropsData[j].cropId) {
            if (preferedCropsData[j].cropId == c[i].cropId) {
              countadded = preferedCropsData[j].count;
            } else {
              countadded = preferedCropsData[j].count + 1;
            }
            var cActive = countadded == 0 ? false : true;
            return {
              ...preferedCropsData[j],
              count: countadded,
              cropActive: cActive,
            };
          } else {
            countadded = preferedCropsData[j].count + 1;

            return {
              ...preferedCropsData[j],
              count: countadded,
              cropActive: true,
            };
          }
        } else {
          countadded = preferedCropsData[j].count + 1;
          return {
            ...preferedCropsData[j],
            count: countadded,
            cropActive: true,
          };
        }
      } else {
        var countadded;
        if (onFocusCrop != null) {
          if (onFocusCrop.cropId == preferedCropsData[j].cropId) {
            console.log(preferedCropsData[j].cropId, c[i].cropId);
            if (preferedCropsData[j].cropId == c[i].cropId) {
              countadded =
                preferedCropsData[j].count != 0
                  ? preferedCropsData[j].count - 1
                  : preferedCropsData[j].count;
              console.log(countadded, "appu if");
            } else {
              countadded = preferedCropsData[j].count;
              console.log(countadded, "appu else");
            }

            var cActive = countadded == 0 ? false : true;
            var cSelect = countadded == 0 ? false : true;

            return {
              ...preferedCropsData[j],
              count: countadded,
              cropActive: cActive,
              cropSelect: cSelect,
            };
          } else {
            return { ...preferedCropsData[j] };
          }
        } else {
          return { ...preferedCropsData[j] };
        }
      }
    });
    var index1 = updatedItem4.findIndex((obj) => obj.cropId == crop.cropId);
    if (index1 != -1) {
    } else {
      Object.assign(crop, { count: 1 });
      const new_obj = { ...crop, cropActive: true };
      updatedItem4.push(new_obj);
    }

    setAddCropStatus(false);
    cropResponseData([...updatedItem3]);
    setUpdatedItemList([...updatedItem3, ...cropDeletedList]);
    console.log(cropDeletedList, updatedItem3, cropDeletedList.length);
    setPreferedCropsData([...updatedItem4]);
    if (cropDeletedList?.length > 0) {
      console.log(onFocusCrop, cropDeletedList);
      setAllDeletedCrops(cropDeletedList);
    }
  };

  return (
    <div>
      <div className="main_div_padding">
        <h4 className="smartboard_main_header">Select crop and create bill</h4>
        <div className="d-flex align-itmes-center">
          {preferedCropsData.length > 0 && (
            <div className="d-flex total_crops_div">
              {preferedCropsData.map((crop, index) => (
                <div className="">
                  <div
                    className="text-center crop_div crop_div_ui"
                    key={crop.cropId}
                    onClick={() =>
                      cropOnclick(crop, crop.cropId, index, preferedCropsData)
                    }
                  >
                    <button className="cropImgDiv">
                      <img
                        src={crop.imageUrl}
                        className="flex_class cropImg mx-auto "
                      />
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
                    </button>
                    <p>{crop.cropName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            className="text-center crop_div other_Crop"
            onClick={() => allCropData()}
          >
            <img src={other_crop} />
            <p>Other Crop</p>
          </button>
        </div>
        <div>
          <div className="row p-0 mt-2">
            {cropData.length > 0 && (
              <div className="p-0 w-100">
                <h4 className="smartboard_main_header">Crop Information</h4>
                <div className="crop_table" id="scroll_style">
                  <div className="row header_row p-0 crop_table_header_row m-0">
                    <div className="col-lg-2">
                      <p>Crop</p>
                    </div>
                    <div className="col-lg-1">
                      <p>Unit type</p>
                    </div>
                    <div className="col-lg-1">
                      <p>
                        Rate type
                        {/* <br></br>(Per) */}
                      </p>
                    </div>
                    <div className="col-lg-1">
                      <p>Number of Units</p>
                    </div>
                    <div className="col-lg-1">
                      <p>Total Weight</p>
                    </div>
                    <div className="col-lg-1">
                      <p>Individual weights</p>
                    </div>
                    <div className="col-lg-1">
                      <p>Wastage</p>
                    </div>
                    <div className="col-lg-1">
                      <p>Rate (₹)</p>
                    </div>
                    <div className="col-lg-3 last_col">
                      <p>Total (₹)</p>
                    </div>
                  </div>
                  {cropData.map((crop, index) => (
                    <div
                      className="crop_div crop_table_div table_crop_div m-0"
                      key={index}
                    >
                      <div className="d-flex crop_table_delete_div">
                        <div className="crop_table_view">
                          <table className="table table-bordered table_div">
                            {Object.keys(cropData[index]).length != 0 ? (
                              // !cropData[index].cropDelete ? (
                              <tr className="">
                                <td className="col-2">
                                  {!cropData[index].activeSearch ||
                                  cropData[index].displayStat ? (
                                    // !activeSearch || displayStat?

                                    <div className="">
                                      <div
                                        className="flex_class mr-0"
                                        onClick={() => {
                                          activeSearchCrop(cropData, index);
                                        }}
                                      >
                                        <img
                                          src={cropData[index].imageUrl}
                                          className="flex_class mr-2"
                                        />
                                        <p className="m-0">
                                          {cropData[index].cropName}
                                        </p>
                                      </div>
                                      {cropSufixStatus ? <input
                                        type="text"
                                        value={cropData[index].cropSufx}
                                        onChange={getCropSuffix(
                                          cropData[index].cropId,
                                          index,
                                          cropData
                                        )}
                                        className="inpu_suffix"
                                        placeholder="Add crop suffix"
                                      /> : ''}
                                     
                                    </div>
                                  ) : addCropsIndex == index &&
                                    addCropStatus ? (
                                    <Select
                                      defaultMenuIsOpen
                                      isSearchable={true}
                                      className="basic-single crop_select"
                                      classNamePrefix="select"
                                      styles={colourStyles}
                                      name="partner"
                                      hideSelectedOptions={false}
                                      options={cropsData}
                                      placeholder={"Click here and add Crop"}
                                      // value={selectedCropItem}
                                      onChange={(event) =>
                                        addCropToEmptyRow(event, index)
                                      }
                                      filterOption={filterOption}
                                      isClearable={false}
                                      noOptionsMessage={() =>
                                        "No Data Available"
                                      }
                                      getOptionValue={(e) => e.cropId}
                                      getOptionLabel={(e) => (
                                        <div
                                          contenteditable="true"
                                          className="flex_class mr-0"
                                          // onClick={() => {
                                          //   activeSearchCrop(cropData, index);
                                          // }}
                                        >
                                          <img
                                            src={e.imageUrl}
                                            className="flex_class mr-2"
                                          />
                                          <p className="m-0">{e.cropName}</p>
                                        </div>
                                      )}
                                    />
                                  ) : (
                                    ""
                                  )}
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
                                {!setQuantityBasedtable(
                                  cropData[index].qtyUnit
                                ) ? (
                                  <td className="col-1">
                                    <select
                                      className="form-control qty_dropdown dropdown pl-0 m-0"
                                      value={cropData[index].rateType}
                                      onChange={getRateType(cropData, index)}
                                    >
                                      <option
                                        value={cropData[
                                          index
                                        ].qtyUnit?.toLowerCase()}
                                      >
                                        {cropData[index].qtyUnit}{" "}
                                      </option>
                                      <option value="kgs"> Kg </option>
                                    </select>
                                  </td>
                                ) : (
                                  <td className="col-1 fadeOut_col">-</td>
                                )}
                                {!setQuantityBasedtable(
                                  cropData[index].qtyUnit
                                ) ? (
                                  <td className="col-1">
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="quantity"
                                      onFocus={(e) => resetInput(e)}
                                      value={cropData[index].qty}
                                      onChange={getQuantityValue(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    />
                                  </td>
                                ) : (
                                  <td className="col-1 fadeOut_col">-</td>
                                )}
                                {cropData[index].qtyUnit?.toLowerCase() !=
                                (cropData[index].rateType == "RATE_PER_UNIT" ||
                                cropData[index].rateType?.toLowerCase() ==
                                  cropData[index].qtyUnit?.toLowerCase()
                                  ? cropData[index].qtyUnit?.toLowerCase()
                                  : cropData[index].rateType) ? (
                                  <td className="col-1">
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="weight"
                                      onFocus={(e) => resetInput(e)}
                                      value={cropData[index].weight}
                                      onChange={getWeightValue(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    />
                                  </td>
                                ) : setQuantityBasedtable(
                                    cropData[index].qtyUnit
                                  ) ? (
                                  <td className="col-1">
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="weight"
                                      onFocus={(e) => resetInput(e)}
                                      value={cropData[index].weight}
                                      onChange={getWeightValue(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    />
                                  </td>
                                ) : (
                                  // cropData[index].qtyUnit?.toLowerCase() ==
                                  // "loads" ? (
                                  //   <td className="col-1 fadeOut_col">-</td>
                                  // ) : (
                                  //   <td className="col-1">
                                  //     <input
                                  //       type="text"
                                  //       className="form-control"
                                  //       name="weight"
                                  //       onFocus={(e) => resetInput(e)}
                                  //       value={cropData[index].weight}
                                  //       onChange={getWeightValue(
                                  //         cropData[index].cropId,
                                  //         index,
                                  //         cropData
                                  //       )}
                                  //     />
                                  //   </td>
                                  // )
                                  <td className="col-1 fadeOut_col">-</td>
                                )}
                                {cropData[index].qtyUnit?.toLowerCase() ===
                                  "bags" ||
                                cropData[index].qtyUnit?.toLowerCase() ===
                                  "sacs" ? (
                                  cropData[index].qtyUnit?.toLowerCase() !=
                                  cropData[index].rateType ? (
                                    <td className="col-1">
                                      <div className="d-flex align-items-center justify-content-center">
                                        <button
                                          onClick={() => {
                                            handleCheckEvent(
                                              cropData,
                                              index,
                                              crop
                                            );
                                          }}
                                        >
                                          <div className="d-flex align-items-center justify-content-center">
                                            <input
                                              type="checkbox"
                                              checked={
                                                billEditStatus
                                                  ? cropData[index].bags !==
                                                      null &&
                                                    cropData[index].bags
                                                      .length > 0
                                                    ? true
                                                    : false
                                                  : cropData[index].checked
                                              }
                                              id="modal_checkbox"
                                              value="my-value"
                                              className="checkbox_t cursor_class"
                                              onChange={() => {
                                                handleCheckEvent(
                                                  cropData,
                                                  index,
                                                  crop
                                                );
                                              }}
                                            />
                                            <div>
                                              {cropData[index].bags !== null &&
                                              cropData[index].bags.length >
                                                0 ? (
                                                <span
                                                  className="unit-type my-0 cursor_class"
                                                  for="modal_checkbox"
                                                >
                                                  Edit
                                                </span>
                                              ) : (
                                                ""
                                              )}{" "}
                                            </div>
                                          </div>
                                        </button>
                                      </div>
                                    </td>
                                  ) : (
                                    <td className="col-1 fadeOut_col">-</td>
                                  )
                                ) : (
                                  <td className="col-1 fadeOut_col">-</td>
                                )}
                                {cropData[index].qtyUnit?.toLowerCase() ==
                                "loads" ? (
                                  <td className="col-1 fadeOut_col">-</td>
                                ) : (
                                  <td className="col-1">
                                    {/* <p>hi</p> */}
                                    <input
                                      type="text"
                                      name="wastage"
                                      onFocus={(e) => resetInput(e)}
                                      className="form-control wastage_val"
                                      value={cropData[index].wastage}
                                      onChange={
                                        !cropData[index].checked
                                          ? getWastageValue(
                                              cropData[index].cropId,
                                              index,
                                              cropData
                                            )
                                          : ""
                                      }
                                    />
                                  </td>
                                )}
                                <td className="col-1">
                                  <input
                                    type="text"
                                    name="rate"
                                    className="form-control"
                                    onFocus={(e) => resetInput(e)}
                                    value={cropData[index].rate}
                                    onChange={getRateValue(
                                      cropData[index].cropId,
                                      index,
                                      cropData
                                    )}
                                  />
                                </td>
                                <td className="col-3">
                                  <div className="d-flex align-items-center justify-content-between">
                                    <p className="totals">
                                      {cropData[index].rateType.toLowerCase() ==
                                        "kgs" ||
                                      cropData[index].rateType.toLowerCase() ==
                                        "loads" ||
                                      cropData[index].rateType.toLowerCase() ==
                                        "pieces"
                                        ? (
                                            (cropData[index].weight -
                                              cropData[index].wastage) *
                                            cropData[index].rate
                                          ).toFixed(2)
                                        : (
                                            (cropData[index].qty -
                                              cropData[index].wastage) *
                                            cropData[index].rate
                                          ).toFixed(2)}
                                    </p>
                                    <div className="delete_copy_div d-flex">
                                      <button
                                        className="flex_class mr-0 sub_icons_div"
                                        onClick={cloneCrop.bind(
                                          this,
                                          crop,
                                          cropData,
                                          index
                                        )}
                                      >
                                        <img
                                          src={copy_icon}
                                          className="sub_icons"
                                          alt="image"
                                        />
                                      </button>
                                      <button
                                        className="flex_class mr-0 sub_icons_div"
                                        onClick={deleteCrop.bind(
                                          this,
                                          crop,
                                          cropData,
                                          index
                                        )}
                                      >
                                        <img
                                          src={delete_icon}
                                          className="sub_icons"
                                          alt="image"
                                        />
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              // )
                              // : (
                              //   ""
                              // )
                              <tr className="empty_row">
                                <td className="col-2 empty_col">
                                  <Select
                                    isSearchable={true}
                                    className="basic-single crop_select"
                                    classNamePrefix="select"
                                    styles={colourStyles}
                                    name="partner"
                                    hideSelectedOptions={false}
                                    options={cropsData}
                                    placeholder={"Click here and add Crop"}
                                    // value={selectedCropItem}
                                    onChange={(event) =>
                                      addCropToEmptyRow(event, index)
                                    }
                                    filterOption={filterOption}
                                    isClearable={false}
                                    noOptionsMessage={() => "No Data Available"}
                                    getOptionValue={(e) => e.cropId}
                                    getOptionLabel={(e) => (
                                      <div
                                        contenteditable="true"
                                        className="flex_class mr-0"
                                      >
                                        <img
                                          src={e.imageUrl}
                                          className="flex_class mr-2"
                                        />
                                        <p className="m-0">{e.cropName}</p>
                                      </div>
                                    )}
                                  />
                                  {/* <input
                                    id="searchInput"
                                    value={searchValue}
                                    onClick={handleAddCropStatus}
                                    onChange={(event) => {
                                      handleSearch(event);
                                    }}
                                  /> */}
                                </td>
                                <td className="col-1"></td>
                                <td className="col-1"></td>
                                <td className="col-1"></td>
                                <td className="col-1"></td>
                                <td className="col-1"></td>
                                <td className="col-1"></td>
                                <td className="col-1"></td>
                                <td className="col-3">
                                  <div className="delete_copy_div d-flex justify-content-end">
                                    <button
                                      className="flex_class mr-0 sub_icons_div"
                                      onClick={cloneCrop.bind(this, crop)}
                                    >
                                      <img
                                        src={copy_icon}
                                        className="sub_icons"
                                        alt="image"
                                      />
                                    </button>
                                    <button
                                      className="flex_class mr-0 sub_icons_div"
                                      onClick={deleteCrop.bind(
                                        this,
                                        crop,
                                        cropData,
                                        index
                                      )}
                                    >
                                      <img
                                        src={delete_icon}
                                        className="sub_icons"
                                        alt="image"
                                      />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </table>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="add_crop_text pr-2"
                  onClick={() => addCropRow()}
                >
                  + Add Crop
                </button>
              </div>
            )}
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
      </div>
      <div className="bottom_div">
        <div className="d-flex align-items-center justify-content-between">
          <button className="secondary_btn" onClick={cancelStep}>
            cancel
          </button>
          <div className="d-flex align-items-center">
            {billEditStatus ? (
              ""
            ) : (
              <button
                className="secondary_btn no_delete_btn"
                onClick={() => previousStep()}
              >
                Previous
              </button>
            )}
            <button className="primary_btn" onClick={() => step2Next()}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Step22;
