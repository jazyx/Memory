/**
 * frontend/src/pages/Tabs.jsx
 */


import { useContext } from 'react'
import { WSContext } from '../state/WSContext'
import { GameContext } from '../state/GameContext'


export default function Tabs() {
  const { sendMessage, user_name } = useContext(WSContext)
  const { json, role } = useContext(GameContext)


  const newGame = () => {
    const message = {
      subject: "NEW_GAME"
    }

    sendMessage(message)
  }


  const display = (role)
    ? <button
        onClick={newGame}
      >
        New Game
      </button>
    : <p>{json.game}</p>


  return (
    <div id="tabs">
      {display}
    </div>
  )
}