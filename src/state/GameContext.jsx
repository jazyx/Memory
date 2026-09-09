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
  const [ role, setRole ] = useState()
  


  const setGameObject = ({game_object}) => {
    setJSON(game_object)
    // console.log("game_object", JSON.stringify(game_object, null, '  '));
  }


  const listenForNewGame = () => {
    treatMessageListener(
      "add",
      [
        { subject: "GAME_OBJECT",
          callback: setGameObject
        }
      ]
    )
  }


  useEffect(listenForNewGame, [])


  return (
    <GameContext.Provider
      value ={{
        json,
        setJSON,
        role,
        setRole
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
