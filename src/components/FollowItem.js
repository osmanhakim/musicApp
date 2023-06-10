import React, { useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase";
import { fetchUser } from "../pages/Details";
import { useDispatch } from "react-redux";
import { Action as ActionUser, delFollowingTodb } from "../store/user";
import { Link } from "react-router-dom";
const FollowItem = ({ userid }) => {
  const dispatch = useDispatch();
  const [pic, setPic] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const func = async () => {
      const user = await fetchUser(userid);
      const myRef = ref(storage, user.pic);
      const url = await getDownloadURL(myRef);
      setPic(url);
      setName(`${user.firstName} ${user.lastName}`);
    };
    func();
  }, []);

  return (
    <>
      <div>
        <Link to={`/profile/${userid}`}>
          <img src={pic}></img>
        </Link>
        <p>{name}</p>
      </div>
      <button
        onClick={() => {
          dispatch(ActionUser.setFetchedFollowing());
          dispatch(delFollowingTodb(userid));
          dispatch(ActionUser.closeFetchedFollowers());
        }}
      >
        unfollow
      </button>
    </>
  );
};

export default FollowItem;
