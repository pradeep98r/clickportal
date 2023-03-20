import React from "react";
import "../layout/layout.scss";
import TopNavigation from "./top_navigation/topNavigation";
import SideNavigation from "./side_navigation/sideNavigation";
import desktop_img from "../assets/images/desktop.png";
const Layout = (props) => {
  const { children } = props;

  return (
    <div className="layout">
      <header className="header">
        <TopNavigation />
      </header>
      <aside className="aside">
        <SideNavigation />
      </aside>
      <main id="main">{children}</main>
      <div className="d-block d-sm-block d-md-none mobile_meassage">
        <div className="mobile_meassage_div">
          <img src={desktop_img} className="d-flex mx-auto" alt="image" />
          Please use it on desktop / Download app from playstore
          <a href="https://play.google.com/store/apps/details?id=com.ono.click"><button className="primary_btn mt-3">Download Now</button></a>
        </div>
      </div>
    </div>
  );
};

export default Layout;
