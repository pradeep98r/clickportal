import { useDispatch, useSelector } from "react-redux";
import { getMaskedMobileNumber } from "../../components/getCurrencyNumber";
import { getPartnerType, getText } from "../../components/getText";
import SelectMultiPartner from "./selectMultiPartner";
import single_bill from "../../assets/images/bills/single_bill.svg";
import delete_icon from "../../assets/images/delete.svg";
import "../multi_buy_bill/step1.scss";
import { multiSelectPartners } from "../../reducers/multiBillSteps";
const Step1 = (props) => {
  const dispatch = useDispatch();
  const selectedStep = useSelector((state) => state.multiStepsInfo);
  const multiSelectPartnersArray = selectedStep?.multiSelectPartners;
  const deleteParty = (item) => {
    const newArr = [...multiSelectPartnersArray];
    const index = newArr.findIndex((x) => x.partyId === item.partyId);
    newArr.splice(index, 1);
    dispatch(multiSelectPartners(newArr));
  };
  const cancelStep = () => {
    dispatch(multiSelectPartners([]));
    props.closeModal();
  };
  return (
    <div>
      <div>
        <div className="main_div_padding">
          <div className="container-fluid px-0">
            <div className="row">
              <div className="col-lg-4 p-0">
                <h5 className="head_modal">
                  Bill To*
                  {multiSelectPartnersArray.length > 0 &&
                    multiSelectPartnersArray.length}{" "}
                </h5>
                <SelectMultiPartner />
              </div>
              <div className="col-lg-4">
                {multiSelectPartnersArray.length > 0 ? (
                  <div>
                    <h5 className="head_modal">Selected</h5>
                    <div
                      className="partner_card selectedPartner_scroll"
                      id="scroll_style"
                    >
                      {multiSelectPartnersArray.map((item) => {
                        return (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                            className="selected_partner_card justify-content-between"
                          >
                            <div className="d-flex">
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
                                    {getPartnerType(
                                      item.partyType,
                                      item.trader
                                    )}{" "}
                                    - {item.partyId} |{" "}
                                    {getMaskedMobileNumber(item.mobile)}
                                  </h6>
                                  <p>{item.address?.addressLine}</p>
                                </div>
                              </div>
                            </div>
                            <img
                              src={delete_icon}
                              onClick={() => deleteParty(item)}
                              alt="image"
                              className="deleteIcon"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          {multiSelectPartnersArray.length > 0 && (
            <div className="bottom_div">
              <div className="d-flex align-items-center justify-content-between">
                <button className="secondary_btn" onClick={cancelStep}>
                  cancel
                </button>
                <button className="primary_btn">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Step1;
