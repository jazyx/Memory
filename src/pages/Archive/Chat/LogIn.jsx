/**
 * Project/frontend/src/components/LogIn.jsx
 */



export const LogIn = ({ userName, setUserName, logIn }) => {
  const checkForEnter = event => {
    const { key } = event
    if (key === "Enter") {
      event.preventDefault()
      logIn()
    }
  }


  const updateName = ({ target }) => {
    setUserName(target.value)
  }


  return (
    <div
      id="log-in"   
    >
      <label>
        <span>Username:</span>
        <input
          type="text"
          value={userName}
          onKeyDown={checkForEnter}
          onChange={updateName}
          autoFocus={true}
        />
      </label>
      <button
        onClick={logIn}
      >
        Register/Log In
      </button>
    </div>
  )
}