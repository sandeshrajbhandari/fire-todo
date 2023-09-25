import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKKFGeK7P0PtZ-h9Nk_KZ5fHvlKADlEyA",
  authDomain: "fire-todo-2042f.firebaseapp.com",
  projectId: "fire-todo-2042f",
  storageBucket: "fire-todo-2042f.appspot.com",
  messagingSenderId: "596747076152",
  appId: "1:596747076152:web:6cd1425744a6e046315ccd",
};
export const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
export const firestore = getFirestore(app);
