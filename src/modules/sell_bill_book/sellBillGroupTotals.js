import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getSystemSettings } from '../../actions/billCreationService';
import {
    getCurrencyNumberWithOneDigit,
    getCurrencyNumberWithOutSymbol,
    getCurrencyNumberWithSymbol,
} from "../../components/getCurrencyNumber";
import ono_connect_click from "../../assets/images/ono-click-connect.svg";
const SellBillGroupTotals = () => {
    var grOne = [];
    var grTwo = [];
    var grThree = [];
    var grFour = [];
    const loginData = JSON.parse(localStorage.getItem("loginResponse"));
    const clickId = loginData.caId;
    const clientId = loginData.authKeys.clientId;
    const clientSecret = loginData.authKeys.clientSecret;
    const billData = useSelector((state) => state.billViewInfo);
    const [grone, setGrOne] = useState([]);
    const [grtwo, setGrTwo] = useState([]);
    const [grthree, setGrThree] = useState([]);
    const [grfour, setGrFour] = useState([]);
    const [status, setStatus] = useState(false);
    const [includeComm, setIncludeComm] = useState("");
    const [includeRetComm, setIncludeRetComm] = useState("");
    const [billSettingResponse, billSettingData] = useState([]);
    const [addRetComm, setAddRetComm] = useState(false);
    const [isShown, setisShown] = useState(false);
    var groupOneTotal = 0;
    var groupTwoTotal = 0;
    var groupThreeTotal = 0;
    var groupFourTotal = 0;
    const getBuyBillsById = () => {
        getSystemSettings(clickId, clientId, clientSecret).then((res) => {
            billSettingData(res.data.data.billSetting);
            for (var i = 0; i < res.data.data.billSetting.length; i++) {
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
                    grOne = [res.data.data.billSetting[i], ...grOne];
                    setGrOne([grone, ...grOne]);
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
                    grTwo = [res.data.data.billSetting[i], ...grTwo];
                    setGrTwo([grtwo, ...grTwo]);
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
                    grThree = [res.data.data.billSetting[i], ...grThree];
                    setGrThree([grthree, ...grThree]);
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
                    grFour = [res.data.data.billSetting[i], ...grFour];
                    setGrFour([grfour, ...grFour]);
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
                value = billData.billViewInfo?.commShown ? billData.billViewInfo?.comm : 0;
                break;
            case "RETURN_COMMISSION":
                value = billData.billViewInfo?.rtComm;
                grone.map((item) => {
                    if (item.addToGt == 1) {
                        value = +billData.billViewInfo?.rtComm;
                        return value;
                    } else if (
                        item.addToGt == 0 &&
                        item.settingName === "RETURN_COMMISSION"
                    ) {
                        value = -billData.billViewInfo?.rtComm;
                        return value;
                    }
                });
                grtwo.map((item) => {
                    if (item.addToGt == 1) {
                        value = +billData.billViewInfo?.rtComm;
                        return value;
                    } else if (
                        item.addToGt == 0 &&
                        item.settingName === "RETURN_COMMISSION"
                    ) {
                        value = -billData.billViewInfo?.rtComm;
                        return value;
                    }
                });
                grthree.map((item) => {
                    if (item.addToGt == 1) {
                        value = +billData.billViewInfo?.rtComm;
                        return value;
                    } else if (
                        item.addToGt == 0 &&
                        item.settingName === "RETURN_COMMISSION"
                    ) {
                        value = -billData.billViewInfo?.rtComm;
                        return value;
                    }
                });
                grFour.map((item) => {
                    if (item.addToGt == 1) {
                        value = +billData.billViewInfo?.rtComm;
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
                value = billData.billViewInfo?.transportation;
                break;
            case "LABOUR_CHARGES":
                value = billData.billViewInfo?.labourCharges;
                break;
            case "RENT":
                value = billData.billViewInfo?.rent;
                break;
            case "MANDI_FEE":
                value = billData.billViewInfo?.mandiFee;
                break;
            case "OTHER_FEE":
                if (billData.billViewInfo.partyType === "BUYER") {
                    value = billData.billViewInfo?.otherFee;
                } else {
                    value = billData.billViewInfo?.misc;
                }
                break;
            case "GOVT_LEVIES":
                value = billData.billViewInfo?.govtLevies;
                break;
            case "ADVANCES":
                value = billData.billViewInfo.advance!=null || 0?billData.billViewInfo.advance:0;
                break;
            case substring:
                billData.billViewInfo.customFields.map((item) => {
                    if (item.fee != 0) {
                        if (item.field === name) {
                            value = item.fee;
                            return value;
                        }
                    }
                });
                break;

        }
        return value;
    };
    useEffect(() => {
        getBuyBillsById();
    }, []);


    const getCropUnit = (unit) => {
        var unitType = "";
        switch (unit.toUpperCase()) {
            case "CRATES":
                unitType = "C";
                break;
            case "BOXES":
                unitType = "BX";
                break;
            case "BAGS":
                unitType = "Bg";
                break;
            case "SACS":
                unitType = "S";
                break;
        }
        return unitType;
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
                if (!(list.isShown)) {
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
    grone.map((item) => {
        return (groupOneTotal += handleGroupNames(item.settingName));
    });
    grtwo.map((item) => {
        return (groupTwoTotal += handleGroupNames(item.settingName));
    });

    grthree.map((item) => {
        return (groupThreeTotal += handleGroupNames(item.settingName));
    });

    grfour.map((item) => {
        return (groupFourTotal += handleGroupNames(item.settingName));
    });
    const getFinalLedgerbalance = () => {
        var t = parseInt(
            billData.billViewInfo.transportation +
            billData.billViewInfo.labourCharges +
            billData.billViewInfo.rent +
            billData.billViewInfo.mandiFee +
            billData.billViewInfo.govtLevies +
            billData.billViewInfo.otherFee
        );
        var finalValue = billData.billViewInfo.grossTotal + t;
        var finalVal = finalValue;
        if (includeComm) {
            finalVal = finalVal + billData.billViewInfo.comm;
        }
        if (addRetComm) {
            if (includeRetComm) {
                finalVal = finalVal + billData.billViewInfo.rtComm;
            }
        } else {
            // if (includeRetComm) {
            finalVal = finalVal - billData.billViewInfo.rtComm;
            // }
        }
        var cashRecieved =
            billData.billViewInfo.cashRcvd === null ? 0 : billData.billViewInfo.cashRcvd;

        return (
            (Number(finalVal) + billData.billViewInfo.outStBal).toFixed(2) - cashRecieved
        ).toFixed(2);
    };

    return (
        <div>
            <div className="row">
                <div className="col-lg-6"></div>
                <div className="pl-0 col-lg-6 col_border_left pr-0">
                    <div>
                        {grone.map((item, index) => {
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
                                                        : handleGroupNames(item.settingName) ===
                                                        0 ||
                                                        handleGroupNames(item.settingName) ===
                                                        null
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
                                <p>
                                    {groupOneTotal === 0 || null
                                        ? ""
                                        : (
                                            billData.billViewInfo.grossTotal + groupOneTotal
                                        ).toLocaleString("en-IN", {
                                            maximumFractionDigits: 2,
                                            style: "currency",
                                            currency: "INR",
                                        })}
                                </p>{" "}
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
                        {grtwo.map((item, index) => {
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
                                                        : handleGroupNames(item.settingName) ===
                                                        0 ||
                                                        handleGroupNames(item.settingName) ===
                                                        null
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
                                <p>
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
                        {grthree.map((item, index) => {
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
                                                        : handleGroupNames(item.settingName) ===
                                                        0 ||
                                                        handleGroupNames(item.settingName) ===
                                                        null
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
                                <p>
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
                        {grfour.map((item, index) => {
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
                                                        : handleGroupNames(item.settingName) ===
                                                        0 ||
                                                        handleGroupNames(item.settingName) ===
                                                        null
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
                                <p>
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
                                <div>
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
                                        null ? (
                                        ""
                                    ) : (
                                        <p className="grouping_value">
                                            Total Bill Amount :
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <p className="grouping_value color_green">
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
                    </div>
                    <div>
                        <div className="row">
                            <div className="col-lg-2"></div>
                            <div className="col-lg-6">
                                <p
                                    className="grouping_value"
                                    style={{ display: status ? "block" : "none" }}
                                >
                                    Outstanding Balance:s
                                </p>
                            </div>
                            <div className="col-lg-4">
                                <p
                                    className="grouping_value color_green"
                                    style={{ display: status ? "block" : "none" }}
                                >
                                    {(billData.billViewInfo?.outStBal).toLocaleString(
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
                    </div>
                    <div></div>
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
                    {/* <div className="col-lg-4">
                    <p
                      className="out-st"
                      style={{ display: status ? "block" : "none" }}
                    >
                      Final Ledger Balance
                    </p>
                  </div>
                  <div className="col-lg-2">
                    <span
                      className="out-value"
                      style={{ display: status ? "block" : "none" }}
                    >
                      {getFinalLedgerbalance()}
                    </span>
                  </div> */}
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
                            className="out-value color_green"
                            style={{ display: status ? "block" : "none" }}
                        >
                            {getFinalLedgerbalance()}
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SellBillGroupTotals