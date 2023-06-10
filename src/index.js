import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Index, { Loader as LoaderIndex } from "./pages/Index";
import Home, { Loader as LoaderHome } from "./pages/Home";
import { Provider } from "react-redux";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Search, { Loader as loaderSearch } from "./pages/Search";
import store from "./store/store";
import Error from "./pages/Error";
import Signup, { Action as ActionSignup } from "./pages/Signup";
import Signin, { Action as ActionSignin } from "./pages/Signin";
import Logout, { Loader as LoaderLogout } from "./pages/Logout";
import Upload, { Action as ActionUpload } from "./pages/Upload";
import Playlists, { Actions as ActionPlaylists } from "./pages/Playlists";
import Posts from "./pages/Posts";
import Following from "./pages/Following";
import Followers from "./pages/Followers";
import PostDetail from "./pages/PostDetail";
import {
  Action as ActionUserPlayList,
  UserPlayList,
  Loader as LoaderUserPlayList,
} from "./components/UserPlayList";
import PlaylistFirebase, {
  Loader as LoaderPlaylistFirebase,
  Action as ActionPlaylistFirebase,
} from "./pages/PlaylistFirebase";

import Tracks, { Loader as LoaderTracks } from "./pages/Tracks";
import Details, { Action as ActionDetails } from "./pages/Details";
import Profile, { Loader as LoaderProfile } from "./pages/Profile";

const root = ReactDOM.createRoot(document.getElementById("root"));
const router = createBrowserRouter([
  {
    path: "",
    element: <Index />,
    errorElement: <Error />,
    loader: LoaderIndex,
    children: [
      { path: "", element: <Home />, loader: LoaderHome },
      { path: "upload", element: <Upload />, action: ActionUpload },
      { path: "tracks", element: <Tracks />, loader: LoaderTracks },
      { path: ":word", element: <Search />, loader: loaderSearch },
      {
        path: "playlist/:word",
        element: <PlaylistFirebase />,
        loader: LoaderPlaylistFirebase,
        action: ActionPlaylistFirebase,
      },
      {
        path: "playlists/:word",
        element: <Playlists />,
        action: ActionPlaylists,
      },
      {
        path: "details/:word",
        element: <Details />,
        action: ActionDetails,
      },
      {
        path: "profile/:id",
        element: <Profile />,
        loader: LoaderProfile,
      },
      {
        path: "posts",
        element: <Posts />,
      },
      {
        path: "following",
        element: <Following />,
      },
      {
        path: "followers",
        element: <Followers />,
      },
      {
        path: "posts/:id",
        element: <PostDetail />,
      },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
    action: ActionSignup,
    errorElement: <Error />,
  },
  {
    path: "/signin",
    element: <Signin />,
    action: ActionSignin,
    errorElement: <Error />,
  },
  {
    path: "/logout",
    element: <Logout />,
    loader: LoaderLogout,
  },

  {
    path: "/playlist",
    action: ActionUserPlayList,
    loader: LoaderUserPlayList,
    children: [],
  },
]);
root.render(
  <Provider store={store}>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
