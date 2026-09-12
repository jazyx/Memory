/**
 * frontend/src/state/GameContext.jsx
 *
 * description
 */


import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef
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




  // console.log("GameContext user_name:", user_name)
  

  const confirmConnection = ({ recipient_id }) => {
    // console.log("confirmConnection - recipient_id:", recipient_id, ", userId:", userId, ", user_name:", user_name)
    if (recipient_id !== userId && user_name) {
      // console.log("Logging in again")
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
    const listeners = [
      { subject: "CONNECTION",
        callback: confirmConnection
      },
      { subject: "GAME_OBJECT",
        callback: setGameObject
      }
    ]
    
    treatMessageListener("add", listeners)
      
    return (() => {
      // console.log("Cleaning up listenForNewGame")
      treatMessageListener("delete", listeners)
    })
  }


  useEffect(listenForNewGame, [userId, user_name])


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
