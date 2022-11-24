import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import single_bill from "../../assets/images/bills/single_bill.svg";
import moment from "moment/moment";
import {
    getMandiDetails,
    getSystemSettings,
} from "../../actions/billCreationService";
const SellBillView = () => {
    const loginData = JSON.parse(localStorage.getItem("loginResponse"));
    const clickId = loginData.clickId;
    const clientId = loginData.authKeys.clientId;
    const clientSecret = loginData.authKeys.clientSecret;
    const [mandiData, setMandiData] = useState({});
    const singleBillData = JSON.parse(localStorage.getItem("selectedBillData"));
    const [billSettingResponse, billSettingData] = useState([]);

    useEffect(() => {
        getBusinessDetails();
        getBuyBillsById();
    }, []);
    const getBusinessDetails = () => {
        getMandiDetails(clickId)
            .then((response) => {
                setMandiData(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    var grOne = [];
    var grTwo = [];
    var grThree = [];
    var grFour = [];

    const [grone, setGrOne] = useState([]);
    const [grtwo, setGrTwo] = useState([]);
    const [grthree, setGrThree] = useState([]);
    const [grfour, setGrFour] = useState([]);
    const [status, setStatus] = useState(false);
    const getBuyBillsById = () => {
        getSystemSettings(clickId, clientId, clientSecret).then((res) => {
            billSettingData(res.data.data.billSetting)
            for (var i = 0; i < res.data.data.billSetting.length; i++) {
                if (res.data.data.billSetting[i].groupId === 1 && res.data.data.billSetting[i].billType === 'SELL'
                    && res.data.data.billSetting[i].formStatus === 1) {
                        if(res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE"){
                            setStatus(true);
                          }
                    grOne = [res.data.data.billSetting[i], ...grOne];
                    setGrOne([grone, ...grOne]);
                } else if (res.data.data.billSetting[i].groupId === 2 && res.data.data.billSetting[i].billType === 'SELL'
                    && res.data.data.billSetting[i].formStatus === 1) {
                        if(res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE"){
                            setStatus(true);
                          }
                    grTwo = [res.data.data.billSetting[i], ...grTwo];
                    setGrTwo([grtwo, ...grTwo]);
                } else if (res.data.data.billSetting[i].groupId === 3 && res.data.data.billSetting[i].billType === 'SELL'
                    && res.data.data.billSetting[i].formStatus === 1) {
                        if(res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE"){
                            setStatus(true);
                          }
                    grThree = [res.data.data.billSetting[i], ...grThree];
                    setGrThree([grthree, ...grThree]);
                } else if (res.data.data.billSetting[i].groupId === 4 && res.data.data.billSetting[i].billType === 'SELL'
                    && res.data.data.billSetting[i].formStatus === 1) {
                        if(res.data.data.billSetting[i].settingName === "OUT_ST_BALANCE"){
                            setStatus(true);
                        }
                    grFour = [res.data.data.billSetting[i], ...grFour];
                    setGrFour([grfour, ...grFour]);
                }
            }
        })
    }
    const handleGroupNames = (name) => {
        var value = 0;
        switch (name) {
            case "COMMISSION":
                value = singleBillData?.comm;
                break;
            case "RETURN_COMMISSION":
                value = singleBillData?.rtComm;
                grOne.map(item=>{
                    if(item.addToGt == 1){
                      value = -(singleBillData?.rtComm);
                      console.log(value)
                      return value;
                    }else if(item.addToGt ==0 && item.settingName ==="RETURN_COMMISSION"){
                      value = (singleBillData?.rtComm);
                      console.log(value)
                      return value;
                    }
                  })
                  grTwo.map(item=>{
                    if(item.addToGt == 1){
                      value = -(singleBillData?.rtComm);
                      return value;
                    }else if(item.addToGt ==0 && item.settingName ==="RETURN_COMMISSION"){
                      value = (singleBillData?.rtComm);
                      console.log(value)
                      return value;
                    }
                  })
                  grThree.map(item=>{
                    if(item.addToGt == 1){
                      value = -(singleBillData?.rtComm);
                      return value;
                    }else if(item.addToGt ==0 && item.settingName ==="RETURN_COMMISSION"){
                      value = (singleBillData?.rtComm);
                      console.log(value)
                      return value;
                    }
                  })
                  grFour.map(item=>{
                    if(item.addToGt == 1){
                      value = -(singleBillData?.rtComm);
                      return value;
                    }else if(item.addToGt ==0 && item.settingName ==="RETURN_COMMISSION"){
                      value = (singleBillData?.rtComm);
                      console.log(value)
                      return value;
                    }
                  })
                break;
            case "TRANSPORTATION":
                value = singleBillData?.transportation;
                break;
            case "LABOUR_CHARGES":
                value = singleBillData?.labourCharges;
                break;
            case "RENT":
                value = singleBillData?.rent;
                break;
            case "MANDI_FEE":
                value = singleBillData?.mandiFee;
                break;
            case "OTHER_FEE":
                if (singleBillData.partyType === "BUYER") {
                    value = singleBillData?.otherFee;
                }
                else {
                    value = singleBillData?.misc;
                }
                break;
            case "GOVT_LEVIES":
                value = singleBillData?.govtLevies;
                break;
            case "ADVANCES":
                value = singleBillData?.advance;
                break;
            case "CUSTOM_FIELD1":
                singleBillData.customFields.map(item => {
                    if (item.field === name) {
                        value = item.fee;
                        return value;
                    }
                });
                break;
            case "CUSTOM_FIELD2":
                singleBillData.customFields.map(item => {
                    if (item.field === name) {
                        value = item.fee;
                        return value;
                    }
                });
                break;
            case "CUSTOM_FIELD3":
                singleBillData.customFields.map(item => {
                    if (item.field === name) {
                        value = item.fee;
                        return value;
                    }
                });
                break;
            case "CUSTOM_FIELD4":
                singleBillData.customFields.map(item => {
                    if (item.field === name) {
                        value = item.fee;
                        return value;
                    }
                });
                break;
        }
        return value;
    }
    var cratesTotal = 0;
    var sacsTotal = 0;
    var bagsTotal = 0;
    var boxesTotal = 0;
    var kgsTotal = 0;
    var groupOneTotal = 0;
    var groupTwoTotal = 0;
    var groupThreeTotal = 0;
    var groupFourTotal = 0;
    const getCropUnit = (unit) => {
        var unitType = "";
        switch (unit) {
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
    const handleSettingName = (item) => {
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
        }
        return item;
    }

    grone.map(item => {
        return groupOneTotal += handleGroupNames(item.settingName);
    })
    grtwo.map(item => {
        return groupTwoTotal += handleGroupNames(item.settingName);
    })

    grthree.map(item => {
        return groupThreeTotal += handleGroupNames(item.settingName);
    })

    grfour.map(item => {
        return groupFourTotal += handleGroupNames(item.settingName);
    })
    return (
        <div className="row">
            <div className="col-lg-7 col_left">
                <div className="bill_view_card buy_bills_view" id="scroll_style">
                    <div className="bill_view_header">
                        <div className="row bill_view_top_header">
                            <div className="col-lg-3">
                                <p className="small_text">Proprietor</p>
                                <p className="medium_text">
                                    {mandiData.personalDtls?.ownerName}
                                </p>
                            </div>
                            <div className="col-lg-6 text-center credit_bill">
                                Cash / Credit Bill
                            </div>
                            <div className="col-lg-1"></div>
                            <div className="col-lg-2 text-end">
                                <p className="small_text">
                                    {mandiData.businessDtls?.contactName}
                                </p>
                                <p className="medium_text">
                                    {mandiData.businessDtls?.mobile}
                                </p>
                            </div>
                        </div>
                        <div className="row mandi_details_header align_items_center">
                            <div className="col-lg-2">
                                <div className="mandi_circle flex_class">
                                    <p className="mandi_logo">
                                        {mandiData.businessDtls?.shortCode}
                                    </p>
                                </div>
                                <div className="billid_date_bg">
                                    <p className="small_text text-center">
                                        Bill ID : {singleBillData.billId}
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-8 text-center p-0">
                                <h2 className="large_text">
                                    {mandiData.businessDtls?.businessName}
                                </h2>
                                <p className="medium_text">
                                    {mandiData.businessDtls?.businessType}
                                </p>
                                <p className="small_text">
                                    {
                                        mandiData.businessDtls?.businessAddress ? mandiData.businessDtls?.businessAddress?.addressLine +
                                            "," +
                                            mandiData.businessDtls?.businessAddress?.dist +
                                            ",Pincode-" +
                                            mandiData.businessDtls?.businessAddress?.pincode +
                                            "," +
                                            mandiData.businessDtls?.businessAddress?.state : ''
                                    }
                                </p>
                            </div>
                            <div className="col-lg-2 text-center">
                                <div className="mandi_circle shop_no">
                                    <span className="small_text">Shop No</span>
                                    <p className="mandi_logo shop_number">
                                        {mandiData.businessDtls?.shopNum}
                                    </p>
                                </div>
                                <div className="billid_date_bg">
                                    <p className="small_text text-center">
                                        {singleBillData.billDate}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bill_crop_details">
                        <div className="row partner_info_padding">
                            <div className="col-lg-3">
                                <div className="partner_info">
                                    <p className="small_text">
                                        Bill To {singleBillData.partyType}:{" "}
                                    </p>
                                    <h6 className="small_text">
                                        {singleBillData.buyerName}
                                    </h6>
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="partner_info">
                                    <p className="small_text">Address: </p>
                                    <h6 className="small_text">
                                        {singleBillData.buyerAddress}
                                    </h6>
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="partner_info">
                                    <p className="small_text">Transporter :</p>
                                    <h6 className="small_text">
                                        {singleBillData.transporterName}
                                    </h6>
                                </div>
                            </div>
                        </div>
                        {/* table */}
                        <table className="table table-bordered bill_view mb-0">
                            <thead>
                                <tr>
                                    <th className="col-1">#</th>
                                    <th className="col-4">Particulars</th>
                                    <th className="col-3">Qty. </th>
                                    <th className="col-2">Rate (₹)</th>
                                    <th className="col-2">Total (₹)</th>
                                </tr>
                            </thead>
                            <tbody className="crop-tbl">
                                {singleBillData.lineItems.map((item, key) => {
                                    return (
                                        <tr key={item}>
                                            <td className="col-1">{key + 1}</td>
                                            <td className="col-4">
                                                <div className="flex_class crop_name">
                                                    <img
                                                        src={item.imageUrl}
                                                        className="crop_image_bill"
                                                    />
                                                    <p className="crop-name"> {item.cropName}</p>
                                                </div>
                                            </td>
                                            <td className="col-3">
                                                {" "}
                                                {/* <p>{item.qtyUnit + ":" + item.qty}</p> */}
                                                <p>{item.qty == null ? "" : item.qty + getCropUnit(item.qtyUnit) + " | "}
                                                    {item.weight == null ? "" : item.weight + " KGS  - "} <span className="red_text">
                                                        {item.wastage == null ? "" : item.wastage + " KGS "}</span></p>
                                            </td>
                                            <td className="col-2">{item.rate.toFixed(2)}</td>
                                            <td className="col-2">{item.total.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className="row gross_profit">
                            <div className="col-lg-2"></div>
                            <div className="col-lg-4">
                                {
                                    singleBillData.lineItems.map(item => {
                                        if (item.qtyUnit === 'CRATES') {
                                            cratesTotal += item.qty;
                                        } else if (item.qtyUnit === 'SACS') {
                                            sacsTotal += item.qty;
                                        } else if (item.qtyUnit === 'BAGS') {
                                            bagsTotal += item.qty;
                                        } else if (item.qtyUnit === 'BOXES') {
                                            boxesTotal += item.qty;
                                        } else {
                                            kgsTotal += item.qty;
                                        }
                                    })
                                }
                                <p className="total-qty">{cratesTotal ? cratesTotal.toFixed(2) + 'C |' : ''}  {sacsTotal ? sacsTotal.toFixed(2) + 'S |' : ''}  {bagsTotal ? bagsTotal.toFixed(2) + 'Bg |' : ''}
                                    {boxesTotal ? boxesTotal.toFixed(2) + 'BX |' : ''}  {kgsTotal ? kgsTotal.toFixed(2) + 'KGS' : ''}</p>
                            </div>
                            <div className="col-lg-6 ">
                                <div className="row">
                                    <div className="col-lg-2"></div>
                                    <div className="col-lg-6">
                                        <p className="total_value">Gross Total : </p>
                                    </div>
                                    <div className="col-lg-4">
                                        <p className="total_value number_overflow">
                                            {singleBillData.grossTotal.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6"></div>
                            <div className="pl-0 col-lg-6 col_border_left pr-0">
                                <div>
                                    {grone.map((item, index) => {
                                        return <div>
                                            <div className="row" key={index}>
                                                <div className="col-lg-2"></div>
                                                <div className="col-lg-6 align-items">
                                                    <p className="groups_value">
                                                        {(item.settingName !== handleSettingName(item.settingName)
                                                            ? ' ' : (handleGroupNames(item.settingName)) === 0 ||
                                                            (handleGroupNames(item.settingName)) === null) ? ' ' :
                                                            item.settingName?.replaceAll('_', ' ')}</p>
                                                </div>
                                                <div className="col-lg-4">
                                                    <p className="groups_value">{handleGroupNames(handleSettingName(item.settingName))
                                                        === 0 ? ' ' : handleGroupNames(item.settingName)}</p>
                                                </div>
                                            </div>
                                            <div className={(item.settingName !== handleSettingName(item.settingName)
                                                ? ' ' : (handleGroupNames(item.settingName)) === 0) ? ' ' :
                                                item.settingName?.replaceAll('_', ' ') ? 'hrs-line' : ''}>
                                            </div>
                                        </div>
                                    })}
                                    <div className="row group-one-total">
                                        <div className="pl-0 col-lg-8 pr-0"></div>
                                        <div className="col-lg-4">
                                            <p>{groupOneTotal === 0 || null ? '' :singleBillData.grossTotal+groupOneTotal}</p>                                        </div>
                                        <div className={groupOneTotal === 0 || null ? '':"hr-line-in-totals"}></div>
                                    </div>
                                </div>
                                <div>
                                    {grtwo.map((item, index) => {
                                        return <div>
                                            <div className="row" key={index}>
                                                <div className="col-lg-2"></div>
                                                <div className="col-lg-6">
                                                    <p className="groups_value"> {(item.settingName !== handleSettingName(item.settingName)
                                                        ? ' ' : (handleGroupNames(item.settingName)) === 0 ||
                                                        (handleGroupNames(item.settingName)) === null) ? ' ' :
                                                        item.settingName?.replaceAll('_', ' ')}</p>
                                                </div>
                                                <div className="col-lg-4">
                                                    <p className="groups_value">{handleGroupNames(handleSettingName(item.settingName))
                                                        === 0 ? ' ' : handleGroupNames(item.settingName)}</p>
                                                </div>
                                            </div>
                                            <div className={(item.settingName !== handleSettingName(item.settingName)
                                                ? ' ' : (handleGroupNames(item.settingName)) === 0) ? ' ' :
                                                item.settingName?.replaceAll('_', ' ') ? 'hrs-line' : ''}>
                                            </div>
                                        </div>
                                    })}
                                    <div className="row group-one-total">
                                        <div className="pl-0 col-lg-8 pr-0"></div>
                                        <div className="col-lg-4">
                                            <p>{groupTwoTotal === 0 || null ? '' : singleBillData?.grossTotal+(groupTwoTotal+groupOneTotal)}</p>
                                        </div>
                                        <div className={groupTwoTotal === 0 || null ? '': "hr-line-in-totals"}></div>
                                    </div>
                                </div>
                                <div>
                                    {grthree.map((item, index) => {
                                        return <div>
                                            <div className="row" key={index}>
                                                <div className="col-lg-2"></div>
                                                <div className="col-lg-6">
                                                    <p className="groups_value"> {(item.settingName !== handleSettingName(item.settingName)
                                                        ? ' ' : (handleGroupNames(item.settingName)) === 0 ||
                                                        (handleGroupNames(item.settingName)) === null) ? ' ' :
                                                        item.settingName?.replaceAll('_', ' ')} </p>
                                                </div>
                                                <div className="col-lg-4">
                                                    <p className="groups_value">{handleGroupNames(handleSettingName(item.settingName))
                                                        === 0 ? ' ' : handleGroupNames(item.settingName)}</p>
                                                </div>
                                            </div>
                                            <div className={(item.settingName !== handleSettingName(item.settingName)
                                                ? ' ' : (handleGroupNames(item.settingName)) === 0) ? ' ' :
                                                item.settingName?.replaceAll('_', ' ') ? 'hrs-line' : ''}>
                                            </div>
                                        </div>
                                    })}
                                    <div className="row group-one-total">
                                        <div className="pl-0 col-lg-8 pr-0"></div>
                                        <div className="col-lg-4">
                                            <p>{groupThreeTotal === 0 || null ? '' : singleBillData?.grossTotal+(groupThreeTotal+groupTwoTotal+groupOneTotal)}</p>
                                        </div>
                                        <div className={groupThreeTotal === 0 || null ? '':"hr-line-in-totals"}></div>
                                    </div>
                                </div>
                                <div>
                                    {grfour.map((item, index) => {
                                        return <div>
                                            <div className="row" key={index}>
                                                <div className="col-lg-2"></div>
                                                <div className="col-lg-6">
                                                    <p className="groups_value"> {(item.settingName !== handleSettingName(item.settingName)
                                                        ? ' ' : (handleGroupNames(item.settingName)) === 0 ||
                                                        (handleGroupNames(item.settingName)) === null) ? ' ' :
                                                        item.settingName?.replaceAll('_', ' ')}</p>
                                                </div>
                                                <div className="col-lg-4">
                                                    <p className="groups_value">{handleGroupNames(handleSettingName(item.settingName))
                                                        === 0 ? ' ' : handleGroupNames(item.settingName)}</p>
                                                </div>
                                            </div>
                                            <div className={(item.settingName !== handleSettingName(item.settingName)
                                                ? ' ' : (handleGroupNames(item.settingName)) === 0) ? ' ' :
                                                item.settingName?.replaceAll('_', ' ') ? 'hrs-line' : ''}>
                                            </div>
                                        </div>
                                    })}
                                    <div className="row group-one-total">
                                        <div className="pl-0 col-lg-8 pr-0"></div>
                                        <div className="col-lg-4">
                                            <p>{groupFourTotal === 0 || null ? '' : singleBillData?.grossTotal+(groupFourTotal+groupThreeTotal+groupTwoTotal+groupOneTotal)}</p>
                                        </div>
                                        <div className={groupFourTotal === 0 || null ? '' :"hr-line-in-totals"}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="row">
                                        <div className="col-lg-2"></div>
                                        <div className="col-lg-6">
                                            <div>
                                            {singleBillData?.grossTotal+(groupFourTotal+groupThreeTotal+groupTwoTotal+groupOneTotal)=== 0 || 
                                            singleBillData?.grossTotal+(groupFourTotal+groupThreeTotal+groupTwoTotal+groupOneTotal) === null  ? '' 
                                            : <p className="groups_value">Total Bill Amount  :</p>}
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            < p className="groups_value">{singleBillData?.grossTotal+(groupFourTotal+groupThreeTotal+groupTwoTotal+groupOneTotal) === 0|| 
                                            singleBillData?.grossTotal+(groupFourTotal+groupThreeTotal+groupTwoTotal+groupOneTotal) ===null ? ' ' :
                                            singleBillData?.grossTotal+(groupFourTotal+groupThreeTotal+groupTwoTotal+groupOneTotal)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="row">
                                        <div className="col-lg-2"></div>
                                        <div className="col-lg-6">
                                            <p className="groups_value">{singleBillData.cashRcvdCash === 0 ||
                                            singleBillData.cashRcvd ===null?'':singleBillData.cashRcvd}</p>
                                        </div>
                                        <div className="col-lg-4">
                                            < p className="groups_value">{singleBillData.cashRcvdCash === 0 ||
                                            singleBillData.cashRcvd ===null?'':singleBillData.cashRcvd}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                <div className="row">
                                    <div className="col-lg-2"></div>
                                        <div className="col-lg-6">
                                            <p className="groups_value" style={{display:status?'block':'none'}}>Outstanding Balance:</p>
                                        </div>
                                        <div className="col-lg-4">
                                            < p className="groups_value" style={{display:status?'block':'none'}}>{singleBillData?.outStBal}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="row">
                                        <div className="col-lg-2"></div>
                                        <div className="col-lg-6">
                                            <p className="groups_value" style={{display:!status?'block':'none'}}>Total Receivables:</p>
                                        </div>
                                        <div className="col-lg-4">
                                            < p className="groups_value"style={{display:!status?'block':'none'}} >{singleBillData?.totalReceivable}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row out-st-bal">
                            <div className="col-lg-6"></div>
                            <div className="col-lg-4">
                                <p className="out-st" style={{display:status?'block':'none'}}>Final Ledger Balance</p>
                            </div>
                            <div className="col-lg-2">
                                <span className="out-value" style={{display:status?'block':'none'}}>0</span>
                            </div>
                        </div>
                        {/*  */}
                    </div>
                </div>
            </div>
            <div className="col-lg-5">
                <div className="row more-inf-tag">
                    <div className="more-info">
                        <p class-className="more-p-tag">More Info</p>
                    </div>
                    <div className="hr-line"></div>
                    <div className="d-flex buy-dtl">
                        <div className="col-lg-6">
                            <div className="d-flex">
                                <div className="buyer-image">
                                    {singleBillData.farmerProfilePic ? (
                                        <img src={singleBillData?.profilePic} alt="buyerimage" className="buyer_img" />
                                    ) : (
                                        <img src={single_bill} alt="buyerimage" className="buyer_img" />
                                    )
                                    }
                                </div>
                                <div className="buy-details">
                                    <p className="b-cr-by">Bill Created By</p>
                                    <p className="b-name">{singleBillData?.buyerName}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            {/* <div className="date-and-time"> */}
                            <p className="d-a-time">Date And Time</p>
                            <p className="d-a-value">{moment((singleBillData?.timeStamp)).format("DD-MMM-YY | hh:mm:ss:A")}</p>
                            {/* </div> */}
                        </div>
                    </div>
                    <div className="hr-line"></div>
                </div>
            </div>
        </div>
    )
}

export default SellBillView