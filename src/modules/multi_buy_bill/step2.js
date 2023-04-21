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
import { getPartnerType, getText, getUnitVal } from "../../components/getText";
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
  const multiSelectPartnersArray = selectedStep?.multiSelectPartners;
  const [selectedDate, setStartDate] = useState(new Date());
  const allTransporters = selectedStep?.selectedTransporter;
  const allDates = selectedStep?.selectedDates;
  console.log(allDates, "trans");
  const cropInfoByLineItemArray = selectedStep?.cropInfoByLineItem;
  console.log(multiSelectPartnersArray);
  const [allData, setAllData] = useState([]);
  const [cropsData, setCropsData] = useState(allData);
  const settingsData = JSON.parse(localStorage.getItem("systemSettingsData"));
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
          rateType:"kgs"
            // defaultUnitTypeVal == "unit_kg"
            //   ? "kgs"
            //   : cIndex != -1
            //   ? getUnitVal(qSetting, cIndex)
            //   : "crates",
        });
      });
      setCropsData(response.data.data);
      setAllData(response.data.data);
    });
  };
  const [status, setStatus] = useState(false);
  var cropArraynew = [];
  const addCrop = (item, id) => {
    var crpObject = {};
    var i = multiSelectPartnersArray.findIndex((obj) => obj.partyId == id);

    if (i != -1) {
      let clonedObject = { ...multiSelectPartnersArray[i] };
      // let objects={...clonedObject};
      // objects.lineItems=[...objects.lineItems, crpObject]
      // console.log(multiSelectPartnersArray,objects);
      let updatedLineItems =[...clonedObject.lineItems,crpObject];
      clonedObject={...clonedObject, lineItems:updatedLineItems};
      console.log(clonedObject,"obj")
      multiSelectPartnersArray[i] = clonedObject;
      console.log(multiSelectPartnersArray);
    }
    // cropResponseData([...cropData, ...cropArraynew]);
  };
  const addCropToEmptyRow = (crop, i) => {
    console.log(crop)
    var c = cropInfoByLineItemArray;
    let updatedItem3 = c.map((item, j) => {
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
   
  console.log(updatedItem3,'crops')
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
  console.log(multiSelectPartnersArray, "array");
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
                              <td className="col_2">
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
                              </td>
                              <td className="col_1"></td>
                              <td className="col_1"></td>
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
