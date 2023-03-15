
import Navigation from "../../components/navigation";
import "../login/languageSelection.scss";
import GetLanguages from "./getLanguages";
const LanguageSelection = () => {
 
  return (
    <div>
      <Navigation login_type="lagn_sel" />
      <div className="lang_div">
       <GetLanguages />
      </div>
    </div>
  );
};

export default LanguageSelection;
