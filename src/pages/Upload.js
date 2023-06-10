import React from "react";
import { Form } from "react-router-dom";
import { storage } from "../firebase/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { fetchTokens } from "../utility/helper";
import { async } from "@firebase/util";
import { useDispatch } from "react-redux";
import { Action as ActionUser } from "../store/user";
// import classes from './Uload.module.css';

const Upload = () => {
  const dispatch = useDispatch();
  const tokens = fetchTokens();
  return (
    <div style={{ color: "#ddd", textAlign: "center" }}>
      <p style={{ marginBottom: "15px" }}>Change Profile Picture</p>
      <Form
        method="post"
        action=""
        onSubmit={async (event) => {
          event.preventDefault();
          const file = event.target[0].files[0];
          const data = new FormData();
          const metadata = {
            contentType: "image/jpeg",
          };

          const date = Math.round(Math.random() * 1000);
          const myRef = ref(storage, `pics/${tokens.localId + date}.jpg`);

          const uploadTask = await uploadBytes(myRef, file, metadata);
          console.log(uploadTask);
          if (uploadTask) {
            const response = await fetch(
              `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${tokens.localId}.json`,
              {
                method: "PATCH",
                body: JSON.stringify({
                  profilePicture: `pics/${tokens.localId + date}.jpg`,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            console.log(response);
            if (response.ok) {
              dispatch(
                ActionUser.setProfilePicture({
                  profilePic: `pics/${tokens.localId + date}.jpg`,
                })
              );
              alert("upload success");
            }
          }
          console.log(uploadTask);
        }}
      >
        <input type="file" name="file" />
        <button>upload</button>
      </Form>
    </div>
  );
};

export default Upload;

export const Action = async ({ request }) => {
  const data = await request.formData();
  const myRef = ref(storage, data.get("file"));
  return null;
};
