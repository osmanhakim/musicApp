import React, { useEffect, useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import "../tailwind.css";
import Header from "./Header";
import Player from "./Player";
import classes from "./Main.module.css";
import { useSelector } from "react-redux";
import Notification from "./Notifications";
const Nav = () => {
  // const onChangeUrlHandler = (url) => {
  //   //
  // };

  const showNotification = useSelector((state) => {
    return state.user.showNotification;
  });
  const list = [
    {
      songName: "Yeah",
      artistName: "Usher",
      title: "2002",
      pic: "https://i1.sndcdn.com/artworks-5QgtlYAXGc9wUJDu-CDJUFw-t500x500.jpg",
      song: "https://fine.sunproxy.net/file/LzZiME8xUU1pMHY4aUNIaG9EdWpSTXBXOWFwNzBLbUJOeDZnYk9xVURyRjlYNy8wcXN2c01DbGNjajZKc3RuNUt3UlFyViswYjdmNkZveS9iVFNPWkFEMGVrRFdEQVdra2U2ZDh1RmE1S2s9/Usher_feat._Lil_Jon_Ludacris_-_Yeah_(ColdMP3.com).mp3",
    },
    {
      songName: "Thriller",
      artistName: "Michael jackson",
      title: "1983",
      pic: "https://m.media-amazon.com/images/M/MV5BODhhZjJlYTktZDQ2MS00Yzk4LWFlOTQtYTgyOGE1ZGE5YWEyL2ltYWdlXkEyXkFqcGdeQXVyMzA5MjgyMjI@._V1_FMjpg_UX1000_.jpg",
      song: "https://files.abdwap2.com/uploads/songs/Michael Jackson/1982 Thriller/04. Thriller.mp3",
    },
  ];
  // const [index, setIndex] = useState(0);
  let index = 0;
  const [playlist, setPlayList] = useState(list);
  const getNextSong = () => {
    console.log("getNext nun");
    console.log(playlist.length + "length of playlist");
    if (index >= playlist.length) return null;
    else if (index < 0) return null;
    const res = playlist[index];
    index++;
    return res;
  };

  const getPrevSong = () => {
    console.log("getPrev run");
    index--;
    if (index < 0 || index > playlist.length) return null;
    return playlist[index];
  };

  return (
    <main className="col-span-10  w-full h-full">
      <p className="text-red-200"></p>
      <div className="grid-cols-10 grid w-full h-full ">
        <div className={classes.main}>
          {showNotification && <Notification />}
          <Outlet />
        </div>
        <Player
          getNextSong={getNextSong}
          getPrevSong={getPrevSong}
          index={index}
        />
      </div>
    </main>
  );
};

export default Nav;
