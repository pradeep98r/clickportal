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
var array = [];
const Step22 = (props) => {
  const users = useSelector((state) => state.buyerInfo);
  const dispatch = useDispatch();
  const transusers = useSelector((state) => state.transInfo);
  const billEditItemInfo = useSelector((state) => state.billEditItemInfo);
  const billEditStatus = billEditItemInfo?.billEditStatus;
  const cropTableEditStatus = billEditItemInfo?.cropTableEditStatus;

  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const clientId = loginData.authKeys.clientId;
  const clientSecret = loginData.authKeys.clientSecret;
  let [preferedCropsData, setPreferedCropsData] = useState([]);
  
  const maintainCrop = localStorage.getItem('maintainCrops');
  let [cropData, cropResponseData] = useState(maintainCrop?[]:array);
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
  const activeSearchCrop = (c, i) => {
    setAddCropStatus(true);
    fetchCropData();
    setAddCropsIndex(i);
    let index = cropData.findIndex((obj) => obj.cropId == c[i].cropId);
    if (index !== -1) {
      c[index].activeSearch = true;
      c[index].displayStat = false;
      c[index].cropActive = false;
    }
    c.slice(index, 1, c[index]);
    cropResponseData([...c]);
  };
  const fetchCropData = () => {
    getAllCrops().then((response) => {
      response.data.data.map((item) => {
        Object.assign(item, { cropSelect: "" });
      });
      setCropsData(response.data.data);
      setAllData(response.data.data);
    });
  };
  const [displayStat, setDisplayStat] = useState(false);
  const handleAddCropStatus = (index) => {
    setAddCropStatus(true);
    fetchCropData();
  };

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
  const previousStep = () => {
    dispatch(selectBuyer(users.buyerInfo));
    dispatch(selectSteps("step1"));
    dispatch(billDate(date));
    for (var i = 0; i < updatedItemList.length; i++) {
      if (updatedItemList[i].status == 0) {
        updatedItemList.splice(i, 1);
      }
    }
    dispatch(fromBillbook(false));
    localStorage.setItem("lineItemsEdit", JSON.stringify(updatedItemList));
    dispatch(tableEditStatus(true));
  };
  //   click on particular crop function
  var newArray = [];
  const cropOnclick = (crop, id, index2, preferedCrops) => {
    Object.assign(
      crop,
      { wastage: 0 },
      { qty: 0 },
      { rateType: "kgs" },
      { weight: 0 },
      { rate: 0 },
      { total: 0 },
      { bags: [] },
      { status: 1 },
      { qtyUnit: "Crates" },
      { activeSearch: false },
      { displayStat: false },
      { cropDelete: false }
    );
    
    cropResponseData([...cropData, preferedCrops[index2]]);
    newArray.push(preferedCrops[index2]);
    setUpdatedItemList([...updatedItemList, ...newArray]);
    // localStorage.setItem('lineItemsEdit',JSON.stringify(newArray));
    if (crop.cropId === id) {
      crop.count = crop.count + 1;
      crop.cropActive = true;
    } else {
      console.log(crop, "else");
    }
  };

  //   getting all crops popup when click on other crop
  const allCropData = () => {
    setCropInfoModalStatus(true);
    setCropInfoModal(true);
  };
  //   fetching preferred crops data
  // const fetchData = () => {
  //   getPreferredCrops(clickId, clientId, clientSecret)
  //     .then((response) => {
  //       const newData = response.data.data.map((item) => {
  //         return {
  //           ...item,
  //           count: 0,
  //           cropActive: false,
  //           qtyUnit: "Crates",
  //           weight: 0,
  //           rate: 0,
  //           total: 0,
  //           wastage: 0,
  //           qty: 0,
  //           status: 1,
  //           id: 0,
  //           cropDelete: false
  //         };
  //       });
  //       const existingIds = preferedCropsData.map((item) => item.cropId);
  //       const filteredData = newData.filter((item) => !existingIds.includes(item.cropId));
  //       setPreferedCropsData((prevState) => [...prevState, ...filteredData]);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  
  const fetchData = () => {
    getPreferredCrops(clickId, clientId, clientSecret)
      .then((response) => {
        response.data.data.map((item, index) => {
          Object.assign(
            item,
            { count: 0 },
            { cropActive: false },
            { qtyUnit: "Crates" },
            { weight: 0 },
            { rate: 0 },
            { total: 0 },
            { wastage: 0 },
            { qty: 0 },
            { status: 1 },
            { id: 0 },
            { cropDelete: false }
          );
          var index1 = preferedCropsData.findIndex(
            (obj) => obj.cropId == response.data.data[index].cropId
          );
          if (index1 != -1) {
            response.data.data.splice(index, 1);
            Object.assign(
              response.data.data[index],
              { count: 0 },
              { cropActive: false },
              { qtyUnit: "Crates" },
              { weight: 0 },
              { rate: 0 },
              { total: 0 },
              { wastage: 0 },
              { qty: 0 },
              { status: 1 },
              { id: 0 },
              { cropDelete: false }
            );
          }
        });
        setPreferedCropsData([...preferedCropsData, ...response.data.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //   to get crop data oon refresh
  useEffect(() => {
    dispatch(cropEditStatus(billEditStatus ? true : false));

    cropObjectArr = billEditStatus
      ? billEditItemInfo?.step2CropEditStatus
        ? props.slectedCrops
        : props.cropEditObject.lineItems
      : props.cropEditObject;
      console.log(cropObjectArr,cropTableEditStatus)
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
            // if (cropObjectArr[d].qtyUnit == "") {
            //   cropObjectArr.splice(d, 1);
            //   a.splice(d, 1);
            // }
          } else {
            object = { ...object, qtyUnit: cropObjectArr[d].qtyUnit };
            a.push(object);
          }
        }
        cropResponseData([...a]);
      } else {
        console.log("Came to here0")
        if (!billEditItemInfo?.fromBillBook) {
          lineIt = JSON.parse(localStorage.getItem("lineItemsEdit"));
        }
        if (lineIt != null) {
          console.log(lineIt)
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
            { cropDelete: false }
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
            { qtyUnit: "crates" },
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
            { rateType: "kgs" },
            { weight: 0 },
            { rate: 0 },
            { total: 0 },
            { qtyUnit: "crates" },
            { checked: false },
            { bags: [] },
            { status: 1 },
            { id: 0 },
            { cropDelete: false }
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
    console.log(cropData,allDeletedCrops,updatedItemList,'add')
    // cropResponseData(updatedItemList);
    var cropInfo = billEditStatus ? cropData.concat(allDeletedCrops) : cropData;
    for (var k = 0; k < cropInfo.length; k++) {
      if (cropInfo[k].rateType == "kgs") {
        cropInfo[k].total =
          (cropInfo[k].weight - cropInfo[k].wastage) * cropInfo[k].rate;
      } else {
        cropInfo[k].total =
          (cropInfo[k].qty - cropInfo[k].wastage) * cropInfo[k].rate;
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
          //   var index1 = lineitem.findIndex(
          //     (obj) => obj.cropId == item.cropId//cropData[index].cropId
          //   );
          var index1 = lineitem.findIndex(
            (obj) => obj.cropId == cropInfo[index].cropId
          );
          console.log(index,index1,cropInfo,"indexes")
          if (index1 == index) {
            if(cropInfo[index1]?.cropDelete){
              console.log("yes",lineitem[index1].id,index1)
              cropInfo[index].status = 0;
            } else if(lineitem[index1].id == 0){
              console.log("yes1",lineitem[index1].id,index1)
              cropInfo[index].status = 1;
            } else {
              console.log("yes2",lineitem[index1].id,index1)
              cropInfo[index].status = 2;
            }


            // if (!(cropInfo[index1]?.cropDelete)) {
            // } else {
            //   console.log("yes",lineitem[index1].id,index1)
            //   cropInfo[index].status = 0;
            // }
            // if (lineitem[index1].id == 0) {
            //   console.log("yes1",lineitem[index1].id,index1)
            //   cropInfo[index].status = 1;
            // } else {
            //   console.log("yes2",lineitem[index1].id,index1)
            //   cropInfo[index].status = 2;
            // }
          } else {
            if (index1 != -1) {
              if (!cropInfo[index].cropDelete) {
                if (lineitem[index1].id == 0) {
                  cropInfo[index].status = 1;
                } else {
                  cropInfo[index].status = 2;
                }
              }else{
                console.log("came to here111")
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
            // cropData[index].status = 1;
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
    // var selectedArray = props.billEditStatus ? ;
    if (billEditStatus) {
      dArray = updatedItemList.length != 0 ? updatedItemList.concat(allDeletedCrops) : cropInfo;
      console.log(dArray)
    }

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
        if (data.cropDelete) continue;
        const qtyUnit = data.qtyUnit?.toLowerCase();
        const rateType = data.rateType?.toLowerCase();
        if (['loads', 'pieces'].includes(qtyUnit)) {
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
          } else if(parseInt(data.weight) <= parseInt(data.wastage)){
            toast.error("wastage is always less than weight", {
              toastId: "error3",
            });
            return null;
          }
        } else if (qtyUnit === 'kgs') {
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
        } else if (!setQuantityBasedtable(qtyUnit) && data.rateType?.toUpperCase() !== "RATE_PER_UNIT") {
          if (data.qty == 0) {
            toast.error("Please enter Quantity", {
              toastId: "error1",
            });
            return null;
          }
          else if (data.weight == 0 && !billEditStatus) {
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
      for (var k = 0; k < cropData.length; k++) {
        arrays.push(cropData[k]);
      }

      if (arrays.length === cropData.length) {
        addStep3Modal();
        dispatch(selectSteps("step3"));
        console.log(cropData,dArray,"Data")
        props.parentcall(
          dArray.length != 0 ? dArray : cropData,
          billEditStatus
        );
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

  //Allow to enter deciaml values
  const handleInputValueEvent = (e) => {
    $("input").keypress(function (e) {
      var a = [];
      var k = e.which;
      if (e.charCode === 46) {
        // if dot is the first symbol
        if (e.target.value.length === 0) {
          e.preventDefault();
          return;
        }

        // if there are dots already
        if (e.target.value.indexOf(".") !== -1) {
          e.preventDefault();
          return;
        }

        a.push(e.charCode);
      }
      for (var i = 48; i < 58; i++) a.push(i);
      if (!($.inArray(k, a) >= 0)) e.preventDefault();
    });
  };
  //   getting quantiy and rate values from dropdowns
  var arr1 = [];
  const getQuantity = (cropData, index1, crop) => (e) => {
    cropData[index1].rateType = "kgs";
    let updatedItemList = cropData.map((item, i) => {
      if (i == index1) {
        arr1.push({ ...cropData[i], qtyUnit: e.target.value, qty: 0 });
        return { ...cropData[i], qtyUnit: e.target.value, qty: 0 };
      } else {
        cropResponseData([...cropData]);
        return { ...cropData[i] };
      }
    });
    cropResponseData([...updatedItemList]);
    setUpdatedItemList([...updatedItemList]);
  };
  const getRateType = (cropData, index) => (e) => {
    // cropData[index].rateType = e.target.value;
    let updatedItemListRateType = cropData.map((item, i) => {
      if (i == index) {
        arr1.push({ ...cropData[i], rateType: e.target.value });
        return { ...cropData[i], rateType: e.target.value};
      } else {
        cropResponseData([...cropData]);
        return { ...cropData[i] };
      }
    });
    cropResponseData([...updatedItemListRateType]);
    setUpdatedItemList([...updatedItemListRateType]);
  };
  //   getting input values(quantity,weight,wastage,rate) from input fields
  var arr = [];
  const getQuantityValue = (id, index, cropitem) => (e) => {
      handleInputValueEvent(e)
      var val = e.target.value;
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
    handleInputValueEvent(e)
    var val = e.target.value;
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
  const getWastageValue = (id, index, cropitem) => (e) => {
    console.log(cropData[index].bags , billEditStatus,"Yeah")
    if(cropitem[index].rateType.toUpperCase().toUpperCase() == cropitem[index].qtyUnit.toUpperCase()){
      handleInputValueEvent(e)
      var val = e.target.value  
    } else{
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
    cropResponseData([...updatedItem2]);
    setwastageValue(val);
    setUpdatedItemList([...updatedItem2]);
    setCropId(id);
  };
  const getRateValue = (id, index, cropitem) => (e) => {
    handleInputValueEvent(e)
    var val = e.target.value
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
    if (billEditStatus) {
      // props.slectedCropstableArray.lineItems = updatedItem3;
    }
  };

  //   clone crop (copy crop) function
  const cloneCrop = (crop) => {  
    var list = preferedCropsData;
    var index = list.findIndex((obj) => obj.cropId == crop.cropId);
    if (index != -1) {  
      list[index].count += 1;
    }
    cropResponseData([...cropData, crop]);
  };
  // delete crop funnction
  var dummyList = [];
  var arrylist = [];
  // var cropDeletedList = [];
  const [cropDeletedList, setcropDeletedList] = useState([]);
  const deleteCrop = (crop, cropArray, indexVal) => {
    console.log(indexVal,"val")
    

    var index = cropArray.indexOf(crop);
    var list = preferedCropsData;
    // var index = cropArray.findIndex((obj,i) => cropArray[i].cropId == cropArray[indexVal].cropId);
    // console.log(index,indexVal)
    // for (var i = 0; i < cropArray.length; i++) {
      if (index != -1) {
        let data = cropArray.map((item, i)=>{
          if(i == indexVal){
            return{
              ...cropArray[i],cropDelete : true, status:0, index: i
            }
          }else {
              cropResponseData([...cropArray]);
              return { ...cropArray[i] };
            }
        })
        // Object.assign(cropArray[index], { status: 0, index:  index});
        // cropArray[index].total = 0;
        // cropArray[index].qty = 0;
        // cropArray[index].qtyUnit = "";
        // cropArray[index].cropDelete = true;
        setcropDeletedList([...cropDeletedList, cropArray[index]]);
        cropDeletedList.push(cropArray[index]);
        cropArray.splice(index, 1);
        var index1 = list.findIndex((obj) => obj.cropId == crop.cropId);
        if (index1 != -1) {
          list[index1].count -= 1;
          if (list[index1].count == 0) {
            if (billEditStatus) {
              list.splice(index1, 1);
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
    console.log(cropArray, cropDeletedList);
    setUpdatedItemList([...cropArray, ...cropDeletedList]);
    cropResponseData([...cropArray]);
    // cropResponseData([...cropArray]);
    setAllDeletedCrops(cropDeletedList);
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
        setArray([...arrobject]);
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
  const [addCrop, setAddCrop] = useState(false);
  const [getCropItem, setCropItem] = useState(false);
  const addCropRow = () => {
    setAddCrop(true);
    setCropItem(true);
    setSearchValue("");
    // setAddCropStatus(true);
    setAddCropsIndex(cropData.length);
    setDisplayStat(false);
    setActiveSearch(true);
    var crpObject = {};
    cropArraynew.push(crpObject);
    cropResponseData([...cropData, ...cropArraynew]);
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
    setCropsData(result);
    setSearchValue(value);
  };
  var arrayAdded = {};
  const addCropToEmptyRow = (crop, c, i) => {
    console.log(crop, c);
    let updatedItem3 = c.map((item, j) => {
      if (j == i) {
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
          rateType: "kgs",
          rate: 0,
          total: 0,
          qtyUnit: "crates",
          checked: false,
          bags: [],
          count: 1,
          status: 1,
          activeSearch: true,
        };
      } else {
        cropResponseData([...c]);
        return { ...c[j] };
      }
    });

    let updatedItem4 = preferedCropsData.map((item, j) => {
      if (item.cropId == crop.cropId) {
        var countadded = preferedCropsData[j].count + 1;
        return { ...preferedCropsData[j], count: countadded, cropActive: true };
      } else {
        // arrayAdded.push(crop);
        // arrayAdded = preferedCropsData[j];
        setPreferedCropsData([...preferedCropsData]);
        return { ...preferedCropsData[j] };
      }
    });
    var index1 = updatedItem4.findIndex((obj) => obj.cropId == crop.cropId);
    if (index1 != -1) {
    } else {
      // var c = crop.count + 1;
      Object.assign(crop, { count: 1 });
      const new_obj = { ...crop, cropActive: true };
      console.log(new_obj);
      updatedItem4.push(new_obj);
    }
    var index2 = updatedItem4.findIndex((obj) => obj.cropId == c.cropId);
    if (index2 != -1) {
      console.log("same");
    } else {
      console.log("different");
    }
    console.log(updatedItem4);
    setAddCropStatus(false);
    cropResponseData([...updatedItem3]);
    setUpdatedItemList([...updatedItem3]);
    setPreferedCropsData([...updatedItem4]);
    setCropItem(false);
  };

  return (
    <div>
      <div className="main_div_padding">
        <h4 className="smartboard_main_header">Select crop and create bill</h4>
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
                   
                    <div className="cropImgDiv">
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
                    </div>
                    
                    <p>{crop.cropName}</p>
                  </div>
              ))}
            </div>
          )}
          <div
            className="text-center crop_div other_Crop"
            onClick={() => allCropData()}
          >
            <img src={other_crop} />
            <p>Other Crop</p>
          </div>
        </div>
        <div >
          <div className="row p-0 mt-2">
            {cropData.length > 0 && (
              <div className="p-0 w-100">
                <h4 className="smartboard_main_header">Crop Information</h4>
                <div className="crop_table" id="scroll_style">
                  <div className="row header_row p-0 crop_table_header_row">
                    <div className="col-lg-2">
                      <p>Crop</p>
                    </div>
                    <div className="col-lg-1">
                      <p>Unit type</p>
                    </div>
                    <div className="col-lg-1">
                      <p>Rate type
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
                      <div>
                        {addCropsIndex == index && addCropStatus ? (
                          // addCropStatus ?
                          <div className="add-cropsdiv" id="scroll_style">
                            {cropsData.map((item) => {
                              return (
                                <div>
                                  <div
                                    className="flex_class mr-0"
                                    id="crops-space"
                                    onClick={() => {
                                      addCropToEmptyRow(item, cropData, index);
                                    }}
                                  >
                                    <img
                                      src={item.imageUrl}
                                      className="flex_class mr-2"
                                    />
                                    <p className="m-0">{item.cropName}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
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

                                      <div
                                        contenteditable="true"
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
                                    ) : cropData[index].activeSearch ||
                                      addCrop ? (
                                      <input
                                        // value={}
                                        placeholder="Crop Name Here"
                                        contenteditable="true"
                                        onClick={() => {
                                          handleAddCropStatus(index);
                                        }}
                                        onChange={(event) => {
                                          handleSearch(event);
                                        }}
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
                                        className=
                                        "form-control qty_dropdown dropdown pl-0 m-0"
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
                                  (cropData[index].rateType == "RATE_PER_UNIT"
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
                                    cropData[index].qtyUnit?.toLowerCase() ==
                                    "loads" ? (
                                      <td className="col-1 fadeOut_col">-</td>
                                    ) : (
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
                                    )
                                  ) : (
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
                                          <input
                                            type="checkbox"
                                            checked={
                                              billEditStatus
                                                ? cropData[index].bags !==
                                                    null &&
                                                  cropData[index].bags.length >
                                                    0
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
                                          {cropData[index].bags !== null &&
                                          cropData[index].bags.length > 0 ? (
                                            <label
                                              className="unit-type my-0 cursor_class"
                                              for="modal_checkbox"
                                            >
                                              Edit
                                            </label>
                                          ) : (
                                            ""
                                          )}{" "}
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
                                        onChange={!(cropData[index].checked)
                                          ?getWastageValue(
                                          cropData[index].cropId,
                                          index,
                                          cropData
                                        ):''}
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
                                        {cropData[index].rateType == "kgs"
                                          ? ((cropData[index].weight -
                                              cropData[index].wastage) *
                                            cropData[index].rate).toFixed(2)
                                          : ((cropData[index].qty -
                                              cropData[index].wastage) *
                                            cropData[index].rate).toFixed(2)}
                                      </p>
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
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              // ) 
                              // : (
                              //   ""
                              // )
                            ) : (
                              <tr className="empty_row">
                                <td className="col-2">
                                  {/* <div role="search"
                                onClick={handleAddCropStatus}
                                >
                                
                                </div> */}
                                  <input
                                    id="searchInput"
                                    value={searchValue}
                                    onClick={handleAddCropStatus}
                                    onChange={(event) => {
                                      handleSearch(event);
                                    }}
                                    // value={searchTerm}
                                    // onChange={handleChange}
                                  />
                                </td>
                                <td className="col-1"></td>
                                <td className="col-1"></td>
                                <td className="col-1"></td>
                                <td className="col-1"></td>
                                <td className="col-1"></td>
                                <td className="col-1"></td>
                                <td className="col-1"></td>
                                <td className="col-3"></td>
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
