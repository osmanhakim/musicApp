import React, { useEffect, useState, useRef } from "react";
import classes from "./Details.module.css";
import { storage } from "../firebase/firebase";
import Comments from "../components/Comments";
import { ref, getDownloadURL } from "firebase/storage";
import {
  useFetcher,
  useParams,
  Form,
  json,
  useNavigation,
} from "react-router-dom";
import Comment from "../components/Comment";
import { fetchTokens } from "../utility/helper";
import { fetchUserByName } from "../components/SongDetail";
const Details = () => {
  const refText = useRef();
  const fetcher = useFetcher();
  const [userID, setUserID] = useState();
  const [index, setIndex] = useState();
  const [clicked, setClicked] = useState(false);
  const params = useParams();
  const [comments, setComments] = useState();
  const navigation = useNavigation();
  const [song, setSong] = useState({});
  const [title, setTitle] = useState("no-artist");
  //   const [userID, setUserID] = useState();

  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load(`/${params.word}`);
      console.log(params.word);
    }
  }, [fetcher]);

  //   const fetchUserId = async () => {
  //     fetch();
  //   };

  useEffect(() => {
    const func = async () => {
      const res = await fetchComments(fetcher.data.song.comments);
      setComments(res);
    };

    if (fetcher.data && fetcher.data.song) {
      setSong(fetcher.data.song);
    }
    if (fetcher.data && fetcher.data.title) setTitle(fetcher.data.title);
    if (
      fetcher.data &&
      fetcher.data.index !== null &&
      fetcher.data.index !== undefined
    ) {
      console.log("state title and index updated");
      setIndex(fetcher.data.index);
      console.log("myIndex");
      console.log(index);
    }
    if (fetcher.data?.song?.comments) {
      func();
    }
  }, [fetcher.data, clicked]);

  console.log("my fetcher data");
  console.log(fetcher.data);
  return (
    <div className={` ${classes.details}`}>
      <img className="shadow" src={song?.pic} />
      <p>{song?.songName}</p>
      <p>{song?.artistName}</p>
      <p>Comments .. </p>
      <Form
        action=""
        method="post"
        onSubmit={(event) => {
          setTimeout(() => {
            if (refText && refText.current) refText.current.value = "";
          }, 1000);
        }}
      >
        <input type="hidden" name="index" value={index} />
        <input type="hidden" name="title" value={title} />
        <input
          className={classes.input}
          type="text"
          name="text"
          ref={refText}
          placeholder="add a comment"
        />
        <button
          onClick={() => {
            setClicked(true);
            setTimeout(() => {
              setClicked(false);
            }, 500);
          }}
          disabled={clicked && navigation.state === "submitting"}
        >
          {clicked && navigation.state === "submitting"
            ? "sending ..."
            : "comment"}
        </button>
      </Form>
      <div>
        {comments &&
          comments.map((c, ind) => {
            console.log(c);
            fetchUserByName(c.firstName, c.lastName).then((userID) => {
              setUserID(userID);
            });
            // console.log("userID");
            // console.log(userID);
            if (c.hasOwnProperty("replay") && c.replay.length > 0)
              return (
                <Comments
                  key={c.commentId}
                  pic={c.pic}
                  comment={c.comment}
                  name={c.firstName}
                  comments={c.replay}
                  commentId={c.commentId}
                  title={title}
                  index={index}
                  show={false}
                  userID={userID}
                />
              );
            else
              return (
                <Comment
                  key={c.commentId}
                  comment={c.comment}
                  pic={c.pic}
                  name={c.firstName}
                  commentId={c.commentId}
                  title={title}
                  index={index}
                  show={true}
                  userID={userID}
                />
              );
          })}
      </div>
    </div>
  );
};

export default Details;
const tracePath = (obj, id, path) => {
  let newPath = path;
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && key) {
      console.log("path = ");
      console.log(newPath);
      console.log("key = ");

      console.log(key);
      if (key === id) {
        newPath += key;
        return newPath;
      } else {
        newPath += `${key}/replay/`;
        if (obj[key].hasOwnProperty("replay")) {
          let retVal = tracePath(obj[key].replay, id, newPath);
          if (retVal) return retVal;
        }
      }
    }

    return null;
  }
};

// const tracePath = (obj, id, path = "") => {
//   for (let key in obj) {
//     if (obj.hasOwnProperty(key) && obj[key].hasOwnProperty("comment")) {
//       const newPath = `${path}${key}/`;
//       if (key === id) {
//         return newPath;
//       } else if (obj[key]?.replay) {
//         const foundPath = tracePath(obj[key].replay, id, `${newPath}replay/`);
//         if (foundPath) {
//           return foundPath;
//         }
//       }
//     }
//   }
//   return null;
// };

const fetchCommentPath = async (title, index, id) => {
  const response = await fetch(
    `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/albums/${title}/tracks/${index}/comments.json`
  );
  if (response === null)
    throw json(
      { message: "error null response while fetching comments" },
      { status: 410 }
    );
  if (!response.ok)
    throw json(
      { message: "error not ok while fetching comments " },
      { status: 411 }
    );
  const resData = await response.json();
  console.log("my list = ");
  console.log(resData);
  console.log("url to fetch comments");
  console.log(
    `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/albums/${title}/tracks/${index}/comments.json`
  );
  //   let path = "";

  let path = tracePath(resData, id, "");
  return path;
  //   console.log(path);
};

export const Action = async ({ request }) => {
  try {
    const tokens = fetchTokens();
    const data = await request.formData();
    const send = data.get("send");
    const comment = data.get("text");
    const title = data.get("title");
    const index = data.get("index");
    if (send === "replay") {
      const commentId = data.get("commentId");
      console.log("comment id");
      console.log(commentId);
      let path = await fetchCommentPath(title, index, commentId);
      console.log("path generated from recursion call");
      console.log(path);
      //   const url = `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/albums/${title}/tracks/${index}/comments/${commentId}/replay.json`;
      const url = `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/albums/${title}/tracks/${index}/comments/${path}/replay.json`;
      const dateTime = Date.now();
      console.log(url);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: tokens.localId,
          comment,
          time: dateTime,
        }),
      });
      if (res === null)
        throw json({ message: " null error while replaying" }, { status: 403 });
      if (!res.ok)
        throw json({ message: `error while fetching not ok` }, { status: 405 });
      const resData = await res.json();
      console.log("response from replay");
      console.log(resData);
      const objReplay = {
        title,
        index,
        comment,
        commentId,
        replayId: resData.name,
        time: dateTime,
      };
      const replayResponse = await fetch(
        `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${tokens.localId}/replay.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
          },
          body: JSON.stringify(objReplay),
        }
      );

      if (replayResponse === null)
        throw json(
          { message: "error while saving replay null" },
          { status: 404 }
        );
      if (!replayResponse.ok)
        throw json(
          { message: "error while saving replay not ok" },
          { status: 405 }
        );
      const replayData = await replayResponse.json();
      console.log(replayData);

      return resData;
    } else {
      const newUrl = `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/albums/${title}/tracks/${index}/comments.json`;
      console.log(newUrl);
      const timeD = Date.now();
      const response = await fetch(newUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment,
          replay: [],
          userId: tokens.localId,
          time: timeD,
        }),
      });

      if (response === null)
        throw json({ message: "error response obj" }, { status: 405 });
      if (!response.ok)
        throw json(
          { message: "error while trying to save comment" },
          { status: 303 }
        );
      const resData = await response.json();
      console.log(resData);
      const newResponse = await fetch(
        `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${tokens.localId}/comments.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            index,
            comment,
            time: timeD,
          }),
        }
      );

      if (newResponse === null)
        throw json({ message: "error response obj 2" }, { status: 405 });
      if (!newResponse.ok)
        throw json(
          { message: `error while trying to save comment 2` },
          { status: 303 }
        );

      const newResData = await newResponse.json();
      console.log(newResData);
      return newResData;
    }
  } catch (error) {
    throw json({ message: error.message }, { status: error.status });
  }
};

export const fetchUser = async (id) => {
  const response = await fetch(
    `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${id}.json`
  );
  if (response && response.ok) {
    const resData = await response.json();
    return {
      firstName: resData?.firstName || "",
      lastName: resData?.lastName || "",
      pic: resData?.profilePicture || "",
    };
  }
  return null;
};
export const fetchComments = async (obj) => {
  let arr = [];
  for (let key in obj) {
    const res = await fetchUser(obj[key].userId); // {firstName , lastName, pic}
    let newObj = {};
    newObj["commentId"] = key;
    newObj["comment"] = obj[key]?.comment;
    newObj["firstName"] = res?.firstName || "";
    newObj["lastName"] = res?.lastName || "";
    let replayList = [];
    if (obj[key].hasOwnProperty("replay"))
      replayList = await fetchComments(obj[key].replay);
    newObj["replay"] = replayList;
    const myRef = ref(storage, res.pic || "pics/download.png");
    const pic = await getDownloadURL(myRef);
    newObj["pic"] = pic;
    console.log(newObj);
    //   newObj["pic"] = res.pic;
    arr.push(newObj);
  }

  return arr;
};
