/**
 * frontend/src/components/Ping.jsx
 */


import React, { useState, useContext } from 'react'
import { APIContext } from '../logic/APIContext'
const TAG_REGEX = /(<.*?>)|(<\/.*?>)/g



export const Ping = () => {
  const { origin } = useContext(APIContext)
  const [ response, setResponse ] = useState("")

  const getPing = () => {
    fetch(`${origin}/ping`)
      .then(incoming => incoming.text())
      // Always sanitize data from unreliable sources
      .then(text => text.replace(TAG_REGEX, ""))
      .then(text => setResponse(text))
      .catch(error => setResponse(error.message))
  }

  return (
    <>
      <button
        onClick={getPing}
      >
        GET /ping
      </button>
      <pre>
        {response}
      </pre>
    </>
  )
}