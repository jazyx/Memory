/**
 * frontend/src/state/GameContext.jsx
 *
 * description
 */


import React, { createContext, useState } from 'react'


export const GameContext = createContext()


export const GameProvider = ({ children }) => {
  const [ json, setJSON ] = useState({})

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
