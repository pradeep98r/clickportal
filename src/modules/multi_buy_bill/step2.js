import { useDispatch, useSelector } from "react-redux";
import {
  cropInfoByLineItem,
  multiSelectPartners,
  multiStepsVal,
} from "../../reducers/multiBillSteps";
import BillDateSelection from "../buy_bill_book/billDateSelection";
import SelectPartner from "../buy_bill_book/selectParty";
import DatePicker from "react-datepicker";
import "../multi_buy_bill/step2.scss";
import "react-datepicker/dist/react-datepicker.css";
import date_icon from "../../assets/images/date_icon.svg";
import { useEffect, useState } from "react";
import DateSelection from "./dateSelection";
import { getPartnerType, getQuantityUnit, getText, getUnitVal } from "../../components/getText";
import { getMaskedMobileNumber } from "../../components/getCurrencyNumber";
import single_bill from "../../assets/images/bills/single_bill.svg";
import "../multi_buy_bill/step1.scss";
import SelectSinglePartner from "./selectSinglePartner";
import down_arrow from "../../assets/images/down_arrow.svg";
import Select from "react-select";
import { getAllCrops } from "../../actions/billCreationService";
const Step2 = (props) => {
  const dispatch = useDispatch();
  const selectedStep = useSelector((state) => state.multiStepsInfo);
  const partnersArray = selectedStep?.multiSelectPartners;
  const[multiSelectPartnersArray, setMultiSelectPartnersArray] = useState(partnersArray);
  const [selectedDate, setStartDate] = useState(new Date());
  const allTransporters = selectedStep?.selectedTransporter;
  const allDates = selectedStep?.selectedDates;
  const cropInfoByLineItemArray = selectedStep?.cropInfoByLineItem;
  // console.log(multiSelectPartnersArray);
  const [allData, setAllData] = useState([]);
  const [cropsData, setCropsData] = useState(allData);
  const settingsData = JSON.parse(localStorage.getItem("systemSettingsData"));
  const [defaultUnitTypeVal, setDefaultUnitTypeVal] = useState("");
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
  const onClickStep2 = () => {
    dispatch(multiStepsVal("step2"));
  };
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

  },[]);
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
          qtyUnit: cIndex != -1 ? getUnitVal(qSetting, cIndex) : "crates",
          rateType:
            defaultUnitTypeVal == "unit_kg"
              ? "kgs"
              : cIndex != -1
              ? getUnitVal(qSetting, cIndex)
              : "crates",
        });
      });
      setCropsData(response.data.data);
      setAllData(response.data.data);
    });
  };
  const addCrop = (item,id) => {
    var crpObject = {};
    var i = multiSelectPartnersArray.findIndex((obj) => obj.partyId == id);
   
    if( i != -1){
      let clonedArray = [...multiSelectPartnersArray];
      let clonedObject = { ...clonedArray[i] };
      let updatedLineItems = [...clonedObject.lineItems, crpObject];
      clonedObject = { ...clonedObject, lineItems: updatedLineItems };
      clonedArray[i] = clonedObject;
      setMultiSelectPartnersArray(clonedArray);
    }

  };
  const addCropToEmptyRow = (crop, i,data) => {
    var c = data;
    let updatedItem3 = c.map((item, j) => {
      console.log(c,j,i)
      if (j == i) {
        // setSelectedCropItem(crop);
        // setcropDeletedList([...cropDeletedList, onFocusCrop]);
        // cropDeletedList.push(onFocusCrop);
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
          rateType:'kgs',
            // defaultUnitTypeVal == "unit_kg"
            //   ? "kgs"
            //   : cIndex != -1
            //   ? getUnitVal(qSetting, cIndex)
            //   : "crates",
          rate: 0,
          total: 0,
          qtyUnit: cIndex != -1 ? getUnitVal(qSetting, cIndex) : "crates",
          checked: false,
          bags: [],
          count: 1,
          status: 1,
          activeSearch: true,
        };
      } else {
        // cropResponseData([...c]);
        return { ...c[j] };
      }
    });
    var index1 = updatedItem3.findIndex((obj) => obj.cropId == crop.cropId);
    if (index1 != -1) {
    } else {
      Object.assign(crop, { count: 1 });
      const new_obj = { ...crop, cropActive: true };
      // updatedItem4.push(new_obj);
    }
    let clonedArray = [...multiSelectPartnersArray];
      let clonedObject = { ...clonedArray[i] };
      clonedObject = { ...clonedObject, lineItems: updatedItem3 };
      clonedArray[i] = clonedObject;
      setMultiSelectPartnersArray(clonedArray);
      console.log(clonedArray)
  // multiSelectPartnersArray[i].lineItems = updatedItem3;
    // setAddCropStatus(false);
    // cropResponseData([...updatedItem3]);
    // setUpdatedItemList([...updatedItem3, ...cropDeletedList]);
    // console.log(cropDeletedList, updatedItem3, cropDeletedList.length);
    // if (cropDeletedList?.length > 0) {
    //   console.log(onFocusCrop, cropDeletedList);
    //   setAllDeletedCrops(cropDeletedList);
    // }
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
  const getQuantity = (cropData, index1, crop) => (e) => {
    // cropData[index1].rateType = "kgs";
    let clonedArray = [...multiSelectPartnersArray];
    var cIndex = 0;
    var qSetting = settingsData.qtySetting;
    if (qSetting.length > 0) {
      cIndex = qSetting.findIndex((obj) => obj.cropId == crop.cropId);
      if(cIndex != -1){
        qSetting[cIndex].qtyUnit = e.target.value
      }
    } else {
      cIndex = -1;
    }
    console.log(cropData,index1)
    let updatedItemList = cropData.map((item, i) => {
      if (i == index1) {
        console.log('selected')
        arr1.push({ ...cropData[i], qtyUnit: e.target.value });
        return { ...cropData[i], qtyUnit: e.target.value,rateType:
          defaultUnitTypeVal == "unit_kg"
            ? "kgs"
            : (cIndex != -1
            ? getQuantityUnit(qSetting, cIndex)
            : e.target.value), };
      } else {
        console.log('other')
        let clonedObject = { ...clonedArray[i] };
        clonedObject = { ...clonedObject, lineItems: cropData };
        clonedArray[i] = clonedObject;
        // setMultiSelectPartnersArray(clonedArray);
        setMultiSelectPartnersArray([...clonedArray]);
        return { ...cropData[i] };
      }
    });
    console.log(clonedArray,updatedItemList,index1)
    let clonedObject1 = { ...clonedArray[index1] };
        clonedObject1 = { ...clonedObject1, lineItems: updatedItemList };
        clonedArray[index1] = clonedObject1;
    setMultiSelectPartnersArray(clonedArray);
    // setMultiSelectPartnersArray([...updatedItemList]);
    // setUpdatedItemList([...updatedItemList]);
  };

  // getting table based on unit type
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
  // rate change event
  const getRateType = (cropData, index) => (e) => {
    // cropData[index].rateType = e.target.value;
    let clonedArray = [...multiSelectPartnersArray];
    let updatedItemListRateType = cropData.map((item, i) => {
      if (i == index) {
        arr1.push({ ...cropData[i], rateType: e.target.value });
        return { ...cropData[i], rateType: e.target.value, weight: 0 };
      } else {
        // cropResponseData([...cropData]);
        return { ...cropData[i] };
      }
    });
    console.log(updatedItemListRateType);
    let clonedObject1 = { ...clonedArray[index] };
        clonedObject1 = { ...clonedObject1, lineItems: updatedItemListRateType };
        clonedArray[index] = clonedObject1;
    setMultiSelectPartnersArray(clonedArray);
    // cropResponseData([...updatedItemListRateType]);
    // setUpdatedItemList([...updatedItemListRateType]);
  };
  return (
    <div>
      <div className="main_div_padding">
        {multiSelectPartnersArray.length > 0 && (
          <table className="table-bordered step2_table">
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
                                  {getText(item.partyName)}
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
                      )}
                    </div>
                  </td>
                  <td className="col_2">
                    {activeTrans ? (
                      <SelectSinglePartner indexVal={index} fromTrans={true} />
                    ) : (
                      <div className="d-flex">
                        <p onClick={activeTransporter}>Select transporter</p>
                        <img
                          src={down_arrow}
                          alt="down_arrow"
                          style={{ padding: "0px 10px" }}
                        />
                      </div>
                    )}
                  </td>
                  <td className="col_1">
                    <DateSelection indexVal={index} />
                  </td>
                  <td className="p-0 extra_border">
                    {multiSelectPartnersArray[index].lineItems.length > 0 &&
                      multiSelectPartnersArray[index].lineItems.map(
                        (crop, i) => {
                          return Object.keys(
                            multiSelectPartnersArray[index].lineItems[i]
                          ).length != 0 ? (
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
                                      addCropToEmptyRow(event, index, multiSelectPartnersArray[index].lineItems)
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
                              <td className="col_1">
                              <select
                                    className="form-control qty_dropdown dropdown"
                                    value={ multiSelectPartnersArray[index].lineItems[i].qtyUnit}
                                    onChange={getQuantity(
                                      multiSelectPartnersArray[index].lineItems,
                                      i,
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
                                  multiSelectPartnersArray[index].lineItems[i].qtyUnit
                                ) ? (
                                  <td className="col_1">
                                    <select
                                      className="form-control qty_dropdown dropdown pl-0 m-0"
                                      value={multiSelectPartnersArray[index].lineItems[i].rateType}
                                      onChange={getRateType(multiSelectPartnersArray[index].lineItems, index)}
                                    >
                                      <option
                                        value={multiSelectPartnersArray[index].lineItems[i].qtyUnit?.toLowerCase()}
                                      >
                                        {multiSelectPartnersArray[index].lineItems[i].qtyUnit}{" "}
                                      </option>
                                      <option value="kgs"> Kg </option>
                                    </select>
                                  </td>
                                ) : (
                                  <td className="col-1 fadeOut_col">-</td>
                                )}
                              <td className="col_1"></td>
                              <td className="col_1"></td>
                              <td className="col_1"></td>
                              <td className="col_1"></td>
                              <td className="col_1"></td>
                              <td className="col_3">
                                <button
                                  onClick={() => addCrop(item, item.partyId)}
                                >
                                  Add crop
                                </button>
                              </td>
                            </tr>
                          ) : (
                            "hi"
                          );
                        }
                      )}
                  </td>
                  {/* <td className="p-0 extra_border_padding">
                    <tr>
                      <td className="col_2">asdfasdf</td>
                      <td className="col_1">asdfasdf</td>
                      <td className="col_1">asdfasdf</td>
                      <td className="col_1">asdfasdf</td>
                      <td className="col_1">asdfasdf</td>
                      <td className="col_1">asdfasdf</td>
                      <td className="col_1">asdfasdf</td>
                      <td className="col_1">asdfasdf</td>
                      <td className="col_3">asdfasdf</td>
                    </tr>
                  </td> */}
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
            <button className="primary_btn" onClick={() => onClickStep2()}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Step2;
