import { auth } from "./Firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
};

export const signOut = () => {
  return auth.signOut();
};

