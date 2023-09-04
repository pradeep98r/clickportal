import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ComingSoon from "../../components/comingSoon";
import "../reports/reports.scss";
import DailySummary from "./daily_summary";
import SinleDate from "./single_date_sel";
import "react-toastify/dist/ReactToastify.css";
import { getGrossProfitData } from "../../actions/reportsService";
import loading from "../../assets/images/loading.gif";
import {
  dailySelectDate,
  grossProfitSummaryData,
  reportType,
} from "../../reducers/reportsSlice";
import GrossProfit from "./gross_profit";
import moment from "moment";
import SalesSummary from "./sales_summary";
import ByBuyerSeller from "./by_buyer_seller";
import ByCropDetails from "./by_crop";
import print from "../../assets/images/print_bill.svg";
import download_icon from "../../assets/images/dwnld.svg";
import { ToastContainer, toast } from "react-toastify";
import { Buffer } from "buffer";
import { getDailySummaryPdf, getGrossProfitSummaryPdf } from "../../actions/pdfservice/reportsPdf";
import { getDailySummaryJson } from "../../actions/pdfservice/billpdf/getDailySummaryPdfJson";
import { getGrossProfitSummaryJson } from "../../actions/pdfservice/billpdf/getGrossProfitPdfJson";

const Reports = () => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const reportsData = useSelector((state) => state.reportsInfo);
  const selectedDate = reportsData?.dailySelectDate;
  console.log(reportsData, "reportsData");
  const [selectedTab, setSelectedTab] = useState("dailySummary");
  const dispatch = useDispatch();
  const [isLoadingNew, setIsLoadingNew] = useState(false);
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
    console.log(path, "tab");
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
  async function handleLedgerSummaryJson() {
    setIsLoadingNew(true);
    var reportsJsonBody = selectedTab == 'dailySummary' ? getDailySummaryJson(
      reportsData?.dailySummaryData,
      reportsData?.dailySelectDate
    ) : getGrossProfitSummaryJson(
      reportsData,
      reportsData?.dailySelectDate
    );
    var pdfResponse = selectedTab == 'dailySummary' ?
     await getDailySummaryPdf(reportsJsonBody) : await getGrossProfitSummaryPdf(reportsJsonBody) ;
    console.log(pdfResponse, "pdfResponse");
    if (pdfResponse.status !== 200) {
      toast.error("Something went wrong", {
        toastId: "errorr2",
      });
      setIsLoadingNew(false);
      return;
    } else {
      toast.success("Pdf generated SuccessFully", {
        toastId: "errorr2",
      });
      var bufferData = Buffer.from(pdfResponse.data);
      var blob = new Blob([bufferData], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      setIsLoadingNew(false);
      window.open(blobUrl, "_blank");
    }
  }
  async function getDownloadPdf(allLedgersStatus) {
    setIsLoadingNew(true);
    var reportsJsonBody = selectedTab == 'dailySummary' ? getDailySummaryJson(
      reportsData?.dailySummaryData,
      reportsData?.dailySelectDate
    ) : getGrossProfitSummaryJson(
      reportsData,
      reportsData?.dailySelectDate
    );
    var pdfResponse = selectedTab == 'dailySummary' ?
     await getDailySummaryPdf(reportsJsonBody) : await getGrossProfitSummaryPdf(reportsJsonBody) ;
    console.log(pdfResponse, "pdfResponse");
    if (pdfResponse.status !== 200) {
      console.log(pdfResponse.status, "fasl");
      toast.error("Something went wrong", {
        toastId: "errorr2",
      });
      setIsLoadingNew(false);
      return;
    } else {
      console.log(pdfResponse.status, "true");
      toast.success("Pdf Downloaded SuccessFully", {
        toastId: "errorr2",
      });
      var bufferData = Buffer.from(pdfResponse.data);
      var blob = new Blob([bufferData], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
        link.setAttribute("download", `GROSS_PROFIT_SUMMARY.pdf`); //or any other extension
      document.body.appendChild(link);
      setIsLoadingNew(false);
      link.click();
      // setLoading(false);
    }
  }
  return (
    <div className="main_div_padding">
      <div className="container-fluid px-0">
        <div className="d-flex justify-content-between">
          <div></div>
          {selectedTab == "dailySummary" || selectedTab == "grossProfits" ? (
            <SinleDate />
          ) : (
            ""
          )}
          {selectedTab == "dailySummary" || selectedTab == "grossProfits" ?
          <div>
            <div className="print_dwnld_icons d-flex">
              <button
              onClick={() => {
                getDownloadPdf(true).then();
              }}
              >
                <img src={download_icon} alt="img" />
              </button>
              <button
                onClick={() => {
                  handleLedgerSummaryJson().then();
                }}
              >
                <img src={print} alt="img" />
              </button>
            </div>
          </div>
          : '' }
        </div>

        <div
          class={
            selectedTab == "dailySummary" || selectedTab == "grossProfits"
              ? "row reports_main_row"
              : "row"
          }
          id="scroll_style"
        >
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
          <div class="col-md-10 pr-0">
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
                      return <SalesSummary type="BUYER" />;
                    case "purchaseSummary":
                      return <SalesSummary type="FARMER" />;
                    case "bySeller":
                      return <ByBuyerSeller Ptype="FARMER" />;
                    case "byCrop":
                      return <ByCropDetails Ptype="BUYER" />;
                    case "byBuyer":
                      return <ByBuyerSeller Ptype="BUYER" />;
                    case "byCropPurchase":
                      return <ByCropDetails Ptype="FARMER" />;
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
        {isLoadingNew ? (
          <div className="loading_styles loading_styles_led">
            <img src={loading} alt="my-gif" className="gif_img" />
          </div>
        ) : (
          ""
        )}
      </div>
      <ToastContainer />
    </div>
  );
};
export default Reports;
