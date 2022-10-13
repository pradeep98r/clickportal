import React from 'react'
import { useState } from 'react';
import { Fragment } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBuyerDetailedLedger, getDetailedLedgerByDate } from '../../actions/billCreationService';
import "./detailedLedger.scss";

const DetailedLedger = () => {
  const [details, setDetails] = useState([{}]);
  const [data, setData] = useState({}, details);
  const [error, setError] = useState(null);
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;

  const{partyId}=useParams();
  const fromDate=JSON.parse(localStorage.getItem('fromDate'));
  const toDate=JSON.parse(localStorage.getItem('toDate'));
  const type=JSON.parse(localStorage.getItem("All"));
  console.log(fromDate,toDate);

  useEffect(() => {
    fetchBuyerLedgerDetails();
  }, []);

  const fetchBuyerLedgerDetails = () => {
    if(type==='All'){
    getBuyerDetailedLedger(clickId,partyId).then(response => {
      setData(response.data.data);
      setDetails(response.data.data.details);
      console.log(details[0].itemName);
    })
    .catch(error => {
      setError(error.message);
    })
  }else if(type==='Custom'){
    getDetailedLedgerByDate(clickId,partyId,fromDate,toDate).then(response=>{
      setData(response.data.data);
      setDetails(response.data.data.details);
      console.log(details.itemName);
    })
    .catch(error => {
      setError(error.message);
    })
  }
  }
  return (
    <Fragment>
    <div className='detailed-ledger'>
    <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">RefId  Date</th>
            <th scope="col">Item Unit|Kgs|Rate</th>
            <th scope="col">Recieved</th>
            <th scope="col">To Be Recieved</th>
            <th scope="col">Ledger Balance</th>
          </tr>
        </thead>
        <tbody>
          {
            details.map((item, index) => {
              return(
                <tr>
                <th scope="row">{index+1}</th>
                <td>{item.refId}&nbsp;{item.date}</td>
                <td>{item.itemName} {item.unit}&nbsp;{item.kg}&nbsp;{item.rate}</td>
                <td>{item.recieved}</td>
                <td>{item.toBeRecieved}</td>
                <td><span className='coloring'>{item.balance}</span></td>
              </tr>
              )
            })
          }

        </tbody>
      </table>
    </div>
    </Fragment>
  )
}

export default DetailedLedger