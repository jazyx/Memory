/**
 * frontend/src/pages/LogIn.jsx
 */


import { useState, useRef, useEffect, useContext } from 'react'
import { WSContext } from '../state/WSContext'
import { GameContext } from '../state/GameContext'


export default function LogIn({ name }) {
  const {
    user_name,
    socketIsOpen,
    trackMessage
  } = useContext(WSContext)
  const { setJSON } = useContext(GameContext)

  const [ userName, setUserName ] = useState(name || user_name)
  
  const inputRef = useRef()


  const updateUserName = ({ target }) => {
    setUserName(target.value)
  }


  const login = event => {
    event.preventDefault()
    loginWith(userName)
  }


  const loginWith = userName => {
    const message = {
      subject: "LOGIN",
      user_name: userName
    }

    trackMessage(message, setGameObject)
    // First reply has subject LOGGED_IN, so user_name will be
    // set in WSContext

    // Second reply will be handled by setGameObject
  }


  const setGameObject = ({ game_object }) => {
    console.log("game_object:", game_object)
    setJSON(game_object)
  }


  const autoLogIn = () => {
    if (name) { 
      loginWith(name)
    }
  }

  
  useEffect(autoLogIn, [name])

  
  return (
    <div id="login">
      <h1>English Games</h1>

      <form>
        <span>Write your name:</span>
        <input
          ref={inputRef}
          type="text"
          autoFocus
          value={userName}
          onChange={updateUserName}
        />
        <button
          disabled={!socketIsOpen || !userName}
          onClick={login}
        >
          Let's Play!
        </button>
      </form>
    </div>
  )
}