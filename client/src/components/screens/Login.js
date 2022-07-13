import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";
const Login = () => {
  const { state, dispatch } = useContext(UserContext);
  var validator = require("email-validator");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const PostData = () => {
    if (!validator.validate(email)) {
      M.toast({
        html: "Invalid email",
        classes: "#e53935 red darken-1",
      });
      return;
    }
    const passwordRegexp = require("password-regexp")();
    if (!passwordRegexp.test(password)) {
      const len = password.length;
      var r = /\d+/;
      var containsNumber = !(password.match(r) != null);
      if (len < 8) {
        M.toast({
          html: "Password length should be more than 7",
          classes: "#e53935 red darken-1",
        });
      } else if (containsNumber > 0) {
        M.toast({
          html: "Use atleast 1 number  ",
          classes: "#e53935 red darken-1",
        });
      } else {
        M.toast({
          html: "Use Atleast 1 Uppercase letter",
          classes: "#e53935 red darken-1",
        });
      }
      return;
    }
    fetch("/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#e53935 red darken-1" });
          return;
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="card1">
      <div className="card auth-card input-field">
        <h2 className="brand-logo login-title">SnapShare</h2>
        <div className="login-box">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="login-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button
          className="btn  darken-1 login-btn"
          type="Action"
          onClick={() => {
            PostData();
          }}
        >
          Log In
        </button>
      </div>
      <div className="card  auth-card">
        <span>Don't have an account? </span>
        <Link to="/signup" className="blue-text">
          Sign Up
        </Link>
      </div>
    </div>
  );
};
export default Login;
