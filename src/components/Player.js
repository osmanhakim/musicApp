import React, { useEffect, useRef, useState } from "react";
import classes from "./Player.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux/es/exports";
import ReactPlayer from "react-player";
import {
  faMusic,
  faPlay,
  faAngleRight,
  faAngleLeft,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import myPic from "../img/Untitled.jpg";
import { useDispatch } from "react-redux";
import { playListActions } from "../store/playlist";
import "../style.css";
import UserPlayList from "./UserPlayList";
const Player = ({ getNextSong, index, getPrevSong }) => {
  const dispatch = useDispatch();
  const song = useSelector((state) => {
    return state.playList.song;
  });

  const showNotification = useSelector((state) => {
    return state.user.showNotification;
  });
  const playerRef = useRef();
  const inputRef = useRef();
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  console.log(getNextSong);
  const [playingSong, setPlayingSong] = useState();

  useEffect(() => {
    setPlayingSong(getNextSong());
  }, []);

  useEffect(() => {
    if (playedSeconds === duration) {
      inputRef.current.style.setProperty("--width", "0%");
      inputRef.current.value = 0;
      setPlayedSeconds(0);
    } else {
      inputRef.current.style.setProperty(
        "--width",
        (playedSeconds / duration) * 100 + "%"
      );
    }
    console.log("progress in useEffect");
    console.log(playedSeconds);
  }, [playedSeconds, setPlayedSeconds]);
  console.log(playedSeconds);
  return (
    playingSong !== null && (
      <>
        {showPlaylist && <UserPlayList />}
        <div
          className={classes.player}
          onContextMenu={(event) => {
            event.preventDefault();
            console.log("right clicked");
            setShowPlaylist(!showPlaylist);
          }}
        >
          <div className="shadow">
            <div>
              <span>Player</span>
              <span>
                <FontAwesomeIcon icon={faMusic} />
              </span>
            </div>
            <img src={song?.pic} />
            <h4>{song?.songName}</h4>
            <p>{song?.artistName}</p>
            <span>{song?.title}</span>
            <div className={classes.div}>
              <span>{Math.round(playedSeconds)}</span>
              <div data-var="red">
                <input
                  type="range"
                  className={showNotification ? "" : "z-30"}
                  value={playedSeconds ? Math.round(playedSeconds) : 0}
                  ref={inputRef}
                  max={Math.round(duration)}
                  onChange={(event) => {
                    playerRef.current.seekTo(event.target.value);
                  }}
                />
              </div>
              <span>{Math.round(duration)}</span>
            </div>
          </div>

          <div className="shadow">
            <button
              onClick={() => {
                // getNextSong();
                // setPlayingSong(getPrevSong());
                dispatch(playListActions.prevSong());
              }}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <button
              onClick={() => {
                if (!playing) setPlaying(true);
                else setPlaying(false);
              }}
            >
              {playing && <FontAwesomeIcon icon={faPause} />}
              {!playing && <FontAwesomeIcon icon={faPlay} />}
            </button>
            <button
              onClick={() => {
                // setPlayingSong(getNextSong());
                dispatch(playListActions.nextSong());
              }}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          </div>
          <ReactPlayer
            ref={playerRef}
            url={song?.url}
            playing={playing}
            controls={true}
            onProgress={({ playedSeconds }) => {
              console.log("progress in onProgress method");
              console.log(playedSeconds);
              setPlayedSeconds(playedSeconds);
            }}
            width="0"
            height="0"
            muted={false}
            onDuration={(d) => {
              setDuration(d);
            }}
            onReady={() => {
              setTimeout(() => {
                // playerRef.current.player. = false;
                console.log(playerRef.current);
                setPlaying(true);
                console.log("playing true");
              }, 2000);
            }}
          />
        </div>
      </>
    )
    // {playingSong === null && <div></div>}
  );
};

export default Player;
