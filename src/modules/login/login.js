import React, { Component, useEffect, useState } from "react";
import Navigation from "../../components/navigation";
import Logo from "../../components/logo";
import "../login/login.scss";
import ca_avatar from "../../assets/images/login/ca_image.svg";
import writer_avatar from "../../assets/images/login/writer_avatar.svg";
import { Link } from "react-router-dom";
import { getLanguagesData } from "../../actions/profileService";
const Login = () => {
  const langId = localStorage.getItem("langId");
  const langsData = localStorage.getItem("languageData");
  const [langFullData, setlangFullData] = useState({});
  useEffect(() => {
    if (langsData != null) {
      const data = JSON.parse(langsData);
      setlangFullData(data);
    } else {
      getLanguagesData(langId)
        .then((response) => {
          const langData = response.data.data;
          const res = {};
          langData.forEach(({ key, value }) =>
            Object.assign(res, { [key]: value })
          );
          localStorage.removeItem("languageData");
          localStorage.setItem("languageData", JSON.stringify(res));
          localStorage.setItem("selectedLangId", langId);
          const lData = localStorage.getItem("languageData");
          const data = JSON.parse(lData);
          setlangFullData(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <div>
      <Navigation login_type="login_type_selection" />
      <div className="container login_container">
        <div className="row">
          <div className="col-lg-6 col-xs-12 green_border">
            <div className="ca_writer_card">
              <img
                src={ca_avatar}
                alt="commission_agent"
                className="d-flex mx-auto"
              />
              <p className="para_margin text-center">
                I'm a Mandi Business owner and manage all my partners (farmers,
                traders, buyers, transporters) and transactions.
              </p>
              <Link to="/login_form">
                <button
                  className="primary_btn buttons d-flex mx-auto"
                  onClick={(e) => localStorage.setItem("userType", "CA")}
                >
                  I’M{" "}
                  {langFullData != null
                    ? "COMMISSION AGENT"
                    : ""}
                </button>
              </Link>
              {/* <h5>Don't have an account?</h5>
              <Link to="/login_form">
              <h6>Register Now</h6>
              </Link> */}
            </div>
          </div>
          <div className="col-lg-6 col-xs-12">
            <div className="ca_writer_card">
              <img
                src={writer_avatar}
                alt="writer"
                className="d-flex mx-auto writer"
              />
              <p className="text-center para_margin">
                I work for a CA and help to run day-to-day Mandi Business
                operations and ensure all partners and transactions recorded
                properly.
              </p>
              <Link to="/login_form">
                <button
                  className="primary_btn buttons d-flex mx-auto"
                  onClick={(e) => localStorage.setItem("userType", "WRITER")}
                >
                  I’M WRITER
                </button>
              </Link>
              <h5>Only you can login once your CA added you the system.</h5>
            </div>
          </div>
        </div>
        <Logo />
      </div>
    </div>
  );
};

export default Login;
