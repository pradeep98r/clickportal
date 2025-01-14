import { useEffect, useState } from "react";
import AllTransporters from "./allTransporters";
import Transporters from "./transporters";
import "../../modules/transporto_ledger/transportoLedger.scss"
import { useDispatch } from "react-redux";
import { allCustomTabs } from "../../reducers/ledgerSummarySlice";
const TransportoLedger = () => {
  useEffect(() => {}, []);
const dispatch = useDispatch();
  const transPortoTabs = [
    {
      id: 1,
      name: "Transporter Ledger",
      to: "transporterLedger",
    },
    {
      id: 2,
      name: "Inventory Ledger Summary",
      to: "inventoryLedgerSummary",
    },
    {
      id: 3,
      name: "My Transporters",
      to: "myTransporters",
    },
  ];
  const [transPortoTabVal, setTransPortoTabVal] = useState("transporterLedger");
  const transportoTabChange = (data) => {
    setTransPortoTabVal(data);
    dispatch(allCustomTabs('all'));
  };
  return (
    <div className="main_div_padding">
      <div className="container-fluid px-0">
        <ul className="nav nav-tabs trans-tabs" id="myTab" role="tablist">
          {transPortoTabs.map((link) => {
            return (
              <li key={link.id} className="nav-item ">
                <a
                  className={
                    "nav-link" + (transPortoTabVal == link.to ? " active" : "")
                  }
                  href={"#" + transPortoTabVal}
                  role="tab"
                  aria-controls="home"
                  data-bs-toggle="tab"
                  onClick={() => transportoTabChange(link.to)}
                >
                  {link.name}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="tab-content main_div_padding px-0 pb-0">
          <div
            className="tab-pane active"
            id={transPortoTabVal}
            role="tabpanel"
            aria-labelledby="home-tab"
          >
            {transPortoTabVal != "myTransporters" ? (
              <Transporters transPortoTabVal={transPortoTabVal} />
            ) : (
              <AllTransporters />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TransportoLedger;
