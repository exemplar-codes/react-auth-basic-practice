import { useState } from "react";
import AuthContext from "./AuthContext";

function AuthContextProvider(props) {
  const [token, setToken] = useState("");

  const resetToken = () => setToken("");

  const authContextValue = {
    token: token,
    isLoggedIn: token !== "",
    login: setToken,
    logout: resetToken,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
