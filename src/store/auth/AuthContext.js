import React from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false, // derived, token !== ""
  login: (token) => {},
  logout: () => {},
});

export default AuthContext;

// for global storage
export const firebaseAuthAPIKey = "AIzaSyBEu9KX4CD9qlDQZys5NddOUQJnmrfkr2Y";
