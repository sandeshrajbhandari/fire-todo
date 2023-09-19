import {
  collection,
  addDoc,
  getDocs,
  getFirestore,
  query,
} from "firebase/firestore";
import { app } from "./firebase";
const db = getFirestore(app);
export async function addTodoFire(todoObj) {
  //   const db = getFirestore(app);
  // todoObj eg. {todo-name : "learn next.js", done: true}
  try {
    const docRef = await addDoc(collection(db, "todo-global"), todoObj);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function getTodoFire() {
  const querySnapshot = await getDocs(collection(db, "todo-global"));
  const todoArr = [];
  querySnapshot.forEach((doc) => {
    todoArr.push({
      uid: doc.id,
      todoName: doc.data().todoName,
      done: doc.data().done,
    });
  });
  return todoArr;
}
