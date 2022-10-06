import React, { Component } from "react";
import "../buy_bill_book/buyBillBook.scss";
import Select from "react-select";
import click_logo from "../../assets/images/click_logo_green.svg";
import click_logo_y from "../../assets/images/click_logo_yellow.svg";
import single_bill from "../../assets/images/bills/single_bill.svg";
import search from "../../assets/images/search.svg";
import { useDispatch } from "react-redux";
import { selectBuyer } from "../../reducers/buyerSlice";
const options = [
  { value: "Aparna", label: "Aparna", icon: single_bill },
  { value: "appuu", label: "appuu", icon: single_bill },
  { value: "swathi", label: "swathi", icon: single_bill },
  { value: "hey", label: "hey", icon: single_bill },
  { value: "gita", label: "gita", icon: single_bill },
];
// const dispath = useDispatch();

// dispath(selectBuyer());
class SelectSearch extends Component {
  state = { isOpen: false, value: undefined };
  toggleOpen = () => {
    this.setState((state) => ({ isOpen: !state.isOpen }));
  };
  onSelectChange = (value) => {
    this.toggleOpen();
    this.setState({ value });
  };
  render() {
    const { isOpen, value } = this.state;
    // console.log(value);
    return (
      <div>
        <div className="row">
          <div className="col-lg-12 column">
            <Dropdown
              isOpen={isOpen}
              onClose={this.toggleOpen}
              target={
                <button
                //   iconAfter={<ChevronDown />}
                  onClick={this.toggleOpen}
                //   isSelected={isOpen}
                  className="select_button"
                >
                  <img
                    src={value ? `${value.icon}` : single_bill}
                    className="icon_user"
                  />
                  {value ? `${value.label}` : "Add Transporter"}
                </button>
              }
            >
              <Select
                autoFocus
                backspaceRemovesValue={false}
                components={{
                  DropdownIndicator,
                  IndicatorSeparator: null,
                }}
                controlShouldRenderValue={false}
                hideSelectedOptions={false}
                isClearable={false}
                menuIsOpen
                onChange={this.onSelectChange}
                options={options}
                placeholder="Search..."
                tabSelectsValue={false}
                value={value}
                getOptionLabel={(e) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={e.icon} className="icon_user" />
                    <span>{e.value}</span>
                  </div>
                )}
              />
            </Dropdown>
            <div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}
//
const Menu = (props) => {
  const shadow = "hsla(218, 50%, 10%, 0.1)";
  return (
    <div
      css={{
        backgroundColor: "white",
        borderRadius: 4,
        boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
        marginTop: 8,
        position: "absolute",
        zIndex: 2,
      }}
      {...props}
    />
  );
};
const Blanket = (props) => (
  <div
    css={{
      bottom: 0,
      left: 0,
      top: 0,
      right: 0,
      position: "fixed",
      zIndex: 1,
    }}
    {...props}
  />
);
const Dropdown = ({ children, isOpen, target, onClose }) => (
  <div css={{ position: "relative" }}>
    {target}
    {isOpen ? <Menu>{children}</Menu> : null}
    {isOpen ? <Blanket onClick={onClose} /> : null}
  </div>
);

const DropdownIndicator = () => (
  <div>
    {/* <Svg> */}
    <img src={search} />
    {/* </Svg> */}
  </div>
);
const ChevronDown = () => (
  // <Svg style={{ marginRight: -6 }}>
  <div>
    <img src={click_logo} />
  </div>
  // </Svg>
);

export default SelectSearch;
