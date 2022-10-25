import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import Partner from "../modules/partners/partner";
import SellerLedger from "../modules/ledgers/sellerLedger";
import MyProfile from "../modules/my_profile/myProfile";
import Reports from "../modules/reports/reports";
import SellBillBook from "../modules/sell_bill_book/sellBillBook";
import SmartChart from "../modules/smart_chart/smartChart";
import TransportoLedger from "../modules/transporto_ledger/transportoLedger";
import Registration from "../modules/registration/registration";
import PreferredCrops from "../modules/registration/preferredCrops";

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
      const loginData = JSON.parse(localStorage.getItem("loginResponse"));
      // console.log(localStorage.getItem("registerData"),"bef data")
      if (loginData.useStatus == "USER_REGISTRATION_PENDING") {
        const id =
          localStorage.getItem("registerData") == null
            ? "0"
            : localStorage.getItem("registerData");
        // console.log(loginData.clickId, id, "login data before registration");
        if (id !== loginData.clickId.toString()) {
          return (
            <BrowserRouter>
              <Routes>
                <Route path="/registration" element={<Registration />} />
              </Routes>
            </BrowserRouter>
          );
        } else if (id === loginData.clickId.toString()) {
          // console.log(loginData, localStorage.getItem("status"));
          const savePref =
            localStorage.getItem("status") == null
              ? ""
              : localStorage.getItem("status");
          return (
            <BrowserRouter>
              {savePref == "SUCCESS" ? (
                <Layout>
                  <Routes>
                    <Route path="/smartboard" element={<SmartBoard />} />
                    <Route path="/buy_bill_book" element={<BuyBillBook />} />
                    <Route path="/bill_creation" element={<BillCreation />} />
                    <Route path="/bill_view/:billId" element={<BillView />} />
                    <Route path="/calender" element={<Calender />} />
                    <Route path="buyerledger" element={<BuyerLedger />}>
                      <Route
                        path="ledgersummary/:partyId"
                        element={<LedgerSummary />}
                      />
                      <Route
                        path="detailedledger/:partyId"
                        element={<DetailedLedger />}
                      />
                    </Route>
                    <Route path="sellerledger" element={<SellerLedger />}>
                      <Route
                        path="sellerledgersummary/:partyId"
                        element={<SellerLedgerSummary />}
                      />
                      <Route
                        path="sellerdetailedledger/:partyId"
                        element={<SellerDetailedLedger />}
                      />
                    </Route>
                    <Route path="/partner" element={<Partner />} />
                    <Route path="/myprofile" element={<MyProfile />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/sellbillbook" element={<SellBillBook />} />
                    <Route path="/smartchart" element={<SmartChart />} />
                    <Route
                      path="/transportoledger"
                      element={<TransportoLedger />}
                    />
                  </Routes>
                </Layout>
              ) : (
                <Routes>
                  <Route path="/preferredCrops" element={<PreferredCrops />} />
                </Routes>
              )}
            </BrowserRouter>
          );
        }
      } else {
        // console.log(loginData, "login data after succesful registration");
        // console.log(localStorage.getItem("registerData"), "aftter data");
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
                  <Route
                    path="ledgersummary/:partyId"
                    element={<LedgerSummary />}
                  />
                  <Route
                    path="detailedledger/:partyId"
                    element={<DetailedLedger />}
                  />
                </Route>
                <Route path="sellerledger" element={<SellerLedger />}>
                  <Route
                    path="sellerledgersummary/:partyId"
                    element={<SellerLedgerSummary />}
                  />
                  <Route
                    path="sellerdetailedledger/:partyId"
                    element={<SellerDetailedLedger />}
                  />
                </Route>
                <Route path="/partner" element={<Partner />} />
                <Route path="/myprofile" element={<MyProfile />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/sellbillbook" element={<SellBillBook />} />
                <Route path="/smartchart" element={<SmartChart />} />
                <Route
                  path="/transportoledger"
                  element={<TransportoLedger />}
                />
              </Routes>
            </Layout>
          </BrowserRouter>
        );
      }
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
