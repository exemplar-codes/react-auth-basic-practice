import { useState } from "react";
import AuthContext from "./AuthContext";

// assuming duration is in seconds
function calculateFutureDateTime(duration) {
  return new Date(Date.now() + 1000 * duration);
}

function AuthContextProvider(props) {
  const storedToken = localStorage.getItem("auth-token") ?? ""; // run once - login, logout or automatic token change

  const [token, setToken] = useState(storedToken);

  const [, setAutoLogoutTimer] = useState(null);

  const resetToken = () => setToken("");

  const logoutHandler = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-token-expiry");
    resetToken();

    setAutoLogoutTimer((existingTimer) => {
      window.clearTimeout(existingTimer);

      return null;
    });
  };

  const loginHandler = (token, expiryDuration) => {
    localStorage.setItem("auth-token", token);
    setToken(token);

    if (expiryDuration) {
      expiryDuration = Number(expiryDuration);
      localStorage.setItem(
        "auth-token-expiry",
        calculateFutureDateTime(expiryDuration).toString()
      );
      setAutoLogoutTimer((existingTimer) => {
        window.clearTimeout(existingTimer);

        return window.setTimeout(() => {
          logoutHandler();
        }, 1000 * expiryDuration);
      });
    }
  };

  if (storedToken) {
    // check if token has expired on visit
    const storedTokenExpiryDateTime =
      localStorage.getItem("auth-token-expiry") ?? null;

    if (storedTokenExpiryDateTime) {
      const storedExpiryDateTime = new Date(storedTokenExpiryDateTime);
      const currentDateTime = new Date();

      if (storedExpiryDateTime < currentDateTime) logoutHandler();
    }
  }

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
