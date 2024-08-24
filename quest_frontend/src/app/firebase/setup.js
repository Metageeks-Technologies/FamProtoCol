// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC90Ibx0vHSCN90Q6FRGpwB5DK3ntQpCz4",
  authDomain: "quest-65408.firebaseapp.com",
  projectId: "quest-65408",
  storageBucket: "quest-65408.appspot.com",
  messagingSenderId: "996605950272",
  appId: "1:996605950272:web:5ebb2ccfa3d531228362a5",
  measurementId: "G-ECXQ79VTPE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics( app );
export const auth = getAuth(app)