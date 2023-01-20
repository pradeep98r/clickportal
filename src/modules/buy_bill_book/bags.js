import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import close from "../../assets/images/close.svg";
import { ToastContainer, toast } from "react-toastify";
const SelectBags = (props) => {
  const langData = localStorage.getItem("languageData");
  const [invArr, setInvArr] = useState([]);
  useEffect(() => {
    if (props.editBagsStatus) {
      setInvArr(props.cropsArray[0].bags);
    }
  }, [props.show]);
  var arr = [];
  const [quantityVal, setQuantityVal] = useState(0);

  const addInvQuantityValue = (ind, cropitem) => (e) => {
    var obj = {
      id: 0,
      total: 0,
      wastage: 0,
      weight: 0,
    };
    props.cropsArray[0].unitValue = e.target.value;
    var k = props.editBagsStatus
      ? e.target.value - (props.cropsArray[0].bags.length)
      : e.target.value;
    for (var i = 0; i < k; i++) {
      arr.push(obj);
    }
    setQuantityVal(e.target.value);
    if (props.editBagsStatus) {
      setInvArr([...arr, ...props.cropsArray[0].bags]);
    } else {
      setInvArr(arr);
    }
    return e.target.value;
  };
  const [invWeightVal, setinvWeightVal] = useState(0);
  const getInvWeightValue = (a, i) => (e) => {
    setinvWeightVal(e.target.value);
    let updatedItem = a.map((item, index) => {
      if (i == index) {
        return { ...a[index], weight: e.target.value };
      } else {
        setInvArr([...a]);
        return { ...a[index] };
      }
    });
    setInvArr([...updatedItem]);
  };
  const [invWastageVal, setinvWastageVal] = useState(0);
  const getInvWastageValue = (a, i) => (e) => {
    setinvWastageVal(e.target.value);
    let updatedItem = a.map((item, index) => {
      if (i == index) {
        //a[index].weight = a[index].weight - e.target.value;
        return { ...a[index], wastage: e.target.value };
      } else {
        setInvArr([...a]);
        return { ...a[index] };
      }
    });
    setInvArr([...updatedItem]);
  };
  var totalVal = 0;
  const getInvTotalValue = () => {
    invArr.map((item) => {
      console.log(item.weight,"weight")
      totalVal += parseInt(item.weight);
    });
    console.log(totalVal,"totalValue");
    return totalVal;
  };
  var wastageSum = 0;
  var totalw = 0;
  const addInvidualWeights = () => {
    if(quantityVal == 0 && props.cropsArray[0].qty == 0){
      toast.error("Please ener number of bags",{
        toastId:'error1'
      })
      return null;
    }
    for (var l = 0; l < invArr.length; l++) {
        if(invArr[l].weight === 0){
          toast.error("Please enter weight", {
            toastId: "erroe2",
          })
          return null;
      }
      wastageSum += parseInt(invArr[l].wastage);
      totalw += parseInt(invArr[l].weight);
      
    }
    if(quantityVal !== 0 && totalVal !== 0){
      props.cropsArray[0].wastage = wastageSum;
      props.cropsArray[0].weight = totalw;
      props.cropsArray[0].qty = quantityVal;
      props.cropsArray[0].checked = false
      props.parentCallback(props.cropsArray, invArr);
      setInvArr([]);
      setQuantityVal(0);
      props.closeBagsModal();
    }
    console.log(invArr,"imvArr");
    props.closeBagsModal();
    // if(totalw == 0){
    //   toast.success("Please enter weight", {
    //     toastId: "success1",
    //   });
    // }
    // else{
      
    //}  
  };
  var arr1 = [];
  const addInvTab = () => {
    var addObj = {
      id: arr.length,
      total: 0,
      wastage: 0,
      weight: 0,
    };
    arr1.push(addObj);
    setQuantityVal(parseInt(quantityVal) + 1);
    props.cropsArray[0].unitValue = parseInt(quantityVal) + 1;
    var arr2 = [...invArr, ...arr1];
    setInvArr(arr2);
  };
  const resetInput = (e) => {
    if (e.target.value == 0) {
      e.target.value = "";
    }
  };
  const clearAddInvBags = (e) =>{
    resetInput(e);
    setInvArr([]);
    setQuantityVal(0);
  }
  return (
    <Modal
      show={props.show}
      close={props.closeBagsModal}
      className="modal_popup allCrops_modal"
    >
      <div className="modal-header date_modal_header smartboard_modal_header">
        <h5 className="modal-title header2_text" id="staticBackdropLabel">
          Add Invidual Weights
        </h5>
        <img
          src={close}
          alt="image"
          className="close_icon"
          onClick={(e)=>{clearAddInvBags(e);props.closeBagsModal()}}
        />
      </div>
      <div className="modal-body add_inv_weights" id="scroll_style">
        <div className="row">
          <div className="crop_div">
            <div className="d-flex align-items-center">
              <img src={props.cropsArray[0].imageUrl} alt="crop_image" />
              <p className="ml-2">{props.cropsArray[0].cropName + ' ' +props.cropsArray[0].qtyUnit}</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="total_bags_tbl bags_table" id="scroll_style">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className="col-3">
                    Total {props.cropsArray[0].qtyUnit}
                  </th>
                  <th className="col-3">Total Weight(Kgs)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="col-3">
                    <input
                      type="text"
                      className="form-control mb-0"
                      name="totalbags"
                      value={props.editBagsStatus?props.cropsArray[0].qty:quantityVal}
                      // value={props.cropsArray[0].unitValue}
                      onChange={addInvQuantityValue(0)}
                      onFocus={(e) => resetInput(e)}
                    />
                  </td>
                  <td className="col-3">
                    <input
                      type="text"
                      className="form-control mb-0"
                      name="totalweight"
                      value={getInvTotalValue()}
                      onChange={getInvTotalValue}
                      onFocus={(e) => resetInput(e)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            {invArr.length > 0 && (
              <div>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th className="col-1">S.No</th>
                      <th className="col-3">KGS</th>
                      <th className="col-3">Wastage(Kgs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invArr.map((it, i) => {
                      return (
                        <tr>
                          <td className="col-1">{i + 1}</td>
                          <td className="col-3">
                            <input
                              type="text"
                              className="form-control mb-0"
                              name="weight"
                              value={invArr[i].weight - invArr[i].wastage}
                              onChange={getInvWeightValue(invArr, i)}
                              onFocus={(e) => resetInput(e)}
                            />
                          </td>
                          <td className="col-3">
                            <input
                              type="text"
                              name="wastage"
                              className="form-control wastage_val mb-0"
                              value={invArr[i].wastage}
                              onChange={getInvWastageValue(invArr, i)}
                              onFocus={(e) => resetInput(e)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <button className="add_inv_pls_btn" onClick={addInvTab}>
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="modal-footer pt-0">
        <button
          type="button"
          className="primary_btn"
          onClick={() => {
            addInvidualWeights();
          }}
        >
          UPDATE
        </button>
      </div>
      <ToastContainer />
    </Modal>
  );
};
export default SelectBags;
