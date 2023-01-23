import React from 'react'
import {
    getCurrencyNumberWithOneDigit,
    getCurrencyNumberWithOutSymbol,
    getCurrencyNumberWithSymbol,
} from "../../components/getCurrencyNumber";
import moment from "moment/moment";
import { useSelector } from 'react-redux';
const BillViewFooter = () => {
    //const singleBillData = JSON.parse(localStorage.getItem("selectedBillData"));
    const  billData = useSelector((state)=> state.billViewInfo);
    return (

        <div className="row">
            <div className="col-lg-6">
                <p className="ono-footer">
                    ONO-{moment(billData.billViewInfo.billDate).format("DDMMYYYY")}
                    -CLICK-
                    {billData.billViewInfo.partyType==='BUYER'?
                    billData.billViewInfo.actualReceivable:billData.billViewInfo.actualPaybles}
                </p>
            </div>
        </div>
    )
}

export default BillViewFooter