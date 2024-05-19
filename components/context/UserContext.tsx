'use client'
import { useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import React from "react";
import { AuthContext } from "./AuthContext";

// User object, then if still loading
export const UserContext = React.createContext<[User | null, boolean]>([null, true]);

export default function UserProvider({children}){
  const auth = React.useContext(AuthContext);
	const [user, setUser] = useState(auth? auth.currentUser : null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const handleuser = async () => {
      if(!auth) return;
      await auth.authStateReady().then(() => {
        if(auth.currentUser){
          setUser(auth.currentUser);
        }
        setLoading(false);
      });
      onAuthStateChanged(auth, user => {
        setUser(user)
      })
    }
    handleuser();
  }, [auth]);

  return (
    <UserContext.Provider value={[user, loading]}>
      {children}
    </UserContext.Provider>
  );
}