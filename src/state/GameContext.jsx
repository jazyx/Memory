/**
 * frontend/src/state/GameContext.jsx
 *
 * description
 */


import {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react'
import { WSContext } from './WSContext'


export const GameContext = createContext()


export const GameProvider = ({ children }) => {
  const { treatMessageListener } = useContext(WSContext)
  const [ json, setJSON ] = useState({})


  const newGame = ({game_object}) => {
    setJSON(game_object)
  }


  const listenForNewGame = () => {
    treatMessageListener(
      "add",
      [
        { subject: "NEW_GAME",
          callback: newGame
        }
      ]
    )
  }


  useEffect(listenForNewGame, [])


  return (
    <GameContext.Provider
      value ={{
        json,
        setJSON
      }}
    >
      {children}
    </GameContext.Provider>
  )
}


export default {
  label: "Game",
  Context: GameContext,
  Provider: GameProvider
}
