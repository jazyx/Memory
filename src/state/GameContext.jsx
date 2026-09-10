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
  const {
    treatMessageListener,
    userId,
    user_name,
    sendMessage
  } = useContext(WSContext)
  const [ json, setJSON ] = useState({})
  const [ role, setRole ] = useState()
  

  const confirmConnection = ({ recipient_id }) => {
    console.log("confirmConnection - recipient_id:", recipient_id, ", userId:", userId, ", user_name:", user_name)
    if (recipient_id !== userId && user_name) {
      console.log("Logging in again")
      sendMessage({
        subject: "LOGIN",
        user_name
      })
    }
  }


  const setGameObject = ({game_object}) => {
    setJSON(game_object)
    // console.log("game_object", JSON.stringify(game_object, null, '  '));
  }


  const listenForNewGame = () => {
    treatMessageListener(
      "add",
      [
        { subject: "CONNECTION",
          callback: confirmConnection
        },
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
