import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { getAllPlans, getPromotions } from '../../actions/subscriptionPlansService';
import "../registration/subscriptionPlans.scss";
import right_mark from "../../assets/images/right_mark.svg";
import { Fragment } from 'react';
import $ from "jquery";
import close from "../../assets/images/close.svg";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

const SubscriptionPlans = (props) => {

    const [plans, setPlans]= useState([]);
    const [offers, setOffers]= useState([]);
    const [promotions, setPromotions]= useState([]);
    const [isActive, setIsActive]= useState(-1);
    const loginData = JSON.parse(localStorage.getItem("loginResponse"));
    const clickId = loginData.clickId;

    const navigate=useNavigate();
    const [statusPlan, setStatusPlan]= useState("FAILURE");
    useEffect(()=>{
        getPlans();
        getAllPromotions();
    },[]);

    //Get Plans
    const getPlans=()=>{
        getAllPlans().then(response=>{
            console.log(response);
            setPlans(response.data.data);
            setOffers(response.data.data.offerings);
        })
        .catch(error=>{
            console.log(error)
        })
    }

    //get Promotions
    const getAllPromotions=()=>{
        getPromotions(clickId).then(response=>{
            //console.log(response);
            setPromotions(response.data.data);
        })
        .catch(error=>{
            console.log(error)
        })
    }
    const handleCheckEvent=()=>{
        console.log("checked")
        $("#termsAndConditions").modal("show");
    }
    const closePopup = () => {
        $("#termsAndConditions").modal("hide");
    };

    const agreeTerms=()=>{
        closePopup();
        setStatusPlan("SUCCESS");
        localStorage.setItem("statusPlan", "SUCCESS");
        navigate('/smartboard');
        window.location.reload();
    }
    const handleRadioEvent=(indexes)=>{
        setIsActive(indexes);
    }       
  return (
    <div>
        <div className='row'>
            <div className="login_nav">
                <h1>Select Subscription Type</h1>
            </div>
            {plans.map((item,index)=>{
            return(
            <div className='col-lg-3'>
                <div id="plan1" onClick={(e)=>{handleRadioEvent(index)}} className={isActive===index ? 'change-background':''}>
                    <div id="header-tag">
                        <div id="radio-tag">
                            <input type="radio" name="radio"  id={item.id} value={item.name} 
                                class="radio-check"
                                checked={isActive===index} />
                            <label htmlFor="flexRadioDefault1" id="lable-name">{item.name.replace(" "," - ")}
                            </label>
                        </div>
                    </div>
                    <div id="an-price"> 
                        <p id="perMonth">Per Month<p id="value">&#8377;{item.monPrice.toFixed(2)}</p></p>
                        <div className= "vertical"></div>
                        <p id="anaul-price">Annum Price<p id="value" name={item.annPrice}>&#8377;{item.annPrice.toFixed(2)}</p></p>
                    </div>
                    <div className= "horizontal"></div>
                    <div className="markers" id="scroll_style">
                        {item.offerings.map((item,index)=>{
                            return(
                                <Fragment>
                                <div>
                                    <span id="rightMark">
                                    <FontAwesomeIcon icon={faCheck} size="xs"/></span>
                                    <span id="features">{item.name}</span>
                                </div>
                                </Fragment>
                            )
                        })}
                    </div>
                </div>
            </div>
            )
            })}
            <div className='col-lg-6' id="free-trail">
                {promotions.map(item=>{
                    if(item.id===2){
                    return(
                        <div id="free-trail-tag">
                            <p id="prm-value">{item.value}</p>
                            <p id="str-tag"><s>Annual Price :</s>
                            <button id="free-trail-btn">{item.category.replace(/[^a-zA-Z ]/g, " ")}</button></p>
                            <p id="save-tag">You Save&nbsp;:&nbsp;0</p>
                            <p id="discount-tag">After Discount :</p>
                        </div>    
                    )
                    }
                })}
                <div className='d-flex' id="de-flex">
                    <div>
                        <input type="checkbox" id="chebox" name="check" onChange={handleCheckEvent}/>
                    </div>
                    <div>
                        <p id="agree">By Continuing, you agree to Ono's</p>
                        <p id="agreed"><span id="condition">Conditions of Use </span> 
                            and <span id="policy">Privacy Policy.</span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="termsAndConditions">
                <div className="modal-dialog modal-dialog-centered date_modal_dialog">
                    <div className="modal-content">
                        <div className="modal-header date_modal_header smartboard_modal_header">
                            <h5 className="modal-title header2_text" id="staticBackdropLabel">
                            Terms And Conditions</h5>
                            <img
                            src={close}
                            alt="image"
                            className="close_icon"
                            onClick={closePopup}
                            />
                        </div>
                        <div className="modal-body date_modal_mody">
                            <div className="terms_popup ">
                                <p>Lorem ipsum, or lipsum as it is sometimes known,
                                 is dummy text used in laying out print, graphic or web designs. The passage
                                is attributed to an unknown typesetter in the 15th century who is
                                thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type
                                specimen book. It usually begins with:</p>

                                <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                ut labore et dolore magna aliqua.”
                                The purpose of lorem ipsum is to create a natural looking block of text
                                (sentence, paragraph, page, etc.) that doesn't distract from the layout.
                                A practice not without controversy, laying out pages with meaningless filler
                                text can be very useful when the focus is meant to be on design, not content.</p>

                                <p>The passage experienced a surge in popularity during the 1960s when Letraset used it
                                on their dry-transfer sheets, and again during the 90s as desktop publishers bundled
                                the text with their software. Today it's seen all around the web; on templates, websites,
                                and stock designs. Use our generator to get your own, or read on for the authoritative
                                history of lorem ipsum.</p>
                            </div>
                        </div>
                        <div className="modal-footer p-0">
                            <button
                                type="button"
                                className="primary_btn"
                                onClick={() =>
                                agreeTerms()}
                                data-bs-dismiss="modal">
                                Agree
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SubscriptionPlans