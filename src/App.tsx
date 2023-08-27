import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { BrowserRouter, Routes, Route  } from "react-router-dom"
import { createContext, useState, useEffect } from "react";
import { auth } from "./services/Firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Room } from "./pages/Room";

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

type User = {
  id: string;
  name: string;
  avatar: string;
}

export const AuthContext = createContext({} as AuthContextType); 

function App() {
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
    <BrowserRouter>
      <AuthContext.Provider value={{ user, signInWithGoogle }}>
        <Routes> 
          <Route path="/" Component={ Home }></Route>
          <Route path="/rooms/new" Component={ NewRoom }></Route>
          <Route path="/rooms/:id" Component={ Room }></Route>
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
