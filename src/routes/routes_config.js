import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Splash from "../modules/splash";
import Login from "../modules/login/login";
import LoginForm from "../modules/login/login_form";
import SmartBoard from "../modules/smartboard/smartboard";
import BuyBillBook from "../modules/buy_bill_book/buy_bill_book";
import BuyerSelection from "../modules/buy_bill_book/buyer_selection";
import Layout from "../layout/layout";
const Routes_Config = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login_form" element={<LoginForm />} />
      </Routes>
      <Layout>
        <Routes>
          <Route path="/smartboard" element={<SmartBoard />} />
          <Route path="/buy_bill_book" element={<BuyBillBook />} />
          <Route path="/buyer_selection" element={<BuyerSelection />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default Routes_Config;
