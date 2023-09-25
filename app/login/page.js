"use client";
import React from "react";
import { signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { useContext, useEffect, useCallback, useState } from "react";
import { UserContext } from "../context/AuthContext";
import { app, auth, googleProvider, firestore } from "../lib/firebase";
import debounce from "lodash.debounce";

import {
  collection,
  doc,
  getDoc,
  setDoc,
  writeBatch,
} from "firebase/firestore";

const LoginPage = () => {
  const { user, username } = useContext(UserContext);

  useEffect(() => {
    console.log(user, "+\n" + username);
  }, [user, username]);
  const signIn = () => {
    signInWithPopup(auth, googleProvider);
  };
  const logOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("signed out");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };
  return (
    <div className="h-screen flex justify-center items-center">
      {user ? (
        !username ? (
          <>
            {" "}
            <UsernameForm />
            <div className="bg-teal-600 rounded-md p-4">
              <button onClick={logOut}>Sign Out</button>
            </div>
          </>
        ) : (
          <div className="bg-teal-600 rounded-md p-4">
            <button onClick={logOut}>Sign Out</button>
          </div>
        )
      ) : (
        <div className="bg-teal-600 rounded-md p-4">
          <button onClick={signIn}>Sign in with Google</button>
        </div>
      )}
    </div>
  );
};

function UsernameForm() {
  const [formValue, setFormValue] = useState(""); // username Formvalue
  const [isValid, setIsValid] = useState(false); // username validity
  const [loading, setLoading] = useState(false); // loading state
  const { user, username } = useContext(UserContext);

  // onchange function
  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  // useEffect to check username/formValue with existing ones in firestore database
  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length > 3) {
        console.log("getting reference to firestore");
        console.log(username);
        const ref = doc(firestore, "usernames", username);

        // const ref = firestore.doc(`usernames/${username}`); // old style
        // created a reference to the username document
        console.log("executing firestore read");
        console.log(ref);
        const usernameDoc = await getDoc(ref);
        console.log("doc" + JSON.stringify(usernameDoc.data()));
        const usernameObj = usernameDoc.data();
        const exists = usernameObj ? true : false;
        console.log("check exists");
        console.log("exists: " + exists);
        // check if it exists, reg.get () returns a promise with a boolean value, we destructure it to exists variable. it also returns a snapshot of the document, but we don't need it.
        console.log("Firestore read executed!");
        setIsValid(!exists); // if username already exists, isValid is false
        setLoading(false);
      }
    }, 500), // debounce time of 500ms to prevent too many reads
    []
  ); // using useCallback to prevent infinite loop of useEffect and checkUsername function calls (because of the dependency array). useCallback returns a memoized version of the callback that only changes if one of the dependencies has changed. it is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders (e.g. shouldComponentUpdate).

  // form submit function
  const onSubmit = async (e) => {
    e.preventDefault();

    // create refs for both documents
    // const userDoc = firestore.doc(`users/${user.uid}`);
    const batch = writeBatch(firestore);

    // Set the value of 'NYC'
    const userDoc = doc(firestore, "users", user.uid);
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    // const usernameDoc = firestore.doc(`usernames/${formValue}`);
    const usernameDoc = doc(firestore, "usernames", formValue);
    batch.set(usernameDoc, { uid: user.uid });

    // Commit the batch
    await batch.commit();
    // const batch = firestore.batch();
    // first the ref to the doc, the doc object data
  };

  return (
    !username && (
      <section id="userForm">
        <h2>You must register to the site first.</h2>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input name="username" value={formValue} onChange={onChange} />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking... {username}</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}

export default LoginPage;
