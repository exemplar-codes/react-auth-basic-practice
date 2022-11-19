import React from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false, // derived, token !== ""
  setToken: (token) => {},
  resetToken: () => {},
});

export default AuthContext;
