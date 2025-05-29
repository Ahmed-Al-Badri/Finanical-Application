import app from "./Firebase";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);
const signUpWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};
const loginWithGoogle = () => {
  console.log("AA");
  return signInWithPopup(auth, googleProvider);
};
const logout = () => signOut(auth);

export { loginWithEmail, signUpWithEmail, loginWithGoogle, logout };
export default auth;
