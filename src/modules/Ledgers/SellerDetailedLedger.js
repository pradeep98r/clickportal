import React, { Fragment } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSellerDetailedLedger } from '../../actions/billCreationService';
import "./detailedLedger.scss";

const SellerDetailedLedger = () => {
  const [details, setDetails] = useState([{}]);
  const [data, setData] = useState({}, details);
  const [error, setError] = useState(null);
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;

  const {partyId}=useParams();
  useEffect(() => {
    fetchBuyerLedgerDetails();
  }, []);

  const fetchBuyerLedgerDetails = () => {
    getSellerDetailedLedger(clickId,partyId).then(response => {
      setData(response.data.data);
      setDetails(response.data.data.details);
    })
      .catch(error => {
        setError(error.message);
      });
  }
  return (
    <Fragment>
      <div className='detail-ledger'>
    <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">RefId  Date</th>
            <th scope="col">Item Unit|Kgs|Rate</th>
            <th scope="col">Paid</th>
            <th scope="col">To Be Paid</th>
            <th scope="col">Ledger Balance</th>
          </tr>
        </thead>
        <tbody>
          {
            details.map((item, index) => {
              return(
                <tr>
                <th scope="row">{index}</th>
                <td>{item.refId}&nbsp;{item.date}</td>
                <td>{item.unit}&nbsp;{item.kg}&nbsp;{item.rate}</td>
                <td>{item.paid}</td>
                <td>{item.toBePaid}</td>
                <td>{item.balance}</td>
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

export default SellerDetailedLedger