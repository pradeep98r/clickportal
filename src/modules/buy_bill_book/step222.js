import { useSelector, useDispatch } from "react-redux";
import { selectBuyer } from "../../reducers/buyerSlice";
import { selectSteps } from "../../reducers/stepsSlice";
import "../../modules/buy_bill_book/step2.scss";
import other_crop from "../../assets/images/other_crop.svg";
import { useState, useEffect } from "react";
import { getPreferredCrops } from "../../actions/billCreationService";
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
  let [cropData, cropResponseData] = useState(array);
  const [cropInfoModal, setCropInfoModal] = useState(false);
  const [cropInfoModalStatus, setCropInfoModalStatus] = useState(false);
  const [cropId, setCropId] = useState(0);
  const [updatedItemList, setUpdatedItemList] = useState([]);
  const [showStep3Modal, setShowStep3Modal] = useState(false);
  const [showStep3ModalStatus, setShowStep3ModalStatus] = useState(false);
  const [showStep3SellModal, setShowStep3SellModal] = useState(false);
  const [showStep3SellModalStatus, setShowStep3SellModalStatus] =
    useState(false);
  const [quantityValue, setunitValue] = useState();
  const [wastagesValue, setwastageValue] = useState();
  const [rateDefaultValue, setrateValue] = useState();
  const [weightDefaultValue, setweightValue] = useState();

  const date =
    billEditItemInfo.selectedBillDate !== null
      ? billEditItemInfo.selectedBillDate
      : new Date();

  var cropObjectArr = [];
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
      { qtyUnit: "Crates" }
    );
    cropResponseData([...cropData, preferedCrops[index2]]);
    newArray.push(preferedCrops[index2]);
    console.log(updatedItemList,"croponclick")
    setUpdatedItemList([...updatedItemList, ...newArray]);
    // localStorage.setItem('lineItemsEdit',JSON.stringify(newArray));
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
  //   fetching preferred crops data
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
            { id: 0 }
          );
          var index1 = preferedCropsData.findIndex(
            (obj) => obj.cropId == response.data.data[index].cropId
          );
          if (index1 != -1) {
            response.data.data.splice(index, 1);
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
    dispatch(billViewStatus(billEditStatus));
    fetchData();
    var lineIt = [];
    var a = [];
    if (cropTableEditStatus) {
      if (billEditStatus) {
        for (var d = 0; d < cropObjectArr.length; d++) {
          let object = { ...cropObjectArr[d] };
         
          console.log(
            cropObjectArr,
            props.slectedCrops.length,
            billEditItemInfo?.step2CropEditStatus,
            // cropObjectArr[1].rateType,
            "ifffffcond",
            d
          );
          if (
            cropObjectArr[d].rateType === "RATE_PER_KG" ||
            cropObjectArr[d].rateType === "kgs"
          ) {
            object = { ...object, rateType: "kgs" };
            a.push(object);
            if (cropObjectArr[d].qtyUnit == "") {
              cropObjectArr.splice(d, 1);
              a.splice(d,1)
            }
          } else {
            object = { ...object, qtyUnit: cropObjectArr[d].qtyUnit };
            a.push(object);
          }
          
        }
        console.log(a, cropObjectArr);
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
      console.log(cropArr)
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
            { status: 1 }
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
            { status: 1 }
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
            { id: 0 }
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
  const addStep3Modal = () => {
    for (var k = 0; k < cropData.length; k++) {
      if (cropData[k].rateType == "kgs") {
        cropData[k].total =
          (cropData[k].weight - cropData[k].wastage) * cropData[k].rate;
      } else {
        cropData[k].total =
          (cropData[k].qty - cropData[k].wastage) * cropData[k].rate;
      }
    }
    var h = [];
    // if (cropData.length > 0) {
    cropData.map((item, index) => {
      if (cropData[index].rate != 0) {
        // setUpdatedItemList(cropData);
        console.log(updatedItemList,"deleted")
        if (users.buyerInfo?.itemtype.toLowerCase() == "seller") {
          setShowStep3ModalStatus(true);
          setShowStep3Modal(true);
        } else if (users.buyerInfo?.itemtype.toLowerCase() == "buyer") {
          setShowStep3SellModal(true);
          setShowStep3SellModalStatus(true);
        }
        localStorage.setItem("lineItemsEdit", JSON.stringify(cropData));
        if (billEditStatus) {
          var lineitem = billEditStatus
            ? props.cropEditObject.lineItems
            : JSON.parse(localStorage.getItem("lineItemsEdit"));
          //   var index1 = lineitem.findIndex(
          //     (obj) => obj.cropId == item.cropId//cropData[index].cropId
          //   );
          var index1 = lineitem.findIndex(
            (obj) => obj.cropId == cropData[index].cropId
          );
          if (index1 == index) {
            if (lineitem[index1].id == 0) {
              console.log("id0");
              cropData[index].status = 1;
            } else {
              console.log("id updated");
              cropData[index].status = 2;
            }
          } else {
            if (index1 != -1) {
              if (lineitem[index1].id == 0) {
                console.log("id0else");
                cropData[index].status = 1;
              } else {
                console.log("id updatedelse");
                cropData[index].status = 2;
              }
              console.log("idnewelse");
              return null;
            } else {
              cropData[index].status = 1;
            }
            // cropData[index].status = 1;
          }
        }
      }
    });
    // var selectedArray = props.billEditStatus ? ;
    if (billEditStatus) {
      console.log("innerarray", updatedItemList,cropData);
      dArray = updatedItemList.length != 0 ? updatedItemList : cropData;
      // props.slectedCropstableArray.lineItems =
      //   updatedItemList.length != 0 ? updatedItemList : cropData;
    }
    if (h.length > 0) {
      var h1 = h.map((item, index) => {
        if (h[index] != null) {
          if (h.length == cropData.length) {
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
        // Object.assign(cropData[index], { status: 1 });
        if (
          cropData[index].qtyUnit.toLowerCase() === "loads" ||
          cropData[index].qtyUnit.toLowerCase() === "pieces"
        ) {
          if (cropData[index].weight == 0) {
            toast.error("Please enter weight", {
              toastId: "error2",
            });
            return null;
          } else if (cropData[index].rate == 0) {
            toast.error("Please enter rate", {
              toastId: "error3",
            });
            return null;
          }
        } else if (cropData[index].qtyUnit.toLowerCase() === "kgs") {
          if (cropData[index].weight == 0) {
            toast.error("Please enter weight", {
              toastId: "error2",
            });
            return null;
          } else if (cropData[index].rate == 0) {
            toast.error("Please enter rate", {
              toastId: "error3",
            });
            return null;
          }
        } else if (
          cropData[index].qtyUnit.toLowerCase() ===
          cropData[index].rateType.toLowerCase()
        ) {
          if (cropData[index].qty == 0) {
            toast.error("Please enter Quantity", {
              toastId: "error1",
            });
            return null;
          } else if (cropData[index].rate == 0) {
            toast.error("Please enter rate", {
              toastId: "error3",
            });
            return null;
          }
        }
        // else if(cropData[index].rate == 0){
        //   toast.error('Please enter rate', {
        //     toastId: "error3"
        //   });
        //   return null;
        // }
        else if (
          cropData[index].qty == 0 &&
          !setQuantityBasedtable(cropData[index].qtyUnit)
        ) {
          toast.error("Please enter Quantity", {
            toastId: "error1",
          });
          return null;
        } else if (cropData[index].weight == 0) {
          // if(cropData[index].rateType != 'RATE_PER_UNIT'){
          toast.error("Please enter weight", {
            toastId: "error2",
          });
          // }

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
        }
      }
      for (var k = 0; k < cropData.length; k++) {
        arrays.push(cropData[k]);
      }
      if (arrays.length === cropData.length) {
        addStep3Modal();
        dispatch(selectSteps("step3"));
        console.log(dArray, cropData);
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
      unitType.toLowerCase() == "kgs" ||
      unitType.toLowerCase() == "loads" ||
      unitType == "pieces"
    ) {
      t = true;
    }
    return t;
  };
  //   getting quantiy and rate values from dropdowns
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
  //   getting input values(quantity,weight,wastage,rate) from input fields
  var arr = [];
  const getQuantityValue = (id, index, cropitem) => (e) => {
    var val = e.target.value.replace(/\D/g, "");
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
    if(updatedItemList.length > 0){
      for(var j= 0; j<updatedItemList.length; j++){
        if(updatedItemList[j].status == 0){
          console.log(updatedItemList[j],updatedItem,"status0");
          updatedItem.push(updatedItemList[j]);
        }
      }
    }
    console.log(updatedItem)
    setUpdatedItemList([...updatedItem]);
    setCropId(id);
  };
  const getWeightValue = (id, index, cropitem) => (e) => {
    var val = e.target.value.replace(/\D/g, "");
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
    var val = e.target.value.replace(/[^0-9.]/g, "");
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
    var val = e.target.value.replace(/\D/g, "");
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
    console.log(updatedItemList,updatedItem3,"listttt")
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
  var cropDeletedList = [];
  const deleteCrop = (crop, cropArray) => {
    var index = cropArray.indexOf(crop);
    var list = preferedCropsData;
    if (index != -1) {
      Object.assign(cropArray[index], { status: 0 });
      cropArray[index].total = 0;
      cropArray[index].qty = 0;
      cropArray[index].qtyUnit = "";
      //   if(billEditStatus){
      cropDeletedList.push(cropArray[index]);
      //   }
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
    console.log(cropArray,cropDeletedList,"deleted list")
    setUpdatedItemList([...cropArray, ...cropDeletedList]);
    cropResponseData([...cropArray]);
  };
  //   getting individual bags popup function
  const [showBagsModalStatus, setshowBagsModalStatus] = useState(false);
  const [showBagsModal, setShowBagsModal] = useState(false);
  const arrobject = [];
  const [ar, setArray] = useState([]);
  const [arIndex, setarIndex] = useState(0);
  const [editBagsStatus, setEditBagsStatus] = useState(false);
  const handleCheckEvent = (crd, ink, cr) => {
    localStorage.setItem("bagsChecked", true);
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
  var invbagsChecked = localStorage.getItem("bagsChecked");
  return (
    <div>
      <div className="main_div_padding">
        <h4 className="smartboard_main_header">Select crop and creat bill</h4>
        <div className="d-flex">
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
                    <img
                      src={crop.imageUrl}
                      className="flex_class cropImg mx-auto "
                    />
                    <p>{crop.cropName}</p>
                  </div>
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
                                  (cropData[index].rateType == "RATE_PER_UNIT"
                                    ? cropData[index].qtyUnit.toLowerCase()
                                    : cropData[index].rateType) ? (
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

                                  <th>Rate(₹)</th>
                                  <th>Total(₹)</th>
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
                                      onFocus={(e) => resetInput(e)}
                                      value={cropData[index].qty}
                                      onChange={getQuantityValue(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    />
                                  </td>
                                  {cropData[index].qtyUnit.toLowerCase() !=
                                  (cropData[index].rateType == "RATE_PER_UNIT"
                                    ? cropData[index].qtyUnit.toLowerCase()
                                    : cropData[index].rateType) ? (
                                    <td className="col-2">
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
                                          <p className="unit-type mt-0">
                                            {cropData[index].bags !== null &&
                                            cropData[index].bags.length > 0
                                              ? "Edit"
                                              : "Add"}{" "}
                                            {cropData[index].qtyUnit}
                                          </p>
                                          <input
                                            type="checkbox"
                                            checked={
                                              invbagsChecked
                                                ? true
                                                : cropData[index].checked
                                            }
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
                                      onFocus={(e) => resetInput(e)}
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
                                      onFocus={(e) => resetInput(e)}
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
                                  {cropData[index].qtyUnit?.toLowerCase() ==
                                  "loads" ? (
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
                                      onFocus={(e) => resetInput(e)}
                                      value={cropData[index].weight}
                                      onChange={getWeightValue(
                                        cropData[index].cropId,
                                        index,
                                        cropData
                                      )}
                                    />
                                  </td>
                                  {cropData[index].qtyUnit?.toLowerCase() ==
                                  "loads" ? (
                                    ""
                                  ) : (
                                    <td className="col-2">
                                      {" "}
                                      <input
                                        type="text"
                                        name="wastage"
                                        onFocus={(e) => resetInput(e)}
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
                                      onFocus={(e) => resetInput(e)}
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
                                      {cropData[index].qtyUnit?.toLowerCase() ==
                                      "loads"
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
        <div className="d-flex align-items-center justify-content-end">
          <button className="secondary_btn" onClick={() => previousStep()}>
            Previous
          </button>
          <button className="primary_btn" onClick={() => step2Next()}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
export default Step22;
