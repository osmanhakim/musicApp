import React, { useEffect, useRef, useState } from "react";
import classes from "./Profile.module.css";
import { json, useLoaderData, useParams, Form } from "react-router-dom";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase/firebase";
import { fetchTokens } from "../utility/helper";
import { fetchUser, fetchComments } from "./Details.js";
import { useSelector, useDispatch } from "react-redux";
import { actions as profileActions } from "../store/profile";
import { fetchOwnPosts } from "../store/Post";
import Post from "../components/Post";

import SongDetail from "../components/SongDetail";
const Profile = () => {
  //   const params = useParams();
  const data = useLoaderData();
  const params = useParams();
  const profile = useSelector((state) => {
    return state.profile;
  });

  const dispatch = useDispatch();
  // const posts = useSelector((state) => {
  //   return state.post.posts;
  // });

  // const isFetched = useSelector((state) => {
  //   return state.post.isFetched;
  // });
  // useEffect(() => {
  //   console.log("posts");
  //   console.log(posts);
  //   setList((prev) => {
  //     return [...prev, ...posts];
  //   });
  // }, [isFetched]);
  // useEffect(() => {
  //   if (!posts || (posts && Object.keys(posts).length === 0))
  //     dispatch(fetchOwnPosts(params.id));
  // }, [isFetched]);

  // useEffect(() => {
  //   dispatch(fetchOwnPosts(params.id));
  // }, []);
  // const [user, setUser] = useState();
  const [list, setList] = useState([]);
  const [sorted, setSorted] = useState(false);
  //   let firstTime = useRef(true);
  let firstTime = true;
  let firstTimefetching = useRef(true);
  let divref = useRef();
  //   const [firstTime, setFirstTime] = useState(true);
  const fetchSongWithComments = async (title, index) => {
    const response = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/albums/${title}/tracks/${index}.json`
    );
    if (response === null)
      throw json(
        { message: "error while fetching song null" },
        { status: 403 }
      );
    if (!response.ok)
      throw json(
        { message: "error while fetching song not ok" },
        { status: 404 }
      );
    const data = await response.json();
    return data;
  };

  const pushItem = (item) => {
    setList((prev) => {
      if (prev) return [...prev, item];
      else return [item];
    });
  };
  const sortList = (list) => {
    const arr = [...list];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i; j < arr.length; j++) {
        let itemj = arr[j].hasOwnProperty("item") ? arr[j].item : arr[j];
        let itemi = arr[i].hasOwnProperty("item") ? arr[i].item : arr[i];

        if (itemj.time >= itemi.time) {
          let temp = arr[j];
          arr[j] = arr[i];
          arr[i] = temp;
        }
      }
    }

    return arr;
  };

  //   const sortList = (list) => {
  //     const arr = [...list]; // Create a copy of the list

  //     arr.sort((a, b) => {
  //       if (a.time < b.time) {
  //         return 1; // Swap positions
  //       } else if (a.time > b.time) {
  //         return -1; // Maintain positions
  //       } else {
  //         return 0; // Maintain positions
  //       }
  //     });

  //     return arr;
  //   };
  let id;
  //   useEffect(() => {
  //     firstTime = true;
  //   },[];

  useEffect(() => {
    console.log(
      "first time ================================================================"
    );
    console.log(firstTime);
    if (firstTime) {
      console.log("empty the list is run");
      setList([]);
      console.log("divref.current.children[0]");
      console.log(divref.current.children);
      firstTimefetching.current = true;
      firstTime = false;
    }
  }, [firstTime, firstTimefetching.current]);
  useEffect(() => {
    if (list && !sorted) {
      console.log("list of songs with comments");
      console.log(list);
      // const arr = sortList(list);
      // setList(arr);
      setTimeout(() => {
        const arr = sortList(list);
        console.log("sorted arr");
        console.log(arr);
        setList(arr);
        setSorted(true);
      }, 5000);
    }

    return () => {
      // clearTimeout(id);
    };
  }, [list, firstTimefetching]);
  useEffect(() => {
    const fetchC = async (title, index, time) => {
      //
      let res = await fetchSongWithComments(title, index);
      if (res && res.comments) {
        const resComments = await fetchComments(res.comments);
        res.comments = [...resComments];
        res.time = time;
      }
      console.log("res from fetchSongWithComments");
      console.log(res);
      //   const myRef = ref(storage, res.pic);
      //   const pic = await getDownloadURL(myRef);
      //   res["pic"] = pic;
      pushItem({ ...res, index, title });
    };
    setList([]);
    console.log(firstTimefetching.current);
    if (firstTimefetching.current) {
      if (data && data.comments) {
        for (let key in data.comments) {
          fetchC(
            data.comments[key].title,
            data.comments[key].index,
            data.comments[key].time
          );
        }
      }
      if (data && data.replay) {
        for (let key in data.replay) {
          fetchC(
            data.replay[key].title,
            data.replay[key].index,
            data.replay[key].time
          );
        }
      }
      firstTimefetching.current = false;
    }
  }, [data]);
  useEffect(() => {
    //    setUser(data);
    const fetchUrl = async () => {
      const myRef = ref(storage, data?.profilePicture);
      const url = await getDownloadURL(myRef);
      dispatch(profileActions.setUser(data));
      dispatch(profileActions.setProfilepic(url));
      // setUser({ ...data, profilePicture: url });
    };

    fetchUrl();
  }, [data]);
  return (
    <>
      <div className={classes.profile}>
        <div className="">
          <img src={profile?.pic} />
          <div className="shadow">
            <div>
              <p>
                <span>first name </span>
                {profile?.firstName}
              </p>
              <p>
                <span>last name </span>
                {profile?.lastName}
              </p>
            </div>
            <p>
              <span>email</span>
              {profile?.email}
            </p>
          </div>
          <div className={`xs:flex flex-col lg:block ${classes.data}`}>
            {data && data.playlist && (
              <>
                <p>PlayList</p>
                <ul>
                  {Object.keys(data.playlist).map((key) => {
                    return (
                      <li>
                        <Form action={`/playlists/${key}`} method="POST">
                          <input
                            type="hidden"
                            name="userid"
                            value={params.id}
                          />
                          <button>{key}</button>
                        </Form>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
      <p
        style={{
          textAlign: "center",
          color: "#ddd",
          fontSize: "22px",
          marginTop: "60px",
        }}
      >
        activites
      </p>
      <div className={classes.box} ref={divref}>
        {list.map((item) => {
          if (item.hasOwnProperty("item"))
            return (
              <Post
                key={item.key}
                item={item.item}
                myKey={item.key}
                userId={item.item.userid}
                show={true}
              />
            );
          else
            return (
              <SongDetail song={item} title={item.title} index={item.index} />
            );
        })}
      </div>
    </>
  );
};

export default Profile;

export const Loader = async ({ request, params }) => {
  try {
    const id = params.id;
    const response = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${id}.json`
    );
    if (response === null)
      throw json(
        { message: "error while fetching user null" },
        { status: 405 }
      );
    if (!response.ok)
      throw json(
        { message: "error while fetching user not ok" },
        { status: 406 }
      );

    const data = await response.json();
    console.log("fetch user data profile");
    console.log(data);
    return data;
  } catch (error) {
    throw json({ message: error.message }, { status: error.status });
  }
};
