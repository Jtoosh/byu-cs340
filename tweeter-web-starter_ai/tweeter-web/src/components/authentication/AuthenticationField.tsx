interface Props {
  keyDownListener : React.KeyboardEventHandler
  aliasHook : React.Dispatch<React.SetStateAction<string>>
  passwordHook: React.Dispatch<React.SetStateAction<string>>
}

const AuthenticationField = (props:Props) => {
  
  return (
    <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="aliasInput"
            aria-label="alias"
            placeholder="name@example.com"
            onKeyDown={props.keyDownListener}
            onChange={(event) => props.aliasHook(event.target.value)}
          />
          <label htmlFor="aliasInput">Alias</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control bottom"
            id="passwordInput"
            aria-label="password"
            placeholder="Password"
            onKeyDown={props.keyDownListener}
            onChange={(event) => props.passwordHook(event.target.value)}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>
      </>
  )
}

export default AuthenticationField;