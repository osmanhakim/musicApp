import { json } from "react-router-dom";

export const saveTokens = (resData) => {
  localStorage.setItem("idToken", resData.idToken);
  localStorage.setItem("localId", resData.localId);
  //let date = new Date();
  let newDate = new Date(
    parseInt(resData.expiresIn) * 1000 + new Date().getTime()
  );
  console.log(newDate.getTime().toString());
  localStorage.setItem("expiresIn", newDate.getTime().toString());
};

export const fetchTokens = () => {
  let obj = {};
  obj.idToken = localStorage.getItem("idToken");
  obj.localId = localStorage.getItem("localId");
  obj.expiresIn = localStorage.getItem("expiresIn");
  return obj;
};

export const logout = () => {
  localStorage.removeItem("idToken");
  localStorage.removeItem("localId");
  localStorage.removeItem("expiresIn");
};

export const fetchUserData = async (id) => {
  try {
    const response = await fetch(
      `https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app/users/${id}.json`
    );
    if (response.ok) {
      console.log(response);
      const resData = await response.json();
      console.log(resData);
      return resData;
    }
  } catch (error) {
    throw json({ message: error.message, status: 402 });
  }
  return false;
};
