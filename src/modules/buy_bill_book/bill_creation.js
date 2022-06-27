import React, { useState, useEffect } from "react";
import "../buy_bill_book/buy_bill_book.scss";
import {
  getPreferredCrops,
  getAllCrops,
  getSystemSettings,
} from "../../services/billCreationService";
import other_crop from "../../assets/images/other_crop.svg";
import { useNavigate } from "react-router-dom";
import CommonCard from "../../components/card";
import CommissionCard from "../../components/commission_card";
import close from "../../assets/images/close.svg";
import delete_icon from "../../assets/images/delete.svg";
import copy_icon from "../../assets/images/copy.svg";
import postbuybillApi from "../../services/preferencesService";
import {ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import SelectSearch from "./select_search";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { getPartnerData } from "../../services/billCreationService";
import single_bill from "../../assets/images/bills/single_bill.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import date_icon from "../../assets/images/date_icon.svg";
import $ from "jquery";
var array = [];
function BillCreation() {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const clientId = loginData.authKeys.clientId;
  const clientSecret = loginData.authKeys.clientSecret;
  let [responseData, setResponseData] = useState([]);
  let [allCropsData, allCropResponseData] = useState([]);
  let [cropData, cropResponseData] = useState(array);
  // let [billSettingResponse, billSettingData] = useState(array);
  const navigate = useNavigate();
  // api to fettch preferred crops data
  const fetchData = () => {
    getPreferredCrops(clickId, clientId, clientSecret)
      .then((response) => {
        setResponseData(response.data.data);
        console.log(response.data.data, "crops preferred");
      })
      .catch((error) => {
        console.log(error);
      });
    getSystemSettings(clickId, clientId, clientSecret).then((res) => {
      // console.log(res.data.data);
    });
  };
  // allcrops displaying in model popup when click on other crop
  const allCropData = () => {
    getAllCrops(clientId, clientSecret).then((response) => {
      allCropResponseData(response.data.data);
    });
  };
  // on load calliing preferred crops function
  useEffect(() => {
    fetchData();
  }, []);

  // add crop in other crop popup model
  const addCropOnclick = (crop_item) => {
    setResponseData([...responseData, crop_item]);
    cropResponseData([...cropData, crop_item]);
  };
  const [selectedOption, setSelectedOption] = useState();
  const [selectedQty, setSelected] = useState(
    selectedOption ? selectedOption : "Crates"
  );
  // select quantity through radio button
  const selectQuantity = (e) => {
    setSelected(e.target.value);
  };
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
  // get quantity from dropdown
  const getQuantity = (id) => (e) => {
    setState({ activeLink: id });
    setSelectedOption(e.target.value);
  };
  // table input onchange event handling
  const getQuantityInputValues = (event, index) => {
    const { name } = event.target;
    const re = /^[0-9\b]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      setState({
        ...state,
        [name]: event.target.value,
      });
    }
  };
  const cloneCrop = (crop) => {
    cropResponseData([...cropData, crop]);
  };
  var lineItemsArray = [];
  var len = cropData.length;
  for (var i = 0; i < len; i++) {
    lineItemsArray.push({
      cropId: cropData[i].cropId,
      qty: 10.0,
      qtyUnit: selectedOption,
      rate: 10.0,
      total: 100.0,
      rateType: "RATE_PER_UNIT",
    });
  }
  // total calculations
  var totalCommValue = (commValue / 100) * 1000;
  // create bill request object
 
  const [selectedPartner, setselectedPartner] = useState();
  const dispath = useDispatch();
  let [partnerData, setpartnerData] = useState([]);
  const fetchPertnerData = () => {
    getPartnerData(clickId, clientId, clientSecret)
      .then((response) => {
        setpartnerData(response.data.data);
        console.log(response.data, "buyer data");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchPertnerData();
  }, []);

  // handle onChange event of the dropdown
  const handleChange = (e) => {
    setselectedPartner(e);
  };  // click on crop to get that crop details
    const cropOnclick = (crop, id) => {
      cropResponseData([...cropData, crop]);
    };
  const [startDate, setStartDate] = useState(new Date());
  const partnerSelectDate=moment(startDate).format("YYYY-MM-DD");
  console.log(selectedPartner)
  const billRequestObj = {
    actualPayble: 0,
    advance: 0,
    billDate: partnerSelectDate,
    billStatus: "Completed",
    caId: clickId,
    cashPaid: 0,
    comm: totalCommValue,
    commIncluded: true,
    commShown: true,
    comments: "hi",
    farmerId: selectedPartner? selectedPartner.partyId : '',
    govtLevies: 0,
    grossTotal: 0,
    labourCharges: 0,
    less: true,
    lineItems: lineItemsArray,
    mandiFee: 0,
    misc: 0,
    outStBal: 0,
    paidTo: 100,
    rent: 0,
    rtComm: returnValue,
    rtCommIncluded: true,
    totalPayble: 0,
    transportation: 0,
    transporterId: 0,
  };
  // post bill request api call
  const postbuybill = () => {
    postbuybillApi(billRequestObj, clientId, clientSecret).then(
      (response) => {
        if (response.data.status.type === "SUCCESS") {
          toast.success(response.data.status.description, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
            console.log("heyyy")
          // toastr.success(response.data.status.description);
        } else if (response.data.status === "FAILURE") {
        } else {
        }
      },
      (error) => {
        // toastr.error(error.response.data.status.description);
      }
    );
  };

  return (
    <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
          <div className="row">
            <div className="col-lg-7 col_left">
            <div className="row row_margin_botton">
                <div className="col-lg-5 column">
                  {partnerData.length > 0 ? (
                  <div>
                      <Select
                    name="partner"
                      options={partnerData}
                      placeholder="Select Farmer"
                      value={selectedPartner}
                      onChange={handleChange}
                      isSearchable={true}
                      getOptionValue={(e) => e.partyId}
                      getOptionLabel={(e) => (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img src={single_bill} className="icon_user" />
                          <span style={{ marginLeft: 5 }}>{e.partyName}</span>
                        </div>
                      )}
                    />
                   
                    </div>
                  )
                :
                <Select  placeholder="Select Farmer" />

                }
                </div>
                <div className="col-lg-3 col_right">
                  <label className="d-flex align-items-baseline date_field" onClick={e => e.preventDefault()}>
                    <span className="date_icon">
                      <img src={date_icon} alt="icon" />
                    </span>
                    <DatePicker
                      dateFormat="yyyy-MM-dd"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      className="form-control"
                      placeholder="Date"
                      maxDate={new Date()}
                    />
                  </label>
                </div>
                <div className="col-lg-4">
                  <SelectSearch />
                </div>
              </div>
              {/* <div className="row margin_bottom">
                <div className="col-lg-12 column">
                  <SelectSearch />
                </div>
                <div></div>
              </div> */}
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
                                        value={state.quantity}
                                        onChange={getQuantityInputValues}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        name="wastage"
                                        value={state.wastage}
                                        // onChange
                                        onChange={getQuantityInputValues}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        name="rate"
                                        value={state.rate}
                                        // onChange
                                        onChange={getQuantityInputValues}
                                      />
                                    </td>
                                    <td>
                                      {index +
                                        (state.quantity - state.wastage) *
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
                              onClick={cloneCrop.bind(this, crop)}
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
                  onChange={(event) =>
                    getCommInput(event.target.value.replace(/\D/g, ""))
                  }
                  inputText={totalCommValue}
                  inputValue={commValue}
                  totalTitle="Total"
                />
                <CommissionCard
                  title="Return Commission"
                  rateTitle="Default Percentage %"
                  onChange={(event) =>
                    getReturnInput(event.target.value.replace(/\D/g, ""))
                  }
                  inputText={returnValue}
                  inputValue={returnValue}
                  totalTitle="Total"
                />
                <CommonCard
                  title="Transportation"
                  rateTitle="Per Bag/Sac/Box/Crate"
                  onChange={(event) =>
                    getReturnInput(event.target.value.replace(/\D/g, ""))
                  }
                  inputText={returnValue}
                  inputValue={returnValue}
                  totalTitle="Total"
                  unitsTitle="Number of Units"
                />
                <CommonCard
                  title="Labor Charges"
                  rateTitle="Per Bag/Sac/Box/Crate"
                  onChange={(event) =>
                    getReturnInput(event.target.value.replace(/\D/g, ""))
                  }
                  inputText={returnValue}
                  inputValue={returnValue}
                  totalTitle="Total"
                  unitsTitle="Number of Units"
                />
                <CommonCard
                  title="Rent"
                  rateTitle="Per Bag/Sac/Box/Crate"
                  onChange={(event) =>
                    getReturnInput(event.target.value.replace(/\D/g, ""))
                  }
                  inputText={returnValue}
                  inputValue={returnValue}
                  totalTitle="Total"
                  unitsTitle="Number of Units"
                />
                <CommissionCard
                  title="Mandi Fee"
                  rateTitle="Default Percentage %"
                  onChange={(event) =>
                    getCommInput(event.target.value.replace(/\D/g, ""))
                  }
                  inputText={commValue}
                  inputValue={returnValue}
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
          <button className="primary_btn" onClick={(e) => postbuybill(e)}>
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
      <ToastContainer />
    </div>
  );
  // }
}
export default BillCreation;
