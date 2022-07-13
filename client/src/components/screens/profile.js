import React, { useEffect, useState, useContext } from "react";
import NavBar from "../navbar";
import { UserContext } from "../../App";

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  useEffect(() => {
    fetch("/myposts", {
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setPics(result.mypost);
      });
  }, []);
  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "cnq");
      fetch("https://api.cloudinary.com/v1_1/insta-clone303/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
              //window.location.reload()
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);
  const updatePhoto = (file) => {
    setImage(file);
  };
  return (
    <div>
      <NavBar />
      <div className="profile-page">
        <div className="profile-box">
          <div>
            <img
              className="profile-pic circle"
              src={state ? state.pic : "loading"}
            />
          </div>
          <div>
            {/* {console.log(state)} */}
            <h4 className="data-box">{state ? state.name : "loading"}</h4>
            <div className="data-box">
              <h6>{mypics.length} posts</h6>
              <h6>
                {state ? (state.followers ? state.followers.length : "0") : "0"}{" "}
                followers
              </h6>
              <h6>
                {state ? (state.following ? state.following.length : "0") : "0"}{" "}
                following
              </h6>
            </div>
          </div>
        </div>
        <div className="file-field input-field" style={{ margin: "10px" }}>
          <div className="btn #64b5f6 blue darken-1">
            <span>Update pic</span>
            <input
              type="file"
              onChange={(e) => updatePhoto(e.target.files[0])}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <div className="gallery">
          {mypics.map((item) => {
            return (
              <img
                className="item card"
                key={item._id}
                src={item.photo}
                alt={item.title}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Profile;
