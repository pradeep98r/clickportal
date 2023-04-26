import { useDispatch, useSelector } from "react-redux";
import { getPartnerType, getText } from "../../components/getText";
import single_bill from "../../assets/images/bills/single_bill.svg";
import { getMaskedMobileNumber } from "../../components/getCurrencyNumber";
import "./step3.scss";
import { qtyValues } from "../../components/qtyValues";
import { multiSelectPartners } from "../../reducers/multiBillSteps";
import CommonCard from "../../components/card";
const Step3 = (props) => {
  const dispatch = useDispatch();
  const selectedStep = useSelector((state) => state.multiStepsInfo);
  const multiSelectPartnersArray = selectedStep?.multiSelectPartners;
  console.log(multiSelectPartnersArray, "array step3");
  const cancelStep = () => {
    dispatch(multiSelectPartners([]));
    props.closeModal();
  };
  return (
    <div>
      <div className="main_div_padding">
        <div className="container-fluid px-0">
          <div className="row">
            <div className="col-lg-8">
              <h5 className="head_modal">Bill Information</h5>
              <div className="bill_step3_scroll" id="scroll_style">
                {multiSelectPartnersArray.map((item, index) => {
                  return (
                    <div className="card step3_card_party">
                      <div className="row party_row">
                        <div className="col-lg-4 partner_card">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                            className=""
                          >
                            {item.profilePic !== "" ? (
                              <img
                                src={item.profilePic}
                                className="icon_user"
                              />
                            ) : (
                              <img src={single_bill} className="icon_user" />
                            )}
                            <div style={{ marginLeft: 5 }}>
                              <div className="-">
                                <h5>
                                  {getText(item.partyName) +
                                    " " +
                                    item.shortName}
                                </h5>
                                <h6>
                                  {getPartnerType(item.partyType, item.trader)}{" "}
                                  - {item.partyId} |{" "}
                                  {getMaskedMobileNumber(item.mobile)}
                                </h6>
                                <p>{item.address?.addressLine}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 partner_card">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                            className=""
                          >
                            <img src={single_bill} className="icon_user" />

                            <div style={{ marginLeft: 5 }}>
                              <div className="-">
                                <h5>
                                  {item.transporterName != ""
                                    ? getText(item.transporterName)
                                    : ""}
                                </h5>
                                <h6>
                                  {getPartnerType("TRANSPORTER")} -{" "}
                                  {item.transporterId} |{" "}
                                  {getMaskedMobileNumber(
                                    item.transporterMobile
                                  )}
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="partner_card">
                            <p>{item.selectedDate}</p>
                          </div>
                        </div>
                      </div>
                      <div className="border_line"></div>
                      <div className="row align-items-center">
                        <div className="col-lg-6">
                          {multiSelectPartnersArray[index].lineItems.length >
                            0 &&
                            multiSelectPartnersArray[index].lineItems.map(
                              (crop, i) => {
                                return (
                                  <div className="">
                                    <div className="crops_info">
                                      <div
                                        className="edit_crop_item_div p-0"
                                        id="scroll_style"
                                      >
                                        <div className="d-flex align-items-center justify-content-between">
                                          <div className="d-flex">
                                            <div>
                                              <img
                                                src={crop.imageUrl}
                                                className="edit_crop_item"
                                              />
                                            </div>
                                            <div>
                                              <p className="crops-color">
                                                {crop.cropName}
                                              </p>
                                              <p className="crops-color">
                                                {qtyValues(
                                                  parseFloat(crop.qty),
                                                  crop.qtyUnit,
                                                  parseFloat(crop.weight),
                                                  crop.wastage,
                                                  crop.rateType
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                        </div>
                        <div className="col-lg-6">
                          <div>
                            <p className="crops-color">Gross Total(₹)</p>
                            <p className="crops-color">
                              0
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="col-lg-4">
              <h5 className="head_modal">Over All Expenses</h5>
              <div className="card step3_card_party">
            
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom_div">
        <div className="d-flex align-items-center justify-content-between">
          <button className="secondary_btn" onClick={cancelStep}>
            cancel
          </button>
          <div className="d-flex align-items-center">
            <button
              className="secondary_btn no_delete_btn"
              //   onClick={() => previousStep()}
            >
              Previous
            </button>
            <button className="primary_btn">Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Step3;
