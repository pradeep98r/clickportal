import React from 'react'
import Select from "react-select";
import { useDispatch, useSelector } from 'react-redux';
import { multiSelectPartners, selectedTransporter, transportersData } from '../../reducers/multiBillSteps';
import {getText } from '../../components/getText';
import single_bill from "../../assets/images/bills/single_bill.svg";
import '../multi_buy_bill/selectSinglePartner.scss'
import { useEffect } from 'react';
import { getPartnerData } from '../../actions/billCreationService';
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
const SelectSinglePartner = ({indexVal, fromTrans}) => {

    const allPartners = useSelector((state) => state.partnerInfo);
    const selectedStep = useSelector((state) => state.multiStepsInfo);
    const allTransporters = selectedStep?.transportersData;
    const selectedTrans = selectedStep?.selectedTransporter;
    const multiSelectPartnersArray = fromTrans?selectedTrans: selectedStep?.multiSelectPartners;
    const partnerDataArray = fromTrans?allTransporters: allPartners?.partnerDataInfo;
    const partyType = selectedStep?.multiSelectPartyType;
    const dispatch = useDispatch();
    const loginData = JSON.parse(localStorage.getItem("loginResponse"));
    const clickId = loginData.caId;
    
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
        if(fromTrans){
            const selectTransporter = [...multiSelectPartnersArray];
            selectTransporter[indexVal] = item;
            dispatch(selectedTransporter(selectTransporter))
        } else{
            const updatedPartners = [...multiSelectPartnersArray];
            updatedPartners[indexVal] = item;
            dispatch(multiSelectPartners(updatedPartners));
        }
        
    };
    const fetchPertnerData = () => {
        getPartnerData(clickId, 'TRANSPORTER')
          .then((response) => {
            if (response.data.data != null) {
                dispatch(transportersData(response.data.data));
            } else {
                dispatch(transportersData([]));
            }
          })
          .catch((error) => {
            console.log(error);
          });
      };

      useEffect(()=>{
        fetchPertnerData();
      },[])
    return (
        <div>
            {partnerDataArray.length > 0 ? (
                <div className="partner_cards p-0">
                    <Select
                        isSearchable={true}
                        className="basic-single select-basic-single"
                        classNamePrefix="select select-prefix" 
                        styles={colourStyles}
                        name="partner"
                        hideSelectedOptions={false}
                        options={partnerDataArray}
                        placeholder={
                            "Select " + (fromTrans?'Transporter':partyType == "Seller" ? "Farmer" : partyType)
                        }
                        value={multiSelectPartnersArray[indexVal]}
                        onChange={partySelect}
                        filterOption={filterOption}
                        isClearable={false}
                        noOptionsMessage={() => "No Data Available"}
                        getOptionValue={(e) => e.partyId}
                        getOptionLabel={(e) => (
                            <div
                                style={{ display: "flex", alignItems: "center" }}
                                className="select_party_cards justify-content-between .css-b62m3t-container"
                            >
                                <div className="d-flex">
                                    {e.profilePic !== "" ? (
                                        <img
                                            src={e.profilePic}
                                            className="icon_user"
                                        />
                                    ) : (
                                        <img src={single_bill} className="icon_user" />
                                    )}
                                    <div style={{ marginLeft: 5, alignItems: 'center' }}>
                                        <div className="user_name">
                                            <h5 className="party_name">
                                                {getText(e.partyName)}
                                            </h5>
                                        </div>
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
    )
}

export default SelectSinglePartner;