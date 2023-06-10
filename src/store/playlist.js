import { createSlice } from "@reduxjs/toolkit";
import { storage } from "../firebase/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { async } from "@firebase/util";
const myState = {
  song: {},
  playlist: [],
  index: 0,
};
const playlistSlice = createSlice({
  name: "playlist",
  initialState: myState,
  reducers: {
    setSong(state, action) {
      state.song = action.payload;
    },
    addSong(state, action) {
      state.playlist.push(action.payload);
    },
    setPlayList(state, action) {
      state.playlist = action.payload;
      state.index = 0;
      state.song = state.playlist[state.index];
    },
    nextSong(state) {
      if (state.index >= state.playlist.length) {
        state.index = 0;
      }
      state.song = state.playlist[state.index];
      state.index++;
    },
    prevSong(state) {
      if (state.index < 0) state.index = state.playlist.length - 1;
      else {
        state.song = state.playlist[state.index];
        state.index--;
      }
    },
  },
});
export const createSong = (item) => {
  return async (dispatch) => {
    const pathRef = ref(storage, item?.url);
    const download = await getDownloadURL(pathRef);
    const obj = { ...item, url: download };
    dispatch(playListActions.setSong(obj));
  };
};
export const createPlayList = (item) => {
  return async (dispatch) => {
    let arr = [];
    arr = await Promise.all(
      item?.tracks?.map(async (val) => {
        const pathRef = ref(storage, val?.url);
        const download = await getDownloadURL(pathRef);
        return { ...val, url: download };
      })
    );
    console.log("from createPlayList func");
    console.log(arr);
    dispatch(playListActions.setPlayList(arr));
  };
};
export const playListReducer = playlistSlice.reducer;
export const playListActions = playlistSlice.actions;
