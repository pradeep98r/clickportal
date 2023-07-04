import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ComingSoon from "../../components/comingSoon";
import "../reports/reports.scss";
import DailySummary from "./daily_summary";
import SinleDate from "./single_date_sel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getDailySummaryData,
  getGrossProfitData,
} from "../../actions/reportsService";
import {
  dailySelectDate,
  dailySummaryData,
  grossProfitSummaryData,
  reportType,
} from "../../reducers/reportsSlice";
import GrossProfit from "./gross_profit";
import moment from "moment";
const Reports = () => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const reportsData = useSelector((state) => state.reportsInfo);
  const selectedDate = reportsData?.dailySelectDate;
  const [selectedTab, setSelectedTab] = useState("dailySummary");
  const dispatch = useDispatch();
  const links = [
    {
      id: 1,
      name: "Daily Summary",
      to: "dailySummary",
      className: "nav-link",
    },
    {
      id: 2,
      name: "Gross Profits",
      to: "grossProfits",
      className: "nav-link",
    },
    {
      id: 3,
      name: "Stock Reports",
      to: "stockReports",
      className: "nav-link",
    },
    {
      id: 4,
      name: "Sales Reports",
      to: "salesReports",
      className: "nav-link",
    },
    {
      id: 5,
      name: "Purchase Reports",
      to: "purchaseReports",
      className: "nav-link",
    },
  ];
  const handleClick = (id, path) => {
    setSelectedTab(path);
    dispatch(reportType(path));
    if (path == "grossProfits") {
      getGrross(selectedDate);
    }
    dispatch(dailySelectDate(moment(new Date()).format("YYYY-MM-DD")));
  };
  const Saleslinks = [
    {
      id: 1,
      name: "Sales Summary",
      to: "salesSummary",
      className: "nav-link",
    },
    {
      id: 2,
      name: "By Buyer",
      to: "byBuyer",
      className: "nav-link",
    },
    {
      id: 3,
      name: "By Crop",
      to: "byCrop",
      className: "nav-link",
    },
  ];
  const Purchaselinks = [
    {
      id: 1,
      name: "Purchase Summary",
      to: "purchaseSummary",
      className: "nav-link",
    },
    {
      id: 1,
      name: "By Seller",
      to: "bySeller",
      className: "nav-link",
    },
    {
      id: 1,
      name: "By Crop",
      to: "byCropPurchase",
      className: "nav-link",
    },
  ];
  useEffect(() => {
    dispatch(reportType("dailySummary"));

    // if (selectedTab == "dailySummary") {
    //   getDailySummary();
    // }
  }, []);

  const getGrross = (date) => {
    var d = moment(date).format("YYYY-MM-DD");
    console.log(date, d, "click");
    getGrossProfitData(d, clickId).then(
      (response) => {
        if (response.data.status.type === "SUCCESS") {
          toast.success(response.data.status.message, {
            toastId: "success2",
          });
          if (response.data.data != null) {
            dispatch(grossProfitSummaryData(response.data.data));
          } else {
            dispatch(grossProfitSummaryData(null));
          }
          console.log(response, "gross sum");
        }
      },
      (error) => {
        toast.error(error.response.data.status.description, {
          toastId: "error2",
        });
      }
    );
  };
  return (
    <div className="main_div_padding">
      <div className="container-fluid px-0">
        <SinleDate />
        <div class="row reports_main_row" id = "scroll_style">
          <div class="col-md-2 mb-3 p-0">
            <ul
              className="nav nav-pills reports_nav flex-column"
              id="scroll_style"
            >
              {links.map((link, i) => {
                return link.name == "Sales Reports" ||
                  link.name == "Purchase Reports" ? (
                  <div className="sales_purchase_tabs">
                    <a
                      className={
                        link.className +
                        " sales" +
                        (link.to === (selectedTab != "" ? selectedTab : "")
                          ? " active_item"
                          : "")
                      }
                      href={"#collapseExample" + i}
                      data-toggle="collapse"
                      role="button"
                      aria-expanded="true"
                      aria-controls="collapseExample1"
                    >
                      <div className="flex_class mr-0">
                        <span>{link.name} </span>
                        <i class="fa fa-angle-down"></i>
                      </div>
                    </a>
                    <div id={"collapseExample" + i} class="collapse show">
                      <ul className="inner_div">
                        {link.name == "Sales Reports"
                          ? Saleslinks.map((item, i) => {
                              return (
                                <li key={item.id}>
                                  <a
                                    onClick={() =>
                                      handleClick(item.id, item.to)
                                    }
                                    className={
                                      item.className +
                                      " inner_link" +
                                      (item.to ===
                                      (selectedTab != "" ? selectedTab : "")
                                        ? " active_item"
                                        : "")
                                    }
                                    href={"#" + item.to}
                                    role="tab"
                                    aria-controls="home"
                                    data-bs-toggle="tab"
                                  >
                                    <div className="flex_class mr-0">
                                      <span>{item.name} </span>
                                    </div>
                                  </a>
                                </li>
                              );
                            })
                          : Purchaselinks.map((item, i) => {
                              return (
                                <li key={item.id}>
                                  <a
                                    onClick={() =>
                                      handleClick(item.id, item.to)
                                    }
                                    className={
                                      item.className +
                                      " inner_link" +
                                      (item.to ===
                                      (selectedTab != "" ? selectedTab : "")
                                        ? " active_item"
                                        : "")
                                    }
                                    href={"#" + item.to}
                                    role="tab"
                                    aria-controls="home"
                                    data-bs-toggle="tab"
                                  >
                                    <div className="flex_class mr-0">
                                      <span>{item.name} </span>
                                    </div>
                                  </a>
                                </li>
                              );
                            })}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <li key={link.id}>
                    <a
                      onClick={() => handleClick(link.id, link.to)}
                      className={
                        link.className +
                        (link.to === (selectedTab != "" ? selectedTab : "")
                          ? " active_item"
                          : "")
                      }
                      href={"#" + link.to}
                      role="tab"
                      aria-controls="home"
                      data-bs-toggle="tab"
                    >
                      <div className="flex_class mr-0">
                        <span>{link.name} </span>
                        <i class="fa fa-angle-right"></i>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div class="col-md-10">
            <div class="tab-content" id="myTabContent">
              <div
                className="tab-pane active"
                id={selectedTab}
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                {(() => {
                  switch (selectedTab) {
                    case "dailySummary":
                      return <DailySummary />;
                    case "grossProfits":
                      return <GrossProfit />;
                    case "salesSummary":
                      return <ComingSoon />;
                    case "purchaseSummary":
                      return <ComingSoon />;
                    case "bySeller":
                      return <ComingSoon />;
                    case "byCrop":
                      return <ComingSoon />;
                    case "byBuyer":
                      return <ComingSoon />;
                    case "byCropPurchase":
                      return <ComingSoon />;
                    case "stockReports":
                      return <ComingSoon />;
                    default:
                      return null;
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
export default Reports;
