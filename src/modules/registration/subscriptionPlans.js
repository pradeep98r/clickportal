import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  getAllPlans,
  getPromotions,
} from "../../actions/subscriptionPlansService";
import "../registration/subscriptionPlans.scss";
import right_mark from "../../assets/images/right_mark.svg";
import { Fragment } from "react";
import $ from "jquery";
import close from "../../assets/images/close.svg";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SubscriptionPlans = (props) => {
  const [plans, setPlans] = useState([]);
  const [offers, setOffers] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [isActive, setIsActive] = useState(-1);
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const [anualPrice, setAnualPrice] = useState("0");

  const navigate = useNavigate();
  const [statusPlan, setStatusPlan] = useState("FAILURE");
  useEffect(() => {
    getPlans();
    getAllPromotions();
  }, []);

  //Get Plans
  const getPlans = () => {
    getAllPlans()
      .then((response) => {
        console.log(response);
        setPlans(response.data.data);
        setOffers(response.data.data.offerings);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //get Promotions
  const getAllPromotions = () => {
    getPromotions(clickId)
      .then((response) => {
        console.log(response.data.data);
        setPromotions(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleCheckEvent = () => {
    if (isActive == -1) {
      toast.error("Please select any plan ", { toastId: "errorr2" });
    } else {
      $("#termsAndConditions").modal("show");
    }
  };
  const closePopup = () => {
    $("#termsAndConditions").modal("hide");
  };

  const agreeTerms = () => {
    closePopup();
    setStatusPlan("SUCCESS");
    localStorage.setItem("statusPlan", "SUCCESS");
    navigate("/smartboard");
    window.location.reload();
  };
  const handleRadioEvent = (indexes, item) => {
    setIsActive(indexes);
    console.log(indexes, item);
    var index = plans.findIndex((obj) => obj.id == item.id);
    console.log(index);
    if (index != -1) {
      setAnualPrice(plans[index].annPrice);
    }
  };
  const freeTrailEvent = () => {
    console.log(isActive, "active");
    if (isActive == -1) {
      toast.error("Please select any plan ", { toastId: "errorr2" });
    }
    toast.error("Please accept terms and conditions", { toastId: "errorr1" });
  };
  return (
    <div>
      <div className="login_nav">
        <h1>Select Subscription Type</h1>
      </div>
      <div className="row">
        {plans.map((item, index) => {
          return (
            <div className="col-lg-3">
              <div
                id="plan1"
                onClick={(e) => {
                  handleRadioEvent(index, item);
                }}
                className={isActive === index ? "change-background" : ""}
              >
                <div id="header-tag">
                  <div id="radio-tag">
                    <input
                      type="radio"
                      name="radio"
                      id={item.id}
                      value={item.name}
                      className="radio-check"
                      checked={isActive === index}
                    />
                    <label htmlFor="flexRadioDefault1" id="lable-name">
                      {item.name.replace(" ", " - ")}
                    </label>
                  </div>
                </div>
                <div id="an-price">
                  <p id="perMonth">
                    Per Month<p id="value">&#8377;{item.monPrice.toFixed(2)}</p>
                  </p>
                  <div className="vertical"></div>
                  <p id="anaul-price">
                    Annum Price
                    <p id="value" name={item.annPrice}>
                      &#8377;{item.annPrice.toFixed(2)}
                    </p>
                  </p>
                </div>
                <div className="horizontal"></div>
                <div className="markers" id="scroll_style">
                  {item.offerings.map((item, index) => {
                    return (
                      <Fragment>
                        <div>
                          <span id="rightMark">
                            <FontAwesomeIcon icon={faCheck} size="xs" />
                          </span>
                          <span id="features">{item.name}</span>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="row free_trail_row">
        <div className="col-lg-6" id="free-trail">
          <div className="row align-items-center" id="free-trail-tag">
            <div className="col-lg-6">
              {promotions.map((item) => {
                if (item.id === 2) {
                  return (
                    <div>
                      <p id="prm-value">{item.value}</p>
                      <p id="str-tag">
                        <s>
                          Annual Price :{" "}
                          {"₹" + (anualPrice == "0" ? 0 : anualPrice)}
                        </s>
                      </p>
                      <p id="save-tag">You Save ₹0</p>
                      <p id="discount-tag">
                        After Discount :{" "}
                        {"₹" + (anualPrice == "0" ? 0 : anualPrice)}
                      </p>
                    </div>
                  );
                }
              })}
            </div>
            <div className="col-lg-6">
              <div className="d-flex justify-content-end">
                <button id="free-trail-btn" onClick={freeTrailEvent}>
                  Free Trail
                </button>
              </div>
            </div>
          </div>
          <div className="d-flex" id="de-flex">
            <div>
              <input
                type="checkbox"
                id="chebox"
                name="check"
                onChange={handleCheckEvent}
              />
            </div>
            <div>
              <p id="agree">By Continuing, you agree to Ono's</p>
              <p id="agreed">
                <span id="condition">Conditions of Use </span>
                and <span id="policy">Privacy Policy.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="modal fade" id="termsAndConditions">
          <div className="modal-dialog terms_modal_popup">
            <div className="modal-content">
              <div className="modal-header date_modal_header smartboard_modal_header">
                <h5
                  className="modal-title header2_text"
                  id="staticBackdropLabel"
                >
                  Terms And Conditions
                </h5>
                <img
                  src={close}
                  alt="image"
                  className="close_icon"
                  onClick={closePopup}
                />
              </div>
              <div className="modal-body">
                <div className="terms_popup ">
                  <iframe
                    src="https://www.onoark.com/click-terms-of-service"
                    width="100%"
                    height="480"
                  ></iframe>
                </div>
              </div>
              <div className="modal-footer pt-0">
                <button
                  type="button"
                  className="primary_btn"
                  onClick={() => agreeTerms()}
                  data-bs-dismiss="modal"
                >
                  Agree
                </button>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default SubscriptionPlans;
