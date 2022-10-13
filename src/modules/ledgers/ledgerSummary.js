import React from 'react'
import { useEffect } from 'react';
import { Fragment } from 'react';
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { getLedgerSummary, getLedgerSummaryByDate } from '../../actions/billCreationService';
import "./ledgerSummary.scss";
import pdf from "../../assets/images/pdf.svg";
import share from "../../assets/images/share.svg";
import print from "../../assets/images/print.svg";

const LedgerSummary = () => {
  const [ledgerSummary, setSummary] = useState([{}]);
  const [data, setData] = useState({}, ledgerSummary);
  const [error, setError] = useState(null);
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;

  const {partyId}=useParams();
  console.log("partyId",partyId)

  const fromDate=JSON.parse(localStorage.getItem('fromDate'));
  const toDate=JSON.parse(localStorage.getItem('toDate'));
  const type=JSON.parse(localStorage.getItem("All"));
  console.log(fromDate,toDate);

  useEffect(() => {
    getBuyerLedgerSummary();
  }, []);

  const getBuyerLedgerSummary = () => {
    if(type==='All'){
    getLedgerSummary(clickId,partyId).then(response => {
      setData(response.data.data);
      setSummary(response.data.data.ledgerSummary)
      console.log(type);
    }).catch(error => {
      setError(error.message);
   });
    }
    else if(type==='Custom'){
      getLedgerSummaryByDate(clickId,partyId,fromDate,toDate)
      .then(response=>{
        setData(response.data.data);
        setSummary(response.data.data.ledgerSummary)
        console.log(data);
        console.log(type);
      }).catch(error => {
        setError(error.message);
     });
    }
    
  }
  return (
    <Fragment>
    <div className='ledger-summary'>
      <table className="table" id="summary-tag">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">RefId | Date</th>
            <th scope="col">Recieved</th>
            <th scope="col">To Be Recieved</th>
            <th scope="col">Ledger Balance</th>
          </tr>
        </thead>
        <tbody>
          {
            data!==null  && ledgerSummary.length > 0 ? (
            ledgerSummary.map((item, index) => {
              return (
                <tr>
                  <th scope="row">{index+1}</th>
                  <td>{item.refId} {item.date}</td>
                  <td>{item.paidRcvd}</td>
                  <td>{item.tobePaidRcvd}</td>
                  <td><span className='coloring'>{item.balance}</span></td>
                </tr>
              )
            })
            ):(<p style={{fontSize:"20px"}}>Data Not Found!</p>)
          }
        </tbody>
      </table>
    </div>
    </Fragment>
  )
}

export default LedgerSummary