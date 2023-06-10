import React, { useEffect } from "react";
import classes from "./Followers.module.css";
import { useSelector, useDispatch } from "react-redux";
import FollowerItem from "../components/FollowerItem";
import { Action as ActionUser, fetchF } from "../store/user";

const Followers = () => {
  const dispatch = useDispatch();
  const followers = useSelector((state) => {
    return state.user.followers;
  });

  const fetchedFollowers = useSelector((state) => {
    return state.user.followers;
  });
  useEffect(() => {
    dispatch(fetchF());
  }, [fetchedFollowers]);
  return (
    <div className={classes.box}>
      {followers &&
        Object.keys(followers).map((key) => {
          return (
            <div className={classes.item}>
              <FollowerItem key={key} userid={key} />
            </div>
          );
        })}
    </div>
  );
};

export default Followers;
