import React, { useEffect, useRef, useState } from "react";
import classes from "./Posts.module.css";
import { useSelector, useDispatch } from "react-redux";
import { storage } from "../firebase/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { addPostTodb } from "../store/Post";
import { fetchTokens } from "../utility/helper";
import { fetchPosts, Actions as PostActions } from "../store/Post";
import Post from "../components/Post";
import { Link } from "react-router-dom";
import { fetchF, Action as ActionUser } from "../store/user";
const Posts = () => {
  const dispatch = useDispatch();
  const tokens = fetchTokens();
  const textRef = useRef();
  const isUpdated = useSelector((state) => {
    return state.post.isUpdated;
  });
  useEffect(() => {});
  //   const [sorted , setSorted] = useState();
  const user = useSelector((state) => {
    return state.user;
  });

  const posts = useSelector((state) => {
    return state.post.posts;
  });

  useEffect(() => {
    dispatch(fetchF());
  }, []);

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  useEffect(() => {
    console.log("run fetchpost useEffect");
    if (isUpdated) {
      dispatch(fetchPosts());
      dispatch(PostActions.setisUpdated(false));
    }
  }, [posts]);

  useEffect(() => {
    dispatch(PostActions.sort());
    dispatch(PostActions.sortComments());
    console.log(`posts`);
    console.log(posts);
    // dispatch(PostActions.setisUpdated(true));

    console.log("loop");
  }, [posts]);
  useEffect(() => {
    const func = async () => {
      if (user && user.profilePic) {
        const myRef = ref(storage, user.profilePic);
        const url = await getDownloadURL(myRef);
        setPic(url);
      }
    };
    func();
  }, [user.profilePic]);
  const addPostHandler = (event) => {
    event.preventDefault();
    const text = textRef.current.value;
    const time = Date.now();
    const tokens = fetchTokens();
    const userid = tokens.localId;
    const post = { text, time, userid };
    dispatch(addPostTodb(post));
    dispatch(PostActions.setisUpdated(true));
  };

  const [pic, setPic] = useState("");
  return (
    <div className={` shadow-lg ${classes.posts}`}>
      <div className={classes.tweet}>
        <Link to={`/profile/${tokens.localId}`}>
          <img src={pic} />
        </Link>
        <div>
          <form method="post" action="" onSubmit={addPostHandler}>
            <textarea
              placeholder="What is happening?!"
              ref={textRef}
              name="text"
            ></textarea>
            <hr></hr>
            <button>Post</button>
          </form>
        </div>
      </div>
      <div>
        {posts.map((obj) => {
          console.log("obj");
          console.log(obj);
          return (
            <Post
              key={obj.key}
              item={obj.item}
              myKey={obj.key}
              userId={obj.item.userid}
              show={true}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Posts;
