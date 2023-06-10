import React, { useEffect, useState } from "react";
import "../tailwind.css";
import classes from "./Nav.module.css";
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { db } from "../firebase/firebase";
import Header from "./Header";
import {
  faHouse,
  faCompactDisc,
  faHeadphones,
  faMusic,
  faMessage,
  faUserPlus,
  faUserGroup,
  faBars,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { onValue, ref, set } from "firebase/database";
import { fetchTokens } from "../utility/helper";
import { async } from "@firebase/util";

const Nav = () => {
  const [playlist, setPlayList] = useState();
  const tokens = fetchTokens();
  // set(myref, {
  //   test: "works",
  // });

  useEffect(() => {
    const path = `users/${tokens.localId}/playlist`;
    console.log(path);

    const myref = ref(db, path);

    onValue(
      myref,
      (snapshot) => {
        console.log(
          "live snapshot ==================================================="
        );
        console.log(snapshot?.val());
        if (snapshot?.val()) setPlayList(Object.keys(snapshot?.val()));
      },
      (error) => {
        console.log(error);
        console.log(error.message);
      }
    );
  }, [tokens.localId]);
  const menu = useRef();
  const userMenu = useRef();
  return (
    <nav className="col-span-2 bg-black  w-full h-full">
      <div className="ml-10  lg:block items-center  ">
        <div
          className={`rounded-sm shadow hidden ${classes.userMenu}`}
          ref={userMenu}
        >
          <Link to="/upload">Upload Profile</Link>
          {/* <Link to="/settings">settings</Link> */}
        </div>
        <div
          className={`bg-white w-fit ml-auto transform -translate-x-5 lg:mr-0 lg:ml-0 lg:w-10 lg:bg-black lg:block z-20   hidden absolute right-5 lg:left-10 transition ${classes.top}`}
          ref={menu}
        >
          <div className="flex lg:block justify-center flex-col items-end  lg:mt-0 p-2 lg:p-0  lg-bg-black w-36 ml-auto lg:ml-0 ">
            <p className="lg:text-white  text-black font-bold  lg:mt-20 lg:mb-6 text-sm w-28 lg:px-0 py-1 bg-white lg:bg-black">
              Browse Music
            </p>
            <ul className="text-gray-900 lg:text-gray-400 flex flex-col  text-sm  gap-0 lg:gap-4">
              <li className="bg-white lg:bg-transparent block px-4 py-1 lg:rounded-none lg:p-0 lg:border-none border-b-2 transform hover:translate-y-1 transition ">
                <Link href="/">
                  <FontAwesomeIcon icon={faHouse} />
                  <span className="ml-4">Home</span>
                </Link>
              </li>
              {/* <li className="bg-white lg:bg-transparent block px-4 py-1 lg:rounded-none lg:p-0 lg:border-none border-b-2 transform hover:translate-y-1 transition">
                <Link to="/">
                  <FontAwesomeIcon icon={faCompactDisc} />
                  <span className="ml-4">Albums</span>
                </Link>
              </li> */}
              <li className="bg-white lg:bg-transparent block px-4 py-1 lg:rounded-none lg:p-0 lg:border-none border-b-2 transform hover:translate-y-1 transition">
                <Link to="/tracks">
                  <FontAwesomeIcon icon={faHeadphones} />
                  <span className="ml-4">Tracks</span>
                </Link>
              </li>
              <li className="bg-white lg:bg-transparent block px-4 py-1 lg:rounded-none lg:p-0 lg:border-none border-b-2 transform hover:translate-y-1 transition">
                <a href="#">
                  <FontAwesomeIcon icon={faCompactDisc} />
                  <span className="ml-4">playlist</span>
                  <ul>
                    {playlist?.map((item) => {
                      return (
                        <li className={classes.li}>
                          <Link key={item} to={`/playlist/${item}`}>
                            <span>{item}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </a>
              </li>
              {/* <li className="bg-white lg:bg-transparent block px-4 py-1 lg:rounded-none lg:p-0 lg:border-none border-b-2 transform hover:translate-y-1 transition">
                <a href="#">
                  <FontAwesomeIcon icon={faMusic} />
                  <span className="ml-4">Genres</span>
                </a>
              </li> */}
            </ul>
          </div>
          <div className="flex lg:block justify-center flex-col items-end mt-6 lg:mt-0 p-2 lg:p-0  w-36 ml-auto lg:ml-0">
            <p className="lg:text-white  text-black font-bold lg:mt-20 lg:mb-6 text-sm px-5 lg:px-0 py-1 bg-white lg:bg-black">
              Social Media
            </p>
            <ul className="text-gray-900 lg:text-gray-400 flex flex-col  text-sm  gap-0 lg:gap-4">
              <li className="bg-white lg:bg-transparent block px-4 py-1 lg:rounded-none lg:p-0 lg:border-none border-b-2 transform hover:translate-y-1 transition">
                <Link to="/posts">
                  <FontAwesomeIcon icon={faMessage} />
                  <span className="ml-4">Posts</span>
                </Link>
              </li>
              <li className="bg-white lg:bg-transparent block px-4 py-1 lg:rounded-none lg:p-0 lg:border-none border-b-2 transform hover:translate-y-1 transition">
                <Link to="/following">
                  <FontAwesomeIcon icon={faUserPlus} />
                  <span className="ml-4">following</span>
                </Link>
              </li>
              <li className="bg-white lg:bg-transparent block px-4 py-1 lg:rounded-none lg:p-0 lg:border-none border-b-2 transform hover:translate-y-1 transition">
                <Link to="/followers">
                  <FontAwesomeIcon icon={faUserGroup} />
                  <span className="ml-4">followers</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <span
          onClick={() => {
            console.log("clicked");
            menu.current.classList.toggle("hidden");
          }}
          className={classes.icon}
        >
          <FontAwesomeIcon icon={faBars} />
        </span>
        <span className={classes.gear}>
          <button
            onClick={() => {
              // setUserMenu(true);
              userMenu.current.classList.toggle("hidden");
            }}
          >
            {" "}
            <FontAwesomeIcon icon={faGear} />
          </button>
        </span>
      </div>
    </nav>
  );
};

export default Nav;
