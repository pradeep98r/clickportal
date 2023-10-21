import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  customDetailedAvances,
  getAdvancesSummaryById,
} from "../../actions/advancesService";
import "../../modules/advances/selectedOptions.scss";
import {
  advanceDataInfo,
  advanceSummaryById,
  allAdvancesData,
  dateFormat,
  selectPartnerOption,
  selectedAdvanceId,
  selectedPartyByAdvanceId,
  totalAdvancesValById,
  totalCollectedById,
  totalGivenById,
} from "../../reducers/advanceSlice";
import moment from "moment";
import { allCustomTabs, beginDate,closeDate } from "../../reducers/ledgerSummarySlice";
import { dateCustomStatus } from "../../reducers/billEditItemSlice";
const colourStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: "#9e9e9e",
    height: "38px",
    padding: "0px 10px",
    alignItems: "center",
  }),
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
const SelectOptions = () => {
  const options = [
    { value: "all", label: "All" },
    { value: "sellers", label: "Sellers" },
    { value: "buyers", label: "Buyers" },
    { value: "transporters", label: "Transporters" },
  ];

  const advancesData = useSelector((state) => state.advanceInfo);
  const advancesArray = advancesData?.advanceDataInfo;
  const [partnerArray, setPartnerArray] = useState(advancesArray);
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const tabClick = useSelector((state) => state.ledgerSummaryInfo);
  const fromDate = moment(tabClick?.beginDate).format("YYYY-MM-DD");
  const toDate = moment(tabClick?.closeDate).format("YYYY-MM-DD");
  const allCustomTab = tabClick?.allCustomTabs;
  var optionChangeStatus = false;
//   const [optionChangeStatus, setOptionChangeStatus] = useState(false);
  const dispatch = useDispatch();
  const getSelectedOption = (label) => {
    onClickEvent(label);
  };

  function handleChange(option) {
    optionChangeStatus = true;
    onClickEvent(option.label);
    dispatch(selectPartnerOption(option.label))
    dispatch(allCustomTabs('all'))
    console.log('handle channge',fromDate,toDate)
    dispatch(dateCustomStatus(true));
    dispatch(beginDate(moment(new Date()).format("YYYY-MM-DD")))
    dispatch(closeDate(moment(new Date()).format("YYYY-MM-DD")))
  }
  const onClickEvent = (label) => {
    if (label == "Sellers") {
      const filterArray = partnerArray.filter(
        (item) => item?.partyType?.toUpperCase() == "FARMER"
      );
      if (optionChangeStatus) {
      getDetails(filterArray);
      }
    }else if (label == "Buyers") {
      const filterArray = partnerArray.filter(
        (item) => item?.partyType?.toUpperCase() == "BUYER"
      );
      console.log(filterArray,'buyer array after selectig')
      if (optionChangeStatus) {
      getDetails(filterArray);
      }
    } 
    else if (label == "Transporters") {
      const filterArray = partnerArray.filter(
        (item) => item?.partyType?.toUpperCase() == "TRANSPORTER"
      );
      console.log(filterArray,'trans array after selectig')
      if (optionChangeStatus) {
      getDetails(filterArray);
      }
    } else if (label == "All") {
      if (optionChangeStatus) {
        getDetails(partnerArray);
      }
    }
  };
  const getDetails = (array) => {
    // dispatch(allAdvancesData(array))
    dispatch(advanceDataInfo(array));
    if(array.length > 0){
    dispatch(selectedAdvanceId(array[0].partyId));
    dispatch(selectedPartyByAdvanceId(array[0]));
    console.log(array,allCustomTab,'get details')
    if (allCustomTab == "all") {
      getAdvanceSummary(array[0].partyId);
    } else {
      getCustomDetailedAdvances(array[0].partyId);
    }
    }
  };
  const getAdvanceSummary = (id) => {
    getAdvancesSummaryById(clickId, id)
      .then((res) => {
        if (res.data.status.type === "SUCCESS") {
          if (res.data.data != null) {
            dispatch(advanceSummaryById(res.data.data.advances));
            dispatch(totalAdvancesValById(res.data.data.totalAdvBal));
            dispatch(totalCollectedById(res.data.data.totalCollectedAdv));
            dispatch(totalGivenById(res.data.data.totalGivenAdv))
          } else {
            dispatch(advanceSummaryById([]));
          }
        }
      })
      .catch((error) => console.log(error));
  };
  const getCustomDetailedAdvances = (id) => {
    customDetailedAvances(clickId, id, fromDate, toDate)
      .then((res) => {
        if (res.data.status.type == "SUCCESS") {
          if (res.data.data != null) {
            dispatch(advanceSummaryById(res.data.data.advances));
            dispatch(totalAdvancesValById(res.data.data.totalAdvBal));
            dispatch(totalCollectedById(res.data.data.totalCollectedAdv));
            dispatch(totalGivenById(res.data.data.totalGivenAdv))
          } else {
            dispatch(advanceSummaryById([]));
          }
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="">
      <Select
        defaultValue={options[0]}
        isSearchable={false}
        className="basic-single select-options"
        classNamePrefix="select"
        styles={colourStyles}
        options={options}
        onChange={handleChange}
        hideSelectedOptions={false}
        getOptionValue={(e) => e.value}
        getOptionLabel={(e) => (
          <div
            style={{ display: "flex", alignItems: "center" }}
            onClick={() => getSelectedOption(e.label)}
          >
            <span className="label_font">{e.label}</span>
          </div>
        )}
      />
    </div>
  );
};

export default SelectOptions;
