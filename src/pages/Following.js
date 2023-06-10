import classes from "./Following.module.css";
import React, { useEffect, useState } from "react";
import { fetchUser } from "./Details";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase/firebase";
import FollowingItem from "../components/FollowItem";
import { fetchF } from "../store/user";
import { useDispatch, useSelector } from "react-redux";
const Following = () => {
  const dispatch = useDispatch();

  const following = useSelector((state) => {
    return state.user.following;
  });

  const fetchedFollowing = useSelector((state) => {
    return state.user.fetchedFollowing;
  });

  useEffect(() => {
    dispatch(fetchF());
  }, [fetchedFollowing]);
  return (
    <div classes={classes.box}>
      {following &&
        Object.keys(following).map((item) => {
          if (following[item]) {
            return (
              <div className={classes.item}>
                <FollowingItem userid={item} />
              </div>
            );
          }
        })}
    </div>
  );
};

export default Following;
