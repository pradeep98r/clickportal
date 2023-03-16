
import Navigation from "../../components/navigation";
import "../login/languageSelection.scss";
import GetLanguages from "./getLanguages";
import desktop_img from "../../assets/images/desktop.png";
const LanguageSelection = () => {
 
  return (
    <div>
      <div className="login_page">
      <Navigation login_type="lagn_sel" />
      <div className="lang_div">
       <GetLanguages />
      </div>
     
    </div>
     <div className="d-block d-sm-block d-md-none mobile_meassage">
     <div className="mobile_meassage_div">
       <img src={desktop_img} className="d-flex mx-auto" alt="image" />
       Please use it on desktop / Download app from playstore
       <a href="https://play.google.com/store/apps/details?id=com.ono.click"><button className="primary_btn mt-3">Download Now</button></a>
     </div>
   </div>
    </div>
  );
};

export default LanguageSelection;
