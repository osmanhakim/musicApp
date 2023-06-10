import React, { useEffect } from "react";
import "../tailwind.css";
import classes from "./Header.module.css";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBell } from "@fortawesome/free-solid-svg-icons";
import { app, storage } from "../firebase/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { useDispatch } from "react-redux";
import { Action as userAction } from "../store/user";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const search = useRef();
  const [pic, setPic] = useState();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    console.log("user.profilePicture");
    console.log(user.profilePic);
    console.log(user);
    if (user.idToken) {
      const myref = ref(storage, user.profilePic);
      getDownloadURL(myref).then((url) => {
        console.log(url);
        setPic(url);
      });
    }
  }, [user.profilePic]);
  useEffect(() => {
    search.current.value = "Search for Song";
  }, []);
  return (
    <header className={classes.header}>
      <div className="flex flex-col justify-stretch items-stretch lg:flex-row gap-8  p-10 w-full">
        <p className="text-white text-md md:text-3xl ml-14">
          <span className="font-bold text-md md:text-3xl text-white ">
            Play
          </span>
          cloud
        </p>
        <form
          className="w-full"
          action="/search"
          method="post"
          onSubmit={(event) => {
            event.preventDefault();
            console.log(search.current.value);
            const word = search.current.value;
            navigate(`/${word}`);
          }}
        >
          <span>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </span>
          <input
            className="w-full"
            name="song"
            onClick={(event) => {
              if (event.target.value === "Search for Song")
                search.current.value = "";
            }}
            type="text"
            name="search"
            className=" p-2 rounded-2xl border-none outline-none pl-6 sm:pl-6 md:pl-11 text-sm md:text-md lg:text-lg w-full"
            defaultValue=""
            ref={search}
          />
        </form>
      </div>
      <div className="text-white ml-15 flex gap-4  items-center justify-around ">
        <Link to={`/profile/${user.localId}`}>
          <img src={pic} className="shadow" />
        </Link>
        <p>{user.firstName}</p>

        {user.idToken && (
          <div className="flex flex-col gap-2 justify-center">
            <span
              className="lg:mr-5"
              onClick={() => {
                console.log("notification clicked");
                dispatch(userAction.toggleNotification());
              }}
            >
              <FontAwesomeIcon icon={faBell} />
            </span>
            <Link
              className="self-start  py-2 px-4 bg-white text-black rounded font-bold"
              to="/logout"
            >
              Logout
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
