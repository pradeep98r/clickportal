import { Component, useState, useEffect } from "react";
import Navigation from "../../components/navigation";
import { langSelection } from "../../actions/loginService";
import "../login/languageSelection.scss";
import { Link, Navigate, useNavigate } from "react-router-dom";

const LanguageSelection = () => {
  const [langResponse, setLanguage] = useState([]);
  const [langString, setLanguageName] = useState("");
 
  useEffect(() => {
    langSelection().then(
      (response) => {
        if (response.data.status.type === "SUCCESS") {
          console.log(response.data.data);
          setLanguage(response.data.data);
        }
      },
      (error) => {}
    );
    console.log("heyyy vv", langResponse.length);
    for (var i = 0; i < langResponse.length; i++) {
      console.log("heyyy");
      if (langResponse[i].langName == "Telugu") {
        setLanguageName("తె");
        console.log("heyyy");
      } 
    //   else if (langResponse[i].langName == "Gujarati") {
    //     setLanguageName("ગુ");
    //   }
      //   switch (langResponse[i].langName) {
      //     case "English":
      //       setLanguageName("En");
      //       break;
      //     case "Gujarati":
      //       setLanguageName("ગુ");
      //       break;
      //     case "Hindi":
      //       setLanguageName("En");
      //       break;
      //     case "Kannada":
      //       setLanguageName("ಕ");
      //       break;
      //     case "Marathi":
      //       setLanguageName("म");
      //       break;
      //     case "Tamil":
      //       setLanguageName("த");
      //       break;
      //     case "Telugu":
      //       setLanguageName("తె");
      //       break;
      //   }
    }
  }, []);
  const navigate = useNavigate();
  const langOnclick = (id) => {
      console.log(id);
      localStorage.setItem("langId",id);
      navigate("/login");
  };
  return (
    <div>
      <Navigation login_type="lagn_sel" />
      <div className="lang_div">
        {langResponse.length > 0 && (
          <div className="d-flex">
            {langResponse.map((lang) => (
              <div
                className="text-center langdiv"
                key={lang.langId}
                onClick={() => langOnclick(lang.langId)}
              >
                <div>
                  <h5>{langString}</h5>
                </div>
                <p>{lang.langName}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelection;

