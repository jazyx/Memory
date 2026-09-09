/**
 * frontend/logic/APIContext.jsx
 */


import { createContext } from 'react'

const ORIGIN = import.meta.env.VITE_ORIGIN
const dev = /^localhost:517\d$/.test(window.location.host)
const origin = dev ? ORIGIN : ""


export const APIContext = createContext()


export const APIProvider = ({ children }) => {

  return (
    <APIContext.Provider
      value ={{
        origin
      }}
    >
      {children}
    </APIContext.Provider>
  )
}