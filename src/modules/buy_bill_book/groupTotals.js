import React from 'react'
import {
    getCurrencyNumberWithOneDigit,
    getCurrencyNumberWithOutSymbol,
    getCurrencyNumberWithSymbol,
} from "../../components/getCurrencyNumber";
import { useEffect } from 'react';
import { useState } from 'react';
import { getSystemSettings } from '../../actions/billCreationService';
import { useSelector } from 'react-redux';
import ono_connect_click from "../../assets/images/ono-click-connect.svg";
const GroupTotals = () => {
    var groupOneTotal = 0;
  var groupTwoTotal = 0;
  var groupThreeTotal = 0;
  var groupFourTotal = 0;

  const  billData = useSelector((state)=> state.billViewInfo);
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const clientId = loginData.authKeys.clientId;
  const clientSecret = loginData.authKeys.clientSecret;
  const [billSettingResponse, billSettingData] = useState([]);

  var groupOne = [];
  var grouptwo = [];
  var groupthree = [];
  var groupfour = [];
  useEffect(() => {
    getBuyBillsById();
  }, []);
  const [groupone, setGroupOne] = useState([]);
  const [groupTwo, setGroupTwo] = useState([]);
  const [groupThree, setGroupThree] = useState([]);
  const [groupFour, setGroupFour] = useState([]);

  const [includeComm, setIncludeComm] = useState("");
  const [includeRetComm, setIncludeRetComm] = useState("");
  const [addRetComm, setAddRetComm] = useState(false);
  const [status, setStatus] = useState(false);
  const [isShown, setisShown] = useState(false);
  
  const getBuyBillsById = () => {
    getSystemSettings(clickId, clientId, clientSecret).then((res) => {
      billSettingData(res.data.data.billSetting);
      console.log(res.data.data.billSetting)
      for (var i = 0; i < res.data.data.billSetting.length; i++) {
        if(billData.billViewInfo.partyType.toUpperCase()==='FARMER'){
          if (
            res.data.data.billSetting[i].groupId === 1 &&
            res.data.data.billSetting[i].billType === "BUY" &&
            res.data.data.billSetting[i].formStatus === 1
          ) {
            if (res.data.data.billSetting[i].settingName === "COMMISSION") {
              setIncludeComm(
                res.data.data.billSetting[i].includeInLedger == 1 ? true : false
              );
            }
            if (res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE") {
              setStatus(true);
            } else if (
              res.data.data.billSetting[i].settingName === "RETURN_COMMISSION"
            ) {
              setAddRetComm(
                res.data.data.billSetting[i].addToGt == 1 ? true : false
              );
              setIncludeRetComm(
                res.data.data.billSetting[i].includeInLedger == 1 ? true : false
              );
            }
            groupOne = [res.data.data.billSetting[i], ...groupOne];
            setGroupOne([groupone, ...groupOne]);
          } else if (
            res.data.data.billSetting[i].groupId === 2 &&
            res.data.data.billSetting[i].billType === "BUY" &&
            res.data.data.billSetting[i].formStatus === 1
          ) {
            if (res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE") {
              setStatus(true);
            }
            if (res.data.data.billSetting[i].settingName === "COMMISSION") {
              setIncludeComm(
                res.data.data.billSetting[i].includeInLedger == 1 ? true : false
              );
            } else if (
              res.data.data.billSetting[i].settingName === "RETURN_COMMISSION"
            ) {
              setAddRetComm(
                res.data.data.billSetting[i].addToGt == 1 ? true : false
              );
              setIncludeRetComm(
                res.data.data.billSetting[i].includeInLedger == 1 ? true : false
              );
            }
            grouptwo = [res.data.data.billSetting[i], ...grouptwo];
            setGroupTwo([groupTwo, ...grouptwo]);
          } else if (
            res.data.data.billSetting[i].groupId === 3 &&
            res.data.data.billSetting[i].billType === "BUY" &&
            res.data.data.billSetting[i].formStatus === 1
          ) {
            if (res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE") {
              setStatus(true);
            }
            if (res.data.data.billSetting[i].settingName === "COMMISSION") {
              setIncludeComm(
                res.data.data.billSetting[i].includeInLedger == 1 ? true : false
              );
            } else if (
              res.data.data.billSetting[i].settingName === "RETURN_COMMISSION"
            ) {
              setAddRetComm(
                res.data.data.billSetting[i].addToGt == 1 ? true : false
              );
              setIncludeRetComm(
                res.data.data.billSetting[i].includeInLedger == 1 ? true : false
              );
            }
            groupthree = [res.data.data.billSetting[i], ...groupthree];
            setGroupThree([groupThree, ...groupthree]);
          } else if (
            res.data.data.billSetting[i].groupId === 4 &&
            res.data.data.billSetting[i].billType === "BUY" &&
            res.data.data.billSetting[i].formStatus === 1
          ) {
            if (res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE") {
              setStatus(true);
            }
            if (res.data.data.billSetting[i].settingName === "COMMISSION") {
              setIncludeComm(
                res.data.data.billSetting[i].includeInLedger == 1 ? true : false
              );
            } else if (
              res.data.data.billSetting[i].settingName === "RETURN_COMMISSION"
            ) {
              setAddRetComm(
                res.data.data.billSetting[i].addToGt == 1 ? true : false
              );
              setIncludeRetComm(
                res.data.data.billSetting[i].includeInLedger == 1 ? true : false
              );
            }
            groupfour = [res.data.data.billSetting[i], ...groupfour];
            setGroupFour([groupFour, ...groupfour]);
          }
        }
        else{
          if (
            res.data.data.billSetting[i].groupId === 1 &&
            res.data.data.billSetting[i].billType === "SELL" &&
            res.data.data.billSetting[i].formStatus === 1
        ) {
            if (res.data.data.billSetting[i].settingName === "COMMISSION") {
                setIncludeComm(
                    res.data.data.billSetting[i].includeInLedger == 1 ? true : false
                );
                setisShown(res.data.data.billSetting[i].isShown == 1 ? true : false)
                if (!(res.data.data.billSetting[i].isShown)) {
                    setStatus(true);
                }
            }
            if (res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE") {
                setStatus(true);
            } else if (
                res.data.data.billSetting[i].settingName === "RETURN_COMMISSION"
            ) {
                setAddRetComm(
                    res.data.data.billSetting[i].addToGt == 1 ? true : false
                );
                setIncludeRetComm(
                    res.data.data.billSetting[i].includeInLedger == 1 ? true : false
                );
            }
            groupOne = [res.data.data.billSetting[i], ...groupOne];
            setGroupOne([groupone, ...groupOne]);
        } else if (
            res.data.data.billSetting[i].groupId === 2 &&
            res.data.data.billSetting[i].billType === "SELL" &&
            res.data.data.billSetting[i].formStatus === 1
        ) {
            if (res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE") {
                setStatus(true);
            }
            if (res.data.data.billSetting[i].settingName === "COMMISSION") {
                setIncludeComm(
                    res.data.data.billSetting[i].includeInLedger == 1 ? true : false
                );
                setisShown(res.data.data.billSetting[i].isShown == 1 ? true : false)
            } else if (
                res.data.data.billSetting[i].settingName === "RETURN_COMMISSION"
            ) {
                setAddRetComm(
                    res.data.data.billSetting[i].addToGt == 1 ? true : false
                );
                setIncludeRetComm(
                    res.data.data.billSetting[i].includeInLedger == 1 ? true : false
                );
            }
            grouptwo = [res.data.data.billSetting[i], ...grouptwo];
            setGroupTwo([groupTwo, ...grouptwo]);
        } else if (
            res.data.data.billSetting[i].groupId === 3 &&
            res.data.data.billSetting[i].billType === "SELL" &&
            res.data.data.billSetting[i].formStatus === 1
        ) {
            if (res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE") {
                setStatus(true);
            }
            if (res.data.data.billSetting[i].settingName === "COMMISSION") {
                setIncludeComm(
                    res.data.data.billSetting[i].includeInLedger == 1 ? true : false
                );
                setisShown(res.data.data.billSetting[i].isShown == 1 ? true : false)
            } else if (
                res.data.data.billSetting[i].settingName === "RETURN_COMMISSION"
            ) {
                setAddRetComm(
                    res.data.data.billSetting[i].addToGt == 1 ? true : false
                );
                setIncludeRetComm(
                    res.data.data.billSetting[i].includeInLedger == 1 ? true : false
                );
            }
            groupthree = [res.data.data.billSetting[i], ...groupthree];
            setGroupThree([groupThree, ...groupthree]);
        } else if (
            res.data.data.billSetting[i].groupId === 4 &&
            res.data.data.billSetting[i].billType === "SELL" &&
            res.data.data.billSetting[i].formStatus === 1
        ) {
            if (res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE") {
                setStatus(true);
            }
            if (res.data.data.billSetting[i].settingName === "COMMISSION") {
                setIncludeComm(
                    res.data.data.billSetting[i].includeInLedger == 1 ? true : false
                );
                setisShown(res.data.data.billSetting[i].isShown == 1 ? true : false)
            } else if (
                res.data.data.billSetting[i].settingName === "RETURN_COMMISSION"
            ) {
                setAddRetComm(
                    res.data.data.billSetting[i].addToGt == 1 ? true : false
                );
                setIncludeRetComm(
                    res.data.data.billSetting[i].includeInLedger == 1 ? true : false
                );
            }
            groupfour = [res.data.data.billSetting[i], ...groupfour];
            setGroupFour([groupFour, ...groupfour]);
        }
        }
      }
    });
  };

  const handleGroupNames = (name) => {
    var value = 0;
    var substring = "CUSTOM_FIELD";
    if (name?.includes(substring)) {
      substring = name;
    }
    switch (name) {
      case "COMMISSION":
        if(billData.billViewInfo.partyType.toUpperCase()==='FARMER'){
          value = -billData.billViewInfo?.comm;
        } else{
          value = billData.billViewInfo?.commShown ? billData.billViewInfo?.comm : 0;
        }
        break;
      case "RETURN_COMMISSION":
        groupone.map((item) => {
          if (item.addToGt == 1) {
            value = billData.billViewInfo?.rtComm;
            return value;
          } else if (
            item.addToGt == 0 &&
            item.settingName === "RETURN_COMMISSION"
          ) {
            value = -billData.billViewInfo?.rtComm;
            return value;
          }
        });
        groupTwo.map((item) => {
          if (item.addToGt == 1) {
            value = billData.billViewInfo?.rtComm;
            return value;
          } else if (
            item.addToGt == 0 &&
            item.settingName === "RETURN_COMMISSION"
          ) {
            value = -billData.billViewInfo?.rtComm;
            return value;
          }
        });
        groupThree.map((item) => {
          if (item.addToGt == 1) {
            value = billData.billViewInfo?.rtComm;
            return value;
          } else if (
            item.addToGt == 0 &&
            item.settingName === "RETURN_COMMISSION"
          ) {
            value = -billData.billViewInfo?.rtComm;
            return value;
          }
        });
        groupFour.map((item) => {
          if (item.addToGt == 1) {
            value = billData.billViewInfo?.rtComm;
            return value;
          } else if (
            item.addToGt == 0 &&
            item.settingName === "RETURN_COMMISSION"
          ) {
            value = -billData.billViewInfo?.rtComm;
            return value;
          }
        });
        break;
      case "TRANSPORTATION":
        if(billData.billViewInfo.partyType.toUpperCase()==='FARMER'){
          value = -billData.billViewInfo?.transportation;
        }else{
          value = billData.billViewInfo?.transportation;
        }
        break;
      case "LABOUR_CHARGES":
        if(billData.billViewInfo.partyType.toUpperCase()==='FARMER'){
          value = -billData.billViewInfo?.labourCharges;
        }else{
          value = billData.billViewInfo?.labourCharges;
        }
        break;
      case "RENT":
        if(billData.billViewInfo.partyType.toUpperCase()==='FARMER'){
          value = -billData.billViewInfo?.rent;
        }else{
          value = billData.billViewInfo?.rent;
        }
        break;
      case "MANDI_FEE":
        if(billData.billViewInfo.partyType.toUpperCase()==='FARMER'){
          value = -billData.billViewInfo?.mandiFee;
        }
        else{
          value = billData.billViewInfo?.mandiFee;
        }
        break;
      case "OTHER_FEE":
        if (billData.billViewInfo.partyType.toUpperCase() === "FARMER") {
          value = -billData.billViewInfo?.misc;
        } else {
          value = -billData.billViewInfo?.otherFee;
        }
        break;
      case "GOVT_LEVIES":
        if (billData.billViewInfo.partyType.toUpperCase() === "FARMER"){
          value = -billData.billViewInfo?.govtLevies;
        }else{
          value = billData.billViewInfo?.govtLevies;
        }
        break;
      case "ADVANCES":
        if (billData.billViewInfo.partyType.toUpperCase() === "FARMER"){
          value = -billData.billViewInfo?.advance;
        }else{
          value = billData.billViewInfo?.advance;
        }
        break;
      case substring:
        if (billData.billViewInfo.partyType.toUpperCase() === "FARMER"){
          billData.billViewInfo.customFields.map((item) => {
            if (item.fee != 0) {
              if (item.field === name) {
                value = -item.fee;
                return value;
              }
            }
          });
        }else{
          billData.billViewInfo.customFields.map((item) => {
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
  groupone.map((item) => {
    groupOneTotal += handleGroupNames(item.settingName);
    return groupOneTotal;
  });

  groupTwo.map((item) => {
    return (groupTwoTotal += handleGroupNames(item.settingName));
  });
  groupThree.map((item) => {
    return (groupThreeTotal += handleGroupNames(item.settingName));
  });

  groupFour.map((item) => {
    return (groupFourTotal += handleGroupNames(item.settingName));
  });

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
        if (!list.isShown) {
          item = "";
        }
        break;
      case substring:
        billData.billViewInfo.customFields.map((items) => {
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
  const getFinalLedgerbalance = () => {
    if(billData.billViewInfo.partyType.toUpperCase()==='FARMER'){
        var t = parseInt(
        billData.billViewInfo.transportation +
        billData.billViewInfo.labourCharges +
        billData.billViewInfo.rent +
        billData.billViewInfo.mandiFee +
        billData.billViewInfo.govtLevies +
        billData.billViewInfo.misc +
        billData.billViewInfo.advance
      );
    }else{
      var t = parseInt(
        billData.billViewInfo.transportation +
        billData.billViewInfo.labourCharges +
        billData.billViewInfo.rent +
        billData.billViewInfo.mandiFee +
        billData.billViewInfo.govtLevies +
        billData.billViewInfo.otherFee
      );
    }
    if(billData.billViewInfo.partyType.toUpperCase()==='FARMER'){
      var finalValue = billData.billViewInfo.grossTotal - t;
    }else{
      var finalValue = billData.billViewInfo.grossTotal + t;
    }
    var finalVal = finalValue;
    if (includeComm && billData.billViewInfo.partyType.toUpperCase==='FARMER') {
      finalVal = finalVal - billData.billViewInfo.comm;
    }else{
      finalVal = finalVal + billData.billViewInfo.comm;
    }

    if (addRetComm && billData.billViewInfo.partyType.toUpperCase()==='FARMER') {
      if (includeRetComm) {
        finalVal = finalVal + billData.billViewInfo.rtComm;
      }
    } else {
      finalVal = finalVal + billData.billViewInfo.rtComm;
    }
    if(billData.billViewInfo.partyType.toUpperCase()==='FARMER'){
      return (
        (Number(finalVal) + billData.billViewInfo.outStBal).toFixed(2) -
        Number(billData.billViewInfo.cashPaid)
      ).toFixed(2);
    }
    else{
      var cashRecieved =
            billData.billViewInfo.cashRcvd === null ? 0 : billData.billViewInfo.cashRcvd;
        return (
            (Number(finalVal) + billData.billViewInfo.outStBal).toFixed(2) - cashRecieved
        ).toFixed(2);
    }
  };
    return (
        <div>
            <div>
            <div className="row">
                <div className="col-lg-6"></div>
                <div className="pl-0 col-lg-6 col_border_left pr-0">
                    <div>
                        {groupone.map((item, index) => {
                            return (
                                <div>
                                    <div className="row" key={index}>
                                        <div className="col-lg-2"></div>
                                        <div className="col-lg-6 align-items">
                                            <p className="groups_value">
                                                {(
                                                    item.settingName !==
                                                        handleSettingName(item.settingName, item)
                                                        ? " "
                                                        : handleGroupNames(item.settingName) === 0
                                                )
                                                    ? " "
                                                    : (item.settingName.includes("CUSTOM_FIELD") ? item.customFieldName : item.settingName?.replaceAll("_", " "))}{" "}
                                            </p>
                                        </div>
                                        <div className="col-lg-4">
                                            <p className="groups_value">
                                                {handleGroupNames(
                                                    handleSettingName(item.settingName, item)
                                                ) === 0
                                                    ? " "
                                                    : handleGroupNames(item.settingName)}
                                            </p>
                                        </div>
                                    </div>
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
                        <div className="row group-one-total">
                            <div className="pl-0 col-lg-8 pr-0"></div>
                            <div className="col-lg-4">
                                <p className="groups_value">
                                    {groupOneTotal === 0 || null
                                        ? ""
                                        : (
                                            billData.billViewInfo?.grossTotal + groupOneTotal
                                        ).toLocaleString("en-IN", {
                                            maximumFractionDigits: 2,
                                            style: "currency",
                                            currency: "INR",
                                        })}
                                </p>
                            </div>
                            <div
                                className={
                                    groupOneTotal === 0 || null
                                        ? ""
                                        : "hr-line-in-totals"
                                }
                            ></div>
                        </div>
                    </div>
                    <div>
                        {groupTwo.map((item, index) => {
                            return (
                                <div>
                                    <div className="row" key={index}>
                                        <div className="col-lg-2"></div>
                                        <div className="col-lg-6">
                                            <p className="groups_value">
                                                {" "}
                                                {(
                                                    item.settingName !==
                                                        handleSettingName(item.settingName, item)
                                                        ? " "
                                                        : handleGroupNames(item.settingName) === 0
                                                )
                                                    ? " "
                                                    : (item.settingName.includes("CUSTOM_FIELD") ? item.customFieldName : item.settingName?.replaceAll("_", " "))}{" "}
                                            </p>
                                        </div>
                                        <div className="col-lg-4">
                                            <p className="groups_value">
                                                {handleGroupNames(
                                                    handleSettingName(item.settingName, item)
                                                ) === 0
                                                    ? " "
                                                    : handleGroupNames(
                                                        item.settingName
                                                    ).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
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
                        <div className="row group-one-total">
                            <div className="pl-0 col-lg-8 pr-0"></div>
                            <div className="col-lg-4">
                                <p className="groups_value">
                                    {groupTwoTotal === 0 || null
                                        ? ""
                                        : (
                                            billData.billViewInfo?.grossTotal +
                                            (groupTwoTotal + groupOneTotal)
                                        ).toLocaleString("en-IN", {
                                            maximumFractionDigits: 2,
                                            style: "currency",
                                            currency: "INR",
                                        })}
                                </p>
                            </div>
                            <div
                                className={
                                    groupTwoTotal === 0 || null
                                        ? ""
                                        : "hr-line-in-totals"
                                }
                            ></div>
                        </div>
                    </div>
                    <div>
                        {groupThree.map((item, index) => {
                            return (
                                <div>
                                    <div className="row" key={index}>
                                        <div className="col-lg-2"></div>
                                        <div className="col-lg-6">
                                            <p className="groups_value">
                                                {" "}
                                                {(
                                                    item.settingName !==
                                                        handleSettingName(item.settingName, item)
                                                        ? " "
                                                        : handleGroupNames(item.settingName) === 0
                                                )
                                                    ? " "
                                                    : (item.settingName.includes("CUSTOM_FIELD") ? item.customFieldName : item.settingName?.replaceAll("_", " "))}{" "}
                                            </p>
                                        </div>
                                        <div className="col-lg-4">
                                            <p className="groups_value">
                                                {handleGroupNames(
                                                    handleSettingName(item.settingName, item)
                                                ) === 0
                                                    ? " "
                                                    : handleGroupNames(
                                                        item.settingName
                                                    ).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
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
                        <div className="row group-one-total">
                            <div className="pl-0 col-lg-8 pr-0"></div>
                            <div className="col-lg-4">
                                <p className="groups_value">
                                    {groupThreeTotal === 0 || null
                                        ? ""
                                        : (
                                            billData.billViewInfo?.grossTotal +
                                            (groupThreeTotal +
                                                groupTwoTotal +
                                                groupOneTotal)
                                        ).toLocaleString("en-IN", {
                                            maximumFractionDigits: 2,
                                            style: "currency",
                                            currency: "INR",
                                        })}
                                </p>
                            </div>
                            <div
                                className={
                                    groupThreeTotal === 0 || null
                                        ? ""
                                        : "hr-line-in-totals"
                                }
                            ></div>
                        </div>
                    </div>
                    <div>
                        {groupFour.map((item, index) => {
                            return (
                                <div>
                                    <div className="row" key={index}>
                                        <div className="col-lg-2"></div>
                                        <div className="col-lg-6">
                                            <p className="groups_value">
                                                {" "}
                                                {/* {'hloo'+ item.settingName +  handleSettingName(item.settingName, item)} */}
                                                {(
                                                    item.settingName !==
                                                        handleSettingName(item.settingName, item)
                                                        ? " "
                                                        : handleGroupNames(item.settingName) === 0
                                                )
                                                    ? " "
                                                    : (item.settingName.includes("CUSTOM_FIELD") ? item.customFieldName : item.settingName?.replaceAll("_", " "))}
                                            </p>
                                        </div>
                                        <div className="col-lg-4">
                                            <p className="groups_value">
                                                {handleGroupNames(
                                                    handleSettingName(item.settingName, item)
                                                ) === 0
                                                    ? " "
                                                    : handleGroupNames(item.settingName)}
                                            </p>
                                        </div>
                                    </div>
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
                        <div className="row group-one-total">
                            <div className="pl-0 col-lg-8 pr-0"></div>
                            <div className="col-lg-4">
                                <p className="groups_value">
                                    {groupFourTotal === 0 || null
                                        ? ""
                                        : (
                                            billData.billViewInfo?.grossTotal +
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
                            <div
                                className={
                                    groupFourTotal === 0 || null
                                        ? ""
                                        : "hr-line-in-totals"
                                }
                            ></div>
                        </div>
                    </div>
                    <div>
                    <div className="row">
                            <div className="col-lg-2"></div>
                            <div className="col-lg-6">
                                {billData.billViewInfo?.grossTotal +
                                    (groupFourTotal +
                                        groupThreeTotal +
                                        groupTwoTotal +
                                        groupOneTotal) +
                                        billData.billViewInfo?.totalPayables ===
                                    0 ? (
                                    ""
                                ) : (
                                    <p className="grouping_value">
                                        Total Bill Amount :
                                    </p>
                                )}
                            </div>
                            <div className="col-lg-4">
                                <p className={billData.billViewInfo.partyType.toUpperCase()==='FARMER'
                                ?"grouping_value color_red":'grouping_value color_green'}>
                                    {billData.billViewInfo?.grossTotal +
                                        (groupFourTotal +
                                            groupThreeTotal +
                                            groupTwoTotal +
                                            groupOneTotal) ===
                                        0 ||
                                        billData.billViewInfo?.grossTotal +
                                        (groupFourTotal +
                                            groupThreeTotal +
                                            groupTwoTotal +
                                            groupOneTotal) ===
                                        null
                                        ? " "
                                        : (
                                            billData.billViewInfo?.grossTotal +
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
                    </div>
                    </div>
                    <div>
                      {billData.billViewInfo.partyType.toUpperCase()==='FARMER'?
                        <div className="row">
                            <div className="col-lg-2"></div>
                            <div className="col-lg-6">
                                {billData.billViewInfo.cashPaid === 0 ? (
                                    "" || billData.billViewInfo.cashPaid === null
                                ) : (
                                    <p className="grouping_value">Cash Paid :</p>
                                )}
                            </div>
                            <div className="col-lg-4">
                                <p className="grouping_value color_red">
                                    {billData.billViewInfo.cashPaid === 0 ||
                                        billData.billViewInfo.cashPaid === null
                                        ? " "
                                        : "-" +
                                        getCurrencyNumberWithSymbol(
                                            billData.billViewInfo?.cashPaid
                                        )}
                                </p>
                            </div>
                        </div>:
                        <div className="row">
                        <div className="col-lg-2"></div>
                        <div className="col-lg-6">
                            {billData.billViewInfo.cashRcvd === 0 ||
                                billData.billViewInfo.cashRcvd === null ? (
                                ""
                            ) : (
                                <p className="grouping_value">Cash Received</p>
                            )}
                        </div>
                        <div className="col-lg-4">
                            <p className="grouping_value ">
                                {billData.billViewInfo.cashRcvd === 0 ||
                                    billData.billViewInfo.cashRcvd === null
                                    ? ""
                                    : '-' + getCurrencyNumberWithSymbol(billData.billViewInfo?.cashRcvd)}
                            </p>
                        </div>
                      </div>
                      }
                    </div>
                    <div></div>
                    <div>
                        <div className="row">
                            <div className="col-lg-2"></div>
                            <div className="col-lg-6">
                                <p
                                    className="grouping_value"
                                    style={{ display: status ? "block" : "none" }}
                                >
                                    Outstanding Balance:
                                </p>
                            </div>
                            <div className="col-lg-4">
                                <p
                                    className={billData.billViewInfo.partyType.toUpperCase()==='FARMER'
                                    ?"grouping_value color_red":'grouping_value color_green'}
                                    style={{ display: status ? "block" : "none" }}
                                >
                                    {billData.billViewInfo?.outStBal.toLocaleString("en-IN", {
                                        maximumFractionDigits: 2,
                                        style: "currency",
                                        currency: "INR",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {!status ? (
                  <div className="row out-st-bal align-items-center">
                    <div className="col-lg-5">
                      <div className="d-flex footer-img">
                        <img src={ono_connect_click} alt="ono_connect" />
                      </div>
                    </div>

                    <div className="col-lg-2"></div>
                    {billData.billViewInfo.partyType.toUpperCase()==='FARMER'?
                      <div>
                      <div className="col-lg-3">
                      {billData.billViewInfo.totalPayables === 0 ? (
                        "" || billData.billViewInfo.totalPayables === null
                      ) : (
                        <p
                          className="groups_value"
                          style={{ display: !status ? "block" : "none" }}
                        >
                          Total Payables :
                        </p>
                      )}
                    </div>
                    <div className="col-lg-2">
                      <p
                        className="groups_value color_red"
                        style={{ display: !status ? "block" : "none" }}
                      >
                        {billData.billViewInfo.totalPayables === 0 ||
                        billData.billViewInfo.totalPayables === null
                          ? " "
                          : billData.billViewInfo?.totalPayables}
                      </p>
                    </div>
                    </div>:
                      <div>
                          <div className="col-lg-3">
                          {billData.billViewInfo.totalReceivable === 0 ||
                              billData.billViewInfo.totalReceivable === null ? (
                              ""
                          ) : (
                              <p
                                  className="groups_value"
                                  style={{ display: !status ? "block" : "none" }}
                              >
                                  Total Receivables:
                              </p>
                          )}
                      </div>
                      <div className="col-lg-2">
                          {billData.billViewInfo.totalReceivable === 0 ||
                              billData.billViewInfo.totalReceivable === null ? (
                              ""
                          ) : (
                              <p
                                  className="groups_value color_green"
                                  style={{ display: !status ? "block" : "none" }}
                              >
                                  {billData.billViewInfo?.totalReceivable}
                              </p>
                          )}
                      </div>
                      </div>
                    }
                    
                  </div>
                ) : (
                  <div className="row out-st-bal align-items-center">
                    <div className="col-lg-2">
                      <div className="d-flex footer-img">
                        <img src={ono_connect_click} alt="ono_connect" />
                      </div>
                    </div>

                    <div className="col-lg-3"></div>
                    <div className="col-lg-5">
                      <p
                        className="out-st"
                        style={{ display: status ? "block" : "none" }}
                      >
                        Final Ledger Balance
                      </p>
                    </div>
                    <div className="col-lg-2">
                      <span
                        className={billData.billViewInfo.partyType.toUpperCase()==='FARMER'?
                        "out-value color_red":'out-value color_green'}
                        style={{ display: status ? "block" : "none" }}
                      >
                        {getFinalLedgerbalance().toLocaleString("en-IN", {
                                            maximumFractionDigits: 2,
                                            style: "currency",
                                            currency: "INR",
                                        })}
                      </span>
                    </div>
                  </div>
                )}
            </div>
        </div>
    )
}

export default GroupTotals