import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";

// TODO:
//   1) check username availability
//   2) Hide password option
//   3) Login with facebook

const Signup = () => {
  var validator = require("email-validator");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState(" ");
  // const [pic, setpic] = useState("");
  // pic = "";
  const Picdata = () => {
    const data = new FormData();
    const image =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    data.append("file", image);
    data.append("upload_preset", "Insta-clone");
    data.append("cloud_name", "insta-clone303");
    fetch("https://api.cloudinary.com/v1_1/insta-clone303/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.url);
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const PostData = () => {
    Picdata();
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
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        pis: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#e53935 red darken-1" });
          return;
        } else {
          M.toast({ html: data.message, classes: "#43a047 green darken-1" });
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="card1">
      <div className="card auth-card input-field">
        <h2 className="brand-logo login-title">Instagram</h2>
        <h6 className="signup-sub">
          Sign up to see photos and videos from your friends.
        </h6>
        <div className="login-box">
          <input
            type="text"
            placeholder="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="login-box">
          <input
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
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
          className="btn blue darken-1 login-btn"
          onClick={() => PostData()}
        >
          Sign Up
        </button>
        <div className="signup-sub1">
          By signing up, you agree to our <b>Terms, Data Policy</b> and{" "}
          <b>Cookie Policy</b>.
        </div>
      </div>
      <div className="card  auth-card">
        <span> Have an account? </span>
        <Link to="/login" className=" bold blue-text text-darken-1">
          Log In
        </Link>
      </div>
    </div>
  );
};
export default Signup;
