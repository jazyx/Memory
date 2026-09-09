/**
 * frontend/src/pages/Home.jsx
 */


import { useRef, useEffect, useContext } from 'react'
import '../css/home.css'
import { WSContext } from '../logic/WSContext'


export default function Home() {
  const {
    userId,
    user_name,
    socketIsOpen,
    socketError,
    requestSocket,
    treatMessageListener,
    sendMessage
  } = useContext(WSContext)
  const inputRef = useRef()


  function autoFocus() {
    inputRef.current.focus()
  }

  function openWS(param) {  
    if (!socketIsOpen) {
      requestSocket()

    } else {
      console.log("userId:", userId)
    }
  }

  useEffect(autoFocus, [])
  useEffect(openWS, [socketIsOpen])

  return (
    <div id="home">
      <h1>English Games</h1>

      <form>
        <span>Write your name:</span>
        <input
          ref={inputRef}
          type="text"
          autofocus
        />
        <button
          disabled={!socketIsOpen}
        >
          Let's Play!
        </button>
      </form>
    </div>
  )
}