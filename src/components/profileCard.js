import React from "react";

const ProfileCard = ({ title, subTitle, imageTag }) => (
  
  <div className="profileCard d-flex">
      <img src={imageTag} alt="image"/>
    <div>
    <h6>{title}</h6>
    <h5>{subTitle}</h5>
    </div>
  </div>
);

export default ProfileCard;
