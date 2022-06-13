import React, { Component } from "react";
import click_logo from "../../assets/images/click_logo_green.svg";
import smartboard_icon from "../../assets/images/sidebar/smartboard.svg";
import smartchart from "../../assets/images/sidebar/smartchart.svg";
import sellbillbook from "../../assets/images/sidebar/sellbillbook.svg";
import buybillbook from "../../assets/images/sidebar/buybillbook.svg";
import sellerledger from "../../assets/images/sidebar/sellerledger.svg";
import partners from "../../assets/images/sidebar/partners.svg";
import payments from "../../assets/images/sidebar/payments.svg";
import advnces from "../../assets/images/sidebar/advances.svg";
import reports from "../../assets/images/sidebar/reports.svg";
import buyerledger from "../../assets/images/sidebar/buyerledger.svg";
import myprofile from "../../assets/images/sidebar/myprofile.svg";
import systemsettings from "../../assets/images/sidebar/systemsettings.svg";
import transporto from "../../assets/images/sidebar/transporto.svg";
import menu from "../../assets/images/sidebar/menu.svg";
import "./side_navigation.scss";
import { Link } from "react-router-dom";
class SideNavigation extends Component {
  state = { isActive: false };

  handleToggle = () => {
    this.setState({ isActive: !this.state.isActive });
  };
  state = {
    links: [
      {
        id: 1,
        name: "Smartboard",
        to: "/smartboard",
        className: "side_nav_item",
        img: smartboard_icon,
      },
      {
        id: 2,
        name: "Smart Chart",
        to: "/cms",
        className: "side_nav_item",
        img: smartchart,
      },
      {
        id: 3,
        name: "Sell Bill Book",
        to: "/cms",
        className: "side_nav_item",
        img: sellbillbook,
      },
      {
        id: 4,
        name: "Buy Bill Book",
        to: "/buy_bill_book",
        className: "side_nav_item",
        img: buybillbook,
      },
      {
        id: 5,
        name: "Buyer Ledger",
        to: "/cms",
        className: "side_nav_item",
        img: buyerledger,
      },
      {
        id: 6,
        name: "Seller Ledger",
        to: "/cms",
        className: "side_nav_item",
        img: sellerledger,
      },
      {
        id: 7,
        name: "Partners",
        to: "/cms",
        className: "side_nav_item",
        img: partners,
      },
      {
        id: 8,
        name: "My Profile",
        to: "/cms",
        className: "side_nav_item",
        img: myprofile,
      },
      {
        id: 9,
        name: "Reports",
        to: "/cms",
        className: "side_nav_item",
        img: reports,
      },
      {
        id: 10,
        name: "System Settings",
        to: "/cms",
        className: "side_nav_item",
        img: systemsettings,
      },
      {
        id: 11,
        name: "Transporto",
        to: "/cms",
        className: "side_nav_item",
        img: transporto,
      },
      {
        id: 12,
        name: "Payments",
        to: "/cms",
        className: "side_nav_item",
        img: payments,
      },
      {
        id: 13,
        name: "Advances",
        to: "/cms",
        className: "side_nav_item",
        img: advnces,
      },
    ],
    activeLink: null,
  };

  handleClick = (id) => {
    this.setState({ activeLink: id });
  };
  componentDidMount() {}
  render() {
    const isActive = this.state.isActive;
    const { links, activeLink } = this.state;
    return (
      <div>
        <nav className="navbar navbar-default no-margin fixed-brand bg_white">
          <div className="navbar-header d-flex align-items-center ">
            <button
              className="navbar-toggle collapse in d-block"
              data-toggle="collapse"
              id="menu-toggle-2"
              onClick={this.handleToggle}
            >
              <img src={menu} alt="icon" className="menu" />
            </button>
            <img src={click_logo} alt="" className="click_logo" />
          </div>
        </nav>
        <div id="wrapper" className={isActive ? "toggled-2" : null}>
          <div id="sidebar-wrapper">
            <ul className="sidebar-nav nav-pills nav-stacked" id="menu">
              {links.map((link) => {
                return (
                  <li key={link.id}>
                    <Link
                      onClick={() => this.handleClick(link.id)}
                      className={
                        link.className +
                        (link.id === activeLink ? " active_item" : "")
                      }
                      to={link.to}
                    >
                      <div className="flex_class">
                        <div className="icons">
                          <img src={link.img} className="flex_class mx-auto" />
                        </div>
                        <span>{link.name} </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
export default SideNavigation;
