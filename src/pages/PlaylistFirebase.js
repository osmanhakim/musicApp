import React, { useEffect, useState } from "react";
import {
  json,
  useLoaderData,
  useFetcher,
  useParams,
  useNavigate,
  redirect,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchTokens } from "../utility/helper";
import { playListActions } from "../store/playlist";
import ItemOfPlaylist from "../components/ItemOfPlaylist";
const PlaylistFirebase = () => {
  const params = useParams();
  const data = useLoaderData();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [playlist, setPlayList] = useState([]);

  useEffect(() => {
    if (data) {
      console.log(data);
      dispatch(playListActions.setPlayList(data));
      // navigate("/");
    }
  }, [data]);
  //+++++++++++++++
  return (
    <diV>
      {data?.map((elm, index) => {
        return <ItemOfPlaylist index={index} item={elm} trash={true} />;
      })}
    </diV>
  );
};

// const fetchTrack = async (trackId)=> {
//   try {
//    const response = await fetch(`https://soundcloud-scraper.p.rapidapi.com/v1/track/metadata?track=${trackId}`);
//    if (!response.ok)
//    throw json({message : 'error while fetching track'}, {status : 407});
//    const resData = await response.json();

//   } catch(error) {
//     throw json({message : error.message} , {status : 410});
//   }
// }

const createPlayList = (songs) => {
  let arr = [];
  for (let elm of songs) {
    if (!elm.hasOwnProperty("trackId")) arr.push(elm);
    else {
    }
  }
};
export const Loader = async ({ params }) => {
  try {
    const tokens = fetchTokens();
    const pName = params.word;
    const response = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${tokens.localId}/playlist/${pName}.json`
    );
    if (!response.ok)
      throw json({ message: "error while fetching the data" }, { status: 403 });
    const resData = await response.json();
    console.log(pName);
    console.log(resData);
    // createPlayList(resData);
    return resData;
  } catch (error) {
    throw json({ message: error.message }, { status: 406 });
  }
};

export default PlaylistFirebase;

export const Action = async ({ request, params }) => {
  try {
    const data = await request.formData();
    const index = data.get("index");
    const word = params.word;
    console.log(word);
    const tokens = fetchTokens();
    // fetch
    const response = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${tokens.localId}/playlist/${word}.json`
    );

    if (response === null) throw json({ message: `error !` }, { status: 406 });
    if (!response.ok) {
      throw json({ message: `error request not complete` }, { status: 303 });
    }
    const resData = await response.json();
    console.log(resData);

    const arr = [...resData];
    arr.splice(index, 1);
    console.log(arr);
    let obj = {};
    obj[word] = arr;
    console.log(obj);
    const newResponse = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${tokens.localId}/playlist.json`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      }
    );

    if (newResponse === null)
      throw json({ message: `error !` }, { status: 406 });
    if (!newResponse.ok) {
      throw json({ message: `error request not complete` }, { status: 303 });
    }

    const newResData = await newResponse.json();
    console.log(newResData);
    return redirect(`/playlist/${word}`);
  } catch (error) {
    throw json(
      { message: `error while removing item from playlist ${error}` },
      { status: 403 }
    );
  }
};
