import { useEffect, useState } from "react";
import { getPartnerData } from "../../actions/billCreationService";
import single_bill from "../../assets/images/bills/single_bill.svg";
import "../../modules/buy_bill_book/step1.scss";
import { useDispatch, useSelector } from "react-redux";
import { getMaskedMobileNumber } from "../../components/getCurrencyNumber";
import { getPartnerType, getText } from "../../components/getText";
import Select from "react-select";
import { multiSelectPartners } from "../../reducers/multiBillSteps";
import { partnerDataInfo, partnersAllData } from "../../reducers/partnerSlice";
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
const SelectMultiPartner = () => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const selectedStep = useSelector((state) => state.multiStepsInfo);
  const partyType = selectedStep?.multiSelectPartyType;
  const multiSelectPartnersArray = selectedStep?.multiSelectPartners;
  const clickId = loginData.caId;
  const dispatch = useDispatch();
  const partnerDataArray = useSelector((state) => state.partnerInfo);
  const partnerData = partnerDataArray?.partnerDataInfo;
  const cropInfoByLineItemArray = selectedStep?.cropInfoByLineItem;

  const fetchPertnerData = () => {
    var partnerType = "";
    if (partyType == "Seller") {
      partnerType = "FARMER";
    } else if (partyType == "Buyer") {
      partnerType = "BUYER";
    }
    getPartnerData(clickId, partnerType)
      .then((response) => {
        if (response.data.data != null) {
          dispatch(partnersAllData(response.data.data));
          dispatch(partnerDataInfo(response.data.data));
        } else {
          dispatch(partnersAllData([]));
          dispatch(partnerDataInfo([]));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

    item?.map((party, index) => {
      let clonedObject = { ...item[index] };
      Object.assign(clonedObject,{lineItems : cropInfoByLineItemArray});
     item[index] = clonedObject;
    })
    dispatch(multiSelectPartners(item));
  };

  useEffect(() => {
    fetchPertnerData();
  }, [multiSelectPartnersArray]);

  return (
    <div>
      {partnerData.length > 0 ? (
        <div className="partner_card p-0">
          <Select
            isSearchable={true}
            isMulti
            className="basic-single"
            classNamePrefix="select"
            styles={colourStyles}
            controlShouldRenderValue={false}
            name="partner"
            hideSelectedOptions={false}
            options={partnerData}
            placeholder={
              "Select " + (partyType == "Seller" ? "Farmer" : partyType)
            }
            value={multiSelectPartnersArray}
            onChange={partySelect}
            filterOption={filterOption}
            isClearable={false}
            noOptionsMessage={() => "No Data Available"}
            getOptionValue={(e) => e.partyId}
            getOptionLabel={(e) => (
              <div
                style={{ display: "flex", alignItems: "center" }}
                className="select_party_card"
              >
                {e.profilePic !== "" ? (
                  <img src={e.profilePic} className="icon_user" />
                ) : (
                  <img src={single_bill} className="icon_user" />
                )}
                <div style={{ marginLeft: 5 }}>
                  <div className="-">
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
          <Select placeholder={"Select " + partyType} />
        </div>
      )}
    </div>
  );
};
export default SelectMultiPartner;
