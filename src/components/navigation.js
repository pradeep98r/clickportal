import React, { useState,useEffect } from "react";

function Navigation(props) {
  const [navigationHeader, setNavigationHeader] = useState('');
  useEffect(() => {
    if(props.login_type === "login_type_selection"){
      setNavigationHeader("Login as a ")
    }
    else if(props.login_type == "login_form"){
      setNavigationHeader("Account Login")
    }
    else{
      setNavigationHeader("Select your preferred language")
    }
  }, []);

  return (
    <div className="login_nav">
      <div className="">
        <h1>
         {navigationHeader}
        </h1>
      </div>
    </div>
  );
}
export default Navigation;
