import { useEffect, useRef, useState } from "react";
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
import { getMaskedMobileNumber } from "../../components/getCurrencyNumber";
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
        console.log(response,"res")
        setpartnerData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [getPartyName, setGetPartyName] = useState(false);
  const [count, setCount] = useState(0);
  const [activeInput, setActiveInput] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
    
  const [show, setDivShow] = useState(false);

  const selectParty = () => {
    setActiveInput(true);
    setGetPartyName(true);
    setGetPartyItem(null);
    if (searchValue != "") {
      fetchPertnerData();
    }
  };

  //   $('container').mouseup(function (e) {
  //     if ($(e.target).closest(".container").length === 0) {
  //       console.log("came to her")
  //       setGetPartyItem(selectedPartner);
  //       setActiveInput(false);
  //   }
  // });

  const partySelect = (item) => {
    Object.assign(item, { itemtype: "" }, { date: "" });
    setGetPartyItem(item);
    console.log(item)
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
      Object.assign(item,{transporterId:item.partyId})
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
      } else if(data.address?.addressLine.toLowerCase().includes(value)){
        return data.address?.addressLine.toLowerCase().search(value) != -1;
      }
      else if(data.shortName.toLowerCase().includes(value)){
        return data.shortName.toLowerCase().search(value) != -1;
      }
    });
    if (value != "") {
      setpartnerData(result);
    } else if (value === "") {
      setpartnerData(allData);
    }
    else{
      setpartnerData([])
    }
    setsearchValue(value);
  };
  
  const handleInput = ()=>{
    setGetPartyName(true)
  }
  $(document).mouseup(function(e) {
    var container = $('.partners_div');
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
        console.log('came to here')
        setActiveInput(false)
        setGetPartyName(false)
        setGetPartyItem(selectedPartner)
    }
  });
  return (
    <div>
      <div
        onClick={() => {
          selectParty();
        }}
      >
        {getPartyItem == null ? (
          <span>
            {activeInput ? (
              <div
                className="selectparty_field d-flex align-items-center justify-content-between"
                id="excludeDiv"
              >
                <div className="d-flex searchparty search_control_div pb-0" role="search">
                  {/* <SearchField
                  placeholder={langFullData.search}
                  onChange={(event) => {
                    handleSearch(event);
                  }}
                  
                /> */}
                  <input
                    onFocus={handleInput}
                    type="text"
                    className="form-control search_control"
                    placeholder={'Type ' + props.partyType + ' Name Here'}
                    onChange={(event) => {
                      handleSearch(event);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="selectparty_field d-flex align-items-center justify-content-between">
                <p>Select {props.partyType}</p>
                <img src={d_arrow} />
              </div>
            )}
          </span>
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
                  <h5>{getPartyItem.partyName + ' ' + getPartyItem.shortName}</h5>
                  <h6>
                    {getPartyItem.partyType} - {getPartyItem.partyId} |{" "}
                    {getMaskedMobileNumber(getPartyItem.mobile)}
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
        <div className="partners_div" id="scroll_style">
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
                          (item.partyId == count ? "active_class" : "")
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
                                <h5>{item.partyName + ' ' + item.shortName}</h5>
                                <h6>
                                  { item.partyType} -{" "}
                                  {item.partyId} | {getMaskedMobileNumber(item.mobile)}
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
      <div className="container"></div>
    </div>
  );
};
export default SelectPartner;
