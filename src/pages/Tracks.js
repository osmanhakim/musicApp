import React, { useEffect, useState } from "react";
import classes from "./Tracks.module.css";
import { storage } from "../firebase/firebase";
import { async } from "@firebase/util";
import { json, useLoaderData } from "react-router-dom";
import { getDownloadURL, ref } from "firebase/storage";
import ItemOfPlaylist from "../components/ItemOfPlaylist";
const Tracks = () => {
  const [list, setList] = useState([]);
  const data = useLoaderData();
  useEffect(() => {
    if (data) setList(data);
  }, [data]);
  return (
    <div className={classes.tracks}>
      {list.map((item, index) => {
        return <ItemOfPlaylist key={index} item={item} index={index} />;
      })}
    </div>
  );
};

export default Tracks;

export const Loader = async () => {
  try {
    const response = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/albums.json`
    );

    if (response === null)
      throw json({ message: `error while fetching` }, { status: 500 });
    if (!response.ok) throw json({ message: `error !` }, { status: 405 });
    let arr = [];
    const resData = await response.json();
    console.log(resData);
    for (let elm in resData) {
      console.log(elm);
      for (let item of resData[elm].tracks) {
        const obj = { ...item };
        const myRef = ref(storage, item.url);
        getDownloadURL(myRef).then((url) => {
          obj.url = url;
        });
        arr.push(obj);
      }
    }

    return arr;
  } catch (error) {
    throw json(
      { message: `error while fetching .${error.message}` },
      { status: 405 }
    );
  }
};
