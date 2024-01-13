import { useEffect, useState } from "react";
import single_bill from "../../assets/images/bills/single_bill.svg";
import a_icon from "../../assets/images/a_r.svg";
import "../../modules/buy_bill_book/step1.scss";
import { useDispatch, useSelector } from "react-redux";
import { getMaskedMobileNumber } from "../../components/getCurrencyNumber";
import { getPartnerType, getText } from "../../components/getText";
import Select from "react-select";
import { getAllPartnersByTypes } from "../../actions/advancesService";
import {
  allpartnerDataByTypes,
  fromParentSelect,
  partyOutstandingAdv,
  partyOutstandingBal,
  selectedAdvanceId,
  selectedPartyByAdvanceId,
} from "../../reducers/advanceSlice";
import { getOutstandingBal } from "../../actions/billCreationService";
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
const SelectedPartner = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const advancesData = useSelector((state) => state.advanceInfo);
  const clickId = loginData.caId;
  const dispatch = useDispatch();
  const fromParentSelectVal = advancesData?.fromParentSelect;
  const partnerData = advancesData?.allpartnerDataByTypes;
  const selectedParty = fromParentSelectVal
    ? null
    : advancesData?.selectedPartyByAdvanceId;
  var writerId = loginData?.useStatus == "WRITER" ? loginData?.clickId : 0;
  useEffect(() => {
    fetchPertnerData();
  }, []);
  const fetchPertnerData = () => {
    const obj = {
      types: ["TRANSPORTER", "FARMER", "BUYER"],
      writerId: writerId,
    };
    getAllPartnersByTypes(clickId, obj)
      .then((response) => {
        if (response.data.data != null) {
          dispatch(allpartnerDataByTypes(response.data.data));
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
    dispatch(selectedPartyByAdvanceId(item));
    dispatch(fromParentSelect(false));
    dispatch(selectedAdvanceId(item.partyId));
    getOutstandingPaybles(clickId, item.partyId);
  };
  const getOutstandingPaybles = (clickId, transId) => {
    getOutstandingBal(clickId, transId).then((response) => {
      if (response.data.data != null) {
        dispatch(partyOutstandingBal(response.data.data.tobePaidRcvd));
        dispatch(
          partyOutstandingAdv(
            response.data.data.advance != null ? response.data.data.advance : 0
          )
        );
      }
    });
  };
  return (
    <div>
      {partnerData.length > 0 ? (
        <div className="partner_card">
          <div className="d-flex align-items-center">
            <Select
              isSearchable={true}
              className="basic-single record_popup_select"
              classNamePrefix="select"
              styles={colourStyles}
              name="partner"
              hideSelectedOptions={false}
              options={partnerData}
              placeholder={"Select Party"}
              value={selectedParty}
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
                    <div className="-">
                      <h5>{e.partyName}</h5>
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
            <img
              src={a_icon}
              alt="image"
              className={fromParentSelectVal ? "a_icon" : "a_icon_selected"}
            />
          </div>
        </div>
      ) : (
        <div>
          <Select placeholder={"Select Party"} />
        </div>
      )}
    </div>
  );
};
export default SelectedPartner;
