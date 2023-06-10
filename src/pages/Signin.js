import { Form, json, redirect, useActionData, Link } from "react-router-dom";
import React from "react";
import classes from "./Signup.module.css";
import { firebaseConfig } from "../firebase/firebase";
import { saveTokens } from "../utility/helper";
const Signin = () => {
  const data = useActionData();
  return (
    <div className={classes.signup}>
      <div>
        <h3>Sign in</h3>
        <p>
          You don't have account? <Link to="/signup">Signup</Link>
        </p>
        <Form method="POST" action="">
          <label className={classes.label}>
            <span>Email</span>
            <input type="email" name="email" />
          </label>
          <label className={classes.label}>
            <span>Password</span>
            <input type="password" name="password" />
          </label>
          <button>Login</button>
        </Form>
      </div>
    </div>
  );
};

export default Signin;

export const Action = async ({ request }) => {
  try {
    let data = await request.formData();
    data = Object.fromEntries(data);
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`,
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
    if (!response.ok) {
      throw json(
        { message: "error while login check you pass correct info" },
        { status: 332 }
      );
    }

    const resData = await response.json();
    saveTokens(resData);
    console.log(resData);
    return redirect("/");
  } catch (error) {
    throw json({ message: error.message }, { status: 405 });
  }
};
