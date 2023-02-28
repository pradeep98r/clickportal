import { useState, useEffect } from "react";
import { getProfile } from "../../actions/profileService";
import NoDataAvailable from "../../components/noDataAvailable";
import "../my_profile/myProfile.scss";
import icon from "../../assets/images/icon.svg";
import single_bill from "../../assets/images/bills/single_bill.svg";
import edit from "../../assets/images/edit.svg";
import globe from "../../assets/images/world.svg";
import contact from "../../assets/images/contact.svg";
import market_img from "../../assets/images/mandi.svg";
import mandiImage from "../../assets/images/mandi_icon.svg";
import ProfileCard from "../../components/profileCard";
import ProfileCardWithoutIcon from "../../components/profileCardWithoutIcon";
import loading from "../../assets/images/loading.gif";
import { langSelection } from "../../actions/loginService";
import { getLanguagesData } from "../../actions/profileService";
import CompleteProfile from "../smartboard/completeprofile";
import { mandiInfoActions } from "../../reducers/mandiProfile";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from 'jquery';
import NoInternetConnection from "../../components/noInternetConnection";
const MyProfile = () => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isOnline, setOnline] = useState(false);
  const selectedLangId = localStorage.getItem("selectedLangId");
  const langData = localStorage.getItem("languageData");
  const [langResponse, setLanguage] = useState([]);
  const [languageId, setLanguageId] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [isMandiEdit, setIsMandiEdit] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    getProfileDetails();
    langSelection().then(
      (response) => {
        if (response.data.status.type === "SUCCESS") {
          setLanguage(response.data.data);
        }
      },
      (error) => {}
    );
  }, []);
  const getProfileDetails = () => {
    getProfile(clickId)
      .then((response) => {
        setProfileData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.toJSON().message === "Network Error") {
          setOnline(true);
        }
        console.log(error);
      });
  };
  const langOnclick = (id) => {
    setLanguageId(id);
  };
  const onEdit = () => {
    setIsEdit(true);
    $('#land_div').mouseenter(function(){
     console.log("hover")
      $('#lang_id').addClass('active');
  })
  };

  const onSave = () => {
    console.log(languageId, "id");
    var langid = languageId;
    if (langid == 0) {
      langid = parseInt(selectedLangId);
      console.log(langid, selectedLangId, "if");
      setLanguageId(langid);
    }
    console.log(langid, "iffff");
    getLanguagesData(langid)
      .then((response) => {
        const langData = response.data.data;
        console.log(response);
        const res = {};
        langData.forEach(({ key, value }) =>
          Object.assign(res, { [key]: value })
        );
        console.log(langid, selectedLangId);
        if (langid !== parseInt(selectedLangId)) {
          toast.success("Language Changed Successfully", {
            toastId: "success",
          });
          localStorage.removeItem("languageData");
          localStorage.setItem("languageData", JSON.stringify(res));
          window.setTimeout(function () {
            window.location.reload();
          }, 1500);
        }
        //window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
    localStorage.setItem("selectedLangId", langid);
    setIsEdit(false);
  };

  const langFullData = JSON.parse(langData);
  const businessCreatedStatus =
    localStorage.getItem("businessCreatedStatus") != null
      ? localStorage.getItem("businessCreatedStatus")
      : loginData.useStatus == 'WRITER' ? "writer": 'ca';;
  const [showModal, setShowModal] = useState(false);
  const editMandiData = (mandiDetails) => {
    setShowModal(true);
    setIsMandiEdit(true);
    localStorage.setItem("mandiEditStatus", true);
    dispatch(mandiInfoActions.mandiSuccess(mandiDetails));
    localStorage.setItem("mandiEditDetails", JSON.stringify(mandiDetails));
  };
  const [showModalStatus, setShowModalStatus] = useState(false);
  const onClickProfiles = () => {
    setShowModal(true);
    setShowModalStatus(true);
    localStorage.removeItem("mandiEditStatus");
    localStorage.setItem("mandiEditStatus", false);
  };
  return (
    <div className="main_div_padding">
      <div className="container-fluid px-0">
        {(loginData.businessCreated === false ? (loginData.useStatus == "WRITER") : true) && businessCreatedStatus == "" ? (
          <div className="row">
            <div className="col-lg-9 smartboard_div p-0">
              <div className="complete_profile d-flex justify-content-between align-items-center">
                <p>Complete your Mandi Setup</p>
                <button onClick={onClickProfiles}>Complete Now</button>
                {showModalStatus ? (
                  <CompleteProfile
                    show={showModal}
                    close={() => setShowModal(false)}
                  />
                ) : (
                  ""
                )}
              </div>
              <NoDataAvailable />
            </div>
            <div className="col-lg-3"></div>
          </div>
        ) : (
          <div>
            {isOnline?<NoInternetConnection />:
            <div className="myprofile_screen" id="scroll_style">
              {isLoading ? (
                <div className="">
                  <img src={loading} alt="my-gif" className="gif_img" />
                </div>
              ) : (
                <div className="row">
                  <div className="col-lg-9 p-0">
                    <div>
                      {profileData !== null ? (
                        <div>
                          <div>
                            {profileData.personalDtls != null ? (
                              <div className="profile_card">
                                <div className="card">
                                  <div className="card_header">
                                    <div className="d-flex align-items-center">
                                      <img src={icon} alt="image" />
                                      <h6>{langFullData.personalDetails}</h6>
                                    </div>
                                  </div>
                                  <div className="card_body">
                                    <div className="row">
                                      <div className="col-lg-4 p-0">
                                        <ProfileCard
                                          title={langFullData.ownerName}
                                          subTitle={
                                            profileData.personalDtls.ownerName
                                          }
                                          imageTag={single_bill}
                                        />
                                      </div>
                                      <div className="col-lg-4 p-0">
                                        <ProfileCard
                                          title={langFullData.contactNumber}
                                          subTitle={
                                            profileData.personalDtls.contactNum
                                          }
                                          imageTag={contact}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <NoDataAvailable />
                            )}
                            {profileData.businessDtls != null ? (
                              <div className="profile_card business_card">
                                <div className="card">
                                  <div className="card_header">
                                    <div className="d-flex align-items-center justify-content-between">
                                      <div className="d-flex align-items-center">
                                        <img
                                          src={mandiImage}
                                          alt="image"
                                          id="market-img"
                                        />
                                        <h6>{langFullData.businessDetails}</h6>
                                      </div>
                                      <p
                                        onClick={() =>
                                          editMandiData(
                                            profileData.businessDtls
                                          )
                                        }
                                        className="edit_text"
                                      >
                                        <img src={edit} alt="edit-img" />
                                        <span className="edit_text">EDIT</span>
                                        {/* Edit */}
                                      </p>
                                      {isMandiEdit ? (
                                        <CompleteProfile
                                          show={showModal}
                                          close={() => setShowModal(false)}
                                        />
                                      ) : (
                                        <div className="d-none"></div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="card_body">
                                    <div className="row">
                                      <div className="col-lg-4 p-0">
                                        <ProfileCard
                                          title={langFullData.businessName}
                                          subTitle={
                                            profileData.businessDtls
                                              .businessName
                                          }
                                          imageTag={single_bill}
                                        />
                                      </div>
                                      <div className="col-lg-6 p-0">
                                        <ProfileCard
                                          title={langFullData.businessAddress}
                                          subTitle={
                                            profileData.businessDtls
                                              .businessAddress.addressLine +
                                            "," +
                                            profileData.businessDtls
                                              .businessAddress.dist +
                                            "," +
                                            profileData.businessDtls
                                              .businessAddress.state +
                                            "," +
                                            profileData.businessDtls
                                              .businessAddress.pincode
                                          }
                                          imageTag={market_img}
                                        />
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-lg-4 p-0">
                                        <ProfileCardWithoutIcon
                                          title={langFullData.businessType}
                                          subTitle={
                                            profileData.businessDtls
                                              .businessType
                                          }
                                        />
                                      </div>
                                      <div className="col-lg-6 p-0">
                                        <ProfileCardWithoutIcon
                                          title="Mandi Short Code"
                                          subTitle={
                                            profileData.businessDtls.shortCode
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-lg-4 p-0">
                                        <ProfileCard
                                          title={langFullData.marketName}
                                          subTitle={
                                            profileData.businessDtls.marketName
                                          }
                                          imageTag={market_img}
                                        />
                                      </div>
                                      <div className="col-lg-6 p-0">
                                        <div className="row mb-0">
                                          <div className="col-lg-6 p-0">
                                            <ProfileCardWithoutIcon
                                              title={langFullData.shopNumber}
                                              subTitle={
                                                profileData.businessDtls.shopNum
                                              }
                                            />
                                          </div>
                                          <div className="col-lg-6 p-0">
                                            <ProfileCardWithoutIcon
                                              title={langFullData.contactName}
                                              subTitle={
                                                profileData.businessDtls
                                                  .contactName
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-lg-4 p-0">
                                        <ProfileCard
                                          title={langFullData.mobileNumber}
                                          subTitle={
                                            profileData.businessDtls.mobile
                                          }
                                          imageTag={contact}
                                        />
                                      </div>
                                      <div className="col-lg-6 p-0">
                                        <ProfileCardWithoutIcon
                                          title={langFullData.alternativeMobile}
                                          subTitle={
                                            profileData.businessDtls.altMobile
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <NoDataAvailable />
                            )}
                            <div>
                              <div className="profile_card">
                                <div className="card">
                                  <div className="card_header">
                                    <div className="d-flex align-items-center justify-content-between">
                                      <div className="d-flex align-items-center">
                                        <img src={globe} alt="image" />
                                        <h6>
                                          {
                                            langFullData.selectYourPreferredLanguage
                                          }
                                        </h6>
                                      </div>
                                      <p
                                        onClick={isEdit ? onSave : onEdit}
                                        className="editsave_text"
                                      >
                                        {isEdit ? (
                                          "Save"
                                        ) : (
                                          <div className="d-flex align-items-center">
                                            <img src={edit} alt="edit-img" />
                                          <span className="edit_text">EDIT</span>
                                          </div>
                                        )}
                                      </p>
                                      {/* <p onClick={onSave}>save</p> */}
                                    </div>
                                  </div>
                                  <div className="card_body">
                                    {langResponse.length > 0 && (
                                      <div className="d-flex">
                                        {langResponse.map((lang) => (
                                          <div
                                            className="text-center langdiv"
                                            id="land_div"
                                            key={lang.langId}
                                            onClick={() =>
                                              isEdit
                                                ? langOnclick(lang.langId)
                                                : {}
                                            }
                                          >
                                            <div
                                             id="lang_id"
                                              className={
                                                "lang_id " +
                                                languageId +
                                                lang.langId +
                                                selectedLangId +
                                                (lang.langId ==
                                                (languageId != 0
                                                  ? languageId
                                                  : selectedLangId)
                                                  ? " active_item"
                                                  : "")
                                              }
                                            >
                                              {(() => {
                                                if (lang.langName == "Telugu") {
                                                  return <h5>{"తె"}</h5>;
                                                } else if (
                                                  lang.langName == "English"
                                                ) {
                                                  return <h5>{"En"}</h5>;
                                                } else if (
                                                  lang.langName == "Gujarati"
                                                ) {
                                                  return <h5>{"ગુ"}</h5>;
                                                } else if (
                                                  lang.langName == "Hindi"
                                                ) {
                                                  return <h5>{"हि"}</h5>;
                                                } else if (
                                                  lang.langName == "Kannada"
                                                ) {
                                                  return <h5>{"ಕ"}</h5>;
                                                } else if (
                                                  lang.langName == "Tamil"
                                                ) {
                                                  return <h5>{"த"}</h5>;
                                                } else if (
                                                  lang.langName == "Marathi"
                                                ) {
                                                  return <h5>{"म"}</h5>;
                                                }
                                              })()}
                                            </div>
                                            <div>
                                              {(() => {
                                                if (lang.langName == "Telugu") {
                                                  return <p>{"తెలుగు"}</p>;
                                                } else if (
                                                  lang.langName == "English"
                                                ) {
                                                  return <p>{"English"}</p>;
                                                } else if (
                                                  lang.langName == "Gujarati"
                                                ) {
                                                  return <p>{"ગુજરાતી"}</p>;
                                                } else if (
                                                  lang.langName == "Hindi"
                                                ) {
                                                  return <p>{"हिन्दी"}</p>;
                                                } else if (
                                                  lang.langName == "Kannada"
                                                ) {
                                                  return <p>{"ಕನ್ನಡ"}</p>;
                                                } else if (
                                                  lang.langName == "Tamil"
                                                ) {
                                                  return <p>{"தமிழ்"}</p>;
                                                } else if (
                                                  lang.langName == "Marathi"
                                                ) {
                                                  return <p>{"मराठी"}</p>;
                                                }
                                              })()}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <NoDataAvailable />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            }
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};
export default MyProfile;
