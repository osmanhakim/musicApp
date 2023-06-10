import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import classes from "./Notification.module.css";
import { fetchNotification } from "../store/user";
import NotificationItem from "./NotificationItem";
const Notification = () => {
  useEffect(() => {
    dispatch(fetchNotification());
  }, []);

  const dispatch = useDispatch();
  const notification = useSelector((state) => {
    return state.user.notification;
  });
  return (
    <div className={`shadow   z-50  ${classes.box}`}>
      <ul>
        {notification &&
          Object.keys(notification)
            .reverse()
            .map((key) => {
              return (
                <NotificationItem
                  key={key}
                  notificationKey={key}
                  text={notification[key].text}
                  link={notification[key].link}
                  time={notification[key].time}
                  userid={notification[key].userid}
                  read={notification[key].read}
                />
              );
            })}

        {Object.keys(notification).length === 0 && (
          <p style={{ color: "#ddd", width: "300px", textAlign: "center" }}>
            no notification
          </p>
        )}
      </ul>
    </div>
  );
};

export default Notification;
