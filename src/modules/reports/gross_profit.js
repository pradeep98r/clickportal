import React, { useState } from "react";
import { useSelector } from "react-redux";
import NoDataAvailable from "../../components/noDataAvailable";
import GrossProfitTable from "./grossProfitTable";
import $ from "jquery";
import GrossProfitTotals from "./gross_profit_totals";
import { getCurrencyNumberWithSymbol } from "../../components/getCurrencyNumber";
const GrossProfit = () => {
  const reportsData = useSelector((state) => state.reportsInfo);
  const grossSummaryInfo = reportsData?.grossProfitSummaryData;
  console.log(grossSummaryInfo, "grossProfitSummaryData");
  const links = [
    {
      id: 1,
      name: "Revenue",
      to: "revenue",
      className: "nav-link",
      status: true,
    },
    {
      id: 2,
      name: "Cost Of Goods Sold",
      to: "costOfGoodsSold",
      className: "nav-link",
      status: true,
    },
  ];

  const [statusArr, setStatusArr] = useState(links);
  const collapseLink = (index, links) => {
    let updatedItemListRateType = links.map((item, i) => {
      if (i == index) {
        if ($(`#collapseExample${i}`).hasClass("show")) {
          return { ...links[i], status: true };
        } else {
          return { ...links[i], status: false };
        }
      } else {
        return { ...links[i] };
      }
    });
    links = updatedItemListRateType;
    setStatusArr([...updatedItemListRateType]);
  };
  const getTotals = () =>{
      var str = grossSummaryInfo?.totalRevenue - grossSummaryInfo?.totalCOGS;
      return str != 0 ? getCurrencyNumberWithSymbol(str) : 0;
  }
  return (
    <div className="main_div_padding p-0">
      <div className="container-fluid px-0">
        {grossSummaryInfo != null ? (
          <div>
            <div className="total_gross">
                <p>Gross Profit : {(grossSummaryInfo?.totalRevenue != 0 ? getCurrencyNumberWithSymbol(grossSummaryInfo?.totalRevenue) : 0) +  (' - ' + (grossSummaryInfo?.totalCOGS != 0 ? getCurrencyNumberWithSymbol(grossSummaryInfo?.totalCOGS) : 0))} = <span className="color_red">{getTotals()}</span> </p>
                </div>
            {statusArr.map((link, i) => {
              return (
                <div className="reports_nav reports_nav_g mb-3">
                  <div
                    onClick={() => {
                      collapseLink(i, statusArr);
                    }}
                  >
                    <a
                      className={link.className + " sales"}
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
                    {statusArr[i].status ? (
                      <p>
                        {link.name == "Revenue" ? (
                      grossSummaryInfo?.buyersInfo.length > 0 ? (
                        <GrossProfitTotals type="BUYER" />
                      ) : (
                        <GrossProfitTotals type="BUYER" />
                      )
                    ) : grossSummaryInfo?.sellersInfo.length > 0 ? (
                      <GrossProfitTotals type="SELLER" />
                    ) : (
                        <GrossProfitTotals type="SELLER" />
                    )}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div id={"collapseExample" + i} class="collapse hide">
                    {link.name == "Revenue" ? (
                      grossSummaryInfo?.buyersInfo.length > 0 ? (
                        <GrossProfitTable type="BUYER" />
                      ) : (
                        <NoDataAvailable />
                      )
                    ) : grossSummaryInfo?.sellersInfo.length > 0 ? (
                      <GrossProfitTable type="SELLER" />
                    ) : (
                      <NoDataAvailable />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <NoDataAvailable />
        )}
      </div>
    </div>
  );
};
export default GrossProfit;
