import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import close from "../../assets/images/close.svg";
import { ToastContainer, toast } from "react-toastify";
const SelectBags = (props) => {
  const langData = localStorage.getItem("languageData");
  const [invArr, setInvArr] = useState([]);
  const [quantityVal, setQuantityVal] = useState(0);
  // const settingsData = JSON.parse(localStorage.getItem("systemSettingsData"));
  // console.log(settingsData,"Data");
  // const defaultWastage = settingsData?.wasteSetting?settingsData?.wasteSetting:[];
  // const upTo25Kgs = 10;
  // const upTo50Kgs = 20;
  // const upTo100Kgs = 30;
  useEffect(() => {
    if (props.editBagsStatus) {
      setQuantityVal(props.cropsArray[0].qty)
      setInvArr(props.cropsArray[0].bags);
      setQuantityVal(props.cropsArray[0].qty)
    }
  }, [props.show]);
  var arr = [];
  const addInvQuantityValue = (ind, cropitem) => (e) => {
    var obj = {
      id: 0,
      total: 0,
      wastage: 0,
      weight: 0,
      status:props.editBagsStatus?2:1,
      totalWeight:0
    };
    props.cropsArray[0].unitValue = e.target.value;
    var k = props.editBagsStatus
      ? e.target.value - props.cropsArray[0].bags.length
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
    // var totalWeight = e.target.value;
    var invWeight= e.target.value;
    // var invWastage = 0;

    // if(defaultWastage.length > 0){
    //   defaultWastage.map(crop=>{
    //     if(crop.cropId == props.cropsArray[0]?.cropId){
    //       if (invWeight <= 35) {
    //         invWastage = upTo25Kgs;
    //         invWeight = invWeight - invWastage;
    //       } else if (invWeight >= 36 && invWeight <= 60) {
    //         invWastage = upTo50Kgs;
    //       } else if ((invWeight >= 61 && invWeight <= 80)) {
    //         if (upTo100Kgs != 0.0) {
    //           invWastage = upTo100Kgs;
    //         } else {
    //           invWastage = upTo25Kgs +
    //               upTo50Kgs;
    //         }
    //       }
    //       else if ((invWeight >= 81 && invWeight <= 100)) {
    //         if (upTo100Kgs != 0.0) {
    //           invWastage = upTo100Kgs;
    //         } else {
    //           if (upTo50Kgs != 0) {
    //             invWastage = upTo50Kgs * 2;
    //             // finalValue = value - wastage;
    //           } else {
    //             // finalValue = value;
    //           }
    //         }
    //       } else {
    //         // finalValue = value;
    //       }
        
    //       // if(invWeight > kg25 && invWeight < kg50){
    //       //   invWeight = invWeight - kg25;
    //       //   invWastage = kg25
    //       // } else if(invWeight > kg50 && invWeight < kg50){
    //       //   invWeight = invWeight - kg50;
    //       //   invWastage = kg50;
    //       // } else if(invWeight > kg100){
    //       //   invWeight = invWeight - kg100
    //       //   invWastage = kg100;
    //       // };
    //     }
    //   })
    // }
    setinvWeightVal(e.target.value);
    let updatedItem = a.map((item, index) => {
      if (i == index) {
        return { ...a[index], weight: invWeight || 0 };
      } else {
        setInvArr([...a]);
        return { ...a[index] };
      }
    });
    setInvArr([...updatedItem]);
    // let updatedItem = a.map((item, index) => {
    //   if (i == index) {
    //     return { ...a[index], weight: invWeight, wastage: invWastage,
    //       totalWeight:totalWeight
    //    };
    //   } else {
    //     setInvArr([...a]);
    //     return { ...a[index] };
    //   }
    // });
    // console.log(updatedItem,"item")
    // setInvArr([...updatedItem]);
  };
  const [invWastageVal, setinvWastageVal] = useState(0);
  const getInvWastageValue = (a, i) => (e) => {
    setinvWastageVal(e.target.value);
    //setinvWeightVal(invWeightVal - e.target.value);
    // var invWastage =e.target.value;;
    let updatedItem = a.map((item, index) => {
      if (i == index) {
        console.log(a,item)
        // a[index].weight = a[index].weight - e.target.value;
        return { ...a[index], wastage: e.target.value};
      } else {
        setInvArr([...a]);
        return { ...a[index] };
      }
    });
    setInvArr([...updatedItem]);
    // let updatedItem = a.map((item, index) => {
    //   if (i == index) {
    //     // a[index].weight = a[index].weight - e.target.value;
    //     return { ...a[index], wastage: invWastage, weight:a[index].totalWeight - invWastage };
    //   } else {
    //     setInvArr([...a]);
    //     return { ...a[index] };
    //   }
    // });
    // setInvArr([...updatedItem]);
  };
  var totalVal = 0;
  const getInvTotalValue = () => {
    invArr.map((item) => {
      totalVal += parseInt(item.weight || 0);
    });
    return totalVal;
  };
  var wastageSum = 0;
  var totalw = 0;
  const addInvidualWeights = () => {

    if (quantityVal == 0 && props.cropsArray[0].qty == 0) {
      toast.error("Please Enter Number of " + props.cropsArray[0].qtyUnit, {
        toastId: "error1",
      });
      return null;
    }
    for (var l = 0; l < invArr.length; l++) {
      if (invArr[l].weight === 0) {
        toast.error("Please Enter Weight", {
          toastId: "erroe2",
        });
        return null;
      }
      
      if(invArr[l].status == 1 || props.cropsArray[0].status == 1){
        invArr[l].status=1;
      } else if(props.editBagsStatus){
        invArr[l].status=2;
      }
      else{
        invArr[l].status=2;
      }
      wastageSum += parseInt(invArr[l].wastage);
      totalw += parseInt(invArr[l].weight);
    }
    console.log(invArr,props.cropsArray,"arr");
    if (quantityVal !== 0 && totalVal !== 0) {
      props.cropsArray[0].wastage = wastageSum;
      props.cropsArray[0].weight = totalw;
      props.cropsArray[0].qty = quantityVal;
      props.cropsArray[0].checked = false;
      props.parentCallback(props.cropsArray, invArr);
      setInvArr([]);
      setQuantityVal(0);
      props.closeBagsModal();
    }
    props.closeBagsModal();
  };
  var arr1 = [];
  const addInvTab = () => {
    var addObj = {
      id: arr.length,
      total: 0,
      wastage: 0,
      weight: 0,
      status:1,
    };
    arr1.push(addObj);
    if (props.editBagsStatus) {
      setQuantityVal(parseInt(props.cropsArray[0].qty) + 1);
      props.cropsArray[0].qty = parseInt(props.cropsArray[0].qty) + 1;
    } else {
      setQuantityVal(parseInt(quantityVal) + 1);
      props.cropsArray[0].unitValue = parseInt(quantityVal) + 1;
    }

    var arr2 = [...invArr, ...arr1];
    setInvArr(arr2);
  };
  const resetInput = (e) => {
    if (e.target.value == 0) {
      e.target.value = "";
    }
  };
  const clearAddInvBags = (e) => {
    resetInput(e);
    setInvArr([]);
    setQuantityVal(0);
    props.cropsArray[0].checked = false;
  };
  return (
    <Modal
      show={props.show}
      close={props.closeBagsModal}
      className="allCrops_modal"
    >
      <div className="modal-header date_modal_header smartboard_modal_header d-flex align-items-center">
        <div className="crop_div">
          <div className="d-flex align-items-center">
            <img
              src={props.cropsArray[0].imageUrl}
              className="cropImage_icon"
              alt="crop_image"
            />
            <p className="ml-2">
              {props.cropsArray[0].cropName + " " + props.cropsArray[0].qtyUnit}
            </p>
          </div>
        </div>
        <img
          src={close}
          alt="image"
          className="close_icon"
          onClick={(e) => {
            clearAddInvBags(e);
            props.closeBagsModal();
          }}
        />
      </div>
      <div className="modal-body add_inv_weights" id="scroll_style">
        <div className="row">
          <div className="total_bags_tbl bags_table" id="scroll_style">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className="col-3">Total {props.cropsArray[0].qtyUnit}</th>
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
                      value={
                        // props.editBagsStatus
                        //   ? props.cropsArray[0].qty
                           quantityVal
                      }
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
                      onChange={() => getInvTotalValue}
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
                  +Add
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="modal-footer modal_common_footer">
        <div className="row">
          <div className="col-lg-6 pl-0"></div>
          <div className="col-lg-6 p-0">
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="secondary_btn"
                onClick={(e) => {
                  clearAddInvBags(e);
                  props.closeBagsModal();
                }}
              >
                CANCEL
              </button>
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
          </div>
        </div>
      </div>
      <ToastContainer />
    </Modal>
  );
};
export default SelectBags;
