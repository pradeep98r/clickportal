import { useEffect, useState } from "react";
import { getPartnerData } from "../../actions/billCreationService";
import single_bill from "../../assets/images/bills/single_bill.svg";
import d_arrow from "../../assets/images/d_arrow.png";
import "../../modules/buy_bill_book/step1.scss";
import { useNavigate } from "react-router-dom";
import NoDataAvailable from "../../components/noDataAvailable";
const SelectPartner = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  let [partnerData, setpartnerData] = useState([]);
  const navigate = useNavigate();
  console.log("Select search");
  const [getPartyItem, setGetPartyItem] = useState(null);
  const fetchPertnerData = () => {
    var partnerType = "";
    console.log(props.partyType);
    if (props.partyType == "Seller") {
      partnerType = "FARMER";
    } else if (props.partyType == "Transporter") {
      partnerType = "TRANSPORTER";
    } else if (props.partyType == "Buyer") {
      partnerType = "BUYER";
    }
    getPartnerData(clickId, partnerType)
      .then((response) => {
        setpartnerData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [searchPartyItem, setSearchPartyItem] = useState("");
  const [getPartyName, setGetPartyName] = useState(false);
  const selectParty = () => {
    setGetPartyName(true);
    console.log(true);
  };
  const partySelect = (item) => {
    console.log(item);
    setGetPartyItem(item);
    setGetPartyName(false);
    props.parentCallback(item);
    if (props.partyType == "Seller") {
      localStorage.setItem("selectedPartner", JSON.stringify(item));
    } else if (props.partyType == "Transporter") {
      console.log(item);
      localStorage.setItem("selectedTransporter", JSON.stringify(item));
    } else if (props.partyType == "Buyer") {
      console.log(item);
      localStorage.setItem("selectedBuyer", JSON.stringify(item));
    }
  };
  useEffect(() => {
    fetchPertnerData();
  }, []);
  return (
    <div>
      <div onClick={selectParty}>
        {getPartyItem == null ? (
          <div className="selectparty_field d-flex align-items-center justify-content-between">
            <p>Select {props.partyType}</p>
            <img src={d_arrow} />
          </div>
        ) : (
          <div className="selectparty_field d-flex align-items-center justify-content-between">
            <div className="partner_card">
              <div className="d-flex align-items-center">
                <img src={single_bill} className="icon_user" />
                <div>
                  <h5>{getPartyItem.partyName}</h5>
                  <h6>
                    {getPartyItem.partyType} - {getPartyItem.partyId} |{" "}
                    {getPartyItem.mobile}
                  </h6>
                  <p>{getPartyItem.address.addressLine}</p>
                </div>
              </div>
            </div>
            <img src={d_arrow} />
          </div>
        )}
      </div>

      {getPartyName ? (
        <div className="partners_div" id="scroll_style">
          <div>
            {partnerData.length > 0 ? (
              <div>
                <div className="d-flex searchparty" role="search">
                  <input
                    className="form-control mb-0"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    onChange={(event) => setSearchPartyItem(event.target.value)}
                  />
                </div>
                <ul>
                  {partnerData
                    .filter((item) => {
                      if (searchPartyItem === "") {
                        return item;
                      } else if (
                        item.partyName
                          .toLowerCase()
                          .includes(searchPartyItem.toLowerCase())
                      ) {
                        return item;
                      } else if (
                        item.mobile.toLowerCase().includes(searchPartyItem)
                      ) {
                        return item;
                      } else if (
                        item.partyId
                          .toString()
                          .toLowerCase()
                          .includes(searchPartyItem)
                      ) {
                        return item;
                      }
                    })
                    .map((item) => {
                      return (
                        <li
                          key={item.partyId}
                          onClick={() => partySelect(item)}
                          className={
                            "nav-item " +
                            (item == getPartyItem ? "active_class" : "")
                          }
                        >
                          <div className="partner_card">
                            <div className="d-flex align-items-center">
                              <img src={single_bill} className="icon_user" />
                              <div>
                                <h5>{item.partyName}</h5>
                                <h6>
                                  {item.trader ? "TRADER" : item.partyType} -{" "}
                                  {item.partyId} | {item.mobile}
                                </h6>
                                <p>{item.address.addressLine}</p>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ) : (
              <NoDataAvailable />
            )}
          </div>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};
export default SelectPartner;
