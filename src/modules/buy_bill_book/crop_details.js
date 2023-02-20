import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import {
    getCurrencyNumberWithOneDigit,
    getCurrencyNumberWithOutSymbol,
    getCurrencyNumberWithSymbol,
} from "../../components/getCurrencyNumber";
import single_bill from "../../assets/images/bills/single_bill.svg";
import { qtyValues } from "../../components/qtyValues";
import { getText } from '../../components/getText';
const CropDetails = (props) => {
    const  billViewData = useSelector((state)=> state.billViewInfo);
    const [billData, setBillViewData] = useState(billViewData.billViewInfo); 
    var cratesTotal = 0;
    var sacsTotal = 0;
    var bagsTotal = 0;
    var boxesTotal = 0;
    var kgsTotal = 0;
    useEffect(()=>{
        setBillViewData(JSON.parse(localStorage.getItem("billData")));
      },[props])
    console.log(billData,"data");
    const totalBagsValue = (bags) => {
        var totalValue = 0
        bags.map(item => {
            totalValue += (item.weight - item.wastage);
        })
        return totalValue;
    }
    return (
        <div>
            <div className='row partner_info_padding pb-0'>
                <div className='col-lg-3 p-0'>
                <p className="small_text">Bill To :</p>
                </div>
            </div>
            <div className="row partner_info_padding align-items-center">
                <div className="col-lg-4 pl-0">
                    <div className="d-flex partner_info align-items-center">
                        <div>
                            {billData?.partyType==='FARMER'?
                            (billData?.farmerProfilePic ? <img src={billData?.farmerProfilePic} className="partner_img"/>: 
                            <img src={single_bill} className="partner_img"/>)
                            :(billData?.profilePic ? <img src={billData?.profilePic} className="partner_img"/> : <img src={single_bill} className="partner_img"/>)}
                        </div>
                        <div className='type-name'>
                            <p className="small_text">{(billData?.partyType.toLowerCase()==='farmer')?
                                'Seller':getText(billData?.partyType)}</p>
                           <div className='d-flex align-items-center'>
                           <h6>
                                {(billData?.partyType==='FARMER')?
                                billData.farmerName:billData?.buyerName} 
                            </h6>
                            {/* <h6>()</h6> */}
                           </div>
                        </div>
                    </div>
                </div>
                {billData?.partyType==='FARMER' && billData?.farmerAddress != "" ? (
                    <div className="col-lg-3">
                        <div className="partner_info">
                            <p className="small_text">Address: </p>
                            <h6 className="">
                                {billData?.farmerAddress}
                            </h6>
                        </div>
                    </div>
                ) : (
                    billData?.buyerAddress != "" ?  <div className="col-lg-3">
                        <div className="partner_info">
                            <p className="small_text">Address: </p>
                            <h6 className="">
                                {billData?.buyerAddress}
                            </h6>
                        </div>
                    </div> : ''
                )}
                {billData?.transporterId != 0 ? (
                    <div className="col-lg-3">
                        <div className="partner_info">
                            <p className="small_text">Transporter :</p>
                            <h6 className="">
                                {billData?.transporterName}
                            </h6>
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </div>
            <div>
                <table className="table table-bordered bill_view mb-0">
                    <thead>
                        <tr>
                            <th className="col-1 text-center">#</th>
                            <th className="col-4">Particulars</th>
                            <th className="col-3">Qty. </th>
                            <th className="col-2">Rate (₹)</th>
                            <th className="col-2">Total (₹)</th>
                        </tr>
                    </thead>
                    <tbody className="crop-tbl">
                        {billData?.lineItems.map((item, key) => {
                            return (
                                <tr key={item}>
                                    <td className="col-1 text-center">{key + 1}</td>
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
                                        <div>
                                            {" "}
                                            {qtyValues(
                                                item.qty,
                                                item.qtyUnit,
                                                item.weight,
                                                item.wastage,
                                                item.rateType
                                            )}
                                        </div>
                                        <div>
                                            {item.bags !== null ?
                                                <div className="flex_class">
                                                        <span>
                                                            <span>
                                                                {item.bags.map(i => {
                                                                    return (
                                                                        <span >
                                                                            <span>{i.weight ? i.weight + " " : ''}</span>
                                                                            <span>{i.wastage ? ' - ' : ''}</span>
                                                                            <span>{i.wastage ? i.wastage : ''}</span>
                                                                            <span>,{" "}</span>
                                                                        </span>
                                                                    )
                                                                })}
                                                                <span>= {totalBagsValue(item.bags) + "KGS"}</span>
                                                            </span>
                                                            
                                                        </span>
                                                </div>
                                                : ''}
                                        </div>
                                    </td>
                                    <td className="col-2">
                                        {getCurrencyNumberWithOutSymbol(item.rate)}
                                    </td>
                                    <td className="col-2 color_red">
                                        {getCurrencyNumberWithOutSymbol(item.total)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="row gross_profit">
                    <div className="col-lg-2"></div>
                    <div className="col-lg-4">
                        {/* {billData?.lineItems.map((item) => {
                            if (item.qtyUnit === "CRATES") {
                                cratesTotal += item.qty;
                            } else if (item.qtyUnit === "SACS") {
                                sacsTotal += item.qty;
                            } else if (item.qtyUnit === "BAGS") {
                                bagsTotal += item.qty;
                            } else if (item.qtyUnit === "BOXES") {
                                boxesTotal += item.qty;
                            } else {
                                kgsTotal += item.qty;
                            }
                        })}
                        <p className="total-qty">
                            {cratesTotal ? cratesTotal.toFixed(2) + "C |" : ""}{" "}
                            {sacsTotal ? sacsTotal.toFixed(2) + "S |" : ""}{" "}
                            {bagsTotal ? bagsTotal.toFixed(2) + "Bg |" : ""}
                            {boxesTotal ? boxesTotal.toFixed(2) + "BX |" : ""}{" "}
                            {kgsTotal ? kgsTotal.toFixed(2) + "KGS" : ""}
                        </p> */}
                    </div>
                    <div className="col-lg-6 p-0 ">
                        <div className="row justify-content-around">
                            {/* <div className="col-lg-4"></div> */}
                            {/* <div className="col-lg-5"> */}
                                <p className="total_value">Gross Total : </p>
                            {/* </div> */}
                            {/* <div className="col-lg-3 p-0"> */}
                                <p className="total_value number_overflow">
                                &nbsp;&nbsp;
                                    { billData?.grossTotal.toLocaleString("en-IN", {
                                        maximumFractionDigits: 2,
                                        style: "currency",
                                        currency: "INR",
                                    })}
                                </p>
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CropDetails