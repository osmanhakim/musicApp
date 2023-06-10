import React, { useState } from "react";
import Comment from "./Comment";
import Comments from "./Comments";
import classes from "../pages/Details.module.css";
import { json } from "react-router-dom";
const SongDetail = ({ song, title, index }) => {
  const [userID, setUserID] = useState();
  return (
    <div className={classes.details}>
      <img className="shadow" src={song?.pic} />
      <p>{song?.songName}</p>
      <p>{song?.artistName}</p>
      <div>
        {song &&
          song.comments &&
          song.comments.map((c) => {
            fetchUserByName(c.firstName, c.lastName).then((userid) => {
              setUserID(userid);
            });
            // let userID = 1;
            if (c.hasOwnProperty("replay") && c.replay.length > 0) {
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
            } else {
              return (
                <Comment
                  key={c.commentId}
                  comment={c.comment}
                  pic={c.pic}
                  name={c.firstName}
                  commentId={c.commentId}
                  show={true}
                  index={index}
                  title={title}
                  userID={userID}
                />
              );
            }
          })}
      </div>
    </div>
  );
};

export const fetchUserByName = async (firstName, LastName) => {
  const response = await fetch(
    "https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users.json"
  );
  if (response === null)
    throw json(
      { message: "null response while fetching users" },
      { status: 403 }
    );
  if (!response.ok)
    throw json(
      { message: " response not okwhile fetching users" },
      { status: 404 }
    );

  const data = await response.json();
  for (let key in data) {
    if (
      data[key].firstName.toLowerCase() === firstName.toLowerCase() &&
      data[key].lastName.toLowerCase() === LastName.toLowerCase()
    ) {
      console.log("key = ");
      console.log(key);
      console.log("data = ");
      console.log(data[key]);
      return key;
    }
  }
  return null;
};
export default SongDetail;
