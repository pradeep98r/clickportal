import { Modal } from "react-bootstrap";
import "../../modules/buy_bill_book/step2.scss";
import other_crop from "../../assets/images/other_crop.svg";
import { useState, useEffect } from "react";
import { getPreferredCrops } from "../../actions/billCreationService";
import SelectCrop from "./selectCrop";
import delete_icon from "../../assets/images/delete.svg";
import copy_icon from "../../assets/images/copy.svg";
var array = [];
const Step2Modal = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const clientId = loginData.authKeys.clientId;
  const clientSecret = loginData.authKeys.clientSecret;
  let [preferedCropsData, setPreferedCropsData] = useState([]);
  let [allCropsData, allCropResponseData] = useState([]);
  let [cropData, cropResponseData] = useState(array);
  const [cropInfoModal, setCropInfoModal] = useState(false);
  const [cropInfoModalStatus, setCropInfoModalStatus] = useState(false);
  const [cropId, setCropId] = useState(0);
  const [cropClear, setCropClear] = useState(false);
  //const[activeCrop, setActiveCrop]= useState(false);
  const cropOnclick = (crop, id, index) => {
    setCropId(id);
    console.log(crop);
    if (crop.cropId === id) {
      crop.count = crop.count + 1;
      crop.cropActive = true;
      console.log(crop.count, "after click");
    }
    cropResponseData([...cropData, crop]);
    console.log(crop.units)
    preferedCropsData[index].units = 'Crates';

  };
  const allCropData = () => {
    setCropInfoModalStatus(true);
    setCropInfoModal(true);
    setCropClear(true);
  };
  const fetchData = () => {
    getPreferredCrops(clickId, clientId, clientSecret)
      .then((response) => {
        response.data.data.map(item => {
          Object.assign(item, { count: 0 }, { cropActive: false });
        })
        setPreferedCropsData(response.data.data);
        console.log(response.data.data, "crops preferred");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  var arr=[]
  const cropDataFunction = (childData, status) => {
    if (status === true) {
      var list = preferedCropsData;
      childData.map((i, ind) => {
        var index = list.findIndex(obj => obj.cropId == i.cropId);
        if (index != -1) {
          var existedItem = list[index];
          existedItem.count += 1;
          list[index] = existedItem;
          console.log(list[index],"if");
          setPreferedCropsData([...list,...arr]);
          Object.assign(list[index],{cropActive:true});
          
        } else {
          console.log(i,"else");
          Object.assign(i, { count: 1 }, { cropActive: true },{cropSelect:"active"});
          arr.push(i);
          setPreferedCropsData([...preferedCropsData, ...arr]);
          console.log(arr,"pushed arr");
          
        }

      })
    }
    else {
      let deSelectedCrop = preferedCropsData.filter(item => item.cropId !== childData.cropId)
      setPreferedCropsData(deSelectedCrop);
    }

  };
  const [selectedOption, setSelectedOption] = useState();
  const [selectedratetype, setSelectedratetype] = useState(
    selectedOption ? selectedOption : "Crates"
  );
  const [state, setState] = useState({
    quantity: "",
    rate: "",
    totalWeight: "",
    wastage: "",
    total: "",
    activeLink: "",
    activeLinkRatettype: "",
  });
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
  const deleteCrop = (crop) => {
    var array = cropData.filter(function (s) {
      return s != crop;
    });
    cropResponseData(array);
  };

  const [selectedOptionNnew, setSelectedOptionNew] = useState('Crates');
  const [selectedOptionNnew1, setSelectedOptionNew1] = useState('Crates');
  const getQuantity = (id, index, cropitem) => (e) => {
    setState({ activeLink: id });
    if (cropitem[index].cropId == id) {
      if (e.target.value == 'kgs') {
        setSelectedOptionNew1('kgs')
      }
      else {
        setSelectedOption(e.target.value);
      }

      cropitem[index].units = e.target.value;
    }
    // setSelectedOption(e.target.value);
    setCropId(id);
    console.log(id, e.target.value);
  };
  const getRatetypeQuantity = (id) => (e) => {
    setState({ activeLink: id });
    setSelectedratetype(e.target.value);
  };
  return (
    <Modal show={props.show} close={props.close} className="cropmodal_poopup">
      <div className="modal-header date_modal_header smartboard_modal_header">
        <h5 className="modal-title header2_text" id="staticBackdropLabel">
          Add Crop Information
        </h5>
        <img alt="image" onClick={props.close} />
      </div>

      <div className="modal-body">
        <h4 className="smartboard_main_header">Select crop and creat bill</h4>
        <div className="d-flex">
          {preferedCropsData.length > 0 && (
            <div className="d-flex total_crops_div">
              {preferedCropsData.map((crop, index) => (
                <div
                  className="text-center crop_div"
                  key={crop.cropId}
                  onClick={() => cropOnclick(crop, crop.cropId, index)}
                >
                  <div style={{
                    display: preferedCropsData[index].cropActive === true ?
                      'block' : 'none'
                  }}>{preferedCropsData[index].count}</div>
                  <img src={crop.imageUrl} className="flex_class mx-auto" />
                  <p>{crop.cropName}</p>
                </div>
              ))}
            </div>
          )}
          <div
            className="text-center crop_div other_Crop"
            onClick={allCropData}
          >
            <img src={other_crop} />
            <p>Other Crop</p>
          </div>
        </div>
        <div className="crop_table" id="scroll_style">
          <div className="row p-0">
            {cropData.length > 0 && (
              <div className="p-0 w-100">
                <h4 className="smartboard_main_header">Crop Information</h4>
                <div className="table_row" id="scroll_style">
                  {cropData.map((crop, index) => (
                    <div
                      className="crop_div crop_table_div table_crop_div"
                      id={cropData[index].cropId}
                      key={index}
                    >
                      {/* table */}
                      <div className="crop_table_view">

                        {selectedOption == "kgs" &&
                          selectedOptionNnew1 == "kgs" ? (
                          <table
                            className="table table-bordered mb-0"
                            key={cropData[index].cropId}
                          >
                            <thead>
                              <tr>
                                <th>Crop</th>
                                <th>Unit Type</th>

                                <th>
                                  Total Weight (
                                  {cropData[index].cropId == state.activeLink
                                    ? selectedOption
                                    : cropData[index].units}
                                  )
                                </th>

                                <th>
                                  Wastage(
                                  {cropData[index].cropId == state.activeLink
                                    ? selectedOption
                                    : cropData[index].units}
                                  )
                                </th>
                                <th>Rate</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="col-2">
                                  <div className="flex_class mr-0">
                                    <img
                                      src={cropData[index].imageUrl}
                                      className="flex_class mr-2"
                                    />
                                    <p className="m-0">
                                      {cropData[index].cropName}
                                    </p>
                                  </div>
                                </td>
                                <td className="col-1">
                                  <select
                                    className="form-control qty_dropdown dropdown"
                                    value={
                                      cropData[index].cropId == state.activeLink
                                        ? selectedOption
                                        : cropData[index].units
                                    }
                                    onChange={getQuantity(
                                      cropData[index].cropId,
                                      index
                                    )}
                                  >
                                    <option value="Crates">Crates</option>
                                    <option value="Bags">Bags</option>
                                    <option value="Sacs">Sacs </option>
                                    <option value="Boxes">Boxes </option>
                                    <option value="kgs">Kgs </option>
                                  </select>
                                </td>

                                {selectedOption == "kgs" ||
                                  cropId == cropData[index].cropId ? (
                                  <td className="col-2">
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="quantity"
                                      value={state.quantity}
                                      onChange={getQuantityInputValues}
                                    />
                                  </td>
                                ) : (
                                  <td className="col-2">
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="quantity"
                                      value={state.quantity}
                                      onChange={getQuantityInputValues}
                                    />
                                  </td>
                                )}

                                <td className="col-2">
                                  <input
                                    type="text"
                                    name="wastage"
                                    value={state.wastage}
                                    // onChange
                                    onChange={getQuantityInputValues}
                                  />
                                </td>
                                <td className="col-2">
                                  <input
                                    type="text"
                                    name="rate"
                                    value={state.rate}
                                    // onChange
                                    onChange={getQuantityInputValues}
                                  />
                                </td>
                                <td className="col-2">
                                  {state.quantity
                                    ? index +
                                    (state.quantity - state.wastage) *
                                    state.rate
                                    : 0}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        ) : cropData[index].cropId == state.activeLink ? (
                          <table
                            className="table table-bordered mb-0"
                            key={cropData[index].cropId}
                          >
                            <thead>
                              <tr>
                                <th>Crop</th>
                                <th>Unit Type</th>

                                <th>Rate Type</th>

                                <th className="">
                                  Number of{" "}
                                  {crop.cropId == state.activeLink
                                    ? selectedOption
                                    : cropData[index].units}
                                </th>
                                <th>
                                  Wastage(
                                  {crop.cropId == state.activeLink
                                    ? selectedOption
                                    : cropData[index].units}
                                  )
                                </th>
                                <th>Rate</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="col-2">
                                  <div className="flex_class mr-0">
                                    <img
                                      src={cropData[index].imageUrl}
                                      className="flex_class mr-2"
                                    />
                                    <p className="m-0">
                                      {cropData[index].cropName}
                                    </p>
                                  </div>
                                </td>
                                <td className="col-1">
                                  <select
                                    className="form-control qty_dropdown dropdown"
                                    value={
                                      cropData[index].cropId == state.activeLink
                                        ? selectedOption
                                        : cropData[index].units
                                    }
                                    onChange={getQuantity(
                                      cropData[index].cropId,
                                      index,
                                      cropData
                                    )}
                                  >
                                    <option value="Crates">Crates</option>
                                    <option value="Bags">Bags</option>
                                    <option value="Sacs">Sacs </option>
                                    <option value="Boxes">Boxes </option>
                                    <option value="kgs">Kgs </option>
                                  </select>
                                </td>

                                <td className="col-1">
                                  <select
                                    className="form-control qty_dropdown dropdown"
                                    value={
                                      cropData[index].cropId ==
                                        state.activeLinkRatettype
                                        ? selectedratetype
                                        : "kgs"
                                    }
                                    onChange={getRatetypeQuantity(
                                      cropData[index].cropId
                                    )}
                                  >
                                    <option value="Crates">
                                      {" "}
                                      {cropData[index].cropId ==
                                        state.activeLink
                                        ? selectedOption
                                        : "Crates"}
                                    </option>
                                    <option value="kgs">kgs</option>
                                  </select>
                                </td>

                                <td className="col-2">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="quantity"
                                    value={state.quantity}
                                    onChange={getQuantityInputValues}
                                  />
                                </td>

                                <td className="col-2">
                                  <input
                                    type="text"
                                    name="wastage"
                                    value={state.wastage}
                                    // onChange
                                    onChange={getQuantityInputValues}
                                  />
                                </td>
                                <td className="col-2">
                                  <input
                                    type="text"
                                    name="rate"
                                    value={state.rate}
                                    // onChange
                                    onChange={getQuantityInputValues}
                                  />
                                </td>
                                <td className="col-2">
                                  {state.quantity
                                    ? index +
                                    (state.quantity - state.wastage) *
                                    state.rate
                                    : 0}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        ) : (
                          <table
                            className="table table-bordered mb-0"
                            key={cropData[index].cropId}
                          >
                            <thead>
                              <tr>
                                <th>Crop</th>
                                <th>Unit Type</th>

                                <th>Rate Type</th>

                                <th className="">
                                  Number of{" "}
                                  {crop.cropId == state.activeLink
                                    ? selectedOption
                                    : cropData[index].units}
                                </th>
                                <th>
                                  Wastage(
                                  {crop.cropId == state.activeLink
                                    ? selectedOption
                                    : cropData[index].units}
                                  )
                                </th>
                                <th>Rate</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="col-2">
                                  <div className="flex_class mr-0">
                                    <img
                                      src={cropData[index].imageUrl}
                                      className="flex_class mr-2"
                                    />
                                    <p className="m-0">
                                      {cropData[index].cropName}
                                    </p>
                                  </div>
                                </td>
                                <td className="col-1">
                                  <select
                                    className="form-control qty_dropdown dropdown"
                                    value={
                                      cropData[index].cropId == state.activeLink
                                        ? selectedOption
                                        : cropData[index].units
                                    }
                                    onChange={getQuantity(
                                      cropData[index].cropId,
                                      index,
                                      cropData
                                    )}
                                  >
                                    <option value="Crates">Crates</option>
                                    <option value="Bags">Bags</option>
                                    <option value="Sacs">Sacs </option>
                                    <option value="Boxes">Boxes </option>
                                    <option value="kgs">Kgs </option>
                                  </select>
                                </td>

                                <td className="col-1">
                                  <select
                                    className="form-control qty_dropdown dropdown"
                                    value={
                                      cropData[index].cropId ==
                                        state.activeLinkRatettype
                                        ? selectedratetype
                                        : "kgs"
                                    }
                                    onChange={getRatetypeQuantity(
                                      cropData[index].cropId
                                    )}
                                  >
                                    <option value="Crates">
                                      {" "}
                                      {cropData[index].cropId ==
                                        state.activeLink
                                        ? selectedOption
                                        : "Crates"}
                                    </option>
                                    <option value="kgs">kgs</option>
                                  </select>
                                </td>

                                <td className="col-2">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="quantity"
                                    value={state.quantity}
                                    onChange={getQuantityInputValues}
                                  />
                                </td>

                                <td className="col-2">
                                  <input
                                    type="text"
                                    name="wastage"
                                    value={state.wastage}
                                    // onChange
                                    onChange={getQuantityInputValues}
                                  />
                                </td>
                                <td className="col-2">
                                  <input
                                    type="text"
                                    name="rate"
                                    value={state.rate}
                                    // onChange
                                    onChange={getQuantityInputValues}
                                  />
                                </td>
                                <td className="col-2">
                                  {state.quantity
                                    ? index +
                                    (state.quantity - state.wastage) *
                                    state.rate
                                    : 0}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {cropInfoModalStatus ? (
        <SelectCrop
          show={cropInfoModal}
          close={() => setCropInfoModal(false)}
          cropCallback={cropDataFunction}
        />
      ) : (
        ""
      )}
    </Modal>
  );
};
export default Step2Modal;
