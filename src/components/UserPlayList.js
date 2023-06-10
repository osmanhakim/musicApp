import React, { useEffect, useState } from "react";
import classes from "./UserPlayList.module.css";
import { fetchTokens } from "../utility/helper";
import { useSelector } from "react-redux";
import Checkbox from "./checkbox";
import {
  json,
  Form,
  useFetcher,
  useActionData,
  useNavigation,
  useLoaderData,
} from "react-router-dom";
import { async } from "@firebase/util";

const UserPlayList = () => {
  const song = useSelector((state) => {
    return state.playList.song;
  });

  useEffect(() => {
    fetcher.load("/playlist");
  }, []);

  const data = useActionData();
  console.log("loaderData");
  const fetcher = useFetcher();

  console.log(fetcher.data);
  const [inputs, setInputs] = useState({});
  const [input, setInput] = useState(false);
  const onClickButtonHandler = (event) => {
    event.preventDefault();
    setInput(!input);
  };
  const inputOnChangeHandler = (e) => {
    setInputs((prev) => {
      const { value, checked } = e.target;
      let obj = { ...prev };
      obj[value] = checked;
      return obj;
    });
  };
  return (
    <div className={classes.div}>
      <p>Save to playList</p>
      <fetcher.Form method="POST" action="/playlist">
        <input type="hidden" name="song" value={JSON.stringify(song)} />
        <input type="hidden" name="playlists" value={JSON.stringify(inputs)} />
        <ul>
          {fetcher.data &&
            fetcher.data.list &&
            fetcher.data.list.map((el) => {
              return (
                <Checkbox
                  name="playlist"
                  value={el}
                  onChange={inputOnChangeHandler}
                />
              );
            })}
        </ul>
        <button onClick={onClickButtonHandler}>create Playlist</button>
        {input && <input type="text" name="newPlaylist" />}
        <button disabled={fetcher.state === "submitting" ? true : false}>
          {fetcher.state === "submitting" ? "wait  ..." : "send"}
        </button>
        {fetcher.data && fetcher.data.message && (
          <p style={{ fontSize: "12px" }}>{fetcher.data.message}</p>
        )}
      </fetcher.Form>
    </div>
  );
};

export default UserPlayList;

const savePlaylist = async (obj, id) => {
  const response = await fetch(
    `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${id}/playlist.json`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    }
  );

  if (response.ok) {
    const res = await response.json();
    return res;
  }
  return null;
};
export const Action = async ({ request }) => {
  try {
    let formData = await request.formData();
    formData = Object.fromEntries(formData);
    console.log("from UserPlayList actions");
    console.log(formData);
    console.log(formData.playList);
    const tokens = fetchTokens();
    if (!tokens.localId)
      throw json({ message: " erro sign in again please" }, { status: 403 });
    const response = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${tokens.localId}.json`
    );

    if (response === null || !response?.ok)
      throw json("error while trying to fetch data", { status: 406 });

    const data = await response.json();

    let obj = {};
    if (data?.playlist) obj = { ...data.playlist };
    for (let key in JSON.parse(formData.playlists)) {
      if (!data.playlist) {
        obj[key] = [JSON.parse(formData.song)];
      } else if (data.playlist) {
        for (let mykey in data.playlist) {
          if (mykey === key)
            // obj[key] = [ ...data.playList[key],JSON.parse(song)];
            obj[key].push(JSON.parse(formData.song));
        }
      }
    }
    if (formData.newPlaylist)
      obj[formData.newPlaylist] = [JSON.parse(formData.song)];
    const res = await savePlaylist(obj, tokens.localId);
    if (res) return { message: "successfully song Added to the playlist" };
  } catch (error) {
    throw json({ message: error.message }, { status: 410 });
  }
};

export const Loader = async () => {
  try {
    const tokens = fetchTokens();
    const response = await fetch(
      "https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/" +
        tokens.localId +
        "/playlist.json"
    );
    if (!response.ok)
      throw (
        ({ message: "error white trying to fetch playlist" }, { status: 500 })
      );
    const res = await response.json();
    console.log(res);
    if (res === null || undefined) return [];
    return { list: Object.keys(res) };
  } catch (error) {
    throw json({ message: error.message }, { status: 501 });
  }
};
