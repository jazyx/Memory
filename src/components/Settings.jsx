/**
 * frontend/src/components/Settings.jsx
 *
 * Allows the teacher to:
 *  + Remove a player
 *  + Pass the turn to the player
 *  + Allow the player to peek at names on the backs of the cards
 */


import { useContext } from 'react'
import { WSContext } from '../state/WSContext'


export default function Settings(props) {
  const { name, peek, className, close } = props
  const { sendMessage } = useContext(WSContext)

  const removePlayer = () => {
    sendMessage({
      subject: "REMOVE_PLAYER",
      name
    })
    close()
  }

  const activatePlayer = () => {
    sendMessage({
      subject: "ACTIVATE_PLAYER",
      name
    })
    close()
  }

  const allowPeeking = () => {
    sendMessage({
      subject: "ALLOW_PEEKING",
      name,
      peek: !peek
    })
    close()
  }


  const peekTitle = peek
    ? "✅ Peek"
    : "❌ Peek"

  return (
    <div className={className}>
      <button
        onClick={removePlayer}
      >
        Remove
      </button>
      <button
        onClick={activatePlayer}
      >
        Activate
      </button>
      <button
        onClick={allowPeeking}
      >
        {peekTitle}
      </button>
    </div>
  )
}