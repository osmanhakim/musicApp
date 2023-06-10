import React from "react";
import classes from "./Signup.module.css";
import { Form, json, redirect, useActionData, Link } from "react-router-dom";
import { firebaseConfig } from "../firebase/firebase";
import { saveTokens } from "../utility/helper";
const Signup = () => {
  const data = useActionData();
  console.log(data);
  return (
    <div className={classes.signup}>
      <div>
        <h3>Create New Account</h3>
        <p>
          Already A Member ?<Link to="/signin"> Log in</Link>
        </p>
        {data && data.error && <p>{data.message}</p>}
        <Form method="post" action="">
          <div>
            <label>
              <span>First Name</span>
              <input type="text" name="firstName" />
            </label>
            <label>
              <span>Last Name</span>
              <input type="text" name="lastName" />
            </label>
          </div>
          <label className={classes.label}>
            <span>Email</span>
            <input type="email" name="email" />
          </label>
          <label className={classes.label}>
            <span>Password</span>
            <input type="password" name="password" />
          </label>
          <button>Create Account</button>
        </Form>
      </div>
    </div>
  );
};

const createUser = async (uid, obj) => {
  try {
    const newObj = {
      firstName: obj.firstName,
      lastName: obj.lastName,
      email: obj.email,
      profilePicture: "pics/download.png",
      notification: [],
      playlist: null,
    };

    const response = await fetch(
      "https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/" +
        uid +
        ".json",
      {
        method: "PUT",
        body: JSON.stringify(newObj),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // newObj.notification.push({
    //   msg: "welcome to our website hope you enjoy",
    //   open: false,
    // });
    console.log(response);
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      console.log("before creating notification");
      // const newResponse = await fetch(
      //   `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}/notification.json`,
      //   {
      //     method: "POST",
      //     body: JSON.stringify({
      //       msg: "welcome to our website hope you enjoy",
      //       open: false,
      //     }),
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      // console.log("notification");
      // console.log(response);
      // if (newResponse.ok) {
      //   const newData = await newResponse.json();
      //   console.log(newData);
      //   return true;
      // }
    }
  } catch (error) {
    throw json({ message: error.message }, { status: 300 });
  }
};
export default Signup;
const checkInput = (input) => {
  if (!input.firstName || input.firstName.length < 4) return false;
  else if (!input.lastName || input.lastName.length < 4) return false;
  else if (!input.email || !input.email.includes("@") || input.email.length < 8)
    return false;
  else if (!input.password || input.password.length < 8) return false;
  return true;
};
export const Action = async ({ request }) => {
  let data = await request.formData();
  data = Object.fromEntries(data);
  console.log(data);
  if (!checkInput(data))
    return { error: true, message: "check your inputs is valid " };
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        returnSecureToken: true,
      }),
    }
  );
  console.log(response);
  if (response.ok) {
    const res = await response.json();
    console.log("important");
    console.log(res);
    const ret = await createUser(res.localId, data);
    if (!ret)
      throw json(
        { message: "error while trying to initial the user" },
        { status: 406 }
      );
    saveTokens(res);
    return redirect("/");
  } else {
    throw json(
      { message: "error while trying to sign up try again later" },
      { status: 405 }
    );
  }
};
