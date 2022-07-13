import React, { useState, useContext, useEffect } from "react";
import NavBar from "../navbar";
import M from "materialize-css";
import { UserContext } from "../../App";
// import "materialize-css/dist/css/materialize.min.css";
import { Component } from "react/cjs/react.production.min";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);

  const { state, dispatch } = useContext(UserContext);

  fetch("/allpost", {
    headers: {
      Authorization: localStorage.getItem("jwt"),
    },
  })
    .then((res) => res.json())
    .then((result) => {
      // console.log(result.posts);
      setData(result.posts);
    });

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else return item;
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };
  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else return item;
        });
        setData(newData);
        // console.log(newData);
      })
      .catch((err) => console.log(err));
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else return item;
        });
        setData(newData);
        console.log(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };
  const Modals = () => {
    useEffect(() => {
      const options = {
        onOpenStart: () => {
          console.log("Open Start");
        },
        onOpenEnd: () => {
          console.log("Open End");
        },
        onCloseStart: () => {
          console.log("Close Start");
        },
        onCloseEnd: () => {
          console.log("Close End");
        },
        inDuration: 250,
        outDuration: 250,
        opacity: 0.5,
        dismissible: false,
        startingTop: "4%",
        endingTop: "10%",
      };
      M.Modal.init(this.Modal, options);
    }, []);
  };

  return (
    <div>
      <NavBar />
      <div className="home">
        {data.map((item) => {
          // console.log(item);
          // console.log(state);
          return (
            <div className="card home-card" key={item._id}>
              <h5 style={{ padding: "5px" }}>
                <Link
                  to={
                    item.postedBy._id !== state._id
                      ? "/profile/" + item.postedBy._id
                      : "/profile"
                  }
                >
                  {item.postedBy.name}
                </Link>
                {item.postedBy._id == state._id && (
                  <i
                    className="material-icons"
                    style={{
                      float: "right",
                    }}
                    onClick={() => deletePost(item._id)}
                  >
                    delete
                  </i>
                )}
              </h5>
              <div className="card-image">
                <img src={item.photo} />
              </div>
              <div className="card-content">
                <div>
                  {item.likes.includes(state._id) ? (
                    <a href="#">
                      <i
                        className="small material-icons"
                        onClick={() => {
                          unlikePost(item._id);
                        }}
                        style={{ color: "red" }}
                      >
                        favorite
                      </i>
                    </a>
                  ) : (
                    <a href="#">
                      <i
                        className="small material-icons"
                        onClick={() => {
                          likePost(item._id);
                        }}
                      >
                        favorite_border
                      </i>
                    </a>
                  )}
                </div>

                <h6 style={{ fontWeight: "500" }}>{item.likes.length} likes</h6>
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                {item.comments.map((record) => {
                  // console.log(record);
                  return (
                    <h6 key={record._id}>
                      <span style={{ fontWeight: "500" }}>
                        {record.postedBy.name}
                      </span>{" "}
                      {record.text}
                    </h6>
                  );
                })}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    makeComment(e.target[0].value, item._id);
                  }}
                >
                  <input type="text" placeholder="add a comment" />
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Home;
