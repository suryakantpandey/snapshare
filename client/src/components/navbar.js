import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
const NavBar = () => {
  const Navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  return (
    <nav>
      <div className="nav-wrapper navp">
        <Link to="/" className="brand-logo left h4">
          SnapShare
        </Link>
        <ul id="nav-mobile" className="right">
          <li>
            <Link to="/">
              <i className="large material-icons">home</i>
            </Link>
          </li>
          <li>
            <Link to="/create">
              <i className="large material-icons">add_box</i>
            </Link>
          </li>
          <li>
            <Link to="/allpost">
              <i className="large material-icons">explore</i>
            </Link>
          </li>
          <li>
            <Link to="/profile">
              <i className="large material-icons ">face</i>
            </Link>
          </li>
          <li>
            <a href="/login">
              <i
                className="large material-icons "
                onClick={() => {
                  localStorage.clear();
                  dispatch({ type: "CLEAR" });
                  Navigate("/");
                }}
              >
                exit_to_app
              </i>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
