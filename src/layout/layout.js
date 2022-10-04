import React from "react";
import "../layout/Layout.scss";
import TopNavigation from "./top_navigation/TopNavigation";
import SideNavigation from "./side_navigation/SideNavigation";
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
      <main className="main">{children}</main>
    </div>
  );
};

export default Layout;
