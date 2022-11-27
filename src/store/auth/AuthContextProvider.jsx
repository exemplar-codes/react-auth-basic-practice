import { useState } from "react";
import AuthContext from "./AuthContext";

// assuming duration is in seconds
function calculateFutureDateTime(duration) {
  return new Date(Date.now() + 1000 * duration);
}

function AuthContextProvider(props) {
  const storedToken = localStorage.getItem("auth-token") ?? ""; // run once - login, logout or automatic token change

  if (storedToken) {
    // check if token has expired on visit
    const storedExpiryDateTime = new Date(
      localStorage.getItem("auth-token-expiry")
    );
    const currentDateTime = new Date();

    if (storedExpiryDateTime < currentDateTime) logoutHandler();
  }

  const [token, setToken] = useState(storedToken);

  const resetToken = () => setToken("");

  const loginHandler = (token, expiryDuration = 5) => {
    localStorage.setItem("auth-token", token);
    localStorage.setItem(
      "auth-token-expiry",
      calculateFutureDateTime(expiryDuration).toString()
    );
    setToken(token);
  };

  const logoutHandler = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-token-expiry");
    resetToken();
  };

  const authContextValue = {
    token: token,
    isLoggedIn: token !== "",
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
