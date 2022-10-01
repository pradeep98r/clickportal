import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { getLedgerSummary } from '../../actions/billCreationService';
import "../Ledgers/LedgerSummary.scss";

const LedgerSummary = () => {
  const [ledgerSummary, setSummary] = useState([{}]);
  const [data, setData] = useState({}, ledgerSummary);
  const [error, setError] = useState(null);
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;

  useEffect(() => {
    getBuyerLedgerSummary();
  }, []);

  const getBuyerLedgerSummary = () => {
    getLedgerSummary(clickId).then(response => {
      setData(response.data.data);
      setSummary(response.data.data.ledgerSummary)
    })
    .catch(error => {
       setError(error.message);
    });
  }
  return (
    <div className='ledger-summary'>
      <table class="table" id="summary-tag">
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
            ledgerSummary.map((item, index) => {
              return (
                <tr>
                  <th scope="row">{index}</th>
                  <td>{item.refId} {item.date}</td>
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

export default LedgerSummary