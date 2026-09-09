/**
 * frontend/src/pages/GameWrapper.jsx
 * 
 * This component is always shown in the Outlet slot. What it
 * displays will depend on:
 * + A successful connection to the WebSocket server, meaning that
 *   userId is set. If not, the Throbber will show.
 * + A successful login meaning that the server has echoed back a
 *   user_name. If not, the LogIn page will show.
 */


import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'

import { WSContext } from '../state/WSContext'
import Throbber from '../components/Throbber'
import LogIn from './LogIn'
import Memory from './Memory'



export default function GameWrapper() {
  const { name } = useParams()

  const [ Activity, setActivity ] = useState(() => Throbber)
  
  const {
    userId,
    user_name,
  } = useContext(WSContext)


  // console.log("name:", name)
  // console.log("user_name:", user_name)



  const loadActivity = () => {
    if (!userId) {
      setActivity(() => Throbber)
    } else if (!user_name) {
      setActivity(() => LogIn)
    } else {
      setActivity(() => Memory)
    }
  }


  useEffect(loadActivity, [userId, user_name])


  return (
    <div id="main">
      <Activity name={name} />
    </div>
  )
}