import { Component, useState, useEffect } from "react";
import { langSelection } from "../../actions/loginService";
import "../login/languageSelection.scss";
import { useNavigate } from "react-router-dom";
import { getLanguagesData } from "../../actions/profileService";
const GetLanguages = () => {
  const [langResponse, setLanguage] = useState([]);
  const [languageId, setLanguageId] = useState(0);
  useEffect(() => {
    langSelection().then(
      (response) => {
        if (response.data.status.type === "SUCCESS") {
          setLanguage(response.data.data);
        }
      },
      (error) => {}
    );
    
  }, []);
  const navigate = useNavigate();
  const langOnclick = (id) => {
    console.log(id);
    setLanguageId(id);
    localStorage.setItem("langId", 2);
    localStorage.setItem("selectedLangId", id);
    getLanguagesData(id)
      .then((response) => {
        const langData = response.data.data;
        const res = {};
        langData.forEach(({ key, value }) =>
          Object.assign(res, { [key]: value })
        );
        localStorage.setItem("languageData", JSON.stringify(res));
            navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
 ;
  return (
    <div>
      {langResponse.length > 0 && (
        <div className="d-flex">
          {langResponse.map((lang) => (
            <div
              className="text-center langdiv"
              key={lang.langId}
              onClick={() => langOnclick(lang.langId)}
            >
              <div
                className={
                  "lang_id " + 
                  (lang.langId === (languageId != 0 ? languageId : languageId)
                    ? " active_item"
                    : "")
                }
              >
                {(() => {
                  if (lang.langName == "Telugu") {
                    return <h5>{"తె"}</h5>;
                  } else if (lang.langName == "English") {
                    return <h5>{"En"}</h5>;
                  } else if (lang.langName == "Gujarati") {
                    return <h5>{"ગુ"}</h5>;
                  } else if (lang.langName == "Hindi") {
                    return <h5>{"हि"}</h5>;
                  } else if (lang.langName == "Kannada") {
                    return <h5>{"ಕ"}</h5>;
                  } else if (lang.langName == "Tamil") {
                    return <h5>{"த"}</h5>;
                  } else if (lang.langName == "Marathi") {
                    return <h5>{"म"}</h5>;
                  }
                })()}
              </div>
              <div>
                {(() => {
                  if (lang.langName == "Telugu") {
                    return <p>{"తెలుగు"}</p>;
                  } else if (lang.langName == "English") {
                    return <p>{"English"}</p>;
                  } else if (lang.langName == "Gujarati") {
                    return <p>{"ગુજરાતી"}</p>;
                  } else if (lang.langName == "Hindi") {
                    return <p>{"हिन्दी"}</p>;
                  } else if (lang.langName == "Kannada") {
                    return <p>{"ಕನ್ನಡ"}</p>;
                  } else if (lang.langName == "Tamil") {
                    return <p>{"தமிழ்"}</p>;
                  } else if (lang.langName == "Marathi") {
                    return <p>{"मराठी"}</p>;
                  }
                })()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetLanguages;