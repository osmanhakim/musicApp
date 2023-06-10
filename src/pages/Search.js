import { json, useLoaderData } from "react-router-dom";
import React from "react";
import { useDispatch } from "react-redux";
import classes from "./Search.module.css";
import { playListActions, createSong } from "../store/playlist";
import ItemOfPlaylist from "../components/ItemOfPlaylist";
const Search = () => {
  const dispatch = useDispatch();
  const data = useLoaderData();
  console.log("from search main component");
  console.log(data);
  if (data) {
    dispatch(createSong(data.song));
    return (
      <div className={classes.search}>
        <ItemOfPlaylist index={0} item={data.song} />
      </div>
    );
  } else {
    return <div class={classes.search}> not found </div>;
  }
};

export const Loader = async ({ params }) => {
  try {
    const word = params.word;
    let flag = false;
    if (word.split(" ").length > 1) flag = true;
    const response = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/albums.json`
    );
    if (response === null) {
      throw json({ message: `error while searching` }, { status: 407 });
    }
    if (!response.ok)
      throw json({ message: "error while searching !" }, { status: 403 });

    const data = await response.json();
    console.log(data);
    for (let key in data) {
      if (data && Array.isArray(data[key].tracks)) {
        for (let [index, elm] of data[key].tracks.entries()) {
          console.log(elm);
          console.log(word);
          if (flag) {
            for (let myWord of word.split(" ")) {
              if (
                elm &&
                elm.songName &&
                elm.songName.toLowerCase() === myWord.toLowerCase()
              )
                return { index, song: elm, title: key };
            }
          }
          if (
            elm &&
            elm.songName &&
            elm.songName.toLowerCase() === word.toLowerCase()
          )
            return { index, song: elm, title: key };
        }
      }
    }
  } catch (error) {
    throw json({ message: error.message }, { status: 406 });
  }
  return null;
};

export default Search;
