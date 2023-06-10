import React, { useEffect, useState } from "react";
import classes from "./NotificationItem.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Action as userAction, setNotificationRead } from "../store/user";
import { fetchUser } from "../pages/Details";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase";
import { fetchTokens } from "../utility/helper";
const NotificationItem = ({
  text,
  link,
  time,
  userid,
  read,
  notificationKey,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pic, setPic] = useState();
  const [myTime, setMyTime] = useState();
  useEffect(() => {
    const timeNow = Date.now();
    const diff = timeNow - time;
    const days = Math.floor(diff / (1000 * (60 * 60) * 24));
    const hours = Math.floor(diff / (1000 * (60 * 60)));
    const diffTime = new Date(diff);
    const txt =
      days +
      "D" +
      hours +
      "H" +
      diffTime.getMinutes() +
      "M" +
      diffTime.getSeconds() +
      "S";
    setMyTime(txt);
    const func = async () => {
      const user = await fetchUser(userid);
      const myRef = ref(storage, user.pic);
      const url = await getDownloadURL(myRef);
      setPic(url);
    };
    func();
  }, []);

  return (
    <li
      className={`${read ? classes.read : classes.notread} ${classes.item}`}
      onClick={() => {
        const tokens = fetchTokens();
        const myUserid = tokens.localId;
        console.log("value passed to notification");
        console.log({ key: notificationKey, userid: myUserid });
        if (!read) dispatch(setNotificationRead(notificationKey, myUserid));
        dispatch(userAction.toggleNotification());

        navigate(link);
      }}
    >
      <div>
        <p>{text}</p>
        <span>{myTime}</span>
      </div>
      <img src={pic}></img>
    </li>
  );
};

export default NotificationItem;
