// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOrlGtRCPHfu9YCHRllByRRMJaEMmp6Ow",
  authDomain: "authsetup-54ccf.firebaseapp.com",
  projectId: "authsetup-54ccf",
  storageBucket: "authsetup-54ccf.appspot.com",
  messagingSenderId: "779513814724",
  appId: "1:779513814724:web:88a13b098b37d70948b391",
  measurementId: "G-T34V0GTH28"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

 const auth = getAuth(app);

export {auth} 