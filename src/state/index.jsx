/**
 * frontend/src/state/index.jsx
 *
 * description
 */


import { APIProvider, APIContext } from './APIContext'
import { WSProvider, WSContext } from'./WSContext'
import { GameProvider, GameContext } from'./GameContext'


const Provider = ({ children }) => {
  return (
    <APIProvider>
      <WSProvider>
        <GameProvider>
          {children}
        </GameProvider>
      </WSProvider>
    </APIProvider>
  )
}


export {
  Provider,
  APIContext,
  WSContext,
  GameContext
}