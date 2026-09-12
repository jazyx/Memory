/**
 * frontend/src/state/index.jsx
 *
 * description
 */


import { APIProvider, APIContext } from './APIContext'
import { WSProvider, WSContext } from'./WSContext'
import { GameProvider, GameContext } from'./GameContext'
import {
  CarouselProvider,
  CarouselContext
} from'./CarouselContext'


const Provider = ({ children }) => {
  return (
    <APIProvider>
      <WSProvider>
        <GameProvider>
          <CarouselProvider>
            {children}
          </CarouselProvider>
        </GameProvider>
      </WSProvider>
    </APIProvider>
  )
}


export {
  Provider,
  APIContext,
  WSContext,
  GameContext,
  CarouselContext
}