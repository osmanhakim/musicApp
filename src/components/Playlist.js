import React from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../firebase/firebase.js";
import { ref, getDownloadURL } from "firebase/storage";
import { useDispatch } from "react-redux";
import { playListActions, createPlayList } from "../store/playlist";
import classes from "./Playlist.module.css";
import { async } from "@firebase/util";
const Playlist = ({ color, item, title }) => {
  //   const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("from playlist");
  console.log(title);

  return (
    <div
      style={{ backgroundColor: color }}
      className={classes.div}
      onClick={() => {
        dispatch(createPlayList(item));
        navigate(`/playlists/${title}`);
      }}
    >
      <p>{title}</p>
    </div>
  );
};

export default Playlist;
