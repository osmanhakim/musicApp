import React, { useEffect, useState } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase";
import { async } from "@firebase/util";
import { fetchUser } from "../pages/Details";
import { useDispatch } from "react-redux";
import { delFollowersTodb, Action as ActionUser } from "../store/user";
import { Link } from "react-router-dom";
const FollowerItem = ({ userid }) => {
  const [pic, setPic] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  useEffect(() => {
    const func = async () => {
      const user = await fetchUser(userid);
      const myRef = ref(storage, user?.pic);
      const url = await getDownloadURL(myRef);
      setPic(url);
      setName(`${user?.firstName} ${user?.lastName}`);
    };
    func();
  }, []);
  return (
    <div>
      <Link to={`/profile/${userid}`}>
        <img src={pic}></img>
      </Link>
      <div>
        <p>{name}</p>
        <button
          onClick={() => {
            dispatch(ActionUser.setFetchedFollowers());
            dispatch(delFollowersTodb(userid));
            dispatch(ActionUser.closeFetchedFollowers());
          }}
        >
          remove
        </button>
      </div>
    </div>
  );
};

export default FollowerItem;
