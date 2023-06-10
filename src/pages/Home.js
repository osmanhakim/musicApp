import {
  defer,
  useLoaderData,
  Await,
  json,
  useNavigate,
} from "react-router-dom";
import React, { Suspense } from "react";
import Playlist from "../components/Playlist";
import "../tailwind.css";
import { useSelector } from "react-redux";

const Home = () => {
  const navigate = useNavigate();
  const data = useLoaderData();
  if (data?.status === 404) {
  }
  console.log("from LoaderData");
  console.log(data);
  const colors = [
    "#476A8A",
    "#A69984",
    "#9E738E",
    "#0D4045",
    "#A67894",
    "#5547A5",
  ];
  let colorIndex = 0;
  const getNextColor = () => {
    if (colorIndex >= colors.length) colorIndex = 0;
    let selected = colors[colorIndex];
    colorIndex++;
    return selected;
  };
  return (
    <div>
      <Suspense fallback={<p>Loading Albums</p>}>
        <Await
          resolve={data?.albums}
          errorElement={
            <div style={{ color: "#ddd" }}> Could not load albums 😬</div>
          }
        >
          {(albums) => {
            console.log("from Await");
            //  console.log(albums);
            if (albums !== null || albums !== undefined) {
              console.log("from Await");
              //       console.log(albums);
              return (
                <div className="flex items-center gap-4 flex-wrap">
                  {Object.keys(albums).map((item) => {
                    return (
                      <Playlist
                        key={item}
                        item={albums[item]}
                        title={item}
                        color={getNextColor()}
                      />
                    );
                  })}
                </div>
              );
            }
          }}
        </Await>
      </Suspense>
    </div>
  );
};

export default Home;

const LoaderFunc = async () => {
  //      "https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/albums.json"

  const response = await fetch(
    "https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/albums.json"
  );
  if (response === null) {
    throw json({ message: "can't fetch from server error" }, { status: 403 });
  } else if (response.ok) {
    const data = await response.json();
    console.log("from Loader Func");
    console.log(data);
    return data;
  } else {
    throw json({ message: "can/t access the server " }, { status: 404 });
  }
  // } catch (error) {
  //   throw json({ message: "server Down" }, { status: 405 });
  // }
};

export const Loader = async () => {
  return defer({
    albums: LoaderFunc(),
  });
};
