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
import SubscriptionPlans from "../modules/registration/subscriptionPlans";
import Step1 from "../modules/buy_bill_book/step1";
import SellebillStep1 from "../modules/sell_bill_book/step1";
import Step3Modal from "../modules/buy_bill_book/step3Model";
import BuyerLedgers from "../modules/ledgers/buyerLedgers";
import SellerLedgers from "../modules/ledgers/sellerLedgers";
import { getMandiDetails, getMandiLogoDetails } from "../actions/billCreationService";
const RoutesConfig = () => {
  function setMandiDetails(clickId) {
    getMandiDetails(clickId)
      .then((response) => {
        console.log(response);
        var businessDetails = response.data.data.businessDtls;
        var personalDetails = response.data.data.personalDtls;
        localStorage.setItem("businessDetails", JSON.stringify(businessDetails));
        localStorage.setItem("personalDetails", JSON.stringify(personalDetails));
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function setSettingsDetails(clickId){
    getMandiLogoDetails(clickId).then((response) => {
      console.log(response);
      localStorage.setItem("settingsData", JSON.stringify(response.data.data));
    })
    .catch((error) => {
      console.log(error);
    })
  }
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
          setMandiDetails(loginData.clickId);
          setSettingsDetails(loginData.clickId);
          // console.log(loginData, localStorage.getItem("status"));
          /*const savePref =
            localStorage.getItem("status") == null
              ? ""
              : localStorage.getItem("status");*/
          const planStatus =
            localStorage.getItem("statusPlan") == "FAILURE"
              ? ""
              : localStorage.getItem("statusPlan");
          console.log(planStatus);
          return (
            <BrowserRouter>
              {planStatus === "SUCCESS" ? (
                <Layout>
                  <Routes>
                    <Route path="/" element={<SmartBoard />} />
                    <Route path="/smartboard" element={<SmartBoard />} />
                    <Route path="/buy_bill_book" element={<BuyBillBook />} />
                    <Route path="/bill_creation" element={<BillCreation />} />
                    <Route path="/bill_view/:billId" element={<BillView />} />
                    <Route path="/calender" element={<Calender />} />
                    <Route
                      path="/buyerledger"
                      element={<BuyerLedger />}
                    ></Route>
                    <Route
                      path="/sellerledger"
                      element={<SellerLedger />}
                    ></Route>
                    <Route path="/partner" element={<Partner />} />
                    <Route path="/myprofile" element={<MyProfile />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/sellbillbook" element={<SellBillBook />} />
                    <Route path="/smartchart" element={<SmartChart />} />
                    <Route
                      path="/transportoledger"
                      element={<TransportoLedger />}
                    />
                    <Route path="/step1" element={<Step1 />} />
                    <Route path="/sellbillstep1" element={<SellebillStep1 />} />
                    <Route path="/step3Modal" element={<Step3Modal />} />
                  </Routes>
                </Layout>
              ) : (
                <Routes>
                  <Route path="/preferredCrops" element={<PreferredCrops />} />
                  <Route path="/plans" element={<SubscriptionPlans />} />
                </Routes>
              )}
            </BrowserRouter>
          );
        }
      } else {
        // console.log(loginData, "login data after succesful registration");
        // console.log(localStorage.getItem("registerData"), "aftter data");
        setMandiDetails(loginData.clickId);
        setSettingsDetails(loginData.clickId);
        return (
          <BrowserRouter>
            <Layout>
              <Routes>
                {
                  // localStorage.setItem("LinkId","1")
                }
                <Route path="/" element={<SmartBoard />} />
                <Route path="/smartboard" element={<SmartBoard />} />
                <Route path="/buy_bill_book" element={<BuyBillBook />} />
                <Route path="/bill_creation" element={<BillCreation />} />
                <Route path="/bill_view/:billId" element={<BillView />} />
                {/* <Route path="/sell_bill_view/:billId" element={<SellBillView />} /> */}
                <Route path="/calender" element={<Calender />} />
                <Route path="buyerledger" element={<BuyerLedgers />} />
                {/* <Route path="buyerledger" element={<BuyerLedger />}>
                </Route> */}
                <Route path="sellerledger" element={<SellerLedgers />}></Route>
                {/* <Route path="sellerledger" element={<SellerLedger />}>
                </Route> */}
                <Route path="/partner" element={<Partner />} />
                <Route path="/myprofile" element={<MyProfile />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/sellbillbook" element={<SellBillBook />} />
                <Route path="/smartchart" element={<SmartChart />} />
                <Route
                  path="/transportoledger"
                  element={<TransportoLedger />}
                />
                <Route path="/step1" element={<Step1 />} />
                <Route path="/sellbillstep1" element={<SellebillStep1 />} />
                <Route path="/step3Modal" element={<Step3Modal />} />
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
