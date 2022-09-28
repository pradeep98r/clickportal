import bell from "../../assets/images/navbar/Bell.svg";
import help from "../../assets/images/navbar/Help.svg";
import "./TopNavigation.scss";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../reducers/authSlice";
import { Link, Navigate, useNavigate } from "react-router-dom";
function TopNavigation(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("gg");
  const routeId = localStorage.getItem("LinkId");
  console.log(routeId);
  const loginUserDetails = useSelector((state) => state.userInfo.isUserDetails);
  const logOutFunction = () => {
    dispatch(authActions.logout(true));
    navigate("/login_form");
  };
  return (
    <nav className="navbar navbar-expand-lg bg_white main_nav">
      <div className="container-fluid">
        <div className="page_header">
          <h2>{props.heading}</h2>
          <p>Your performance summary this week</p>
        </div>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav flex_class">
            <li className="nav-item">
              <div className="nav-link active" aria-current="page" href="#">
                <form className="d-flex" role="search">
                  <input
                    className="form-control search"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                </form>
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link">
                <input
                  className="form-control date me-2"
                  type="date"
                  placeholder=""
                  aria-label="date"
                />
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <img src={help} alt="icon" />
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link bell_icon" href="#">
                <img src={bell} alt="icon" />
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {loginUserDetails.profile.profile.fullName}
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                  <p>Click Id:{loginUserDetails.profile.profile.clickId}</p>
                  </li>
                  <li>
                  <p>{loginUserDetails.profile.profile.mobile}</p>
                  </li>
                <li className="pb-0">
                  <a className="dropdown-item p-0" href="#">
                    <button onClick={logOutFunction} className="primary_btn ">logout</button>
                  </a>
                </li>
               
                
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default TopNavigation;
