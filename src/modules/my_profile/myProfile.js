import { useState, useEffect } from "react";
import { getProfile } from "../../actions/profileService";
import NoDataAvailable from "../../components/noDataAvailable";
import "../my_profile/myProfile.scss";
import icon from "../../assets/images/icon.svg";
import single_bill from "../../assets/images/bills/single_bill.svg";
import edit from "../../assets/images/edit.svg";
import globe from "../../assets/images/Vector.png";
import contact from "../../assets/images/contact_img.png";
import market_img from "../../assets/images/markets_img.png";
import ProfileCard from "../../components/profileCard";
import ProfileCardWithoutIcon from "../../components/profileCardWithoutIcon";
import loading from "../../assets/images/loading.gif";
import { langSelection } from "../../actions/loginService";
import { getLanguagesData } from "../../actions/profileService";
import CompleteProfile from "../smartboard/completeprofile";
import { mandiInfoActions } from "../../reducers/mandiProfile";
import { useDispatch } from "react-redux";
const MyProfile = () => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const selectedLangId = localStorage.getItem("selectedLangId");
  const langData = localStorage.getItem("languageData");
  const [langResponse, setLanguage] = useState([]);
  const [languageId, setLanguageId] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [isMandiEdit, setIsMandiEdit] = useState(false);
  const submitStatus = localStorage.getItem("submitStatus") ;
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
    console.log(localStorage.getItem("lId"));
  }, []);
  const getProfileDetails = () => {
    getProfile(clickId)
      .then((response) => {
        setProfileData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // if(submitStatus){
  //   getProfileDetails();
  // }
  const langOnclick = (id) => {
    setLanguageId(id);
  };
  const onEdit = () => {
    setIsEdit(true);
  };
  const onSave = () => {
    getLanguagesData(languageId)
      .then((response) => {
        const langData = response.data.data;
        const res = {};
        langData.forEach(({ key, value }) =>
          Object.assign(res, { [key]: value })
        );
        console.log(res);
        localStorage.removeItem("languageData");
        localStorage.setItem("languageData", JSON.stringify(res));
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
    localStorage.setItem("selectedLangId", languageId);
    setIsEdit(false);
  };

  const langFullData = JSON.parse(langData);
  const businessCreatedStatus =
    localStorage.getItem("businessCreatedStatus") != null
      ? localStorage.getItem("businessCreatedStatus")
      : "noo";
  const [showModal, setShowModal] = useState(false);
  const editMandiData = (mandiDetails)=>{
    setShowModal(true);
    setIsMandiEdit(true);
    localStorage.setItem("mandiEditStatus",true);
    dispatch(mandiInfoActions.mandiSuccess(mandiDetails));
    console.log(mandiDetails)
    localStorage.setItem("mandiEditDetails",JSON.stringify(mandiDetails));
  }
  return (
    <div className="main_div_padding">
      <div className="container-fluid px-0">
        {loginData.businessCreated === false &&
        businessCreatedStatus == "noo" ? (
          <p>Please Complete Profile</p>
        ) : (
          <div>
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
                                      <h6>
                                        Personal deatails
                                        {/* {langFullData.hello} */}
                                      </h6>
                                    </div>
                                  </div>
                                  <div className="card_body">
                                    <div className="row">
                                      <div className="col-lg-4 p-0">
                                        <ProfileCard
                                          title="Owner Name"
                                          subTitle={
                                            profileData.personalDtls.ownerName
                                          }
                                          imageTag={single_bill}
                                        />
                                      </div>
                                      <div className="col-lg-4 p-0">
                                        <ProfileCard
                                          title="Contact Number"
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
                                        <img src={market_img} alt="image" id="market-img"/>
                                        <h6>Business Details</h6>
                                      </div>
                                      <p onClick={() => editMandiData( profileData.businessDtls)} className="edit_text">
                                        <img src={edit} alt="edit-img" />
                                        {/* Edit */}
                                      </p>
                                      {
                                        isMandiEdit ? <CompleteProfile
                                        show={showModal}
                                        close={() => setShowModal(false)}
                                      /> : <div className="d-none"></div>
                                      }
                                    </div>
                                  </div>
                                  <div className="card_body">
                                    <div className="row">
                                      <div className="col-lg-4 p-0">
                                        <ProfileCard
                                          title="Mandi Name"
                                          subTitle={
                                            profileData.businessDtls
                                              .businessName
                                          }
                                          imageTag={single_bill}
                                        />
                                      </div>
                                      <div className="col-lg-6 p-0">
                                        <ProfileCard
                                          title="Mandi Address"
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
                                          title="Mandi Type"
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
                                          title="Market Name"
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
                                              title="Shop Number"
                                              subTitle={
                                                profileData.businessDtls.shopNum
                                              }
                                            />
                                          </div>
                                          <div className="col-lg-6 p-0">
                                            <ProfileCardWithoutIcon
                                              title="Contact Name"
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
                                          title="Mobile number"
                                          subTitle={
                                            profileData.businessDtls.mobile
                                          }
                                          imageTag={contact}
                                        />
                                      </div>
                                      <div className="col-lg-6 p-0">
                                        <ProfileCardWithoutIcon
                                          title="Alternative Mobile"
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
                                        <h6>Select your preferred language</h6>
                                      </div>
                                      <p
                                        onClick={isEdit ? onSave : onEdit}
                                        className="editsave_text"
                                      >
                                        {isEdit ? "Save" : <img src={edit} alt="edit-img" />}
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
                                            key={lang.langId}
                                            onClick={() =>
                                              isEdit
                                                ? langOnclick(lang.langId)
                                                : {}
                                            }
                                          >
                                            <div
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
          </div>
        )}
      </div>
    </div>
  );
};
export default MyProfile;
