import React from "react";
import { useRouteError } from "react-router-dom";
const Error = () => {
  const data = useRouteError();
  console.log(data);
  return (
    <div
      style={{
        backgroundColor: "black",
        "padding-top": "60px",
        color: "#ddd",
        position: "fixed",
        height: "100%",
        width: "100%",
      }}
    >
      <center>
        <h1>Error status</h1>
        <p>{data?.data?.message}</p>
      </center>
    </div>
  );
};

export default Error;
