import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { getBuyerDetailedLedger } from '../../actions/billCreationService';
import "../Ledgers/DetailedLedger.scss";

const DetailedLedger = () => {
  const [details, setDetails] = useState([{}]);
  const [data, setData] = useState({}, details);
  const [error, setError] = useState(null);
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  useEffect(() => {
    fetchBuyerLedgerDetails();
  }, []);

  const fetchBuyerLedgerDetails = () => {
    getBuyerDetailedLedger(clickId).then(response => {
      setData(response.data.data);
      setDetails(response.data.data.details);
    })
      .catch(error => {
        setError(error.message);
      });
  }
  return (
    <div>
      <table class="table" className="detailed-tag">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">RefId | Date</th>
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
                <th scope="row">{index}</th>
                <td>{item.refId}  {item.date}</td>
                <td>{item.unit}  {item.kg}  {item.rete}</td>
                <td>{item.recieved}</td>
                <td>{item.toBeRecieved}</td>
                <td>{item.balance}</td>
              </tr>
              )
            })
          }

        </tbody>
      </table>
    </div>
  )
}

export default DetailedLedger