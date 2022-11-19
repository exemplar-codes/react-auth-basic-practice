import React from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false, // derived, token !== ""
  login: (token) => {},
  logout: () => {},
});

export default AuthContext;
