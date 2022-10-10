import { useState, useEffect } from "react";
import { getProfile } from "../../actions/profileService";
import NoDataAvailable from "../../components/noDataAvailable";
import "../my_profile/myProfile.scss";
import icon from "../../assets/images/icon.svg";
import ProfileCard from "../../components/profileCard";
import ProfileCardWithoutIcon from "../../components/profileCardWithoutIcon";
import loading from '../../assets/images/loading.gif';
const MyProfile = () => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    getProfileDetails();
  }, []);
  const getProfileDetails = () => {
    getProfile(clickId)
      .then((response) => {
        setProfileData(response.data.data);
        setLoading(false);
        console.log(response.data.data, "profile");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="main_div_padding">
      <div className="container-fluid px-0">
      {isLoading ? (
                  <div className="">
                      <img src={loading} alt="my-gif" className="gif_img"/>
                  </div>
                ) : (
        <div className="row">
          <div className="col-lg-9 p-0">
          
            <div>
                {profileData !== null ? (
              // isLoading
              <div>
               
                  <div>
                    {profileData.personalDtls != null ? (
                      <div className="profile_card">
                        <div className="card">
                          <div className="card_header">
                            <div className="d-flex align-items-center">
                              <img src={icon} alt="image" />
                              <h6>Personal Details</h6>
                            </div>
                          </div>
                          <div className="card_body">
                            <div className="row">
                              <div className="col-lg-4 p-0">
                                <ProfileCard
                                  title="Owner Name"
                                  subTitle={profileData.personalDtls.ownerName}
                                  imageTag={icon}
                                />
                              </div>
                              <div className="col-lg-4 p-0">
                                <ProfileCard
                                  title="Contact Number"
                                  subTitle={profileData.personalDtls.contactNum}
                                  imageTag={icon}
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
                            <div className="d-flex align-items-center">
                              <img src={icon} alt="image" />
                              <h6>Business Details</h6>
                            </div>
                          </div>
                          <div className="card_body">
                            <div className="row">
                              <div className="col-lg-4 p-0">
                                <ProfileCard
                                  title="Mandi Name"
                                  subTitle={
                                    profileData.businessDtls.businessName
                                  }
                                  imageTag={icon}
                                />
                              </div>
                              <div className="col-lg-6 p-0">
                                <ProfileCard
                                  title="Mandi Address"
                                  subTitle={
                                    profileData.businessDtls.businessAddress
                                      .addressLine +
                                    "," +
                                    profileData.businessDtls.businessAddress
                                      .dist +
                                    "," +
                                    profileData.businessDtls.businessAddress
                                      .state +
                                    "," +
                                    profileData.businessDtls.businessAddress
                                      .pincode
                                  }
                                  imageTag={icon}
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-4 p-0">
                                <ProfileCardWithoutIcon
                                  title="Mandi Type"
                                  subTitle={
                                    profileData.businessDtls.businessType
                                  }
                                />
                              </div>
                              <div className="col-lg-6 p-0">
                                <ProfileCardWithoutIcon
                                  title="Mandi Short Code"
                                  subTitle={profileData.businessDtls.shortCode}
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-4 p-0">
                                <ProfileCard
                                  title="Market Name"
                                  subTitle={profileData.businessDtls.marketName}
                                  imageTag={icon}
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
                                        profileData.businessDtls.contactName
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
                                  subTitle={profileData.businessDtls.mobile}
                                  imageTag={icon}
                                />
                              </div>
                              <div className="col-lg-6 p-0">
                                <ProfileCardWithoutIcon
                                  title="Alternative Mobile"
                                  subTitle={profileData.businessDtls.altMobile}
                                />
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
            ) : (
              <NoDataAvailable />
            )
            }
                </div>
       
          </div>
        </div>
         )}
      </div>
    </div>
  );
};
export default MyProfile;
