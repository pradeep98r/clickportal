import React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from "react-select";
import "../../modules/advances/selectedOptions.scss";
import { advanceDataInfo, selectedAdvanceId, selectedPartyByAdvanceId } from '../../reducers/advanceSlice';
const colourStyles = {
    control: (provided) => ({
        ...provided,
        borderColor: '#9e9e9e',
        height: '38px',
        padding:'0px 10px',
        alignItems:'center'
      }),
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
const SelectOptions = () => {
    
    const options = [
        { value: 'all', label: 'All' },
        { value: 'sellers', label: 'Sellers' },
        { value: 'transporters', label: 'Transporters' }
    ]

    const advancesData = useSelector((state) => state.advanceInfo);
    const advancesArray = advancesData?.advanceDataInfo;
    const [partnerArray, setPartnerArray] = useState(advancesArray);
    const dispatch = useDispatch();
    const getSelectedOption =(label)=>{
        if(label =='Sellers'){
            const filterArray=partnerArray.filter(item => item?.partyType?.toUpperCase() =='FARMER');
            dispatch(advanceDataInfo(filterArray));
            dispatch(selectedAdvanceId(filterArray[0].partyId));
            //   getAdvanceSummary(res.data.data.advances[0].partyId);
              dispatch(selectedPartyByAdvanceId(filterArray[0]));
        } else if(label =='Transporters'){
            const filterArray=partnerArray.filter(item => item?.partyType?.toUpperCase() =='TRANSPORTER');
            dispatch(advanceDataInfo(filterArray));
        } else{
            dispatch(advanceDataInfo(partnerArray));
        }
    }
    
    function handleChange(option) {
        if(option.label =='Sellers'){
            const filterArray=partnerArray.filter(item => item?.partyType?.toUpperCase() =='FARMER');
            dispatch(advanceDataInfo(filterArray));
        } else if(option.label =='Transporters'){
            const filterArray=partnerArray.filter(item => item?.partyType?.toUpperCase() =='TRANSPORTER');
            dispatch(advanceDataInfo(filterArray));
        } else{
            dispatch(advanceDataInfo(partnerArray));
        }
    }
    return (
        <div className="">
            <Select
                defaultValue={options[0]}
                isSearchable={false}
                className="basic-single select-options"
                classNamePrefix="select"
                styles={colourStyles}
                options={options}
                onChange={handleChange}
                hideSelectedOptions={false}
                getOptionValue={(e) => e.value}
                getOptionLabel={(e) => (
                    <div style={{ display: "flex", alignItems: "center"}} 
                    onClick={()=>getSelectedOption(e.label)}>
                        <span className='label_font'>{e.label}</span>
                    </div>
                )}
            />
        </div>
    )
}

export default SelectOptions