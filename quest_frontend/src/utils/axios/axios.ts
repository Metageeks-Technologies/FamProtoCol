// import axios from "axios";
// import { auth } from "@/utils/firebaseConfig";
// import { onAuthStateChanged } from "firebase/auth";

// const getToken = () => {
//   return new Promise((resolve, reject) => {
//     onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           const userDataFirebase = await user.getIdTokenResult();
//           console.log("User is signed in, token:", userDataFirebase);
//           resolve(userDataFirebase.token);
//         } catch (error) {
//           console.error("Error getting token:", error);
//           reject(error);
//         }
//       } else {
//         console.log("No user is signed in.");
//         resolve("");
//       }
//     });
//   });
// };

// const instance = axios.create({
//   baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1`,
//   withCredentials: true,
// });

// instance.interceptors.request.use(
//   async (config) => {
//     const idToken = await getToken();
//     console.log("idToken", idToken);
//     config.headers.Authorization = `Bearer ${idToken}`;
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default instance;
