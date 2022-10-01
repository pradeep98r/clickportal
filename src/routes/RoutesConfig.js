import React from "react";
import {
  BrowserRouter,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Splash from "../modules/Splash";
import Login from "../modules/login/Login";
import LoginForm from "../modules/login/LoginForm";
import SmartBoard from "../modules/smartboard/Smartboard";
import BuyBillBook from "../modules/buy_bill_book/BuyBillBook";
import Layout from "../layout/Layout";
import BillCreation from "../modules/buy_bill_book/BillCreation";
import BillView from "../modules/buy_bill_book/BillView";
import Calender from "../modules/buy_bill_book/calender";
import LanguageSelection from "../modules/login/LanguageSelection";
import Partner from "../modules/partners/Partner";
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
    if (isLocalAuth == "true") {
      return (
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/smartboard" element={<SmartBoard />} />
              <Route path="/buy_bill_book" element={<BuyBillBook />} />
              <Route path="/bill_creation" element={<BillCreation />} />
              <Route path="/bill_view/:billId" element={<BillView />} />
              <Route path="/calender" element={<Calender />} />
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
