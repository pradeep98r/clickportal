import { useEffect, useState } from "react";
import { getPartnerData } from "../../actions/billCreationService";
import single_bill from "../../assets/images/bills/single_bill.svg";
import d_arrow from "../../assets/images/d_arrow.png";
import "../../modules/buy_bill_book/step1.scss";
import { useNavigate } from "react-router-dom";
import NoDataAvailable from "../../components/noDataAvailable";
import SearchField from "../../components/searchField";
import { useDispatch, useSelector } from "react-redux";
import { selectBuyer } from "../../reducers/buyerSlice";
import { selectTrans } from "../../reducers/transSlice";
import tickMark from "../../assets/images/tick_mark.svg";
import $ from "jquery";
const SelectPartner = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const users = useSelector((state) => state.buyerInfo);
  const transusers = useSelector((state) => state.transInfo);
  const clickId = loginData.caId;
  const dispatch = useDispatch();
  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);
  const [allData, setAllData] = useState([]);
  let [partnerData, setpartnerData] = useState(allData);

  const navigate = useNavigate();
  const [getPartyItem, setGetPartyItem] = useState(
    props.partyType.toLowerCase() == "seller" ||
      props.partyType.toLowerCase() == "buyer"
      ? users.buyerInfo
      : props.partyType.toLowerCase() === "transporter"
      ? transusers.transInfo
      : ""
  );
  const fetchPertnerData = () => {
    var partnerType = "";

    if (props.partyType == "Seller") {
      partnerType = "FARMER";
    } else if (props.partyType == "Transporter") {
      partnerType = "TRANSPORTER";
    } else if (props.partyType == "Buyer") {
      partnerType = "BUYER";
    }
    getPartnerData(clickId, partnerType)
      .then((response) => {
        setAllData(response.data.data);
        setpartnerData(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  var bodyClickCount = 0;
  const [getPartyName, setGetPartyName] = useState(false);
  const [count, setCount] = useState(0);
  const [activeInput, setActiveInput] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const selectParty = () => {
    setActiveInput(true);
    setGetPartyName(true);
    setGetPartyItem(null);
  
    if (searchValue != "") {
      fetchPertnerData();
    }
  };

  const partySelect = (item) => {
    Object.assign(item, { itemtype: "" }, { date: "" });
    setGetPartyItem(item);
    setSelectedPartner(item);
    setCount(item.partyId);
    // localStorage.setItem("selectedSearchItem", JSON.stringify(item));
    setGetPartyName(false);
    var itemtype;
    if (props.partyType == "Seller") {
      localStorage.setItem("selectBuyertype", "seller");
      itemtype = localStorage.getItem("selectBuyertype");
      // localStorage.setItem("selectPartytype", "seller");
      // itemtype = localStorage.getItem("selectPartytype");
      props.parentCallback(item, itemtype, props.partyType);
      item.itemtype = "seller";
      item.partyType = props.partyType;
      dispatch(selectBuyer(item));
      // localStorage.setItem("selectedPartner", JSON.stringify(item));
    } else if (props.partyType == "Transporter") {
      localStorage.setItem("selectedTransporter", JSON.stringify(item));
      dispatch(selectTrans(item));
    } else if (props.partyType == "Buyer") {
      localStorage.setItem("selectBuyertype", "buyer");
      itemtype = localStorage.getItem("selectBuyertype");
      props.parentCallback(item, itemtype, props.partyType);
      item.itemtype = "buyer";
      item.partyType = props.partyType;
      dispatch(selectBuyer(item));
      // localStorage.setItem("selectedBuyer", JSON.stringify(item));
    }
  };

  // $('body').click(function(event){
  //   if (!$(event.target).closest('#excludeDiv').length) {
  //     $('#scroll_style').hide();
  //     setActiveInput(false);
  //     setGetPartyItem(selectedPartner);
  //   }
  // });
  useEffect(() => {
    fetchPertnerData();
  }, [users.buyerInfo]);
  const [searchValue, setsearchValue] = useState("");
  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = allData.filter((data) => {
      if (data.mobile.includes(value)) {
        return data.mobile.search(value) != -1;
      } else if (data.partyName.toLowerCase().includes(value)) {
        return data.partyName.toLowerCase().search(value) != -1;
      } else if (data.partyId.toString().includes(value)) {
        return data.partyId.toString().search(value) != -1;
      }
    });
    if (value != "") {
      setpartnerData(result);
    } else if (value === "") {
      setpartnerData(allData);
    }
    setsearchValue(value);
  };
  return (
    <div>
      <div onClick={selectParty}>
        {getPartyItem == null ? (
          <div>
          {activeInput?
            <div className="selectparty_field d-flex align-items-center justify-content-between" id="excludeDiv">
              <div className="d-flex searchparty pb-0" role="search">
                <SearchField
                  placeholder={langFullData.search}
                  onChange={(event) => {
                    handleSearch(event);
                  }}
                />
              </div>
            </div>
            :
            <div className="selectparty_field d-flex align-items-center justify-content-between">
              <p>Select {props.partyType}</p>
              <img src={d_arrow} />
          </div>
          }
          </div>
        ) : (
          <div className="selectparty_field d-flex align-items-center justify-content-between">
            <div className="partner_card">
              <div className="d-flex align-items-center">
                {getPartyItem.profilePic != "" ? (
                  <img src={getPartyItem.profilePic} className="icon_user" />
                ) : (
                  <img src={single_bill} className="icon_user" />
                )}
                <div>
                  <h5>{getPartyItem.partyName}</h5>
                  <h6>
                    {getPartyItem.partyType} - {getPartyItem.partyId} |{" "}
                    {getPartyItem.mobile}
                  </h6>
                  <p>{getPartyItem.address?.addressLine}</p>
                </div>
              </div>
            </div>
            <img src={d_arrow} />
          </div>
        )}
      </div>

      {getPartyName ? (
        <div className="partners_div" id="scroll_style" >
          <div id="partners">
            {partnerData.length > 0 ? (
              <div>
               
                <ul>
                  {partnerData.map((item) => {
                    return (
                      <li
                        key={item.partyId}
                        onClick={() => partySelect(item)}
                        className={
                          "nav-item " +
                          (item.partyId == count
                            ? "active_class"
                            : "")
                        }
                      >
                        <div className="partner_card">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              {item.profilePic != "" ? (
                                <img
                                  src={item.profilePic}
                                  className="icon_user"
                                />
                              ) : (
                                <img src={single_bill} className="icon_user" />
                              )}
                              <div>
                                <h5>{item.partyName}</h5>
                                <h6>
                                  {item.trader ? "TRADER" : item.partyType} -{" "}
                                  {item.partyId} | {item.mobile}
                                </h6>
                                <p>{item.address?.addressLine}</p>
                              </div>
                            </div>
                            {item.partyId == count ? (
                              <img
                                src={tickMark}
                                alt="image"
                                className="mr-2"
                              />
                            ) : (
                              ""
                            )}
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
