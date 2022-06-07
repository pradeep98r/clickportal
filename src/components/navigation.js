import React from "react";

function Navigation(props) {
  return (
    <div className="login_nav">
      <div className="">
        <h1>
          {props.login_type === "login_type_selection"
            ? "Login as a "
            : "Account Login"}{" "}
        </h1>
      </div>
    </div>
  );
}
export default Navigation;
