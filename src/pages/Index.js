import React, { useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { fetchTokens } from "../utility/helper";
import "../tailwind.css";
import Nav from "../components/Nav";
import Main from "../components/Main";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { Action as userAction } from "../store/user";
import { fetchUserData } from "../utility/helper";
import { fetchF } from "../store/user";
const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tokens = fetchTokens();

  useEffect(() => {
    console.log("useEffect");
    console.log(tokens);
    if (!tokens?.idToken) navigate("/signin");
    const fetchingData = async (id) => {
      const Data = await fetchUserData(id);
      dispatch(
        userAction.setDetails({
          firstName: Data?.firstName,
          lastName: Data?.lastName,
          email: Data?.email,
          profilePic: Data?.profilePicture,
        })
      );
    };

    fetchingData(tokens.localId);
    dispatch(
      userAction.setToken({
        idToken: tokens.idToken,
        localId: tokens.localId,
        refreshToken: tokens.refreshToken,
      })
    );
    let date = new Date();
    let id = 0;
    const diff =
      new Date(parseInt(tokens.expiresIn)).getTime() - date.getTime();
    if (diff <= 0) {
      for (let key in tokens) {
        localStorage.removeItem(key);
      }
      navigate("/signin");
    } else {
      id = setTimeout(() => {
        for (let key in tokens) {
          localStorage.removeItem(key);
        }
      }, diff);
    }
    return () => {
      clearTimeout(id);
    };
  }, [tokens]);
  return (
    <div className="lg:grid grid-cols-12 pt-8 pb-64 relative bg-black  ">
      <Header />
      <Nav />
      <Main />
    </div>
  );
};

export default Home;

export const Loader = () => {
  // const data = fetchTokens();
  // console.log(data);
  // if (!data) return redirect("/signin");
  // if (!data.idToken || !data.localId || !data.expiresIn) {
  //   return redirect("/signin");
  // }
  // return redirect("/");
  return true;
};
