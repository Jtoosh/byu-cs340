import { useState } from "react";
import { ToastType } from "../toaster/Toast";

interface Props {
  keyDownListener : React.KeyboardEventHandler
}

const AuthenticationField = (props:Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  


  return (
    <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="aliasInput"
            placeholder="name@example.com"
            onKeyDown={props.keyDownListener}
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
            onKeyDown={props.keyDownListener}
            onChange={(event) => setPassword(event.target.value)}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>
      </>
  )
}

export default AuthenticationField;