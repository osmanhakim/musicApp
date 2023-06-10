import { createSlice } from "@reduxjs/toolkit";
const initialState = {};
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    firstName: null,
    lastName: null,
    email: null,
    id: null,
    pic: null,
    comments: [],
  },
  reducers: {
    setUser(state, action) {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.id = action.payload.id;
    },
    setProfilepic(state, action) {
      state.pic = action.payload;
    },
    setComment(state, action) {
      state.comments = [...action.payload];
    },
    pushItem(state, action) {
      state.comments.push(action.payload);
    },
    sortList(state) {
      for (let i = 0; i < state.list.length; i++) {
        for (let j = i; j < state.list.length; j++) {
          if (state.list[j].time >= state.list[i].time) {
            let temp = state.list[j];
            state.list[j] = state.list[i];
            state.list[i] = temp;
          }
        }
      }
    },
  },
});

export const actions = profileSlice.actions;
export const reducer = profileSlice.reducer;
