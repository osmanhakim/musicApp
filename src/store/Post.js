import { async } from "@firebase/util";
import { createSlice } from "@reduxjs/toolkit";
import { json } from "react-router-dom";
import { fetchTokens } from "../utility/helper";
import { sendNotification } from "./user";

const PostSlice = createSlice({
  name: "Post",
  initialState: {
    isFetched: false,
    isUpdated: false,
    posts: [],
    post: null,
    // { key : item}
  },
  reducers: {
    getPost(state, action) {
      state.post = state.posts.find((item) => {
        return item.key === action.payload;
      });
    },
    setFetched(state) {
      state.isFetched = true;
    },
    addPost(state, action) {
      // must be { key , index}
      state.posts.push(action.payload);
    },
    setisUpdated(state, action) {
      state.isUpdated = action.payload;
    },
    setPosts(state, action) {
      state.posts = [...action.payload];
    },
    sortComments(state) {
      for (let i = 0; i < state.posts.length; i++) {
        if (state.posts[i].item.hasOwnProperty("comments")) {
          for (
            let j = 0;
            j < Object.keys(state.posts[i].item.comments).length;
            j++
          ) {
            for (
              let k = j;
              k < Object.keys(state.posts[i].item.comments).length;
              k++
            ) {
              if (
                state.posts[i].item.comments[
                  Object.keys(state.posts[i].item.comments)[k]
                ].time >
                state.posts[i].item.comments[
                  Object.keys(state.posts[i].item.comments)[j]
                ].time
              ) {
                let temp =
                  state.posts[i].item.comments[
                    Object.keys(state.posts[i].item.comments)[j]
                  ];
                state.posts[i].item.comments[
                  Object.keys(state.posts[i].item.comments)[j]
                ] =
                  state.posts[i].item.comments[
                    Object.keys(state.posts[i].item.comments)[k]
                  ];
                state.posts[i].item.comments[
                  Object.keys(state.posts[i].item.comments)[k]
                ] = temp;
              }
            }
          }
        }
      }
    },
    sort(state) {
      // 1 2 3 4 5
      for (let i = 0; i < state.posts.length; i++) {
        for (let j = i; j < state.posts.length; j++) {
          if (state.posts[j].item.time > state.posts[i].item.time) {
            let temp = state.posts[j];
            state.posts[j] = state.posts[i];
            state.posts[i] = temp;
          }
        }
      }
    },
    addComment(state, action) {
      // {key post, item  , comment:[]}
      const index = state.posts.findIndex((item) => {
        return item.key === action.payload.key;
      });
      const data = action.payload.comment;
      if (index >= 0) {
        // state.posts[index] = { ...state.posts[index],  comment : data};
        if (
          state.posts[index].hasOwnProperty("comment") &&
          Number.isInteger(state.posts[index].comment.length)
        )
          state.posts[index].comment.unshift(data);
        else state.posts[index].comment = [data];
      }
    },
  },
});

export const Actions = PostSlice.actions;
export const reducer = PostSlice.reducer;

export const addPostTodb = (post) => {
  return async (dispatch) => {
    const tokens = fetchTokens();
    const response = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${tokens.localId}/posts.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      }
    );

    if (response === null)
      throw new Error({ message: "error while adding post null", status: 408 });
    else if (!response.ok)
      throw new Error({
        message: "error while adding post not ok",
        status: 408,
      });

    const data = await response.json();
    const newResponse = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/posts.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      }
    );

    if (newResponse === null)
      throw new Error({
        message: "error while adding post to general posts null",
        status: 408,
      });
    else if (!newResponse.ok)
      throw new Error({
        message: "error while adding post not ok",
        status: 408,
      });
    const newRes = await newResponse.json();
    dispatch(Actions.addPost({ key: newRes?.name, item: post }));
    const text = "new post added ";
    const link = `/posts/${newRes?.name}`;
    dispatch(sendNotification(text, link));
  };
};

export const fetchPosts = () => {
  return async (dispatch) => {
    const response = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/posts.json`
    );
    if (response === null)
      throw new Error({
        message: "error while loading posts null",
        status: 403,
      });
    else if (!response.ok)
      throw new Error({
        message: "error while loading posts not ok",
        status: 407,
      });
    const data = await response.json();
    if (data) {
      const list = Object.keys(data).map((key) => {
        return { key, item: data[key] };
      });
      console.log(list);
      dispatch(Actions.setPosts(list));
      dispatch(Actions.setFetched());
    }
  };
};

export const fetchOwnPosts = (userid) => {
  return async (dispatch, getState) => {
    // const tokens = fetchTokens();
    // const userid = tokens.userid;

    const response = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${userid}/posts.json`
    );

    if (response === null)
      throw new Error({
        message: "error while fetching my own posts null",
        status: 403,
      });
    if (!response.ok)
      throw new Error({
        message: "error while fetching my own posts not ok",
        status: 404,
      });
    console.log(response);
    const data = await response.json();
    console.log("userid from myOwnposts");
    console.log(userid);
    console.log("data myOwnPost");
    console.log(data);

    if (data && Object.keys(data).length > 0) {
      const list = Object.keys(data).map((key) => {
        return { key, item: data[key] };
      });

      dispatch(Actions.setPosts(list));
    }
    dispatch(Actions.setFetched());
  };
};

export const addCommentTodb = (data) => {
  return async (dispatch, getState) => {
    console.log("data passed from addCommentTodb");
    console.log(data);
    console.log(`state paramters`);
    console.log(getState());
    const posts = getState().post.posts;
    console.log("posts");
    console.log(posts);
    const generatePath = (posts, path = "", myKey) => {
      if (Array.isArray(posts))
        for (let key of posts) {
          console.log();
          path += key.key + "/comments/";
          if (key.key === myKey) {
            return path;
          } else {
            if (key.item.hasOwnProperty("comments")) {
              return generatePath(key.item.comments, path, myKey);
            }
          }
        }
      else {
        for (let key in posts) {
          path += key + "/comments/";
          if (key === myKey) return path;
          else {
            if (posts[key].hasOwnProperty("comments")) {
              return generatePath(posts[key].comments, path, myKey);
            }
          }
        }
      }
      return null;
    };
    console.log("generated path");
    console.log(generatePath(posts, "", data.key));
    const response = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/posts/${data.key}/comments.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data?.comment),
      }
    );
    if (response === null)
      throw new Error({
        message: "error while adding comment null",
        status: 407,
      });
    if (!response.ok)
      throw new Error({
        message: "error while adding comment not ok",
        status: 408,
      });
    const myData = await response.json();
    console.log("data return from addCommentTodb");
    console.log(myData);
    const findResponse = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${data.old.userid}/posts.json`
    );

    if (findResponse === null)
      throw new Error({
        message: "error while finding the right post null",
        status: 411,
      });
    if (!findResponse.ok)
      throw new Error({
        message: "error while finding the right post not ok",
        status: 412,
      });
    const findData = await findResponse.json();
    let myKey;
    let userid;
    console.log("findData");
    console.log(findData);
    if (findData) {
      for (let key in findData) {
        if (
          findData[key].text === data.old.text &&
          findData[key].time === data.old.time
        ) {
          myKey = key;
          userid = findData[key].userid;
        }
      }
    }
    console.log("myKey =========");
    console.log(myKey);
    console.log("userid ========");
    console.log(userid);

    const newResponse = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${data.old.userid}/posts/${myKey}/comments.json`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data?.comment),
      }
    );

    if (newResponse === null)
      throw new Error({
        message: "error while adding comment to post users null",
        status: 409,
      });

    if (!newResponse.ok)
      throw new Error({
        message: "error while adding comment to post users not ok",
        status: 410,
      });

    const newData = await newResponse.json();
    console.log("data return from addCommentTodb 2 request");
    console.log(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${data.userOwner}/posts/${data.key}/comments.json`
    );
    console.log(newData);
    let obj = { ...data };
    obj.comment.key = myData.name;
    dispatch(Actions.addComment(obj));
  };
};
