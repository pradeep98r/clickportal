import React from 'react'
import { useState } from 'react';
import { Fragment } from 'react';
import { useEffect } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { getLedgerSummary } from '../../actions/billCreationService';
import "../Ledgers/LedgerSummary.scss";
import pdf from "../../assets/images/pdf.svg";
import share from "../../assets/images/share.svg";
import print from "../../assets/images/print.svg";

const SellerLedgerSummary = () => {
  const [ledgerSummary, setSummary] = useState([{}]);
  const [data, setData] = useState({}, ledgerSummary);
  const [error, setError] = useState(null);
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;

  const {partyId}=useParams();
  console.log("partyId",partyId)

  useEffect(() => {
    getBuyerLedgerSummary();
  }, []);

  const getBuyerLedgerSummary = () => {
    getLedgerSummary(clickId,partyId).then(response => {
      setData(response.data.data);
      setSummary(response.data.data.ledgerSummary)
    })
    .catch(error => {
       setError(error.message);
    });
  }
  return (
    <Fragment>
    <div className='seller-summary'>
      <table class="table" id="summary-tag">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">RefId | Date</th>
            <th scope="col">Paid</th>
            <th scope="col">To Be Paid</th>
            <th scope="col">Ledger Balance</th>
          </tr>
        </thead>
        <tbody>
          {
            ledgerSummary.map((item, index) => {
              return (
                <Fragment>
                <tr>
                  <th scope="row">{index}</th>
                  <td>{item.refId} {item.date}</td>
                  <td>{item.paidRcvd}</td>
                  <td>{item.tobePaidRcvd}</td>
                  <td>{item.balance}</td>
                </tr>
                <p><span class="name-tag">
                {item.partyName}<br />
                {item.partyAddress}
                {item.mobile}
                {item.profilePic}</span>
                </p>
                </Fragment>
              )
            })
          }
        </tbody>
      </table>
    </div>
    </Fragment>
  )
}

export default SellerLedgerSummary