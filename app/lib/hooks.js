"use client";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "./firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import { getDefaultAppConfig } from "@firebase/util";

export function useUserData() {
  const [user] = useAuthState(auth);
  console.log(user);
  const [username, setUsername] = useState(null);
  useEffect(() => {
    // let unsubscribe;
    async function getData() {
      if (user) {
        //   const ref = firestore.collection("users").doc(user.uid);
        console.log("uid is", user.uid);
        const ref = doc(firestore, "users", user.uid);

        //   unsubscribe = ref.onSnapshot((doc) => {
        //     setUsername(doc.data()?.username);
        //   });

        const docSnap = await getDoc(ref);
        console.log(docSnap.data());
        console.log("settingUsername to ", docSnap.data().username);
        setUsername(docSnap.data()?.username);
        //when onSnapshot called, returns data and unsubscribes.
      } else {
        console.log("no user found");
        setUsername(null);
      }
    }
    getData();
    // return unsubscribe;
  }, [user]);

  return { user, username };
}
