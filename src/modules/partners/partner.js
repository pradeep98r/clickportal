import { useState, useEffect } from "react";
import "../partners/partner.scss";
import {
  getPartnerData,
  deletePartnerId,
} from "../../actions/billCreationService";
import $ from "jquery";
import single_bill from "../../assets/images/bills/single_bill.svg";
import edit from "../../assets/images/edit_round.svg";
import delete_icon from "../../assets/images/delete.svg";
import close from "../../assets/images/close.svg";
import NoDataAvailable from "../../components/noDataAvailable";
import { Modal, Image } from "react-bootstrap";
import SearchField from "../../components/searchField";
import { getText } from "../../components/getText";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import no_data_icon from "../../assets/images/NodataAvailable.svg";
import NoInternetConnection from "../../components/noInternetConnection";
import loading from "../../assets/images/loading.gif";
import { getMaskedMobileNumber } from "../../components/getCurrencyNumber";
import { getPartnerType } from "../../components/getText";
import PartnerModal from "./partnerModal";
import { useDispatch, useSelector } from "react-redux";
import {
  isEditPartner,
  isFromTrader,
  partnerDataInfo,
  partnersAllData,
  partnerSingleObj,
  partnerType,
} from "../../reducers/partnerSlice";
const Partner = () => {
  const dispatch = useDispatch();
  const partnerDataArray = useSelector((state) => state.partnerInfo);
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const partnerData = partnerDataArray?.partnerDataInfo;
  const allData = partnerDataArray?.partnersAllData;
  const savetype = localStorage.getItem("partyType");
  const partyType = partnerDataArray?.partnerType;
  const [isOnline, setOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShow] = useState(false);
  const [partyIdVal, setPartyIdVal] = useState(0);
  const handleClose = () => setShow(false);
  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);
  console.log(partnerDataArray?.partnerDataInfo);
  const handleDelete = (partyId) => {
    deletePartnerId(partyId, clickId).then(
      (response) => {
        if (response.data.status.type === "SUCCESS") {
          tabEvent(partyType);
          toast.success("Partner Deleted Successfully", {
            toastId: "success1",
          });
        }
      },
      (error) => {
        toast.error(error.response.data.status.description, {
          toastId: "errorr1",
        });
      }
    );
    setShow(false);
  };
  const handleShow = (partyid) => {
    setShow(true);
    setPartyIdVal(partyid);
  };

  useEffect(() => {
    dispatch(partnerType(savetype !== null ? savetype : "FARMER"));
    tabEvent(partyType);
  }, []);

  const tabEvent = (type) => {
    setIsLoading(true);
    dispatch(partnerType(type));
    dispatch(isEditPartner(false));
    dispatch(isFromTrader(false));
    localStorage.setItem("partyType", type);
    setSearchValue("");
    getPartnerData(clickId, type)
      .then((response) => {
        if (response.data.data != null) {
          dispatch(partnersAllData(response.data.data));
          dispatch(partnerDataInfo(response.data.data));
        }
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.toJSON().message === "Network Error") {
          setOnline(true);
        }
      });
  };
  const links = [
    {
      id: 1,
      name: "Seller",
      to: "FARMER",
    },
    {
      id: 2,
      name: langFullData.buyer,
      to: "BUYER",
    },
    {
      id: 3,
      name: langFullData.transporter,
      to: "TRANSPORTER",
    },
    {
      id: 4,
      name: langFullData.labor,
      to: "COOLIE",
    },
  ];
  const [showPartnerModalStatus, setShowPartnerModalStatus] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const editPartner = (partner) => {
    dispatch(isEditPartner(true));
    partnerData.map((item) => {
      if (item.partyId == partner.partyId) {
        setShowPartnerModalStatus(true);
        setShowPartnerModal(true);
        dispatch(partnerSingleObj(partner));
      }
    });
  };

  const MybtnModal = (type, traderval) => {
    dispatch(isFromTrader(traderval));
    dispatch(partnerType(type));
    setShowPartnerModalStatus(true);
    setShowPartnerModal(true);
    dispatch(isEditPartner(false));
  };

  const [searchValue, setSearchValue] = useState("");
  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = allData.filter((data) => {
      if (data.mobile.includes(value)) {
        return data.mobile.search(value) != -1;
      } else if (data.partyName.toLowerCase().includes(value)) {
        return data.partyName.toLowerCase().search(value) != -1;
      } else if (data.partyId.toString().includes(value)) {
        return data.partyId.toString().search(value) != -1;
      } else if (data.shortName.toLowerCase().includes(value)) {
        return data.shortName.toLowerCase().search(value) != -1;
      } else if (data?.address?.addressLine.toLowerCase().includes(value)) {
        return data?.address?.addressLine.toLowerCase().search(value) != -1;
      }
    });

    dispatch(partnerDataInfo(result));

    setSearchValue(value);
  };

  return (
    <div>
      <div className="main_div_padding">
        {isOnline ? (
          <NoInternetConnection />
        ) : (
          <div className="container-fluid px-0">
            <ul className="nav nav-tabs partner_tabs" id="myTab" role="tablist">
              {links.map((link) => {
                return (
                  <li key={link.id} className="nav-item ">
                    <a
                      className={
                        "nav-link" + (partyType == link.to ? " active" : "")
                      }
                      href={"#" + partyType}
                      role="tab"
                      aria-controls="home"
                      data-bs-toggle="tab"
                      onClick={() => tabEvent(link.to)}
                    >
                      {link.name}
                    </a>
                  </li>
                );
              })}
            </ul>
            {isLoading ? (
              <div className="">
                <img src={loading} alt="my-gif" className="gif_img" />
              </div>
            ) : (
              <div className="tab-content">
                <div
                  className="tab-pane active"
                  id={partyType}
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  {allData.length > 0 ? (
                    <div className="row">
                      <div className="col-lg-9 pl-0">
                        <SearchField
                          placeholder="Search by Name / Mobile / Short Code / Party id"
                          val={searchValue}
                          onChange={(event) => {
                            handleSearch(event);
                          }}
                        />
                        {partnerData.length > 0 ? (
                          <div>
                            <div>
                              <div className="partner_div" id="scroll_style">
                                {partnerData.map((partner, index) => (
                                  <div
                                    className="card partner_card"
                                    key={index}
                                  >
                                    <div className="d-flex partner_card_flex justify-content-between align-items-center">
                                      <div className="d-flex align-items-center">
                                        {/* {partner.profilePic} */}
                                        {partner.profilePic ? (
                                          // <Image  source={{uri: partner.profilePic}}/>
                                          <Image
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
                                          <h5>
                                            {partner.partyName +
                                              (partner.partyType ==
                                                "TRANSPORTER" ||
                                              partner.partyType == "COOLIE"
                                                ? ""
                                                : " - ") +
                                              partner.shortName}
                                          </h5>
                                          <h6>
                                            {getPartnerType(
                                              partner.partyType,
                                              partner.trader
                                            )}{" "}
                                            - {partner.partyId} |{" "}
                                            {getMaskedMobileNumber(
                                              partner.mobile
                                            )}
                                          </h6>
                                          <p>{partner.address.addressLine}</p>
                                        </div>
                                      </div>
                                      <div className="d-flex edit_delete_icons">
                                        <img
                                          src={edit}
                                          alt="img"
                                          className=""
                                          onClick={() => editPartner(partner)}
                                        />
                                        <img
                                          src={delete_icon}
                                          alt="img"
                                          onClick={() =>
                                            handleShow(partner.partyId)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="partner_div" id="scroll_style">
                            <NoDataAvailable />
                          </div>
                        )}
                      </div>
                      <div className="col-lg-3">
                        <div className="card default_card add_partner">
                          <div>
                            <h6>
                              {" "}
                              Add{" "}
                              {partyType.toLowerCase() == "farmer"
                                ? "Seller"
                                : getText(partyType)}
                            </h6>
                            <button
                              className="primary_btn partner_btn mr-2"
                              onClick={() => MybtnModal(partyType, false)}
                            >
                              Add
                              {partyType == langFullData.seller
                                ? "seller"
                                : " " + getText(partyType)}
                            </button>
                            {partyType.toLowerCase() == "farmer" ||
                            partyType.toLowerCase() == "buyer" ? (
                              <button
                                className="primary_btn partner_btn"
                                onClick={() => MybtnModal("trader", true)}
                              >
                                Add Trader
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="row partner_no_data_widget_row">
                      <div className="col-lg-5">
                        <div className="partner_no_data_widget">
                          <div className="text-center">
                            <img
                              src={no_data_icon}
                              alt="icon"
                              className="d-flex mx-auto justify-content-center"
                            />
                            <p className="mb-0"></p>
                            <button
                              className="primary_btn mr-2"
                              onClick={() => MybtnModal(partyType)}
                            >
                              Add
                              {partyType == langFullData.seller
                                ? "seller"
                                : " " + getText(partyType)}
                            </button>
                            {partyType.toLowerCase() == "farmer" ||
                            partyType.toLowerCase() == "buyer" ? (
                              <button
                                className="primary_btn"
                                onClick={() => MybtnModal("trader")}
                              >
                                Add Trader
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        show={showModal}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="delete_modal_dialog modal-dialog-centered"
      >
        <Modal.Header>
          <Modal.Title>Delete Partner</Modal.Title>
          <img
            src={close}
            alt="image"
            onClick={handleClose}
            className="close_icon"
          />
        </Modal.Header>
        <Modal.Body className="partner_model_body">
          <p className="px-5 text-center">
            {" "}
            {langFullData.areYouSureYouWantToDeleteThisPartnerPermanently}
          </p>
        </Modal.Body>
        <Modal.Footer className="modal_comm_footer">
          <div className="row">
            <div className="col-lg-12 pl-0">
              <div className="d-flex align-items-center justify-content-center">
                <button
                  type="button"
                  className="no_delete_btn mr-4"
                  onClick={handleClose}
                >
                  {langFullData.no}
                </button>
                <button
                  type="button"
                  className="primary_btn"
                  onClick={() => handleDelete(partyIdVal)}
                >
                  {langFullData.yes}
                </button>
              </div>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
      {showPartnerModalStatus ? (
        <PartnerModal
          showModal={showPartnerModal}
          closeModal={() => setShowPartnerModal(false)}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Partner;
