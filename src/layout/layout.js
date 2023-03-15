import React from "react";
import "../layout/layout.scss";
import TopNavigation from "./top_navigation/topNavigation";
import SideNavigation from "./side_navigation/sideNavigation";
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
    </div>
  );
};

export default Layout;
