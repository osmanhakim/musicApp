import React from "react";
import { redirect } from "react-router-dom";
import { logout } from "../utility/helper";

const Logout = () => {
  return <div></div>;
};

export const Loader = () => {
  logout();
  return redirect("/");
};
export default Logout;
