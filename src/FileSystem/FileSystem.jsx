import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import app from "../Firebase";

class UserData_ {
  constructor() {
    this.Userref = null;
    this.UserSnap = null;
    this.SnapData = null;
    //this.Userref = null;
  }
}
const UserData = new UserData_();
export { UserData };

export default async function SetUpUser() {
  let user = await getAuth().currentUser;
  let db = await getFirestore();
  //let db2 = await getFirestore(app);
  let userref = doc(db, "users", user.uid);
  try {
    let s = await collection(db, "users");
    let ss = await getDocs(s);
    ss.docs.map((res) => {
      ////console.log(res.data());
    });
  } catch (error) {
    //console.log(error);
  }
  //console.log(userref.id);
  let usersnap = await getDoc(userref);
  //console.log(usersnap);
  if (!usersnap.exists()) {
    await setDoc(userref, {
      name: user.displayName,
      email: user.email,
      userID: user.uid,
      isAdmin: false,
      viewID: user.uid,
      Lock: false,
      theme: "Basic",
      Goals: {
        current: 0,
        Goals: [], //Goal
      },
    });
    usersnap = await getDoc(userref);
  } else {
    //console.log(usersnap.data());
    //console.log("display");
  }

  UserData.Userref = userref;
  UserData.UserSnap = usersnap;
  UserData.SnapData = usersnap.data();

  return await userref;
}

/*
    Goal = {
    title: string,
    description: string,
    created: string,
    finsh_by: string,
    id: current++,
    }
    let s = await collection(db, "users");
  let ss = await getDocs(s);
  //console.log(ss.data());

  match /users {
    	allow read, write: if request.auth != null && (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == false || true);
    }
*/
