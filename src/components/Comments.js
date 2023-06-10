import React, { useState, useRef, useEffect } from "react";
import { fetchUserByName } from "./SongDetail";
import classes from "./Comment.module.css";
import Comment from "./Comment";
import { useNavigation, Form, Link } from "react-router-dom";
const Comments = ({
  comment,
  pic,
  name,
  comments,
  commentId,
  title,
  index,
  show,
  userID,
}) => {
  const [replay, setReplay] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [childUserID, setChildUserID] = useState();
  const navigation = useNavigation();
  const refInput = useRef();
  useEffect(() => {
    console.log("myIndex effect");
    console.log(index);
  }, [index]);
  return (
    <div>
      <div className={classes.comment}>
        <Link to={`/profile/${userID}`} replace={true}>
          <img src={pic} alt="Profile Pic" />
        </Link>
        <div>
          <span>{name}</span>
          <p>{comment}</p>
        </div>
        {!replay && (
          <button
            className={classes.smbutton}
            onClick={() => {
              setReplay(true);
            }}
          >
            add a replay
          </button>
        )}
      </div>

      {replay && (
        <Form
          action={`/details/${title}`}
          method="post"
          onSubmit={(event) => {
            // event.preventDefault();
            // const form = new FormData(event.target);
            // const data = Object.fromEntries(form);
            // console.log("data from onSubmit");
            // console.log({ ...data, title });
            //  submit()
            setTimeout(() => {
              refInput.current.value = "";
            }, 1000);
            return true;
          }}
        >
          <input type="hidden" name="send" value="replay" />
          {/* Provide appropriate values for the variables */}
          <input type="hidden" name="commentId" value={commentId} />
          <input type="hidden" name="index" value={index} />
          <input type="hidden" name="title" value={title} />
          <input
            type="text"
            name="text"
            ref={refInput}
            placeholder="add a replay"
            className={classes.input}
          />
          <button
            onClick={() => {
              setClicked(true);
              setTimeout(() => {
                setClicked(false);
              }, 500);
            }}
            className={classes.button}
            disabled={
              clicked && navigation && navigation.state === "submitting"
            }
          >
            {clicked && navigation && navigation.state === "submitting"
              ? "sending ..."
              : "replay"}
          </button>
        </Form>
      )}

      <div className="ml-14">
        {comments &&
          comments.map((c) => {
            fetchUserByName(c.firstName, c.lastName).then((u) => {
              setChildUserID(u);
            });
            if (c.hasOwnProperty("replay") && c.replay.length > 0) {
              return (
                <Comments
                  key={c.CommentId}
                  pic={c.pic}
                  comment={c.comment}
                  name={c.firstName}
                  comments={c.replay}
                  commentId={c.commentId}
                  title={title}
                  index={index}
                  show={false}
                  userID={childUserID}
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
                  show={!show}
                  index={index}
                  title={title}
                  userID={childUserID}
                />
              );
            }
          })}
      </div>
    </div>
  );
};

export default Comments;
