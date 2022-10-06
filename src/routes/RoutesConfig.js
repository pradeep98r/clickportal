import React from "react";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Splash from "../modules/splash";
import Login from "../modules/login/login";
import LoginForm from "../modules/login/loginForm";
import SmartBoard from "../modules/smartboard/smartboard";
import BuyBillBook from "../modules/buy_bill_book/buyBillBook";
import Layout from "../layout/layout";
import BillCreation from "../modules/buy_bill_book/billCreation";
import BillView from "../modules/buy_bill_book/billView";
import Calender from "../modules/buy_bill_book/calender";
import LanguageSelection from "../modules/login/languageSelection";

import BuyerLedger from "../modules/ledgers/buyerLedger";
import LedgerSummary from "../modules/ledgers/ledgerSummary";
import DetailedLedger from "../modules/ledgers/detailedLedger";
import Partner from "../modules/partners/partner";
import SellerLedger from "../modules/ledgers/sellerLedger";
import SellerLedgerSummary from "../modules/ledgers/sellerLedgerSummary";
import SellerDetailedLedger from "../modules/ledgers/sellerDetailedLedger";

const RoutesConfig = () => {
  const isLocalAuth = localStorage.getItem("isauth");

  if (isLocalAuth == null) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/languageSelection" element={<LanguageSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login_form" element={<LoginForm />} />
        </Routes>
      </BrowserRouter>
    );
  } else {
    if (isLocalAuth === "true") {
      return (
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/smartboard" element={<SmartBoard />} />
              <Route path="/buy_bill_book" element={<BuyBillBook />} />
              <Route path="/bill_creation" element={<BillCreation />} />
              <Route path="/bill_view/:billId" element={<BillView />} />
              <Route path="/calender" element={<Calender />} />
              <Route path="buyerledger" element={<BuyerLedger />}>
                <Route path="ledgersummary/:partyId" element={<LedgerSummary />} />
                <Route path="detailedledger/:partyId" element={<DetailedLedger />} />
              </Route>
              <Route path="sellerledger" element={<SellerLedger />}> 
                <Route path="sellerledgersummary/:partyId" element={<SellerLedgerSummary />} />
                <Route path="sellerdetailedledger/:partyId" element={<SellerDetailedLedger />} />
              </Route>
              <Route path="/partner" element={<Partner />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      );
    } else {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/languageSelection" element={<LanguageSelection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login_form" element={<LoginForm />} />
          </Routes>
        </BrowserRouter>
      );
    }
  }
};

export default RoutesConfig;
