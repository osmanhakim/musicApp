import { async } from "@firebase/util";
import { createSlice } from "@reduxjs/toolkit";
import { fetchTokens } from "../utility/helper";

const userSlice = createSlice({
  name: "user",
  initialState: {
    idToken: null,
    localId: null,
    expiresIn: 0,
    refreshToken: 0,
    firstName: null,
    lastName: null,
    email: null,
    profilePic: null,
    followers: {},
    following: {},
    showNotification: false,
    notification: {},
    fetchedFollowing: false,
    fetchedFollowers: false,
  },
  reducers: {
    updateRead(state, action) {
      // payload => {key,userid}
      state.notification[action.payload.key].read = true;
    },
    toggleNotification(state) {
      state.showNotification = !state.showNotification;
    },
    setNotification(state, action) {
      state.notification = { ...action.payload };
    },
    setFetchedFollowers(state) {
      state.fetchedFollowers = true;
    },
    setFetchedFollowing(state) {
      state.fetchedFollowing = true;
    },
    closeFetchedFollowers(state) {
      state.fetchedFollowers = false;
    },
    closeFetchedFollowing(state) {
      state.fetchedFollowing = false;
    },
    setProfilePicture(state, action) {
      state.profilePic = action.payload.profilePic;
    },
    setDetails(state, action) {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.profilePic = action.payload.profilePic;
    },
    setToken(state, action) {
      state.idToken = action.payload.idToken;
      state.localId = action.payload.localId;
      state.refreshToken = action.payload.refreshToken;
      state.expiresIn = action.payload.expiresIn;
    },
    logout(state) {
      state.idToken = null;
      state.localId = null;
      state.refreshToken = null;
      state.expiresIn = null;
      state.firstName = null;
      state.email = null;
      state.profilePic = null;
    },
    setFollowers(state, action) {
      state.followers = { ...action.payload };
    },
    setFollowing(state, action) {
      state.following = { ...action.payload };
    },
    addFollowing(state, action) {
      // { }
      state.following[action.payload.userid] = {
        id: action.payload.id,
        time: action.payload.time,
      };
    },
    addFollowers(state, action) {
      state.followers[action.payload.myuserid] = {
        id: action.payload.id,
        time: action.payload.time,
        userid: action.payload.userid,
      };
    },
    delFollowing(state, action) {
      // payload userid
      state.following[action.payload] = null;
    },
    delFollowers(state, action) {
      // payload userid
      state.followers[action.payload] = null;
    },
  },
});

export const userReducer = userSlice.reducer;
export const Action = userSlice.actions;
export const sendNotification = (text, link) => {
  return async (dispatch, getState) => {
    const tokens = fetchTokens();
    const userid = tokens.localId;
    const followers = getState().user.followers;
    console.log("followers");
    console.log(followers);
    for (let key in followers) {
      const time = Date.now();
      const obj = { userid, text, link, time, read: false };
      console.log("key from send Notification ============");
      console.log(key);
      const response = await fetch(
        `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${key}/notification.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        }
      );
      if (response === null)
        throw new Error({
          message: "error while sending notification null",
          status: 403,
        });
      if (!response.ok)
        throw new Error({
          message: "error while sending notification not ok",
          status: 404,
        });

      const data = await response.json();
    }
  };
};

export const fetchNotification = () => {
  return async (dispatch, getState) => {
    const tokens = fetchTokens();
    const userid = tokens.localId;
    const list = [];
    const response = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${userid}/notification.json`
    );

    if (response === null)
      throw new Error({
        message: "error while fetching notification null",
        status: 403,
      });
    if (!response.ok)
      throw new Error({
        message: "error while fetching notification not ok",
        status: 404,
      });
    const data = await response.json();

    // for (let key in data) {
    //   list.push(data[key]);
    // }

    console.log("notification obj =====>");
    console.log(data);
    dispatch(Action.setNotification(data));
    //  else console.log("notification list is empty ========>");
  };
};

export const setNotificationRead = (key, userid) => {
  return async (dispatch, getState) => {
    console.log(key + " " + userid);
    const response = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${userid}/notification/${key}.json`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }),
      }
    );
    console.log("my response == ==== = = = ");
    console.log(response);

    if (response === null)
      throw new Error({
        message: "error while updating read state null",
        status: 403,
      });
    if (!response.ok)
      throw new Error({
        message: "error while updating read state not ok",
        status: 404,
      });
    const data = await response.json();
    console.log(data);

    dispatch(Action.updateRead({ key, userid }));
  };
};
export const fetchF = () => {
  return async (dispatch, getState) => {
    const tokens = fetchTokens();
    const userid = tokens.localId;
    console.log(userid);
    const response = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${userid}/followers.json`
    );
    if (response === null)
      throw new Error({
        message: "error while fetching followers list null",
        state: 402,
      });
    if (!response.ok)
      throw new Error({
        message: `error while fetching followers list not ok`,
        status: 403,
      });
    const dataFollowers = await response.json();
    // const listOfFollowers = Object.values(dataFollowers);
    // const listOfFollewrs = [];
    // for (let key in dataFollowers) {
    //   const obj = { ...dataFollowers[key], id: key };
    //   listOfFollewrs.push(obj);
    // }
    const Followers = {};
    for (let key in dataFollowers) {
      const userid = dataFollowers[key].userid;

      const obj = { id: key, time: dataFollowers[key].time };
      Followers[userid] = obj;
    }
    dispatch(Action.setFollowers(Followers));
    // fetching list of following
    const newResponse = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${userid}/following.json`
    );
    if (newResponse === null)
      throw new Error({
        message: "error while fetching following list null",
        state: 404,
      });
    if (!newResponse.ok)
      throw new Error({
        message: `error while fetching following list not ok`,
        status: 405,
      });

    // adding id to object then push it to

    const dataFollowing = await newResponse.json();
    // const listOfFollowing = Object.values(dataFollowing);
    // const listOfFollowing = [];
    // for (let key in dataFollowing) {
    //   const obj = { ...dataFollowing[key], id: key };
    //   listOfFollowing.push(obj);
    // }

    const Following = {};
    for (let key in dataFollowing) {
      const userid = dataFollowing[key].userid;
      console.log("id of for loop");
      console.log(userid);
      const obj = { id: key, time: dataFollowing[key].time };
      Following[userid] = obj;
    }
    console.log("following from fetchF");
    console.log(Object.keys(Following));
    dispatch(Action.setFollowing(Following));
    // dispatch(Action.setFetchedFollowing());
    // dispatch(Action.setFetchedFollowers());
  };
};

export const delFollowingTodb = (userid) => {
  return async (dispatch, getState) => {
    const tokens = fetchTokens();
    const myUserid = tokens.localId;
    const userFollowing = getState().user.following[userid]; // userid of someone i wanna delete
    //const userFollowers = getState().user.Followers[userid];
    const response = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${myUserid}/following/${userFollowing.id}.json`,
      {
        method: "Delete",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response === null)
      throw new Error({
        message: "error while deleteing following null",
        status: 403,
      });
    if (!response.ok)
      throw new Error({
        message: "error while deleteing following not ok",
        status: 404,
      });

    const secondResponse = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${userid}/followers.json`
    );
    if (secondResponse === null)
      throw new Error({
        message: "error while deleting following 2 null",
        status: 404,
      });

    if (!secondResponse.ok)
      throw new Error({
        message: "error while deleting following 2 not ok",
        status: 405,
      });

    const secondData = await secondResponse.json();
    let found;
    for (let key in secondData) {
      if (secondData[key].userid === myUserid) found = key;
      break;
    }
    console.log("found in del following ~~~~~~~~~~~~");
    console.log(found);

    const data = await response.json();
    const newResponse = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${userid}/followers/${found}.json`,
      {
        method: "Delete",
        headers: {
          "Content-Type": "Application/json",
        },
      }
    );
    dispatch(Action.delFollowing(userid));
    // dispatch(Action.setFetchedFollowing());
    // dispatch(Action.setFetchedFollowers());
  };
};

export const delFollowersTodb = (userid) => {
  return async (dispatch, getState) => {
    const tokens = fetchTokens();
    const myUserid = tokens.localId;
    const userFollowers = getState().user.followers[userid];
    const response = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${myUserid}/followers/${userFollowers.id}.json`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const secondResponse = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${userid}/following.json`
    );

    if (secondResponse === null)
      throw new Error({
        message: "error while deleteing followers 2 null",
        status: 406,
      });
    if (!secondResponse.ok)
      throw new Error({
        message: "error while deleteing followers 2 not ok",
        status: 406,
      });

    const secondData = await secondResponse.json();
    let found;
    for (let key in secondData) {
      if ((secondData[key].userid = myUserid)) found = key;
    }

    console.log(`found  del followers ~~~~~~~~`);
    console.log(found);
    const newResponse = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${userid}/following/${found}.json`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      }
    );
    if (response === null)
      throw new Error({
        message: "error while deleting followers null",
        status: 403,
      });
    if (!response.ok)
      throw new Error({
        message: "error while deleting followers not ok",
        status: 404,
      });
    const data = await response.json();

    dispatch(Action.delFollowers(userid));
  };
};

export const addFollowingTodb = (user) => {
  // { id , userid , time}
  return async (dispatch, getState) => {
    const tokens = fetchTokens();
    const userid = tokens.localId;
    const response = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${userid}/following.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );

    if (response === null)
      throw new Error({
        message: "error while adding follow to db null",
        status: 400,
      });
    if (!response.ok)
      throw new Error({
        message: "error while adding follow to db not ok",
        status: 401,
      });
    const data = await response.json();
    const newobj = {};
    newobj["userid"] = userid;
    newobj["time"] = Date.now();
    const newResponse = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${user.userid}/followers.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newobj),
      }
    );
    if (newResponse === null)
      throw new Error({
        message: "error while adding followers to db null",
        status: 406,
      });

    if (!newResponse.ok)
      throw new Error({
        message: "error while adding followers to db not ok",
        status: 407,
      });

    const newData = await newResponse.json();
    if (data && newData) {
      dispatch(
        Action.addFollowing({
          ...user,
          id: data.name,
        })
      );
      dispatch(
        Action.addFollowers({
          id: newData.name,
          myuserid: user.userid,
          userid: userid,
          time: newobj["time"],
        })
      );
    }
  };
};
