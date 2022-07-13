import React, { createContext, useContext, useEffect, useReducer } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/screens/Home";
import Profile from "./components/screens/profile";
import Signup from "./components/screens/Signup";
import Login from "./components/screens/Login";
import CreatePost from "./components/screens/createpost";
import UserProfile from "./components/screens/UserProfile";
import { reducer, initialState } from "./reducers/userReducer";
import FollowPost from "./components/screens/followpost";

export const UserContext = createContext();

const Routing = () => {
  const Navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log(user);
    if (user) {
      dispatch({ type: "USER", payload: user });
      // Navigate("/");
    } else {
      Navigate("/login");
      // Navigate("/signup");
    }
  }, []);
  return (
    <Routes>
      <Route path="/" element={<FollowPost />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/profile/:userid" element={<UserProfile />} />
      <Route path="/followingpost" element={<FollowPost />} />
      <Route path="/allpost" element={<Home />} />
    </Routes>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
