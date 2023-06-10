import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { json, useActionData } from "react-router-dom";
import ItemOfPlaylist from "../components/ItemOfPlaylist";
import { playListActions } from "../store/playlist";
const Playlists = () => {
  const data = useActionData();
  useEffect(() => {
    if (data && data.length > 0) {
      dispatch(playListActions.setPlayList(data));
    }
  }, [data]);
  const dispatch = useDispatch();
  const playlist = useSelector((state) => {
    return state.playList.playlist;
  });
  console.log(playlist);
  return (
    <div>
      {playlist?.map((item, index) => {
        return <ItemOfPlaylist index={index} item={item} />;
      })}
    </div>
  );
};

export default Playlists;

export const Actions = async ({ request, params }) => {
  console.log("actionssssssssss=============");
  const word = params.word;
  const formData = await request.formData();
  const userID = formData.get("userid");
  const response = await fetch(
    `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${userID}/playlist/${word}.json`
  );
  if (response === null)
    throw json({ message: "error while fetching null" }, { status: 406 });
  if (!response.ok)
    throw json({ message: "error while fetching not ok" }, { status: 407 });
  const data = await response.json();
  console.log("data from playlists");
  console.log(data);
  return data;
};
