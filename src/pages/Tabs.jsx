/**
 * frontend/src/pages/Tabs.jsx
 */


import { useState, useEffect, useContext } from 'react'
import { WSContext } from '../state/WSContext'
import { GameContext } from '../state/GameContext'


export default function Tabs() {
  const { sendMessage, user_name } = useContext(WSContext)
  const { json, role } = useContext(GameContext)
  const [ theme, setTheme ] = useState(json.theme || "")


  const selectTheme = ({ target }) => {
    setTheme(target.value)
  }


  const newGame = () => {
    const message = {
      subject: "NEW_GAME",
      theme
    }

    sendMessage(message)
  }


  const options = json.themes?.map(theme => (
    <option
      key={theme}
    >
      {theme}
    </option>
  ))


  const display = (true) // (role)
    ? <button
        onClick={newGame}
      >
        New Game
      </button>
    : <p>{json.game}</p>


  const setTopic = () => {
    if (json.theme) {
      setTheme(json.theme)
    }
  }


  useEffect(setTopic, [json])


  return (
    <div id="tabs">
      <select
        value={theme}
        onChange={selectTheme}
      >
        {options}
      </select>
      {display}
    </div>
  )
}