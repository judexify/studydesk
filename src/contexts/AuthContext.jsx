import { useEffect, useReducer } from "react";
import { AuthContext } from "./AuthContext";
import { supabase } from "../lib/supabase.js";

// const FAKE_USER = {
//   name: "Jude",
//   email: "jack@example.com",
//   password: "judex",
//   avatar: "https://i.pravatar.cc/100?u=zz",
// };

const initialState = {
  currentLoggedInUser: null,
  isAuthenticated: false,
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        currentLoggedInUser: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case "logout":
      return {
        ...state,
        currentLoggedInUser: null,
        isAuthenticated: false,
        loading: false,
      };
    case "loaded":
      return { ...state, loading: false };
    default:
      throw new Error("Unknown Action");
  }
}

const AuthProvider = function ({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentLoggedInUser, isAuthenticated } = state;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) dispatch({ type: "login", payload: session.user });
      else dispatch({ type: "loaded" });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) dispatch({ type: "login", payload: session.user });
      else dispatch({ type: "logout" });
    });

    return () => subscription.unsubscribe();
  }, []);

  async function Login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  async function Logout() {
    await supabase.auth.signOut();
    localStorage.removeItem("level");
  }

  if (state.loading) return null;

  return (
    <AuthContext.Provider
      value={{
        currentLoggedInUser,
        isAuthenticated,
        Login,
        Logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
