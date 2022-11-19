import { useContext, useRef, useState } from "react";
import AuthContext from "../../store/auth/AuthContext";

import classes from "./AuthForm.module.css";

const firebaseAuthAPIKey = "AIzaSyBEu9KX4CD9qlDQZys5NddOUQJnmrfkr2Y";
const signupAPIUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseAuthAPIKey}`;
const loginAPIUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseAuthAPIKey}`;

async function postAsJSON(url, body = {}) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

const AuthForm = () => {
  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const emailInputRef = useRef(),
    passwordInputRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // maybe empty validation

    (async () => {
      setIsLoading(true);

      let resp;
      if (isLogin) {
        resp = await postAsJSON(loginAPIUrl, {
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        });
      } else {
        resp = await postAsJSON(signupAPIUrl, {
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        });
      }

      const data = await resp.json();

      if (resp.ok) {
        console.log("SUCCESS", data);
        authCtx.login(data.idToken); // idToken identifier used by Firebase
      } else {
        alert(data?.error?.message ?? "Authentication failed");
      }

      setIsLoading(false);
    })();
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button onClick={submitHandler}>
              {isLogin ? "Login" : "Create Account"}
            </button>
          )}
          {isLoading && <p>Loading...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
