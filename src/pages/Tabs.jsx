/**
 * frontend/src/pages/Tabs.jsx
 */


import { useContext } from 'react'
import { WSContext } from '../state/WSContext'
import { GameContext } from '../state/GameContext'


export default function Tabs() {
  const { sendMessage } = useContext(WSContext)
  const { setJSON } = useContext(GameContext)



  const newGame = () => {
    const message = {
      subject: "NEW_GAME"
    }

    sendMessage(message)
  }


  return (
    <div id="tabs">
      <button
        onClick={newGame}
      >
        New Game
      </button>
    </div>
  )
}