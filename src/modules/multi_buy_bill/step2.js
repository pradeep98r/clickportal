import { useDispatch, useSelector } from "react-redux";
import {
  arrayObj,
  fromPreviousStep3,
  multiSelectPartners,
  multiStepsVal,
} from "../../reducers/multiBillSteps";
import "../multi_buy_bill/step2.scss";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import DateSelection from "./dateSelection";
import { getQuantityUnit, getText, getUnitVal } from "../../components/getText";
import single_bill from "../../assets/images/bills/single_bill.svg";
import "../multi_buy_bill/step1.scss";
import SelectSinglePartner from "./selectSinglePartner";
import down_arrow from "../../assets/images/down_arrow.svg";
import Select from "react-select";
import { getAllCrops } from "../../actions/billCreationService";
import SelectBags from "../buy_bill_book/bags";
import delete_icon from "../../assets/images/delete.svg";
import copy_icon from "../../assets/images/copy.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { inArray } from "jquery";
const Step2 = (props) => {
  const dispatch = useDispatch();
  const selectedStep = useSelector((state) => state.multiStepsInfo);
  const multiSelectPartnersArray = selectedStep?.multiSelectPartners;
  const [allData, setAllData] = useState([]);
  const [cropsData, setCropsData] = useState(allData);
  const settingsData = JSON.parse(localStorage.getItem("systemSettingsData"));
  const [defaultUnitTypeVal, setDefaultUnitTypeVal] = useState("");
  const fromMultiBillViewStatus = selectedStep?.fromMultiBillView;
  const partyType = selectedStep?.multiSelectPartyType;
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
  const cancelStep = () => {
    dispatch(multiSelectPartners([]));
    props.closeModal();
  };
  // const onClickStep2 = (array) => {
  //   dispatch(multiStepsVal("step3"));
  //   dispatch(multiSelectPartners(array));
  // };
  const getTotalValue = (obj1, index, mIndex) => {
    let clonedArray = [...selectedStep?.multiSelectPartners];
    var val = 0;
    obj1.rateType.toLowerCase() == "kgs" ||
    obj1.rateType.toLowerCase() == "loads" ||
    // obj1.rateType.toLowerCase() == "pieces" ||
    // (obj1.qtyUnit.toLowerCase() == "pieces" &&
    //   obj1.rateType.toUpperCase() == "RATE_PER_UNIT") ||
    (obj1.qtyUnit.toLowerCase() == "loads" &&
      obj1.rateType.toUpperCase() == "RATE_PER_UNIT")
      ? (val = (obj1.weight - obj1.wastage) * obj1.rate)
      : (val = (obj1.qty - obj1.wastage) * obj1.rate);
    let updatedItem3 = multiSelectPartnersArray[mIndex].lineItems.map(
      (item, i) => {
        if (i == index) {
          return {
            ...multiSelectPartnersArray[mIndex].lineItems[i],
            total: val,
          };
        } else {
          return { ...multiSelectPartnersArray[mIndex].lineItems[i] };
        }
      }
    );
    let clonedObject1 = { ...clonedArray[mIndex] };
    clonedObject1 = { ...clonedObject1, lineItems: updatedItem3 };
    clonedArray[mIndex] = clonedObject1;

    // setMultiSelectPartnersArray(clonedArray);
    dispatch(multiSelectPartners(clonedArray));
    dispatch(arrayObj(clonedArray));
    return val;
  };
  // function to nevigate to step3 page
  var arrays = [];
  const [allDeletedCrops, setAllDeletedCrops] = useState([]);
  const onClickStep2 = (array) => {
    let clonedArray = [...array];
    if (array.length > 0) {
      for (var index = 0; index < array.length; index++) {
        const data1 = array[index];
        const dataLineItems = fromMultiBillViewStatus
          ? allDeletedCrops.concat(data1.lineItems)
          : data1.lineItems;
        if (dataLineItems.length > 0) {
          arrays = [];
          for (var cIndex = 0; cIndex < dataLineItems.length; cIndex++) {
            var data = dataLineItems[cIndex];
            if (Object.keys(data).length != 0) {
              let obj1 = { ...data };
              if (data.cropName == "") {
                toast.error("Please Enter crop detaiils", {
                  toastId: "error1",
                });
                return null;
              }
              if (!obj1.cropDelete) {
                obj1.total = getTotalValue(obj1, cIndex, index);
              }
              if (fromMultiBillViewStatus) {
                var index1 = dataLineItems.findIndex(
                  (obj) => obj.cropId == dataLineItems[cIndex].cropId
                );
                if (index1 == cIndex) {
                  if (dataLineItems[cIndex]?.cropDelete) {
                    obj1.status = 0;
                  } else if (dataLineItems[cIndex].id == 0) {
                    obj1.status = 1;
                  } else {
                    obj1.status = 2;
                  }
                  var arr = [];
                  if (obj1?.bags != null) {
                    if (obj1?.bags.length > 0) {
                      obj1.bags.map((item, i) => {
                        let clonedObject = { ...obj1.bags[i] };
                        Object.assign(clonedObject, { status: 2 });
                        arr.push(clonedObject);
                      });
                      obj1.bags = [...arr];
                    }
                  }
                } else {
                  if (index1 != -1) {
                    if (!obj1.cropDelete) {
                      if (obj1.id == 0) {
                        obj1.status = 1;
                      } else {
                        obj1.status = 2;
                      }
                    } else {
                      obj1.status = 0;
                    }
                    // return null;
                  } else {
                    if (!obj1.cropDelete) {
                      obj1.status = 1;
                    } else {
                      obj1.status = 0;
                    }
                  }
                }
              } else {
                obj1.status = 1;
              }
              data = obj1;
              arrays.push(data);
              if (data.cropDelete) continue;
              const qtyUnit = data.qtyUnit?.toLowerCase();
              const rateType = data.rateType?.toLowerCase();
              if (["loads"].includes(qtyUnit)) {
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
              } else if (
                qtyUnit === rateType ||
                data.qtyUnit.toLowerCase() == "pieces"
              ) {
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
                } else if (data.weight == 0) {
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
          }
        }
        // for (var k = 0; k < data1.lineItems.length; k++) {
        //   if (Object.keys(data1.lineItems[k]).length != 0) {
        //     if (data1.lineItems[k].cropName != "") {
        //       // arrays.push(data1.lineItems[k]);
        //       let obj = { ...data1.lineItems[k] };
        //       // obj.total = getTotalValue(k, index, data1.lineItems);
        //       // data1.lineItems[k] = obj;
        //     }
        //     if (data1.lineItems[k].wastage == "") {
        //       // data1.lineItems[k].wastage = 0;
        //     }
        //   }
        // }

        let clonedObject = { ...array[index] };
        clonedObject = { ...clonedObject, lineItems: arrays };
        clonedArray[index] = clonedObject;
        // if (arrays.length === data1.lineItems.length) {

        // }
      }
      dispatch(multiStepsVal("step3"));
      dispatch(multiSelectPartners(clonedArray));
      dispatch(fromPreviousStep3(true));
      // if (arrays.length === cropData.length) {
      // addStep3Modal();

      // props.parentcall(
      //   dArray.length != 0 ? dArray : cropData,
      //   billEditStatus
      // );
      // } else {
      //   for (var j = 0; j < cropData.length; j++) {
      //     if (
      //       Object.keys(cropData[j]).length == 0 ||
      //       cropData[j].cropName == ""
      //     ) {
      //       toast.error("Please add crop", {
      //         toastId: "error6",
      //       });
      //     }
      //   }
      // }
    }
  };

  // previous step
  const previousStep = () => {
    dispatch(multiStepsVal("step1"));
  };

  useEffect(() => {
    fetchCropData();
    var party = selectedStep?.multiSelectPartyType;
    for (var i = 0; i < settingsData.billSetting.length; i++) {
      if (party.toLowerCase() == "buyer") {
        if (
          settingsData.billSetting[i].billType == "SELL" &&
          settingsData.billSetting[i].settingName === "DEFAULT_RATE_TYPE"
        ) {
          if (settingsData.billSetting[i].value == 0) {
            setDefaultUnitTypeVal("unit_kg");
          } else {
            setDefaultUnitTypeVal("unit_other");
          }
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
      }
    }

    if (selectedStep?.fromPreviousStep3) {
      var mainArray = [];
      for (var j = 0; j < multiSelectPartnersArray.length; j++) {
        let cObj = { ...multiSelectPartnersArray[j] };
        var lineitemsArray = [];
        for (var k = 0; k < multiSelectPartnersArray[j].lineItems.length; k++) {
          let obj = { ...multiSelectPartnersArray[j].lineItems[k] };
          if (obj.rateType == "RATE_PER_KG") {
            obj.rateType = "KGS";
          }
          lineitemsArray = [...lineitemsArray, obj];
          cObj.lineItems = lineitemsArray;

          // multiSelectPartnersArray[j] = cObj;
        }
        mainArray = [...mainArray, cObj];
      }
      dispatch(multiSelectPartners(mainArray));
    }
  }, []);

  const filterOption = (option, inputValue) => {
    const { cropName } = option.data;
    const searchValue1 = inputValue.toLowerCase();

    return cropName.toLowerCase().includes(searchValue1);
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
        Object.assign(item, {
          cropSelect: "",
          qtyUnit:
            cIndex != -1
              ? getUnitVal(qSetting, cIndex).toUpperCase()
              : "CRATES",
          rateType:
            defaultUnitTypeVal == "unit_kg"
              ? "KGS"
              : cIndex != -1
              ? getUnitVal(qSetting, cIndex).toUpperCase()
              : "CRATES",
        });
      });
      setCropsData(response.data.data);
      setAllData(response.data.data);
    });
  };
  // onclick button add crrop event
  const addCrop = (item, id) => {
    var crpObject = {};
    var i = multiSelectPartnersArray.findIndex(
      (obj) => (obj.partyId || obj.farmerId || obj.buyerId) == id
    );
    if (i != -1) {
      let clonedArray = [...multiSelectPartnersArray];
      let clonedObject = { ...clonedArray[i] };
      let updatedLineItems = [...clonedObject.lineItems, crpObject];
      clonedObject = { ...clonedObject, lineItems: updatedLineItems };
      clonedArray[i] = clonedObject;
      // setMultiSelectPartnersArray(clonedArray);
      dispatch(multiSelectPartners(clonedArray));
    }
  };
  // add crop from allcrops dropdown
  const addCropToEmptyRow = (crop, i, ind, data) => {
    var c = data;
    let updatedItem3 = c.map((item, j) => {
      if (j == i) {
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
              ? "KGS"
              : cIndex != -1
              ? getUnitVal(qSetting, cIndex).toUpperCase()
              : "CRATES",
          rate: 0,
          total: 0,
          qtyUnit:
            cIndex != -1
              ? getUnitVal(qSetting, cIndex).toUpperCase()
              : "CRATES",
          checked: false,
          bags: [],
          count: 1,
          status: 1,
          activeSearch: true,
          id: 0,
        };
      } else {
        return { ...c[j] };
      }
    });
    let clonedArray = [...multiSelectPartnersArray];
    let clonedObject = { ...clonedArray[ind] };
    clonedObject = { ...clonedObject, lineItems: updatedItem3 };
    clonedArray[ind] = clonedObject;
    // setMultiSelectPartnersArray(clonedArray);
    dispatch(multiSelectPartners(clonedArray));
  };
  const [active, setActive] = useState(false);
  const [activeTrans, setActiveTrans] = useState(false);
  const activateSelect = () => {
    setActive(true);
  };
  const activeTransporter = () => {
    setActiveTrans(true);
  };
  var arr1 = [];
  // changing unit type in table
  const getQuantity = (cropData, index1, mIndex, crop) => (e) => {
    let clonedArray = [...multiSelectPartnersArray];
    var cIndex = 0;
    var qSetting = settingsData.qtySetting;
    if (qSetting.length > 0) {
      cIndex = qSetting.findIndex((obj) => obj.cropId == crop.cropId);
      if (cIndex != -1) {
        qSetting[cIndex].qtyUnit = e.target.value;
      }
    } else {
      cIndex = -1;
    }
    let updatedItemList = cropData.map((item, i) => {
      if (i == index1) {
        arr1.push({ ...cropData[i], qtyUnit: e.target.value });
        if (cropData[i].cropName != "") {
          return {
            ...cropData[i],
            qtyUnit: e.target.value,
            rateType:
              defaultUnitTypeVal == "unit_kg"
                ? "KGS"
                : cIndex != -1
                ? getQuantityUnit(qSetting, cIndex)
                : e.target.value,
            qty:
              e.target.value == "LOADS" || e.target.value == "KGS"
                ? // ||
                  // e.target.value == "PIECES"
                  0
                : cropData[i].qty,
            weight:
              cropData[i].rateType.toUpperCase() == "RATE_PER_UNIT" ||
              cropData[i].rateType.toUpperCase() ==
                cropData[i].qtyUnit.toUpperCase()
                ? 0
                : cropData[i].weight,
          };
        } else {
          return {
            ...cropData[i],
          };
        }
      } else {
        return { ...cropData[i] };
      }
    });

    let clonedObject1 = { ...clonedArray[mIndex] };
    clonedObject1 = { ...clonedObject1, lineItems: updatedItemList };
    clonedArray[mIndex] = clonedObject1;
    // setMultiSelectPartnersArray(clonedArray);
    dispatch(multiSelectPartners(clonedArray));
  };

  // getting table based on unit type
  const setQuantityBasedtable = (unitType) => {
    var t = false;
    if (
      unitType?.toLowerCase() == "kgs" ||
      unitType?.toLowerCase() == "loads"
      // unitType?.toLowerCase() == "pieces"
    ) {
      t = true;
    }
    return t;
  };
  // rate change event
  const getRateType = (cropData, index, mIndex) => (e) => {
    let clonedArray = [...multiSelectPartnersArray];
    let updatedItemListRateType = cropData.map((item, i) => {
      if (i == index) {
        arr1.push({ ...cropData[i], rateType: e.target.value });
        return { ...cropData[i], rateType: e.target.value, weight: 0 };
      } else {
        return { ...cropData[i] };
      }
    });
    let clonedObject1 = { ...clonedArray[mIndex] };
    clonedObject1 = { ...clonedObject1, lineItems: updatedItemListRateType };
    clonedArray[mIndex] = clonedObject1;
    // setMultiSelectPartnersArray(clonedArray);
    dispatch(multiSelectPartners(clonedArray));
  };
  // reset input value to 0
  const resetInput = (e) => {
    if (e.target.value == 0) {
      e.target.value = "";
    }
  };
  // get quantity input value
  const getQuantityValue = (id, index, mIndex, cropitem) => (e) => {
    let clonedArray = [...multiSelectPartnersArray];
    var val = e.target.value
      .replace(/[^\d.]/g, "")
      .replace(/^(\d*)(\.\d{0,2})\d*$/, "$1$2")
      .replace(/(\.\d{0,2})\d*/, "$1")
      .replace(/(\.\d*)\./, "$1");
    let updatedItem = cropitem.map((item, i) => {
      if (i == index) {
        return { ...cropitem[i], qty: val };
      } else {
        return { ...cropitem[i] };
      }
    });

    let clonedObject1 = { ...clonedArray[mIndex] };
    clonedObject1 = { ...clonedObject1, lineItems: updatedItem };
    clonedArray[mIndex] = clonedObject1;
    // setMultiSelectPartnersArray(clonedArray);
    dispatch(multiSelectPartners(clonedArray));
  };
  // get weight value
  const getWeightValue = (id, index, mIndex, cropitem) => (e) => {
    let clonedArray = [...multiSelectPartnersArray];
    var val = e.target.value
      .replace(/[^\d.]/g, "")
      .replace(/^(\d*)(\.\d{0,2})\d*$/, "$1$2")
      .replace(/(\.\d{0,2})\d*/, "$1")
      .replace(/(\.\d*)\./, "$1");
    let updatedItem1 = cropitem.map((item, i) => {
      if (i == index) {
        return { ...cropitem[i], weight: val };
      } else {
        return { ...cropitem[i] };
      }
    });
    let clonedObject1 = { ...clonedArray[mIndex] };
    clonedObject1 = { ...clonedObject1, lineItems: updatedItem1 };
    clonedArray[mIndex] = clonedObject1;
    // setMultiSelectPartnersArray(clonedArray);
    dispatch(multiSelectPartners(clonedArray));
  };
  // get wastage value
  const getWastageValue = (id, index, mIndex, cropitem) => (e) => {
    let clonedArray = [...multiSelectPartnersArray];
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

    let updatedItem2 = cropitem.map((item, i) => {
      if (i == index) {
        return { ...cropitem[i], wastage: val };
      } else {
        return { ...cropitem[i] };
      }
    });
    let clonedObject1 = { ...clonedArray[mIndex] };
    clonedObject1 = { ...clonedObject1, lineItems: updatedItem2 };
    clonedArray[mIndex] = clonedObject1;
    // setMultiSelectPartnersArray(clonedArray);
    dispatch(multiSelectPartners(clonedArray));
  };
  // get rate value
  const getRateValue = (id, index, mIndex, cropitem) => (e) => {
    let clonedArray = [...multiSelectPartnersArray];
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
        return { ...cropitem[i] };
      }
    });
    let clonedObject1 = { ...clonedArray[mIndex] };
    clonedObject1 = { ...clonedObject1, lineItems: updatedItem3 };
    clonedArray[mIndex] = clonedObject1;
    // setMultiSelectPartnersArray(clonedArray);
    dispatch(multiSelectPartners(clonedArray));
    // getTotalValue(index,mIndex,cropitem)
  };

  // handle check event for bags and sacs
  const [showBagsModalStatus, setshowBagsModalStatus] = useState(false);
  const [showBagsModal, setShowBagsModal] = useState(false);
  const arrobject = [];
  const [ar, setArray] = useState([]);
  const [arIndex, setarIndex] = useState(0);
  const [arMainIndex, setarMainIndex] = useState(0);
  const [editBagsStatus, setEditBagsStatus] = useState(false);
  const handleCheckEvent = (crd, ink, mIndex, cr) => {
    let clonedArray = [...multiSelectPartnersArray];
    let updatedItem = crd.map((item, i) => {
      let ob = { ...crd[i] };
      if (i == ink) {
        setarIndex(ink);
        setarMainIndex(mIndex);
        Object.assign(ob, { unitValue: "" });
        // crd[i] = ob;
        arrobject.push(ob);
        setArray(arrobject);
        return { ...ob, checked: true };
      } else {
        return { ...ob };
      }
    });
    let clonedObject1 = { ...clonedArray[mIndex] };
    clonedObject1 = { ...clonedObject1, lineItems: updatedItem };
    clonedArray[mIndex] = clonedObject1;
    // setMultiSelectPartnersArray(clonedArray);
    dispatch(multiSelectPartners(clonedArray));
    setshowBagsModalStatus(true);
    setShowBagsModal(true);
    if (crd[ink].bags.length > 0) {
      setEditBagsStatus(true);
    }
  };
  //   gettinng inndividual bags data
  const callbackFunction = (childData, invArr, mIndex) => {
    let clonedArray = [...multiSelectPartnersArray];
    let objectArray = [...multiSelectPartnersArray[mIndex].lineItems];
    let updatedItems = objectArray.map((item, i) => {
      if (i == arIndex) {
        item = childData[0];
        return {
          ...objectArray[i],
          qty: parseInt(item.qty),
          wastage: item.wastage,
          weight: item.weight,
          bags: invArr,
        };
      } else {
        // cropResponseData([...cropData]);
        return { ...objectArray[i] };
      }
    });

    let clonedObject1 = { ...clonedArray[mIndex] };

    clonedObject1 = { ...clonedObject1, lineItems: updatedItems };
    clonedArray[mIndex] = clonedObject1;
    dispatch(multiSelectPartners(clonedArray));
  };
  const [cropDeletedList, setcropDeletedList] = useState([]);
  // delete crop
  const deleteCrop = (crop, cropArray, indexVal, cropInd) => {
    let clonedArray = [...multiSelectPartnersArray];
    var index = cropArray.indexOf(crop);
    const newArr = [...cropArray];

    if (index != -1) {
      let data = cropArray.map((item, i) => {
        if (Object.keys(cropArray[i]).length != 0) {
          console.log(i, cropInd, "index");
          if (i == cropInd) {
            {
              return {
                ...cropArray[i],
                cropDelete: true,
                status: 0,
                index: i,
              };
            }
          } else {
            // cropResponseData([...cropArray]);
            return { ...cropArray[i], cropDelete: false };
          }
        }
      });
      console.log(cropArray, data, "arra");
      // if (cropArray[index]?.weight != 0 && cropArray[index]?.rate != 0) {
      if (Object.keys(data[index]).length != 0) {
        setcropDeletedList([...cropDeletedList, cropArray[index]]);
        cropDeletedList.push(data[index]);
      }
      // }
      newArr.splice(index, 1);
      // cropArray.splice(index, 1);
    }
    // }

    // setUpdatedItemList([...cropArray, ...cropDeletedList]);
    console.log(newArr, "deleted");
    let clonedObject1 = { ...clonedArray[indexVal] };
    clonedObject1 = {
      ...clonedObject1,
      lineItems: newArr.length > 0 ? newArr : [{ cropName: "" }],
    };
    clonedArray[indexVal] = clonedObject1;
    // setMultiSelectPartnersArray(clonedArray);
    dispatch(multiSelectPartners(clonedArray));
    // cropResponseData([...cropArray]);
    // cropResponseData([...cropArray]);
    console.log(cropDeletedList, "deleted list");
    if (cropDeletedList?.length > 0) {
      setAllDeletedCrops(cropDeletedList);
    }
  };
  //   clone crop (copy crop) function
  const cloneCrop = (crop, cropsData, k, cropInd) => {
    let clonedArray = [...multiSelectPartnersArray];
    const updatedCropsData = [
      ...cropsData.slice(0, cropInd + 1),
      crop,
      ...cropsData.slice(cropInd + 1),
    ];
    let clonedObject1 = { ...clonedArray[k] };
    clonedObject1 = {
      ...clonedObject1,
      lineItems: updatedCropsData,
    };
    clonedArray[k] = clonedObject1;
    // setMultiSelectPartnersArray(clonedArray);
    dispatch(multiSelectPartners(clonedArray));
    // cropResponseData(updatedCropsData);
    // cropResponseData([...cropData, crop]);
  };
  const [addCropStatus, setAddCropStatus] = useState(false);
  const [addCropsIndex, setAddCropsIndex] = useState(0);
  const activeSearchCrop = (c, i, mainInd) => {
    let clonedArray = [...multiSelectPartnersArray];
    // setSelectedCropItem(null);
    setAddCropStatus(true);
    setAddCropsIndex(i);
    let updatedItem3 = c.map((item, j) => {
      if (j == i) {
        return {
          ...c[j],
          cropActive: false,
          displayStat: false,
          activeSearch: true,
          cropName: "",
        };
      } else {
        // cropResponseData([...c]);
        return { ...c[j] };
      }
    });
    // cropResponseData([...updatedItem3]);
    let clonedObject1 = { ...clonedArray[mainInd] };
    clonedObject1 = {
      ...clonedObject1,
      lineItems: updatedItem3,
    };
    clonedArray[mainInd] = clonedObject1;
    // setMultiSelectPartnersArray(clonedArray);
    dispatch(multiSelectPartners(clonedArray));
    Object.assign(c[i], { status: 0, cropDelete: true });
    // setOnFocusCrop(c[i]);
  };
  return (
    <div>
      <div className="main_div_padding">
        {multiSelectPartnersArray.length > 0 && (
          <table
            className="table-bordered step2_table table_view"
            id="scroll_style"
          >
            <tr>
              <th className="col_2">Seller</th>
              <th className="col_2">Transporter</th>
              <th className="col_1">Date</th>
              <th className="p-0 extra_border">
                <tr className="extra_border">
                  <th className="col_2">Crop</th>
                  <th className="col_1">Unit type</th>
                  <th className="col_1">Rate type</th>
                  <th className="col_1">Number of Units</th>
                  <th className="col_1">Total Weight</th>
                  <th className="col_1">individual weights</th>
                  <th className="col_1">Wastage</th>
                  <th className="col_1">Rate (₹)</th>
                  <th className="col_3">Total (₹)</th>
                </tr>
              </th>
            </tr>
            {multiSelectPartnersArray.map((item, index) => {
              return (
                <tr>
                  <td className="col_2">
                    <div id="scroll_style" onClick={activateSelect}>
                      {active ? (
                        <SelectSinglePartner indexVal={index} />
                      ) : (
                        <button>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                            className="justify-content-between"
                          >
                            <div className="d-flex">
                              {item.profilePic !== "" ? (
                                <img
                                  src={item.profilePic}
                                  className="icon_user"
                                />
                              ) : (
                                <img src={single_bill} className="icon_user" />
                              )}
                              <div
                                style={{ marginLeft: 5, alignItems: "center" }}
                              >
                                <div className="d-flex user_name">
                                  <h5 className="party_name">
                                    {fromMultiBillViewStatus
                                      ? partyType == "BUYER"
                                        ? getText(item.buyerName)
                                        : getText(item.farmerName)
                                      : getText(item.partyName)}
                                  </h5>
                                  <img
                                    src={down_arrow}
                                    alt="down_arrow"
                                    style={{ padding: "0px 10px" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="col_2">
                    {activeTrans ? (
                      <SelectSinglePartner indexVal={index} fromTrans={true} />
                    ) : (
                      <button className="p-0">
                        <div className="d-flex">
                          <p onClick={activeTransporter}>Select transporter</p>
                          <img
                            src={down_arrow}
                            alt="down_arrow"
                            style={{ padding: "0px 10px" }}
                          />
                        </div>
                      </button>
                    )}
                  </td>
                  <td className="col_1">
                    <DateSelection />
                  </td>
                  <td className="p-0 extra_border">
                    {multiSelectPartnersArray[index].lineItems.length > 0 &&
                      multiSelectPartnersArray[index].lineItems.map(
                        (crop, i) => {
                          return Object.keys(
                            multiSelectPartnersArray[index].lineItems[i]
                          ).length != 0 &&
                            multiSelectPartnersArray[index].lineItems[i]
                              .cropName != "" ? (
                            <tr className="extra_border">
                              <td className="col_2 ">
                                {!multiSelectPartnersArray[index].lineItems[i]
                                  .activeSearch ||
                                multiSelectPartnersArray[index].lineItems[i]
                                  .displayStat ? (
                                  // !activeSearch || displayStat?

                                  <div
                                    className="table_crop_div flex_class mr-0"
                                    onClick={() => {
                                      activeSearchCrop(
                                        multiSelectPartnersArray[index]
                                          .lineItems,
                                        i,
                                        index
                                      );
                                    }}
                                  >
                                    <img
                                      src={
                                        multiSelectPartnersArray[index]
                                          .lineItems[i].imageUrl
                                      }
                                      className="flex_class mr-2"
                                    />
                                    <p className="m-0">
                                      {
                                        multiSelectPartnersArray[index]
                                          .lineItems[i].cropName
                                      }
                                    </p>
                                  </div>
                                ) : addCropsIndex == index && addCropStatus ? (
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
                                      addCropToEmptyRow(
                                        event,
                                        i,
                                        index,
                                        multiSelectPartnersArray[index]
                                          .lineItems
                                      )
                                    }
                                    filterOption={filterOption}
                                    isClearable={false}
                                    noOptionsMessage={() => "No Data Available"}
                                    getOptionValue={(e) => e.cropId}
                                    getOptionLabel={(e) => (
                                      <div
                                        contenteditable="true"
                                        className="table_crop_div flex_class mr-0"
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
                              <td className="col_1">
                                <select
                                  className="form-control qty_dropdown dropdown"
                                  value={
                                    multiSelectPartnersArray[index].lineItems[i]
                                      .qtyUnit
                                  }
                                  onChange={getQuantity(
                                    multiSelectPartnersArray[index].lineItems,
                                    i,
                                    index,
                                    crop
                                  )}
                                >
                                  <option value="CRATES">Crates</option>
                                  <option value="BAGS">Bags</option>
                                  <option value="SACS">Sacs </option>
                                  <option value="BOXES">Boxes </option>
                                  <option value="KGS">Kgs </option>
                                  <option value="LOADS">Loads </option>
                                  <option value="PIECES">Pieces </option>
                                </select>
                              </td>
                              
                              {!setQuantityBasedtable(
                                multiSelectPartnersArray[index].lineItems[i]
                                  .qtyUnit
                              ) ? (
                                multiSelectPartnersArray[index].lineItems[
                                  i
                                ].qtyUnit.toLowerCase() == "pieces" ? (
                                  <td className="col_1 fadeOut_col">-</td>
                                ) : (
                                  <td className="col_1">
                                    <select
                                      className="form-control qty_dropdown dropdown pl-0 m-0"
                                      value={
                                        multiSelectPartnersArray[index]
                                          .lineItems[i].rateType
                                      }
                                      onChange={getRateType(
                                        multiSelectPartnersArray[index]
                                          .lineItems,
                                        i,
                                        index
                                      )}
                                    >
                                      <option
                                        value={
                                          multiSelectPartnersArray[index]
                                            .lineItems[i].qtyUnit
                                        }
                                      >
                                        {
                                          multiSelectPartnersArray[index]
                                            .lineItems[i].qtyUnit
                                        }{" "}
                                      </option>
                                      <option value="KGS"> Kg </option>
                                    </select>
                                  </td>
                                )
                              ) : (
                                <td className="col_1 fadeOut_col">-</td>
                              )}
                              {!setQuantityBasedtable(
                                multiSelectPartnersArray[index].lineItems[i]
                                  .qtyUnit
                              ) ? (
                                <td className="col_1">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="quantity"
                                    onFocus={(e) => resetInput(e)}
                                    value={
                                      multiSelectPartnersArray[index].lineItems[
                                        i
                                      ].qty
                                    }
                                    onChange={getQuantityValue(
                                      multiSelectPartnersArray[index].lineItems[
                                        i
                                      ].cropId,
                                      i,
                                      index,
                                      multiSelectPartnersArray[index].lineItems
                                    )}
                                  />
                                </td>
                              ) : (
                                <td className="col_1 fadeOut_col">-</td>
                              )}
                              {multiSelectPartnersArray[index].lineItems[
                                i
                              ].qtyUnit?.toLowerCase() !=
                              (multiSelectPartnersArray[index].lineItems[i]
                                .rateType == "RATE_PER_UNIT" ||
                              multiSelectPartnersArray[index].lineItems[
                                i
                              ].rateType?.toLowerCase() ==
                                multiSelectPartnersArray[index].lineItems[
                                  i
                                ].qtyUnit?.toLowerCase()
                                ? multiSelectPartnersArray[index].lineItems[
                                    i
                                  ].qtyUnit?.toLowerCase()
                                : multiSelectPartnersArray[index].lineItems[i]
                                    .rateType) ? (
                                multiSelectPartnersArray[index].lineItems[
                                  i
                                ].qtyUnit.toLowerCase() == "pieces" ? (
                                  <td className="col_1 fadeOut_col">-</td>
                                ) : (
                                  <td className="col_1">
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="weight"
                                      onFocus={(e) => resetInput(e)}
                                      value={
                                        multiSelectPartnersArray[index]
                                          .lineItems[i].weight
                                      }
                                      onChange={getWeightValue(
                                        multiSelectPartnersArray[index]
                                          .lineItems[i].cropId,
                                        i,
                                        index,
                                        multiSelectPartnersArray[index]
                                          .lineItems
                                      )}
                                    />
                                  </td>
                                )
                              ) : setQuantityBasedtable(
                                  multiSelectPartnersArray[index].lineItems[i]
                                    .qtyUnit
                                ) ? (
                                multiSelectPartnersArray[index].lineItems[
                                  i
                                ].qtyUnit.toLowerCase() == "pieces" ? (
                                  <td className="col_1 fadeOut_col">-</td>
                                ) : (
                                  <td className="col_1">
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="weight"
                                      onFocus={(e) => resetInput(e)}
                                      value={
                                        multiSelectPartnersArray[index]
                                          .lineItems[i].weight
                                      }
                                      onChange={getWeightValue(
                                        multiSelectPartnersArray[index]
                                          .lineItems[i].cropId,
                                        i,
                                        index,
                                        multiSelectPartnersArray[index]
                                          .lineItems
                                      )}
                                    />
                                  </td>
                                )
                              ) : (
                                <td className="col_1 fadeOut_col">-</td>
                              )}
                              {multiSelectPartnersArray[index].lineItems[
                                i
                              ].qtyUnit?.toLowerCase() === "bags" ||
                              multiSelectPartnersArray[index].lineItems[
                                i
                              ].qtyUnit?.toLowerCase() === "sacs" ? (
                                multiSelectPartnersArray[index].lineItems[
                                  i
                                ].qtyUnit?.toLowerCase() !=
                                multiSelectPartnersArray[index].lineItems[
                                  i
                                ].rateType.toLowerCase() ? (
                                  multiSelectPartnersArray[index].lineItems[
                                    i
                                  ].rateType.toUpperCase() !=
                                  "RATE_PER_UNIT" ? (
                                    <td className="col_1">
                                      <div className="d-flex align-items-center justify-content-center">
                                        <button
                                          onClick={() => {
                                            handleCheckEvent(
                                              multiSelectPartnersArray[index]
                                                .lineItems,
                                              i,
                                              index,
                                              crop
                                            );
                                          }}
                                        >
                                          <div className="d-flex align-items-center justify-content-center">
                                            <input
                                              type="checkbox"
                                              checked={
                                                // billEditStatus
                                                //   ? cropData[index].bags !==
                                                //       null &&
                                                //     cropData[index].bags
                                                //       .length > 0
                                                //     ? true
                                                //     : false
                                                //   :
                                                multiSelectPartnersArray[index]
                                                  .lineItems[i].checked
                                              }
                                              id="modal_checkbox"
                                              value="my-value"
                                              className="checkbox_t cursor_class"
                                              onChange={() => {
                                                handleCheckEvent(
                                                  multiSelectPartnersArray[
                                                    index
                                                  ].lineItems,
                                                  i,
                                                  index,
                                                  crop
                                                );
                                              }}
                                            />
                                            <div>
                                              {multiSelectPartnersArray[index]
                                                .lineItems[i].bags !== null &&
                                              multiSelectPartnersArray[index]
                                                .lineItems[i].bags.length >
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
                                    <td className="col_1 fadeOut_col">-</td>
                                  )
                                ) : (
                                  <td className="col_1 fadeOut_col">-</td>
                                )
                              ) : (
                                <td className="col_1 fadeOut_col">-</td>
                              )}
                              {multiSelectPartnersArray[index].lineItems[
                                i
                              ].qtyUnit?.toLowerCase() == "loads" ? (
                                <td className="col_1 fadeOut_col">-</td>
                              ) : (
                                <td className="col_1">
                                  {/* <p>hi</p> */}
                                  <input
                                    type="text"
                                    name="wastage"
                                    onFocus={(e) => resetInput(e)}
                                    className="form-control wastage_val"
                                    value={
                                      multiSelectPartnersArray[index].lineItems[
                                        i
                                      ].wastage
                                    }
                                    onChange={
                                      !multiSelectPartnersArray[index]
                                        .lineItems[i].checked
                                        ? getWastageValue(
                                            multiSelectPartnersArray[index]
                                              .lineItems[i].cropId,
                                            i,
                                            index,
                                            multiSelectPartnersArray[index]
                                              .lineItems
                                          )
                                        : ""
                                    }
                                  />
                                </td>
                              )}
                              <td className="col_1">
                                <input
                                  type="text"
                                  name="rate"
                                  className="form-control"
                                  onFocus={(e) => resetInput(e)}
                                  value={
                                    multiSelectPartnersArray[index].lineItems[i]
                                      .rate
                                  }
                                  onChange={getRateValue(
                                    multiSelectPartnersArray[index].lineItems[i]
                                      .cropId,
                                    i,
                                    index,
                                    multiSelectPartnersArray[index].lineItems
                                  )}
                                />
                              </td>
                              <td className="col_3">
                                <div className="d-flex align-items-center justify-content-between">
                                  <p className="totals">
                                    {multiSelectPartnersArray[index].lineItems[
                                      i
                                    ].rateType.toLowerCase() == "kgs" ||
                                    multiSelectPartnersArray[index].lineItems[
                                      i
                                    ].rateType.toLowerCase() == "loads" ||
                                    // multiSelectPartnersArray[index].lineItems[
                                    //   i
                                    // ].rateType.toLowerCase() == "pieces" ||
                                    // (multiSelectPartnersArray[index].lineItems[
                                    //   i
                                    // ].qtyUnit.toLowerCase() == "pieces" &&
                                    //   multiSelectPartnersArray[index].lineItems[
                                    //     i
                                    //   ].rateType.toUpperCase() ==
                                    //     "RATE_PER_UNIT") ||
                                    (multiSelectPartnersArray[index].lineItems[
                                      i
                                    ].qtyUnit.toLowerCase() == "loads" &&
                                      multiSelectPartnersArray[index].lineItems[
                                        i
                                      ].rateType.toUpperCase() ==
                                        "RATE_PER_UNIT")
                                      ? multiSelectPartnersArray[
                                          index
                                        ].lineItems[i].qtyUnit.toLowerCase() ==
                                        "pieces"
                                        ? (
                                            (multiSelectPartnersArray[index]
                                              .lineItems[i].qty -
                                              multiSelectPartnersArray[index]
                                                .lineItems[i].wastage) *
                                            multiSelectPartnersArray[index]
                                              .lineItems[i].rate
                                          ).toFixed(2)
                                        : (
                                            (multiSelectPartnersArray[index]
                                              .lineItems[i].weight -
                                              multiSelectPartnersArray[index]
                                                .lineItems[i].wastage) *
                                            multiSelectPartnersArray[index]
                                              .lineItems[i].rate
                                          ).toFixed(2)
                                      : (
                                          (multiSelectPartnersArray[index]
                                            .lineItems[i].qty -
                                            multiSelectPartnersArray[index]
                                              .lineItems[i].wastage) *
                                          multiSelectPartnersArray[index]
                                            .lineItems[i].rate
                                        ).toFixed(2)}
                                  </p>
                                  <div className="d-flex">
                                    <button
                                      className="flex_class mr-0 sub_icons_div"
                                      onClick={cloneCrop.bind(
                                        this,
                                        crop,
                                        multiSelectPartnersArray[index]
                                          .lineItems,
                                        index,
                                        i
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
                                        multiSelectPartnersArray[index]
                                          .lineItems,
                                        index,
                                        i
                                      )}
                                    >
                                      <img
                                        src={delete_icon}
                                        className="sub_icons"
                                        alt="image"
                                      />
                                    </button>
                                  </div>
                                  <button
                                    onClick={() =>
                                      addCrop(
                                        item,
                                        fromMultiBillViewStatus
                                          ? partyType == "BUYER"
                                            ? item.buyerId
                                            : item.farmerId
                                          : item.partyId
                                      )
                                    }
                                    className="add_crop_text2"
                                  >
                                    +Add crop
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            <tr className="extra_border">
                              <td className="col_2 ">
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
                                    addCropToEmptyRow(
                                      event,
                                      i,
                                      index,
                                      multiSelectPartnersArray[index].lineItems
                                    )
                                  }
                                  filterOption={filterOption}
                                  isClearable={false}
                                  noOptionsMessage={() => "No Data Available"}
                                  getOptionValue={(e) => e.cropId}
                                  getOptionLabel={(e) => (
                                    <div
                                      contenteditable="true"
                                      className="table_crop_div flex_class mr-0"
                                    >
                                      <img
                                        src={e.imageUrl}
                                        className="flex_class mr-2"
                                      />
                                      <p className="m-0">{e.cropName}</p>
                                    </div>
                                  )}
                                />
                              </td>
                              <td className="col_1"></td>
                              <td className="col_1"></td>
                              <td className="col_1"></td>
                              <td className="col_1"></td>
                              <td className="col_1"></td>
                              <td className="col_1"></td>
                              <td className="col_1"></td>
                              <td className="col_3">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="d-flex">
                                    <button
                                      className="flex_class mr-0 sub_icons_div"
                                      onClick={cloneCrop.bind(
                                        this,
                                        crop,
                                        multiSelectPartnersArray[index]
                                          .lineItems,
                                        index,
                                        i
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
                                        multiSelectPartnersArray[index]
                                          .lineItems,
                                        index,
                                        i
                                      )}
                                    >
                                      <img
                                        src={delete_icon}
                                        className="sub_icons"
                                        alt="image"
                                      />
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => addCrop(item, item.partyId)}
                                    className="add_crop_text2"
                                  >
                                    +Add crop
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )}
                  </td>
                </tr>
              );
            })}
          </table>
        )}
      </div>
      <div className="bottom_div">
        <div className="d-flex align-items-center justify-content-between">
          <button className="secondary_btn" onClick={cancelStep}>
            cancel
          </button>
          <div className="d-flex align-items-center">
            <button
              className="secondary_btn no_delete_btn"
              onClick={() => previousStep()}
            >
              Previous
            </button>
            <button
              className="primary_btn"
              onClick={() => onClickStep2(multiSelectPartnersArray)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {showBagsModalStatus ? (
        <SelectBags
          show={showBagsModal}
          closeBagsModal={() => setShowBagsModal(false)}
          cropsArray={ar}
          parentCallback={callbackFunction}
          cropIndex={arIndex}
          editBagsStatus={editBagsStatus}
          partyIndex={arMainIndex}
          fromStep2MultiBags={true}
        />
      ) : (
        ""
      )}
      <ToastContainer />
    </div>
  );
};
export default Step2;
