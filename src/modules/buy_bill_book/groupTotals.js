import React from "react";
import { getCurrencyNumberWithSymbol } from "../../components/getCurrencyNumber";
import { useEffect } from "react";
import { useState } from "react";
import {
  getDefaultSystemSettings,
  getOutstandingBal,
  getSystemSettings,
} from "../../actions/billCreationService";
import { useDispatch, useSelector } from "react-redux";
import ono_connect_click from "../../assets/images/ono-click-connect.svg";
import { colorAdjustBg, getText } from "../../components/getText";
import moment from "moment";
import {
  allGroupsSettings,
  groupFourSettings,
  groupOneSettings,
  groupThreeSettings,
  groupTwoSettings,
  groupOneTotals,
  groupTwoTotals,
  groupThreeTotals,
  groupFourTotals,
  filtereArray,
  allSettings,
  selectedTotalBillAmount,
} from "../../reducers/billViewDisplaySlice";
import { map } from "jquery";

const GroupTotals = (props) => {
  var groupOneTotal = 0;
  var groupTwoTotal = 0;
  var groupThreeTotal = 0;
  var groupFourTotal = 0;

  var allGroupsTotal = 0;
  const dispatch = useDispatch();
  const billViewData = useSelector((state) => state.billViewInfo);
  const [billData, setBillViewData] = useState(billViewData.billViewInfo);
  const billSettings = useSelector((state) => state.mandiDetails);
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const clientId = loginData.authKeys.clientId;
  const clientSecret = loginData.authKeys.clientSecret;
  const [billSettingResponse, billSettingData] = useState([]);
  const theme = localStorage.getItem("pdftheme");
  const pdfThemeData = theme != null ? theme : null;
  const colorThemeVal = billViewData?.colorthemeValue;
  var groupOne = [];
  var grouptwo = [];
  var groupthree = [];
  var groupfour = [];
  const [groupone, setGroupOne] = useState([]);
  const [groupTwo, setGroupTwo] = useState([]);
  const [groupThree, setGroupThree] = useState([]);
  const [groupFour, setGroupFour] = useState([]);

  const [allGroups, setAllGroups] = useState([]);

  const [includeComm, setIncludeComm] = useState("");
  const [includeRetComm, setIncludeRetComm] = useState("");
  const [addRetComm, setAddRetComm] = useState(false);
  const [status, setStatus] = useState(false);
  const [isShown, setisShown] = useState(false);
  const [sArray, SetSysArray] = useState([]);
  var ldsValue = false;
  const [lpk, setLPK] = useState(false);
  var filterArray = billSettings?.filtereArray;
  const [outBalAdvance, setOutBalAdvance] = useState(0);
  useEffect(() => {
    getBuyBillsById();
    setBillViewData(JSON.parse(localStorage.getItem("billData")));
    var pId =
      billData?.partyType == "BUYER" ? billData?.buyerId : billData?.farmerId;
    getOutstandingBal(clickId, pId).then((res) => {
      setOutBalAdvance(res.data.data == null ? 0 : res.data.data.advance);
    });
    var h = [];
    for (var c = 0; c < billData.lineItems.length; c++) {
      var cropArrays = billData.lineItems;
      if (
        cropArrays[c].qtyUnit.toLowerCase() == "kgs" ||
        cropArrays[c].qtyUnit.toLowerCase() == "loads" ||
        cropArrays[c].qtyUnit.toLowerCase() == "pieces"
      ) {
        h.push(cropArrays[c]);
      } else if (cropArrays[c].qtyUnit == "") {
        h.push(cropArrays[c]);
      }
    }
    if (cropArrays.length == h.length) {
      ldsValue = true;
      setLPK(true);
    } else {
      ldsValue = false;
      setLPK(false);
    }
  }, [props]);
  const getBuyBillsById = () => {
    var res;
    var billType = "";
    getSystemSettings(clickId, clientId, clientSecret).then((res) => {
      if (res.data.data.billSetting.length > 0) {
        billSettingData(res.data.data.billSetting);
        if (
          billData?.partyType.toUpperCase() === "FARMER" ||
          billData?.partyType.toUpperCase() === "SELLER"
        ) {
          billType = "BUY";
        } else {
          billType = "SELL";
        }
        var filteredArray = res.data.data.billSetting.filter((object) => {
          return object.billType === billType && object.formStatus === 1;
        });
        filteredArray.sort((a, b) => a.groupId - b.groupId);
        dispatch(filtereArray(filteredArray));
        groupSettingsToJson();
        if (filteredArray.length > 0) {
          for (var i = 0; i < res.data.data.billSetting.length; i++) {
            if (
              billData?.partyType.toUpperCase() === "FARMER" ||
              billData?.partyType.toUpperCase() === "SELLER"
            ) {
              if (
                res.data.data.billSetting[i].groupId === 1 &&
                res.data.data.billSetting[i].billType === "BUY" &&
                res.data.data.billSetting[i].formStatus === 1
              ) {
                // filteredArray = res.data.data.billSetting;
                // setFilterArray([...filterArray,res.data.data.billSetting[i]])
                if (res.data.data.billSetting[i].settingName === "COMMISSION") {
                  setIncludeComm(
                    res.data.data.billSetting[i].includeInLedger == 1
                      ? true
                      : false
                  );
                  setisShown(
                    res.data.data.billSetting[i].isShown == 1 ? true : false
                  );
                  if (!res.data.data.billSetting[i].isShown) {
                    setStatus(true);
                  }
                }
                if (
                  res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE"
                ) {
                  setStatus(true);
                } else if (
                  res.data.data.billSetting[i].settingName ===
                  "RETURN_COMMISSION"
                ) {
                  setAddRetComm(
                    res.data.data.billSetting[i].addToGt == 1 ? false : true
                  );
                  setIncludeRetComm(
                    res.data.data.billSetting[i].includeInLedger == 1
                      ? true
                      : false
                  );
                }
                groupOne = [res.data.data.billSetting[i], ...groupOne];
                dispatch(groupOneSettings(groupOne));
                setGroupOne([groupone, ...groupOne]);
              } else if (
                res.data.data.billSetting[i].groupId === 2 &&
                res.data.data.billSetting[i].billType === "BUY" &&
                res.data.data.billSetting[i].formStatus === 1
              ) {
                if (
                  res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE"
                ) {
                  setStatus(true);
                }
                if (res.data.data.billSetting[i].settingName === "COMMISSION") {
                  setIncludeComm(
                    res.data.data.billSetting[i].includeInLedger == 1
                      ? true
                      : false
                  );
                  setisShown(
                    res.data.data.billSetting[i].isShown == 1 ? true : false
                  );
                  if (!res.data.data.billSetting[i].isShown) {
                    setStatus(true);
                  }
                } else if (
                  res.data.data.billSetting[i].settingName ===
                  "RETURN_COMMISSION"
                ) {
                  setAddRetComm(
                    res.data.data.billSetting[i].addToGt == 1 ? false : true
                  );
                  setIncludeRetComm(
                    res.data.data.billSetting[i].includeInLedger == 1
                      ? true
                      : false
                  );
                }
                grouptwo = [res.data.data.billSetting[i], ...grouptwo];
                dispatch(groupTwoSettings(grouptwo));
                setGroupTwo([groupTwo, ...grouptwo]);
              } else if (
                res.data.data.billSetting[i].groupId === 3 &&
                res.data.data.billSetting[i].billType === "BUY" &&
                res.data.data.billSetting[i].formStatus === 1
              ) {
                if (
                  res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE"
                ) {
                  setStatus(true);
                }
                if (res.data.data.billSetting[i].settingName === "COMMISSION") {
                  setIncludeComm(
                    res.data.data.billSetting[i].includeInLedger == 1
                      ? true
                      : false
                  );
                  setisShown(
                    res.data.data.billSetting[i].isShown == 1 ? true : false
                  );
                  if (!res.data.data.billSetting[i].isShown) {
                    setStatus(true);
                  }
                } else if (
                  res.data.data.billSetting[i].settingName ===
                  "RETURN_COMMISSION"
                ) {
                  setAddRetComm(
                    res.data.data.billSetting[i].addToGt == 1 ? false : true
                  );
                  setIncludeRetComm(
                    res.data.data.billSetting[i].includeInLedger == 1
                      ? true
                      : false
                  );
                }
                groupthree = [res.data.data.billSetting[i], ...groupthree];
                dispatch(groupThreeSettings(groupthree));
                setGroupThree([groupThree, ...groupthree]);
              } else if (
                res.data.data.billSetting[i].groupId === 4 &&
                res.data.data.billSetting[i].billType === "BUY" &&
                res.data.data.billSetting[i].formStatus === 1
              ) {
                if (
                  res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE"
                ) {
                  setStatus(true);
                }
                if (res.data.data.billSetting[i].settingName === "COMMISSION") {
                  setIncludeComm(
                    res.data.data.billSetting[i].includeInLedger == 1
                      ? true
                      : false
                  );
                  setisShown(
                    res.data.data.billSetting[i].isShown == 1 ? true : false
                  );
                  if (!res.data.data.billSetting[i].isShown) {
                    setStatus(true);
                  }
                } else if (
                  res.data.data.billSetting[i].settingName ===
                  "RETURN_COMMISSION"
                ) {
                  setAddRetComm(
                    res.data.data.billSetting[i].addToGt == 1 ? false : true
                  );
                  setIncludeRetComm(
                    res.data.data.billSetting[i].includeInLedger == 1
                      ? true
                      : false
                  );
                }
                groupfour = [res.data.data.billSetting[i], ...groupfour];
                dispatch(groupFourSettings(groupfour));
                setGroupFour([groupFour, ...groupfour]);
              }
            } else {
              if (
                res.data.data.billSetting[i].groupId === 1 &&
                res.data.data.billSetting[i].billType === "SELL" &&
                res.data.data.billSetting[i].formStatus === 1
              ) {
                if (res.data.data.billSetting[i].settingName === "COMMISSION") {
                  setIncludeComm(
                    res.data.data.billSetting[i].includeInLedger == 1
                      ? true
                      : false
                  );
                  setisShown(
                    res.data.data.billSetting[i].isShown == 1 ? true : false
                  );
                  if (!res.data.data.billSetting[i].isShown) {
                    setStatus(true);
                  }
                }
                if (
                  res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE"
                ) {
                  setStatus(true);
                } else if (
                  res.data.data.billSetting[i].settingName ===
                  "RETURN_COMMISSION"
                ) {
                  setAddRetComm(
                    res.data.data.billSetting[i].addToGt == 1 ? false : true
                  );
                  setIncludeRetComm(
                    res.data.data.billSetting[i].includeInLedger == 1
                      ? true
                      : false
                  );
                }
                groupOne = [res.data.data.billSetting[i], ...groupOne];
                dispatch(groupOneSettings(groupOne));
                setGroupOne([groupone, ...groupOne]);
              } else if (
                res.data.data.billSetting[i].groupId === 2 &&
                res.data.data.billSetting[i].billType === "SELL" &&
                res.data.data.billSetting[i].formStatus === 1
              ) {
                if (
                  res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE"
                ) {
                  setStatus(true);
                }
                if (res.data.data.billSetting[i].settingName === "COMMISSION") {
                  setIncludeComm(
                    res.data.data.billSetting[i].includeInLedger == 1
                      ? true
                      : false
                  );
                  setisShown(
                    res.data.data.billSetting[i].isShown == 1 ? true : false
                  );
                } else if (
                  res.data.data.billSetting[i].settingName ===
                  "RETURN_COMMISSION"
                ) {
                  setAddRetComm(
                    res.data.data.billSetting[i].addToGt == 1 ? false : true
                  );
                  setIncludeRetComm(
                    res.data.data.billSetting[i].includeInLedger == 1
                      ? true
                      : false
                  );
                }
                grouptwo = [res.data.data.billSetting[i], ...grouptwo];
                dispatch(groupTwoSettings(grouptwo));
                setGroupTwo([groupTwo, ...grouptwo]);
              } else if (
                res.data.data.billSetting[i].groupId === 3 &&
                res.data.data.billSetting[i].billType === "SELL" &&
                res.data.data.billSetting[i].formStatus === 1
              ) {
                if (
                  res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE"
                ) {
                  setStatus(true);
                }
                if (res.data.data.billSetting[i].settingName === "COMMISSION") {
                  setIncludeComm(
                    res.data.data.billSetting[i].includeInLedger == 1
                      ? true
                      : false
                  );
                  setisShown(
                    res.data.data.billSetting[i].isShown == 1 ? true : false
                  );
                } else if (
                  res.data.data.billSetting[i].settingName ===
                  "RETURN_COMMISSION"
                ) {
                  setAddRetComm(
                    res.data.data.billSetting[i].addToGt == 1 ? false : true
                  );
                  setIncludeRetComm(
                    res.data.data.billSetting[i].includeInLedger == 1
                      ? true
                      : false
                  );
                }
                groupthree = [res.data.data.billSetting[i], ...groupthree];
                dispatch(groupThreeSettings(groupthree));
                setGroupThree([groupThree, ...groupthree]);
              } else if (
                res.data.data.billSetting[i].groupId === 4 &&
                res.data.data.billSetting[i].billType === "SELL" &&
                res.data.data.billSetting[i].formStatus === 1
              ) {
                if (
                  res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE"
                ) {
                  setStatus(true);
                }
                if (res.data.data.billSetting[i].settingName === "COMMISSION") {
                  setIncludeComm(
                    res.data.data.billSetting[i].includeInLedger == 1
                      ? true
                      : false
                  );
                  setisShown(
                    res.data.data.billSetting[i].isShown == 1 ? true : false
                  );
                } else if (
                  res.data.data.billSetting[i].settingName ===
                  "RETURN_COMMISSION"
                ) {
                  setAddRetComm(
                    res.data.data.billSetting[i].addToGt == 1 ? false : true
                  );
                  setIncludeRetComm(
                    res.data.data.billSetting[i].includeInLedger == 1
                      ? true
                      : false
                  );
                }
                groupfour = [res.data.data.billSetting[i], ...groupfour];
                dispatch(groupFourSettings(groupfour));
                setGroupFour([groupFour, ...groupfour]);
              }
            }
          }
        } else {
          getDefaltSet();
        }
      } else {
        getDefaltSet();
      }
    });
  };
  const getDefaltSet = () => {
    getDefaultSystemSettings().then((response) => {
      var res = response.data.data;
      groupWiseTotals(response);
      billSettingData(response.data.data);
      dispatch(filtereArray(response.data.data));
      SetSysArray(response.data.data);
      groupSettingsToJson();
      for (var i = 0; i < response.data.data.length; i++) {
        if (
          response.data.data[i].name == "COMM_INCLUDE" &&
          response.data.data[i].status == 1
        ) {
          setIncludeComm(true);
          setisShown(true);
        }
        if (
          response.data.data[i].name == "RETURN_COMMISSION" &&
          response.data.data[i].status == 1
        ) {
          setIncludeRetComm(true);
        }
      }
    });
  };
  var totalgrp = [];
  const groupWiseTotals = (res) => {
    for (var i = 0; i < res.data.data.length; i++) {
      if (
        billData?.partyType.toUpperCase() === "FARMER" ||
        billData?.partyType.toUpperCase() === "SELLER"
      ) {
        if (
          res.data.data[i].type === "BILL" ||
          (res.data.data[i].type === "DAILY_CHART" &&
            res.data.data[i].status === 1)
        ) {
          if (res.data.data[i].name === "COMMISSION") {
            Object.assign(res.data.data[i], {
              isShown: true,
            });
          }
          let clonedObject = { ...res.data.data[i] };
          totalgrp = [...totalgrp, clonedObject];
          totalgrp = totalgrp.sort((a, b) => a.id - b.id);
          dispatch(allGroupsSettings(totalgrp));
          setAllGroups([...totalgrp]);
        }
      } else {
        if (
          res.data.data[i].type === "BILL" ||
          (res.data.data[i].type === "DAILY_CHART" &&
            res.data.data[i].status === 1)
        ) {
          if (res.data.data[i].name === "COMMISSION") {
            Object.assign(res.data.data[i], {
              isShown: true,
            });
          }
          let clonedObject = { ...res.data.data[i] };
          totalgrp = [...totalgrp, clonedObject];
          totalgrp = totalgrp.sort((a, b) => a.id - b.id);
          dispatch(allGroupsSettings(totalgrp));
          setAllGroups([...totalgrp]);
        }
      }
    }
  };
  const handleGroupNames = (name) => {
    var value = 0;
    var substring = "CUSTOM_FIELD";
    if (name?.includes(substring)) {
      substring = name;
    }
    // else if (
    //   name === "ADVANCES" &&
    //   !(billData?.partyType.toUpperCase() === "FARMER")
    // ) {
    //   name = "";
    // }
    switch (name) {
      case "COMMISSION":
        if (billData?.partyType.toUpperCase() === "FARMER") {
          value = billData?.commShown ? -billData?.comm : 0;
        } else {
          if (allGroups.length > 0) {
            value = billData?.comm;
          }
          value = billData?.commShown ? billData?.comm : 0;
        }
        break;
      case "RETURN_COMMISSION":
        allGroups.map((item) => {
          if (billData?.partyType.toUpperCase() === "FARMER") {
            value = billData?.rtComm;
          } else {
            value = billData?.rtComm;
          }
        });
        groupone.map((item) => {
          if (item.settingName === "RETURN_COMMISSION" && !billData?.less) {
            value = billData?.rtComm;
            return value;
          } else if (
            item.settingName === "RETURN_COMMISSION" &&
            billData?.less
          ) {
            if (billData?.partyType.toUpperCase() === "FARMER") {
              value = -billData?.rtComm;
            } else {
              value = value =
                billData?.partyType.toUpperCase() === "BUYER"
                  ? -billData?.rtComm
                  : billData?.rtComm;
            }
            return value;
          }
        });
        groupTwo.map((item) => {
          if (item.settingName === "RETURN_COMMISSION" && !billData?.less) {
            value = billData?.rtComm;
            return value;
          } else if (
            item.settingName === "RETURN_COMMISSION" &&
            billData?.less
          ) {
            if (billData?.partyType.toUpperCase() === "FARMER") {
              value = -billData?.rtComm;
            } else {
              value = value =
                billData?.partyType.toUpperCase() === "BUYER"
                  ? -billData?.rtComm
                  : billData?.rtComm;
            }
            return value;
          }
        });
        groupThree.map((item) => {
          if (item.settingName === "RETURN_COMMISSION" && !billData?.less) {
            value = billData?.rtComm;
            return value;
          } else if (
            item.settingName === "RETURN_COMMISSION" &&
            billData?.less
          ) {
            if (billData?.partyType.toUpperCase() === "FARMER") {
              value = -billData?.rtComm;
            } else {
              value = value =
                billData?.partyType.toUpperCase() === "BUYER"
                  ? -billData?.rtComm
                  : billData?.rtComm;
            }
            return value;
          }
        });
        groupFour.map((item) => {
          if (item.settingName === "RETURN_COMMISSION" && !billData?.less) {
            value = billData?.rtComm;
            return value;
          } else if (
            item.settingName === "RETURN_COMMISSION" &&
            billData?.less
          ) {
            if (billData?.partyType.toUpperCase() === "FARMER") {
              value = -billData?.rtComm;
            } else {
              value =
                billData?.partyType.toUpperCase() === "BUYER"
                  ? -billData?.rtComm
                  : billData?.rtComm;
            }
            return value;
          }
        });
        break;
      case "TRANSPORTATION":
        if (billData?.partyType.toUpperCase() === "FARMER") {
          value = -billData?.transportation;
        } else {
          value = billData?.transportation;
        }
        break;
      case "LABOUR_CHARGES":
        if (billData?.partyType.toUpperCase() === "FARMER") {
          value = -billData?.labourCharges;
        } else {
          value = billData?.labourCharges;
        }
        break;
      case "RENT":
        if (billData?.partyType.toUpperCase() === "FARMER") {
          value = -billData?.rent;
        } else {
          value = billData?.rent;
        }
        break;
      case "MANDI_FEE":
        if (billData?.partyType.toUpperCase() === "FARMER") {
          value = -billData?.mandiFee;
        } else {
          value = billData?.mandiFee;
        }
        break;
      case "OTHER_FEE":
        if (billData?.partyType.toUpperCase() === "FARMER") {
          value = -billData?.misc;
        } else {
          if (allGroups.length > 0) {
            value = billData?.otherFee;
          } else {
            value = billData?.otherFee;
          }
        }
        break;
      case "GOVT_LEVIES":
        if (billData?.partyType.toUpperCase() === "FARMER") {
          value = -billData?.govtLevies;
        } else {
          value = billData?.govtLevies;
        }
        break;
      // case "ADVANCES":
      //   if (
      //     billData?.partyType.toUpperCase() === "FARMER" ||
      //     billData?.partyType.toUpperCase() === "SELLER"
      //   ) {
      //     value = -billData?.advance;
      //   } else {
      //     value = billData?.advance;
      //   }
      //   break;
      case substring:
        if (billData?.partyType.toUpperCase() === "FARMER") {
          billData?.customFields.map((item) => {
            if (item.fee != 0) {
              if (item.field === name) {
                if (item.less) {
                  value = -item.fee;
                } else {
                  value = item.fee;
                }
                value = value == null ? 0 : value;
                return value;
              }
            }
          });
        } else if (billData?.partyType.toUpperCase() === "BUYER") {
          billData?.customFields.map((item) => {
            if (item.fee != 0) {
              if (item.field === name) {
                if (item.less) {
                  value = -item.fee;
                } else {
                  value = item.fee;
                }
                value = value == null ? 0 : value;
                return value;
              }
            }
          });
        } else {
          billData?.customFields.map((item) => {
            if (item.fee != 0) {
              if (item.field === name) {
                value = item.fee;
                return value;
              }
            }
          });
        }
        break;
    }
    return value;
  };

  var obj = {
    groupId: 0,
    settingName: "",
    value: 0,
    signIndication: "",
  };
  var allFilteredSettings = [];
  const groupSettingsToJson = () => {
    var indication = "";
    filterArray = filterArray.length != 0 ? filterArray : sArray;
    for (var i = 0; i < filterArray.length; i++) {
      var setting = filterArray[i];
      var substring = "CUSTOM_FIELD";
      if (setting.settingName?.includes(substring)) {
        substring = setting.settingName;
      } else if (
        setting.settingName === "ADVANCES" &&
        !(billData?.partyType.toUpperCase() === "FARMER")
      ) {
        let clonedObject1 = { ...setting };
        clonedObject1 = { ...clonedObject1, settingName: "" };
        setting = clonedObject1;
        // setting.settingName = "";
      }

      switch (setting.settingName || setting.name) {
        case "COMMISSION":
          if (billData?.comm) {
            obj = {
              groupId: setting?.groupId || setting.status,
              settingName: setting?.settingName || setting?.name,
              value: billData?.comm ? billData?.comm.toFixed(1) : 0,
              signIndication:
                billData?.partyType.toUpperCase() === "FARMER" ? "-" : "+",
            };
            allFilteredSettings.push(obj);
          }
          break;
        case "RETURN_COMMISSION":
          var assign = "";
          if (
            billData?.partyType.toUpperCase() === "FARMER" &&
            billData?.less
          ) {
            assign = "-";
          } else {
            assign =
              billData?.partyType.toUpperCase() === "BUYER" && billData?.less
                ? "-"
                : "+";
          }
          if (billData?.rtComm) {
            obj = {
              groupId: setting?.groupId || setting.status,
              settingName: setting?.settingName || setting?.name,
              value: billData?.rtComm ? billData?.rtComm.toFixed(1) : 0,
              signIndication: assign,
            };
            allFilteredSettings.push(obj);
          }
          break;
        case "TRANSPORTATION":
          if (billData?.transportation) {
            obj = {
              groupId: setting?.groupId || setting.status,
              settingName: setting?.settingName || setting?.name,
              value: billData?.transportation
                ? billData?.transportation.toFixed(1)
                : 0,
              signIndication:
                billData?.partyType.toUpperCase() === "FARMER" ? "-" : "+",
            };
            allFilteredSettings.push(obj);
          }
          break;
        case "LABOUR_CHARGES":
          if (billData?.labourCharges) {
            obj = {
              groupId: setting?.groupId || setting.status,
              settingName: setting?.settingName || setting?.name,
              value: billData?.labourCharges
                ? billData?.labourCharges.toFixed(1)
                : 0,
              signIndication:
                billData?.partyType.toUpperCase() === "FARMER" ? "-" : "+",
            };
            allFilteredSettings.push(obj);
          }
          break;
        case "RENT":
          if (billData?.rent) {
            obj = {
              groupId: setting?.groupId || setting.status,
              settingName: setting?.settingName || setting?.name,
              value: billData?.rent ? billData?.rent.toFixed(1) : 0,
              signIndication:
                billData?.partyType.toUpperCase() === "FARMER" ? "-" : "+",
            };
            allFilteredSettings.push(obj);
          }
          break;
        case "MANDI_FEE":
          if (billData?.mandiFee) {
            obj = {
              groupId: setting?.groupId || setting.status,
              settingName: setting?.settingName || setting?.name,
              value: billData?.mandiFee ? billData?.mandiFee.toFixed(1) : 0,
              signIndication:
                billData?.partyType.toUpperCase() === "FARMER" ? "-" : "+",
            };
            allFilteredSettings.push(obj);
          }
          break;
        case "OTHER_FEE":
          if (
            billData?.partyType.toUpperCase() === "FARMER"
              ? billData?.misc
              : billData?.otherFee
          ) {
            obj = {
              groupId: setting?.groupId || setting.status,
              settingName: setting?.settingName || setting?.name,
              value:
                billData?.partyType.toUpperCase() === "FARMER"
                  ? billData?.misc.toFixed(1)
                  : billData?.otherFee.toFixed(1),
              signIndication:
                billData?.partyType.toUpperCase() === "FARMER" ? "-" : "+",
            };
            allFilteredSettings.push(obj);
          }
          break;
        case "GOVT_LEVIES":
          if (billData?.govtLevies) {
            obj = {
              groupId: setting?.groupId || setting.status,
              settingName: setting?.settingName || setting?.name,
              value: billData?.govtLevies ? billData?.govtLevies.toFixed(1) : 0,
              signIndication:
                billData?.partyType.toUpperCase() === "FARMER" ? "-" : "+",
            };
            allFilteredSettings.push(obj);
          }
          break;
        case "ADVANCES":
          if (billData?.advance) {
            obj = {
              groupId: setting?.groupId || setting.status,
              settingName: setting?.settingName || setting?.name,
              value: billData?.advance ? billData?.advance.toFixed(1) : 0,
              signIndication:
                billData?.partyType.toUpperCase() === "FARMER" ||
                billData?.partyType.toUpperCase() === "SELLER"
                  ? "-"
                  : "+",
            };
            allFilteredSettings.push(obj);
          }
        case substring:
          var value = 0;
          if (billData?.partyType.toUpperCase() === "FARMER") {
            billData?.customFields.map((item) => {
              if (item.fee != 0 || item.fee != null) {
                if (item.field === setting.settingName) {
                  if (item.less) {
                    value = -item.fee;
                    indication = "-";
                  } else {
                    value = item.fee;
                    indication = "+";
                  }
                  value = value == null ? 0 : value;
                  if (value != 0) {
                    obj = {
                      groupId: setting?.groupId || setting.status,
                      settingName: setting?.customFieldName.toUpperCase(),
                      value: value ? value : 0,
                      signIndication: indication,
                    };
                    if (billData?.customFields.length > 0) {
                      allFilteredSettings.push(obj);
                    }
                  }
                }
              }
            });
          } else if (billData?.partyType.toUpperCase() === "BUYER") {
            billData?.customFields.map((item) => {
              if (item.fee != 0 || item.fee != null) {
                if (item.field === setting.settingName) {
                  if (item.less) {
                    value = -item.fee;
                    indication = "-";
                  } else {
                    value = item.fee;
                    indication = "+";
                  }
                  value = value == null ? 0 : value;
                  if (value != 0) {
                    obj = {
                      groupId: setting?.groupId || setting.status,
                      settingName: setting?.customFieldName.toUpperCase(),
                      value: value ? value : 0,
                      signIndication: indication,
                    };
                    if (billData?.customFields.length > 0) {
                      allFilteredSettings.push(obj);
                    }
                  }
                  return value;
                }
              }
            });
          }
          break;
      }
    }
    getGrp(allFilteredSettings);
  };

  allGroups.map((item) => {
    var substring = "CUSTOM_FIELD";
    // var str = "ADVANCES";
    if (item?.name.includes(substring)) {
      let cObject = { ...item };
      cObject.name = "";
      item = cObject;
      // item.name = "";
      substring = "";
    }
    // else if (item?.name.includes(str)) {
    //   item.name = "";
    // }
    allGroupsTotal += handleGroupNames(item.name);
    return allGroupsTotal;
  });

  groupone
    .slice()
    .reverse()
    .map((item) => {
      groupOneTotal += handleGroupNames(item.settingName);
      return groupOneTotal;
    });

  groupTwo
    .slice()
    .reverse()
    .map((item) => {
      return (groupTwoTotal += handleGroupNames(item.settingName));
    });
  groupThree
    .slice()
    .reverse()
    .map((item) => {
      return (groupThreeTotal += handleGroupNames(item.settingName));
    });

  groupFour
    .slice()
    .reverse()
    .map((item) => {
      return (groupFourTotal += handleGroupNames(item.settingName));
    });
  const getGrp = (array) => {
    const grouped = Object.values(
      array.reduce((acc, item) => {
        acc[item.groupId] = [...(acc[item.groupId] || []), item];
        return acc;
      }, {})
    );
    grouped.map((item) => {
      item.map((grpItem) => {
        if (grpItem.groupId == 1) {
          obj = {
            settingName: "SUBTOTAL",
            value: getCurrencyNumberWithSymbol(
              billData?.grossTotal + groupOneTotal
            ),
            signIndication: "",
            groupId: grpItem.groupId,
          };
          item.push(obj);
          return item;
        } else if (grpItem.groupId == 2) {
          obj = {
            settingName: "SUBTOTAL",
            value: getCurrencyNumberWithSymbol(
              billData?.grossTotal + groupOneTotal + groupTwoTotal
            ),
            signIndication: "",
            groupId: grpItem.groupId,
          };
          item.push(obj);
          return item;
        } else if (grpItem.groupId == 3) {
          obj = {
            settingName: "SUBTOTAL",
            value: getCurrencyNumberWithSymbol(
              billData?.grossTotal +
                groupOneTotal +
                groupTwoTotal +
                groupThreeTotal
            ),
            signIndication: "",
            groupId: grpItem.groupId,
          };
          item.push(obj);
          return item;
        } else if (grpItem.groupId == 4) {
          obj = {
            settingName: "SUBTOTAL",
            value: getCurrencyNumberWithSymbol(
              billData?.grossTotal +
                groupOneTotal +
                groupTwoTotal +
                groupThreeTotal +
                groupFourTotal
            ),
            signIndication: "",
            groupId: grpItem.groupId,
          };
          item.push(obj);
          return item;
        }
      });
    });
    const newArr = grouped.flat();
    const unique2 = newArr.filter((obj, index) => {
      return (
        index ===
        newArr.findIndex(
          (o) => obj.groupId == o.groupId && obj.settingName == o.settingName
        )
      );
    });
    dispatch(allSettings(unique2));
    localStorage.setItem("groupPdfTotals", JSON.stringify(unique2));
  };
  const handleSettingName = (item, list) => {
    var substring = "CUSTOM_FIELD";
    if (item?.includes(substring)) {
      substring = item;
    }
    switch (item) {
      case "COMM_INCLUDE":
        item = "";
        break;
      case "DEFAULT_RATE_TYPE":
        item = "";
        break;
      case "SKIP_INDIVIDUAL_EXP":
        item = "";
        break;
      case "BILL_EDIT":
        item = "";
        break;
      case "WASTAGE":
        item = "";
        break;
      case "OUT_ST_BALANCE":
        item = "";
        break;
      case "CASH_PAID":
        item = "";
        break;
      case "CASH_RECEIVED":
        item = "";
        break;
      case "COMMISSION":
        if (!billData?.commShown) {
          item = "";
        } else {
          item = "COMMISSION";
        }
        break;
      case substring:
        billData?.customFields.map((items) => {
          if (items.fee != 0) {
            if (items.field === item) {
              item = items.field;
              return item;
            }
          }
        });
        break;
    }
    return item;
  };
  const [finalLedgerBal, setFinalLedgerBal] = useState("");
  const getFinalLedgerbalance = () => {
    if (billData?.partyType.toUpperCase() === "FARMER") {
      var t = Number(
        billData?.transportation +
          billData?.labourCharges +
          billData?.rent +
          billData?.mandiFee +
          billData?.govtLevies +
          billData?.misc +
          billData?.advance
      );
    } else {
      var t = Number(
        billData?.transportation +
          billData?.labourCharges +
          billData?.rent +
          billData?.mandiFee +
          billData?.govtLevies +
          billData?.otherFee
      );
    }
    if (
      billData?.partyType.toUpperCase() === "FARMER" ||
      billData?.partyType.toUpperCase() === "SELLER"
    ) {
      var finalValue = billData.grossTotal - t;
    } else {
      var finalValue = billData?.grossTotal + t;
    }
    var finalVal = finalValue;
    if (
      billData?.partyType?.toUpperCase() === "FARMER" ||
      billData?.partyType.toUpperCase() === "SELLER"
    ) {
      if (billData?.commIncluded) {
        finalVal = finalVal - billData.comm;
      } else {
        // if (billData?.commShown) {
        //   finalVal = finalVal - billData.comm;
        // }
      }
    } else {
      if (billData?.commIncluded) {
        finalVal = finalVal + billData.comm;
      }
    }
    if (
      billData?.partyType?.toUpperCase() === "FARMER" ||
      billData?.partyType.toUpperCase() === "SELLER"
    ) {
      if (!billData?.less) {
        if (billData?.rtCommIncluded) {
          finalVal = finalVal + billData?.rtComm;
        }
      } else {
        if (billData?.rtCommIncluded) {
          finalVal = finalVal - billData?.rtComm;
        }
      }
    } else {
      if (!billData?.less) {
        if (billData?.rtCommIncluded) {
          finalVal = finalVal - billData?.rtComm;
        }
      } else {
        finalVal = finalVal + billData?.rtComm;
      }
    }
    for (var i = 0; i < billData?.customFields.length; i++) {
      if (billData?.customFields[i].field != "") {
        if (billData?.customFields[i].less) {
          finalVal = finalVal - billData?.customFields[i].fee;
        } else {
          finalVal = finalVal + billData?.customFields[i].fee;
        }
      }
    }
    if (
      billData?.partyType.toUpperCase() === "FARMER" ||
      billData?.partyType.toUpperCase() === "SELLER"
    ) {
      return Number(finalVal) + billData?.outStBal;
    } else {
      return Number(finalVal) + billData?.outStBal;
    }
  };
  const getFinalOutBalance = () => {
    if (
      billData?.partyType.toUpperCase() === "FARMER" ||
      billData?.partyType.toUpperCase() === "SELLER"
    ) {
      return (
        Number(getFinalLedgerbalance()) - Number(billData?.cashPaid)
      ).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        style: "currency",
        currency: "INR",
      });
    } else {
      var cashRecieved = billData?.cashRcvd === null ? 0 : billData?.cashRcvd;
      return (
        Number(getFinalLedgerbalance()) - Number(cashRecieved)
      ).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        style: "currency",
        currency: "INR",
      });
    }
  };
  const feePerUnit = () => {
    var totalQty = 0;
    billData.lineItems?.map((item) => {
      totalQty += item.qty;
      return totalQty;
    });
    return totalQty;
  };
  var totalBillAmount =
    billData?.grossTotal +
      (groupFourTotal + groupThreeTotal + groupTwoTotal + groupOneTotal) ===
      0 ||
    billData?.grossTotal +
      (groupFourTotal + groupThreeTotal + groupTwoTotal + groupOneTotal) ===
      null
      ? " "
      : billData?.grossTotal +
        (groupFourTotal + groupThreeTotal + groupTwoTotal + groupOneTotal);
  try {
    localStorage.setItem(
      "totalSelectedBillAmount",
      getCurrencyNumberWithSymbol(totalBillAmount)
    );
  } catch (error) {
    console.log(error);
  }
  return (
    <div className="group_totals_div">
      <div>
        <div className="row">
          <div className="col-lg-5"></div>
          {allGroups.length > 0 ? (
            <div className="pl-0 col-lg-7 col_border_left pr-0">
              {allGroups.map((item, index) => {
                return (
                  <div>
                    {(
                      item.name !== handleSettingName(item.name, item)
                        ? " "
                        : handleGroupNames(item.name) === 0
                    ) ? (
                      " "
                    ) : (
                      <div className="row grp_one_row" key={index}>
                        {/* <div className="col-lg-2"></div> */}
                        <div className="col-lg-5 align-data-items">
                          <div>
                            <p className="groups_value">
                              <div>
                                {(
                                  item.name !==
                                  handleSettingName(item.name, item)
                                    ? " "
                                    : handleGroupNames(item.name) === 0
                                ) ? (
                                  " "
                                ) : item.name.includes("CUSTOM_FIELD") ? (
                                  item.customFieldName
                                ) : (
                                  <p className="main_setting_name">
                                    {getText(item.name?.replaceAll("_", " "))}
                                  </p>
                                )}
                                <p className="fee-perc">
                                  {item.name == "COMMISSION" ? (
                                    billData?.comm ? (
                                      <span className="fee-percentage">
                                        Rate %
                                        {(
                                          (billData?.comm /
                                            billData?.grossTotal) *
                                          100
                                        ).toFixed(2)}
                                      </span>
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    ""
                                  )}
                                </p>
                                <p className="fee-perc">
                                  {item.name == "RETURN_COMMISSION" ? (
                                    billData?.rtComm ? (
                                      <span className="fee-percentage">
                                        Rate %
                                        {(
                                          (billData?.rtComm /
                                            billData?.grossTotal) *
                                          100
                                        ).toFixed(2)}
                                      </span>
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    ""
                                  )}
                                </p>
                                <p className="fee-perc">
                                  {item.name == "MANDI_FEE" ? (
                                    billData?.mandiFee ? (
                                      <span className="fee-percentage">
                                        Rate %
                                        {(
                                          (billData?.mandiFee /
                                            billData?.grossTotal) *
                                          100
                                        ).toFixed(2)}
                                      </span>
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    ""
                                  )}
                                </p>
                                <p className="fee-perc">
                                  {item.name == "TRANSPORTATION" ? (
                                    billData?.transportation ? (
                                      <span className="fee-percentage">
                                        Fee per Unit{" "}
                                        {(
                                          billData?.transportation /
                                          feePerUnit()
                                        ).toFixed(2)}
                                      </span>
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    ""
                                  )}
                                </p>
                                <p className="fee-perc">
                                  {item.name == "RENT" ? (
                                    billData?.rent ? (
                                      <span className="fee-percentage">
                                        Fee per Unit{" "}
                                        {(
                                          billData?.rent / feePerUnit()
                                        ).toFixed(2)}
                                      </span>
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    ""
                                  )}
                                </p>
                                <p className="fee-perc">
                                  {item.name == "LABOUR_CHARGES" ? (
                                    billData?.labourCharges ? (
                                      <span className="fee-percentage">
                                        Fee per Unit{" "}
                                        {(
                                          billData?.labourCharges / feePerUnit()
                                        ).toFixed(2)}
                                      </span>
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    ""
                                  )}
                                </p>
                                <p className="fee-perc">
                                  <span className="fee-percentage">
                                    {billData?.customFields.map((i) => {
                                      if (i.field == item.name) {
                                        return i.comments;
                                      }
                                    })}
                                  </span>
                                </p>
                                <p className="fee-perc">
                                  {item.name == "OTHER_FEE" ? (
                                    billData?.misc ||
                                    (billData?.otherFee &&
                                      billData?.comments) ? (
                                      <span className="fee-percentage">
                                        {billData?.comments}
                                      </span>
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    ""
                                  )}
                                </p>
                              </div>
                            </p>
                          </div>
                          {/* <p className="groups_value">
                            {(
                              item.name !== handleSettingName(item.name, item)
                                ? " "
                                : handleGroupNames(item.name) === 0
                            )
                              ? " "
                              : item.name?.replaceAll("_", " ")}{" "}
                          </p> */}
                        </div>
                        <div className="col-lg-3 p-0">
                          <p className="fee-perc">
                            {item.name == "TRANSPORTATION" ? (
                              billData?.transportation ? (
                                <span className="units-cal">
                                  {feePerUnit().toFixed(1)} Units
                                </span>
                              ) : (
                                ""
                              )
                            ) : (
                              ""
                            )}
                          </p>
                          <p className="fee-perc">
                            {item.name == "RENT" ? (
                              billData?.rent ? (
                                <span className="units-cal">
                                  {feePerUnit().toFixed(1)} Units
                                </span>
                              ) : (
                                ""
                              )
                            ) : (
                              ""
                            )}
                          </p>
                          <p className="fee-perc">
                            {item.name == "LABOUR_CHARGES" ? (
                              billData?.labourCharges ? (
                                <span className="units-cal">
                                  {feePerUnit().toFixed(1)} Units
                                </span>
                              ) : (
                                ""
                              )
                            ) : (
                              ""
                            )}
                          </p>
                        </div>
                        <div className="col-lg-3">
                          <p className="groups_values">
                            {handleGroupNames(
                              handleSettingName(item.name, item)
                            ) === 0 ? (
                              " "
                            ) : (
                              <span>
                                {(item.name.includes("CUSTOM_FIELD")
                                  ? billData?.customFields.map((item) => {
                                      if (
                                        item.field == item.name &&
                                        item.less
                                      ) {
                                        return (
                                          "-" +
                                          handleGroupNames(item.name).toFixed(2)
                                        );
                                      } else {
                                        return (
                                          "+" +
                                          handleGroupNames(item.name).toFixed(2)
                                        );
                                      }
                                    })
                                  : billData?.partyType.toUpperCase() ==
                                    "FARMER") &&
                                item.name == "RETURN_COMMISSION" &&
                                !billData?.less
                                  ? " + " +
                                    handleGroupNames(item.name).toFixed(2)
                                  : billData?.partyType.toUpperCase() ==
                                      "BUYER" &&
                                    item.name == "RETURN_COMMISSION" &&
                                    billData?.less
                                  ? " - " +
                                    handleGroupNames(item.name).toFixed(2)
                                  : billData?.partyType.toUpperCase() == "BUYER"
                                  ? " + " +
                                    handleGroupNames(item.name).toFixed(2)
                                  : handleGroupNames(item.name).toFixed(2)}
                              </span>
                              // <span>+ {handleGroupNames(item.name)}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                    <div
                      className={
                        (
                          item.name !== handleSettingName(item.name, item)
                            ? " "
                            : handleGroupNames(item.name) === 0
                        )
                          ? " "
                          : item.name?.replaceAll("_", " ")
                          ? "hrs-line"
                          : ""
                      }
                    ></div>
                    {/* </div> */}
                  </div>
                );
              })}
              {allGroupsTotal === 0 || allGroupsTotal === null ? (
                ""
              ) : (
                <div
                  className="row group-one-total"
                  style={{
                    backgroundColor:
                      pdfThemeData != null
                        ? colorAdjustBg(colorThemeVal, 180) === "#ffffff"
                          ? colorAdjustBg(colorThemeVal, 40)
                          : colorAdjustBg(colorThemeVal, 180)
                        : "#D7F3DD",
                  }}
                >
                  <div className="pl-0 col-lg-7 pr-0"></div>
                  <div className="col-lg-4 p-0">
                    <p className="groups_values">
                      {allGroupsTotal === 0 || null
                        ? ""
                        : (
                            billData?.grossTotal + allGroupsTotal
                          ).toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                            style: "currency",
                            currency: "INR",
                          })}
                    </p>
                  </div>

                  {/* <div
                  className={
                    allGroupsTotal === 0 || null ? "" : "hr-line-in-totals"
                  }
                ></div> */}
                </div>
              )}
              <div className="row">
                {/* <div className="col-lg-2"></div> */}
                <div className="col-lg-7">
                  {billData?.grossTotal + allGroupsTotal ===
                  // billData?.totalPayables ===
                  0 ? (
                    ""
                  ) : (
                    <p className="grouping_value">Total Bill Amount </p>
                  )}
                </div>
                <div className="col-lg-4 p-0">
                  <p
                    className={
                      billData?.partyType.toUpperCase() === "FARMER" ||
                      billData?.partyType.toUpperCase() === "SELLER"
                        ? "groups_values color_red"
                        : "groups_values color_green"
                    }
                  >
                    {billData?.grossTotal + allGroupsTotal === 0 ||
                    billData?.grossTotal + allGroupsTotal === null
                      ? " "
                      : (billData?.grossTotal + allGroupsTotal).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 2,
                            style: "currency",
                            currency: "INR",
                          }
                        )}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-7">
                  <p className="grouping_value">Outstanding Balance</p>
                  <p class="fee-percentage color_red">
                    {moment(billData?.timeStamp).format("DD-MMM-YY | hh:mm:A")}
                  </p>
                </div>
                <div className="col-lg-4">
                  <p
                    className={
                      billData?.partyType.toUpperCase() === "FARMER"
                        ? "groups_values color_red"
                        : "groups_values color_green"
                    }
                  >
                    {billData?.outStBal.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                      style: "currency",
                      currency: "INR",
                    })}
                  </p>
                </div>
              </div>
              <div>
                {billData?.partyType.toUpperCase() === "FARMER" ? (
                  <div className="row">
                    {/* <div className="col-lg-2"></div> */}
                    <div className="col-lg-7">
                      {billData?.cashPaid === 0 ? (
                        "" || billData?.cashPaid === null
                      ) : (
                        <div>
                          <p className="grouping_value color_red pb-0">
                            Cash Paid :
                          </p>
                          <p className="grouping_value pt-0">
                            {billData?.cashPaidCmnt}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="col-lg-4">
                      <p className="groups_values color_red">
                        {billData?.cashPaid === 0 || billData?.cashPaid === null
                          ? " "
                          : "-" +
                            getCurrencyNumberWithSymbol(billData?.cashPaid)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    {/* <div className="col-lg-1"></div> */}
                    <div className="col-lg-7">
                      {billData?.cashRcvd === 0 ||
                      billData?.cashRcvd === null ? (
                        ""
                      ) : (
                        <p className="grouping_value">Cash Received</p>
                      )}
                    </div>
                    <div className="col-lg-4">
                      <p className="groups_values ">
                        {billData?.cashRcvd === 0 || billData?.cashRcvd === null
                          ? ""
                          : "-" +
                            getCurrencyNumberWithSymbol(billData?.cashRcvd)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="pl-0 col-lg-7 col_border_left pr-0">
              <div>
                {groupone
                  .slice()
                  .reverse()
                  .map((item, index) => {
                    return (
                      <div>
                        {(
                          item.settingName !==
                          handleSettingName(item.settingName, item)
                            ? " "
                            : handleGroupNames(item.settingName) === 0
                        ) ? (
                          " "
                        ) : (
                          <div className="row grp_one_row" key={index}>
                            {/* <div className="col-lg-2"></div> */}
                            <div className="col-lg-5 align-data-items">
                              <div>
                                <p className="groups_value">
                                  <div>
                                    {(
                                      item.settingName !==
                                      handleSettingName(item.settingName, item)
                                        ? " "
                                        : handleGroupNames(item.settingName) ===
                                          0
                                    ) ? (
                                      " "
                                    ) : item.settingName.includes(
                                        "CUSTOM_FIELD"
                                      ) ? (
                                      item.customFieldName
                                    ) : (
                                      <p className="main_setting_name">
                                        {getText(
                                          item.settingName?.replaceAll("_", " ")
                                        )}
                                      </p>
                                    )}
                                    <p className="fee-perc">
                                      {item.settingName == "COMMISSION" ? (
                                        billData?.comm ? (
                                          <span className="fee-percentage">
                                            Rate %
                                            {(
                                              (billData?.comm /
                                                billData?.grossTotal) *
                                              100
                                            ).toFixed(2)}
                                          </span>
                                        ) : (
                                          ""
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </p>
                                    <p className="fee-perc">
                                      {item.settingName ==
                                      "RETURN_COMMISSION" ? (
                                        billData?.rtComm ? (
                                          <span className="fee-percentage">
                                            Rate %
                                            {(
                                              (billData?.rtComm /
                                                billData?.grossTotal) *
                                              100
                                            ).toFixed(2)}
                                          </span>
                                        ) : (
                                          ""
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </p>
                                    <p className="fee-perc">
                                      {item.settingName == "MANDI_FEE" ? (
                                        billData?.mandiFee ? (
                                          <span className="fee-percentage">
                                            Rate %
                                            {(
                                              (billData?.mandiFee /
                                                billData?.grossTotal) *
                                              100
                                            ).toFixed(2)}
                                          </span>
                                        ) : (
                                          ""
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </p>
                                    <p className="fee-perc">
                                      {item.settingName == "TRANSPORTATION" ? (
                                        billData?.transportation ? (
                                          <span className="fee-percentage">
                                            Fee per Unit
                                            {lpk
                                              ? billData?.transportation.toFixed(
                                                  1
                                                )
                                              : (
                                                  billData?.transportation /
                                                  feePerUnit()
                                                ).toFixed(2)}
                                            {/* {(
                                            billData?.transportation /
                                            feePerUnit()
                                          ).toFixed(2)} */}
                                          </span>
                                        ) : (
                                          ""
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </p>
                                    <p className="fee-perc">
                                      {item.settingName == "RENT" ? (
                                        billData?.rent ? (
                                          <span className="fee-percentage">
                                            Fee per Unit{" "}
                                            {lpk
                                              ? billData?.rent.toFixed(1)
                                              : (
                                                  billData?.rent / feePerUnit()
                                                ).toFixed(2)}
                                            {/* {(
                                            billData?.rent / feePerUnit()
                                          ).toFixed(2)} */}
                                          </span>
                                        ) : (
                                          ""
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </p>
                                    <p className="fee-perc">
                                      {item.settingName == "LABOUR_CHARGES" ? (
                                        billData?.labourCharges ? (
                                          <span className="fee-percentage">
                                            Fee per Unit{" "}
                                            {lpk
                                              ? billData?.labourCharges.toFixed(
                                                  1
                                                )
                                              : (
                                                  billData?.labourCharges /
                                                  feePerUnit()
                                                ).toFixed(2)}
                                            {/* {(
                                            billData?.labourCharges /
                                            feePerUnit()
                                          ).toFixed(2)} */}
                                          </span>
                                        ) : (
                                          ""
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </p>
                                    <p className="fee-perc">
                                      <span className="fee-percentage">
                                        {billData?.customFields.map((k) => {
                                          return (
                                            <div>
                                              {k.field == item.settingName ? (
                                                k.fieldType === "COMPLEX_RS" ? (
                                                  <div>
                                                    <span className="fee-percentage">
                                                      Fee per Unit{" "}
                                                      {lpk
                                                        ? k?.fee.toFixed(1)
                                                        : (
                                                            k?.fee /
                                                            feePerUnit()
                                                          ).toFixed(2)}
                                                    </span>
                                                    <p className="fee-percentage">
                                                      {k.comments}
                                                    </p>
                                                  </div>
                                                ) : k.fieldType ===
                                                  "COMPLEX_PERCENTAGE" ? (
                                                  <div>
                                                    <span className="fee-percentage">
                                                      Rate %
                                                      {(
                                                        (k?.fee /
                                                          billData?.grossTotal) *
                                                        100
                                                      ).toFixed(2)}
                                                    </span>
                                                    <p className="fee-percentage">
                                                      {k.comments}
                                                    </p>
                                                  </div>
                                                ) : (
                                                  k.comments
                                                )
                                              ) : (
                                                ""
                                              )}
                                            </div>
                                          );
                                        })}
                                      </span>
                                    </p>
                                    <p className="fee-perc">
                                      {item.settingName == "OTHER_FEE" ? (
                                        billData?.misc ||
                                        (billData?.otherFee &&
                                          billData?.comments) ? (
                                          <span className="fee-percentage">
                                            {billData?.comments}
                                          </span>
                                        ) : (
                                          ""
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </p>
                                  </div>
                                </p>
                              </div>
                            </div>
                            <div className="col-lg-3 p-0">
                              <p className="fee-perc">
                                {billData?.customFields.map((m) => {
                                  return (
                                    <div>
                                      {m.fieldType === "COMPLEX_RS" &&
                                      m.field == item.settingName ? (
                                        <span className="units-cal">
                                          {feePerUnit().toFixed(1)} Units
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  );
                                })}
                              </p>
                              <p className="fee-perc">
                                {item.settingName == "TRANSPORTATION" ? (
                                  billData?.transportation ? (
                                    <span className="units-cal">
                                      {feePerUnit().toFixed(1)} Units
                                    </span>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}
                              </p>
                              <p className="fee-perc">
                                {item.settingName == "RENT" ? (
                                  billData?.rent ? (
                                    <span className="units-cal">
                                      {feePerUnit().toFixed(1)} Units
                                    </span>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}
                              </p>
                              <p className="fee-perc">
                                {item.settingName == "LABOUR_CHARGES" ? (
                                  billData?.labourCharges ? (
                                    <span className="units-cal">
                                      {feePerUnit().toFixed(1)} Units
                                    </span>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}
                              </p>
                            </div>
                            <div className="col-lg-3 p-0">
                              {/* <div className="d-flex"> */}
                              <p className="groups_values">
                                {handleGroupNames(
                                  handleSettingName(item.settingName, item)
                                ) === 0 ? (
                                  " "
                                ) : (
                                  <span>
                                    {billData?.partyType.toUpperCase() ==
                                      "FARMER" &&
                                    item.settingName == "RETURN_COMMISSION" &&
                                    !billData?.less
                                      ? " + " +
                                        handleGroupNames(
                                          item.settingName
                                        ).toFixed(2)
                                      : billData?.partyType.toUpperCase() ==
                                          "BUYER" &&
                                        item.settingName ==
                                          "RETURN_COMMISSION" &&
                                        billData?.less
                                      ? handleGroupNames(
                                          item.settingName
                                        ).toFixed(2)
                                      : billData?.partyType.toUpperCase() ==
                                          "BUYER" &&
                                        item.settingName?.includes(
                                          "CUSTOM_FIELD"
                                        )
                                      ? billData?.customFields.map((i) => {
                                          if (
                                            i.field === item.settingName &&
                                            !i.less
                                          ) {
                                            return (
                                              " + " +
                                              handleGroupNames(
                                                item.settingName
                                              ).toFixed(2)
                                            );
                                          } else if (
                                            i.field === item.settingName &&
                                            i.less
                                          ) {
                                            return handleGroupNames(
                                              item.settingName
                                            ).toFixed(2);
                                          }
                                        })
                                      : billData?.partyType.toUpperCase() ==
                                          "FARMER" &&
                                        item.settingName?.includes(
                                          "CUSTOM_FIELD"
                                        )
                                      ? billData?.customFields.map((i) => {
                                          if (
                                            i.field === item.settingName &&
                                            !i.less
                                          ) {
                                            return (
                                              " + " +
                                              handleGroupNames(
                                                item.settingName
                                              ).toFixed(2)
                                            );
                                          } else if (
                                            i.field === item.settingName &&
                                            i.less
                                          ) {
                                            return handleGroupNames(
                                              item.settingName
                                            ).toFixed(2);
                                          }
                                        })
                                      : // ? " + " + handleGroupNames(item.settingName).toFixed(2)
                                      billData?.partyType.toUpperCase() ==
                                        "BUYER"
                                      ? "+" + handleGroupNames(item.settingName)
                                      : handleGroupNames(
                                          item.settingName
                                        ).toFixed(2)}
                                  </span>
                                )}
                              </p>
                              {/* </div> */}
                            </div>
                          </div>
                        )}

                        <div
                          className={
                            (
                              item.settingName !==
                              handleSettingName(item.settingName, item)
                                ? " "
                                : handleGroupNames(item.settingName) === 0
                            )
                              ? " "
                              : item.settingName?.replaceAll("_", " ")
                              ? "hrs-line"
                              : ""
                          }
                        ></div>
                      </div>
                    );
                  })}
                {groupOneTotal === 0 || null ? (
                  ""
                ) : (
                  <div
                    className="row group-one-total"
                    style={{
                      backgroundColor:
                        pdfThemeData != null
                          ? colorAdjustBg(colorThemeVal, 180) === "#ffffff"
                            ? colorAdjustBg(colorThemeVal, 40)
                            : colorAdjustBg(colorThemeVal, 180)
                          : "#D7F3DD",
                    }}
                  >
                    <div className="pl-0 col-lg-7 pr-0"></div>
                    <div className="col-lg-4 p-0">
                      <p className="groups_values">
                        {groupOneTotal === 0 || null
                          ? ""
                          : (
                              billData?.grossTotal + groupOneTotal
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 2,
                              style: "currency",
                              currency: "INR",
                            })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                {groupTwo
                  .slice()
                  .reverse()
                  .map((item, index) => {
                    return (
                      <div>
                        {(
                          item.settingName !==
                          handleSettingName(item.settingName, item)
                            ? " "
                            : handleGroupNames(item.settingName) === 0
                        ) ? (
                          " "
                        ) : (
                          <div className="row grp_one_row" key={index}>
                            {/* <div className="col-lg-2"></div> */}
                            <div className="col-lg-5">
                              <p className="groups_value">
                                <div>
                                  {(
                                    item.settingName !==
                                    handleSettingName(item.settingName, item)
                                      ? " "
                                      : handleGroupNames(item.settingName) === 0
                                  ) ? (
                                    " "
                                  ) : item.settingName.includes(
                                      "CUSTOM_FIELD"
                                    ) ? (
                                    item.customFieldName
                                  ) : (
                                    <p className="main_setting_name">
                                      {getText(
                                        item.settingName?.replaceAll("_", " ")
                                      )}
                                    </p>
                                  )}{" "}
                                  <p className="fee-perc">
                                    {item.settingName == "COMMISSION" ? (
                                      billData?.comm ? (
                                        <span className="fee-percentage">
                                          Rate %
                                          {(
                                            (billData?.comm /
                                              billData?.grossTotal) *
                                            100
                                          ).toFixed(2)}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                  <p className="fee-perc">
                                    {item.settingName == "RETURN_COMMISSION" ? (
                                      billData?.rtComm ? (
                                        <span className="fee-percentage">
                                          Rate %
                                          {(
                                            (billData?.rtComm /
                                              billData?.grossTotal) *
                                            100
                                          ).toFixed(2)}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                  <p className="fee-perc">
                                    {item.settingName == "MANDI_FEE" ? (
                                      billData?.mandiFee ? (
                                        <span className="fee-percentage">
                                          Rate %
                                          {(
                                            (billData?.mandiFee /
                                              billData?.grossTotal) *
                                            100
                                          ).toFixed(2)}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                  <p className="fee-perc">
                                    {item.settingName == "TRANSPORTATION" ? (
                                      billData?.transportation ? (
                                        <span className="fee-percentage">
                                          Fee per Unit
                                          {lpk
                                            ? billData?.transportation.toFixed(
                                                1
                                              )
                                            : (
                                                billData?.transportation /
                                                feePerUnit()
                                              ).toFixed(2)}
                                          {/* {(
                                            billData?.transportation /
                                            feePerUnit()
                                          ).toFixed(2)} */}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                  <p className="fee-perc">
                                    {item.settingName == "RENT" ? (
                                      billData?.rent ? (
                                        <span className="fee-percentage">
                                          Fee per Unit{" "}
                                          {lpk
                                            ? billData?.rent.toFixed(1)
                                            : (
                                                billData?.rent / feePerUnit()
                                              ).toFixed(2)}
                                          {/* {(
                                            billData?.rent / feePerUnit()
                                          ).toFixed(2)} */}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                  <p className="fee-perc">
                                    {item.settingName == "LABOUR_CHARGES" ? (
                                      billData?.labourCharges ? (
                                        <span className="fee-percentage">
                                          Fee per Unit{" "}
                                          {lpk
                                            ? billData?.labourCharges.toFixed(1)
                                            : (
                                                billData?.labourCharges /
                                                feePerUnit()
                                              ).toFixed(2)}
                                          {/* {(
                                            billData?.labourCharges /
                                            feePerUnit()
                                          ).toFixed(2)} */}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                  <p className="fee-perc">
                                    <span className="fee-percentage">
                                      {billData?.customFields.map((k) => {
                                        return (
                                          <div>
                                            {k.field == item.settingName ? (
                                              k.fieldType === "COMPLEX_RS" ? (
                                                <div>
                                                  <span className="fee-percentage">
                                                    Fee per Unit{" "}
                                                    {lpk
                                                      ? k?.fee.toFixed(1)
                                                      : (
                                                          k?.fee / feePerUnit()
                                                        ).toFixed(2)}
                                                  </span>
                                                  <p className="fee-percentage">
                                                    {k.comments}
                                                  </p>
                                                </div>
                                              ) : k.fieldType ===
                                                "COMPLEX_PERCENTAGE" ? (
                                                <div>
                                                  <span className="fee-percentage">
                                                    Rate %
                                                    {(
                                                      (k?.fee /
                                                        billData?.grossTotal) *
                                                      100
                                                    ).toFixed(2)}
                                                  </span>
                                                  <p className="fee-percentage">
                                                    {k.comments}
                                                  </p>
                                                </div>
                                              ) : (
                                                k.comments
                                              )
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        );
                                      })}
                                    </span>
                                  </p>
                                  <p className="fee-perc">
                                    {item.settingName == "OTHER_FEE" ? (
                                      billData?.misc ||
                                      (billData?.otherFee &&
                                        billData?.comments) ? (
                                        <span className="fee-percentage">
                                          {billData?.comments}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                </div>
                              </p>
                            </div>
                            <div className="col-lg-3 p-0">
                              <p className="fee-perc">
                                {billData?.customFields.map((m) => {
                                  return (
                                    <div>
                                      {m.fieldType === "COMPLEX_RS" &&
                                      m.field == item.settingName ? (
                                        <span className="units-cal">
                                          {feePerUnit().toFixed(1)} Units
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  );
                                })}
                              </p>
                              <p className="fee-perc">
                                {item.settingName == "TRANSPORTATION" ? (
                                  billData?.transportation ? (
                                    <span className="units-cal">
                                      {feePerUnit().toFixed(1)} Units
                                    </span>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}
                              </p>
                              <p className="fee-perc">
                                {item.settingName == "RENT" ? (
                                  billData?.rent ? (
                                    <span className="units-cal">
                                      {feePerUnit().toFixed(1)} Units
                                    </span>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}
                              </p>
                              <p className="fee-perc">
                                {item.settingName == "LABOUR_CHARGES" ? (
                                  billData?.labourCharges ? (
                                    <span className="units-cal">
                                      {feePerUnit().toFixed(1)} Units
                                    </span>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}
                              </p>
                            </div>
                            <div className="col-lg-3 p-0">
                              <p className="groups_values">
                                {handleGroupNames(
                                  handleSettingName(item.settingName, item)
                                ) === 0 ? (
                                  " "
                                ) : (
                                  <span>
                                    {billData?.partyType.toUpperCase() ==
                                      "FARMER" &&
                                    item.settingName == "RETURN_COMMISSION" &&
                                    !billData?.less
                                      ? " + " +
                                        handleGroupNames(
                                          item.settingName
                                        ).toFixed(2)
                                      : billData?.partyType.toUpperCase() ==
                                          "BUYER" &&
                                        item.settingName ==
                                          "RETURN_COMMISSION" &&
                                        billData?.less
                                      ? handleGroupNames(
                                          item.settingName
                                        ).toFixed(2)
                                      : billData?.partyType.toUpperCase() ==
                                          "BUYER" &&
                                        item.settingName?.includes(
                                          "CUSTOM_FIELD"
                                        )
                                      ? billData?.customFields.map((i) => {
                                          if (
                                            i.field === item.settingName &&
                                            !i.less
                                          ) {
                                            return (
                                              " + " +
                                              handleGroupNames(
                                                item.settingName
                                              ).toFixed(2)
                                            );
                                          } else if (
                                            i.field === item.settingName &&
                                            i.less
                                          ) {
                                            return handleGroupNames(
                                              item.settingName
                                            ).toFixed(2);
                                          }
                                        })
                                      : billData?.partyType.toUpperCase() ==
                                          "FARMER" &&
                                        item.settingName?.includes(
                                          "CUSTOM_FIELD"
                                        )
                                      ? billData?.customFields.map((i) => {
                                          if (
                                            i.field === item.settingName &&
                                            !i.less
                                          ) {
                                            return (
                                              " + " +
                                              handleGroupNames(
                                                item.settingName
                                              ).toFixed(2)
                                            );
                                          } else if (
                                            i.field === item.settingName &&
                                            i.less
                                          ) {
                                            return handleGroupNames(
                                              item.settingName
                                            ).toFixed(2);
                                          }
                                        })
                                      : // ? " + " + handleGroupNames(item.settingName).toFixed(2)
                                      billData?.partyType.toUpperCase() ==
                                        "BUYER"
                                      ? "+" +
                                        handleGroupNames(
                                          item.settingName
                                        ).toFixed(2)
                                      : handleGroupNames(
                                          item.settingName
                                        ).toFixed(2)}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        )}

                        <div
                          className={
                            (
                              item.settingName !==
                              handleSettingName(item.settingName, item)
                                ? " "
                                : handleGroupNames(item.settingName) === 0
                            )
                              ? " "
                              : item.settingName?.replaceAll("_", " ")
                              ? "hrs-line"
                              : ""
                          }
                        ></div>
                      </div>
                    );
                  })}
                {groupTwoTotal === 0 || null ? (
                  ""
                ) : (
                  <div
                    className="row group-one-total"
                    style={{
                      backgroundColor:
                        pdfThemeData != null
                          ? colorAdjustBg(colorThemeVal, 180) === "#ffffff"
                            ? colorAdjustBg(colorThemeVal, 40)
                            : colorAdjustBg(colorThemeVal, 180)
                          : "#D7F3DD",
                    }}
                  >
                    <div className="pl-0 col-lg-7 pr-0"></div>
                    <div className="col-lg-4 p-0">
                      <p className="groups_values">
                        {groupTwoTotal === 0 || null
                          ? ""
                          : (
                              billData?.grossTotal +
                              (groupTwoTotal + groupOneTotal)
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 2,
                              style: "currency",
                              currency: "INR",
                            })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                {groupThree
                  .slice()
                  .reverse()
                  .map((item, index) => {
                    return (
                      <div>
                        {(
                          item.settingName !==
                          handleSettingName(item.settingName, item)
                            ? " "
                            : handleGroupNames(item.settingName) === 0
                        ) ? (
                          " "
                        ) : (
                          <div className="row grp_one_row" key={index}>
                            {/* <div className="col-lg-2"></div> */}
                            <div className="col-lg-5">
                              <p className="groups_value">
                                <div>
                                  {(
                                    item.settingName !==
                                    handleSettingName(item.settingName, item)
                                      ? " "
                                      : handleGroupNames(item.settingName) === 0
                                  ) ? (
                                    " "
                                  ) : item.settingName.includes(
                                      "CUSTOM_FIELD"
                                    ) ? (
                                    item.customFieldName
                                  ) : (
                                    <p className="main_setting_name">
                                      {getText(
                                        item.settingName?.replaceAll("_", " ")
                                      )}
                                    </p>
                                  )}
                                  <p className="fee-perc">
                                    {item.settingName == "COMMISSION" ? (
                                      billData?.comm ? (
                                        <span className="fee-percentage">
                                          Rate %
                                          {(
                                            (billData?.comm /
                                              billData?.grossTotal) *
                                            100
                                          ).toFixed(2)}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                  <p className="fee-perc">
                                    {item.settingName == "RETURN_COMMISSION" ? (
                                      billData?.rtComm ? (
                                        <span className="fee-percentage">
                                          Rate %
                                          {(
                                            (billData?.rtComm /
                                              billData?.grossTotal) *
                                            100
                                          ).toFixed(2)}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                  <p className="fee-perc">
                                    {item.settingName == "MANDI_FEE" ? (
                                      billData?.mandiFee ? (
                                        <span className="fee-percentage">
                                          Rate %
                                          {(
                                            (billData?.mandiFee /
                                              billData?.grossTotal) *
                                            100
                                          ).toFixed(2)}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                  <p className="fee-perc">
                                    {item.settingName == "TRANSPORTATION" ? (
                                      billData?.transportation ? (
                                        <span className="fee-percentage">
                                          Fee per Unit
                                          {lpk
                                            ? billData?.transportation.toFixed(
                                                1
                                              )
                                            : (
                                                billData?.transportation /
                                                feePerUnit()
                                              ).toFixed(2)}
                                          {/* {(
                                            billData?.transportation /
                                            feePerUnit()
                                          ).toFixed(2)} */}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                  <p className="fee-perc">
                                    {item.settingName == "RENT" ? (
                                      billData?.rent ? (
                                        <span className="fee-percentage">
                                          Fee per Unit{" "}
                                          {lpk
                                            ? billData?.rent.toFixed(1)
                                            : (
                                                billData?.rent / feePerUnit()
                                              ).toFixed(2)}
                                          {/* {(
                                            billData?.rent / feePerUnit()
                                          ).toFixed(2)} */}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                  <p className="fee-perc">
                                    {item.settingName == "LABOUR_CHARGES" ? (
                                      billData?.labourCharges ? (
                                        <span className="fee-percentage">
                                          Fee per Unit{" "}
                                          {lpk
                                            ? billData?.labourCharges.toFixed(1)
                                            : (
                                                billData?.labourCharges /
                                                feePerUnit()
                                              ).toFixed(2)}
                                          {/* {(
                                            billData?.labourCharges /
                                            feePerUnit()
                                          ).toFixed(2)} */}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                  <p className="fee-perc">
                                    <span className="fee-percentage">
                                      {billData?.customFields.map((k) => {
                                        return (
                                          <div>
                                            {k.field == item.settingName ? (
                                              k.fieldType === "COMPLEX_RS" ? (
                                                <div>
                                                  <span className="fee-percentage">
                                                    Fee per Unit{" "}
                                                    {lpk
                                                      ? k?.fee.toFixed(1)
                                                      : (
                                                          k?.fee / feePerUnit()
                                                        ).toFixed(2)}
                                                  </span>
                                                  <p className="fee-percentage">
                                                    {k.comments}
                                                  </p>
                                                </div>
                                              ) : k.fieldType ===
                                                "COMPLEX_PERCENTAGE" ? (
                                                <div>
                                                  <span className="fee-percentage">
                                                    Rate %
                                                    {(
                                                      (k?.fee /
                                                        billData?.grossTotal) *
                                                      100
                                                    ).toFixed(2)}
                                                  </span>
                                                  <p className="fee-percentage">
                                                    {k.comments}
                                                  </p>
                                                </div>
                                              ) : (
                                                k.comments
                                              )
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        );
                                      })}
                                    </span>
                                  </p>
                                  <p className="fee-perc">
                                    {item.settingName == "OTHER_FEE" ? (
                                      billData?.misc ||
                                      (billData?.otherFee &&
                                        billData?.comments) ? (
                                        <span className="fee-percentage">
                                          {billData?.comments}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                </div>
                              </p>
                            </div>
                            <div className="col-lg-3">
                              <p className="fee-perc">
                                {billData?.customFields.map((m) => {
                                  return (
                                    <div>
                                      {m.fieldType === "COMPLEX_RS" &&
                                      m.field == item.settingName ? (
                                        <span className="units-cal">
                                          {feePerUnit().toFixed(1)} Units
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  );
                                })}
                              </p>
                              <p className="fee-perc">
                                {item.settingName == "TRANSPORTATION" ? (
                                  billData?.transportation ? (
                                    <span className="units-cal">
                                      {feePerUnit().toFixed(1)} Units
                                    </span>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}
                              </p>
                              <p className="fee-perc">
                                {item.settingName == "RENT" ? (
                                  billData?.rent ? (
                                    <span className="units-cal">
                                      {feePerUnit().toFixed(1)} Units
                                    </span>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}
                              </p>
                              <p className="fee-perc">
                                {item.settingName == "LABOUR_CHARGES" ? (
                                  billData?.labourCharges ? (
                                    <span className="units-cal">
                                      {feePerUnit().toFixed(1)} Units
                                    </span>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}
                              </p>
                            </div>
                            <div className="col-lg-3 p-0">
                              <p className="groups_values">
                                {handleGroupNames(
                                  handleSettingName(item.settingName, item)
                                ) === 0 ? (
                                  " "
                                ) : (
                                  <span>
                                    {billData?.partyType.toUpperCase() ==
                                      "FARMER" &&
                                    item.settingName == "RETURN_COMMISSION" &&
                                    !billData?.less
                                      ? " + " +
                                        handleGroupNames(
                                          item.settingName
                                        ).toFixed(2)
                                      : billData?.partyType.toUpperCase() ==
                                          "BUYER" &&
                                        item.settingName ==
                                          "RETURN_COMMISSION" &&
                                        billData?.less
                                      ? handleGroupNames(
                                          item.settingName
                                        ).toFixed(2)
                                      : billData?.partyType.toUpperCase() ==
                                          "BUYER" &&
                                        item.settingName?.includes(
                                          "CUSTOM_FIELD"
                                        )
                                      ? billData?.customFields.map((i) => {
                                          if (
                                            i.field === item.settingName &&
                                            !i.less
                                          ) {
                                            return (
                                              " + " +
                                              handleGroupNames(
                                                item.settingName
                                              ).toFixed(2)
                                            );
                                          } else if (
                                            i.field === item.settingName &&
                                            i.less
                                          ) {
                                            return handleGroupNames(
                                              item.settingName
                                            ).toFixed(2);
                                          }
                                        })
                                      : billData?.partyType.toUpperCase() ==
                                          "FARMER" &&
                                        item.settingName?.includes(
                                          "CUSTOM_FIELD"
                                        )
                                      ? billData?.customFields.map((i) => {
                                          if (
                                            i.field === item.settingName &&
                                            !i.less
                                          ) {
                                            return (
                                              " + " +
                                              handleGroupNames(
                                                item.settingName
                                              ).toFixed(2)
                                            );
                                          } else if (
                                            i.field === item.settingName &&
                                            i.less
                                          ) {
                                            return handleGroupNames(
                                              item.settingName
                                            ).toFixed(2);
                                          }
                                        })
                                      : // ? " + " + handleGroupNames(item.settingName).toFixed(2)
                                      billData?.partyType.toUpperCase() ==
                                        "BUYER"
                                      ? "+" + handleGroupNames(item.settingName)
                                      : handleGroupNames(
                                          item.settingName
                                        ).toFixed(2)}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        )}

                        <div
                          className={
                            (
                              item.settingName !==
                              handleSettingName(item.settingName, item)
                                ? " "
                                : handleGroupNames(item.settingName) === 0
                            ) ? (
                              " "
                            ) : <p className="main_setting_name">
                                {getText(
                                  item.settingName?.replaceAll("_", " ")
                                )}
                              </p> ? (
                              //  item.settingName?.replaceAll("_", " ")
                              "hrs-line"
                            ) : (
                              ""
                            )
                          }
                        ></div>
                      </div>
                    );
                  })}
                {groupThreeTotal === 0 || null ? (
                  ""
                ) : (
                  <div
                    className="row group-one-total"
                    style={{
                      backgroundColor:
                        pdfThemeData != null
                          ? colorAdjustBg(colorThemeVal, 180) === "#ffffff"
                            ? colorAdjustBg(colorThemeVal, 40)
                            : colorAdjustBg(colorThemeVal, 180)
                          : "#D7F3DD",
                    }}
                  >
                    <div className="pl-0 col-lg-7 pr-0"></div>
                    <div className="col-lg-4 p-0">
                      <p className="groups_values">
                        {groupThreeTotal === 0 || null
                          ? ""
                          : (
                              billData?.grossTotal +
                              (groupThreeTotal + groupTwoTotal + groupOneTotal)
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 2,
                              style: "currency",
                              currency: "INR",
                            })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                {groupFour
                  .slice()
                  .reverse()
                  .map((item, index) => {
                    return (
                      <div>
                        {(
                          item.settingName !==
                          handleSettingName(item.settingName, item)
                            ? " "
                            : handleGroupNames(item.settingName) === 0
                        ) ? (
                          " "
                        ) : (
                          <div className="row grp_one_row" key={index}>
                            {/* <div className="col-lg-2"></div> */}
                            <div className="col-lg-5">
                              <p className="groups_value">
                                <div>
                                  {(
                                    item.settingName !==
                                    handleSettingName(item.settingName, item)
                                      ? " "
                                      : handleGroupNames(item.settingName) === 0
                                  )
                                    ? " "
                                    : item.settingName.includes("CUSTOM_FIELD")
                                    ? item.customFieldName
                                    : item.settingName?.replaceAll(
                                        "_",
                                        " "
                                      )}{" "}
                                  <p className="fee-perc">
                                    {item.settingName == "COMMISSION" ? (
                                      billData?.comm ? (
                                        <span className="fee-percentage">
                                          Rate %
                                          {(
                                            (billData?.comm /
                                              billData?.grossTotal) *
                                            100
                                          ).toFixed(2)}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                  <p className="fee-perc">
                                    {item.settingName == "RETURN_COMMISSION" ? (
                                      billData?.rtComm ? (
                                        <span className="fee-percentage">
                                          Rate %
                                          {(
                                            (billData?.rtComm /
                                              billData?.grossTotal) *
                                            100
                                          ).toFixed(2)}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                  <p className="fee-perc">
                                    {item.settingName == "MANDI_FEE" ? (
                                      billData?.mandiFee ? (
                                        <span className="fee-percentage">
                                          Rate %
                                          {(
                                            (billData?.mandiFee /
                                              billData?.grossTotal) *
                                            100
                                          ).toFixed(2)}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                  <p className="fee-perc">
                                    {item.settingName == "TRANSPORTATION" ? (
                                      billData?.transportation ? (
                                        <span className="fee-percentage">
                                          Fee per Unit
                                          {lpk
                                            ? billData?.transportation.toFixed(
                                                1
                                              )
                                            : (
                                                billData?.transportation /
                                                feePerUnit()
                                              ).toFixed(2)}
                                          {/* {(
                                            billData?.transportation /
                                            feePerUnit()
                                          ).toFixed(2)} */}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                  <p className="fee-perc">
                                    {item.settingName == "RENT" ? (
                                      billData?.rent ? (
                                        <span className="fee-percentage">
                                          Fee per Unit{" "}
                                          {lpk
                                            ? billData?.rent.toFixed(1)
                                            : (
                                                billData?.rent / feePerUnit()
                                              ).toFixed(2)}
                                          {/* {(
                                            billData?.rent / feePerUnit()
                                          ).toFixed(2)} */}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                  <p className="fee-perc">
                                    {item.settingName == "LABOUR_CHARGES" ? (
                                      billData?.labourCharges ? (
                                        <span className="fee-percentage">
                                          Fee per Unit{" "}
                                          {lpk
                                            ? billData?.labourCharges.toFixed(1)
                                            : (
                                                billData?.labourCharges /
                                                feePerUnit()
                                              ).toFixed(2)}
                                          {/* {(
                                            billData?.labourCharges /
                                            feePerUnit()
                                          ).toFixed(2)} */}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                  <p className="fee-perc">
                                    <span className="fee-percentage">
                                      {billData?.customFields.map((k) => {
                                        return (
                                          <div>
                                            {k.field == item.settingName ? (
                                              k.fieldType === "COMPLEX_RS" ? (
                                                <div>
                                                  <span className="fee-percentage">
                                                    Fee per Unit{" "}
                                                    {lpk
                                                      ? k?.fee.toFixed(1)
                                                      : (
                                                          k?.fee / feePerUnit()
                                                        ).toFixed(2)}
                                                  </span>
                                                  <p className="fee-percentage">
                                                    {k.comments}
                                                  </p>
                                                </div>
                                              ) : k.fieldType ===
                                                "COMPLEX_PERCENTAGE" ? (
                                                <div>
                                                  <span className="fee-percentage">
                                                    Rate %
                                                    {(
                                                      (k?.fee /
                                                        billData?.grossTotal) *
                                                      100
                                                    ).toFixed(2)}
                                                  </span>
                                                  <p className="fee-percentage">
                                                    {k.comments}
                                                  </p>
                                                </div>
                                              ) : (
                                                k.comments
                                              )
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        );
                                      })}
                                    </span>
                                  </p>
                                  <p className="fee-perc">
                                    {item.settingName == "OTHER_FEE" ? (
                                      billData?.misc ||
                                      (billData?.otherFee &&
                                        billData?.comments) ? (
                                        <span className="fee-percentage">
                                          {billData?.comments}
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                </div>
                              </p>
                            </div>
                            <div className="col-lg-3 p-0">
                              <p className="fee-perc">
                                {billData?.customFields.map((m) => {
                                  return (
                                    <div>
                                      {m.fieldType === "COMPLEX_RS" &&
                                      m.field == item.settingName ? (
                                        <span className="units-cal">
                                          {feePerUnit().toFixed(1)} Units
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  );
                                })}
                              </p>
                              <p className="fee-perc">
                                {item.settingName == "TRANSPORTATION" ? (
                                  billData?.transportation ? (
                                    <span className="units-cal">
                                      {feePerUnit().toFixed(1)} Units
                                    </span>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}
                              </p>
                              <p className="fee-perc">
                                {item.settingName == "RENT" ? (
                                  billData?.rent ? (
                                    <span className="units-cal">
                                      {feePerUnit().toFixed(1)} Units
                                    </span>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}
                              </p>
                              <p className="fee-perc">
                                {item.settingName == "LABOUR_CHARGES" ? (
                                  billData?.labourCharges ? (
                                    <span className="units-cal">
                                      {feePerUnit().toFixed(1)} Units
                                    </span>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}
                              </p>
                            </div>
                            <div className="col-lg-3 p-0">
                              <p className="groups_values">
                                {handleGroupNames(
                                  handleSettingName(item.settingName, item)
                                ) === 0 ? (
                                  " "
                                ) : (
                                  <span>
                                    {billData?.partyType.toUpperCase() ==
                                      "FARMER" &&
                                    item.settingName == "RETURN_COMMISSION" &&
                                    !billData?.less
                                      ? " + " +
                                        handleGroupNames(
                                          item.settingName
                                        ).toFixed(2)
                                      : billData?.partyType.toUpperCase() ==
                                          "BUYER" &&
                                        item.settingName ==
                                          "RETURN_COMMISSION" &&
                                        billData?.less
                                      ? handleGroupNames(
                                          item.settingName
                                        ).toFixed(2)
                                      : billData?.partyType.toUpperCase() ==
                                          "BUYER" &&
                                        item.settingName?.includes(
                                          "CUSTOM_FIELD"
                                        )
                                      ? billData?.customFields.map((i) => {
                                          if (
                                            i.field === item.settingName &&
                                            !i.less
                                          ) {
                                            return (
                                              " + " +
                                              handleGroupNames(
                                                item.settingName
                                              ).toFixed(2)
                                            );
                                          } else if (
                                            i.field === item.settingName &&
                                            i.less
                                          ) {
                                            return handleGroupNames(
                                              item.settingName
                                            ).toFixed(2);
                                          }
                                        })
                                      : billData?.partyType.toUpperCase() ==
                                          "FARMER" &&
                                        item.settingName?.includes(
                                          "CUSTOM_FIELD"
                                        )
                                      ? billData?.customFields.map((i) => {
                                          if (
                                            i.field === item.settingName &&
                                            !i.less
                                          ) {
                                            return (
                                              " + " +
                                              handleGroupNames(
                                                item.settingName
                                              ).toFixed(2)
                                            );
                                          } else if (
                                            i.field === item.settingName &&
                                            i.less
                                          ) {
                                            return handleGroupNames(
                                              item.settingName
                                            ).toFixed(2);
                                          }
                                        })
                                      : // ? " + " + handleGroupNames(item.settingName).toFixed(2)
                                      billData?.partyType.toUpperCase() ==
                                        "BUYER"
                                      ? "+" +
                                        handleGroupNames(
                                          item.settingName
                                        ).toFixed(2)
                                      : handleGroupNames(
                                          item.settingName
                                        ).toFixed(2)}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        )}

                        <div
                          className={
                            (
                              item.settingName !==
                              handleSettingName(item.settingName, item)
                                ? " "
                                : handleGroupNames(item.settingName) === 0
                            )
                              ? " "
                              : item.settingName?.replaceAll("_", " ")
                              ? "hrs-line"
                              : ""
                          }
                        ></div>
                      </div>
                    );
                  })}
                {groupFourTotal === 0 || null ? (
                  ""
                ) : (
                  <div
                    className="row group-one-total"
                    style={{
                      backgroundColor:
                        pdfThemeData != null
                          ? colorAdjustBg(colorThemeVal, 180) === "#ffffff"
                            ? colorAdjustBg(colorThemeVal, 40)
                            : colorAdjustBg(colorThemeVal, 180)
                          : "#D7F3DD",
                    }}
                  >
                    <div className="pl-0 col-lg-7 pr-0"></div>
                    <div className="col-lg-4 p-0">
                      <p className="groups_values">
                        {groupFourTotal === 0 || null
                          ? ""
                          : (
                              billData?.grossTotal +
                              (groupFourTotal +
                                groupThreeTotal +
                                groupTwoTotal +
                                groupOneTotal)
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 2,
                              style: "currency",
                              currency: "INR",
                            })}
                      </p>
                    </div>
                    {/* <div
                   className={
                     groupFourTotal === 0 || null ? "" : "hr-line-in-totals"
                   }
                 ></div> */}
                  </div>
                )}
              </div>
              <div>
                <div className="row">
                  {/* <div className="col-lg-2"></div> */}
                  <div className="col-lg-7">
                    {billData?.grossTotal +
                      (groupFourTotal +
                        groupThreeTotal +
                        groupTwoTotal +
                        groupOneTotal) +
                      billData?.totalPayables ===
                    0 ? (
                      ""
                    ) : (
                      <p className="grouping_value">Total Bill Amount :</p>
                    )}
                  </div>
                  <div className="col-lg-4 p-0">
                    <p
                      className={
                        billData?.partyType.toUpperCase() === "FARMER"
                          ? "groups_values color_red"
                          : "groups_values color_green"
                      }
                    >
                      {totalBillAmount != 0
                        ? getCurrencyNumberWithSymbol(totalBillAmount)
                        : 0}
                    </p>
                  </div>
                </div>
                {billData?.partyType.toUpperCase() === "FARMER" ? (
                  billData?.advance === 0 || billData?.advance === null ? (
                    ""
                  ) : (
                    <div className="row">
                      {/* <div className="col-lg-2"></div> */}
                      <div className="col-lg-7">
                        <p className="grouping_value p-0 adv_out_bottom">
                          Advances :
                        </p>

                        <span class="fee-percentage color_red">
                          Outstanding Advances :{" "}
                          {billData?.advBal ? billData?.advBal : outBalAdvance}
                        </span>
                      </div>
                      <div className="col-lg-4 p-0">
                        <p className="groups_values color_red">
                          {"-" + getCurrencyNumberWithSymbol(billData?.advance)}
                        </p>
                      </div>
                    </div>
                  )
                ) : (
                  ""
                )}

                {billData?.partyType.toUpperCase() === "FARMER" ? (
                  <div className="row">
                    {/* <div className="col-lg-2"></div> */}
                    <div className="col-lg-7">
                      <p className="grouping_value">Total Payables :</p>
                    </div>
                    <div className="col-lg-4 p-0">
                      <p
                        className={
                          billData?.partyType.toUpperCase() === "FARMER"
                            ? "groups_values color_red"
                            : "groups_values color_green"
                        }
                      >
                        {billData?.partyType.toUpperCase() === "FARMER"
                          ? getCurrencyNumberWithSymbol(
                              totalBillAmount - billData?.advance
                            )
                          : getCurrencyNumberWithSymbol(
                              totalBillAmount + billData?.advance
                            )}
                      </p>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div></div>
              <div>
                <div className="row align-items-center">
                  {/* <div className="col-lg-2"></div> */}
                  <div className="col-lg-7">
                    <p
                      className="grouping_value p-0"
                      style={{ display: status ? "block" : "none" }}
                    >
                      Outstanding Balance:
                    </p>
                    <p
                      class="fee-percentage"
                      style={{ display: status ? "block" : "none" }}
                    >
                      {"Balance as on " +
                        moment(billData?.timeStamp).format(
                          "DD-MMM-YY | hh:mm:A"
                        )}
                    </p>
                  </div>
                  <div className="col-lg-4 p-0">
                    <p
                      className={
                        billData?.partyType.toUpperCase() === "FARMER"
                          ? "groups_values color_red"
                          : "groups_values color_green"
                      }
                      style={{ display: status ? "block" : "none" }}
                    >
                      {billData?.outStBal.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                        style: "currency",
                        currency: "INR",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-7">
                  <p
                    className="grouping_value"
                    style={{
                      display:
                        status || allGroups.length > 0 ? "block" : "none",
                    }}
                  >
                    Final Ledger Balance:
                  </p>
                </div>
                <div className="col-lg-4 p-0">
                  <span
                    className={
                      billData?.partyType.toUpperCase() === "FARMER"
                        ? "groups_values color_red text-right"
                        : "groups_values color_green text-right"
                    }
                    style={{
                      display:
                        status || allGroups.length > 0 ? "block" : "none",
                    }}
                  >
                    {getCurrencyNumberWithSymbol(getFinalLedgerbalance())}
                  </span>
                </div>
              </div>

              <div>
                {billData?.partyType.toUpperCase() === "FARMER" ? (
                  <div className="row">
                    {/* <div className="col-lg-2"></div> */}
                    <div className="col-lg-7">
                      {billData?.cashPaid === 0 ? (
                        "" || billData?.cashPaid === null
                      ) : (
                        <div>
                          <p className="grouping_value color_red pb-0">
                            Cash Paid :
                          </p>
                          <p className="grouping_value pt-0">
                            {billData?.cashPaidCmnt}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="col-lg-4 p-0">
                      <p className="groups_values color_red">
                        {billData?.cashPaid === 0 || billData?.cashPaid === null
                          ? " "
                          : "-" +
                            getCurrencyNumberWithSymbol(billData?.cashPaid)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    {/* <div className="col-lg-2"></div> */}
                    <div className="col-lg-7">
                      {billData?.cashRcvd === 0 ||
                      billData?.cashRcvd === null ? (
                        ""
                      ) : (
                        <p className="grouping_value color_red">
                          Cash Received :
                        </p>
                      )}
                    </div>
                    <div className="col-lg-4 p-0">
                      <p className="groups_values color_red">
                        {billData?.cashRcvd === 0 || billData?.cashRcvd === null
                          ? ""
                          : "-" +
                            getCurrencyNumberWithSymbol(billData?.cashRcvd)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {!status && allGroups.length == 0 ? (
          <div
            className="row out-st-bal align-items-center"
            style={{
              backgroundColor:
                pdfThemeData != null
                  ? colorAdjustBg(colorThemeVal, 180) === "#ffffff"
                    ? colorAdjustBg(colorThemeVal, 40)
                    : colorAdjustBg(colorThemeVal, 180)
                  : "#D7F3DD",
            }}
          >
            <div className="col-lg-2">
              <div className="d-flex footer-img">
                <img src={ono_connect_click} alt="ono_connect" />
              </div>
            </div>

            <div className="col-lg-3"></div>
            {billData?.partyType.toUpperCase() === "FARMER" ? (
              <div className="col-lg-7 p-0">
                <div className="row">
                  <div className="col-lg-6">
                    {billData?.totalPayables === 0 ? (
                      "" || billData?.totalPayables === null
                    ) : (
                      <p
                        className="groups_value billview_bal"
                        style={{ display: !status ? "block" : "none" }}
                      >
                        Total Payables:
                      </p>
                    )}
                  </div>
                  <div className="col-lg-5 p-0">
                    <p
                      className="groups_value color_red billview_bal billview_bal_val"
                      style={{ display: !status ? "block" : "none" }}
                    >
                      {billData?.totalPayables === 0 ||
                      billData?.totalPayables === null
                        ? " "
                        : getCurrencyNumberWithSymbol(billData?.totalPayables)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-lg-7 p-0">
                <div className="row">
                  <div className="col-lg-6">
                    {billData?.totalReceivable === 0 ||
                    billData?.totalReceivable === null ? (
                      ""
                    ) : (
                      <p
                        className="groups_value billview_bal"
                        style={{ display: !status ? "block" : "none" }}
                      >
                        Total Receivables:
                      </p>
                    )}
                  </div>
                  <div className="col-lg-5 p-0">
                    {billData?.totalReceivable === 0 ||
                    billData?.totalReceivable === null ? (
                      ""
                    ) : (
                      <p
                        className="groups_value color_green billview_bal billview_bal_val"
                        style={{ display: !status ? "block" : "none" }}
                      >
                        {getCurrencyNumberWithSymbol(billData?.totalReceivable)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className="row out-st-bal align-items-center"
            style={{
              backgroundColor:
                pdfThemeData != null
                  ? colorAdjustBg(colorThemeVal, 180) === "#ffffff"
                    ? colorAdjustBg(colorThemeVal, 40)
                    : colorAdjustBg(colorThemeVal, 180)
                  : "#D7F3DD",
            }}
          >
            <div className="col-lg-2">
              <div className="d-flex footer-img">
                <img src={ono_connect_click} alt="ono_connect" />
              </div>
            </div>

            <div className="col-lg-3"></div>
            <div className="col-lg-7 pr-0">
              <div className="row">
                <div className="col-lg-7 p-0">
                  <p
                    className="out-st pt-0 pl-0 text-left"
                    style={{
                      display:
                        status || allGroups.length > 0 ? "block" : "none",
                    }}
                  >
                    Final Outstanding Balance:
                  </p>
                </div>
                <div className="col-lg-5 p-0">
                  <span
                    className={
                      billData?.partyType.toUpperCase() === "FARMER"
                        ? "out-value pt-0 color_red text-right"
                        : "out-value pt-0 color_green text-right"
                    }
                    style={{
                      display:
                        status || allGroups.length > 0 ? "block" : "none",
                    }}
                  >
                    {getCurrencyNumberWithSymbol(getFinalOutBalance())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupTotals;
