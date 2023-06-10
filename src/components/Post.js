import React, { useEffect, useState, useRef } from "react";
import classes from "./Post.module.css";
import { fetchUser } from "../pages/Details";
import { storage } from "../firebase/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { fetchTokens } from "../utility/helper";
import { addCommentTodb, Actions as PostActions } from "../store/Post";
import {
  delFollowingTodb,
  addFollowingTodb,
  fetchF,
  Action as ActionUser,
} from "../store/user";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
const Post = ({ myKey, item, show, userId }) => {
  const posts = useSelector((state) => {
    return state.post.posts;
  });

  const following = useSelector((state) => {
    return state.user.following;
  });

  const followers = useSelector((state) => {
    return state.user.followers;
  });

  const [pic, setPic] = useState("");
  const [time, setTime] = useState("");
  const [add, setAdd] = useState(false);
  const [user, setUser] = useState();
  const tokens = fetchTokens();
  const refText = useRef();
  const dispatch = useDispatch();

  const fetchedFollowing = useSelector((state) => {
    return state.user.following;
  });

  const [Following, setFollowing] = useState({});
  useEffect(() => {
    console.log("following");
    console.log(following);
    setFollowing(following);
  });

  const onClickFollowHandler = () => {
    const obj = {};
    obj.time = Date.now();
    obj.userid = userId;
    dispatch(ActionUser.setFetchedFollowing());
    dispatch(addFollowingTodb(obj));
    dispatch(ActionUser.closeFetchedFollowing());
  };

  const onClickUnfollowHandler = () => {
    dispatch(ActionUser.setFetchedFollowing());
    dispatch(delFollowingTodb(userId));
    dispatch(ActionUser.closeFetchedFollowing());
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    const text = refText.current.value;
    const key = myKey;
    const time = Date.now();
    const userid = tokens.localId;
    const obj = {
      comment: { userid, time, text },
      key,
      old: { userid: item.userid, text: item.text, time: item.time },
    };
    dispatch(addCommentTodb(obj));
    // dispatch(PostActions.sortComments());
    dispatch(PostActions.setisUpdated(true));
    refText.current.value = "";
  };
  useEffect(() => {
    const func = async () => {
      console.log(item);
      const usr = await fetchUser(item?.userid);
      console.log("my user from Post js function");
      console.log(usr);
      if (usr && usr.pic) {
        setUser(usr);
        const myRef = ref(storage, usr.pic);
        const url = await getDownloadURL(myRef);
        setPic(url);
      }
    };
    func();
    const nowTime = Date.now();
    const diff = nowTime - item?.time;
    const newTime = new Date(diff);
    let txt = "";
    txt += Math.floor(diff / (1000 * (60 * 60) * 24)) + "d";
    txt += Math.floor(diff / (1000 * (60 * 60))) + "H";
    txt += newTime.getMinutes() + "m";
    txt += newTime.getSeconds() + "s";
    setTime(txt);
  }, [item]);
  return (
    <div className={classes.postContainer}>
      <div className={`shadow-lg ${classes.post}`}>
        <Link to={`/profile/${userId}`}>
          <img src={pic} />
        </Link>
        <div>
          <div className={classes.box}>
            <div className={classes.innerBox}>
              <p>{user?.firstName}</p> <span>{time}</span>
            </div>
            {tokens.localId !== userId && !Following[userId] && (
              <button onClick={onClickFollowHandler}>follow</button>
            )}
            {tokens.localId !== userId && Following[userId] && (
              <button onClick={onClickUnfollowHandler}>unfollow</button>
            )}
          </div>
          <p>{item?.text}</p>
        </div>
      </div>
      {show && !add && (
        <button
          className={classes.button}
          onClick={() => {
            setAdd(true);
          }}
        >
          Add a Comment
        </button>
      )}
      {show && add && (
        <form className={classes.form} onSubmit={onSubmitHandler}>
          <input type="text" name="text" ref={refText} />
          <button>send</button>
        </form>
      )}
      <div className="pl-5 lg:pl-36">
        {
          item &&
            item.hasOwnProperty("comments") &&
            Object.keys(item.comments).map((key) => {
              console.log(`item.comments[key]`);
              console.log(item.comments[key]);
              return (
                <Post
                  key={key}
                  item={item.comments[key]}
                  myKey={key}
                  show={false}
                  userId={item.comments[key].userid}
                />
              );
            })
          //  for (let key in item.comments) {
          //    arr.push( <Post key={key} item={item.comments[key]} myKey={key} />);
          //  }
        }
      </div>
    </div>
  );
};

export default Post;
