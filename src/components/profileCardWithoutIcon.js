import React from "react";
const ProfileCardWithoutIcon = ({ title, subTitle, imageTag }) => (
    <div className="profileCard d-flex">
      <div className="proofilecard_icon">
      <h6>{title}</h6>
      <h5>{subTitle}</h5>
      </div>
    </div>
  );
  export default ProfileCardWithoutIcon;