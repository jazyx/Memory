/**
 * src/pages/Frame.jsx
 *
 * <Frame> is mounted by default. This initializes a WebSocket
 * connection, so the component in Outlet should have access to
 * WSContext.userId after the connection opens.
 *
 * The component displayed in Outlet will depend on the connection
 * and logged-in state.
 */

import { useEffect, useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { WSContext } from '../state/WSContext'
import Tabs from './Tabs'

import '../css/frame.css'



export default function Frame() {
  const {
    socketIsOpen,
    requestSocket
  } = useContext(WSContext)


  function openWS() {
    console.log("openWS() socketIsOpen:", socketIsOpen)

    if (!socketIsOpen) {
      console.log("Requesting socket...")
      requestSocket()
    }
  }


  useEffect(openWS, [socketIsOpen])


  return (
    <div id="frame">
      <Tabs />
      <Outlet />
    </div>
  )
}