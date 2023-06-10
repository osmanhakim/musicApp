import React, { useState, useRef } from "react";
import classes from "./Comment.module.css";
import { Form, useActionData, useNavigation, Link } from "react-router-dom";

const Comment = ({
  comment,
  pic,
  name,
  commentId,
  index,
  title,
  show,
  userID,
}) => {
  const navigation = useNavigation();
  const data = useActionData();
  const [clicked, setClicked] = useState(false);
  const [replay, setReplay] = useState(false);
  const refInput = useRef();

  return (
    <>
      <div className={classes.comment}>
        <Link to={`/profile/${userID}`} replace={true}>
          <img src={pic} />
        </Link>
        <div>
          <span>{name}</span>
          <p>{comment}</p>
        </div>
        {!replay && show && (
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
        <>
          {" "}
          <Form
            action={`/details/${title}`}
            method="post"
            onSubmit={(event) => {
              //   event.preventDefault();
              //   const form = new FormData(event.target);
              //   const data = Object.fromEntries(form);
              //   console.log("data from onSubmit");
              //   console.log({ ...data, title });

              setTimeout(() => {
                refInput.current.value = "";
              }, 1000);
            }}
          >
            <input type="hidden" name="send" value="replay" />
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
              disabled={clicked && navigation.state === "submitting"}
            >
              {clicked && navigation.state === "submitting"
                ? "sending ..."
                : "replay"}
            </button>
          </Form>
        </>
      )}
    </>
  );
};

export default Comment;
