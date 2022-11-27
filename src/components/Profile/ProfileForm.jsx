import { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import AuthContext, { firebaseAuthAPIKey } from "../../store/auth/AuthContext";
import { postAsJSON } from "../Auth/AuthForm";
import classes from "./ProfileForm.module.css";

const changePasswordUrl = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${firebaseAuthAPIKey}`;

const ProfileForm = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const passwordInputRef = useRef();

  // add validation

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredNewPassword = passwordInputRef.current.value;

    // maybe empty validation

    (async () => {
      setIsLoading(true);

      let resp = await postAsJSON(changePasswordUrl, {
        idToken: authCtx.token, // for security, and identification
        password: enteredNewPassword,
      });

      const data = await resp.json();

      if (resp.ok) {
        authCtx.login(data.idToken); // idToken identifier used by Firebase
        history.replace("/"); // redirect on successful password change
      } else {
        // handle failure - assuming this never happens
        alert(data?.error?.message ?? "Password change failed");
      }

      setIsLoading(false);
    })();
  };

  return (
    <form className={classes.form}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={passwordInputRef} />
      </div>
      {!isLoading && (
        <div className={classes.action}>
          <button onClick={submitHandler}>Change Password</button>
        </div>
      )}
      {isLoading && <p>Working...</p>}
    </form>
  );
};

export default ProfileForm;
