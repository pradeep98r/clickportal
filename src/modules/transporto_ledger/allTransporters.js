import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  allPartnersInfo,
  singleTransporter,
  transporterIdVal,
} from "../../reducers/transpoSlice";
import no_data_icon from "../../assets/images/NodataAvailable.svg";
import SearchField from "../../components/searchField";
import single_bill from "../../assets/images/bills/single_bill.svg";
import {
  getCurrencyNumberWithSymbol,
  getMaskedMobileNumber,
} from "../../components/getCurrencyNumber";
import ProfileCardWithoutIcon from "../../components/profileCardWithoutIcon";
import { getPartnerData } from "../../actions/billCreationService";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fromTranspoFeature, isEditPartner, isFromTrader, partnerSingleObj, partnerType } from "../../reducers/partnerSlice";
import PartnerModal from "../partners/partnerModal";
const AllTransporters = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const transpoData = useSelector((state) => state.transpoInfo);
  var transporterId = transpoData?.transporterIdVal;
  const dispatch = useDispatch();
  var outStAmt = transpoData?.outstandingAmount;
  var transporter = transpoData?.allPartnersInfo;
  var partnerItem = transpoData?.singleTransporter;
  const location = useLocation();
  console.log(partnerItem, transporter);
  const [allData, setallData] = useState(transpoData?.transpoLedgersInfo);
  useLayoutEffect(() => {
    console.log("use effect");
    getTransportersData();
  }, [location]);
  const getTransportersData = () => {
    getPartnerData(clickId, "TRANSPORTER")
      .then((response) => {
        if (response.data.data != null) {
          setallData(response.data.data);
          dispatch(allPartnersInfo(response.data.data));
          dispatch(transporterIdVal(response.data.data[0].partyId));
          //   dispatch(singleTransporter(response.data.data[0]));
        } else {
          setallData([]);
          dispatch(allPartnersInfo([]));
        }
      })
      .catch((error) => {});
  };
  const particularTransporter = (id, item) => {
    dispatch(transporterIdVal(id));
    dispatch(singleTransporter(item));
  };
  const [showPartnerModalStatus, setShowPartnerModalStatus] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const editPartnerEvent = (type, traderval,item) => {
    dispatch(isEditPartner(true));
    dispatch(isFromTrader(traderval));
    dispatch(partnerType(type));
    setShowPartnerModalStatus(true);
    setShowPartnerModal(true);
    dispatch(partnerSingleObj(item));
    dispatch(fromTranspoFeature(true));
    // localStorage.setItem('partyType', 'TRANSPORTER')
  };
  return (
    <div className="">
      {allData.length > 0 ? (
        <div className="row">
          <div className="col-lg-4 pl-0">
            <div id="search-field">
              <SearchField
                placeholder="Search by Name / Short Code"
                onChange={(event) => {
                  //   handleSearch(event);
                }}
              />
            </div>
            {transporter.length > 0 ? (
              <div>
                <div
                  className="table-scroll ledger-table transporto_ledger_scroll"
                  id="scroll_style"
                >
                  <table className="table table-fixed">
                    <div className="all_trans_head">
                      <p>Transporter Name</p>
                    </div>

                    {transporter.map((partner, index) => {
                      return (
                        <div>
                          <div
                            onClick={() =>
                              particularTransporter(partner.partyId, partner)
                            }
                            className={
                              transporterId == partner.partyId
                                ? "card partner_card tabRowSelected"
                                : "card partner_card tr-tags"
                            }
                            key={index}
                          >
                            <div className="d-flex partner_card_flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                {/* {partner.profilePic} */}
                                {partner.profilePic ? (
                                  // <Image  source={{uri: partner.profilePic}}/>
                                  <img
                                    src={partner.profilePic}
                                    alt="profile_img"
                                    className="user_img"
                                  />
                                ) : (
                                  <img
                                    src={single_bill}
                                    alt="img"
                                    className="user_img"
                                  />
                                )}
                                <div>
                                  <h5>{partner.partyName}</h5>
                                  <h6>
                                    Transporter - {partner.partyId} |{" "}
                                    {getMaskedMobileNumber(partner.mobile)}
                                  </h6>
                                  <p>{partner.partyAddress}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </table>
                </div>
                <div className="outstanding-pay d-flex align-items-center justify-content-between">
                  <p className="pat-tag">Outstanding Paybles:</p>
                  <p className="values-tag">
                    {outStAmt?.totalOutStgAmt
                      ? getCurrencyNumberWithSymbol(outStAmt?.totalOutStgAmt)
                      : 0}
                  </p>
                </div>
              </div>
            ) : (
              <div className="table-scroll nodata_scroll">
                <div className="row partner_no_data_widget_rows">
                  <div className="col-lg-5">
                    <div className="partner_no_data_widget">
                      <div className="text-center">
                        <img
                          src={no_data_icon}
                          alt="icon"
                          className="d-flex mx-auto justify-content-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-8">
            <div className="profile_card business_card">
              <div className="card">
                <div className="card_header">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <h6>Personal Details</h6>
                    </div>
                    <button onClick={()=>editPartnerEvent('Transporter',false,partnerItem)}><p className="edit_text">
                      {/* <img src={edit} alt="edit-img" /> */}
                      <span className="edit_text">EDIT</span>
                    </p></button>
                    
                  </div>
                </div>
                <div className="card_body">
                  <div className="row">
                    <div className="col-lg-6 p-0">
                      <div className="profileCard d-flex">
                        <img
                          src={
                            partnerItem.profilePic
                              ? partnerItem.profilePic
                              : single_bill
                          }
                          alt="image"
                        />
                        <div>
                          <h6>Transporter</h6>
                          <h5>
                            {partnerItem.partyName +
                              "-" +
                              partnerItem.partyId +
                              " | " +
                              getMaskedMobileNumber(partnerItem.mobile)}
                          </h5>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 p-0">
                      <ProfileCardWithoutIcon
                        title="Aadhar Number"
                        subTitle={
                          partnerItem.aadharNum != ""
                            ? partnerItem.aadharNum
                            : "-"
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 p-0">
                      <ProfileCardWithoutIcon
                        title="Opening Balance"
                        subTitle={
                          partnerItem.openingBal != 0
                            ? partnerItem.openingBal
                            : "-"
                        }
                      />
                    </div>
                    <div className="col-lg-6 p-0">
                      <ProfileCardWithoutIcon
                        title="Address"
                        subTitle={
                          partnerItem.address?.addressLine != ""
                            ? partnerItem.address?.addressLine
                            : "-"
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 p-0">
                      <ProfileCardWithoutIcon
                        title="Vehicle Number"
                        subTitle={
                          partnerItem.vehicleInfo?.vehicleNum != ""
                            ? partnerItem.vehicleInfo?.vehicleNum
                            : "-"
                        }
                      />
                    </div>
                    <div className="col-lg-6 p-0">
                      <ProfileCardWithoutIcon
                        title="Vehicle Type"
                        subTitle={
                          partnerItem.vehicleInfo?.vehicleType != ""
                            ? partnerItem.vehicleInfo?.vehicleType
                            : "-"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row partner_no_data_widget_rows">
          <div className="col-lg-5">
            <div className="partner_no_data_widget">
              <div className="text-center">
                <img
                  src={no_data_icon}
                  alt="icon"
                  className="d-flex mx-auto justify-content-center"
                />
              </div>
            </div>
          </div>
        </div>
      )}
        {showPartnerModalStatus ? (
        <PartnerModal
          showModal={showPartnerModal}
          closeModal={() => setShowPartnerModal(false)}
        />
      ) : (
        ""
      )}
      <ToastContainer />
    </div>
  );
};
export default AllTransporters;
