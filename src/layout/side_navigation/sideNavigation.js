import React, { Component, useState } from "react";
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
import "./sideNavigation.scss";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../reducers/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import logout from "../../assets/images/logout.svg"
const langData = localStorage.getItem("languageData");
const langFullData = JSON.parse(langData);

function SideNavigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isActive, setisActive] = useState(false);
  const handleToggle = () => {
    setisActive(!isActive);
    localStorage.setItem("isActiveMenu", !isActive);
  };
  const logOutFunction = () => {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
        alert("hii");
      });
    });
    localStorage.setItem("isauth", false);
    dispatch(authActions.logout(false));
    navigate("/login");
    window.location.reload();
    localStorage.removeItem("loginResponse");
    localStorage.removeItem("userType");
    localStorage.removeItem("LinkPath");
    localStorage.removeItem("languageData");
    localStorage.setItem("LinkPath", "/smartboard");
    localStorage.setItem("statusPlan", "FAILURE");
    localStorage.setItem("LinkId", "1");
    localStorage.removeItem("businessCreatedStatus");
  };
  const links = [
    {
      id: 1,
      name: langFullData.smartBoard,
      to: "/smartboard",
      className: "side_nav_item",
      img: smartboard_icon,
    },
    {
      id: 2,
      name: "Smart Chart",
      to: "/smartchart",
      className: "side_nav_item",
      img: smartchart,
    },
    {
      id: 3,
      name: "Sell Bill Book",
      to: "/sellbillbook",
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
      to: "/buyerledger",
      className: "side_nav_item",
      img: buyerledger,
    },
    {
      id: 6,
      name: langFullData.sellerLedger,
      to: "/sellerledger",
      className: "side_nav_item",
      img: sellerledger,
    },
    {
      id: 7,
      name: langFullData.partners,
      to: "/partner",
      className: "side_nav_item",
      img: partners,
    },
    {
      id: 8,
      name: langFullData.myProfile,
      to: "/myprofile",
      className: "side_nav_item",
      img: myprofile,
    },
    {
      id: 9,
      name: "Reports",
      to: "/reports",
      className: "side_nav_item",
      img: reports,
    },
    // {
    //   id: 10,
    //   name: "System Settings",
    //   to: "/cms",
    //   className: "side_nav_item",
    //   img: systemsettings,
    // },
    {
      id: 10,
      name: langFullData.transporto,
      to: "/transportoledger",
      className: "side_nav_item",
      img: transporto,
    },
    // {
    //   id: 12,
    //   name: "Payments",
    //   to: "/cms",
    //   className: "side_nav_item",
    //   img: payments,
    // },
    // {
    //   id: 12,
    //   name: "Advances",
    //   to: "/cms",
    //   className: "side_nav_item",
    //   img: advnces,
    // },
  ];
  // activeLink: null,

  const [activeLink, setactiveLink] = useState(0);
  console.log(activeLink);
  const handleClick = (id, path) => {
    setactiveLink(id);
    if (path === "/buy_bill_book") {
      localStorage.setItem("billViewStatus", false);
      localStorage.setItem("stepOne", false);
    } else if (path === "/sellbillbook") {
      localStorage.setItem("billViewStatus", false);
      localStorage.setItem("stepOneSingleBook", false);
    }
    localStorage.setItem("LinkId", id);
    localStorage.setItem("LinkPath", path);
  };

  const getPathsId = () => {
    var id = 1;
    var linkPath = localStorage.getItem("LinkPath");
    console.log(activeLink, linkPath, "else");
    switch (linkPath) {
      case "/smartboard":
        id = 1;
        break;
      case "/smartchart":
        id = 2;
        break;
      case "/sellbillbook":
        id = 3;
        break;
      case "/buy_bill_book":
        id = 4;
        break;
      case "/buyerledger":
        id = 5;
        break;
      case "/sellerledger":
        id = 6;
        break;
      case "/partner":
        id = 7;
        break;
      case "/myprofile":
        id = 8;
        break;
      case "/reports":
        id = 9;
        break;
      case "/transportoledger":
        id = 10;
        break;
    }
    return id;
  };
  return (
    <div>
      <nav className="navbar navbar-default no-margin fixed-brand bg_white">
        <div className="navbar-header d-flex align-items-center ">
          <button
            className="navbar-toggle collapse in d-block"
            data-toggle="collapse"
            id="menu-toggle-2"
            onClick={handleToggle}
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
                    onClick={() => handleClick(link.id, link.to)}
                    className={
                      link.className +
                      // (link.to.replace('/', '') === link.name.toLowerCase())
                      // ? ( " active_item" ) :
                      (link.id === (activeLink != 0 ? activeLink : getPathsId())
                        ? " active_item"
                        : "")
                    }
                    to={link.to}
                  >
                    {/* {link.to.replace('/', '')} */}
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
          <div className="logout_btn">
           
            <button onClick={logOutFunction} className="d-flex mx-auto">
            <img src={logout} alt="image" className="mr-2"/> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SideNavigation;
