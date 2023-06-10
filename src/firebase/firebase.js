// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyC33DFDJt5owqhkvb_HGirdgPoVTjtjb9o",
  authDomain: "playcloud-e108c.firebaseapp.com",
  projectId: "playcloud-e108c",
  storageBucket: "playcloud-e108c.appspot.com",
  messagingSenderId: "35006660849",
  appId: "1:35006660849:web:f937a64854498357386950",
  measurementId: "G-KGPF4HRPP3",
  databaseURL:
    "https://playcloud-e108c-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const storage = getStorage(app);
export const db = getDatabase();
