import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../services/Firebase";

type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}
  
type User = {
    id: String;
    name: String;
    avatar: String;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType); 

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user) {
        const {displayName, photoURL, uid} = user;

        if(!displayName || !photoURL) {
          throw new Error("Missing information");
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    });

    return () => {
      unsubscribe();
    }
  }, [])

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    if(result.user) {
      const {displayName, photoURL, uid} = result.user;

      if(!displayName || !photoURL) {
        throw new Error("Missing information");
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    };
  }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}></AuthContext.Provider>
    );
}