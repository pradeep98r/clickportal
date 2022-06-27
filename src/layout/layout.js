import React from "react";
import "../layout/layout.scss";
import TopNavigation from "./top_navigation/top_navigation";
import SideNavigation from "./side_navigation/side_navigation";
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
