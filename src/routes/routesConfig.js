import React from "react";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Splash from "../modules/Splash";
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
import Partner from "../modules/partners/partner";
import SellerLedger from "../modules/ledgers/sellerLedger";
import MyProfile from "../modules/my_profile/myProfile";
import Reports from "../modules/reports/reports";
import SellBillBook from "../modules/sell_bill_book/sellBillBook";
import SmartChart from "../modules/smart_chart/smartChart";
import TransportoLedger from "../modules/transporto_ledger/transportoLedger";

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
              <Route path="buyerledger" element={<BuyerLedger />} />
              <Route path="sellerledger" element={<SellerLedger />} /> 
              <Route path="/partner" element={<Partner />} />
              <Route path="/myprofile" element={<MyProfile />}/>
              <Route path="/reports" element={<Reports />}/>
              <Route path="/sellbillbook" element={<SellBillBook />}/>
              <Route path="/smartchart" element={<SmartChart />}/>
              <Route path="/transportoledger" element={<TransportoLedger />}/>
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
