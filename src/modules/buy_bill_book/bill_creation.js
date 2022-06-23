import React, { useState, useEffect } from "react";
import "../buy_bill_book/buy_bill_book.scss";
import getPreferredCropsApi from "../../services/get_partner_api";
import other_crop from "../../assets/images/other_crop.svg";
import { useNavigate } from "react-router-dom";
import CommonCard from "../../components/card";
import CommissionCard from "../../components/commission_card";
import close from "../../assets/images/close.svg";
import delete_icon from "../../assets/images/delete.svg";
import copy_icon from "../../assets/images/copy.svg";
import postPreferenceApi from "../../services/preferences";
import BuyBillCreation from "./buy_bill_creation";
import $ from "jquery";
var array = [];
function BillCreation() {
  let [responseData, setResponseData] = useState([]);
  let [allCropsData, allCropResponseData] = useState([]);
  let [cropData, cropResponseData] = useState(array);
  let [billSettingResponse, billSettingData] = useState(array);
  const navigate = useNavigate();
  // api to fettch preferred crops data
  const fetchData = () => {
    getPreferredCropsApi
      .getPreferredCrops()
      .then((response) => {
        setResponseData(response.data.data);
        console.log(response.data.data, "crops preferred");
      })
      .catch((error) => {
        console.log(error);
      });
    getPreferredCropsApi.getSystemSettings().then((res) => {
      console.log(res.data.data.billSetting);
      billSettingData(res.data.data.billSetting);
    });
  };
  const allCropData = () => {
    getPreferredCropsApi.getAllCrops().then((response) => {
      allCropResponseData(response.data.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSUbmit = (e) => {
    e.preventDefault();
    navigate("/smartboard");
  };
  // click on crop to get that crop details
  const cropOnclick = (crop, id) => {
    cropResponseData([...cropData, crop]);
  };
  // add crop in other crop popup model
  const addCropOnclick = (crop_item) => {
    console.log(crop_item, "add crop selected");
    setResponseData([...responseData, crop_item]);
    cropResponseData([...cropData, crop_item]);
  };
  const [selectedOption, setSelectedOption] = useState();
  const [selectedQty, setSelected] = useState(
    selectedOption ? selectedOption : "Crates"
  );
  // select quantity through radio button
  const selectQuantity = (e) => {
    console.log(e);
    setSelected(e.target.value);
  };
  // get quantity from dropdown

  // delete crop
  const deleteCrop = (crop) => {
    var array = cropData.filter(function (s) {
      return s != crop;
    });
    cropResponseData(array);
  };
  // storing input values in var
  const [commValue, getCommInput] = useState("");
  const [returnValue, getReturnInput] = useState("");
  const [cropItem, setSelectCrop] = useState("");
  const [state, setState] = useState({
    quantity: "",
    rate: "",
    totalWeight: "",
    wastage: "",
    total: "",
    activeLink: "",
  });

  const getQuantity = (id) => (e) => {
    console.log("hey");
    setState({ activeLink: id });
    setSelectedOption(e.target.value);
  };

  const getQuantityInputValues = (event, index) => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value,total:(state.quantity - state.wastage) *
                                        state.rate
    });
  };
  const cloneCopy = (crop) => {
    cropResponseData([...cropData, crop]);
  };
  return (
    <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
          <div className="row">
            <div className="col-lg-7 col_left">
              <h4 className="smartboard_main_header">
                Select crop and creat bill
              </h4>
              <div className="d-flex">
                {responseData.length > 0 && (
                  <div className="d-flex total_crops_div">
                    {responseData.map((crop) => (
                      <div
                        className="text-center crop_div"
                        key={crop.cropId}
                        onClick={() => cropOnclick(crop, crop.cropId)}
                      >
                        <img
                          src={crop.imageUrl}
                          className="flex_class mx-auto"
                        />
                        <p>{crop.cropName}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div
                  className="text-center crop_div other_Crop"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                  onClick={allCropData}
                >
                  <img src={other_crop} />
                  <p>Other Crop</p>
                </div>
              </div>
              <div className="row p-0">
                {cropData.length > 0 && (
                  <div className="p-0">
                    <h4 className="smartboard_main_header">Crop Information</h4>

                    <div className="table_row" id="scroll_style">
                      {cropData.map((crop, index) => (
                        <div className="crop_div crop_table_div" key={index}>
                          <div className="flex_class justify-content-between">
                            <div className="flex_class">
                              <img
                                src={crop.imageUrl}
                                className="flex_class mx-auto"
                              />
                              <p className="ml-auto ms-2">{crop.cropName}</p>
                            </div>
                            <select
                              className="form-control qty_dropdown dropdown"
                              value={
                                crop.cropId == state.activeLink
                                  ? selectedOption
                                  : ""
                              }
                              onChange={getQuantity(crop.cropId)}
                            >
                              <option value="Crates">Crates</option>
                              <option value="Bags">Bags</option>
                              <option value="Sacs">Sacs </option>
                              <option value="Boxes">Boxes </option>
                              <option value="Kgs">Kgs </option>
                            </select>

                            <div
                              className="radio_buttons"
                              onClick={selectQuantity}
                            >
                              <input
                                type="radio"
                                id="yes"
                                name="choose"
                                value={
                                  crop.cropId == state.activeLink
                                    ? selectedOption
                                    : "Crates"
                                }
                                checked={
                                  crop.cropId == state.activeLink
                                    ? selectedOption
                                    : "Crates"
                                }
                              />
                              <label htmlFor="yes">
                                Rate Per {""}
                                {crop.cropId == state.activeLink
                                  ? selectedOption
                                  : "Crates"}
                              </label>
                              <input
                                type="radio"
                                id="kg"
                                value="kg"
                                checked={"kg"}
                              />
                              <label htmlFor="kg">Rate Per Kg</label>
                            </div>
                          </div>
                          {/* table */}
                          <div className="crop_table_view">
                            {selectedQty == "kgs" ? (
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th className="">
                                      Number of{" "}
                                      {crop.cropId == state.activeLink
                                        ? selectedOption
                                        : "Crates"}
                                    </th>
                                    <th>Total Weight(Kgs)</th>
                                    <th>Wastage(kgs)</th>
                                    <th>Rate</th>
                                    <th>Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <input
                                        type="text"
                                        name="quantity"
                                        value={
                                          crop.cropId == state.activeLink
                                            ? state.quantity
                                            : ""
                                        }
                                        onChange={getQuantityInputValues(
                                          crop.cropId
                                        )}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        name="totalWeight"
                                        value={state.totalWeight}
                                        onChange={getQuantityInputValues(
                                          crop.cropId
                                        )}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        name="wastage"
                                        value={state.wastage}
                                        onChange={getQuantityInputValues(
                                          crop.cropId
                                        )}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        name="rate"
                                        value={state.rate}
                                        onChange={getQuantityInputValues(
                                          crop.cropId
                                        )}
                                      />
                                    </td>
                                    <td>
                                      {(state.totalWeight - state.wastage) *
                                        state.rate}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            ) : (
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th className="">
                                      Number of{" "}
                                      {crop.cropId == state.activeLink
                                        ? selectedOption
                                        : "Crates"}
                                    </th>
                                    <th>
                                      Wastage(
                                      {crop.cropId == state.activeLink
                                        ? selectedOption
                                        : "Crates"}
                                      )
                                    </th>
                                    <th>Rate</th>
                                    <th>Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <input
                                        type="text"
                                        class="form-control"
                                        name="quantity"
                                        // value={state.quantity}
                                        onChange={getQuantityInputValues}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        name="wastage"
                                        // value={state.wastage}
                                        // onChange
                                        onChange={getQuantityInputValues}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        name="rate"
                                        // value={state.rate}
                                        // onChange
                                        onChange={getQuantityInputValues}
                                      />
                                    </td>
                                    <td>
                                      {index + (state.quantity - state.wastage) *
                                        state.rate}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            )}
                          </div>
                          <div className="flex_class">
                            <div
                              className="flex_class sub_icons_div"
                              onClick={cloneCopy.bind(this, crop)}
                            >
                              <img
                                src={copy_icon}
                                className="sub_icons"
                                alt="image"
                              />
                              <p className="sub_icons_para copy_icon_text">
                                Copy
                              </p>
                            </div>
                            <div
                              className="flex_class sub_icons_div"
                              onClick={deleteCrop.bind(this, crop)}
                            >
                              <img
                                src={delete_icon}
                                className="sub_icons"
                                alt="image"
                              />
                              <p className="sub_icons_para">delete</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-5">
              <h4 className="smartboard_main_header">Additions/Deductions</h4>
              <div
                className="card default_card comm_total_card"
                id="scroll_style"
              >
                <CommissionCard
                  title="Commission"
                  rateTitle="Default Percentage %"
                  onChange={(event) => getCommInput(event.target.value)}
                  inputText={commValue}
                  totalTitle="Total"
                />
                <CommissionCard
                  title="Return Commission"
                  rateTitle="Default Percentage %"
                  onChange={(event) => getReturnInput(event.target.value)}
                  inputText={returnValue}
                  totalTitle="Total"
                />
                <CommonCard
                  title="Transportation"
                  rateTitle="Per Bag/Sac/Box/Crate"
                  onChange={(event) => getReturnInput(event.target.value)}
                  inputText={returnValue}
                  totalTitle="Total"
                  unitsTitle="Number of Units"
                />
                <CommonCard
                  title="Labor Charges"
                  rateTitle="Per Bag/Sac/Box/Crate"
                  onChange={(event) => getReturnInput(event.target.value)}
                  inputText={returnValue}
                  totalTitle="Total"
                  unitsTitle="Number of Units"
                />
                <CommonCard
                  title="Rent"
                  rateTitle="Per Bag/Sac/Box/Crate"
                  onChange={(event) => getReturnInput(event.target.value)}
                  inputText={returnValue}
                  totalTitle="Total"
                  unitsTitle="Number of Units"
                />
                <CommissionCard
                  title="Mandi Fee"
                  rateTitle="Default Percentage %"
                  onChange={(event) => getCommInput(event.target.value)}
                  inputText={commValue}
                  totalTitle="Total"
                />
                <div className="comm_cards row">
                  <div className="col-lg-6 col_left">
                    <h5 className="comm_card_title">Govt. Levies</h5>
                    <div className="card input_card">
                      <div className="col-lg-12">
                        <input
                          type="text"
                          placeholder=""
                          // onChange={onChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col_right">
                    <h5 className="comm_card_title">Other/Misc. Fee</h5>
                    <div className="card input_card">
                      <div className="col-lg-12">
                        <input
                          type="text"
                          placeholder=""
                          // onChange={}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="comm_cards row">
                  <div className="col-lg-12 col_left col_right">
                    <h5 className="comm_card_title">Add Comment</h5>
                    <div className="card input_card">
                      <div className="col-lg-12">
                        <input
                          type="text"
                          placeholder=""
                          // onChange={onChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="comm_cards row">
                  <div className="col-lg-6 col_left">
                    <h5 className="comm_card_title">Cash Paid</h5>
                    <div className="card input_card">
                      <div className="col-lg-12">
                        <input
                          type="text"
                          placeholder=""
                          // onChange={onChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col_right">
                    <h5 className="comm_card_title">Advances</h5>
                    <div className="card input_card">
                      <div className="col-lg-12">
                        <input
                          type="text"
                          placeholder=""
                          // onChange={}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom_div main_div">
        <div className="d-flex align-items-center justify-content-end">
          <button className="primary_btn" onClick={(e) => handleSUbmit(e)}>
            Next
          </button>
        </div>
      </div>
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title header2_text" id="staticBackdropLabel">
                Select Crop
              </h5>
              <img
                src={close}
                alt="image"
                className="close_icon"
                data-bs-dismiss="modal"
              />
              <div className="d-flex" role="search">
                <input
                  className="form-control search"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  onChange={(event) => setSelectCrop(event.target.value)}
                />
              </div>
            </div>
            <div className="modal-body" id="scroll_style">
              {allCropsData.length > 0 && (
                <div className="d-flex flex_width">
                  {allCropsData
                    .filter((crop_item) => {
                      if (cropItem === "") {
                        return crop_item;
                      } else if (
                        crop_item.cropName
                          .toLowerCase()
                          .includes(cropItem.toLowerCase())
                      ) {
                        return crop_item;
                      }
                    })
                    .map((crop_item) => (
                      <div className="col-lg-2">
                        <div
                          className="text-center crop_div"
                          key={crop_item.cropId}
                          onClick={() => addCropOnclick(crop_item)}
                        >
                          <img
                            src={crop_item.imageUrl}
                            className="flex_class mx-auto"
                          />
                          <p>{crop_item.cropName}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="secondary_btn"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary_btn"
                // onClick={() => postPreference()}
                data-bs-dismiss="modal"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // }
}
export default BillCreation;
