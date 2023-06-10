import { configureStore } from "@reduxjs/toolkit";
import { playListReducer } from "./playlist.js";
import { userReducer } from "./user";
import { reducer as profileReducer } from "./profile";
import { reducer as PostReducer } from "./Post";
const store = configureStore({
  reducer: {
    playList: playListReducer,
    user: userReducer,
    profile: profileReducer,
    post: PostReducer,
  },
});
export default store;
