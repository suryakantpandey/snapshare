import React, { useEffect, useState, useContext } from "react";
import NavBar from "../navbar";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [userProfile, setProfile] = useState(null);

  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  // console.log(userid);
  const [showFollow, setShowFollow] = useState(
    state ? state.following
    .includes(userid) : true
  );
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setProfile(result);
      });
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        // console.log(data);
        setProfile((previousState) => {
          return {
            ...previousState,
            user: {
              ...previousState.user,
              followers: [...previousState.user.followers, data.id],
            },
          };
        });
        setShowFollow(false);
      });
  };
  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));

        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      });
  };
  return (
    <>
      {userProfile ? (
        <div>
          <NavBar />
          <div className="profile-page">
            <div className="profile-box">
              <div>
                <img
                  className="profile-pic circle"
                  src={userProfile.user.pic}
                />
              </div>
              <div>
                <h4 className="left">{userProfile.user.name}</h4>
                {showFollow ? (
                  <button
                    className="btn-small blue darken-1 follow"
                    type="Action"
                    onClick={() => {
                      followUser();
                    }}
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    className="btn-small blue darken-1 follow"
                    type="Action"
                    onClick={() => {
                      unfollowUser();
                    }}
                  >
                    UnFollow
                  </button>
                )}

                <div className="data-box">
                  <h6>
                    <b>{userProfile.posts.length}</b> posts
                  </h6>
                  <h6>
                    <b>{userProfile.user.followers.length}</b> followers
                  </h6>
                  <h6>
                    <b>{userProfile.user.following.length}</b> following
                  </h6>
                </div>
              </div>
            </div>
            <div className="gallery">
              {userProfile.posts.map((item) => {
                return (
                  <img className="item card" key={item._id} src={item.photo} />
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <h2>Loading........</h2>
      )}
    </>
  );
};
export default Profile;
