import { useState } from "react";
import { ToastType } from "../toaster/Toast";

const AuthenticationField = () => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  
  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const doLogin = async () => {
    try {
      setIsLoading(true);

      const [user, authToken] = await login(alias, password);

      updateUserInfo(user, user, authToken, rememberMe);

      if (!!props.originalUrl) {
        navigate(props.originalUrl);
      } else {
        navigate(`/feed/${user.alias}`);
      }
    } catch (error) {
      displayToast(
        ToastType.Error,
        `Failed to log user in because of exception: ${error}`,
        0
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  return (
    <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="aliasInput"
            placeholder="name@example.com"
            onKeyDown={loginOnEnter}
            onChange={(event) => setAlias(event.target.value)}
          />
          <label htmlFor="aliasInput">Alias</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control bottom"
            id="passwordInput"
            placeholder="Password"
            onKeyDown={loginOnEnter}
            onChange={(event) => setPassword(event.target.value)}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>
      </>
  )
}