import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";
import NavBar from "../navbar";

const CreatePost = () => {
  const [title, setTitle] = useState(" ");
  const [body, setBody] = useState(" ");
  const [image, setImage] = useState(" ");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (url) {
      fetch("/create", {
        method: "post",
        headers: {
          "content-type": "application/json",
          authorization: localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          imageurl: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          if (data.error) {
            M.toast({ html: data.error, classes: "#e53935 red darken-1" });
            return;
          } else {
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url, title, body, navigate]);
  const PostDetails = () => {
    const data = new FormData();
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
  return (
    <div>
      <NavBar />
      <div className="card input-filed create-box">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Caption"
        />
        <div className="file-field input-field">
          <div className="btn blue darken-1">
            <span>Image</span>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              multiple
            />
          </div>
          <div className="file-path-wrapper">
            <input
              className="file-path validate  "
              type="text"
              placeholder="Upload Images"
            />
          </div>
        </div>
        <button
          className="btn   post-btn blue darken-1"
          onClick={() => PostDetails()}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
