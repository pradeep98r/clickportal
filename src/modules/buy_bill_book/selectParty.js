import { useEffect, useState } from "react";
import { getPartnerData } from "../../actions/billCreationService";
import single_bill from "../../assets/images/bills/single_bill.svg";
import "../../modules/buy_bill_book/step1.scss";
import { useDispatch, useSelector } from "react-redux";
import { selectBuyer } from "../../reducers/buyerSlice";
import { selectTrans } from "../../reducers/transSlice";
import { getMaskedMobileNumber } from "../../components/getCurrencyNumber";
import { getPartnerType, getText } from "../../components/getText";
import Select from "react-select";
const colourStyles = {
  menuList: (styles) => ({
    ...styles,
    background: "white",
    padding: "0px 10px",
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    background: isFocused ? "#D7F3DD" : isSelected ? "#D7F3DD" : undefined,
    zIndex: 1,
    border: isFocused
      ? "1px solid #16A12C"
      : isSelected
      ? "1px solid #16A12C"
      : undefined,
    borderRadius: isFocused ? "10px" : isSelected ? "10px" : undefined,
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";

    return { ...provided, opacity, transition };
  },
  menu: (base) => ({
    ...base,
    zIndex: 100,
    padding: "10px 0px",
  }),
};
const SelectPartner = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const users = useSelector((state) => state.buyerInfo);
  const transusers = useSelector((state) => state.transInfo);
  const clickId = loginData.caId;
  const dispatch = useDispatch();
  const [allData, setAllData] = useState([]);
  let [partnerData, setpartnerData] = useState(allData);

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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [selectedPartner, setSelectedPartner] = useState(
    props.partyType.toLowerCase() == "seller" ||
      props.partyType.toLowerCase() == "buyer"
      ? users.buyerInfo
      : props.partyType.toLowerCase() === "transporter"
      ? transusers.transInfo
      : null
  );

  const filterOption = (option, inputValue) => {
    const { partyName, mobile, shortName, partyId } = option.data;
    const addressLine = option.data.address?.addressLine;
    const searchValue = inputValue.toLowerCase();

    return (
      partyName.toLowerCase().includes(searchValue) ||
      mobile.toLowerCase().includes(searchValue) ||
      shortName.toLowerCase().includes(searchValue) ||
      partyId.toString().includes(searchValue) ||
      addressLine?.toLowerCase().includes(searchValue)
    );
  };
  const partySelect = (item) => {
    Object.assign(item, { itemtype: "" }, { date: "" });
    setSelectedPartner(item);
    var itemtype;
    if (props.partyType == "Seller") {
      localStorage.setItem("selectBuyertype", "seller");
      itemtype = localStorage.getItem("selectBuyertype");
      props.parentCallback(item, itemtype, props.partyType);
      item.itemtype = "seller";
      item.partyType = props.partyType;
      dispatch(selectBuyer(item));
    } else if (props.partyType == "Transporter") {
      localStorage.setItem("selectedTransporter", JSON.stringify(item));
      Object.assign(item, { transporterId: item.partyId });
      dispatch(selectTrans(item));
    } else if (props.partyType == "Buyer") {
      localStorage.setItem("selectBuyertype", "buyer");
      itemtype = localStorage.getItem("selectBuyertype");
      props.parentCallback(item, itemtype, props.partyType);
      item.itemtype = "buyer";
      item.partyType = props.partyType;
      dispatch(selectBuyer(item));
    }
  };

  useEffect(() => {
    fetchPertnerData();
  }, [users.buyerInfo]);

  return (
    <div>
      {partnerData.length > 0 ? (
        <div className="">
          <Select
            defaultMenuIsOpen
            isSearchable={true}
            className="basic-single"
            classNamePrefix="select"
            styles={colourStyles}
            name="partner"
            hideSelectedOptions={false}
            options={partnerData}
            placeholder={
              "Select " +
              (props.partyType == "Seller" ? "Farmer" : props.partyType)
            }
            value={selectedPartner}
            onChange={partySelect}
            filterOption={filterOption}
            isClearable={false}
            noOptionsMessage={() => "No Data Available"}
            getOptionValue={(e) => e.partyId}
            getOptionLabel={(e) => (
              <div
                style={{ display: "flex", alignItems: "center" }}
                className=""
              >
                {e.profilePic !== "" ? (
                  <img src={e.profilePic} className="icon_user" />
                ) : (
                  <img src={single_bill} className="icon_user" />
                )}
                <div style={{ marginLeft: 5 }}>
                  <div className="partner_card">
                    <h5>{getText(e.partyName) + " " + e.shortName}</h5>
                    <h6>
                      {getPartnerType(e.partyType, e.trader)} - {e.partyId} |{" "}
                      {getMaskedMobileNumber(e.mobile)}
                    </h6>
                    <p>{e.address?.addressLine}</p>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      ) : (
        <div>
          <Select placeholder={"Select " + props.partyType} />
        </div>
      )}
    </div>
  );
};
export default SelectPartner;
